const express = require("express");
const {
  createSingleAccount,
  getAllAccount,
  getSingleAccount,
  updateSingleAccount,
  deleteSingleAccount,
} = require("./account.controllers");

const accountRoutes = express.Router();

accountRoutes.post("/", createSingleAccount);
accountRoutes.get("/", getAllAccount);
accountRoutes.get("/:id", getSingleAccount);
accountRoutes.put("/:id", updateSingleAccount);
accountRoutes.patch(
  "/:id",
  deleteSingleAccount
);

module.exports = accountRoutes;
