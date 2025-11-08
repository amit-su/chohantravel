const express = require("express");
const {
  createSingleReturnSaleInvoice,
  getAllReturnSaleInvoice,
  getSingleReturnSaleInvoice,
  updateSingleReturnSaleInvoice,
  deleteSingleReturnSaleInvoice,
} = require("./returnSaleInvoice.controllers");

const returnSaleInvoiceRoutes = express.Router();

returnSaleInvoiceRoutes.post(
  "/",
  createSingleReturnSaleInvoice
);
returnSaleInvoiceRoutes.get(
  "/",
  getAllReturnSaleInvoice
);
returnSaleInvoiceRoutes.get(
  "/:id",
  getSingleReturnSaleInvoice
);
// returnSaleInvoiceRoutes.put("/:id", authorize("updatePurchaseInvoice"), updateSinglePurchaseInvoice); // purchase invoice is not updatable
returnSaleInvoiceRoutes.patch(
  "/:id",
  deleteSingleReturnSaleInvoice
);

module.exports = returnSaleInvoiceRoutes;
