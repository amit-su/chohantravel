const { GET_BOOKING_TRAN_PROCEDURE } = require("../../../../utils/constants");
const databaseService = require("../../../../utils/dbClientService");

const createBookingTran = async (req, res) => {
  try {
    // console.log("bookingTranTranbody", req.body);
    const result = await databaseService.callStoredProcedure(req,
      INSERT_OR_UPDATE_BOOKING_PROCEDURE,
      {
        PartyID: req.body.PartyID,
        BookingNo: 1,
        ReportAddr: req.body.address,
        ContactPersonName: req.body.ContactPersonName,
        ContactPersonNo: req.body.ContactPersonNo,
        RateType: "null",
        ParkingExtra: req.body.tollParking.toString(),
        TollTaxExtra: -1,
        Advance: 0,
        EntryDate: req.body.BookingDate,
        localBookingList: req.body.localBookingList,
      }
    );
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
    console.error("Error occurred:", error);
  }
};

const getAllBookingTran = async (req, res) => {
  try {
    // get all product_category
    const params = {
      PageNo: req.query.page,
      PageSize: req.query.count,
    };

    const resultdata = await databaseService.callStoredProcedure(req,
      GET_BOOKING_TRAN_PROCEDURE,
      params
    );

    res.json(resultdata);
  } catch (error) {
    res.status(400).json(error.message);
    console.log(error.message);
  }
};
const getSingleBookingTran = async (req, res) => {
  try {
    console.log(req.params);
    const { id } = req.params;

    // get all product_category

    const params = {
      BookingTranID: id,
      PageNo: req.query.page,
      PageSize: req.query.count,
    };

    const resultdata = await databaseService.callStoredProcedure(req,
      GET_BOOKING_TRAN_PROCEDURE,
      params
    );

    res.json(resultdata);
  } catch (error) {
    res.status(400).json(error.message);
    console.log(error.message);
  }
};
const updateBookingTran = async (req, res) => {
  try {
    const params = {
      BookingID: req.params.id,
      BookingName: req.body.bookingTranName,
      BookingType: req.body.bookingTranName,
      BranchID: req.body.branchId,
      BookingCategory: req.body.bookingTranCategory,
      SittingCapacity: req.body.sittingCapacity,
      Make: req.body.make,
      Model: req.body.model,
      EngineNo: req.body.engineNo,
      ChasisNo: req.body.chasisNo,
      Operation: 2,
    };
    const updatedBookingTran = await databaseService.callStoredProcedure(req,
      INSERT_OR_UPDATE_BUS_PROCEDURE,
      params
    );
    res.json(updatedBooking);
  } catch (error) {
    res.status(400).json(error.message);
    console.log(error.message);
  }
};

const deleteSingleBookingTran = async (req, res) => {
  try {
    // delete Booking
    const params = {
      table_name: "BookingMast",
      column_name: "id",
      column_value: req.params.id,
    };
    const deletedBookingTran = await databaseService.callStoredProcedure(req,
      DELETE_PROCEDURE,
      params
    );
    res.json(deletedBooking);
  } catch (error) {
    res.status(400).json(error.message);
    console.log(error.message);
  }
};

module.exports = {
  // createBooking,
  getAllBookingTran,
  getSingleBookingTran,
  // updateBooking,
  // deleteSingleBooking,
  // deleteSingleProductCategory,
};
