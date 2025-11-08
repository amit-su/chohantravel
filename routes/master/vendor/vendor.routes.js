const express = require("express");
const {
  getAllVendor,
  createVendor,
  deleteSingleVendor,
  updateSinglVendor,
} = require("./vendor.controller");

const vendorRoutes = express.Router();

vendorRoutes.get("/", getAllVendor);
vendorRoutes.post("/", createVendor);
vendorRoutes.delete("/:id", deleteSingleVendor);
vendorRoutes.put("/:id", updateSinglVendor);
module.exports = {
  vendorRoutes,
};
