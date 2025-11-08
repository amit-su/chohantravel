const express = require("express");

const {
  getAllbookingEntry,
  createbookingEntry,
  updatebookingEntry,
  deleteSinglebookingEntry,
  getSingleBookingEntry,
  getAllBookingEntry,
  updateBookingEntry,
  isBusAvalable,
  deleteBookingTranById,
} = require("./bookingEntry.controllers");

const bookingEntryRoutes = express.Router();

bookingEntryRoutes.post("/", createbookingEntry);
bookingEntryRoutes.get("/", getAllBookingEntry);
bookingEntryRoutes.patch("/", isBusAvalable);
bookingEntryRoutes.get(
  "/:id",

  getSingleBookingEntry
);

bookingEntryRoutes.put(
  "/:id",

  updateBookingEntry
);
bookingEntryRoutes.delete(
  "/",

  deleteSinglebookingEntry
);

bookingEntryRoutes.delete("/tran/:id", deleteBookingTranById);

module.exports = bookingEntryRoutes;
