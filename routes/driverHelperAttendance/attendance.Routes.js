const express = require("express");

const {
  getAllAttendance,
  updateAttendance,
  getSingleAttendancebymonth,
  createAttendance,
} = require("./attendance.controllers");

const attendanceRoutes = express.Router();

attendanceRoutes.get("/", getAllAttendance);
// attendanceRoutes.get(
//   "/:id",
//   authorize("readSingle-proformaInvoice"),
//   getSingleProformaInvoice
// );
attendanceRoutes.get("/:id/:date/:TYPE", getSingleAttendancebymonth);

attendanceRoutes.put("/:id", updateAttendance);

attendanceRoutes.post("/create", createAttendance);
// attendanceRoutes.delete(
//   "/:id",
//   authorize("delete-proformaInvoice"),
//   deleteSingleProformaInvoice
// );

module.exports = attendanceRoutes;
