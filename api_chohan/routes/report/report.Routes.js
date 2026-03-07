const express = require("express");
const {
    getSitewiseMonthDutySum,
    getBusBookingReport,
    getProformaInvoiceRegisterReport,
    getInvoiceRegisterReport,
    getAdvanceDueSummReport,
    getAdvanceDueDetailListReport
} = require("./report.controller");

const ReportRoutes = express.Router();

ReportRoutes.post(
    "/sitewise-duty",
    getSitewiseMonthDutySum
);

ReportRoutes.post(
    "/bus-booking",
    getBusBookingReport
);

ReportRoutes.post(
    "/proforma-invoice-register",
    getProformaInvoiceRegisterReport
)

ReportRoutes.post(
    "/invoice-register",
    getInvoiceRegisterReport
)

ReportRoutes.post(
    "/advance-due-summary",
    getAdvanceDueSummReport
)

ReportRoutes.post(
    "/advance-due-detail",
    getAdvanceDueDetailListReport
)

module.exports = ReportRoutes;
