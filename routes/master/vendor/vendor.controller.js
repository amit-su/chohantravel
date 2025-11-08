const {
  GET_VENDORS_PROCEDURE,
  INSERT_OR_UPDATE_VENDOR_PROCEDURE,
  DELETE_PROCEDURE,
} = require("../../../utils/constants");
const databaseService = require("../../../utils/dbClientService");

const getAllVendor = async (req, res) => {
  try {
    console.log(req.query);
    const menuResult = await databaseService.callStoredProcedure(req,
      GET_VENDORS_PROCEDURE,
      { PageNumber: req.query.page, PageSize: req.query.count }
    );
    res.json(menuResult);
  } catch (error) {
    console.log(error);
    res.json(error.message);
  }
};

// const getSingleMenu = async (req, res) => {
//   try {
//     const singleMenuResult = await databaseService.callStoredProcedure(req,
//       GET_MENU_PROCEDURE,
//       {
//         menuId: req.params.id,
//       }
//     );

//     res.json(singleMenuResult);
//   } catch (error) {
//     console.log(error);
//     res.json(error);
//   }
// };

const createVendor = async (req, res) => {
  try {
    console.log("req.body in vendor", req.body);

    const insertResult = await databaseService.callStoredProcedure(req,
      INSERT_OR_UPDATE_VENDOR_PROCEDURE,
      {
        VendorType: req.body.vendorType,
        VendorName: req.body.vendorName,
        VendAddr: req.body.vendorAddr,
        CityID: parseInt(req.body.cityId),
        PinCode: req.body.pinCode,
        MobileNo: req.body.mobileNo,
        WhatsAppNo: req.body.whatsAppNo,
        Email: req.body.email,
        GstNo: req.body.gstNo,
        PanNo: req.body.panNo,
        BankName: req.body.bankName,
        BankBranch: req.body.bankBranch,
        BankAcNo: req.body.bankAccNo,
        BankAcType: req.body.bankAccType,
        BankIFSC: req.body.bankIFSC,
        VendorActive: req.body.vendorctive,
        ReferredBy: req.body.referredBy,
        Operation: 1,
      }
    );
    console.log("insertResult", insertResult);
    res.json(insertResult);
  } catch (error) {
    console.log(error.message);
    res.json(error.message);
  }
};

const updateSinglVendor = async (req, res) => {
  try {
    console.log("update vendor", req.body);

    const Updateresult = await databaseService.callStoredProcedure(req,
      INSERT_OR_UPDATE_VENDOR_PROCEDURE,
      {
        VendorID: parseInt(req.params.id),
        VendorType: req.body.vendorType,
        VendorName: req.body.vendorName,
        VendAddr: req.body.vendAddr,
        CityID: parseInt(req.body.cityID),
        PinCode: req.body.pinCode,
        MobileNo: req.body.mobileNo,
        WhatsAppNo: req.body.whatsAppNo,
        Email: req.body.email,
        GstNo: req.body.gstNo,
        PanNo: req.body.panNo,
        BankName: req.body.bankName,
        BankBranch: req.body.bankBranch,
        BankAcNo: req.body.bankAcNo,
        BankAcType: req.body.bankAcType,
        BankIFSC: req.body.bankIFSC,
        VendorActive: req.body.vendorActive,
        ReferredBy: req.body.referredBy,
        Operation: 2,
      }
    );
    res.json(Updateresult);
  } catch (error) {
    console.log(error);
    res.json(error);
  }
};

const deleteSingleVendor = async (req, res) => {
  try {
    const resultDelete = await databaseService.callStoredProcedure(req,
      DELETE_PROCEDURE,
      {
        table_name: "VendorMast",
        column_name: "id",
        column_value: req.params.id,
      }
    );
    res.json(resultDelete);
  } catch (error) {
    console.log(error.message);
    res.json(error);
  }
};

module.exports = {
  getAllVendor,
  createVendor,
  deleteSingleVendor,
  updateSinglVendor,
};
