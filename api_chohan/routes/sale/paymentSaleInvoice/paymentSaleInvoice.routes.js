const express = require("express");
const {
  createSinglePaymentSaleInvoice,
  getAllPaymentSaleInvoice,
  // getSinglePaymentSupplier,
  // updateSinglePaymentSupplier,
  // deleteSinglePaymentSupplier,
} = require("./paymentSaleInvoice.controllers");

const paymentSaleInvoiceRoutes = express.Router();

paymentSaleInvoiceRoutes.post(
  "/",
  createSinglePaymentSaleInvoice
);
paymentSaleInvoiceRoutes.get(
  "/",
  getAllPaymentSaleInvoice
);
// paymentSaleInvoiceRoutes.get("/:id", getSinglePaymentSupplier);
// paymentSaleInvoiceRoutes.put("/:id", updateSinglePaymentSupplier);
// paymentSaleInvoiceRoutes.delete("/:id", deleteSinglePaymentSupplier);

module.exports = paymentSaleInvoiceRoutes;
