const {
  GET_DIALY_EXECUTIONS_PROCEDURE,
  INSERT_OR_UPDATE_DAILY_EXECUTIONS_PROCEDURE,
  DELETE_PROCEDURE,
  GET_BOOKING_TRAN_PROCEDURE_BY_DATE
} = require("../../utils/constants");
const databaseService = require("../../utils/dbClientService");

const createdailyExecution = async (req, res) => {
  try {
    console.log(req.body);
    const result = await databaseService.callStoredProcedure(req,
      INSERT_OR_UPDATE_DAILY_EXECUTIONS_PROCEDURE,
      {
        PartyID: parseInt(req.body.PartyID),
        SiteID: req.body.SiteID,
        BusID: req.body.BusID,
        DriverID: req.body.driverID,
        HelperID: req.body.helperID,
        CreatedOn: req.body.CreatedOn,
      }
    );
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
    console.error("Error occurred:", error);
  }
};

const getAllDailyExecution = async (req, res) => {
  try {
    // get all product_category
    console.log(req.query);
    const params = {
      PageNo: req.query.page,
      PageSize: req.query.count,
      StatusDate: req.query.status ? new Date(req.query.status) : null,
    };

    const resultdata = await databaseService.callStoredProcedure(req,
      GET_DIALY_EXECUTIONS_PROCEDURE,
      params
    );

    res.json(resultdata);
  } catch (error) {
    res.status(400).json(error.message);
    console.log(error.message);
  }
};
// const getSingleDailyExecution = async (req, res) => {
//   try {
//     res.json(resultdata);
//   } catch (error) {
//     res.status(400).json(error.message);
//     console.log(error.message);
//   }
// };
const updateDailyExecution = async (req, res) => {
  
var r= {
  ID: req.body.id,
  PartyID: parseInt(req.body.PartyID),
  SiteID: req.body.SiteID,
  BusID: req.body.BusID,
  DriverID: req.body.DriverID,
  HelperID: req.body.HelperID,
  CreatedOn: req.body.CreatedOn,
}
console.log(r);


  try {
    const result = await databaseService.callStoredProcedure(req,
      INSERT_OR_UPDATE_DAILY_EXECUTIONS_PROCEDURE,
      {
        ID: req.body.id,
        PartyID: parseInt(req.body.PartyID),
        SiteID: req.body.siteID,
        BusID: req.body.BusID,
        DriverID: req.body.DriverID,
        HelperID: req.body.HelperID,
        CreatedOn: req.body.CreatedOn,
      }
    );
    res.json(result);
  } catch (error) {
    res.status(400).json(error.message);
    console.log(error.message);
  }
};

const deleteSingledailyExecution = async (req, res) => {
  try {
    // console.log(req.body);

    const params = {
      table_name: "DailyExecutions",
      column_name: "id",
      column_value: req.params.id,
    };
    const resultDelete = await databaseService.callStoredProcedure(req,
      DELETE_PROCEDURE,
      params
    );

    res.json(resultDelete);
  } catch (error) {
    res.status(400).json(error.message);
    console.log(error.message);
  }
};
const SingledailyExecutionbydate = async (req, res) => {
  try {
    console.log(req.params);
    const { id } = req.params;
    const decodedId = id;

    // get all product_category

    const params = {
      CreatedOn: decodedId,
      // PageNo: req.query.page,
      // PageSize: req.query.count,
    };

    const resultdata = await databaseService.callStoredProcedure(req,
      GET_BOOKING_TRAN_PROCEDURE_BY_DATE,
      params
    );

    res.json(resultdata);
  } catch (error) {
    res.status(400).json(error.message);
    console.log(error.message);
  }
};

module.exports = {
  createdailyExecution,
  getAllDailyExecution,
  updateDailyExecution,
  deleteSingledailyExecution,
  // getSingleDailyExecution,
  SingledailyExecutionbydate
};
