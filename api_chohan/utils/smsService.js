const axios = require('axios');
require('dotenv').config();

const sendSMS = async (data) => {
    try {
        const url = 'https://portal.bluewavesmedia.in/api/v1/sms/mt';

        const headers = {
            'Authorization': `Bearer ${process.env.SMS_API_KEY}`,
            'Content-Type': 'application/json'
        };

        console.log("Sending SMS to URL:", url);
        console.log("Payload:", JSON.stringify(data, null, 2));

        const response = await axios.post(url, data, { headers });

        return response.data;

    } catch (error) {
        if (error.response) {
            console.error("SMS API Error Response:", error.response.data);
            throw new Error(`SMS Provider Error: ${JSON.stringify(error.response.data)}`);
        } else {
            console.error("SMS Sending Error:", error.message);
            throw error;
        }
    }
};

module.exports = {
    sendSMS
};