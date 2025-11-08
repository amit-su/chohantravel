const express = require("express");
const {
  createSingleReturnPurchaseInvoice,
  getAllReturnPurchaseInvoice,
  getSingleReturnPurchaseInvoice,
  updateSingleReturnPurchaseInvoice,
  deleteSingleReturnPurchaseInvoice,
} = require("./returnPurchaseInvoice.controllers");

const returnPurchaseInvoiceRoutes = express.Router();

returnPurchaseInvoiceRoutes.post(
  "/",
  createSingleReturnPurchaseInvoice
);
returnPurchaseInvoiceRoutes.get(
  "/",
  getAllReturnPurchaseInvoice
);
returnPurchaseInvoiceRoutes.get(
  "/:id",
  getSingleReturnPurchaseInvoice
);
// returnPurchaseInvoiceRoutes.put("/:id", authorize("updatePurchaseInvoice"), updateSinglePurchaseInvoice); // purchase invoice is not updatable
returnPurchaseInvoiceRoutes.patch(
  "/:id",
  deleteSingleReturnPurchaseInvoice
);

module.exports = returnPurchaseInvoiceRoutes;
