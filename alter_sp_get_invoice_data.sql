ALTER PROCEDURE [dbo].[sp_get_invoice_data]
    @PageNumber INT,
    @PageSize INT,
    @CompanyID INT = 0,
    @TotalCount INT OUT,
    @InvNo VARCHAR(50) = NULL,
    @PartyID INT = NULL,
    @InvoiceDate DATE = NULL,
    @SearchValue NVARCHAR(100) = NULL,
    @StatusID INT OUT,
    @StatusMessage NVARCHAR(200) OUT
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;

    DECLARE @StartRow INT, @EndRow INT;
    SET @StartRow = (@PageNumber - 1) * @PageSize + 1;
    SET @EndRow = @PageNumber * @PageSize;

    BEGIN TRY
        IF @InvNo IS NULL
        BEGIN
            -- Get total count of records with filters
            SELECT @TotalCount = COUNT(*) 
            FROM [dbo].[InvoiceHead] PH
            LEFT JOIN [dbo].[PartyMast] PM ON PH.PartyName = PM.[id]
            LEFT JOIN [BookingHead] bH ON BH.ProformaInvoiceID = PH.ID
            LEFT JOIN CompanyMast C ON C.Name = PH.companyname
            WHERE (@CompanyID = 0 OR PH.CompanyID = @CompanyID)
              AND (@PartyID IS NULL OR PH.PartyName = @PartyID)
              AND (@InvoiceDate IS NULL OR CAST(PH.InvDate AS DATE) = @InvoiceDate)
              AND (@SearchValue IS NULL OR (
                   PH.InvNo LIKE '%' + @SearchValue + '%' OR
                   PH.companyname LIKE '%' + @SearchValue + '%' OR
                   PM.PartyName LIKE '%' + @SearchValue + '%' OR
                   PH.ContactPersonName LIKE '%' + @SearchValue + '%' OR
                   PH.ContactPersonNo LIKE '%' + @SearchValue + '%' OR
                   PH.Remarks LIKE '%' + @SearchValue + '%' OR
                   PH.RefInvoiceNo LIKE '%' + @SearchValue + '%'
              ));

            -- Retrieve paginated data
            SELECT *
            FROM (
                SELECT 
                    ROW_NUMBER() OVER (ORDER BY PH.[InvDate] DESC, PH.[ID] DESC) AS RowNumber,
                    PH.[ID],
                    [InvNo] AS invoiceNo,
                    [companyname] AS companyname,
                    [InvDate] AS invoiceDate,
                    PM.partyName,
                    PH.[ContactPersonName] AS contactPersonName,
                    PH.[ContactPersonNo] AS contactPersonNo,
                    [GrossAmount] AS grossAmount,
                    [NetAmount] AS netAmount,
                    [AdvAmount] AS advanceReceived,
                    AdvAmtPer,
                    PH.PermitReq,
                    Remarks,
                    PH.RefInvoiceNo,
                    IIF(bh.BookingNo IS NOT NULL, 'transferred', NULL) AS status,
                    ISNULL(PH.CompanyID, 0) AS COMPANY_ID
                FROM [dbo].[InvoiceHead] PH
                LEFT JOIN [dbo].[PartyMast] PM ON PH.PartyName = PM.[id]
                LEFT JOIN [BookingHead] bH ON BH.ProformaInvoiceID = PH.ID
                LEFT JOIN CompanyMast C ON C.Name = PH.companyname
                WHERE (@CompanyID = 0 OR PH.CompanyID = @CompanyID)
                  AND (@PartyID IS NULL OR PH.PartyName = @PartyID)
                  AND (@InvoiceDate IS NULL OR CAST(PH.InvDate AS DATE) = @InvoiceDate)
                  AND (@SearchValue IS NULL OR (
                       PH.InvNo LIKE '%' + @SearchValue + '%' OR
                       PH.companyname LIKE '%' + @SearchValue + '%' OR
                       PM.PartyName LIKE '%' + @SearchValue + '%' OR
                       PH.ContactPersonName LIKE '%' + @SearchValue + '%' OR
                       PH.ContactPersonNo LIKE '%' + @SearchValue + '%' OR
                       PH.Remarks LIKE '%' + @SearchValue + '%' OR
                       PH.RefInvoiceNo LIKE '%' + @SearchValue + '%'
                  ))
            ) AS PH
            WHERE RowNumber BETWEEN @StartRow AND @EndRow;

            -- Set status
            SET @StatusID = 1;
            SET @StatusMessage = 'Success';
        END
        ELSE IF @InvNo IS NOT NULL
        BEGIN
            BEGIN TRY
                -- Get total count of records
                SELECT @TotalCount = COUNT(*) FROM [dbo].[InvoiceHead] WHERE [InvNo] = @InvNo;

                -- Retrieve data
                SELECT 
                    PH.[ID] AS [PHID],
                    PH.[InvNo] AS invoiceNo,
                    PH.[companyname] AS companyname,
                    PH.[InvDate] AS invoiceDate,
                    PH.[PartyName] AS partyName,
                    PH.[ContactPersonName] AS contactPersonName,
                    PH.[PartyAddr] AS partyAddr,
                    PH.[ContactPersonNo] AS contactPersonNo,
                    PH.[GSTNo] AS GSTNo,
                    PH.[TollParkingAmt] AS tollParkingAmt,
                    PH.[GrossAmount] AS grossAmount,
                    PH.[CGSTPer] AS CGSTPer,
                    PH.[CGSTAmt] AS CGSTAmt,
                    PH.[SGSTPer] AS SGSTPer,
                    PH.[SGSTAmt] AS SGSTAmt,
                    PH.[IGSTPer] AS IGSTPer,
                    PH.[IGSTAmt] AS IGSTAmt,
                    PH.[RoundOff] AS roundOff,
                    PH.[NetAmount] AS netAmount,
                    PH.AdvAmtPer,
                    PH.PermitReq,
                    PH.Remarks,
                    GstType as GSTType,
                    PH.[AdvAmount] AS advAmount,
                    PH.RefInvoiceNo,
                
                    JSON_QUERY(
                        (SELECT 
                            [SlNo] AS SlNo,
                            [InvHeadSlNo],
                            bt.[BookingID],
                            BC.buscategory as busCategory,
                            bt.SittingCapacity,
                            bt.TripDesc,
                            bt.TripStartDate,
                            bt.TripEndDate,
                            bt.BusQty,
                            bt.Amt ,
                            bt.Rate 

                        FROM [dbo].[InvoiceTran] PT
                        LEFT JOIN BookingTran bt on bt.BookingID IN (SELECT value FROM STRING_SPLIT(pt.BookingID, ','))
                        LEFT JOIN [dbo].[BusCategory] BC ON bt.[BusTypeID]  = BC.[id]
                        WHERE [InvHeadSlNo] = PH.[InvNo] 
                        
                        FOR JSON PATH)
                    ) AS LocalProformaList
                FROM 
                    [dbo].[InvoiceHead] PH
                WHERE 
                    PH.[InvNo] = @InvNo;
                
                -- Set status
                SET @StatusID = 1;
                SET @StatusMessage = 'Success';
            END TRY
            BEGIN CATCH
                -- Handle errors
                SET @StatusID = ERROR_NUMBER();
                SET @StatusMessage = 'Error: ' + ERROR_MESSAGE();
                SET @TotalCount = 0;
            END CATCH
        END
    END TRY
    BEGIN CATCH
        -- Handle errors
        SET @StatusID = ERROR_NUMBER();
        SET @StatusMessage = 'Error: ' + ERROR_MESSAGE();
        SET @TotalCount = 0;
    END CATCH
END