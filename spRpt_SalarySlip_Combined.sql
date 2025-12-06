ALTER PROC [dbo].[spRpt_SalarySlip] @id BIGINT AS 
BEGIN
    -- Declare variables
    DECLARE @MONTH INT, @YEAR INT, @empID INT, @empType VARCHAR(50), @SDate DATE;

    -- Get common parameters from SalaryDetl
    SELECT  
        @MONTH = SalaryMonth,
        @YEAR = SalaryYear,
        @empID = empID,
        @empType = empType 
    FROM [ChohanTravel].[dbo].[SalaryDetl] s 
    WHERE s.id = @id;

    -- Calculate start date for opening advance
    SELECT @SDate = CAST(CONVERT(NVARCHAR(4), @YEAR) + '-' + CAST(@MONTH AS NVARCHAR(2)) + '-01' AS DATE);

    -- Result Set 1: Main Salary Slip Data
    SELECT  
        s.[id],
        [empType],
        [empID],
        [SalaryMonth],
        [SalaryYear],
        [DaysWorked],
        [DaysInMonth],
        [BASICRate],
        [HRARate],
        [MedicalAllowanceRate],
        [WashingAllowanceRate],
        [TARate],
        [ESICRate],
        [PFRate],
        [PTAXRate],
        [BASIC],
        [HRA],
        [MedicalAllowance],
        [WashingAllowance],
        [TA],
        [ESIC],
        [PF],
        [PTAX],
        [AdvanceAdjusted],
        [KhurakiTotalAmt],
        [GrossSalary],
        [NetSalary],
        [amountadjust],
        [iddel],
        [totaldeduction],
        CASE 
            WHEN s.empType = 'DRIVER' THEN d.driverName 
            WHEN s.empType = 'HELPER' THEN h.helperName
            ELSE 'STAFF' 
        END AS name,
        CASE 
            WHEN SalaryMonth = 1 THEN 'JAN'
            WHEN SalaryMonth = 2 THEN 'FEB'
            WHEN SalaryMonth = 3 THEN 'MAR'
            WHEN SalaryMonth = 4 THEN 'APR'
            WHEN SalaryMonth = 5 THEN 'MAY'
            WHEN SalaryMonth = 6 THEN 'JUN'
            WHEN SalaryMonth = 7 THEN 'JUL'
            WHEN SalaryMonth = 8 THEN 'AUG'
            WHEN SalaryMonth = 9 THEN 'SEP'
            WHEN SalaryMonth = 10 THEN 'OCT'
            WHEN SalaryMonth = 11 THEN 'NOV'
            WHEN SalaryMonth = 12 THEN 'DEC'
            ELSE 'Invalid Month'
        END AS MonthName,
        CASE 
            WHEN s.empType = 'DRIVER' THEN d.EmployeeNo 
            WHEN s.empType = 'HELPER' THEN h.EmployeeNo
            ELSE 'STAFF' 
        END AS EmployeeNo,
        CASE 
            WHEN s.empType = 'DRIVER' THEN d.pfNo 
            WHEN s.empType = 'HELPER' THEN h.pfNo
            ELSE 'STAFF' 
        END AS pfNo,
        CASE 
            WHEN s.empType = 'DRIVER' THEN FORMAT(d.Dateofjoin, 'dd/MM/yyyy')
            WHEN s.empType = 'HELPER' THEN FORMAT(h.Dateofjoin, 'dd/MM/yyyy')
            ELSE 'STAFF' 
        END AS Dateofjoin,
        CASE 
            WHEN s.empType = 'DRIVER' THEN d.bankAcNo 
            WHEN s.empType = 'HELPER' THEN h.bankAcNo
            ELSE 'STAFF' 
        END AS bankAcNo,
        CASE 
            WHEN s.empType = 'DRIVER' THEN d.esiNo 
            WHEN s.empType = 'HELPER' THEN h.esiNo
            ELSE 'STAFF' 
        END AS esiNo,
        C.Name AS CompName,
        C.Address AS CompAddr,
        C.City AS CompCity,
        C.Phone AS CompPhone,
        C.EMail AS CompEMail,
        C.GSTNo AS CompGSTNo,
        C.PanNo AS PanNo,
        C.CINNo AS CINNo,
        C.PFRegNo AS CompPFRegNo,
        C.ESIRegNo AS CompESTIRegNo
    FROM [ChohanTravel].[dbo].[SalaryDetl] s
    LEFT JOIN DriverMast d ON s.empID = d.id AND s.empType = 'DRIVER'
    LEFT JOIN HelperMast h ON s.empID = h.id AND s.empType = 'HELPER'
    LEFT JOIN CompanyMast AS C ON s.CompanyID = C.Id
    WHERE s.id = @id;

    -- Result Set 2: Advance Payment Details
    SELECT 
        advanceAmount,
        remark,
        created_at 
    FROM AdvanceToStaffEntry
    WHERE MONTH(created_at) = @MONTH 
        AND YEAR(created_at) = @YEAR
        AND empID = @empID;

    -- Result Set 3: Bus Number Assignments
    SELECT 
        BusNo AS DriverBusNo,
        '' AS HelperBusNo 
    FROM PartySiteBusSetup AS H 
    LEFT JOIN BusMast AS B ON H.BusID = B.ID   
    WHERE H.DriverID = @empID

    UNION ALL

    SELECT 
        '' AS DriverBusNo, 
        BusNo AS HelperBusNo 
    FROM PartySiteBusSetup AS H 
    LEFT JOIN BusMast AS B ON H.BusID = B.ID   
    WHERE H.HelperID = @empID;

    -- Result Set 4: Khoraki/Meal Allowance Details
    ;WITH DayCountCTE_Helper AS (
        SELECT 
            H.id, 
            H.DutyDate, 
            c.siteShortName, 
            H.KhurakiAmt 
        FROM dbo.DrvHelperSiteAttend H
        LEFT JOIN PartySiteMast c ON c.id = H.SiteID
        WHERE H.HelperID = @empID 
            AND ISNULL(H.HelperId, 0) <> 0
            AND MONTH(H.DutyDate) = @MONTH
            AND YEAR(H.DutyDate) = @YEAR
    ),
    DayCountCTE_Driver AS (
        SELECT 
            H.id, 
            H.DutyDate, 
            c.siteShortName, 
            H.KhurakiAmt 
        FROM dbo.DrvHelperSiteAttend H
        LEFT JOIN PartySiteMast c ON c.id = H.SiteID
        WHERE H.DriverID = @empID 
            AND ISNULL(H.DriverID, 0) <> 0
            AND MONTH(H.DutyDate) = @MONTH
            AND YEAR(H.DutyDate) = @YEAR
    )
    SELECT 
        SiteShortName,
        SUM(KhurakiAmt) AS TotalKhurakiAmount,
        COUNT(*) AS DayCount,
        COUNT(*) AS AppearanceCount
    FROM DayCountCTE_Helper
    WHERE KhurakiAmt <> 0
    GROUP BY SiteShortName

    UNION ALL

    SELECT 
        SiteShortName,
        SUM(KhurakiAmt) AS TotalKhurakiAmount,
        COUNT(*) AS DayCount,
        COUNT(*) AS AppearanceCount
    FROM DayCountCTE_Driver
    WHERE KhurakiAmt <> 0
    GROUP BY SiteShortName;

    -- Result Set 5: Opening Advance Balance
    SELECT 
        H.Trandate,
        H.EmpType,
        H.EmpID,
        SUM(H.AdvanceAmount) AS OpAdvAmt 
    FROM (
        SELECT 
            created_at AS TranDate,
            driverHelper AS EmpType,
            EmpID,
            advanceAmount 
        FROM AdvanceToStaffEntry 
        WHERE created_at < @SDate 
            AND driverhelper = @empType 
            AND EmpID = @empID
        
        UNION ALL
        
        SELECT 
            CAST(CONVERT(NVARCHAR(4), salaryYear) + '-' + CAST(salarymonth AS NVARCHAR(2)) + '-01' AS DATE) AS TranDate,
            empType,
            empid,
            -AdvanceAdjusted 
        FROM SalaryDetl 
        WHERE CAST(CONVERT(NVARCHAR(4), salaryYear) + '-' + CAST(salarymonth AS NVARCHAR(2)) + '-01' AS DATE) < @SDate 
            AND empType = @empType 
            AND EmpID = @empID
    ) AS H
    GROUP BY H.TranDate, H.EmpType, H.empID;

END