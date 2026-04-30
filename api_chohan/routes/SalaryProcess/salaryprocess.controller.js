const databaseService = require("../../utils/dbClientService");
const {
  INSERT_UPDATE_SALARY_PROCESS,
  GET_SALARY_PROCESS_DETL,
  GET_SALARY_SET_UP_BY_ID,
  DELETE_PROCEDURE,
  GET_SALARY_DETL_BY_TYPE_ID,
  GET_SALARY_DETL_BY_TYPE_ID2,
  sp_save_salary_details,
  sp_get_salary,
  RPT_SALARY_SLIP,
  RPT_SALARY_REGISTER,
  RPT_SALARY_SLIP_KHORAKI,
  RPT_SALARY_SLIP_ADVANCE,
  DELETE_SALARY
} = require("../../utils/constants");

const getAllSalarydetail = async (req, res) => {
  try {
    const { monthYear, employType } = req.body;
    const params = {
      employType: employType,
      monthYear: monthYear,
      CompanyID: req.body.CompanyID,
      // PageNo: req.query.page,
      // PageSize: req.query.count,
    };
    console.log(params, "params")
    const resultdata = await databaseService.callStoredProcedure(
      req,
      GET_SALARY_PROCESS_DETL,
      params
    );

    if (Array.isArray(resultdata)) {
      resultdata.forEach((item) => {
        if (item.AdvanceDetails && typeof item.AdvanceDetails === 'string') {
          try {
            item.AdvanceDetails = JSON.parse(item.AdvanceDetails);
          } catch (e) {
            console.error("Error parsing AdvanceDetails JSON", e);
            item.AdvanceDetails = [];
          }
        }
      });
    }

    res.json(resultdata);
  } catch (error) {
    res.status(400).json(error.message);
  }
};

const updateSalarysetupdetails = async (req, res) => {
  try {
    const params = {
      ID: req.params.ID,
      empID: req.body.empID,
      empType: req.body.empType,
      SalaryMonth: req.body.Month,
      SalaryYear: req.body.Year,
      DaysWorked: req.body.DaysWorked,
      DaysInMonth: req.body.DaysInMonth,
      BASICRate: req.body.basicRate,
      HRARate: req.body.hraRate,
      MedicalAllowanceRate: req.body.medicalAllowanceRate,
      WashingAllowanceRate: req.body.washingAllowanceRate,
      TARate: req.body.taRate,
      ESICRate: req.body.esicRate,
      PFRate: req.body.pfRate,
      PTAXRate: req.body.ptaxRate,
      BASIC: req.body.basic,
      HRA: req.body.hra,
      MedicalAllowance: req.body.medicalAllowance,
      WashingAllowance: req.body.washingAllowance,
      TA: req.body.ta,
      ESIC: req.body.esic,
      PF: req.body.pf,
      PTAX: req.body.ptax,
      AdvanceAdjusted: req.body.advanceAdjusted,
      KhurakiTotalAmt: req.body.khurakiTotalAmt,
      GrossSalary: req.body.grossSalary,
      NetSalary: req.body.netSalary,
      UserID: req.body.userID,
      createdon: req.body.createdon,
      AdvanceID: req.body.AdvanceID,
      AdvanceAmt: req.body.AdvanceAmt,
      AdjustAmt: req.body.AdjustAmt,
      iddel: req.body.iddel,
      totaldeduction: req.body.totaldeduction,

      Operation: req.body.Operation,
      advanceList: req.body.advanceList,
    };

    const result = await databaseService.callStoredProcedure(
      req,
      INSERT_UPDATE_SALARY_PROCESS,
      params
    );
    console.log(result, "fyrt");
    res.json(result);
  } catch (error) {
    res.status(400).json(error.message);
    console.log(error.message);
  }
};

const deleteSaldetals = async (req, res) => {
  try {
    // delete productcategory
    const companyId = databaseService.getCompanyIdFromToken(req);

    const params = {
      Id: req.params.id,
      CompanyID: companyId
    };
    const result = await databaseService.callStoredProcedure(
      req,
      DELETE_SALARY,
      params
    );
    res.json(result);
  } catch (error) {
    res.status(400).json(error.message);
    console.log(error.message);
  }
};
const getAllSalarydetailsbyid = async (req, res) => {
  try {
    console.log(res.params, "67767667676766");
    const { id, type } = req.params;
    const decodedId = id;
    const decodedtype = type;
    const params = {
      id: decodedId,
      type: decodedtype,
      // Month:decodeMonth
      PageNo: 1,
      PageSize: 10000,
    };

    const resultdata = await databaseService.callStoredProcedure(
      req,
      GET_SALARY_DETL_BY_TYPE_ID2,
      params
    );

    res.json(resultdata);
  } catch (error) {
    res.status(400).json(error.message);
    console.log(error.message);
  }
};

const saveSalaryDetails = async (req, res) => {
  try {
    const companyId = databaseService.getCompanyIdFromToken(req);
    const params = {
      // The stored procedure expects the JSON array as a string.
      // req.body will be the array from the frontend.
      CompanyID: companyId,
      json: JSON.stringify(req.body),
      UserId: databaseService.getUserIdFromToken(req),
    };

    // Use callStored which does not automatically add CompanyID
    const result = await databaseService.callStored(
      req,
      sp_save_salary_details,
      params
    );
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getSalaryProcessbytypeid = async (req, res) => {
  try {
    console.log(req.params, "8767");
    const { id, type } = req.params;
    const decodedId = id;
    const decodedtype = type;
    // console.log("Date",date)
    const params = {
      id: decodedId,
      type: decodedtype,
      //  PageNo: 1,
      // PageSize: 100000,
    };

    const resultdata = await databaseService.callStoredProcedure(
      req,
      GET_SALARY_DETL_BY_TYPE_ID,
      params
    );

    res.json(resultdata);
  } catch (error) {
    res.status(400).json(error.message);
    console.log(error.message);
  }
};

const getAllSalary = async (req, res) => {
  try {
    console.log("request", req.body);
    const { monthYear, employType } = req.body;
    const params = {
      EmpType: employType,
      MonthYear: monthYear,
      CompanyID: req.body.CompanyID,
      // PageNo: req.query.page,
      // PageSize: req.query.count,
    };
    console.log(params, "params");
    const resultdata = await databaseService.callStored(
      req,
      sp_get_salary,
      params
    );

    res.json(resultdata);
  } catch (error) {
    res.status(400).json(error.message);
  }
};

const deleteSalary = async (req, res) => {
  try {
    // delete Company
    const params = {
      table_name: "SalaryDetl",
      column_name: "id",
      column_value: req.params.id,
    };
    const deletedCompany = await databaseService.callStoredProcedure(
      req,
      DELETE_PROCEDURE,
      params
    );
    res.json(deletedCompany);
  } catch (error) {
    res.status(400).json(error.message);
    console.log(error.message);
  }
};

const getSalarySlipReport = async (req, res) => {
  try {
    const { id } = req.body;

    // Get database connection directly
    const pool = await databaseService.dbClientService();
    const request = pool.request();

    // Add only the id parameter
    request.input('id', id);

    // Execute the stored procedure
    const result = await request.execute(RPT_SALARY_SLIP);

    // The result will contain multiple recordsets
    // Result structure:
    // recordsets[0] - Main Salary Slip Data
    // recordsets[1] - Advance Payment Details
    // recordsets[2] - Bus Number Assignments
    // recordsets[3] - Khoraki/Meal Allowance Details
    // recordsets[4] - Opening Advance Balance

    res.json({
      salarySlipData: result.recordsets[0] || [],
      advancePayments: result.recordsets[1] || [],
      busAssignments: result.recordsets[2] || [],
      khorakiDetails: result.recordsets[3] || [],
      openingAdvance: result.recordsets[4] || [],
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
    console.log(error.message);
  }
};

const getSalaryRegisterReport = async (req, res) => {
  try {
    const { sDate, CompanyID, SiteID } = req.body;

    // Get database connection directly
    const pool = await databaseService.dbClientService();
    const request = pool.request();

    // Add the sDate parameter
    request.input('SDate', sDate);
    request.input('CompanyID', CompanyID || 0);
    request.input('SiteID', SiteID || 0);

    // Execute the stored procedure
    const result = await request.execute(RPT_SALARY_REGISTER);

    // Return the salary register data
    res.json({
      data: result.recordset || [],
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
    console.log(error.message);
  }
};

const getKhorakiReport = async (req, res) => {
  try {
    const { month, year, empID, empType } = req.body;

    // Get database connection directly
    const pool = await databaseService.dbClientService();
    const request = pool.request();

    // Add parameters
    request.input('MONTH', month);
    request.input('YEAR', year);
    request.input('empID', empID);
    request.input('empType', empType);

    // Execute the stored procedure
    const result = await request.execute(RPT_SALARY_SLIP_KHORAKI);

    // Return the khoraki report data
    res.json({
      data: result.recordset || [],
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
    console.log(error.message);
  }
};

const getAdvanceReport = async (req, res) => {
  try {
    const { month, year, empID, empType } = req.body;

    // Get database connection directly
    const pool = await databaseService.dbClientService();
    const request = pool.request();

    // Add parameters
    request.input("MONTH", month);
    request.input("YEAR", year);
    request.input("empID", empID);
    request.input("EmpType", empType);

    // Execute the stored procedure
    const result = await request.execute(RPT_SALARY_SLIP_ADVANCE);

    // Return the advance report data
    res.json({
      data: result.recordset || [],
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
    console.log(error.message);
  }
};

const regenerateKhurakiAmount = async (req, res) => {
  try {
    const { month, year, employType } = req.body;

    // Calculate startDate and endDate
    // month is expected to be 1-12
    const startDate = `${year}-${String(month).padStart(2, "0")}-01`;
    const nextMonth = month === 12 ? 1 : parseInt(month) + 1;
    const nextYear = month === 12 ? parseInt(year) + 1 : year;
    const endDate = `${nextYear}-${String(nextMonth).padStart(2, "0")}-01`;

    const pool = await databaseService.dbClientService();

    let query = "";
    if (employType.toUpperCase() === "HELPER") {
      query = `
        UPDATE DH
        SET 
            DH.KhurakiAmt = S.HelperKhurakiAmt,
            DH.LastModifidOn = GETDATE()
        FROM dbo.DrvHelperSiteAttend DH
        JOIN dbo.PartySiteMast S ON DH.SiteID = S.ID
        WHERE 
            ISNULL(DH.KhurakiAmt,0) = 0
            AND ISNULL(DH.HelperID,0) <> 0
            AND DH.DutyDate >= '${startDate}'
            AND DH.DutyDate < '${endDate}';
    `;
    } else {
      query = `
        UPDATE DH
        SET 
            DH.KhurakiAmt = S.DriverKhurakiAmt,
            DH.LastModifidOn = GETDATE()
        FROM dbo.DrvHelperSiteAttend DH
        JOIN dbo.PartySiteMast S ON DH.SiteID = S.ID
        WHERE 
            ISNULL(DH.KhurakiAmt,0) = 0
            AND ISNULL(DH.DriverID,0) <> 0
            AND DH.DutyDate >= '${startDate}'
            AND DH.DutyDate < '${endDate}';
    `;
    }

    const result = await pool.request().query(query);
    res.json({
      message: "Khuraki amount regenerated successfully",
      rowsAffected: result.rowsAffected,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getSalaryProcessbytypeid,
  getAllSalarydetail,
  updateSalarysetupdetails,
  deleteSaldetals,
  getAllSalarydetailsbyid,
  saveSalaryDetails,
  getAllSalary,
  getSalarySlipReport,
  getSalaryRegisterReport,
  getKhorakiReport,
  getAdvanceReport,
  regenerateKhurakiAmount,
  // deleteSingleProductCategory,
};
