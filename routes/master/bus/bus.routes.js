const express = require("express");

const {
  getAllBus,
  createBus,
  updateBus,
  deleteSingleBus,
} = require("./bus.controllers");

const busRoutes = express.Router();

busRoutes.post("/",  createBus);
busRoutes.get("/",  getAllBus);

busRoutes.put("/:id",  updateBus);
busRoutes.delete("/:id",  deleteSingleBus);

module.exports = busRoutes;
