const express = require("express");
const {
  getAllVendor,
  addVendor,
  updateVendor,
  deleteVendor,
  getVendorDropdown,
} = require("./vendor.controller");

const vendorRoutes = express.Router();

vendorRoutes.post("/", getAllVendor);
vendorRoutes.post("/add", addVendor);
vendorRoutes.patch("/:id", updateVendor);
vendorRoutes.delete("/:id", deleteVendor);
vendorRoutes.post("/dropdown", getVendorDropdown);

module.exports = {
  vendorRoutes,
};
