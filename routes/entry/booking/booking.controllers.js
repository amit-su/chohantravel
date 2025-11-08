const databaseService = require("../../../utils/dbClientService");
const {
  GET_BUS_PROCEDURE,
  INSERT_OR_UPDATE_BUS_PROCEDURE,
  DELETE_PROCEDURE,
  INSERT_OR_UPDATE_BOOKING_PROCEDURE,
} = require("../../../utils/constants");

const createBooking = async (req, res) => {
  try {
    // console.log("booking body", req.body);
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

const getAllBooking = async (req, res) => {
  try {
    // get all product_category
    const params = {
      PageNumber: 1,
      PageSize: 10000,
    };

    const resultdata = await databaseService.callStoredProcedure(req,
      GET_BUS_PROCEDURE,
      params
    );

    res.json(resultdata);
  } catch (error) {
    res.status(400).json(error.message);
    console.log(error.message);
  }
};

const updateBooking = async (req, res) => {
  try {
    const params = {
      BookingID: req.params.id,
      BookingName: req.body.bookingName,
      BookingType: req.body.bookingName,
      BranchID: req.body.branchId,
      BookingCategory: req.body.bookingCategory,
      SittingCapacity: req.body.sittingCapacity,
      Make: req.body.make,
      Model: req.body.model,
      EngineNo: req.body.engineNo,
      ChasisNo: req.body.chasisNo,
      Operation: 2,
    };
    const updatedBooking = await databaseService.callStoredProcedure(req,
      INSERT_OR_UPDATE_BUS_PROCEDURE,
      params
    );
    res.json(updatedBooking);
  } catch (error) {
    res.status(400).json(error.message);
    console.log(error.message);
  }
};

const deleteSingleBooking = async (req, res) => {
  try {
    // delete Booking
    const params = {
      table_name: "BookingMast",
      column_name: "id",
      column_value: req.params.id,
    };
    const deletedBooking = await databaseService.callStoredProcedure(req,
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
  createBooking,
  getAllBooking,
  updateBooking,
  deleteSingleBooking,
  // deleteSingleProductCategory,
};
