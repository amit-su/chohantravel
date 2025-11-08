const databaseService = require("../../utils/dbClientService");
const {
  DELETE_PROCEDURE,
  GET_STAFF_DATA,
  INSERT_OR_UPDATE_STAFF,
  GET_HELPER_PROCEDURE,
} = require("../../utils/constants");

const createStaff = async (req, res) => {
  try {
    const result = await databaseService.callStoredProcedure(
      req,
      INSERT_OR_UPDATE_STAFF,
      {
        staffID: null,
        staffName: req.body.helperName,
        staffAddr: req.body.helperAddr,
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
        DriverActive: req.body.helperActive === "1" ? 1 : 0,
        ReferredBy: req.body.referredBy,
        // LicensePath: req.body.licensePath,
        AdharPath: req.body.adharPath,
        Dateofjoin: req.body.Dateofjoin,
        EmployeeNo: req.body.EmployeeNo,
        PFNO: req.body.pfNo,
        ESINO: req.body.esiNo,
        email: req.body.email,
        password: req.body.password,
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

const getAllStaff = async (req, res) => {
  try {
    // get all product_category
    const params = {
      PageNo: req.query.page || 1,
      PageSize: req.query.count || 10000,
      query: req.query.query || "",
    };

    const resultdata = await databaseService.callStoredProcedure(
      req,
      GET_STAFF_DATA,
      params
    );

    res.json(resultdata);
  } catch (error) {
    res.status(400).json(error.message);
    console.log(error.message);
  }
};

const updateStaff = async (req, res) => {
  try {
    const result = await databaseService.callStoredProcedure(
      req,
      INSERT_OR_UPDATE_STAFF,
      {
        staffID: req.params.id,
        staffName: req.body.helperName,
        staffAddr: req.body.helperAddr,
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
        DriverActive: req.body.helperActive === "1" ? 1 : 0,
        ReferredBy: req.body.referredBy,
        // LicensePath: req.body.licensePath,
        AdharPath: req.body.adharPath,
        Dateofjoin: req.body.Dateofjoin,
        EmployeeNo: req.body.EmployeeNo,
        PFNO: req.body.pfNo,
        ESINO: req.body.esiNo,
        email: req.body.email,
        password: req.body.password,
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

const deleteSingleStaff = async (req, res) => {
  try {
    // delete Helper
    const params = {
      table_name: "StaffMast",
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
  createStaff,
  getAllStaff,
  updateStaff,
  deleteSingleStaff,
};
