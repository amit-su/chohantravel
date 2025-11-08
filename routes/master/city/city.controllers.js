const databaseService = require("../../../utils/dbClientService");
const {
  GET_CITY_PROCEDURE,
  INSERT_OR_UPDATE_CITY_PROCEDURE,
  DELETE_PROCEDURE,
} = require("../../../utils/constants");
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST;

const addCity = async (req, res) => {
  try {
    const params = {
      CityName: req.body.name,
      StateName: req.body.stateName,
    };
    const result = await databaseService.callStoredProcedure(req,
      INSERT_OR_UPDATE_CITY_PROCEDURE,
      params
    );
    console.log(result);
    res.json(result);
  } catch (error) {
    res.status(400).json(error.message);
    console.log(error.message);
  }
};

const getAllCity = async (req, res) => {
  try {
    const params = {
      PageNumber: req.query.page,
      PageSize: req.query.count,
    };
    const AllCity = await databaseService.callStoredProcedure(req,
      GET_CITY_PROCEDURE,
      params
    );
    res.json(AllCity);
  } catch (error) {
    res.status(400).json(error.message);
    console.log(error.message);
  }
};

const updateCity = async (req, res) => {
  try {
    const params = {
      CityName: req.body.name,
      CityID: req.params.id,
      StateName: req.body.stateName,
    };
    const result = await databaseService.callStoredProcedure(req,
      INSERT_OR_UPDATE_CITY_PROCEDURE,
      params
    );
    res.json(result);
  } catch (error) {
    res.status(400).json(error.message);
    console.log(error.message);
  }
};
const deleteCity = async (req, res) => {
  try {
    // delete productcategory
    const params = {
      table_name: "CityMast",
      column_name: "id",
      column_value: req.params.id,
    };
    const deletedProductBrand = await databaseService.callStoredProcedure(req,
      DELETE_PROCEDURE,
      params
    );
    res.json(deletedProductBrand);
  } catch (error) {
    res.status(400).json(error.message);
    console.log(error.message);
  }
};

module.exports = {
  addCity,
  getAllCity,
  updateCity,
  deleteCity,
};
