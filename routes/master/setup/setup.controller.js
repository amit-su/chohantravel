const {
  DELETE_PROCEDURE,
  GET_SETUP_PROCEDURE,
  INSERT_OR_UPDATE_SETUP_PROCEDURE,
} = require("../../../utils/constants");
const databaseService = require("../../../utils/dbClientService");

const getSetupPaginated = async (req, res) => {
  try {
    console.log(req.query);
    const result = await databaseService.callStoredProcedure(
      req,
      GET_SETUP_PROCEDURE,
      {
        PageNo: req.query.page,
        PageSize: req.query.count,
      }
    );

    res.json(result);
  } catch (error) {
    res.status(400).json(error.message);
    console.log(error.message);
  }
};

const deleteSetup = async (req, res) => {
  try {
    const resultSetupDelete = await databaseService.callStoredProcedure(
      req,
      DELETE_PROCEDURE,
      {
        table_name: "PartySiteBusSetup",
        column_name: "id",
        column_value: req.params.id,
      }
    );
    res.json(resultSetupDelete);
  } catch (error) {
    res.status(400).json(error.message);
    console.log(error.message);
  }
};

const addSetup = async (req, res) => {
  try {
    const params = {
      PartyID: req.body.partyId,
      SiteID: req.body.siteID,
      BusID: req.body.busID,
      DriverID: req.body.driverID,
      HelperID: req.body.helperID,
      UserID: 1,
      SiteClosed: req.body.siteClosed,
      Operation: 1,
      duty_type: req.body.duty_type,
    };
    const resultInsert = await databaseService.callStoredProcedure(
      req,
      INSERT_OR_UPDATE_SETUP_PROCEDURE,
      params
    );
    console.log("return result", resultInsert);
    res.json(resultInsert);
  } catch (error) {
    res.status(400).json(error.message);
    console.log(error.message);
  }
};

const updateSetup = async (req, res) => {
  try {
    console.log(req.body);
    const params = {
      SlNo: req.params.id,
      PartyID: req.body.PartyID,
      SiteID: req.body.SiteID,
      BusID: req.body.BusID,
      DriverID: req.body.DriverID,
      HelperID: req.body.helperID,
      UserID: 1,
      SiteClosed: req.body.siteClosed,
      Operation: 2,
      duty_type: req.body.duty_type,
    };
    const resultInsert = await databaseService.callStoredProcedure(
      req,
      INSERT_OR_UPDATE_SETUP_PROCEDURE,
      params
    );
    console.log(resultInsert);
    res.json(resultInsert);
  } catch (error) {
    res.status(400).json(error.message);
    console.log(error.message);
  }
};

module.exports = {
  getSetupPaginated,
  deleteSetup,
  addSetup,
  updateSetup,
};
