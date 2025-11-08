const express = require("express");

const {
  getAllDriver,
  createDriver,
  updateDriver,
  deleteSingleDriver,
} = require("./driver.controllers");

const driverRoutes = express.Router();

driverRoutes.post("/",  createDriver);
driverRoutes.get("/",  getAllDriver);

driverRoutes.put("/:id",  updateDriver);
driverRoutes.delete("/:id",  deleteSingleDriver);

module.exports = driverRoutes;
