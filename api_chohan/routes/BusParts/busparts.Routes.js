const express = require("express");

const {
    createbusparts,
  getAllProformaInvoice,
  deleteSingleInvoice,
  getbusparts,
  updateProformaInvoice,
  powerBiLogin,getPartyProformaInvoice,
  getAllInvoicebooking,deleteSinglebookingInvoice
} = require("./busparts.controller");

const BuspartsRoutes = express.Router();

BuspartsRoutes.post(
  "/",
  createbusparts,

);


BuspartsRoutes.get(
  "/",
  getbusparts
);





BuspartsRoutes.post("/powerbilogin", powerBiLogin);
module.exports = BuspartsRoutes;
