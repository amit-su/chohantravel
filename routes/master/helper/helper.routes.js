const express = require("express");
const {
  getAllHelper,
  createHelper,
  updateHelper,
  deleteSingleHelper,
} = require("./helper.controllers");

const helperRoutes = express.Router();

helperRoutes.post("/",  createHelper);
helperRoutes.get("/", getAllHelper);
helperRoutes.put("/:id",  updateHelper);
helperRoutes.delete("/:id",  deleteSingleHelper);

module.exports = helperRoutes;
