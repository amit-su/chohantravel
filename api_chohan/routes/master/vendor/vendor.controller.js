const {
  GET_VENDORS_PROCEDURE,
  INSERT_OR_UPDATE_VENDOR_PROCEDURE,
  DELETE_PROCEDURE
} = require("../../../utils/constants");
const databaseService = require("../../../utils/dbClientService");

const getAllVendor = async (req, res) => {
  try {
    const params = {
      PageNumber: req.body.page || 1,
      PageSize: req.body.count || 10,
      CompanyID: req.body.companyID || 0
    };
    console.log("Vendor Fetch Params:", params);
    let allVendor = await databaseService.callStoredProcedure(
      req,
      GET_VENDORS_PROCEDURE,
      params
    );
    console.log(allVendor);
    res.json(allVendor);
  } catch (error) {
    res.status(400).json(error.message);
  }
};

// const deleteParty = async (req, res) => {
//   try {
//     const resultPartyDelete = await databaseService.callStoredProcedure(
//       req,
//       DELETE_PROCEDURE,
//       {
//         table_name: "PartyMast",
//         column_name: "id",
//         column_value: req.params.id,
//       }
//     );
//     res.json(resultPartyDelete);
//   } catch (error) {
//     res.status(400).json(error.message);
//     console.log(error.message);
//   }
// };

// const addParty = async (req, res) => {
//   try {
//     console.log(req.body);
//     const params = {
//       PartyName: req.body.partyName,
//       PartyAddr: req.body.address,
//       CityID: parseInt(req.body.cityId),
//       Pincode: req.body.pinCode,
//       MobileNo: req.body.mobileNo,
//       WhatsAppNo: req.body.whatsAppNo,
//       Email: req.body.email,
//       GSTNo: req.body.gstNo,
//       PANNo: req.body.panNo,
//       ReferredBy: req.body.referredBy,
//       PartyActive: req.body.partyActive,
//       CrDays: parseInt(req.body.crDays),
//       CrLimit: parseFloat(req.body.crLimit),
//       UserID: 1,
//       Operation: 1,
//       cpName: req.body.cpName,
//       cpNumber: req.body.cpNumber,
//       TmpCompId: parseInt(req.body.Company_ID),
//       PartyType: req.body.partyType,
//     };
//     const resultInsert = await databaseService.callStoredProcedure(
//       req,
//       INSERT_OR_UPDATE_PARTY_PROCEDURE,
//       params
//     );
//     console.log(resultInsert);
//     res.json(resultInsert);
//   } catch (error) {
//     res.status(400).json(error.message);
//     console.log(error.message);
//   }
// };

// const updateParty = async (req, res) => {
//   try {
//     console.log(req.body);
//     const params = {
//       PartyID: req.params.id,
//       PartyName: req.body.partyName,
//       PartyAddr: req.body.address,
//       CityID: parseInt(req.body.cityId),
//       Pincode: req.body.pinCode,
//       MobileNo: req.body.mobileNo,
//       WhatsAppNo: req.body.whatsAppNo,
//       Email: req.body.email,
//       GSTNo: req.body.gstNo,
//       PANNo: req.body.panNo,
//       ReferredBy: req.body.referredBy,
//       PartyActive: req.body.partyActive,
//       CrDays: parseInt(req.body.crDays),
//       CrLimit: parseFloat(req.body.crLimit),
//       UserID: 1,
//       Operation: 2,
//       cpName: req.body.cpName,
//       cpNumber: req.body.cpNumber,
//       TmpCompId: parseInt(req.body.Company_ID),
//       PartyType: req.body.PartyType,
//     };
//     const resultInsert = await databaseService.callStoredProcedure(
//       req,
//       INSERT_OR_UPDATE_PARTY_PROCEDURE,
//       params
//     );
//     console.log(resultInsert);
//     res.json(resultInsert);
//   } catch (error) {
//     res.status(400).json(error.message);
//     console.log(error.message);
//   }
// };

const addVendor = async (req, res) => {
  try {
    const params = {
      VendorType: req.body.vendorType,
      VendorName: req.body.vendorName,
      VendAddr: req.body.vendAddr,
      CityID: parseInt(req.body.cityID),
      PinCode: req.body.pinCode,
      MobileNo: req.body.mobileNo,
      WhatsAppNo: req.body.whatsAppNo,
      Email: req.body.email,
      GstNo: req.body.gstNo,
      CompanyID: parseInt(req.body.companyID),
      PanNo: req.body.panNo,
      BankName: req.body.bankName,
      BankBranch: req.body.bankBranch,
      BankAcNo: req.body.bankAcNo,
      BankAcType: req.body.bankAcType,
      BankIFSC: req.body.bankIFSC,
      VendorActive: req.body.vendorActive ? 1 : 0,
      ReferredBy: req.body.referredBy,
      Operation: 1, // Insert
    };
    const result = await databaseService.callStoredProcedure(
      req,
      INSERT_OR_UPDATE_VENDOR_PROCEDURE,
      params
    );
    res.json(result);
  } catch (error) {
    res.status(400).json(error.message);
  }
};

const updateVendor = async (req, res) => {
  try {
    const params = {
      VendorID: req.params.id,
      VendorType: req.body.vendorType,
      VendorName: req.body.vendorName,
      VendAddr: req.body.vendAddr,
      CityID: parseInt(req.body.cityID),
      PinCode: req.body.pinCode,
      MobileNo: req.body.mobileNo,
      WhatsAppNo: req.body.whatsAppNo,
      Email: req.body.email,
      GstNo: req.body.gstNo,
      CompanyID: parseInt(req.body.companyID),
      PanNo: req.body.panNo,
      BankName: req.body.bankName,
      BankBranch: req.body.bankBranch,
      BankAcNo: req.body.bankAcNo,
      BankAcType: req.body.bankAcType,
      BankIFSC: req.body.bankIFSC,
      VendorActive: req.body.vendorActive ? 1 : 0,
      ReferredBy: req.body.referredBy,
      Operation: 2, // Update
    };
    const result = await databaseService.callStoredProcedure(
      req,
      INSERT_OR_UPDATE_VENDOR_PROCEDURE,
      params
    );
    res.json(result);
  } catch (error) {
    res.status(400).json(error.message);
  }
};

const deleteVendor = async (req, res) => {
  try {
    const result = await databaseService.callStoredProcedure(
      req,
      DELETE_PROCEDURE,
      {
        table_name: "VendorMast",
        column_name: "id",
        column_value: req.params.id,
      }
    );
    res.json(result);
  } catch (error) {
    res.status(400).json(error.message);
  }
};

module.exports = {
  getAllVendor,
  addVendor,
  updateVendor,
  deleteVendor,
};
