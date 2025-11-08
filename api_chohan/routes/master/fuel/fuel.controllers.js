const databaseService = require("../../../utils/dbClientService");
const {
  GET_FUEL_ENTRY_PROCEDURE,
  INSERT_OR_UPDATE_FUEL_ENTRY_PROCEDURE,
  DELETE_PROCEDURE,
} = require("../../../utils/constants");

const createFuel = async (req, res) => {
  try {
    console.log("req.body createFuel:", req.body);
    const result = await databaseService.callStoredProcedure(req,
      INSERT_OR_UPDATE_FUEL_ENTRY_PROCEDURE,
      {
        bus_id: req.body.bus_id,
        FuelType: req.body.fuelType,
        vendor_id: req.body.vendor_id,
        driver_id: req.body.driver_id,
        company_id: req.body.company_id,
        Date: req.body.Date,
        Kilometer: req.body.Kilometer,
        Fuel: req.body.Fuel,
        ReferenceNo: req.body.ReferenceNo,
        Rate: req.body.Rate,
        Amount: req.body.Amount,
        AdvAmount: req.body.AdvAmount,
        Remarks: req.body.Remarks,
        City: req.body.City,
        PaidBy: req.body.PaidBy,
        Paymode: req.body.Paymode,
        FullTank: req.body.FullTank,
        Operation: 1,
      }
    );
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
    console.error("Error occurred:", error);
  }
};

const getAllFuel = async (req, res) => {
  try {
    // get all product_category
    const params = {
      PageNumber: req.query.page,
      PageSize: req.query.count,
    };

    const resultdata = await databaseService.callStoredProcedure(req,
      GET_FUEL_ENTRY_PROCEDURE,
      params
    );

    res.json(resultdata);
  } catch (error) {
    res.status(400).json(error.message);
    console.log(error.message);
  }
};

const updateFuel = async (req, res) => {
  try {
    const result = await databaseService.callStoredProcedure(req,
      INSERT_OR_UPDATE_FUEL_ENTRY_PROCEDURE,
      {
        ID: req.params.id,
        bus_id: req.body.bus_id,
        FuelType: req.body.fuelType,
        vendor_id: req.body.vendor_id,
        driver_id: req.body.driver_id,
        company_id: req.body.company_id,
        Date: req.body.Date,
        Kilometer: req.body.Kilometer,
        Fuel: req.body.Fuel,
        ReferenceNo: req.body.ReferenceNo,
        Rate: req.body.Rate,
        Amount: req.body.Amount,
        AdvAmount: req.body.AdvAmount,
        Remarks: req.body.Remarks,
        City: req.body.City,
        PaidBy: req.body.PaidBy,
        Paymode: req.body.Paymode,
        FullTank: req.body.FullTank,
        Operation: 2,
      }
    );
    res.json(result);
  } catch (error) {
    res.status(400).json(error.message);
    console.log(error.message);
  }
};

const deleteSingleFuel = async (req, res) => {
  try {
    // delete Fuel
    const params = {
      table_name: "FuelEntryMast",
      column_name: "id",
      column_value: req.params.id,
    };
    const deletedFuel = await databaseService.callStoredProcedure(req,
      DELETE_PROCEDURE,
      params
    );
    res.json(deletedFuel);
  } catch (error) {
    res.status(400).json(error.message);
    console.log(error.message);
  }
};

module.exports = {
  createFuel,
  getAllFuel,
  updateFuel,
  deleteSingleFuel,
};
