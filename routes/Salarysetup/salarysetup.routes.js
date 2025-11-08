const express = require("express");

const {
    getAllSalary,
    updateSalarysetup,
    deleteSingleSalary,getAllSalarybyid
} = require("./salarysetup.controller");

const salarysetupRoutes = express.Router();

salarysetupRoutes.get("/:id", getAllSalary);
salarysetupRoutes.get("/byid/:id", getAllSalarybyid);


salarysetupRoutes.patch("/:id",  updateSalarysetup);
salarysetupRoutes.delete("/:id",  deleteSingleSalary);

module.exports = salarysetupRoutes;
 