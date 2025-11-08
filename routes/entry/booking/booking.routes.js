const express = require("express");

const {
  getAllBooking,
  createBooking,
  updateBooking,
  deleteSingleBooking,
} = require("./booking.controllers");

const bookingRoutes = express.Router();

bookingRoutes.post("/",  createBooking);
bookingRoutes.get("/",  getAllBooking);

bookingRoutes.put("/:id",  updateBooking);
bookingRoutes.delete("/:id", deleteSingleBooking);

module.exports = bookingRoutes;
