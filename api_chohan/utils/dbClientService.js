const sql = require("mssql");
const colors = require("colors");
const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET;
const config = {
  user: process.env.USER_NAME,
  password: process.env.PASSWORD,
  server: process.env.SERVER,
  database: process.env.DATABASE,
  options: {
    encrypt: false, // If you are using Azure, set to true
  },
};
const dbClientService = async () => {
  try {
    const pool = await sql.connect(config);
    return pool;
  } catch (error) {
    console.error("Error connecting to database:", error);
    throw error;
  }
};

async function callStored(req, procedureName, params = {}) {
  try {
    const companyId = getCompanyIdFromToken(req);
    const pool = await dbClientService();
    const request = pool.request();

    // Add parameters if provided
    if (Object.keys(params).length > 0) {
      for (const paramName in params) {
        // Check for conflicts with output parameter names
        if (
          paramName === "StatusID" ||
          paramName === "StatusMessage" ||
          paramName === "TotalCount"
        ) {
          throw new Error(
            `Parameter name ${paramName} conflicts with output parameter names.`
          );
        }
        request.input(paramName, params[paramName]);
      }
    }

    // Add the company ID as an input parameter if needed
    // request.input("CompanyID", companyId); // Uncomment if needed

    // Define output parameters
    request.output("StatusID", sql.Int);
    request.output("StatusMessage", sql.VarChar);
    request.output("TotalCount", sql.Int);

    // Execute the stored procedure
    const result = await request.execute(procedureName);

    return {
      status: result.output.StatusID,
      message: result.output.StatusMessage,
      count: result.output.TotalCount,
      data: result.recordset,
    };
  } catch (error) {
    console.error("Error occurred:", error);
    throw error;
  }
}

async function callStoredProcedure(req, procedureName, params = {}) {
  try {
    const companyId = getCompanyIdFromToken(req);
    const userId = getUserIdFromToken(req);
    const pool = await dbClientService();
    const request = pool.request();
    // Add parameters if provided
    if (Object.keys(params).length > 0) {
      for (const paramName in params) {
        request.input(paramName, params[paramName]);
      }
    }
    // Add the com
    request.input("CompanyID", companyId);
    const outputStatusID = "StatusID";
    request.output(outputStatusID, sql.Int);
    const outputStatusMessage = "StatusMessage";
    request.output(outputStatusMessage, sql.VarChar);
    const outputCount = "TotalCount";
    request.output(outputCount, sql.Int);

    const result = await request.execute(procedureName);

    // const outputValue = result.output.outputStatusID;
    console.log(colors.bgBlue("Result of PROC :".white), result.output);

    return {
      status: result.output.StatusID,
      message: result.output.StatusMessage,
      count: result.output.TotalCount,
      data: result.recordset,
    };
  } catch (error) {
    console.error("Error occurred:", error);
    throw error;
  }
}

function getCompanyIdFromToken(req) {
  const token = getBearerToken(req);

  if (!token) {
    return 0;
  }

  try {
    const decoded = jwt.verify(token, secret);
    return decoded.companyId; // Extract and return the companyId from the payload
  } catch (err) {
    console.error("Token verification failed:", err);
    throw new Error("Invalid token");
  }
}

function getUserIdFromToken(req) {
  const token = getBearerToken(req);

  if (!token) {
    return 0;
  }

  try {
    const decoded = jwt.verify(token, secret);
    return decoded.sub; // Extract and return the companyId from the payload
  } catch (err) {
    console.error("Token verification failed:", err);
    throw new Error("Invalid token");
  }
}

function getBearerToken(req) {
  const authHeader = req.headers["authorization"];

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const a = authHeader.split(" ")[1];

    if (a === "null") {
      return null;
    } else {
      return authHeader.split(" ")[1];
    }

    // Remove 'Bearer ' prefix and return the token
  }
  return null;
}

module.exports = {
  dbClientService,
  callStoredProcedure,
  getCompanyIdFromToken,
  getBearerToken,
  callStored,
  getUserIdFromToken,
};
