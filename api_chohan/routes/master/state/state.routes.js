const express = require("express");

const {
  getAllState,
  addState,
  deleteState,
  updateState,
} = require("./state.controller");

const stateRoutes = express.Router();

stateRoutes.get("/", getAllState);

stateRoutes.post("/", addState);

stateRoutes.put("/:id", updateState);
stateRoutes.delete("/:id", deleteState);

module.exports = stateRoutes;
