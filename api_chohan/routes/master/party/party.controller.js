const {
  GET_PARTY_PROCEDURE,
  GET_CITY_PROCEDURE,
  INSERT_OR_UPDATE_PARTY_PROCEDURE,
  DELETE_PROCEDURE,
} = require("../../../utils/constants");
const databaseService = require("../../../utils/dbClientService");

const getPartyPaginated = async (req, res) => {
  try {
    const params = {
      PageNumber: req.query.page || 1,
      PageSize: req.query.count || 10000,
      query: req.query.query || "",
    };

    let allParty = await databaseService.callStoredProcedure(
      req,
      GET_PARTY_PROCEDURE,
      params
    );
    const AllCity = await databaseService.callStoredProcedure(
      req,
      GET_CITY_PROCEDURE,
      {
        PageNumber: req.query.page,
        PageSize: req.query.count,
      }
    );
    const CityData = AllCity.data;
    allParty = { ...allParty, CityData };
    res.json(allParty);
  } catch (error) {
    res.status(400).json(error.message);
    console.log(error.message);
  }
};

const deleteParty = async (req, res) => {
  try {
    const resultPartyDelete = await databaseService.callStoredProcedure(
      req,
      DELETE_PROCEDURE,
      {
        table_name: "PartyMast",
        column_name: "id",
        column_value: req.params.id,
      }
    );
    res.json(resultPartyDelete);
  } catch (error) {
    res.status(400).json(error.message);
    console.log(error.message);
  }
};

const addParty = async (req, res) => {
  try {
    console.log(req.body);
    const params = {
      PartyName: req.body.partyName,
      PartyAddr: req.body.address,
      CityID: parseInt(req.body.cityId),
      Pincode: req.body.pinCode,
      MobileNo: req.body.mobileNo,
      WhatsAppNo: req.body.whatsAppNo,
      Email: req.body.email,
      GSTNo: req.body.gstNo,
      PANNo: req.body.panNo,
      ReferredBy: req.body.referredBy,
      PartyActive: req.body.partyActive,
      CrDays: parseInt(req.body.crDays),
      CrLimit: parseFloat(req.body.crLimit),
      UserID: 1,
      Operation: 1,
      cpName: req.body.cpName,
      cpNumber: req.body.cpNumber,
      TmpCompId: parseInt(req.body.Company_ID),
      PartyType: req.body.partyType,
    };
    const resultInsert = await databaseService.callStoredProcedure(
      req,
      INSERT_OR_UPDATE_PARTY_PROCEDURE,
      params
    );
    console.log(resultInsert);
    res.json(resultInsert);
  } catch (error) {
    res.status(400).json(error.message);
    console.log(error.message);
  }
};

const updateParty = async (req, res) => {
  try {
    console.log(req.body);
    const params = {
      PartyID: req.params.id,
      PartyName: req.body.partyName,
      PartyAddr: req.body.address,
      CityID: parseInt(req.body.cityId),
      Pincode: req.body.pinCode,
      MobileNo: req.body.mobileNo,
      WhatsAppNo: req.body.whatsAppNo,
      Email: req.body.email,
      GSTNo: req.body.gstNo,
      PANNo: req.body.panNo,
      ReferredBy: req.body.referredBy,
      PartyActive: req.body.partyActive,
      CrDays: parseInt(req.body.crDays),
      CrLimit: parseFloat(req.body.crLimit),
      UserID: 1,
      Operation: 2,
      cpName: req.body.cpName,
      cpNumber: req.body.cpNumber,
      TmpCompId: parseInt(req.body.Company_ID),
      PartyType: req.body.PartyType,
    };
    const resultInsert = await databaseService.callStoredProcedure(
      req,
      INSERT_OR_UPDATE_PARTY_PROCEDURE,
      params
    );
    console.log(resultInsert);
    res.json(resultInsert);
  } catch (error) {
    res.status(400).json(error.message);
    console.log(error.message);
  }
};

module.exports = {
  getPartyPaginated,
  deleteParty,
  addParty,
  updateParty,
};
