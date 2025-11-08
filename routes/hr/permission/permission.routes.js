const express = require("express");
const { getAllPermission } = require("./permission.controllers");

const permissionRoutes = express.Router();

permissionRoutes.get("/", getAllPermission);

module.exports = permissionRoutes;
