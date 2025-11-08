const express = require("express");

const {
  getAllCompany,
  createCompany,
  updateCompany,
  deleteSingleCompany,
} = require("./company.controllers");

const companyRoutes = express.Router();

companyRoutes.post("/",  createCompany);
companyRoutes.get("/",  getAllCompany);

companyRoutes.put("/:id",  updateCompany);
companyRoutes.delete("/:id",  deleteSingleCompany);

module.exports = companyRoutes;
