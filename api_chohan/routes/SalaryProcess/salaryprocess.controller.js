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
} = require("../../utils/constants");

const getAllSalarydetail = async (req, res) => {
  try {
    console.log("request", req.body);
    const { monthYear, employType } = req.body;
    const params = {
      employType: employType,
      monthYear: monthYear,
      // PageNo: req.query.page,
      // PageSize: req.query.count,
    };

    const resultdata = await databaseService.callStoredProcedure(
      req,
      GET_SALARY_PROCESS_DETL,
      params
    );

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

    const params = {
      table_name: "SalaryDetl",
      column_name: "id",
      column_value: req.params.id,
    };
    const result = await databaseService.callStoredProcedure(
      req,
      DELETE_PROCEDURE,
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
      // PageNo: req.query.page,
      // PageSize: req.query.count,
    };

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
module.exports = {
  getSalaryProcessbytypeid,
  getAllSalarydetail,
  updateSalarysetupdetails,
  deleteSaldetals,
  getAllSalarydetailsbyid,
  saveSalaryDetails,
  getAllSalary,
  // deleteSingleProductCategory,
};
