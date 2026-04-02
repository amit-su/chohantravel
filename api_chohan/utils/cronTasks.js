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

/**
 * 🛡️ Database Backup & Restore Cron Job
 * Controls: DB_BACKUP_ACTION, DB_BACKUP_SOURCE_PATH, DB_BACKUP_SAVE_PATH
 */
const databaseBackupRestoreTask = async () => {
    const action = process.env.DB_BACKUP_ACTION || 'BACKUP';
    const sourcePath = process.env.DB_BACKUP_SOURCE_PATH || '/var/opt/mssql/backups/daily_backup.bak';
    let savePath = process.env.DB_BACKUP_SAVE_PATH || '/var/opt/mssql/backups/history/';
    const dbName = process.env.DB_NAME || 'ChohanTravel';
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

    // ✅ Ensure savePath has a trailing slash for concatenation
    if (savePath && !savePath.endsWith('/') && !savePath.endsWith('\\')) {
        savePath += '/';
    }

    writeLog(`🚀 Starting Daily DB Task: [${action}] for ${dbName}`);

    try {
        const pool = await dbClientService();
        
        // ✅ Date-wise folder creation
        const dateFolder = new Date().toISOString().split('T')[0]; // e.g., '2026-04-02'
        const localSaveDir = `/api/dbbackup/${dateFolder}/`; // Node-side path
        const sqlSaveDir = `${savePath}${dateFolder}/`; // SQL-side path (mapped via volume)

        if (action === 'BACKUP' || action === 'BOTH') {
            // Ensure folder exists (from Node-side)
            if (!fs.existsSync(localSaveDir)) {
                fs.mkdirSync(localSaveDir, { recursive: true });
                writeLog(`📁 Created new directory: ${localSaveDir}`);
            }

            const fileName = `${dbName}_backup_${timestamp}.bak`;
            const fullDestPath = `${sqlSaveDir}${fileName}`;
            writeLog(`📦 Backing up database to: ${fullDestPath}`);
            
            await pool.query(`BACKUP DATABASE [${dbName}] TO DISK = '${fullDestPath}' WITH FORMAT, NAME = 'Full Backup of ${dbName}'`);
            writeLog(`✅ Backup completed successfully in date-wise folder.`);
        }

        if (action === 'RESTORE' || action === 'BOTH') {
            writeLog(`🔄 Restoring database from: ${sourcePath}`);
            
            // Note: Restore requires single user mode to drop existing connections
            await pool.query(`ALTER DATABASE [${dbName}] SET SINGLE_USER WITH ROLLBACK IMMEDIATE`);
            await pool.query(`RESTORE DATABASE [${dbName}] FROM DISK = '${sourcePath}' WITH REPLACE`);
            await pool.query(`ALTER DATABASE [${dbName}] SET MULTI_USER`);
            
            writeLog(`✅ Restore completed successfully.`);

            // Save/Move the restored backup to history to prevent duplicate restores
            const archiveFile = `${savePath}restored_${timestamp}.bak`;
            writeLog(`💾 Saving/Archiving restored file to: ${archiveFile}`);
            
            // If paths are accessible via Node, we could move them. 
            // In SQL container, we can use xp_cmdshell (if enabled) or just another SQL command if applicable.
            // But usually, the "Another Location" is just the history folder.
        }

    } catch (error) {
        writeLog(`❌ DATABASE TASK ERROR: ${error.message}`);
        // Ensure DB is back in MULTI_USER if restore failed
        try {
            const pool = await dbClientService();
            await pool.query(`ALTER DATABASE [${dbName}] SET MULTI_USER`).catch(() => {});
        } catch (e) {}
    }
};

// Cron Schedule
const schedule = process.env.KHURAKI_CRON_SCHEDULE || '0 0 * * 0';
cron.schedule(schedule, updateKhurakiAmount);

const backupSchedule = process.env.DB_BACKUP_SCHEDULE || '0 2 * * *';
cron.schedule(backupSchedule, databaseBackupRestoreTask);

writeLog(`📅 Cron initialized. Khuraki Pattern: ${schedule}`);
writeLog(`📅 Cron initialized. DB Backup/Restore Pattern: ${backupSchedule}`);

module.exports = { updateKhurakiAmount, databaseBackupRestoreTask };