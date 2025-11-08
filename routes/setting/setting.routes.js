const express = require("express");
const { updateSetting, getSetting } = require("./setting.controllers");

const settingRoutes = express.Router();

settingRoutes.put("/", updateSetting);
settingRoutes.get("/", getSetting);

module.exports = settingRoutes;
