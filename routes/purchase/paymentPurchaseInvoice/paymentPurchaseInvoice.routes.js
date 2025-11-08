const express = require("express");
const {
  createPaymentPurchaseInvoice,
  getAllPaymentPurchaseInvoice,
  // getSinglePaymentPurchaseInvoice,
  // updateSinglePaymentPurchaseInvoice,
  // deleteSinglePaymentPurchaseInvoice,
} = require("./paymentPurchaseInvoice.controllers");

const paymentSupplierRoutes = express.Router();

paymentSupplierRoutes.post(
  "/",
  createPaymentPurchaseInvoice
);
paymentSupplierRoutes.get(
  "/",
  getAllPaymentPurchaseInvoice
);
// paymentSupplierRoutes.get("/:id", getSinglePaymentSupplier);
// paymentSupplierRoutes.put("/:id", updateSinglePaymentSupplier);
// paymentSupplierRoutes.delete("/:id", deleteSinglePaymentSupplier);

module.exports = paymentSupplierRoutes;
