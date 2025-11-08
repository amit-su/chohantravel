const express = require("express");

const {
  getAllbookingHead,
  createbookingHead,
  updatebookingHead,
  deleteSinglebookingHead,
  getSingleBookingHead,
  getAllBookingHead,
  updateBookingHead,
} = require("./bookingHead.controllers");

const bookingHeadRoutes = express.Router();

bookingHeadRoutes.post("/",  createbookingHead);
bookingHeadRoutes.get("/",  getAllBookingHead);
bookingHeadRoutes.get(
  "/:id",
  getSingleBookingHead
);

bookingHeadRoutes.put(
  "/:id",
  updateBookingHead
);
bookingHeadRoutes.delete(
  "/",
  deleteSinglebookingHead
);

module.exports = bookingHeadRoutes;
