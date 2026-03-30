USE [ChohanTravel];
GO

SET ANSI_NULLS ON

SET QUOTED_IDENTIFIER ON

ALTER PROCEDURE [dbo].[sp_insert_or_update_booking_Entry]
    @PartyID BIGINT,
    @BookingNo VARCHAR(50) = '1',
    @BookingDate varchar(50),
    @ContactPersonName VARCHAR(50),
    @ContactPersonNo VARCHAR(150),
	@GSTInclude varchar(20) ,
    @Address VARCHAR(MAX),
    @Email VARCHAR(100),
    @PaymentTerms VARCHAR(50),
	@CompanyID int=0,
	@PermitReq varchar(5),
    @localBookingList NVARCHAR(MAX),
    @StatusID INT OUT,
    @StatusMessage NVARCHAR(200) OUT,
    @TotalCount INT OUT
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;

    BEGIN TRY
        DECLARE @json NVARCHAR(MAX);
		DECLARE @BOOKING_ID VARCHAR(50)
        -- Use MERGE to insert or update data into BookingHead table
        MERGE [dbo].[BookingHead] AS TARGET
        USING (
            VALUES (
                @BookingNo,
                @BookingDate,
                @PartyID,
                @Address,
                @ContactPersonName,
                @ContactPersonNo,
				@Email,
				@PaymentTerms,
				@PermitReq,
				@GSTInclude
            )
        ) AS SOURCE (BookingNo, BookingDate, PartyID, ReportAddr, ContactPersonName, ContactPersonNo,Email ,PaymentTerms,	PermitReq,
GSTInclude)
        ON TARGET.BookingNo = SOURCE.BookingNo
        WHEN MATCHED THEN
            UPDATE SET
                BookingDate = SOURCE.BookingDate,
                PartyID = SOURCE.PartyID,
                ReportAddr = SOURCE.ReportAddr,
                ContactPersonName = SOURCE.ContactPersonName,
                ContactPersonNo = SOURCE.ContactPersonNo,
				Email = SOURCE.Email,
				PaymentTerms = @PaymentTerms,
				[GSTInclude] = @GSTInclude,
				PermitReq=	@PermitReq


        WHEN NOT MATCHED THEN
            INSERT (BookingNo, BookingDate, PartyID, ReportAddr, ContactPersonName, ContactPersonNo,Email,PaymentTerms,GSTInclude,PermitReq,CompanyID)
            VALUES (SOURCE.BookingNo, SOURCE.BookingDate, SOURCE.PartyID, SOURCE.ReportAddr, SOURCE.ContactPersonName, SOURCE.ContactPersonNo,SOURCE.Email,SOURCE.PaymentTerms,SOURCE.GSTInclude,SOURCE.PermitReq,@CompanyID);

        SET @BOOKING_ID = @@ROWCOUNT;
        SET @StatusID = 1;
        SET @StatusMessage = 'Booking head inserted or updated successfully.';
		delete from [BookingBusAllotment] where BookingID=@BookingNo

        -- Use MERGE to insert or update data into BookingTran table
        MERGE [dbo].[BookingTran] AS TARGET
        USING (
            SELECT
			    BTR.ID,
                BH.[BookingNo] AS BookingID,
                BTR.[busType],
                BTR.[sittingCapacity],
                BTR.[TripDesc],
                BTR.[ReportDate],
                BTR.[tripEndDate],
                BTR.[rate],
                BTR.[amount],
                BTR.[reportTime],
				BTR.[ReturnTime],
                BTR.[BusQty],
				BTR.[RateType],
                BTR.[includeGST],
                BTR.[hours],
                BTR.[kms],
                BTR.[rate2],
                BTR.[extraHourRate],
                BTR.[extraKMRate]
            FROM [dbo].[BookingHead] BH
            INNER JOIN OPENJSON(@localBookingList)
                WITH (
                    ID INT '$.ID',
                    busType INT '$.BusTypeID',
					TripDesc NVARCHAR(MAX) '$.tripDescription',

                    sittingCapacity INT '$.sittingCapacity',
                    ReportDate datetime  '$.ReportDate',
					tripEndDate Datetime '$.tripEndDate',
					rate MONEY '$.rate',
					amount MONEY '$.Amt',
                    reportTime datetime '$.reportTime',
					 ReturnTime datetime '$.ReturnTime',
                    BusQty INT '$.busQty',
                    RateType NVARCHAR(MAX) '$.rateType',
                    hours FLOAT '$.hours',
                    rate2 MONEY '$.rate2',
                    extraHourRate MONEY '$.extraHourRate',
                    includeGST VARCHAR(1) '$.includeGST',
                    kms FLOAT '$.kms',
                    extraKMRate MONEY '$.extraKMRate'
                ) BTR ON BH.BookingNo = @BookingNo
        ) AS SOURCE
        ON TARGET.ID = SOURCE.ID 
        WHEN MATCHED THEN
            UPDATE SET
                BusTypeID = isnull(SOURCE.BusType,BusTypeID),
                SittingCapacity = SOURCE.SittingCapacity,
                TripDesc = SOURCE.TripDesc,
                TripStartDate = cast(SOURCE.ReportDate as Date),
                TripEndDate = cast(SOURCE.TripEndDate as date),
                Rate = SOURCE.Rate,
                Amt = SOURCE.amount,
                ReportingTime = SOURCE.reportTime,
				ReturnTime=SOURCE.ReturnTime,
                BusQty = SOURCE.BusQty,
                RateType = SOURCE.RateType,
                GSTIncluded = SOURCE.includeGST,
                DutyHours = SOURCE.hours,
                DutyKM = SOURCE.kms,
                Rate2 = SOURCE.Rate2,
                ExtraHourRate = SOURCE.ExtraHourRate,
                ExtraKMRate = SOURCE.ExtraKMRate
        WHEN NOT MATCHED THEN
            INSERT (BookingID, BusTypeID, SittingCapacity, TripDesc, TripStartDate, TripEndDate, Rate, Amt,
			ReportingTime, ReturnTime,BusQty, RateType, GSTIncluded, DutyHours, DutyKM, Rate2, 
			ExtraHourRate, ExtraKMRate,CompanyID)
            VALUES (@BookingNo, SOURCE.BusType, SOURCE.SittingCapacity, SOURCE.TripDesc,
			cast(SOURCE.ReportDate as date), 
			cast(SOURCE.TripEndDate as date), 
			SOURCE.Rate, SOURCE.amount, SOURCE.reportTime,SOURCE.ReturnTime,
			SOURCE.BusQty, SOURCE.RateType, SOURCE.includeGST, SOURCE.hours, SOURCE.kms,
			SOURCE.Rate2, SOURCE.ExtraHourRate, SOURCE.ExtraKMRate,@CompanyID);

   
			iNSERT INTO [dbo].[BookingBusAllotment]
           ([BookingID]
           ,[BookingTranID]
           ,[BusTypeID]
           ,[SittingCapacity]
           ,[PurRate]
           ,[UserID]
           ,[CreateDate]
		   ,CompanyID)
    SELECT
    BT.BookingID,
    BT.ID,
    BT.BusTypeID,
    BT.SittingCapacity,
    BT.Rate,1,GETDATE(),@CompanyID 
 
FROM
    [BookingTran] BT
	LEFT JOIN
       ( SELECT ROW_NUMBER() OVER (ORDER BY (SELECT NULL)) AS Number
    FROM sys.columns) N ON N.Number <= BT.BusQty

WHERE
    BT.BookingID = @BookingNo
        SET @StatusID = 1;
        SET @StatusMessage = 'Booking transaction(s) inserted or updated successfully.';
    END TRY
    BEGIN CATCH
        -- Handle errors
        SET @StatusID = ERROR_NUMBER();
        SET @StatusMessage = 'Error: ' + ERROR_MESSAGE();
        SET @TotalCount = 0;
    END CATCH

-- Update derived counts and amounts in BookingHead
UPDATE BookingHead 
SET BusQty = sub.TotalBusQty,
    TotalAmount = sub.TotalAmt
FROM (
    SELECT BookingID, SUM(BusQty) AS TotalBusQty, SUM(Amt) AS TotalAmt
    FROM BookingTran 
    WHERE BookingID = @BookingNo 
    GROUP BY BookingID
) AS sub 
WHERE BookingHead.BookingNo = sub.BookingID 
  AND BookingHead.BookingNo = @BookingNo;

UPDATE BookingHead SET AllotBusQty = 0 WHERE BookingNo = @BookingNo;

UPDATE BookingHead 
SET AllotBusQty = isnull(sub.TotalBusQty,0)
FROM (
    SELECT BookingID, Count(Busno) AS TotalBusQty 
    FROM BookingBusAllotment 
    WHERE BookingID = @BookingNo AND isnull(BusNo,'') <> '' 
    GROUP BY BookingID
) AS sub 
WHERE BookingHead.BookingNo = sub.BookingID 
  AND BookingHead.BookingNo = @BookingNo;

END