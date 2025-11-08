const databaseService = require("../../../utils/dbClientService");
const {
  DELETE_PROCEDURE,
  GET_BRANCH_PROCEDURE,
  INSERT_OR_UPDATE_BRANCH_PROCEDURE,
} = require("../../../utils/constants");

const createBranch = async (req, res) => {
  try {
    console.log(req.body);
    const result = await databaseService.callStoredProcedure(req,
      INSERT_OR_UPDATE_BRANCH_PROCEDURE,
      {
        BranchName: req.body.branch_name,
        Address: req.body.address,
        State: req.body.stateName,
        Pincode: req.body.pincode,
        GST: req.body.gst,
        City: req.body.city,
        PAN: req.body.pan,
        ShortName: req.body.ShortName,
        Email: req.body.email,
        status: req.body.status,
        Phone: req.body.phone,
        Operation: 1,
      }
    );
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
    console.error("Error occurred:", error);
  }
};

const getAllBranch = async (req, res) => {
  try {
    // get all product_category
    const params = {
      PageNo: req.query.page,
      PageSize: req.query.count,
    };

    const resultdata = await databaseService.callStoredProcedure(req,
      GET_BRANCH_PROCEDURE,
      params
    );

    res.json(resultdata);
  } catch (error) {
    res.status(400).json(error.message);
    console.log(error.message);
  }
};

const updateBranch = async (req, res) => {
  try {
    console.log("", req.body);
    const result = await databaseService.callStoredProcedure(req,
      INSERT_OR_UPDATE_BRANCH_PROCEDURE,
      {
        BranchID: parseInt(req.params.id),
        BranchName: req.body.branch_name,
        Address: req.body.address,
        State: req.body.state,
        Pincode: req.body.pincode,
        GST: req.body.gst,
        City: req.body.city,
        PAN: req.body.pan,
        ShortName: req.body.ShortName,
        Email: req.body.email,
        status: req.body.status,
        Phone: req.body.phone,
        Operation: 2,
      }
    );
    res.json(result);
  } catch (error) {
    res.status(400).json(error.message);
    console.log(error.message);
  }
};

const deleteSingleBranch = async (req, res) => {
  try {
    // delete Branch
    const params = {
      table_name: "BranchMast",
      column_name: "Id",
      column_value: req.params.id,
    };
    const deletedBranch = await databaseService.callStoredProcedure(req,
      DELETE_PROCEDURE,
      params
    );
    res.json(deletedBranch);
  } catch (error) {
    res.status(400).json(error.message);
    console.log(error.message);
  }
};

module.exports = {
  createBranch,
  getAllBranch,
  updateBranch,
  deleteSingleBranch,
  // deleteSingleProductCategory,
};
