const databaseService = require("../../utils/dbClientService");
const {
    GET_USER,
    INSERT_UPDATE_USER,
  DELETE_PROCEDURE,
} = require("../../utils/constants");
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST;

const addUser = async (req, res) => {
  try {
    const params = {
      username: req.body.username,
      password: req.body.password,
      email:req.body.email,
      roleId: req.body.roleId
    };
    const result = await databaseService.callStoredProcedure(req,
        INSERT_UPDATE_USER,
      params
    );
    console.log(result);
    res.json(result);
  } catch (error) {
    res.status(400).json(error.message);
    console.log(error.message);
  }
};

const getAllUser = async (req, res) => {
  try {
    const params = {
      PageNumber: 1,
      PageSize: 10000,
    };
    const AllCity = await databaseService.callStoredProcedure(req,
        GET_USER,
      params
    );
    res.json(AllCity);
  } catch (error) {
    res.status(400).json(error.message);
    console.log(error.message);
  }
};

const updateUser = async (req, res) => {
  try {
    const params = {
        username: req.body.username,
        password: req.body.password,
        email:req.body.email,id:req.params.id,roleId: req.body.roleId
    };
    const result = await databaseService.callStoredProcedure(req,  
        INSERT_UPDATE_USER,
      params
    );
    res.json(result);
  } catch (error) {
    res.status(400).json(error.message);
    console.log(error.message);
  }
};
const deleteUser = async (req, res) => {
  try {
    // delete productcategory
    const params = {
      table_name: "[User]",
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
    addUser,
    getAllUser,
    updateUser,
    deleteUser,
};
