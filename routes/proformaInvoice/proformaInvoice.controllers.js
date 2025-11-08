const {
  GET_PROFORMA_INV_PROCEDURE,
  INSERT_OR_UPDATE_PROFORMA_INVOICE_PROCEDURE,
  DELETE_PROCEDURE,
  GET_PROFORMA_INV_PROCEDURE_BY_PARTY,
  INSERT_OR_UPDATE_BOOKING_ENTRY_PROCEDURE,
  DELETE_PROFORMAINVOICE_TRAN,
} = require("../../utils/constants");
const powerbiservice = require("../../utils/powerbiService");

const databaseService = require("../../utils/dbClientService");

const createProformaInvoice = async (req, res) => {
  try {
    const params = {
      ID: req.body.ID || 0,
      PartyID: req.body.PartyID,
      ProformaInvNo: req.body.invoiceNo,
      companyname: req.body.companyname,
      ProformaInvDate: req.body.BookingDate,
      PartyAddr: req.body.address,
      ContactPersonName: req.body.ContactPersonName,
      ContactPersonNo: req.body.ContactPersonNo,
      PartyOrderNo: 1,
      GSTNo: req.body.GSTNO,
      ReferredBy: req.body.ReferredBy,
      TollParkingAmt: req.body.tollParking,
      GrossAmount: req.body.RoundOff,
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
      Remarks: req.body.Remarks,
      PermitReq: req.body.PermitReq,
      GstType: req.body.GstType,
      localProformaList: req.body.localProformaList,
      RefInvoiceNo: req.body.RefInvoiceNo,
      extra: req.body.extra,
    };
    const result = await databaseService.callStoredProcedure(
      req,
      INSERT_OR_UPDATE_PROFORMA_INVOICE_PROCEDURE,
      params
    );
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
    console.error("Error occurred:", error);
  }
};

const getAllProformaInvoice = async (req, res) => {
  try {
    // get all product_category
    const params = {
      PageNumber: req.query.page,
      PageSize: req.query.count,
    };

    const resultdata = await databaseService.callStoredProcedure(
      req,
      GET_PROFORMA_INV_PROCEDURE,
      params
    );

    res.json(resultdata);
  } catch (error) {
    res.status(400).json(error.message);
    console.log(error.message);
  }
};
const getSingleProformaInvoice = async (req, res) => {
  const { id } = req.params;
  console.log("req", id);

  try {
    const { id } = req.params;

    console.log("req.body", req.body);

    // get all product_category

    const params = {
      ProformaInvNo: id,
      PageNumber: req.query.page,
      PageSize: req.query.count,
    };

    const resultdata = await databaseService.callStoredProcedure(
      req,
      GET_PROFORMA_INV_PROCEDURE,
      params
    );

    res.json(resultdata);
  } catch (error) {
    res.status(400).json(error.message);
    console.log(error.message);
  }
};
const updateProformaInvoice = async (req, res) => {
  try {
    const result = await databaseService.callStoredProcedure(
      req,
      INSERT_OR_UPDATE_BOOKING_ENTRY_PROCEDURE,
      {
        PartyID: req.body.PartyID,
        ProformaInvNo: req.body.invoiceNo,
        companyname: req.body.companyname,
        ProformaInvDate: req.body.BookingDate,
        PartyAddr: req.body.address,
        ContactPersonName: req.body.ContactPersonName,
        ContactPersonNo: req.body.ContactPersonNo,
        PartyOrderNo: 1,
        GSTNo: req.body.GSTNO,
        ReferredBy: req.body.ReferredBy,
        TollParkingAmt: req.body.tollParking,
        GrossAmount: req.body.RoundOff,
        CGSTPer: req.body.CGSTPer,
        CGSTAmt: req.body.CGSTAmt,
        SGSTPer: req.body.SGSTPer,
        SGSTAmt: req.body.SGSTAmt,
        IGSTPer: req.body.IGSTPer,
        IGSTAmt: req.body.IGSTAmt,
        GstType: req.body.GstType,
        RoundOff: req.body.RoundOff,
        NetAmount: req.body.netAmount,
        AdvAmount: req.body.advancePayment,
        AdvAmtPer: req.body.AdvAmtPer,
        Remarks: req.body.Remarks,
        PermitReq: req.body.PermitReq,
        RefInvoiceNo: req.body.RefInvoiceNo,
        localProformaList: req.body.localProformaList,
      }
    );
    res.json(result);
  } catch (error) {
    res.status(400).json(error.message);
    console.log(error.message);
  }
};

const deleteSingleProformaInvoice = async (req, res) => {
  try {
    console.log("params", req.params);
    // console.log(req.body);

    const params = {
      table_name: "ProformaInvHead",
      column_name: "ProformaInvNo",
      column_value: req.params.id,
    };
    const result1 = await databaseService.callStoredProcedure(
      req,
      DELETE_PROCEDURE,
      params
    );

    const params2 = {
      table_name: "ProformaInvTran",
      column_name: "ProformaInvHeadSlNo",
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

const powerBiLogin = async (req, res) => {
  try {
    const { reportId } = req.body;

    powerbiservice(reportId)
      .then((data) => {
        console.log("Access token:", data);
        0;
        return res.json({
          data,
        });
      })
      .catch((error) => {
        console.error("Error:", error);
        return res.json({
          params,
        });
      });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getPartyProformaInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const params = {
      PartyName: id,
      PageNumber: 1,
      PageSize: 1,
    };

    const resultdata = await databaseService.callStoredProcedure(
      req,
      GET_PROFORMA_INV_PROCEDURE_BY_PARTY,
      params
    );

    res.json(resultdata);
  } catch (error) {
    res.status(400).json(error.message);
    console.log(error.message);
  }
};

const deleteproformaInvoiceTran = async (req, res) => {
  try {
    console.log("body", req.params);
    data = {
      SlNo: req.params,
    };
    const deletedbookingTran = await databaseService.callStoredProcedure(
      req,
      DELETE_PROFORMAINVOICE_TRAN,
      req.params
    );
    return res.json(deletedbookingTran);
  } catch (error) {
    res.status(400).json(error.message);
    console.log(error.message);
  }
};

module.exports = {
  createProformaInvoice,
  getAllProformaInvoice,
  updateProformaInvoice,
  deleteSingleProformaInvoice,
  getSingleProformaInvoice,
  powerBiLogin,
  getPartyProformaInvoice,
  deleteproformaInvoiceTran,
};
