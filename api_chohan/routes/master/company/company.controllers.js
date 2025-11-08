const databaseService = require("../../../utils/dbClientService");
const {
  DELETE_PROCEDURE,
  GET_COMPANY_PROCEDURE,
  INSERT_OR_UPDATE_COMPANY_PROCEDURE,
} = require("../../../utils/constants");

const createCompany = async (req, res) => {
  try {
    console.log(req.body);
    const result = await databaseService.callStoredProcedure(req,
      INSERT_OR_UPDATE_COMPANY_PROCEDURE,
      {
        Name: req.body.Name,
        Logo: "null",
        Currency: "RUPEE",
        Address: req.body.Address,
        City: req.body.City,
        Country: "INDIA",
        Phone: req.body.Phone,
        Email: req.body.Email,
        Fax: req.body.Fax,
        Website: req.body.Website,
        CreatedBy: 1,
        ModifiedBy: 1,
        Cancelled: 0,
        GSTNo: req.body.GSTNo,
        PANNo: req.body.PANNo,
        HSNCode: req.body.HSNCode,
        user_id: 1,
        company_id: 1,
        ShortName: req.body.ShortName,
        CINNo: req.body.CINNo,
        CGST: req.body.CGST,
        SGST: req.body.SGST,
        IGST: req.body.IGST,
        BankAcName:req.body.BankAcName,
        BankName:req.body.BankName,
        BankBranchAddr:req.body.BankBranchAddr,
        BankAcNo:req.body.BankAcNo,
        BankIFSCode:req.body.BankIFSCode,
        Operation: 1,
      }
    );
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
    console.error("Error occurred:", error);
  }
};

const getAllCompany = async (req, res) => {
  try {
    // get all product_category
    const params = {
      PageNo: 1,
      PageSize: 100,
    };

    const resultdata = await databaseService.callStoredProcedure(req,
      GET_COMPANY_PROCEDURE,
      params
    );

    res.json(resultdata);
  } catch (error) {
    res.status(400).json(error.message);
    console.log(error.message);
  }
};

const updateCompany = async (req, res) => {
  try {
    console.log("updateCOmpan", req.body);
    const result = await databaseService.callStoredProcedure(req,
      INSERT_OR_UPDATE_COMPANY_PROCEDURE,
      {
        ID: req.params.id,
        Name: req.body.Name,
        Logo: "null",
        Currency: "RUPEE",
        Address: req.body.Address,
        City: req.body.City,
        Country: "INDIA",
        Phone: req.body.Phone,
        Email: req.body.Email,
        Fax: req.body.Fax,
        Website: req.body.Website,
        CreatedBy: 1,
        ModifiedBy: 1,
        Cancelled: 0,
        GSTNo: req.body.GSTNo,
        PANNo: req.body.PANNo,
        HSNCode: req.body.HSNCode,
        user_id: 1,
        company_id: 1,
        ShortName: req.body.ShortName,
        CINNo: req.body.CINNo,
        CGST: req.body.CGST,
        SGST: req.body.SGST,
        IGST: req.body.IGST,
        BankAcName:req.body.BankAcName,
        BankName:req.body.BankName,
        BankBranchAddr:req.body.BankBranchAddr,
        BankAcNo:req.body.BankAcNo,
        BankIFSCode:req.body.BankIFSCode,
        Operation: 2,
        PFRegNo:req.body.PFRegNo,
        ESIRegNo:req.body.ESIRegNo,
      }
    );
    res.json(result);
  } catch (error) {
    res.status(400).json(error.message);
    console.log(error.message);
  }
};

const deleteSingleCompany = async (req, res) => {
  try {
    // delete Company
    const params = {
      table_name: "CompanyMast",
      column_name: "Id",
      column_value: req.params.id,
    };
    const deletedCompany = await databaseService.callStoredProcedure(req,
      DELETE_PROCEDURE,
      params
    );
    res.json(deletedCompany);
  } catch (error) {
    res.status(400).json(error.message);
    console.log(error.message);
  }
};

module.exports = {
  createCompany,
  getAllCompany,
  updateCompany,
  deleteSingleCompany,
  // deleteSingleProductCategory,
};
