const express = require("express");

const {
  getAllSalarydetail,
  getSalaryProcessbytypeid,
  updateSalarysetupdetails,
  getAllSalarydetailsbyid,
  saveSalaryDetails,
  deleteSaldetals,
  getAllSalary,
  getSalarySlipReport,
  getSalaryRegisterReport,
  getKhorakiReport,
} = require("./salaryprocess.controller");

const salarydetailssetupRoutes = express.Router();

// Salary slip report route - POST request
salarydetailssetupRoutes.post("/slip-report", getSalarySlipReport);

// Salary register report route - POST request
salarydetailssetupRoutes.post("/register-report", getSalaryRegisterReport);

// Khoraki report route - POST request
salarydetailssetupRoutes.post("/khoraki-report", getKhorakiReport);

salarydetailssetupRoutes.get("/:details/:type/:id", getAllSalarydetailsbyid);
salarydetailssetupRoutes.post("/salary", getAllSalary);

salarydetailssetupRoutes.post("/", getAllSalarydetail);
salarydetailssetupRoutes.get("/:type/:id", getSalaryProcessbytypeid);

salarydetailssetupRoutes.post("/save", saveSalaryDetails); // This route will handle the bulk save
salarydetailssetupRoutes.post("/:id", updateSalarysetupdetails);
salarydetailssetupRoutes.delete("/:id", deleteSaldetals);

module.exports = salarydetailssetupRoutes;
