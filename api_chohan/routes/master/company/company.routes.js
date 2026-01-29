const express = require("express");

const {
  getAllCompany,
  createCompany,
  updateCompany,
  deleteSingleCompany,
} = require("./company.controllers");

const companyRoutes = express.Router();

const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

companyRoutes.post("/", upload.single("payment_qr"), createCompany);
companyRoutes.get("/", getAllCompany);

companyRoutes.put("/:id", upload.single("payment_qr"), updateCompany);
companyRoutes.delete("/:id", deleteSingleCompany);

module.exports = companyRoutes;
