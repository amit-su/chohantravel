const cron = require('node-cron');
const fs = require('fs');
const path = require('path');
const { dbClientService } = require('./dbClientService');

const LOG_FILE = path.join(__dirname, 'khuraki-cron.log');

const writeLog = (message) => {
    const logMessage = `[${new Date().toISOString()}] ${message}\n`;
    console.log(logMessage.trim());
    fs.appendFileSync(LOG_FILE, logMessage);
};

const updateKhurakiAmount = async () => {
    let pool;

    // ✅ Get month & year from ENV or fallback to current
    const now = new Date();
    const month = process.env.KHURAKI_MONTH
        ? parseInt(process.env.KHURAKI_MONTH)
        : now.getMonth() + 1;

    const year = process.env.KHURAKI_YEAR
        ? parseInt(process.env.KHURAKI_YEAR)
        : now.getFullYear();

    // ✅ Build date range (INDEX FRIENDLY)
    const startDate = `${year}-${String(month).padStart(2, '0')}-01`;

    const nextMonth = month === 12 ? 1 : month + 1;
    const nextYear = month === 12 ? year + 1 : year;

    const endDate = `${nextYear}-${String(nextMonth).padStart(2, '0')}-01`;

    try {
        writeLog(`🚀 Starting Khuraki update for ${month}/${year}`);
        writeLog(`Date Range: ${startDate} to ${endDate}`);

        pool = await dbClientService();
        const transaction = pool.transaction();
        await transaction.begin();

        const request = transaction.request();

        // ===============================
        // 1️⃣ Driver Update
        // ===============================
        const driverQuery = `
            UPDATE DH
            SET 
                DH.KhurakiAmt = S.DriverKhurakiAmt,
                DH.LastModifidOn = GETDATE()
            FROM dbo.DrvHelperSiteAttend DH
            JOIN dbo.PartySiteMast S ON DH.SiteID = S.ID
            WHERE 
                ISNULL(DH.KhurakiAmt,0) = 0
                AND ISNULL(DH.DriverID,0) <> 0
                AND DH.DutyDate >= '${startDate}'
                AND DH.DutyDate < '${endDate}';
        `;

        const driverResult = await request.query(driverQuery);
        const driverRows = driverResult.rowsAffected[0] || 0;

        writeLog(`✅ Driver records updated: ${driverRows}`);

        // ===============================
        // 2️⃣ Helper Update
        // ===============================
        const helperQuery = `
            UPDATE DH
            SET 
                DH.KhurakiAmt = S.HelperKhurakiAmt,
                DH.LastModifidOn = GETDATE()
            FROM dbo.DrvHelperSiteAttend DH
            JOIN dbo.PartySiteMast S ON DH.SiteID = S.ID
            WHERE 
                ISNULL(DH.KhurakiAmt,0) = 0
                AND ISNULL(DH.HelperID,0) <> 0
                AND DH.DutyDate >= '${startDate}'
                AND DH.DutyDate < '${endDate}';
        `;

        const helperResult = await request.query(helperQuery);
        const helperRows = helperResult.rowsAffected[0] || 0;

        writeLog(`✅ Helper records updated: ${helperRows}`);

        await transaction.commit();

        writeLog(`🎉 Khuraki update successfully completed.`);

    } catch (error) {
        writeLog(`❌ ERROR: ${error.message}`);
        writeLog(`❌ STACK: ${error.stack}`);
    }
};

// Cron Schedule
const schedule = process.env.KHURAKI_CRON_SCHEDULE || '0 0 * * 0';
cron.schedule(schedule, updateKhurakiAmount);

writeLog(`📅 Cron initialized. Pattern: ${schedule}`);

module.exports = { updateKhurakiAmount };