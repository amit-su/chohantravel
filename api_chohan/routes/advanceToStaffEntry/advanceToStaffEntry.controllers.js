const databaseService = require("../../utils/dbClientService");

const {
  GET_ADVANCE_TO_STAFF_PROCEDURE,
  INSERT_OR_UPDATE_ADVANCE_TO_STAFF_PROCEDURE,
  DELETE_PROCEDURE, GET_ALL_ADVANCE_PROCEDURE,
  GET_Single_ADVANCE_TO_STAFF_PROCEDURE, DELETE_ADVANCE_TO_STAFF,
  GET_Single_ADVANCE_TO_STAFF_BY_TYPE_PROCEDURE
} = require("../../utils/constants");

const createAdvanceToStaffEntry = async (req, res) => {
  try {
    const result = await databaseService.callStoredProcedure(req,
      INSERT_OR_UPDATE_ADVANCE_TO_STAFF_PROCEDURE,
      {
        AdvanceNo: req.body.AdvanceNo,
        EmpType: req.body.driverHelper,
        Date: req.body.date,
        transactions: req.body.transactions,
      }
    );
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};



const getAllAdvanceToStaffEntry = async (req, res) => {
  try {
    const { id, date } = req.params;
    const decodedId = id;
    const params = {
      type: decodedId,
      Date: date,
      //  PageNo: 1,
      // PageSize: 100000,
    };


    const resultdata = await databaseService.callStoredProcedure(req,
      GET_ADVANCE_TO_STAFF_PROCEDURE,
      params
    );

    res.json(resultdata);
  } catch (error) {
    res.status(400).json(error.message);
  }
};

const getAdvanceToStaffEntry = async (req, res) => {
  try {
    const { advanceNo } = req.params;

    const params = {
      advanceNo: advanceNo,
      PageNo: 1,
      PageSize: 100000,

    };


    const resultdata = await databaseService.callStoredProcedure(req,
      GET_Single_ADVANCE_TO_STAFF_PROCEDURE,
      params
    );

    res.json(resultdata);
  } catch (error) {
    res.status(400).json(error.message);
  }
};


const getAllAdvanceEntry = async (req, res) => {
  try {
    const {
      PageNo = 1,
      PageSize = 10000,
      CompanyID = 0,
      FromDate = null,
      ToDate = null
    } = req.body;

    const params = {
      PageNo,
      PageSize,
      CompanyID,
      FromDate,
      ToDate
    };

    const resultdata = await databaseService.callStoredProcedure(req,
      GET_ALL_ADVANCE_PROCEDURE,
      params
    );

    res.json(resultdata);
  } catch (error) {
    res.status(400).json(error.message);
  }
};


const updateAdvanceToStaffEntry = async (req, res) => {
  try {
    const params = {
      ID: req.params.key,
      EmpIDs: req.body.key.toString(),
      EmpType: req.body.empType,
      AdvanceAmount: req.body.advAmt,
      Date: req.body.date,
    };
    const updatedAdvanceToStaffEntry =
      await databaseService.callStoredProcedure(req,
        INSERT_OR_UPDATE_ADVANCE_TO_STAFF_PROCEDURE,
        params
      );
    res.json(updatedAdvanceToStaffEntry);
  } catch (error) {
    res.status(400).json(error.message);
  }
};

const deleteSingleAdvanceToStaffEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const params = {
      AdvanceNo: id,
      // PageNumber: 1,
      // PageSize: 100000,

    };

    const deletedAdvanceToStaffEntry =
      await databaseService.callStoredProcedure(req, DELETE_ADVANCE_TO_STAFF, params);
    res.json(deletedAdvanceToStaffEntry);
  } catch (error) {
    res.status(400).json(error.message);
  }
};

const getAdvanceToStaffEntryByType = async (req, res) => {
  try {
    const { id, type } = req.params;

    const params = {
      id: id,
      type: type,
      PageNo: 1,
      PageSize: 100000,

    };


    const resultdata = await databaseService.callStoredProcedure(req,
      GET_Single_ADVANCE_TO_STAFF_BY_TYPE_PROCEDURE,
      params
    );

    res.json(resultdata);
  } catch (error) {
    res.status(400).json(error.message);
  }
};

const getAdvanceToStaffEntryReportByAdvanceNo = async (req, res) => {
  try {
    const { AdvanceNo, CompanyID } = req.body;

    const sql = require('mssql');
    const config = {
      user: process.env.USER_NAME,
      password: process.env.PASSWORD,
      server: process.env.SERVER,
      database: process.env.DATABASE,
      options: {
        encrypt: false,
      },
    };

    const pool = await sql.connect(config);
    const request = pool.request();
    request.input('AdvanceNo', sql.NVarChar(50), AdvanceNo);
    request.input('CompanyID', sql.Int, CompanyID || 0);

    const result = await request.execute('[dbo].[spRpt_AdvanceToStaff]');

    res.json({
      status: 1,
      message: 'Success',
      data: result.recordset,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


module.exports = {
  createAdvanceToStaffEntry,
  getAllAdvanceToStaffEntry,
  updateAdvanceToStaffEntry,
  deleteSingleAdvanceToStaffEntry,
  getAllAdvanceEntry, getAdvanceToStaffEntry,
  getAdvanceToStaffEntryByType,
  // deleteSingleProductCategory,
  getAdvanceToStaffEntryReportByAdvanceNo
};
