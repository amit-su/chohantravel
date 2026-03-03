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

        if (!numbers || !numbers.length || !customerName || !pickup || !dateTime || !goingTo || !CompanyPhone || !bookingTranId) {
            return res.status(400).json({ message: "Missing required fields for booking confirmation SMS." });
        }

        const text = `Dear ${customerName}, your booking has been confirmed. Trip Details: ${pickup}. Date & Time ${dateTime}. Driver details will be shared one day prior to journey day. Office number: ${CompanyPhone}. Thanks & Regards Chohan Tours and Travels`;

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
