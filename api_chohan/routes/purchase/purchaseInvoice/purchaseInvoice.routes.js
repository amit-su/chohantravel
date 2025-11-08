const express = require("express");
const {
  createSinglePurchaseInvoice,
  getAllPurchaseInvoice,
  getSinglePurchaseInvoice,
} = require("./purchaseInvoice.controllers");

const purchaseInvoiceRoutes = express.Router();

purchaseInvoiceRoutes.post(
  "/",
  createSinglePurchaseInvoice
);
purchaseInvoiceRoutes.get(
  "/",
  getAllPurchaseInvoice
);
purchaseInvoiceRoutes.get(
  "/:id",
  getSinglePurchaseInvoice
);

module.exports = purchaseInvoiceRoutes;
