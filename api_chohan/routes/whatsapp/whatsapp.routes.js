const express = require('express');
const router = express.Router();
const whatsappController = require('./whatsapp.controller');

router.post('/send', whatsappController.sendWhatsAppController);
router.get('/status', whatsappController.getWhatsAppStatus);
router.post('/logout', whatsappController.logoutWhatsAppController);
router.post('/initialize', whatsappController.forceInitializeWhatsApp);


module.exports = router;
