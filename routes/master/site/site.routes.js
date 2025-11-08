const express = require("express");

const {
  getAllSite,
  addSite,
  deleteSite,
  updateSite,
  getAllSiteByUserId
} = require("./site.controller");

const siteRoutes = express.Router();

siteRoutes.get("/", getAllSite);

siteRoutes.post("/", addSite);

siteRoutes.put("/:id", updateSite);
siteRoutes.delete("/:id", deleteSite);
// Route to get sites by user ID
siteRoutes.get("/:userId",getAllSiteByUserId); // New route for getting sites by user ID
module.exports = siteRoutes;
