const cron = require('node-cron');
const fs = require('fs');
const path = require('path');
const { dbClientService } = require('./dbClientService');

const LOG_FILE = path.join(__dirname, 'khuraki-cron.log');

// Simple logger function
const writeLog = (message) => {
    const logMessage = `[${new Date().toISOString()}] ${message}\n`;
    console.log(logMessage.trim());
    fs.appendFileSync(LOG_FILE, logMessage);
};

const updateKhurakiAmount = async () => {
    let pool;
    const month = 2;
    const year = 2026;

    try {
        writeLog(`🚀 Starting Khuraki update for Month: ${month}, Year: ${year}`);

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
                DH.LastModifidOn = GETDATE(),
                DH.LastModifiedBy = 0
            FROM dbo.DrvHelperSiteAttend DH
            JOIN dbo.PartySiteMast S ON DH.SiteID = S.ID
            WHERE 
                ISNULL(DH.KhurakiAmt,0) = 0
                AND ISNULL(DH.DriverID,0) <> 0
                AND MONTH(DH.DutyDate) = ${month}
                AND YEAR(DH.DutyDate) = ${year};
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
                DH.LastModifidOn = GETDATE(),
                DH.LastModifiedBy = 0
            FROM dbo.DrvHelperSiteAttend DH
            JOIN dbo.PartySiteMast S ON DH.SiteID = S.ID
            WHERE 
                ISNULL(DH.KhurakiAmt,0) = 0
                AND ISNULL(DH.HelperID,0) <> 0
                AND MONTH(DH.DutyDate) = ${month}
                AND YEAR(DH.DutyDate) = ${year};
        `;

        const helperResult = await request.query(helperQuery);
        const helperRows = helperResult.rowsAffected[0] || 0;

        writeLog(`✅ Helper records updated: ${helperRows}`);

        await transaction.commit();

        writeLog(`🎉 Khuraki update successfully completed.`);

    } catch (error) {
        writeLog(`❌ ERROR: ${error.message}`);
        writeLog(`❌ STACK: ${error.stack}`);

        if (pool) {
            try {
                await pool.request().query('ROLLBACK');
            } catch (rollbackError) {
                writeLog(`⚠ Rollback failed: ${rollbackError.message}`);
            }
        }
    }
};

// Schedule: Sunday 12:00 AM
const schedule = process.env.KHURAKI_CRON_SCHEDULE || '0 0 * * 0';

cron.schedule(schedule, updateKhurakiAmount);

writeLog(`📅 Cron initialized. Pattern: ${schedule}`);

module.exports = { updateKhurakiAmount };