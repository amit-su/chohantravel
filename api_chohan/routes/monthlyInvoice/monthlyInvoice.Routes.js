const express = require("express");

const {
    getAllMonthlyInvoice,
    createMonthlyInvoice,
    deleteMonthlyInvoice,
    getSingleMonthlyInvoice,
    updateMonthlyInvoice,
    getMonthlyInvoiceReport,
} = require("./monthlyInvoice.controller");

const monthlyInvoiceRoutes = express.Router();

monthlyInvoiceRoutes.post("/", createMonthlyInvoice);
monthlyInvoiceRoutes.post("/all", getAllMonthlyInvoice);
monthlyInvoiceRoutes.get("/:id", getSingleMonthlyInvoice);
monthlyInvoiceRoutes.put("/:id", updateMonthlyInvoice);
monthlyInvoiceRoutes.delete("/:id", deleteMonthlyInvoice);
monthlyInvoiceRoutes.post("/report", getMonthlyInvoiceReport);

module.exports = monthlyInvoiceRoutes;
