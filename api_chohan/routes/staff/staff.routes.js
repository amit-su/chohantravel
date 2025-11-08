const express = require("express");
const {
    createStaff,
    getAllStaff,
    updateStaff,
    deleteSingleStaff,
} = require("./staff.controller");

const StaffRoutes = express.Router();

StaffRoutes.post("/",  createStaff);
StaffRoutes.get("/", getAllStaff);
StaffRoutes.put("/:id",  updateStaff);
StaffRoutes.delete("/:id",  deleteSingleStaff);

module.exports = StaffRoutes;
