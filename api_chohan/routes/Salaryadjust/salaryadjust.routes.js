const express = require("express");

const {
    getAllSalaryadjust,
    updateSalaryadjust,
} = require("./salaryadjust.controller");

const salaryadjustRoutes = express.Router();
salaryadjustRoutes.get("/", getAllSalaryadjust);

salaryadjustRoutes.post("/",  updateSalaryadjust);

module.exports = salaryadjustRoutes;
 