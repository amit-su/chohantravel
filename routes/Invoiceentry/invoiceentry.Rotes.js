const express = require("express");

const {
  getAllProformaInvoice,
  createInvoice,
  deleteSingleInvoice,
  getSingleInvoice,
  updateProformaInvoice,
  powerBiLogin,getPartyProformaInvoice,
  getAllInvoicebooking,deleteSinglebookingInvoice
} = require("./invoiceentry.controller");

const InvoiceRoutes = express.Router();

InvoiceRoutes.post(
  "/",
  createInvoice,

);
InvoiceRoutes.get(
  "/",
  getAllProformaInvoice
);
InvoiceRoutes.get(
    "/booking",
    getAllInvoicebooking
  );
InvoiceRoutes.get(
  "/:id",
  getSingleInvoice
);
InvoiceRoutes.get(
  '/party/:id',
  getPartyProformaInvoice
);

InvoiceRoutes.put(
  "/:id",
  updateProformaInvoice
);
InvoiceRoutes.delete(
  "/:id",
  deleteSingleInvoice
);
InvoiceRoutes.put(
  "/booking/:id/:id2",
  deleteSinglebookingInvoice
);
InvoiceRoutes.post("/powerbilogin", powerBiLogin);
module.exports = InvoiceRoutes;
