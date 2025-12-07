const sql = require("mssql");
const {
    GET_SITEWISE_MONTH_DUTY_SUM,
    RPT_BUS_BOOKING,
    PROFORMA_INV_REG,
    INVOICE_REG
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

        console.log("getSitewiseMonthDutySum params:", params);

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
        console.error("Error in getSitewiseMonthDutySum:", error);
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

        console.log("getBusBookingReport params:", params);

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
        console.error("Error in getBusBookingReport:", error);
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
        console.error("Error in getReport:", error);
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
        console.error("Error in getReport:", error);
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
    getInvoiceRegisterReport
};
