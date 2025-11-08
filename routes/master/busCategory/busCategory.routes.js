const express = require("express");

const {
  getAllBusCategory,
  createBusCategory,
  updateBusCategory,
  deleteSingleBusCategory,
} = require("./busCategory.controllers");

const busCategoryRoutes = express.Router();

busCategoryRoutes.post("/",  createBusCategory);
busCategoryRoutes.get("/",  getAllBusCategory);

busCategoryRoutes.put(
  "/:id",
  
  updateBusCategory
);
busCategoryRoutes.delete(
  "/:id",
  
  deleteSingleBusCategory
);

module.exports = busCategoryRoutes;
