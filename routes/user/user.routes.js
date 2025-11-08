const express = require("express");
const {
  login,
  register,
  getAllUser,
  getSingleUser,
  updateSingleUser,
  deleteSingleUser,
  powerBiLogin,
} = require("./user.controller.js");
const userRoutes = express.Router();

userRoutes.post("/login", login); // public route
userRoutes.post("/register", register); // public route
userRoutes.get("/", getAllUser); // viewUser only
userRoutes.get("/:id", getSingleUser); // authenticated users can view their own and viewUser
userRoutes.put("/:id", updateSingleUser); // authenticated users can update their own and updateUser
userRoutes.patch("/:id", deleteSingleUser); // deleteUser only
userRoutes.post("/powerbilogin", powerBiLogin);
module.exports = userRoutes;
