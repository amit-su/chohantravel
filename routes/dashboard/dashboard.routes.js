const express = require("express");
const {
  getDashboardData,
  gateAllBusStock,
  gateAllBookingInfo,
  gateAllexpireDocument,
} = require("./dashboard.controllers");

const dashboardRoutes = express.Router();

dashboardRoutes.get("/", gateAllBookingInfo);
dashboardRoutes.get("/expired-documents", gateAllexpireDocument);
// routing
dashboardRoutes.post("/stock", gateAllBusStock);

module.exports = dashboardRoutes;
