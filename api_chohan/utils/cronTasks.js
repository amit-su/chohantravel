const cron = require('node-cron');
const fs = require('fs');
const path = require('path');
const { dbClientService } = require('./dbClientService');

const KHURAKI_LOG = path.join(__dirname, 'khuraki-cron.log');
const DB_BACKUP_LOG = path.join(__dirname, 'db-backup-cron.log');

const writeLog = (message, logFile = KHURAKI_LOG) => {
    const logMessage = `[${new Date().toISOString()}] ${message}\n`;
    console.log(logMessage.trim());
    fs.appendFileSync(logFile, logMessage);
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
        writeLog(`🚀 Starting Khuraki update for ${month}/${year}`, KHURAKI_LOG);
        writeLog(`Date Range: ${startDate} to ${endDate}`, KHURAKI_LOG);

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

        writeLog(`✅ Driver records updated: ${driverRows}`, KHURAKI_LOG);

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

        writeLog(`✅ Helper records updated: ${helperRows}`, KHURAKI_LOG);

        await transaction.commit();

        writeLog(`🎉 Khuraki update successfully completed.`, KHURAKI_LOG);

    } catch (error) {
        writeLog(`❌ ERROR: ${error.message}`, KHURAKI_LOG);
        writeLog(`❌ STACK: ${error.stack}`, KHURAKI_LOG);
    }
};

/**
 * 🛡️ Database Backup Cron Job
 */
const dbBackupTask = async () => {
    const savePath = process.env.DB_BACKUP_SAVE_PATH || '/var/opt/mssql/dbbackup/';
    const dbName = process.env.DB_NAME || 'ChohanTravel';
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

    writeLog(`🚀 Starting Daily DB Backup for ${dbName}`, DB_BACKUP_LOG);

    try {
        const pool = await dbClientService();
        
        // ✅ Date-wise folder creation
        const dateFolder = new Date().toISOString().split('T')[0]; // e.g., '2026-04-02'
        const localSaveDir = `/api/dbbackup/${dateFolder}/`; // Node-side path
        const sqlSaveDir = `${savePath}${dateFolder}/`; // SQL-side path (mapped via volume)

        // Ensure folder exists (from Node-side)
        if (!fs.existsSync(localSaveDir)) {
            fs.mkdirSync(localSaveDir, { recursive: true });
            writeLog(`📁 Created new directory: ${localSaveDir}`, DB_BACKUP_LOG);
        }

        const fileName = `${dbName}_backup_${timestamp}.bak`;
        const fullDestPath = `${sqlSaveDir}${fileName}`;
        writeLog(`📦 Backing up database to: ${fullDestPath}`, DB_BACKUP_LOG);
        
        await pool.query(`BACKUP DATABASE [${dbName}] TO DISK = '${fullDestPath}' WITH FORMAT, NAME = 'Full Backup of ${dbName}'`);
        writeLog(`✅ Backup completed successfully in date-wise folder.`, DB_BACKUP_LOG);

    } catch (error) {
        writeLog(`❌ DATABASE BACKUP ERROR: ${error.message}`, DB_BACKUP_LOG);
    }
};

// Cron Schedule
const schedule = process.env.KHURAKI_CRON_SCHEDULE || '0 0 * * 0';
cron.schedule(schedule, updateKhurakiAmount);

const backupSchedule = process.env.DB_BACKUP_SCHEDULE || '0 2 * * *';
cron.schedule(backupSchedule, dbBackupTask);

writeLog(`📅 Cron initialized. Khuraki Pattern: ${schedule}`, KHURAKI_LOG);
writeLog(`📅 Cron initialized. DB Backup Pattern: ${backupSchedule}`, DB_BACKUP_LOG);

module.exports = { updateKhurakiAmount, dbBackupTask };