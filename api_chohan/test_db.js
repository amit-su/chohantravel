const sql = require('mssql');
require('dotenv').config();

async function check() {
    const config = {
        user: process.env.USER_NAME,
        password: process.env.PASSWORD,
        server: process.env.SERVER,
        database: process.env.DATABASE,
        options: { encrypt: false }
    };
    try {
        const pool = await sql.connect(config);
        console.log("Checking sp_insert_drv_helper_site_attend_json...");
        const spResult = await pool.request().query("sp_helptext 'sp_insert_drv_helper_site_attend_json'");
        console.log(spResult.recordset.map(r => r.Text).join(''));

        console.log("\nChecking DrvHelperSiteAttend columns...");
        const tableResult = await pool.request().query("SELECT COLUMN_NAME, DATA_TYPE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'DrvHelperSiteAttend'");
        console.table(tableResult.recordset);

        console.log("\nChecking PartySiteMast columns...");
        const siteResult = await pool.request().query("SELECT COLUMN_NAME, DATA_TYPE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'PartySiteMast'");
        console.table(siteResult.recordset);

    } catch (err) {
        console.log("Error:", err);
    }
    process.exit(0);
}
check();

