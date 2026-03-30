ALTER PROCEDURE [dbo].[sp_get_booking_allotment_data]
    @BookingID VARCHAR(50) = NULL,
    @AllotmentStatus INT = NULL,
    @PageNumber INT = 1,
    @CompanyID INT = 0,
    @PageSize INT = 10,
    @PartyID INT = NULL,
    @BookingDate DATE = NULL,
    @SearchValue NVARCHAR(100) = NULL,
    @IsVendor BIT = 0, -- Kept param for compatibility but not used for filtering
    @TotalCount INT OUT,
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

        IF @BookingID IS NULL
        BEGIN
            -- Get Total Count
            SELECT @TotalCount = COUNT(*)
            FROM [dbo].[BookingBusAllotment] bba
            LEFT JOIN [dbo].[BookingHead] bh ON bba.BookingID = bh.BookingNo
            LEFT JOIN [dbo].[PartyMast] pm ON bh.PartyID = pm.id
            LEFT JOIN [dbo].[DriverMast] dm ON bba.DriverID = dm.id
            WHERE bba.CompanyID = @CompanyID
              AND (@AllotmentStatus IS NULL OR bba.BusAllotmentStatus = @AllotmentStatus)
              AND (@PartyID IS NULL OR bh.PartyID = @PartyID)
              AND (@BookingDate IS NULL OR CAST(bh.BookingDate AS DATE) = @BookingDate)
              AND (@SearchValue IS NULL OR (
                   bba.BookingID LIKE '%' + @SearchValue + '%' OR
                   bh.ContactPersonName LIKE '%' + @SearchValue + '%' OR
                   bba.BusNo LIKE '%' + @SearchValue + '%' OR
                   dm.driverName LIKE '%' + @SearchValue + '%'
              ));

            -- Get Paginated Data
            SELECT
                t.*,
                bba.BookingID as BookingNo,
                bba.BookingTranID,
                bba.VendorID,
                bba.BusID,
                bba.BusTypeID,
                bba.BusNo AS reg_no,
                bba.SittingCapacity,
                bba.PurRate,
                bba.DriverID,
                bba.reportTime,
                bba.DriverContactNo,
                bba.HelperID,
                bba.GarageOutTime,
                bba.UserID,
                bba.CreateDate,
                bba.BusAllotmentStatus,
                bba.SiteID,
                dm.driverName,
                hm.helperName,
                BM.busName,
                bc.BusCategory AS BusTypeName,
                pm.PartyName,
                bh.ContactPersonName,
                bh.ContactPersonNo,
                bh.ReportAddr,
                bh.Email,
                bh.PaymentTerms,
                bh.GSTInclude,
                ISNULL((
                    SELECT TOP 1 RefInvoiceNo
                    FROM InvoiceTran it 
                    LEFT JOIN InvoiceHead ih ON it.InvHeadSlNo = ih.InvNo
                    CROSS APPLY STRING_SPLIT(it.BookingID, ',') AS split
                    WHERE LTRIM(RTRIM(split.value)) = CAST(bba.BookingID AS VARCHAR)
                    AND it.CompanyID = @CompanyID
                ), '') AS UsedInInvoice
            FROM (
                SELECT bba.ID, ROW_NUMBER() OVER (ORDER BY bba.ID DESC) AS RowNum
                FROM [dbo].[BookingBusAllotment] bba
                LEFT JOIN [dbo].[BookingHead] bh ON bba.BookingID = bh.BookingNo
                LEFT JOIN [dbo].[PartyMast] pm ON bh.PartyID = pm.id
                LEFT JOIN [dbo].[DriverMast] dm ON bba.DriverID = dm.id
                WHERE bba.CompanyID = @CompanyID
                  AND (@AllotmentStatus IS NULL OR bba.BusAllotmentStatus = @AllotmentStatus)
                  AND (@PartyID IS NULL OR bh.PartyID = @PartyID)
                  AND (@BookingDate IS NULL OR CAST(bh.BookingDate AS DATE) = @BookingDate)
                  AND (@SearchValue IS NULL OR (
                       bba.BookingID LIKE '%' + @SearchValue + '%' OR
                       bh.ContactPersonName LIKE '%' + @SearchValue + '%' OR
                       bba.BusNo LIKE '%' + @SearchValue + '%' OR
                       dm.driverName LIKE '%' + @SearchValue + '%'
                  ))
            ) t
            JOIN [dbo].[BookingBusAllotment] bba ON t.ID = bba.ID
            LEFT JOIN [dbo].[BookingHead] bh ON bba.BookingID = bh.BookingNo
            LEFT JOIN [dbo].[PartyMast] pm ON bh.PartyID = pm.id
            LEFT JOIN [dbo].[BusCategory] bc ON bba.[BusTypeID] = bc.[id]
            LEFT JOIN [dbo].[DriverMast] dm ON bba.DriverID = dm.id
            LEFT JOIN [dbo].[HelperMast] hm ON bba.HelperID = hm.id
            LEFT JOIN [dbo].[BusMast] BM ON bba.BusID = BM.id
            WHERE t.RowNum BETWEEN @StartRow AND @EndRow
            ORDER BY t.RowNum;

            SET @StatusID = 1;
            SET @StatusMessage = 'Success';
        END
        ELSE IF @AllotmentStatus != 0 AND @BookingID IS NOT NULL
        BEGIN
             -- Specific Status View (Likely Alloted View)
            SELECT 
                bba.[ID],
                bba.[BookingID],
                bba.[BookingTranID],
                bba.[VendorID],
                bba.[BusID],
                bc.[BusCategory] AS [BusTypeName],
                bba.[BusTypeID],
                bba.[BusNo],
                bba.[SittingCapacity],
                bba.[PurRate],
                bba.[DriverID],
                bba.[reportTime],
                bba.[DriverContactNo],
                bba.[HelperID],
                bba.[GarageOutTime],
                bba.[UserID],
                bba.[CreateDate],
                -- bba.[VendorDriverName], -- User removed this in diffs, assuming they don't want it selected or it errors
                bba.[TripType],
                bba.[BusAllotmentStatus],
                dm.driverName,
                hm.helperName,
                BM.busName,
                bt.[TripStartDate],
                bt.[TripEndDate],bba.[SiteID] 
            FROM [dbo].[BookingBusAllotment] bba
            LEFT JOIN [dbo].[BusCategory] bc ON bba.[BusTypeID] = bc.[id]
            LEFT JOIN [dbo].[DriverMast] dm ON bba.DriverID = dm.id
            LEFT JOIN [dbo].[HelperMast] hm ON bba.HelperID = hm.id
            LEFT JOIN [dbo].[BusMast] BM ON bba.BusID = BM.id
            LEFT JOIN [dbo].[BookingTran] bt ON bba.BookingTranID = bt.ID
            WHERE bba.[BusAllotmentStatus] = @AllotmentStatus 
              AND bba.[BookingID] = @BookingID 
              AND bba.[CompanyID] = @CompanyID;
        END
        ELSE IF @BookingID IS NOT NULL AND @AllotmentStatus = 0
        BEGIN
            -- All Allotments for Booking (The list view inside the drawer)
            SELECT 
                bba.[ID],
                bba.[BookingID],
                bba.[BookingTranID],
                bba.[VendorID],
                bba.[BusID],
                bc.[BusCategory] AS [BusTypeName],
                bba.[BusTypeID],
                bba.[BusNo],
                bba.[SittingCapacity],
                bba.[PurRate],
                bba.[DriverID],
                bba.[reportTime],
                bba.[DriverContactNo],
                bba.[HelperID],
                bba.[GarageOutTime],
                bba.[UserID],
                bba.[CreateDate],
                -- bba.[VendorDriverName], -- Removing strict selection
                bba.[TripType],
                bba.[BusAllotmentStatus],
                dm.driverName,
                hm.helperName,
                BM.busName,
                bt.[TripStartDate],
                bt.[TripEndDate],
				bba.[SiteID]
            FROM [dbo].[BookingBusAllotment] bba
            LEFT JOIN [dbo].[BusCategory] bc ON bba.[BusTypeID] = bc.[id]
            LEFT JOIN [dbo].[DriverMast] dm ON bba.DriverID = dm.id
            LEFT JOIN [dbo].[HelperMast] hm ON bba.HelperID = hm.id
            LEFT JOIN [dbo].[BusMast] BM ON bba.BusID = BM.id
            LEFT JOIN [dbo].[BookingTran] bt ON bba.BookingTranID = bt.ID
            WHERE bba.[BookingID] = @BookingID 
              AND bba.[CompanyID] = @CompanyID;
              -- Removed IsVendor filter to return data regardless of mode

            SET @TotalCount = @TotalCount;
            SET @StatusID = 1;
            SET @StatusMessage = 'Success';
        END

    END TRY
    BEGIN CATCH
        SET @StatusID = ERROR_NUMBER();
        SET @StatusMessage = 'Error: ' + ERROR_MESSAGE();
        SET @TotalCount = 0;
    END CATCH
END