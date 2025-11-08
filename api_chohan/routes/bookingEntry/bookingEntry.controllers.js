const {
  INSERT_OR_UPDATE_BOOKING_ENTRY_PROCEDURE,
  DELETE_BOOKING_ENTRY_PROCEDURE,
  GET_BOOKING_TRAN_PROCEDURE,
  GET_BOOKING_HEAD_PROCEDURE,
  CHECK_BUS_STOCK,
  DELETE_BOOKING_TRAN,
} = require("../../utils/constants");
const databaseService = require("../../utils/dbClientService");

const createbookingEntry = async (req, res) => {
  console.log(req.body.localBookingList);

  try {
    const result = await databaseService.callStoredProcedure(
      req,
      INSERT_OR_UPDATE_BOOKING_ENTRY_PROCEDURE,
      {
        PartyID: req.body.PartyID,
        BookingNo: req.body.BookingNo,
        BookingDate: req.body.bookingDate,
        Email: req.body.email,
        Address: req.body.address,
        ContactPersonName: req.body.ContactPersonName,
        GSTInclude: req.body.includeGST,
        ContactPersonNo: req.body.ContactPersonNo,
        PaymentTerms: req.body.paymentTerms,
        PermitReq: req.body.PermitReq,
        localBookingList: req.body.localBookingList,
      }
    );
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
    console.error("Error occurred:", error);
  }
};

const isBusAvalable = async (req, res) => {
  try {
    console.log(req.body);
    const params = {
      BusTypeID: parseInt(req.body.busType),
      StartDate: req.body.ReportDate,
      EndDate: req.body.tripEndDate,
      SitCapacity: req.body.sittingCapacity,
      Quantity: req.body.busQty,
      RateType: req.body.rateType,
    };

    const resultdata = await databaseService.callStoredProcedure(
      req,
      CHECK_BUS_STOCK,
      params
    );
    console.log("resultdata", resultdata);
    res.json(resultdata);
  } catch (error) {
    res.status(400).json(error.message);
    console.log(error.message);
  }
};
const getAllBookingEntry = async (req, res) => {
  try {
    // get all product_category
    const params = {
      PageNo: req.query.page,
      PageSize: req.query.count,
    };

    const resultdata = await databaseService.callStoredProcedure(
      req,
      GET_BOOKING_HEAD_PROCEDURE,
      params
    );

    res.json(resultdata);
  } catch (error) {
    res.status(400).json(error.message);
    console.log(error.message);
  }
};
const getSingleBookingEntry = async (req, res) => {
  console.log(req.params);
  try {
    console.log(req.params);
    const { id } = req.params;
    const decodedId = id.replace(/-/g, "/");

    // get all product_category

    const params = {
      BookingID: decodedId,
      PageNo: 1,
      PageSize: 10000,
    };

    const resultdata = await databaseService.callStoredProcedure(
      req,
      GET_BOOKING_TRAN_PROCEDURE,
      params
    );

    res.json(resultdata);
  } catch (error) {
    res.status(400).json(error.message);
    console.log(error.message);
  }
};
const updateBookingEntry = async (req, res) => {
  try {
    const result = await databaseService.callStoredProcedure(
      req,
      INSERT_OR_UPDATE_BOOKING_ENTRY_PROCEDURE,
      {
        PartyID: req.body.PartyID,
        BookingNo: req.body.BookingNo,
        BookingDate: req.body.bookingDate,
        Email: req.body.email,
        Address: req.body.address,
        ContactPersonName: req.body.ContactPersonName,
        ContactPersonNo: req.body.ContactPersonNo,
        GSTInclude: req.body.includeGST,
        PaymentTerms: req.body.paymentTerms,
        PermitReq: req.body.PermitReq,

        localBookingList: req.body.localBookingList,
      }
    );
    res.json(result);
  } catch (error) {
    res.status(400).json(error.message);
    console.log(error.message);
  }
};

const deleteSinglebookingEntry = async (req, res) => {
  try {
    console.log("body", req.body);
    // console.log(req.body);

    const params = {
      BookingID: req.body.BookingID,
    };
    console.log("data", req, params);
    const deletedbookingTran = await databaseService.callStoredProcedure(
      req,
      DELETE_BOOKING_ENTRY_PROCEDURE,
      params
    );

    res.json(deletedbookingTran);
  } catch (error) {
    res.status(400).json(error.message);
    console.log(error.message);
  }
};

const deleteBookingTranById = async (req, res) => {
  try {
    console.log("body", req.params);
    // console.log(req.body);

    // const params = {
    //   ID: ,
    // };
    const deletedbookingTran = await databaseService.callStoredProcedure(
      req,
      DELETE_BOOKING_TRAN,
      req.params
    );

    res.json(deletedbookingTran);
  } catch (error) {
    res.status(400).json(error.message);
    console.log(error.message);
  }
};

module.exports = {
  createbookingEntry,
  getAllBookingEntry,
  updateBookingEntry,
  deleteSinglebookingEntry,
  getSingleBookingEntry,
  isBusAvalable,
  deleteBookingTranById,
};
