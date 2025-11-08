const express = require("express");
const {
    getAllRoles,
} = require("./role.controller");

const UsersRoutes = express.Router();

UsersRoutes.get("/",  getAllRoles);

module.exports = UsersRoutes;
