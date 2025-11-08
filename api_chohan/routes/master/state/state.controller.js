const databaseService = require("../../../utils/dbClientService");
const {
  GET_CITY_PROCEDURE,
  INSERT_OR_UPDATE_CITY_PROCEDURE,
  DELETE_PROCEDURE,
  GET_STATE_PROCEDURE,
  INSERT_OR_UPDATE_STATE_PROCEDURE,
} = require("../../../utils/constants");

const addState = async (req, res) => {
  try {
    const params = {
      StateName: req.body.statename,
      CompanyName: req.body.companyname,
    };
    const result = await databaseService.callStoredProcedure(req,
      INSERT_OR_UPDATE_STATE_PROCEDURE,
      params
    );

    res.json(result);
  } catch (error) {
    res.status(400).json(error.message);
    console.log(error.message);
  }
};

const getAllState = async (req, res) => {
  try {
    const params = {
      PageNumber: req.query.page,
      PageSize: req.query.count,
    };
    const AllState = await databaseService.callStoredProcedure(req,
      GET_STATE_PROCEDURE,
      params
    );
    res.json(AllState);
  } catch (error) {
    res.status(400).json(error.message);
    console.log(error.message);
  }
};

const updateState = async (req, res) => {
  try {
    const params = {
      StateID: req.params.id,
      StateName: req.body.statename,
      CompanyName: req.body.companyname,
    };
    const result = await databaseService.callStoredProcedure(req,
      INSERT_OR_UPDATE_STATE_PROCEDURE,
      params
    );
    res.json(result);
  } catch (error) {
    res.status(400).json(error.message);
    console.log(error.message);
  }
};
const deleteState = async (req, res) => {
  try {
    // delete productcategory
    const params = {
      table_name: "StateMast",
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
  addState,
  getAllState,
  updateState,
  deleteState,
};
