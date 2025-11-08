const express = require("express");
const {
  createSingleSupplier,
  getAllSupplier,
  getSingleSupplier,
  updateSingleSupplier,
  deleteSingleSupplier,
} = require("./supplier.controllers");

const supplierRoutes = express.Router();

supplierRoutes.post("/", createSingleSupplier);
supplierRoutes.get("/", getAllSupplier);
supplierRoutes.get("/:id", getSingleSupplier);
supplierRoutes.put("/:id", updateSingleSupplier);
supplierRoutes.patch("/:id", deleteSingleSupplier);

module.exports = supplierRoutes;
