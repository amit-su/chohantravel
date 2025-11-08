const {
  INSERT_OR_UPDATE_BOOKING_PROCEDURE,
  INSERT_OR_UPDATE_BOOKING_ENTRY_PROCEDURE,
  DELETE_PROCEDURE,
  DELETE_BOOKING_ENTRY_PROCEDURE,
  GET_BOOKING_TRAN_PROCEDURE,
  GET_BOOKING_HEAD_PROCEDURE,
  GET_BOOKING_ALLOTMENT_PROCEDURE,
  INSERT_OR_UPDATE_BOOKING_ALLOTMENT_PROCEDURE,
} = require("../../utils/constants");
const databaseService = require("../../utils/dbClientService");

const createbookingBusAllotment = async (req, res) => {
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
        PaymentTerms: req.body.paymentTerms,
        localBookingList: req.body.localBookingList,
        SiteID: req.body.site,
      }
    );
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
    console.error("Error occurred:", error);
  }
};

const getAllBookingBusAllotment = async (req, res) => {
  try {
    // get all product_category
    console.log(req.query);
    const params = {
      AllotmentStatus: req.query.IsClosed ? parseInt(req.query.IsClosed) : 1,
      PageNumber: req.query.page,
      PageSize: req.query.count,
    };

    const resultdata = await databaseService.callStoredProcedure(
      req,
      GET_BOOKING_ALLOTMENT_PROCEDURE,
      params
    );

    res.json(resultdata);
  } catch (error) {
    res.status(400).json(error.message);
    console.log(error.message);
  }
};
const getSingleBookingBusAllotment = async (req, res) => {
  try {
    console.log(req.params);
    const { id, allotmentStatus } = req.params;
    const decodedId = id.replace(/-/g, "/");
    console.log(decodedId);
    // get all product_category

    const params = {
      BookingID: decodedId,
      AllotmentStatus: allotmentStatus,
      PageNumber: req.query.page,
      PageSize: req.query.count,
    };

    const resultdata = await databaseService.callStoredProcedure(
      req,
      GET_BOOKING_ALLOTMENT_PROCEDURE,
      params
    );

    res.json(resultdata);
  } catch (error) {
    res.status(400).json(error.message);
    console.log(error.message);
  }
};
const updateBookingBusAllotment = async (req, res) => {
  try {
    console.log("update bookingbusAllot:", req.body);
    const result = await databaseService.callStoredProcedure(
      req,
      INSERT_OR_UPDATE_BOOKING_ALLOTMENT_PROCEDURE,
      {
        ID: parseInt(req.body.ID),
        BookingID: req.body.BookingID,
        BookingTranID: req.body.BookingTranID,
        VendorID: 1,
        BusID: req.body.BusID,
        BusTypeID: req.body.BusTypeID,
        BusNo: req.body.BusNo,
        SittingCapacity: req.body.SittingCapacity,
        BusAllotmentStatus: req.body.BusAllotmentStatus,
        PurRate: req.body.PurRate,
        DriverID: req.body.DriverID,
        DriverContactNo: req.body.DriverContactNo,
        reportTime: req.body.reportTime,

        ExtraKMDriven: req.body.extraKM,
        ExtraHourDriven: req.body.extraHour,
        HelperID: req.body.HelperID,
        SiteID: req.body.site,
        //date,ReportDate//
        GarageOutTime: req.body.ReportDate,
        UserID: 1,
        Operation: 2,
      }
    );
    res.json(result);
  } catch (error) {
    res.status(400).json(error.message);
    console.log(error.message);
  }
};

const deleteSinglebookingBusAllotment = async (req, res) => {
  try {
    console.log("body", req.body);
    // console.log(req.body);

    const params = {
      BookingID: req.body.BookingID,
    };
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

module.exports = {
  createbookingBusAllotment,
  getAllBookingBusAllotment,
  updateBookingBusAllotment,
  deleteSinglebookingBusAllotment,
  getSingleBookingBusAllotment,
};
