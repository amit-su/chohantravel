const express = require("express");
const {
  createSingleRole,
  getAllRole,
  getSingleRole,
  updateSingleRole,
  deleteSingleRole,
} = require("./role.controllers");

const roleRoutes = express.Router();

roleRoutes.post("/", createSingleRole);
roleRoutes.get("/", getAllRole);
roleRoutes.get("/:id", getSingleRole);
roleRoutes.put("/:id", updateSingleRole);
roleRoutes.patch("/:id", deleteSingleRole);

module.exports = roleRoutes;
