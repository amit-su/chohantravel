const express = require("express");

const {
  createbookingBusAllotment,
  deleteSinglebookingBusAllotment,
  getSingleBookingBusAllotment,
  getAllBookingBusAllotment,
  updateBookingBusAllotment,
} = require("./bookingBusAllotment.controllers");

const bookingBusAllotmentRoutes = express.Router();

bookingBusAllotmentRoutes.post(
  "/",
  createbookingBusAllotment
);
bookingBusAllotmentRoutes.get(
  "/",
  getAllBookingBusAllotment
);
bookingBusAllotmentRoutes.get(
  "/:id/:allotmentStatus/",
  getSingleBookingBusAllotment
);

bookingBusAllotmentRoutes.put(
  "/:id",
  updateBookingBusAllotment
);
bookingBusAllotmentRoutes.delete(
  "/",
  deleteSinglebookingBusAllotment
);

module.exports = bookingBusAllotmentRoutes;
