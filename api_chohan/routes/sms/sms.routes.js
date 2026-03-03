const express = require("express");
const { sendSmsController, sendBookingConfirmationSms } = require("./sms.controller");

const smsRoutes = express.Router();

// POST /v1/sms/send
smsRoutes.post("/send", sendSmsController);

// POST /v1/sms/booking-confirmation
smsRoutes.post("/booking-confirmation", sendBookingConfirmationSms);

module.exports = smsRoutes;
