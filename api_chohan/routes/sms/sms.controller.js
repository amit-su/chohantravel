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

module.exports = {
    sendSmsController,
    sendBookingConfirmationSms
};
