const whatsappService = require('../../utils/whatsappService');

const sendWhatsAppController = async (req, res) => {
    try {
        const { number, message } = req.body;

        if (!number || !message) {
            return res.status(400).json({ status: false, message: "Number and message are required." });
        }

        const result = await whatsappService.sendWhatsAppMessage(number, message);

        return res.status(200).json({
            status: true,
            message: "WhatsApp message sent successfully",
            data: result
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: "Failed to send WhatsApp message",
            error: error.message
        });
    }
};

const getWhatsAppStatus = async (req, res) => {
    try {
        const status = whatsappService.getStatus();
        return res.status(200).json({
            status: true,
            data: status
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: "Failed to get WhatsApp status",
            error: error.message
        });
    }
};

const logoutWhatsAppController = async (req, res) => {
    try {
        const result = await whatsappService.logoutWhatsApp();
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: "Failed to logout WhatsApp",
            error: error.message
        });
    }
};

const forceInitializeWhatsApp = async (req, res) => {
    try {
        await whatsappService.initializeWhatsApp(true);
        return res.status(200).json({
            status: true,
            message: "Initialization started"
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: "Failed to start initialization",
            error: error.message
        });
    }
};

module.exports = {
    sendWhatsAppController,
    getWhatsAppStatus,
    logoutWhatsAppController,
    forceInitializeWhatsApp
};
