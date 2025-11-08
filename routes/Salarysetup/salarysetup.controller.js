const databaseService = require("../../utils/dbClientService");
const {
  GET_SALARY_SET_UP,
  INSERT_OR_UPDATE_SALATY_SET_UP,
  GET_SALARY_SET_UP_BY_ID,
  DELETE_PROCEDURE,
} = require("../../utils/constants");

const getAllSalary = async (req, res) => {
  try {
    console.log(req.params);
    const { id, Month } = req.params;
    const decodedId = id;
    const decodeMonth = Month;
    const params = {
      type: decodedId,
      // Month:decodeMonth
      // PageNo: req.query.page,
      // PageSize: req.query.count,
    };

    const resultdata = await databaseService.callStoredProcedure(
      req,
      GET_SALARY_SET_UP,
      params
    );

    res.json(resultdata);
  } catch (error) {
    res.status(400).json(error.message);
    console.log(error.message);
  }
};

const updateSalarysetup = async (req, res) => {
  try {
    console.log(req.body);
    const params = {
      ID: req.body.id2,
      empID: req.body.key.toString(),
      Allowance: req.body.Allowance,
      Amount: req.body.Amount,
      Deduction: req.body.Deduction,
      Month: req.body.date,
      empType: req.body.empType,
      basic: req.body.basic,
      medicalAllowance: req.body.medicalAllowance,
      hra: req.body.hra,
      ta: req.body.ta,
      washingAllowance: req.body.washingAllowance,
      esic: req.body.esic,
      advance: req.body.advance,
      pf: req.body.pf,
      ptax: req.body.ptax,
      Year: req.body.Year,

      Operation: 1,
    };
    const result = await databaseService.callStoredProcedure(
      req,
      INSERT_OR_UPDATE_SALATY_SET_UP,
      params
    );
    console.log(result, "fyrt");
    res.json(result);
  } catch (error) {
    res.status(400).json(error.message);
    console.log(error.message);
  }
};

const deleteSingleSalary = async (req, res) => {
  try {
    // delete Helper
    const params = {
      table_name: "Salarysetup",
      column_name: "id",
      column_value: req.params.id,
    };
    const deletedHelper = await databaseService.callStoredProcedure(
      req,
      DELETE_PROCEDURE,
      params
    );
    res.json(deletedHelper);
  } catch (error) {
    res.status(400).json(error.message);
    console.log(error.message);
  }
};

const getAllSalarybyid = async (req, res) => {
  try {
    console.log(req.params);
    const { id } = req.params;
    const decodedId = id;
    const params = {
      ID: decodedId,
      // Month:decodeMonth
      PageNo: 1,
      PageSize: 10000,
    };

    const resultdata = await databaseService.callStoredProcedure(
      req,
      GET_SALARY_SET_UP_BY_ID,
      params
    );

    res.json(resultdata);
  } catch (error) {
    res.status(400).json(error.message);
    console.log(error.message);
  }
};

module.exports = {
  getAllSalary,
  updateSalarysetup,
  deleteSingleSalary,
  getAllSalarybyid,
  // deleteSingleProductCategory,
};
