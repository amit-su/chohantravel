const express = require("express");
const {
  createSingleSaleInvoice,
  getAllSaleInvoice,
  getSingleSaleInvoice,
} = require("./saleInvoice.controllers");

const saleInvoiceRoutes = express.Router();

saleInvoiceRoutes.post(
  "/",
  createSingleSaleInvoice
);
saleInvoiceRoutes.get("/", getAllSaleInvoice);
saleInvoiceRoutes.get(
  "/:id",
  getSingleSaleInvoice
);

module.exports = saleInvoiceRoutes;
