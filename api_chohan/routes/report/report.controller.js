const sql = require("mssql");
const {
    GET_SITEWISE_MONTH_DUTY_SUM,
    RPT_BUS_BOOKING,
    PROFORMA_INV_REG,
    INVOICE_REG,
    RPT_ADVANCE_DUE_SUMM,
    RPT_ADVANCE_DUE_DETAIL_LIST,
    RPT_DRIVER_HELPER_ATTENDANCE,
} = require("../../utils/constants");
const databaseService = require("../../utils/dbClientService");

const getSitewiseMonthDutySum = async (req, res) => {
    try {
        const { SDate, EDate, EmpType, EmpName } = req.body;

        // Validate required parameters
        if (!SDate || !EDate || !EmpType) {
            return res.status(400).json({
                status: 0,
                message: "Missing required parameters: SDate, EDate, or EmpType"
            });
        }

        const params = {
            SDate: SDate,
            EDate: EDate,
            EmpType: EmpType,
            EmpName: EmpName || '' // Default to empty string if not provided
        };


        const result = await databaseService.callStoredProcedureReporting(req,
            GET_SITEWISE_MONTH_DUTY_SUM,
            params
        );

        res.json({
            status: 1,
            message: 'Success',
            data: result
        });
    } catch (error) {
        res.status(400).json({
            status: 0,
            message: error.message
        });
    }
};



const getBusBookingReport = async (req, res) => {
    try {
        const { StartDate, EndDate } = req.body;

        if (!StartDate || !EndDate) {
            return res.status(400).json({
                status: 0,
                message: "Missing required parameters: StartDate or EndDate"
            });
        }

        const params = {
            StartDate: StartDate,
            EndDate: EndDate
        };


        const result = await databaseService.callStoredProcedureReporting(req,
            RPT_BUS_BOOKING,
            params
        );

        res.json({
            status: 1,
            message: 'Success',
            data: result
        });
    } catch (error) {
        res.status(400).json({
            status: 0,
            message: error.message
        });
    }
};



const getProformaInvoiceRegisterReport = async (req, res) => {
    try {
        const { StartDate, EndDate, PartyName } = req.body;

        if (!StartDate || !EndDate) {
            return res.status(400).json({
                status: 0,
                message: "Missing required parameters: StartDate or EndDate"
            });
        }

        const params = {
            SDate: StartDate,
            EDate: EndDate,
            PartyName: PartyName || ''
        };


        const result = await databaseService.callStoredProcedureReporting(req,
            PROFORMA_INV_REG,
            params
        );
        res.json({
            status: 1,
            message: 'Success',
            data: result
        });
    } catch (error) {
        res.status(400).json({
            status: 0,
            message: error.message
        });
    }
};

const getInvoiceRegisterReport = async (req, res) => {
    try {
        const { StartDate, EndDate, PartyName } = req.body;

        if (!StartDate || !EndDate) {
            return res.status(400).json({
                status: 0,
                message: "Missing required parameters: StartDate or EndDate"
            });
        }

        const params = {
            SDate: StartDate,
            EDate: EndDate,
            PartyName: PartyName || ''
        };


        const result = await databaseService.callStoredProcedureReporting(req,
            INVOICE_REG,
            params
        );
        res.json({
            status: 1,
            message: 'Success',
            data: result
        });
    } catch (error) {
        res.status(400).json({
            status: 0,
            message: error.message
        });
    }
};

const getAdvanceDueSummReport = async (req, res) => {
    try {
        const result = await databaseService.callStoredProcedureReporting(req,
            RPT_ADVANCE_DUE_SUMM,
            {}
        );
        res.json({
            status: 1,
            message: 'Success',
            data: result
        });
    } catch (error) {
        res.status(400).json({
            status: 0,
            message: error.message
        });
    }
};

const getAdvanceDueDetailListReport = async (req, res) => {
    try {
        const result = await databaseService.callStoredProcedureReporting(req,
            RPT_ADVANCE_DUE_DETAIL_LIST,
            {}
        );
        res.json({
            status: 1,
            message: 'Success',
            data: result
        });
    } catch (error) {
        res.status(400).json({
            status: 0,
            message: error.message
        });
    }
};

const getDriverHelperAttendanceReport = async (req, res) => {
    try {
        const { month, year, empType, companyId, siteId } = req.body;

        if (!month || !year || !empType) {
            return res.status(400).json({
                status: 0,
                message: "Missing required parameters: month, year, or empType"
            });
        }

        // Format parameters as expected by spRpt_driver_helper_attendance
        const params = {
            PageNo: 1,
            PageSize: 10000,
            Month: `${month}/${year}`, // Expected format: 'MM/yyyy'
            Status: empType.charAt(0).toUpperCase() + empType.slice(1).toLowerCase(), // Expected: 'Driver' or 'Helper'
            SiteId: siteId || 0,
            CompanyID: companyId || 0
        };


        // Note: callStoredProcedure handles StatusID, StatusMessage, and TotalCount as OUTPUT parameters
        const result = await databaseService.callStoredProcedure(req,
            RPT_DRIVER_HELPER_ATTENDANCE,
            params
        );

        res.json({
            status: 1,
            message: 'Success',
            data: result // result will have { status, message, count, data: recordset }
        });
    } catch (error) {
        res.status(400).json({
            status: 0,
            message: error.message
        });
    }
};

module.exports = {
    getSitewiseMonthDutySum,
    getBusBookingReport,
    getProformaInvoiceRegisterReport,
    getInvoiceRegisterReport,
    getAdvanceDueSummReport,
    getAdvanceDueDetailListReport,
    getDriverHelperAttendanceReport
};
