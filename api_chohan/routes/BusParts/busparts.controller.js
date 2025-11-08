const {
    INSERT_BUS_PARTS,
    DELETE_PROCEDURE,GET_BUS_PARTS,
    GET_PROFORMA_INV_PROCEDURE_BY_PARTY,
    GET_INVOICE_ENTRT_BOOKING,
    UPDATE_INVOICE_ENTRY_BOOKING
  } = require("../../utils/constants");
  const powerbiservice = require("../../utils/powerbiService");
  
  const databaseService = require("../../utils/dbClientService");
  
  const createbusparts = async (req, res) => {
    console.log(req.body,"76767")
    try {
      const params = {
        id:req.body.id,
        EntryDate:req.body.EntryDate,
        GroupID:req.body.GroupID,
        PartName:req.body.PartName,
       
      };
      console.log(params)
      const result = await databaseService.callStoredProcedure(req,
        INSERT_BUS_PARTS,
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
        PageNumber: 1,
        PageSize: 10000,
      };
  
      const resultdata = await databaseService.callStoredProcedure(req,
        GET_INVOICE_DATA,
        params
      );
  
      res.json(resultdata);
    } catch (error) {
      res.status(400).json(error.message);
      console.log(error.message);
    }
  };
  const getAllInvoicebooking = async (req, res) => {
    try {
      console.log(req.body,"tra")
      // get all product_category
      const params = {
        // InvHeadSlNo:req.body.InvHeadSlNo,
        PageSize: 10000,
      };
  
      const resultdata = await databaseService.callStoredProcedure(req,
        GET_INVOICE_ENTRT_BOOKING,
        params
      );
  
      res.json(resultdata);
    } catch (error) {
      res.status(400).json(error.message);
      console.log(error.message);
    }
  };
  const getSingleInvoice = async (req, res) => {
    try {
  
      console.log("req.body8787676", req.params.id);
      const { id } = req.params;

  
      // get all product_category
  
      const params = {
        InvNo: id,
        PageNumber: 1,
        PageSize: 100000,
      };
  
      const resultdata = await databaseService.callStoredProcedure(req,
        GET_INVOICE_DATA,
        
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
      const result = await databaseService.callStoredProcedure(req,
        INSERT_INVOICE_ENTRY,
        {
          PartyID: req.body.PartyID,
        ProformaInvNo: req.body.invoiceNo,
        companyname:req.body.companyname,
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
        IGSTPer: 0,
        IGSTAmt: 0,
        RoundOff: req.body.RoundOff,
        NetAmount: req.body.netAmount,
        AdvAmount: req.body.advancePayment,
        localProformaList: req.body.localProformaList,
        }
      );
      res.json(result);
    } catch (error) {
      res.status(400).json(error.message);
      console.log(error.message);
    }
  };
  
  const deleteSingleInvoice = async (req, res) => {
    try {
      console.log("params", req.params);
      // console.log(req.body);
  
      const params = {
        table_name: "InvoiceHead",
        column_name: "InvNo",
        column_value: req.params.id,
      };
      const result1 = await databaseService.callStoredProcedure(req,
        DELETE_PROCEDURE,
        params
      );
  
      const params2 = {
        table_name: "InvoiceTran",
        column_name: "InvHeadSlNo",
        column_value: req.params.id,
      };
      const result = await databaseService.callStoredProcedure(req,
        DELETE_PROCEDURE,
        params2
      );
  
      res.json(result);
    } catch (error) {
      res.status(400).json(error.message);
      console.log(error.message);
    }
  };
  const deleteSinglebookingInvoice = async (req, res) => {
    try {
      console.log("params", req.params,req.body);
      const{id,id2}=req.params;
      // console.log(req.body);
  
    
  
      const params = {
        idToRemove:id,
        InvHeadSlNo:id2, 
        // PageNumber: 1,
        // PageSize: 100000,
        
      };
      const result = await databaseService.callStoredProcedure(req,
        UPDATE_INVOICE_ENTRY_BOOKING,
        params
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
  const getbusparts = async (req, res) => {
    try {
  
  
  
      const params = {
        PageNumber: 1,
        PageSize: 10000,
      };
  
      const resultdata = await databaseService.callStoredProcedure(req,
        GET_BUS_PARTS,
        params
      );
  
      res.json(resultdata);
    } catch (error) {
      res.status(400).json(error.message);
      console.log(error.message);
    }
  };
  
  
  
  module.exports = {
    createbusparts,
    getAllProformaInvoice,
    updateProformaInvoice,
    deleteSingleInvoice,
    getSingleInvoice,powerBiLogin,
    getbusparts,
    getAllInvoicebooking,
    deleteSinglebookingInvoice
  };
  