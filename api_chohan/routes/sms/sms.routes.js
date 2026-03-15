const express = require("express");
const { sendSmsController, sendBookingConfirmationSms, sendAllotmentSms, sendPaymentReminderSms } = require("./sms.controller");

const smsRoutes = express.Router();

// POST /v1/sms/send
smsRoutes.post("/send", sendSmsController);

// POST /v1/sms/booking-confirmation
smsRoutes.post("/booking-confirmation", sendBookingConfirmationSms);

// POST /v1/sms/allotment
smsRoutes.post("/allotment", sendAllotmentSms);

// POST /v1/sms/payment-reminder
smsRoutes.post("/payment-reminder", sendPaymentReminderSms);

module.exports = smsRoutes;
