const express = require("express");
const {
  getAllCity,
  addCity,
  deleteCity,
  updateCity,
} = require("./city.controllers");

const cityRoutes = express.Router();

cityRoutes.get("/",  getAllCity);

cityRoutes.post("/", addCity);

cityRoutes.put("/:id",  updateCity);
cityRoutes.delete("/:id",  deleteCity);

module.exports = cityRoutes;
