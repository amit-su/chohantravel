const databaseService = require("../../../utils/dbClientService");
const {
  DELETE_PROCEDURE,

  INSERT_OR_UPDATE_STATE_PROCEDURE,
  GET_PARTY_SITE_PROCEDURE,
  INSERT_OR_UPDATE_SITE_PROCEDURE,
  GET_PARTY_SITE_BY_USERID_PROCEDURE,
} = require("../../../utils/constants");

const addSite = async (req, res) => {
  try {
    const params = {
      SiteName: req.body.siteName,
      SiteShortName: req.body.siteShortName,
      SiteActive: parseInt(req.body.siteActive),
      SiteAddress: req.body.siteAddress,
      CityID: req.body.CityId,
      PinCode: req.body.pincode,
      PartyID: req.body.partyId,
      UserId: req.body.UserId,
      helperkhuraki: req.body.HelperKhurakiAmt,
      driverkhuraki: req.body.DriverKhurakiAmt,
      Operation: 1,
    };
    const result = await databaseService.callStoredProcedure(
      req,
      INSERT_OR_UPDATE_SITE_PROCEDURE,
      params
    );

    res.json(result);
  } catch (error) {
    res.status(400).json(error.message);
    console.log(error.message);
  }
};

const getAllSite = async (req, res) => {
  try {
    const params = {
      PageNo: 1,
      PageSize: 10001,
    };
    const AllSite = await databaseService.callStoredProcedure(
      req,
      GET_PARTY_SITE_PROCEDURE,
      params
    );
    res.json(AllSite);
  } catch (error) {
    res.status(400).json(error.message);
    console.log(error.message);
  }
};

const getAllSiteByUserId = async (req, res) => {
  try {
    // Extract userId from route parameters and convert to integer
    const userId = parseInt(req.params.userId, 10); // Convert to integer

    // Validate userId
    if (isNaN(userId)) {
      return res
        .status(400)
        .json({ message: "User  ID must be a valid number." });
    }

    const params = {
      UserId: userId, // Include userId in the parameters
    };

    const allSite = await databaseService.callStored(
      req,
      GET_PARTY_SITE_BY_USERID_PROCEDURE,
      params
    );

    // Send the response
    res.json(allSite);
  } catch (error) {
    console.error("Error fetching sites:", error); // Enhanced logging
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching sites.",
      error: error.message,
    });
  }
};

const updateSite = async (req, res) => {
  try {
    console.log("update site", req.body);
    const params = {
      SiteID: req.params.id,
      SiteName: req.body.siteName,
      SiteShortName: req.body.siteShortName,
      SiteActive: parseInt(req.body.siteActive),
      SiteAddress: req.body.siteAddress,
      CityID: req.body.cityID,
      PinCode: req.body.pinCode,
      PartyID: parseInt(req.body.partyName),
      UserId: req.body.UserId,
      helperkhuraki: req.body.HelperKhurakiAmt,
      driverkhuraki: req.body.DriverKhurakiAmt,
      Operation: 2,
    };
    const result = await databaseService.callStoredProcedure(
      req,
      INSERT_OR_UPDATE_SITE_PROCEDURE,
      params
    );
    res.json(result);
  } catch (error) {
    res.status(400).json(error.message);
    console.log(error.message);
  }
};

const deleteSite = async (req, res) => {
  try {
    // delete productcategory
    const params = {
      table_name: "PartySiteMast",
      column_name: "id",
      column_value: req.params.id,
    };
    const deletedProductBrand = await databaseService.callStoredProcedure(
      req,
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
  addSite,
  getAllSite,
  updateSite,
  deleteSite,
  getAllSiteByUserId,
};
