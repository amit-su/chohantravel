const databaseService = require("../../../utils/dbClientService");
const {
  GET_BUS_PROCEDURE,
  INSERT_OR_UPDATE_BUS_PROCEDURE,
  DELETE_PROCEDURE,
} = require("../../../utils/constants");

const createBus = async (req, res) => {
  try {
    console.log(req.body);
    const result = await databaseService.callStoredProcedure(
      req,
      INSERT_OR_UPDATE_BUS_PROCEDURE,
      {
        BusName: req.body.busName,
        BusNo: req.body.busNo,
        BusType: req.body.busType,
        BusCategory: req.body.busCategory,
        SittingCapacity: req.body.sittingCapacity,
        BranchID: 0,
        DriverID: req.body.driverId,
        HelperID: req.body.helperId,
        Make: req.body.make,
        Model: req.body.model,
        BusOwner: req.body.BusOwner,
        EngineNo: req.body.engineNo,
        ChasisNo: req.body.chasisNo,
        UserID: parseInt(req.body.UserID),
        TmpCompId: parseInt(req.body.Company_ID),
        Operation: 1,
      }
    );
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
    console.error("Error occurred:", error);
  }
};

const getAllBus = async (req, res) => {
  try {
    // get all product_category
    const params = {
      PageNumber: 1,
      PageSize: 10000,
    };

    const resultdata = await databaseService.callStoredProcedure(
      req,
      GET_BUS_PROCEDURE,
      params
    );

    res.json(resultdata);
  } catch (error) {
    res.status(400).json(error.message);
    console.log(error.message);
  }
};

const updateBus = async (req, res) => {
  try {
    const params = {
      BusID: req.params.id,
      BusName: req.body.busName,
      BusNo: req.body.busNo,
      BusType: req.body.busType,
      BranchID: 0,
      BusCategory: req.body.busCategory,
      SittingCapacity: req.body.sittingCapacity,
      DriverID: req.body.driverId,
      HelperID: req.body.helperId,
      Make: req.body.make,
      Model: req.body.model,
      EngineNo: req.body.engineNo,
      ChasisNo: req.body.chasisNo,
      TmpCompId: parseInt(req.body.Company_ID),
      BusOwner: req.body.BusOwner,
      UserID: 0,
      Operation: 2,
    };
    const updatedBus = await databaseService.callStoredProcedure(
      req,
      INSERT_OR_UPDATE_BUS_PROCEDURE,
      params
    );
    res.json(updatedBus);
  } catch (error) {
    res.status(400).json(error.message);
    console.log(error.message);
  }
};

const deleteSingleBus = async (req, res) => {
  try {
    // delete Bus
    const params = {
      table_name: "BusMast",
      column_name: "id",
      column_value: req.params.id,
    };
    const deletedBus = await databaseService.callStoredProcedure(
      req,
      DELETE_PROCEDURE,
      params
    );
    res.json(deletedBus);
  } catch (error) {
    res.status(400).json(error.message);
    console.log(error.message);
  }
};

module.exports = {
  createBus,
  getAllBus,
  updateBus,
  deleteSingleBus,
  // deleteSingleProductCategory,
};
