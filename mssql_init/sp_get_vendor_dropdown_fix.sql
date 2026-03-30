ALTER PROCEDURE [dbo].[sp_get_vendor_dropdown]
    @CompanyID INT = 0,
    @StatusID INT OUT,
    @StatusMessage NVARCHAR(200) OUT,
    @TotalCount INT OUT
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;

    BEGIN TRY
        SELECT 
            [id],
            [vendorName]
        FROM 
            [dbo].[VendorMast]
        -- WHERE 
        --     (@CompanyID = 0 OR [companyID] = @CompanyID)
        --     AND [vendorActive] = 1
        ORDER BY 
            [vendorName];

        SET @StatusID = 1;
        SET @StatusMessage = 'Success';
        SET @TotalCount = @@ROWCOUNT; 

    END TRY
    BEGIN CATCH
        SET @StatusID = ERROR_NUMBER();
        SET @StatusMessage = ERROR_MESSAGE();
        SET @TotalCount = 0;
    END CATCH
END