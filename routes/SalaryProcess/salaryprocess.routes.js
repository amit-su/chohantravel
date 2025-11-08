const express = require("express");

const {
  getAllSalarydetail,
  getSalaryProcessbytypeid,
  updateSalarysetupdetails,
  getAllSalarydetailsbyid,
  saveSalaryDetails,
  deleteSaldetals,
  getAllSalary,
} = require("./salaryprocess.controller");

const salarydetailssetupRoutes = express.Router();
salarydetailssetupRoutes.get("/:details/:type/:id", getAllSalarydetailsbyid);
salarydetailssetupRoutes.post("/salary", getAllSalary);

salarydetailssetupRoutes.post("/", getAllSalarydetail);
salarydetailssetupRoutes.get("/:type/:id", getSalaryProcessbytypeid);

salarydetailssetupRoutes.post("/save", saveSalaryDetails); // This route will handle the bulk save
salarydetailssetupRoutes.post("/:id", updateSalarysetupdetails);
salarydetailssetupRoutes.delete("/:id", deleteSaldetals);

module.exports = salarydetailssetupRoutes;
