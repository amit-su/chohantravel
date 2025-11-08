const databaseService = require("../../../utils/dbClientService");
const {
  DELETE_PROCEDURE,
  INSERT_OR_UPDATE_HELPER_PROCEDURE,
  GET_HELPER_PROCEDURE,
} = require("../../../utils/constants");

const createHelper = async (req, res) => {
  try {
    const result = await databaseService.callStoredProcedure(
      req,
      INSERT_OR_UPDATE_HELPER_PROCEDURE,
      {
        HelperID: null,
        HelperName: req.body.helperName,
        HelperAddr: req.body.helperAddr,
        CityID: req.body.cityID,
        Pincode: req.body.pincode,
        MobileNo: req.body.mobileNo,
        WhatsAppNo: req.body.whatsAppNo,
        // HelperLicenseNo: req.body.helperLicenseNo,
        // HelperLicenseExpDate: new Date(req.body.helperLicenseExpDate),
        AadharCardNo: req.body.aadharCardNo,
        BankName: req.body.bankName,
        BankBranch: req.body.branch_name,
        BankAcNo: req.body.bankAcNo,
        BankAcType: req.body.bankAcType,
        BankIFSC: req.body.bankIFSC,
        HelperActive: req.body.helperActive === "1" ? 1 : 0,
        ReferredBy: req.body.referredBy,
        // LicensePath: req.body.licensePath,
        AdharPath: req.body.adharPath,
        Dateofjoin: req.body.Dateofjoin,
        EmployeeNo: req.body.EmployeeNo,
        PFNO: req.body.pfNo,
        TmpCompId: parseInt(req.body.Company_ID),
        ESINO: req.body.esiNo,

        Operation: 1,
      }
    );
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
    console.error("Error occurred:", error);
  }
};

const getAllHelper = async (req, res) => {
  try {
    // get all product_category
    const params = {
      PageNo: req.query.page || 1,
      PageSize: req.query.count || 10000,
      SiteId: req.query.siteId || 0,
      query: req.query.query || "",
    };

    const resultdata = await databaseService.callStoredProcedure(
      req,
      GET_HELPER_PROCEDURE,
      params
    );

    res.json(resultdata);
  } catch (error) {
    res.status(400).json(error.message);
    console.log(error.message);
  }
};

const updateHelper = async (req, res) => {
  try {
    const result = await databaseService.callStoredProcedure(
      req,
      INSERT_OR_UPDATE_HELPER_PROCEDURE,
      {
        HelperID: req.params.id,
        HelperName: req.body.helperName,
        HelperAddr: req.body.helperAddr,
        CityID: req.body.cityID,
        Pincode: req.body.pincode,
        MobileNo: req.body.mobileNo,
        WhatsAppNo: req.body.whatsAppNo,

        AadharCardNo: req.body.aadharCardNo,
        BankName: req.body.bankName,
        BankBranch: req.body.bankBranch,
        BankAcNo: req.body.bankAcNo,
        BankAcType: req.body.bankAcType,
        BankIFSC: req.body.bankIFSC,
        HelperActive: req.body.helperActive === "1" ? 1 : 0,
        ReferredBy: req.body.referredBy,

        AdharPath: req.body.adharPath,
        Dateofjoin: req.body.Dateofjoin,
        EmployeeNo: req.body.EmployeeNo,
        PFNO: req.body.pfNo,
        ESINO: req.body.esiNo,
        TmpCompId: parseInt(req.body.Company_ID),
        Operation: 2,
      }
    );
    res.json(result);
  } catch (error) {
    res.status(400).json(error.message);
    console.log(error.message);
  }
};

const deleteSingleHelper = async (req, res) => {
  try {
    // delete Helper
    const params = {
      table_name: "HelperMast",
      column_name: "id",
      column_value: req.params.id,
    };
    const deletedHelper = await databaseService.callStoredProcedure(
      req,
      DELETE_PROCEDURE,
      params
    );
    res.json(deletedHelper);
  } catch (error) {
    res.status(400).json(error.message);
    console.log(error.message);
  }
};

module.exports = {
  createHelper,
  getAllHelper,
  updateHelper,
  deleteSingleHelper,
};
