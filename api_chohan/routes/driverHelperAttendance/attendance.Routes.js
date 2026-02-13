const express = require("express");

const {
  getAllAttendance,
  updateAttendance,
  getSingleAttendancebymonth,
  createAttendance,
} = require("./attendance.controllers");

const authorize = require("../../utils/authorize");

const attendanceRoutes = express.Router();

attendanceRoutes.get("/", authorize(""), getAllAttendance);
attendanceRoutes.get("/:id/:date/:TYPE", authorize(""), getSingleAttendancebymonth);
attendanceRoutes.put("/:id", authorize(""), updateAttendance);
attendanceRoutes.post("/create", authorize(""), createAttendance);

module.exports = attendanceRoutes;
