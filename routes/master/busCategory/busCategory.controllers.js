const databaseService = require("../../../utils/dbClientService");
const {
  GET_BUS_CATEGORY_PROCEDURE,
  INSERT_OR_UPDATE_BUS_CATEGORY_PROCEDURE,
  DELETE_PROCEDURE,
} = require("../../../utils/constants");

const createBusCategory = async (req, res) => {
  try {
    console.log(req.body);
    const result = await databaseService.callStoredProcedure(req,
      INSERT_OR_UPDATE_BUS_CATEGORY_PROCEDURE,
      {
        CategoryName: req.body.buscategory,
        EntryDate: req.body.entrydate,
        Operation: 1,
      }
    );
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
    console.error("Error occurred:", error);
  }
};

const getAllBusCategory = async (req, res) => {
  try {
    // get all product_category
    const params = {
      PageNo: 1,
      PageSize: 10000,
    };

    const resultdata = await databaseService.callStoredProcedure(req,
      GET_BUS_CATEGORY_PROCEDURE,
      params
    );

    res.json(resultdata);
  } catch (error) {
    res.status(400).json(error.message);
    console.log(error.message);
  }
};

const updateBusCategory = async (req, res) => {
  try {
    const params = {
      CategoryID: req.params.id,
      CategoryName: req.body.buscategory,
      EntryDate: new Date(req.body.entrydate),
      Operation: 2,
    };
    const updatedBusCategory = await databaseService.callStoredProcedure(req,
      INSERT_OR_UPDATE_BUS_CATEGORY_PROCEDURE,
      params
    );
    res.json(updatedBusCategory);
  } catch (error) {
    res.status(400).json(error.message);
    console.log(error.message);
  }
};

const deleteSingleBusCategory = async (req, res) => {
  try {
    // delete BusCategory
    const params = {
      table_name: "BusCategory",
      column_name: "id",
      column_value: req.params.id,
    };
    const deletedBusCategory = await databaseService.callStoredProcedure(req,
      DELETE_PROCEDURE,
      params
    );
    res.json(deletedBusCategory);
  } catch (error) {
    res.status(400).json(error.message);
    console.log(error.message);
  }
};

module.exports = {
  createBusCategory,
  getAllBusCategory,
  updateBusCategory,
  deleteSingleBusCategory,
  // deleteSingleProductCategory,
};
