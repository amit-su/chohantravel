const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

let client;
let isReady = false;
let isAuthenticated = false;
let lastQr = null;
let isInitializing = false;

const initializeWhatsApp = async (force = false) => {
    if (isInitializing && !force) {
        console.log('WhatsApp is already initializing...');
        return;
    }

    if (force && client) {
        console.log('Force re-initializing WhatsApp. Destroying old client...');
        try {
            await client.destroy();
        } catch (e) {
            console.error('Error destroying client:', e);
        }
        client = null;
        isReady = false;
        lastQr = null;
    }

    if (isReady && !force) {
        console.log('WhatsApp is already ready.');
        return;
    }

    isInitializing = true;
    console.log('Initializing WhatsApp Client (Puppeteer)...');

    client = new Client({
        authStrategy: new LocalAuth({
            clientId: "chohan-travel-session"
        }),
        puppeteer: {
            executablePath: '/usr/bin/chromium-browser',
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-accelerated-2d-canvas',
                '--no-first-run',
                '--no-zygote',
                '--disable-gpu',
                '--disable-software-rasterizer',
                '--disable-extensions',
                '--disable-infobars',
                '--window-size=1280,720',
            ],
        }
    });

    client.on('qr', (qr) => {
        console.log('WhatsApp QR RECEIVED (Stored for UI)');
        lastQr = qr;
        isInitializing = false;
    });

    client.on('ready', () => {
        console.log('WhatsApp Client is ready!');
        isReady = true;
        isAuthenticated = true;
        lastQr = null;
        isInitializing = false;
    });

    client.on('authenticated', () => {
        console.log('WhatsApp AUTHENTICATED');
        isAuthenticated = true;
        lastQr = null;
        isInitializing = false;
    });

    client.on('auth_failure', (msg) => {
        console.error('WhatsApp AUTHENTICATION FAILURE', msg);
        isReady = false;
        isAuthenticated = false;
        lastQr = null;
        isInitializing = false;
    });

    client.on('disconnected', (reason) => {
        console.log('WhatsApp Client was logged out', reason);
        isReady = false;
        isAuthenticated = false;
        lastQr = null;
        isInitializing = false;
        // Optionally auto-retry here
    });

    try {
        await client.initialize();
    } catch (err) {
        console.error('Failed to initialize WhatsApp client:', err.message);
        isInitializing = false;
    }
};

const logoutWhatsApp = async () => {
    console.log('Logging out WhatsApp...');
    if (client) {
        try {
            await client.logout();
            console.log('WhatsApp graceful logout successful.');
        } catch (error) {
            console.error("Graceful logout failed (often due to browser state), forcing destruction:", error.message);
            // Even if logout fails, we must try to destroy the client to free up the frame
            try {
                await client.destroy();
            } catch (destroyError) {
                console.error("Force destruction also failed:", destroyError.message);
            }
        } finally {
            // ALWAYS reset states regardless of whether logout/destroy succeeded
            client = null;
            isReady = false;
            isAuthenticated = false;
            lastQr = null;
            isInitializing = false;
        }
        return { status: true, message: "Logged out and service reset." };
    }
    return { status: false, message: "No client active to logout." };
};

const sendWhatsAppMessage = async (number, message) => {
    if (!client || !isReady) {
        throw new Error('WhatsApp client is not ready. Please scan the QR code in your profile.');
    }

    try {
        let cleanNumber = number.replace(/\D/g, '');
        if (cleanNumber.length === 10) {
            cleanNumber = '91' + cleanNumber;
        }

        const chatId = cleanNumber + "@c.us";
        const response = await client.sendMessage(chatId, message);
        return response;
    } catch (error) {
        console.error('Error sending WhatsApp message:', error);
        throw error;
    }
};

const getStatus = () => {
    return {
        isReady,
        isAuthenticated,
        lastQr,
        isInitializing,
        user: client && client.info ? {
            name: client.info.pushname,
            number: client.info.wid ? client.info.wid.user : null
        } : null
    };
};

module.exports = {
    initializeWhatsApp,
    sendWhatsAppMessage,
    logoutWhatsApp,
    getStatus
};
