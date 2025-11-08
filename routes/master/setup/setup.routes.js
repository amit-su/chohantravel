const express = require("express");
const {
  getSetupPaginated,
  addSetup,
  deleteSetup,
  updateSetup,
} = require("./setup.controller");

const setupRoutes = express.Router();

setupRoutes.get("/", getSetupPaginated);
setupRoutes.post("/", addSetup);
setupRoutes.delete("/:id", deleteSetup);
setupRoutes.patch("/:id", updateSetup);

module.exports = {
  setupRoutes,
};
