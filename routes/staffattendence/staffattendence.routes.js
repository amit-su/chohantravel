const express = require("express");

// const authorize = require("../../utils/authorize"); // authentication middleware
const {
    updateAttendancestaff,
    getAllAttendancestaff,
} = require("./staffattendence.controller");

const attendancestaffRoutes = express.Router();

attendancestaffRoutes.get(
  "/",
  getAllAttendancestaff
);
// attendanceRoutes.get(
//   "/:id",
//   authorize("readSingle-proformaInvoice"),
//   getSingleProformaInvoice
// );

attendancestaffRoutes.put(
  "/:id",
  updateAttendancestaff
);
// attendanceRoutes.delete(
//   "/:id",
//   authorize("delete-proformaInvoice"),
//   deleteSingleProformaInvoice
// );

module.exports = attendancestaffRoutes;
