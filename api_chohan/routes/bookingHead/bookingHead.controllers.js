const { GET_BOOKING_HEAD_PROCEDURE } = require("../../utils/constants");
const databaseService = require("../../utils/dbClientService");

const createbookingHead = async (req, res) => {
  try {
    const result = await databaseService.callStoredProcedure(req,
      INSERT_OR_UPDATE_BOOKING_Head_PROCEDURE,
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
      }
    );
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
    console.error("Error occurred:", error);
  }
};

const getAllBookingHead = async (req, res) => {
  try {
    // get all product_category
    console.log(req.query);
    const params = {
      ClosedStatus: req.query.closedStatus,
      PageNo: 1,
      PageSize: 100000,
    };

    const resultdata = await databaseService.callStoredProcedure(req,
      GET_BOOKING_HEAD_PROCEDURE,
      params
    );

    res.json(resultdata);
  } catch (error) {
    res.status(400).json(error.message);
    console.log(error.message);
  }
};
const getSingleBookingHead = async (req, res) => {
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
const updateBookingHead = async (req, res) => {
  try {
    const result = await databaseService.callStoredProcedure(req,
      INSERT_OR_UPDATE_BOOKING_Head_PROCEDURE,
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
      }
    );
    res.json(result);
  } catch (error) {
    res.status(400).json(error.message);
    console.log(error.message);
  }
};

const deleteSinglebookingHead = async (req, res) => {
  try {
    console.log("body", req.body);
    // console.log(req.body);

    const params = {
      BookingID: req.body.BookingID,
    };
    const deletedbookingTran = await databaseService.callStoredProcedure(req,
      DELETE_BOOKING_Head_PROCEDURE,
      params
    );

    res.json(deletedbookingTran);
  } catch (error) {
    res.status(400).json(error.message);
    console.log(error.message);
  }
};

module.exports = {
  createbookingHead,
  getAllBookingHead,
  updateBookingHead,
  deleteSinglebookingHead,
  getSingleBookingHead,
};
