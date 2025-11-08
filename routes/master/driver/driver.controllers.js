const databaseService = require("../../../utils/dbClientService");
const {
  GET_DRIVER_PROCEDURE,
  INSERT_OR_UPDATE_DRIVER_PROCEDURE,
  DELETE_PROCEDURE,
} = require("../../../utils/constants");

const createDriver = async (req, res) => {
  try {
    const result = await databaseService.callStoredProcedure(
      req,
      INSERT_OR_UPDATE_DRIVER_PROCEDURE,
      {
        DriverID: null,
        DriverName: req.body.driverName,
        DriverType: req.body.driverType,
        DriverAddr: req.body.driverAddr,
        CityID: req.body.cityID,
        Pincode: req.body.pincode,
        MobileNo: req.body.mobileNo,
        WhatsAppNo: req.body.whatsAppNo,
        DrvLicenseNo: req.body.drvLicenseNo,
        DrvLicenseExpDate: new Date(req.body.drvLicenseExpDate),
        AadharCardNo: req.body.aadharCardNo,
        BankName: req.body.bankName,
        BankBranch: req.body.branch_name,
        BankAcNo: req.body.bankAcNo,
        BankAcType: req.body.bankAcType,
        BankIFSC: req.body.bankIFSC,
        DriverActive: req.body.driverActive === "1" ? 1 : 0,
        ReferredBy: req.body.referredBy,
        LicensePath: req.body.licensePath,
        AdharPath: req.body.adharPath,
        Dateofjoin: req.body.Dateofjoin,
        EmployeeNo: req.body.EmployeeNo,
        PFNO: req.body.pfNo,
        ESINO: req.body.esiNo,
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

const getAllDriver = async (req, res) => {
  try {
    // get all product_category
    console.log(res.body, "76756");
    const params = {
      PageNo: req.query.page || 1,
      PageSize: req.query.count || 100000,
      SiteId: req.query.siteId || 0,
      query: req.query.query || "",
    };

    const resultdata = await databaseService.callStoredProcedure(
      req,
      GET_DRIVER_PROCEDURE,
      params
    );

    res.json(resultdata);
  } catch (error) {
    res.status(400).json(error.message);
    console.log(error.message);
  }
};

const updateDriver = async (req, res) => {
  try {
    const result = await databaseService.callStoredProcedure(
      req,
      INSERT_OR_UPDATE_DRIVER_PROCEDURE,
      {
        DriverID: req.params.id,
        DriverName: req.body.driverName,
        DriverType: req.body.driverType,
        DriverAddr: req.body.driverAddr,
        CityID: req.body.cityID,
        Pincode: req.body.pincode,
        MobileNo: req.body.mobileNo,
        WhatsAppNo: req.body.whatsAppNo,
        DrvLicenseNo: req.body.drvLicenseNo,
        DrvLicenseExpDate: new Date(req.body.drvLicenseExpDate),
        AadharCardNo: req.body.aadharCardNo,
        BankName: req.body.bankName,
        BankBranch: req.body.bankBranch,
        BankAcNo: req.body.bankAcNo,
        BankAcType: req.body.bankAcType,
        BankIFSC: req.body.bankIFSC,
        DriverActive: req.body.driverActive === "1" ? 1 : 0,
        ReferredBy: req.body.referredBy,
        LicensePath: req.body.licensePath,
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

const deleteSingleDriver = async (req, res) => {
  try {
    // delete Driver
    const params = {
      table_name: "DriverMast",
      column_name: "id",
      column_value: req.params.id,
    };
    const deletedDriver = await databaseService.callStoredProcedure(
      req,
      DELETE_PROCEDURE,
      params
    );
    res.json(deletedDriver);
  } catch (error) {
    res.status(400).json(error.message);
    console.log(error.message);
  }
};

module.exports = {
  createDriver,
  getAllDriver,
  updateDriver,
  deleteSingleDriver,
};
