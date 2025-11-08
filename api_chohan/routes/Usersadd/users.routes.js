const express = require("express");
const {
    addUser,
    getAllUser,
    updateUser,
    deleteUser,
} = require("./users.controller");

const UsersRoutes = express.Router();

UsersRoutes.get("/",  getAllUser);

UsersRoutes.post("/", addUser);

UsersRoutes.put("/:id",  updateUser);
UsersRoutes.delete("/:id",  deleteUser);

module.exports = UsersRoutes;
