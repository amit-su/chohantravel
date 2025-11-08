const {
  GET_PROFORMA_INV_PROCEDURE,
  INSERT_OR_UPDATE_ATTENDANCE_PROCEDURE,
  GET_ATTENDANCE_PROCEDURE,
  GET_ATTENDANCE_PROCEDURE_BY_MONTH,
  sp_insert_drv_helper_site_attend_json,
} = require("../../utils/constants");

const databaseService = require("../../utils/dbClientService");

const getAllAttendance = async (req, res) => {
  try {
    console.log("req.query", req.query);

    const params = {
      PageNo: 1,
      Month: req.query.selectedMonth,
      PageSize: 10000,
      Status: req.query.status,
      SiteId: req.query.siteId || 0,
    };

    const resultdata = await databaseService.callStoredProcedure(
      req,
      GET_ATTENDANCE_PROCEDURE,
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

    const resultdata = await databaseService.callStoredProcedure(
      req,
      GET_PROFORMA_INV_PROCEDURE,
      params
    );

    res.json(resultdata);
  } catch (error) {
    res.status(400).json(error.message);
    console.log(error.message);
  }
};

const updateAttendance = async (req, res) => {
  try {
    const userId = databaseService.getUserIdFromToken(req);
    const attendanceWithMeta = req.body.attendance.map((att) => ({
      ...att,
      attendanceBy: userId,
      attendanceAt: new Date(),
    }));

    const result = await databaseService.callStoredProcedure(
      req,
      INSERT_OR_UPDATE_ATTENDANCE_PROCEDURE,
      {
        Month: req.body.month,
        Type: req.body.type,
        EmpID: req.body.id,
        Attendance: JSON.stringify(attendanceWithMeta),
        LastModifiedBy: userId,
      }
    );
    res.json(result);
  } catch (error) {
    res.status(400).json(error.message);
    console.log(error.message);
  }
};
const getSingleAttendancebymonth = async (req, res) => {
  try {
    const { id, date, TYPE } = req.params;

    console.log("req.body", req.params);
    const id2 = parseInt(id, 10);
    console.log(id2, "78");

    // get all product_category

    const params = {
      id: id2,
      date: date,
      TYPE: TYPE,
      PageNumber: 1,
      PageSize: 1,
    };

    const resultdata = await databaseService.callStoredProcedure(
      req,
      GET_ATTENDANCE_PROCEDURE_BY_MONTH,
      params
    );

    res.json(resultdata);
  } catch (error) {
    res.status(400).json(error.message);
    console.log(error.message);
  }
};

const createAttendance = async (req, res) => {
  try {
    const userId = databaseService.getUserIdFromToken(req);
    const attendanceWithMeta = req.body.attendance.map((att) => ({
      ...att,
    }));
    const result = await databaseService.callStored(
      req,
      sp_insert_drv_helper_site_attend_json,
      {
        AttendanceJson: JSON.stringify(attendanceWithMeta),
        CreatedBy: userId,
      }
    );
    res.json(result);
  } catch (error) {
    res.status(400).json(error.message);
    console.log(error.message);
  }
};

module.exports = {
  getAllAttendance,
  updateAttendance,
  getSingleAttendance,
  getSingleAttendancebymonth,
  createAttendance,
};
