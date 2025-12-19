require('./api_chohan/node_modules/dotenv').config({ path: './api_chohan/.env' });
const sql = require('./api_chohan/node_modules/mssql');
const fs = require('fs');

const config = {
    user: process.env.USER_NAME,
    password: process.env.PASSWORD,
    server: process.env.SERVER,
    database: process.env.DATABASE,
    options: {
        encrypt: false,
        trustServerCertificate: true,
    },
};

async function executeSql() {
    try {
        const pool = await sql.connect(config);
        const sqlContent = fs.readFileSync('./create_sp_khoraki_new.sql', 'utf8');

        await pool.request().query(sqlContent);
        console.log('Stored procedure created successfully.');
        await pool.close();
    } catch (err) {
        console.error('Error executing SQL:', err);
        process.exit(1);
    }
}

executeSql();
