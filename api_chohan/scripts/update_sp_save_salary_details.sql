CREATE OR ALTER PROCEDURE [dbo].[sp_save_salary_details]
(
    @json NVARCHAR(MAX),
    @UserId INT,
    @CompanyID INT = 0,
    @StatusID INT OUT,
    @StatusMessage NVARCHAR(200) OUT,
    @TotalCount INT OUT
)
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        BEGIN TRANSACTION;

        -- We'll use a cursor to iterate through the JSON array to handle identity linkage for children
        DECLARE @EmployeeCursor CURSOR;
        DECLARE @EmployeeJSON NVARCHAR(MAX);

        -- Temporary storage for current parent ID
        DECLARE @NewSalaryDetlID INT;

        -- Step 1: Reverse previous adjustments in AdvanceToStaffEntry before deleting
        UPDATE AS_ENT
        SET AS_ENT.AdvAdjusted = ISNULL(AS_ENT.AdvAdjusted, 0) - AD.AdjustAmt
        FROM [dbo].[AdvanceToStaffEntry] AS_ENT
        INNER JOIN [dbo].[Salary_AdvAdjDetl] AD ON AS_ENT.id = AD.AdvanceID
        INNER JOIN [dbo].[SalaryDetl] S ON AD.SalaryDetl_ID = S.id
        INNER JOIN OPENJSON(@json)
        WITH (
            empType NVARCHAR(50) '$.empType',
            empID INT '$.empID',
            SalaryMonth CHAR(2) '$.SalaryMonth',
            SalaryYear CHAR(4) '$.SalaryYear'
        ) D
        ON  S.empType = D.empType
        AND S.empID = D.empID
        AND S.SalaryMonth = D.SalaryMonth
        AND S.SalaryYear = D.SalaryYear
        AND S.CompanyID = @CompanyID;

        -- Step 2: Delete old detailed adjustments
        DELETE AD
        FROM [dbo].[Salary_AdvAdjDetl] AD
        INNER JOIN [dbo].[SalaryDetl] S ON AD.SalaryDetl_ID = S.id
        INNER JOIN OPENJSON(@json)
        WITH (
            empType NVARCHAR(50) '$.empType',
            empID INT '$.empID',
            SalaryMonth CHAR(2) '$.SalaryMonth',
            SalaryYear CHAR(4) '$.SalaryYear'
        ) D
        ON  S.empType = D.empType
        AND S.empID = D.empID
        AND S.SalaryMonth = D.SalaryMonth
        AND S.SalaryYear = D.SalaryYear
        AND S.CompanyID = @CompanyID;

        -- Step 3: Delete old main salary records
        DELETE S
        FROM [dbo].[SalaryDetl] S
        INNER JOIN OPENJSON(@json)
        WITH (
            empType NVARCHAR(50) '$.empType',
            empID INT '$.empID',
            SalaryMonth CHAR(2) '$.SalaryMonth',
            SalaryYear CHAR(4) '$.SalaryYear'
        ) D
        ON  S.empType = D.empType
        AND S.empID = D.empID
        AND S.SalaryMonth = D.SalaryMonth
        AND S.SalaryYear = D.SalaryYear
        AND S.CompanyID = @CompanyID;

        -- Step 4: Iterate through each employee in the JSON
        SET @EmployeeCursor = CURSOR FOR 
        SELECT value FROM OPENJSON(@json);

        OPEN @EmployeeCursor;
        FETCH NEXT FROM @EmployeeCursor INTO @EmployeeJSON;

        SET @TotalCount = 0;

        WHILE @@FETCH_STATUS = 0
        BEGIN
            -- Insert Parent Record
            INSERT INTO [dbo].[SalaryDetl]
            (
                empType, empID, SalaryMonth, SalaryYear, DaysWorked, DaysInMonth,
                BASICRate, HRARate, MedicalAllowanceRate, WashingAllowanceRate, TARate,
                ESICRate, PFRate, PTAXRate,
                BASIC, HRA, MedicalAllowance, WashingAllowance, TA,
                ESIC, PF, PTAX, AdvanceAdjusted, KhurakiTotalAmt, GrossSalary, NetSalary,
                UserID, CreatedOn, amountadjust, iddel, totaldeduction, CompanyID
            )
            SELECT 
                empType, empID, SalaryMonth, SalaryYear, DaysWorked, DaysInMonth,
                BASICRate, HRARate, MedicalAllowanceRate, WashingAllowanceRate, TARate,
                ESICRate, PFRate, PTAXRate,
                BASIC, HRA, MedicalAllowance, WashingAllowance, TA,
                ESIC, PF, PTAX, AdvanceAdjusted, KhurakiTotalAmt, GrossSalary, NetSalary,
                @UserId, GETDATE(), amountadjust, iddel, totaldeduction, @CompanyID
            FROM OPENJSON(@EmployeeJSON)
            WITH (
                empType NVARCHAR(50) '$.empType',
                empID INT '$.empID',
                SalaryMonth CHAR(2) '$.SalaryMonth',
                SalaryYear CHAR(4) '$.SalaryYear',
                DaysWorked DECIMAL(10,2) '$.DaysWorked',
                DaysInMonth DECIMAL(10,2) '$.DaysInMonth',
                BASICRate DECIMAL(18,2) '$.BASICRate',
                HRARate DECIMAL(18,2) '$.HRARate',
                MedicalAllowanceRate DECIMAL(18,2) '$.MedicalAllowanceRate',
                WashingAllowanceRate DECIMAL(18,2) '$.WashingAllowanceRate',
                TARate DECIMAL(18,2) '$.TARate',
                ESICRate DECIMAL(18,2) '$.ESICRate',
                PFRate DECIMAL(18,2) '$.PFRate',
                PTAXRate DECIMAL(18,2) '$.PTAXRate',
                BASIC DECIMAL(18,2) '$.BASIC',
                HRA DECIMAL(18,2) '$.HRA',
                MedicalAllowance DECIMAL(18,2) '$.MedicalAllowance',
                WashingAllowance DECIMAL(18,2) '$.WashingAllowance',
                TA DECIMAL(18,2) '$.TA',
                ESIC DECIMAL(18,2) '$.ESIC',
                PF DECIMAL(18,2) '$.PF',
                PTAX DECIMAL(18,2) '$.PTAX',
                AdvanceAdjusted DECIMAL(18,2) '$.AdvanceAdjusted',
                KhurakiTotalAmt DECIMAL(18,2) '$.KhurakiTotalAmt',
                GrossSalary DECIMAL(18,2) '$.GrossSalary',
                NetSalary DECIMAL(18,2) '$.NetSalary',
                amountadjust DECIMAL(18,2) '$.amountadjust',
                iddel varchar(250) '$.iddel',
                totaldeduction DECIMAL(18,2) '$.totaldeduction'
            );

            SET @NewSalaryDetlID = SCOPE_IDENTITY();

            -- Insert Detailed Adjustments for this employee
            INSERT INTO [dbo].[Salary_AdvAdjDetl]
            (
                SalaryDetl_ID,
                AdvanceID,
                AdvanceAmt,
                AdjustAmt,
                UserID,
                EntryDate,
                CompanyID
            )
            SELECT 
                @NewSalaryDetlID,
                advanceId,
                advanceAmount,
                AdjusAmt,
                @UserId,
                GETDATE(),
                @CompanyID
            FROM OPENJSON(@EmployeeJSON, '$.DetailedAdvanceAdj')
            WITH (
                advanceId INT '$.advanceId',
                advanceAmount DECIMAL(18,2) '$.advanceAmount',
                AdjusAmt DECIMAL(18,2) '$.AdjusAmt'
            );

            -- Step 5: Update AdvanceToStaffEntry table (Apply new adjustments)
            UPDATE AS_ENT
            SET AS_ENT.AdvAdjusted = ISNULL(AS_ENT.AdvAdjusted, 0) + AD_JSON.AdjusAmt
            FROM [dbo].[AdvanceToStaffEntry] AS_ENT
            INNER JOIN (
                SELECT 
                    advanceId,
                    AdjusAmt
                FROM OPENJSON(@EmployeeJSON, '$.DetailedAdvanceAdj')
                WITH (
                    advanceId INT '$.advanceId',
                    AdjusAmt DECIMAL(18,2) '$.AdjusAmt'
                )
            ) AD_JSON ON AS_ENT.id = AD_JSON.advanceId;

            SET @TotalCount = @TotalCount + 1;
            FETCH NEXT FROM @EmployeeCursor INTO @EmployeeJSON;
        END

        CLOSE @EmployeeCursor;
        DEALLOCATE @EmployeeCursor;

        SET @StatusID = 1;
        SET @StatusMessage = 'Salary details saved successfully.';

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        IF CURSOR_STATUS('global', 'EmployeeCursor') >= 0
        BEGIN
            CLOSE @EmployeeCursor;
            DEALLOCATE @EmployeeCursor;
        END

        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
        
        SET @StatusID = ERROR_NUMBER();
        SET @StatusMessage = ERROR_MESSAGE();
        SET @TotalCount = 0;
    END CATCH
END;