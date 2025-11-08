const express = require("express");

const {
  getAllFuel,
  createFuel,
  updateFuel,
  deleteSingleFuel,
} = require("./fuel.controllers");

const fuelRoutes = express.Router();

fuelRoutes.post("/", createFuel);
fuelRoutes.get("/", getAllFuel);

fuelRoutes.put("/:id", updateFuel);
fuelRoutes.delete("/:id", deleteSingleFuel);

module.exports = fuelRoutes;
