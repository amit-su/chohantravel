const {
    GET_PROFORMA_INV_PROCEDURE,
    INSERT_STAFF_ATTENDENCE,
    GET_STAFF_ATTENDENCE,
  } = require("../../utils/constants");
  
  const databaseService = require("../../utils/dbClientService");
  
  const getAllAttendancestaff = async (req, res) => {
    try {
      console.log("req.query", req.query);
  
      const params = {
        PageNo: 1,
        Month: req.query.selectedMonth,
        PageSize: 10000,
        // Status: req.query.status,
      };
  
      const resultdata = await databaseService.callStoredProcedure(req,
        GET_STAFF_ATTENDENCE,
        params
      );
  
      res.json(resultdata);
    } catch (error) {
      res.status(400).json(error.message);
      console.log(error.message);
    }
  };
  
  const getSingleAttendance = async (req, res) => {
    try {
      const { id } = req.params;
  
      console.log("req.body", req.body);
  
      // get all product_category
  
      const params = {
        ProformaInvNo: id,
        PageNumber: req.query.page,
        PageSize: req.query.count,
      };
  
      const resultdata = await databaseService.callStoredProcedure(req,
        GET_PROFORMA_INV_PROCEDURE,
        params
      );
  
      res.json(resultdata);
    } catch (error) {
      res.status(400).json(error.message);
      console.log(error.message);
    }
  };
  const updateAttendancestaff = async (req, res) => {
    try {
      console.log(req.body);
      const result = await databaseService.callStoredProcedure(req,
        INSERT_STAFF_ATTENDENCE,
        {
          Month: req.body.month,
          EmpID: req.body.id,
          Attendance: JSON.stringify(req.body.attendance),
        }
      );
      res.json(result);
    } catch (error) {
      res.status(400).json(error.message);
      console.log(error.message);
    }
  };
  
  module.exports = {
    getAllAttendancestaff,
    updateAttendancestaff,
    getSingleAttendance,
  };
  