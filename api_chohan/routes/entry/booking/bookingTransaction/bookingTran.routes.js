const express = require("express");

const {
  getAllBookingTran,
  getSingleBookingTran,
} = require("./bookingTran.controllers");

const bookingTranRoutes = express.Router();

// bookingTranRoutes.post("/", authorize("create-bookingTran"), createBookingTran);
bookingTranRoutes.get(
  "/",
  getAllBookingTran
);
bookingTranRoutes.get(
  "/:id",
  getSingleBookingTran
);
// bookingTranRoutes.put("/:id", authorize("update-bookingTran"), updateBookingTran);
// bookingTranRoutes.delete("/:id", authorize("delete-bookingTran"), deleteSingleBookingTran);

module.exports = bookingTranRoutes;
