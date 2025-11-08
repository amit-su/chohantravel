require('dotenv').config(); // Load environment variables
const sql = require('mssql');

const config = {
  user: 'sa', // Use environment variable for username
  password: '123456',
  server: 'localhost', // e.g., 'localhost\\SQLEXPRESS'
  database: 'chohan',
  port: 1433,
  options: {
    encrypt: false, // Set to true if connecting to Azure
    trustServerCertificate: true, // Change to true for local dev / self-signed certs
  },
};

// Log the configuration to check values
console.log('Database Configuration:', config);

async function testConnection() {
  try {
    // Connect to the database
    await sql.connect(config);
    console.log('Database connection successful!');

    // Optionally, you can run a simple query to verify
    const result = await sql.query`SELECT 1 AS testValue`;
    console.log('Test query result:', result.recordset);

    // Close the connection
    await sql.close();
  } catch (err) {
    console.error('Error connecting to the database:', err.message);
  }
}

// Call the test connection function
testConnection();