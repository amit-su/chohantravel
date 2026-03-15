const sql = require("mssql");
const { sendSMS } = require("../../utils/smsService");
const { dbClientService } = require('../../utils/dbClientService');

const sendSmsController = async (req, res) => {
    try {
        const smsData = req.body;

        // Basic validation
        if (!smsData || !smsData.numbers || !smsData.text) {
            return res.status(400).json({ message: "Invalid payload. 'numbers' and 'text' are required." });
        }

        const result = await sendSMS(smsData);

        return res.status(200).json({
            message: "SMS request sent successfully",
            providerResponse: result
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to send SMS",
            error: error.message
        });
    }
};

module.exports = {
    sendSmsController
};

const sendBookingConfirmationSms = async (req, res) => {
    try {
        const { numbers, customerName, pickup, dateTime, goingTo, CompanyPhone, bookingTranId } = req.body;

        const errors = [];

        /* ---------- Helper Function ---------- */
        const isValidString = (value) => {
            return typeof value === "string" && value.trim().length > 0;
        };

        const isValidPhone = (phone) => {
            return /^[0-9]{10}$/.test(phone);
        };

        /* ---------- Numbers Validation ---------- */
        if (!Array.isArray(numbers) || numbers.length === 0) {
            errors.push("At least one mobile number is required.");
        } else {
            const invalidNumbers = numbers.filter(num => !isValidPhone(String(num).trim()));
            if (invalidNumbers.length > 0) {
                errors.push(`Invalid mobile numbers: ${invalidNumbers.join(", ")}. Each number must be 10 digits.`);
            }
        }

        /* ---------- String Validations ---------- */
        if (!isValidString(customerName)) {
            errors.push("Customer name is required.");
        }

        if (!isValidString(pickup)) {
            errors.push("Pickup location is required.");
        }

        if (!isValidString(dateTime)) {
            errors.push("Date & Time is required.");
        }

        if (!isValidString(goingTo)) {
            errors.push("Destination (goingTo) is required.");
        }

        if (!isValidString(CompanyPhone)) {
            errors.push("Company phone is required.");
        } else if (!isValidPhone(CompanyPhone.trim())) {
            errors.push("Company phone must be a valid 10-digit number.");
        }

        /* ---------- BookingTranId Validation ---------- */
        if (!bookingTranId || isNaN(bookingTranId) || Number(bookingTranId) <= 0) {
            errors.push("Valid BookingTranId is required.");
        }

        /* ---------- Final Check ---------- */
        if (errors.length > 0) {
            return res.status(400).json({
                status: false,
                message: "Validation failed",
                errors
            });
        }

        const cleanedPickup = pickup
            .replace(/\n+/g, " ")
            .replace(/[.,]/g, "")
            .replace(/\s+/g, " ")
            .trim();
        let fromLocation = "";
        let toLocation = "";

        const match = cleanedPickup.match(/From (.*?) To (.*)/i);

        if (match) {
            fromLocation = match[1].trim();
            toLocation = match[2].trim();
        }

        const text = `Dear ${customerName}, your booking has been confirmed. Trip Details: ${fromLocation} ${toLocation}. Date:&Time ${dateTime} Driver details will be shared one day prior to journey day. Office number: ${CompanyPhone} Thanks&Regards Chohan Tours and travels`;
        const payload = {
            senderId: "CH0HAN",
            dcs: 0,
            flashSms: 0,
            schedTime: "",
            groupId: "",
            peId: "1701176908708959690",
            text: text,
            dltTemplateId: "1707177201403285596",
            chainValue: "",
            messageId: "",
            numbers: numbers
        };
        const result = await sendSMS(payload);
        let pool = await dbClientService();
        const request = pool.request();
        request.input('bookingTranId', bookingTranId);
        await request.query('UPDATE BookingTran SET sms_count = ISNULL(sms_count, 0) + 1 WHERE ID = @bookingTranId');

        return res.status(200).json({
            message: "Booking confirmation SMS sent successfully",
            providerResponse: result
        });

    } catch (error) {
        return res.status(500).json({
            message: "Failed to send booking confirmation SMS",
            error: error.message
        });
    }
};

const sendAllotmentSms = async (req, res) => {
    try {
        const { numbers, customerName, bookingNo, driverDetails, vehicleDetails, reportingOn, reportingAddress, destinationAddress, remarks, allotmentId } = req.body;

        const errors = [];

        /* ---------- Helper Function ---------- */
        const isValidString = (value) => {
            return typeof value === "string" && value.trim().length > 0;
        };

        const isValidPhone = (phone) => {
            return /^[0-9]{10}$/.test(phone);
        };

        /* ---------- Numbers Validation ---------- */
        if (!Array.isArray(numbers) || numbers.length === 0) {
            errors.push("At least one mobile number is required.");
        } else {
            const invalidNumbers = numbers.filter(num => !isValidPhone(String(num).trim()));
            if (invalidNumbers.length > 0) {
                errors.push(`Invalid mobile numbers: ${invalidNumbers.join(", ")}. Each number must be 10 digits.`);
            }
        }

        /* ---------- String Validations ---------- */
        // if (!isValidString(customerName)) errors.push("Customer name is required.");
        if (!isValidString(vehicleDetails)) errors.push("Vehicle details are required.");

        /* ---------- Final Check ---------- */
        if (errors.length > 0) {
            return res.status(400).json({
                status: false,
                message: "Validation failed",
                errors
            });
        }

        const cleanStr = (str) => (str || "").replace(/\n+/g, " ").replace(/\s+/g, " ").trim();

        const safeBookingNo = cleanStr(bookingNo);
        const safeDriver = cleanStr(driverDetails);
        const safeVehicle = cleanStr(vehicleDetails);
        const safeReportingOn = cleanStr(reportingOn);
        const splitText = (str, maxLength) => {
            if (str.length <= maxLength) return [str, ""];
            let splitIndex = str.lastIndexOf(" ", maxLength);
            if (splitIndex === -1) splitIndex = maxLength;
            return [str.substring(0, splitIndex).trim(), str.substring(splitIndex).trim()];
        };

        const safeDestAddr = cleanStr(destinationAddress);
        const safeRemarks = cleanStr(remarks);

        const [safeDestAddr1, safeDestAddr2] = splitText(safeDestAddr, 30);

        const text = `Dear Customer, GREETINGS OF THE DAY! Vehicle and driver details for Booking No ${safeBookingNo} Driver: ${safeDriver} Vehicle: ${safeVehicle} Reporting on: ${safeReportingOn} Trip Details: ${safeDestAddr1} ${safeDestAddr2} Remarks: ${safeRemarks} Regards CHOHAN TOURS AND TRAVELS Contact 8820388881 WISHING YOU A HAPPY JOURNEY`;

        const payload = {
            senderId: "CH0HAN",
            dcs: 0,
            flashSms: 0,
            schedTime: "",
            groupId: "",
            peId: "1701176908708959690",
            text: text,
            dltTemplateId: "1707177306072254927",
            chainValue: "",
            messageId: "",
            numbers: numbers
        };

        const result = await sendSMS(payload);

        let pool = await dbClientService();
        const request = pool.request();
        if (allotmentId && !isNaN(allotmentId) && Number(allotmentId) > 0) {
            request.input('allotmentId', allotmentId);
            await request.query('UPDATE BookingBusAllotment SET sms_count = ISNULL(sms_count, 0) + 1 WHERE ID = @allotmentId');
        }

        return res.status(200).json({
            message: "Allotment SMS sent successfully",
            providerResponse: result
        });

    } catch (error) {
        return res.status(500).json({
            message: "Failed to send Allotment SMS",
            error: error.message
        });
    }
};

const sendPaymentReminderSms = async (req, res) => {
    try {
        const { numbers, customerName, journeyDate, bookingNo } = req.body;

        const errors = [];

        /* ---------- Helper Function ---------- */
        const isValidString = (value) => {
            return typeof value === "string" && value.trim().length > 0;
        };

        const isValidPhone = (phone) => {
            return /^[0-9]{10}$/.test(phone);
        };

        /* ---------- Numbers Validation ---------- */
        if (!Array.isArray(numbers) || numbers.length === 0) {
            errors.push("At least one mobile number is required.");
        } else {
            const invalidNumbers = numbers.filter(num => !isValidPhone(String(num).trim()));
            if (invalidNumbers.length > 0) {
                errors.push(`Invalid mobile numbers: ${invalidNumbers.join(", ")}. Each number must be 10 digits.`);
            }
        }

        /* ---------- String Validations ---------- */
        if (!isValidString(customerName)) errors.push("Customer name is required.");
        if (!isValidString(journeyDate)) errors.push("Journey date is required.");

        /* ---------- Final Check ---------- */
        if (errors.length > 0) {
            return res.status(400).json({
                status: false,
                message: "Validation failed",
                errors
            });
        }

        const text = `Dear ${customerName}, your journey with Chohan Tours & Travels is scheduled on ${journeyDate}. We request you to kindly clear the pending payment. Thank you!`;

        const payload = {
            senderId: "CH0HAN",
            dcs: 0,
            flashSms: 0,
            schedTime: "",
            groupId: "",
            peId: "1701176908708959690",
            text: text,
            dltTemplateId: "1707177001747699662",
            chainValue: "",
            messageId: "",
            numbers: numbers
        };

        const result = await sendSMS(payload);

        let pool = await dbClientService();
        const request = pool.request();
        if (bookingNo) {
            request.input('bookingNo', bookingNo);
            await request.query('UPDATE BookingHead SET payment_sms_count = ISNULL(payment_sms_count, 0) + 1 WHERE BookingNo = @bookingNo');
        }

        return res.status(200).json({
            message: "Payment reminder SMS sent successfully",
            providerResponse: result
        });

    } catch (error) {
        return res.status(500).json({
            message: "Failed to send Payment reminder SMS",
            error: error.message
        });
    }
};

module.exports = {
    sendSmsController,
    sendBookingConfirmationSms,
    sendAllotmentSms,
    sendPaymentReminderSms
};
