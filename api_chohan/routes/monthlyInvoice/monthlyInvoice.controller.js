const {
    GET_PROFORMA_MONTHLY_INVOICE_DATA,
    INSERT_OR_UPDATE_MONTHLY_INV_ENTRY_PROCEDURE,
    DELETE_PROCEDURE,
} = require("../../utils/constants");
const databaseService = require("../../utils/dbClientService");

const createMonthlyInvoice = async (req, res) => {
    try {
        const params = {
            ID: req.body.ID || 0,
            PartyID: req.body.PartyID,
            MonthlyInvNo: req.body.invoiceNo,
            companyname: req.body.companyname,
            MonthlyInvDate: req.body.invoiceDate,
            PartyAddr: req.body.address,
            ContactPersonName: req.body.ContactPersonName,
            ContactPersonNo: req.body.ContactPersonNo,
            PartyOrderNo: req.body.PartyOrderNo,
            GSTNo: req.body.GSTNO,
            TollParkingAmt: req.body.tollParking,
            GrossAmount: req.body.GrossAmount,
            CGSTPer: req.body.CGSTPer,
            CGSTAmt: req.body.CGSTAmt,
            SGSTPer: req.body.SGSTPer,
            SGSTAmt: req.body.SGSTAmt,
            IGSTPer: req.body.IGSTPer,
            IGSTAmt: req.body.IGSTAmt,
            RoundOff: req.body.RoundOff,
            NetAmount: req.body.netAmount,
            AdvAmount: req.body.advancePayment,
            AdvAmtPer: req.body.AdvAmtPer,
            CompanyID: req.body.CompanyID,
            GstType: req.body.GstType,
            RefInvoiceNo: req.body.RefInvoiceNo,
            Remarks: req.body.Remarks,
            PermitReq: req.body.PermitReq,
            localProformaList: req.body.localProformaList,
            extra: req.body.extra,
        };
        const result = await databaseService.callStoredProcedure(
            req,
            INSERT_OR_UPDATE_MONTHLY_INV_ENTRY_PROCEDURE,
            params
        );
        res.json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
        console.error("Error occurred:", error);
    }
};

const getAllMonthlyInvoice = async (req, res) => {
    try {
        const params = {
            PageNumber: req.body.page || 1,
            PageSize: req.body.count || 10,
            CompanyID: req.body.companyId || 0,
            MonthlyInvDate: req.body.invoiceDate || null,
            SearchText: req.body.searchText || null,
            MonthlyInvNo: null,
        };

        const resultdata = await databaseService.callStoredProcedure(
            req,
            GET_PROFORMA_MONTHLY_INVOICE_DATA,
            params
        );

        res.json(resultdata);
    } catch (error) {
        res.status(400).json(error.message);
        console.log(error.message);
    }
};

const getSingleMonthlyInvoice = async (req, res) => {
    try {
        const { id } = req.params;
        const params = {
            PageNumber: 1,
            PageSize: 10,
            MonthlyInvNo: id,
        };

        const resultdata = await databaseService.callStoredProcedure(
            req,
            GET_PROFORMA_MONTHLY_INVOICE_DATA,
            params
        );

        res.json(resultdata);
    } catch (error) {
        res.status(400).json(error.message);
        console.log(error.message);
    }
};

const updateMonthlyInvoice = async (req, res) => {
    return createMonthlyInvoice(req, res);
};

const deleteMonthlyInvoice = async (req, res) => {
    try {
        const params = {
            table_name: "MonthlyInvHead",
            column_name: "ID",
            column_value: req.params.id,
        };
        const result1 = await databaseService.callStoredProcedure(
            req,
            DELETE_PROCEDURE,
            params
        );

        const params2 = {
            table_name: "MonthlyInvTran",
            column_name: "InvHeadSlNo",
            column_value: req.params.id,
        };
        const result = await databaseService.callStoredProcedure(
            req,
            DELETE_PROCEDURE,
            params2
        );

        res.json(result);
    } catch (error) {
        res.status(400).json(error.message);
        console.log(error.message);
    }
};

const getMonthlyInvoiceReport = async (req, res) => {
    try {
        const { invoiceNo } = req.body;
        const params = {
            PageNumber: 1,
            PageSize: 10,
            MonthlyInvNo: invoiceNo,
        };

        const resultdata = await databaseService.callStoredProcedure(
            req,
            GET_PROFORMA_MONTHLY_INVOICE_DATA,
            params
        );

        res.json(resultdata);
    } catch (error) {
        res.status(400).json(error.message);
        console.log(error.message);
    }
};

module.exports = {
    createMonthlyInvoice,
    getAllMonthlyInvoice,
    getSingleMonthlyInvoice,
    updateMonthlyInvoice,
    deleteMonthlyInvoice,
    getMonthlyInvoiceReport,
};
