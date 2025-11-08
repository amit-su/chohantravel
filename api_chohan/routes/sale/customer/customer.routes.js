const express = require("express");
const {
  createSingleCustomer,
  getAllCustomer,
  getSingleCustomer,
  updateSingleCustomer,
  deleteSingleCustomer,
} = require("./customer.controllers");

const customerRoutes = express.Router();

customerRoutes.post("/", createSingleCustomer);
customerRoutes.get("/", getAllCustomer);
customerRoutes.get("/:id", getSingleCustomer);
customerRoutes.put("/:id",  updateSingleCustomer);
customerRoutes.patch("/:id", deleteSingleCustomer);

module.exports = customerRoutes;
