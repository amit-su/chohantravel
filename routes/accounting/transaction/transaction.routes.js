const express = require("express");
const {
  createSingleTransaction,
  getAllTransaction,
  getSingleTransaction,
  updateSingleTransaction,
  deleteSingleTransaction,
} = require("./transaction.controllers");

const transactionRoutes = express.Router();

transactionRoutes.post(
  "/",
  createSingleTransaction
);
transactionRoutes.get("/", getAllTransaction);
transactionRoutes.get(
  "/:id",
  getSingleTransaction
);
transactionRoutes.put(
  "/:id",
  updateSingleTransaction
);
transactionRoutes.patch(
  "/:id",
  deleteSingleTransaction
);

module.exports = transactionRoutes;
