const express = require("express");
const {
    getSitewiseMonthDutySum,
    getBusBookingReport,
    getProformaInvoiceRegisterReport,
    getInvoiceRegisterReport,
    getAdvanceDueSummReport,
    getAdvanceDueDetailListReport,
    getDriverHelperAttendanceReport
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

ReportRoutes.post(
    "/driver-helper-attendance",
    getDriverHelperAttendanceReport
);

module.exports = ReportRoutes;
