const express = require("express");

const {
    createinvoicetransfer

  
} = require("./invoicetransfer.controller");

const invoicetranferRoutes = express.Router();

invoicetranferRoutes.post(
  "/",
  createinvoicetransfer
);







module.exports = invoicetranferRoutes;
