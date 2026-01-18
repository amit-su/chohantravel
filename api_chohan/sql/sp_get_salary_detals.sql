ALTER PROCEDURE [dbo].[sp_get_salary_detals]
    @CompanyID INT = 0,
    @monthYear CHAR(7),               -- Format: YYYY-MM
    @employType VARCHAR(10) = NULL,   -- 'Driver', 'Helper', 'Staff', or NULL for all
    @StatusID INT OUTPUT,
    @StatusMessage NVARCHAR(200) OUTPUT,
    @TotalCount INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        -- 1. Date and Month Calculations
        DECLARE @targetMonthStart DATE = CAST(@monthYear + '-01' AS DATE);
        -- EOMONTH gets the last day of the month (e.g., 2025-12-31)
        DECLARE @targetMonthEndDate Date = EOMONTH(@targetMonthStart)
        DECLARE @DaysInMonth INT = DAY(EOMONTH(@targetMonthStart)); -- Total days in the target month
        DECLARE @SalaryYear INT = YEAR(@targetMonthStart);
        DECLARE @SalaryMonth INT = MONTH(@targetMonthStart);

        -- --- CTEs for Core Data Retrieval ---
        ;WITH ConsolidatedEmployeeMast AS (
            SELECT id, driverName AS EmployeeName, 'Driver' AS employType
            FROM DriverMast
            WHERE @employType IS NULL OR @employType = 'Driver'
            UNION ALL
            SELECT id, helperName AS EmployeeName, 'Helper' AS employType
            FROM HelperMast
            WHERE @employType IS NULL OR @employType = 'Helper'
            UNION ALL
            SELECT id, staffName AS EmployeeName, 'Staff' AS employType
            FROM StaffMast
            WHERE @employType IS NULL OR @employType = 'Staff'
        ),

        -- Attendance for drivers AND helpers (unpivot DriverID & HelperID into rows with employType)
        DriverHelperAttendance AS (
            SELECT
                x.EmployeeID,
                x.employType,
                SUM(x.TotalDays) AS TotalWorkingDays
            FROM (
                SELECT
                    a.DriverID AS EmployeeID,
                    'Driver' AS employType,
                    COUNT(DISTINCT a.DutyDate) AS TotalDays
                FROM DrvHelperSiteAttend a
                WHERE CONVERT(CHAR(7), a.DutyDate, 126) = @monthYear
                      AND a.DriverID IS NOT NULL
                GROUP BY a.DriverID

                UNION ALL

                SELECT
                    a.HelperID AS EmployeeID,
                    'Helper' AS employType,
                    COUNT(DISTINCT a.DutyDate) AS TotalDays
                FROM DrvHelperSiteAttend a
                WHERE CONVERT(CHAR(7), a.DutyDate, 126) = @monthYear
                      AND a.HelperID IS NOT NULL
                GROUP BY a.HelperID
            ) x
            GROUP BY x.EmployeeID, x.employType
        ),

        -- Staff attendance remains as before (JSON-based)
        StaffAttendanceBreakdown AS (
            SELECT
                sa.employeeId AS EmployeeID,
                SUM(CASE WHEN j.[status] = 'P' THEN 1 ELSE 0 END) AS CountP,
                SUM(CASE WHEN j.[status] = 'L' THEN 1 ELSE 0 END) AS CountL,
                SUM(CASE WHEN j.[status] = 'A' THEN 1 ELSE 0 END) AS CountA,
                SUM(CASE 
                        WHEN DATENAME(WEEKDAY, 
                            TRY_CONVERT(date, 
                                RIGHT(sa.[date],4) + '-' + LEFT(sa.[date],2) + '-' + RIGHT('0' + j.[date],2)
                            )
                        ) = 'Sunday' THEN 1 ELSE 0 
                    END) AS CountSunday
            FROM StaffAttendance sa 
            INNER JOIN dbo.StaffMast cem ON sa.employeeId = cem.id
            CROSS APPLY OPENJSON(sa.AttendanceStatus) 
            WITH (
                [date] NVARCHAR(2) '$.date',
                [status] NVARCHAR(10) '$.status'
            ) j 
            WHERE FORMAT(TRY_CONVERT(date, '01/' + sa.[date], 103), 'yyyy-MM') = @monthYear
              AND sa.CompanyID = @CompanyID 
            GROUP BY sa.employeeId
        ),

        -- Latest salary: ensure partitioning by empID + empType so same id with different types don't mix
        LatestSalary AS (
            SELECT t.*
            FROM (
                SELECT
                    s.empID,
                    s.empType,

                    -- NUMERIC CONVERTED VALUES (for calculations and output)
                    ISNULL(TRY_CAST(s.PF AS DECIMAL(18,2)),0.00)   AS PF_Value,
                    ISNULL(TRY_CAST(s.PTAX AS DECIMAL(18,2)),0.00) AS PTAX_Value,
                    ISNULL(TRY_CAST(s.ESIC AS DECIMAL(18,2)),0.00) AS ESIC_Value,

                    -- ALSO OTHER FIELDS
                    ISNULL(TRY_CAST(s.BASIC AS DECIMAL(18, 2)), 0.00) AS Basic, 
                    ISNULL(TRY_CAST(s.HRA AS DECIMAL(18, 2)), 0.00) AS HRA, 
                    ISNULL(TRY_CAST(s.TA AS DECIMAL(18, 2)), 0.00) AS TA, 
                    ISNULL(TRY_CAST(s.WashingAllowance AS DECIMAL(18, 2)), 0.00) AS WashingAllowance, 
                    ISNULL(TRY_CAST(s.MedicalAllowance AS DECIMAL(18, 2)), 0.00) AS MedicalAllowance,

                    ROW_NUMBER() OVER (
                        PARTITION BY s.empID, s.empType
                        ORDER BY s.Year DESC,
                            CASE s.Month
                                WHEN 'January' THEN 1 WHEN 'February' THEN 2 WHEN 'March' THEN 3 WHEN 'April' THEN 4
                                WHEN 'May' THEN 5 WHEN 'June' THEN 6 WHEN 'July' THEN 7 WHEN 'August' THEN 8
                                WHEN 'September' THEN 9 WHEN 'October' THEN 10 WHEN 'November' THEN 11 WHEN 'December' THEN 12
                                ELSE 0
                            END DESC
                    ) AS rn
                FROM Salarysetup s
            ) t
            WHERE t.rn = 1
        ),

        -- UPDATED CTE: Calculate Outstanding Balance directly from AdvanceToStaffEntry
        -- Logic: Sum (AdvanceAmount - AdvAdjusted) for entries up to target month end
        AdvanceBalanceCTE AS (
            SELECT
                s.empID AS EmployeeID,
                s.driverHelper as emptype,
                SUM(s.advanceAmount - ISNULL(s.AdvAdjusted, 0)) AS OutstandingBalance,
                SUM(s.advanceAmount) AS TotalAdvancesGiven -- Keeping this if needed for display, otherwise Balance is key
            FROM AdvanceToStaffEntry AS s
            -- Using ISNULL and CAST(created_at AS DATE) to match the subquery logic
            WHERE CAST(s.created_at AS DATE) <= @targetMonthEndDate
              AND s.advanceAmount <> ISNULL(s.AdvAdjusted, 0) -- Filter out fully adjusted
            GROUP BY s.empID,s.driverHelper
        ),

        -- Khuraki should be attributed separately for Driver and Helper
        KhurakiCTE AS (
            SELECT
                x.EmployeeID,
                x.employType,
                SUM(x.KhurakiAmt) AS TotalKhuraki
            FROM (
                SELECT a.DriverID AS EmployeeID, 'Driver' AS employType, ISNULL(a.KhurakiAmt,0) AS KhurakiAmt, a.DutyDate
                FROM DrvHelperSiteAttend a
                WHERE a.DriverID IS NOT NULL

                UNION ALL

                SELECT a.HelperID AS EmployeeID, 'Helper' AS employType, ISNULL(a.KhurakiAmt,0) AS KhurakiAmt, a.DutyDate
                FROM DrvHelperSiteAttend a
                WHERE a.HelperID IS NOT NULL
            ) x
            WHERE CONVERT(CHAR(7), x.DutyDate, 126) = @monthYear
            GROUP BY x.EmployeeID, x.employType
        ),

        -- New CTE to check for existing salary records
        ExistingSalaryDetl AS (
            SELECT 
                empID, 
                empType
            FROM [dbo].[SalaryDetl]
            WHERE 
                SalaryMonth = @SalaryMonth
                AND SalaryYear = @SalaryYear
        ),

        InitialData AS (
            SELECT
                d.id AS id,
                d.id AS EmployeeID,
                d.EmployeeName,
                d.employType,
                @SalaryMonth AS SalaryMonth,
                @SalaryYear AS SalaryYear,
                CAST(@DaysInMonth AS DECIMAL(10, 2)) AS DaysInMonth,
                CAST(
                    CASE d.employType
                        WHEN 'Staff' THEN ISNULL(sab.CountP, 0) + ISNULL(sab.CountL, 0)
                        ELSE ISNULL(dha.TotalWorkingDays, 0)
                    END AS DECIMAL(10, 2)
                ) AS PaidDays,
                ISNULL(dha.TotalWorkingDays, 0) AS ActualAttendanceDriverHelper,
                ISNULL(sab.CountP, 0) AS CountP,
                ISNULL(sab.CountL, 0) AS CountL,
                ISNULL(sab.CountA, 0) AS CountA,
                ISNULL(ls.Basic, 0) AS LatestBasicSalary,
                ISNULL(ls.HRA, 0) AS HRA,
                ISNULL(ls.TA, 0) AS TA,
                ISNULL(ls.MedicalAllowance, 0) AS MedicalAllowance,
                ISNULL(ls.WashingAllowance, 0) AS WashingAllowance,
                -- These are the full, non-calculated monthly deduction amounts
                ISNULL(ls.PF_Value, 0) AS PF_Deduction,
                ISNULL(ls.ESIC_Value, 0) AS ESIC_Deduction,
                ISNULL(ls.PTAX_Value, 0) AS PTAX_Deduction,
                0.00 AS AdvanceAdjusted, -- Placeholder for UI input
                ISNULL(abc.TotalAdvancesGiven, 0) AS TotalAdvancesGiven,
                0 AS TotalAdvancesAdjusted, -- Not strictly needed for calculation now, or could query sum(AdvAdjusted)
                ISNULL(abc.OutstandingBalance, 0) AS TotalAdvanceDue, -- THIS IS THE FIXED VALUE
                ISNULL(kc.TotalKhuraki,0) AS KhurakiAmt,
                
                -- NEW: JSON subquery for Detailed Advance List matching spRpt_SalarySlip_Advance_New exactly
                (
                    SELECT 
                        adv.ID,
                        (adv.advanceAmount - ISNULL(adv.AdvAdjusted, 0)) AS advanceAmount, -- Renamed to advanceAmount like in source SP
                        adv.remark,
                        adv.created_at
                    FROM AdvanceToStaffEntry adv
                    WHERE adv.empID = d.id 
                      AND adv.driverHelper = d.employType
                      AND CAST(adv.created_at AS DATE) <= @targetMonthEndDate
                      AND (adv.advanceAmount - ISNULL(adv.AdvAdjusted, 0)) <> 0
                    FOR JSON PATH
                ) AS AdvanceDetailsJson
            
            FROM ConsolidatedEmployeeMast d
            LEFT JOIN DriverHelperAttendance dha 
                ON d.id = dha.EmployeeID
               AND d.employType = dha.employType    -- match type (Driver/Helper)
            LEFT JOIN StaffAttendanceBreakdown sab 
                ON d.id = sab.EmployeeID
               AND d.employType = 'Staff'
            LEFT JOIN LatestSalary ls 
                ON d.id = ls.empID
               AND d.employType = ls.empType      -- ensure salary matches employee type
            -- Use the new CTE for balances
            LEFT JOIN AdvanceBalanceCTE abc ON d.id = abc.EmployeeID and d.employType=abc.emptype
            
            LEFT JOIN KhurakiCTE kc ON d.id = kc.EmployeeID AND d.employType = kc.employType
            -- JOIN to check for existing salary record
            LEFT JOIN ExistingSalaryDetl esd ON d.id = esd.empID AND d.employType = esd.empType
            -- FILTER: Exclude if a matching record exists in SalaryDetl (Salary DUE logic)
            WHERE esd.empID IS NULL
        )

        -- Final Select and Calculation
        SELECT
            id,
            EmployeeID,
            EmployeeName,
            employType,
            SalaryMonth,
            SalaryYear,
            DaysInMonth,
            PaidDays,
            KhurakiAmt,
            ActualAttendanceDriverHelper AS WorkingDays,
            CountP,
            CountL,
            CountA,
            LatestBasicSalary,
            HRA,
            TA,
            MedicalAllowance,
            WashingAllowance,
            -- Full, non-calculated monthly deduction values (as requested)
            PF_Deduction,
            ESIC_Deduction,
            PTAX_Deduction,
            AdvanceAdjusted, 
            TotalAdvancesGiven,
            TotalAdvancesAdjusted,
            TotalAdvanceDue,
            
            -- Provide default empty array if null
            ISNULL(AdvanceDetailsJson, '[]') AS AdvanceDetails,

            -- Calculated fields (Per-day values for front-end calculation/display)
            CAST(LatestBasicSalary / NULLIF(DaysInMonth, 0) AS DECIMAL(10, 4)) AS PerDayBasic,
            CAST(HRA / NULLIF(DaysInMonth, 0) AS DECIMAL(10, 4)) AS PerDayHRA,
            CAST(TA / NULLIF(DaysInMonth, 0) AS DECIMAL(10, 4)) AS PerDayTA,
            CAST(MedicalAllowance / NULLIF(DaysInMonth, 0) AS DECIMAL(10, 4)) AS PerDayMedicalAllowance,
            CAST(WashingAllowance / NULLIF(DaysInMonth, 0) AS DECIMAL(10, 4)) AS PerDayWashingAllowance,
            
            -- Per Day Deductions (derived from the full deduction values)
            CAST(PF_Deduction / NULLIF(DaysInMonth, 0) AS DECIMAL(10, 4)) AS PerDayPF,
            CAST(ESIC_Deduction / NULLIF(DaysInMonth, 0) AS DECIMAL(10, 4)) AS PerDayESIC,
            CAST(PTAX_Deduction / NULLIF(DaysInMonth, 0) AS DECIMAL(10, 4)) AS PerDayPTAX,

            -- Final Calculated Components (Pro-Rata rates * PaidDays)
            CAST((LatestBasicSalary / NULLIF(DaysInMonth, 0)) * PaidDays AS DECIMAL(10, 2)) AS CalculatedBasic,
            CAST((HRA / NULLIF(DaysInMonth, 0)) * PaidDays AS DECIMAL(10, 2)) AS CalculatedHRA,
            CAST((TA / NULLIF(DaysInMonth, 0)) * PaidDays AS DECIMAL(10, 2)) AS CalculatedTA,
            CAST((MedicalAllowance / NULLIF(DaysInMonth, 0)) * PaidDays AS DECIMAL(10, 2)) AS CalculatedMedicalAllowance,
            CAST((WashingAllowance / NULLIF(DaysInMonth, 0)) * PaidDays AS DECIMAL(10, 2)) AS CalculatedWashingAllowance,
            
            -- Calculated Gross Salary (Earnings)
            CAST(
                (
                    (LatestBasicSalary + HRA + TA + MedicalAllowance + WashingAllowance) / NULLIF(DaysInMonth, 0)
                ) * PaidDays
                + KhurakiAmt
            AS DECIMAL(10, 2)) AS CalculatedGross,
            
            -- Calculated Net Salary (Gross - Deductions - Advance)
            CAST(
                (
                    (
                        (LatestBasicSalary + HRA + TA + MedicalAllowance + WashingAllowance) / NULLIF(DaysInMonth, 0)
                    ) * PaidDays
                    + KhurakiAmt
                )
                - ((PF_Deduction / NULLIF(DaysInMonth, 0)) * PaidDays)
                - ((ESIC_Deduction / NULLIF(DaysInMonth, 0)) * PaidDays)
                - ((PTAX_Deduction / NULLIF(DaysInMonth, 0)) * PaidDays)
                - AdvanceAdjusted
            AS DECIMAL(10, 2)) AS CalculatedNet
        
        INTO #Result
        FROM InitialData
        ORDER BY employType, EmployeeID;

        SELECT @TotalCount = COUNT(*) FROM #Result;
        SET @StatusID = 1;
        SET @StatusMessage = 'Success';

        SELECT * FROM #Result;

        DROP TABLE #Result;

    END TRY
    BEGIN CATCH
        SET @StatusID = ERROR_NUMBER();
        SET @StatusMessage = ERROR_MESSAGE();
        SET @TotalCount = 0;

        IF OBJECT_ID('tempdb..#Result') IS NOT NULL
            DROP TABLE #Result;
    END CATCH
END