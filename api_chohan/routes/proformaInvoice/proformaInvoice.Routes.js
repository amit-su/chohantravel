const express = require("express");

const {
  getAllProformaInvoice,
  createProformaInvoice,
  deleteSingleProformaInvoice,
  getSingleProformaInvoice,
  updateProformaInvoice,
  powerBiLogin,
  getPartyProformaInvoice,
  deleteproformaInvoiceTran,
  getProformaInvoiceReport,
} = require("./proformaInvoice.controllers");

const proformaInvoiceRoutes = express.Router();

proformaInvoiceRoutes.post("/", createProformaInvoice);
proformaInvoiceRoutes.get("/", getAllProformaInvoice);
proformaInvoiceRoutes.post("/report", getProformaInvoiceReport);
proformaInvoiceRoutes.get("/:id", getSingleProformaInvoice);
proformaInvoiceRoutes.get("/party/:id", getPartyProformaInvoice);

proformaInvoiceRoutes.put("/:id", updateProformaInvoice);
proformaInvoiceRoutes.delete("/:id", deleteSingleProformaInvoice);

proformaInvoiceRoutes.delete("/proformatran/:SlNo", deleteproformaInvoiceTran);

proformaInvoiceRoutes.post("/powerbilogin", powerBiLogin);
module.exports = proformaInvoiceRoutes;
