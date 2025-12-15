CREATE OR ALTER PROCEDURE [dbo].[sp_get_booking_head_data]
    @PageNo INT = 1,
    @PageSize INT = 10,
    @CompanyID INT = 0,
    @ClosedStatus INT = NULL,
    @PartyID INT = NULL,
    @BookingDate DATE = NULL,
    @SearchValue NVARCHAR(100) = NULL,
    @TotalCount INT OUT,
    @StatusID INT OUT,
    @StatusMessage NVARCHAR(200) OUT
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;

    DECLARE @StartRow INT, @EndRow INT;
    SET @StartRow = (@PageNo - 1) * @PageSize + 1;
    SET @EndRow = @PageNo * @PageSize;

    BEGIN TRY
        -- Calculate Total Count with Filters
        SELECT @TotalCount = COUNT(*) 
        FROM [dbo].[BookingHead] BH
        WHERE CompanyID = @CompanyID
          AND (@ClosedStatus IS NULL OR [closedStatus] = @ClosedStatus)
          AND (@PartyID IS NULL OR PartyID = @PartyID)
          AND (@BookingDate IS NULL OR CAST(BookingDate AS DATE) = @BookingDate)
          AND (@SearchValue IS NULL OR 
               BH.BookingNo LIKE '%' + @SearchValue + '%' OR 
               BH.ContactPersonName LIKE '%' + @SearchValue + '%' OR
               BH.PartyID IN (SELECT id FROM PartyMast WHERE PartyName LIKE '%' + @SearchValue + '%')
          );

        -- Fetch Paginated Data
        SELECT 
            PaginatedBookingHead.[ID],
            PaginatedBookingHead.[BookingNo],
            PaginatedBookingHead.[BookingDate],
            PaginatedBookingHead.[PartyID],
            PaginatedBookingHead.[ReportDate],
            PaginatedBookingHead.[ReportTime],
            PaginatedBookingHead.[ReportAddr],
            PaginatedBookingHead.[ContactPersonName],
            PaginatedBookingHead.[ContactPersonNo],
            PM.[PartyName],
            PaginatedBookingHead.[Email],
            PaginatedBookingHead.[PaymentTerms],
            PaginatedBookingHead.[GSTInclude],
            PaginatedBookingHead.[closedStatus],
            PaginatedBookingHead.PermitReq,
            PaginatedBookingHead.AllotBusQty,
            PaginatedBookingHead.BusQty,
            PaginatedBookingHead.UsedInInvoice
        FROM (
            SELECT 
                ROW_NUMBER() OVER (ORDER BY [BookingDate] DESC, [ID] DESC) AS RowNumber,
                [ID],
                [BookingNo],
                [BookingDate],
                [PartyID],
                [ReportDate],
                [ReportTime],
                [ReportAddr],
                [ContactPersonName],
                [ContactPersonNo],
                [Email],
                [PaymentTerms],
                [GSTInclude],
                [closedStatus],
                PermitReq,
                AllotBusQty,
                BusQty,
                ISNULL((
                    SELECT TOP 1 RefInvoiceNo
                    FROM InvoiceTran it 
                    LEFT JOIN InvoiceHead ih ON it.InvHeadSlNo = ih.InvNo
                    CROSS APPLY STRING_SPLIT(it.BookingID, ',') AS split
                    WHERE LTRIM(RTRIM(split.value)) = CAST(BookingHead.BookingNo AS VARCHAR)
                    AND it.CompanyID = @CompanyID
                ), '') AS UsedInInvoice
            FROM [dbo].[BookingHead] 
            WHERE CompanyID = @CompanyID
              AND (@ClosedStatus IS NULL OR [closedStatus] = @ClosedStatus)
              AND (@PartyID IS NULL OR PartyID = @PartyID)
              AND (@BookingDate IS NULL OR CAST(BookingDate AS DATE) = @BookingDate)
              AND (@SearchValue IS NULL OR 
                   BookingNo LIKE '%' + @SearchValue + '%' OR 
                   ContactPersonName LIKE '%' + @SearchValue + '%' OR
                   PartyID IN (SELECT id FROM PartyMast WHERE PartyName LIKE '%' + @SearchValue + '%')
              )
        ) AS PaginatedBookingHead
        LEFT JOIN [dbo].[PartyMast] PM ON PaginatedBookingHead.PartyID = PM.id
        WHERE PaginatedBookingHead.RowNumber BETWEEN @StartRow AND @EndRow 
        ORDER BY PaginatedBookingHead.RowNumber;

        SET @StatusID = 1;
        SET @StatusMessage = 'Success';
    END TRY
    BEGIN CATCH
        SET @StatusID = ERROR_NUMBER();
        SET @StatusMessage = 'Error: ' + ERROR_MESSAGE();
        SET @TotalCount = 0;
    END CATCH
END