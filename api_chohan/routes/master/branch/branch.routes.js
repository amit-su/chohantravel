const express = require("express");

const {
  getAllBranch,
  createBranch,
  updateBranch,
  deleteSingleBranch,
} = require("./branch.controllers");

const branchRoutes = express.Router();

branchRoutes.post("/", createBranch);
branchRoutes.get("/", getAllBranch);

branchRoutes.put("/:id", updateBranch);
branchRoutes.delete("/:id", deleteSingleBranch);

module.exports = branchRoutes;
