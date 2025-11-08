const databaseService = require("../../utils/dbClientService");

const {
  GET_ADVANCE_TO_STAFF_PROCEDURE,
  INSERT_OR_UPDATE_ADVANCE_TO_STAFF_PROCEDURE,
  DELETE_PROCEDURE,GET_ALL_ADVANCE_PROCEDURE,
  GET_Single_ADVANCE_TO_STAFF_PROCEDURE,DELETE_ADVANCE_TO_STAFF,
  GET_Single_ADVANCE_TO_STAFF_BY_TYPE_PROCEDURE
} = require("../../utils/constants");

const createAdvanceToStaffEntry = async (req, res) => {
  try {
    console.log(req.body);
    const result = await databaseService.callStoredProcedure(req,
      INSERT_OR_UPDATE_ADVANCE_TO_STAFF_PROCEDURE,
      {
        AdvanceNo: req.body.AdvanceNo,
        EmpType: req.body.driverHelper,
        Date: req.body.date,
        transactions: req.body.transactions,
      }
    );
    console.log(result);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
    console.error("Error occurred:", error);
  }
};



const getAllAdvanceToStaffEntry = async (req, res) => {
  try {
    console.log(req.params);
    const { id,date } = req.params;
    const decodedId = id;
    console.log("Date",date)
    const params = {
      type: decodedId,
      Date:date,
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
    console.log(error.message);
  }
};

const getAdvanceToStaffEntry = async (req, res) => {
  try {
    console.log(req.params);
    const {advanceNo } = req.params;

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
    console.log(error.message);
  }
};


const getAllAdvanceEntry = async (req, res) => {
  try {
    console.log(req.params);
    const { id,date } = req.params;
    const decodedId = id;
    console.log("Date",date)
    const params = {
    
      PageNo: 1,
       PageSize: 10000,
    };


    const resultdata = await databaseService.callStoredProcedure(req,
      GET_ALL_ADVANCE_PROCEDURE,
      params
    );

    res.json(resultdata);
  } catch (error) {
    res.status(400).json(error.message);
    console.log(error.message);
  }
};


const updateAdvanceToStaffEntry = async (req, res) => {
  try {
    console.log(req.body);
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
      console.log(updatedAdvanceToStaffEntry,"fyrt");
    res.json(updatedAdvanceToStaffEntry);
  } catch (error) {
    res.status(400).json(error.message);
    console.log(error.message);
  }
};

const deleteSingleAdvanceToStaffEntry = async (req, res) => {
  try {
    const{id}=req.params;
    const params = {
      AdvanceNo:id,
      // PageNumber: 1,
      // PageSize: 100000,
      
    };

    const deletedAdvanceToStaffEntry =
      await databaseService.callStoredProcedure(req,DELETE_ADVANCE_TO_STAFF, params);
    res.json(deletedAdvanceToStaffEntry);
  } catch (error) {
    res.status(400).json(error.message);
    console.log(error.message);
  }
};

const getAdvanceToStaffEntryByType = async (req, res) => {
  try {
    console.log(req.params);
    const {id,type } = req.params;

    const params = {
      id: id,
      type:type,
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
    console.log(error.message);
  }
};


module.exports = {
  createAdvanceToStaffEntry,
  getAllAdvanceToStaffEntry,
  updateAdvanceToStaffEntry,
  deleteSingleAdvanceToStaffEntry,
  getAllAdvanceEntry,getAdvanceToStaffEntry,
  getAdvanceToStaffEntryByType
  // deleteSingleProductCategory,
};
