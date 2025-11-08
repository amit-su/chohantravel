const express = require("express");

const {
  getAllAdvanceToStaffEntry,
  createAdvanceToStaffEntry,
  updateAdvanceToStaffEntry,
  deleteSingleAdvanceToStaffEntry,
  getAllAdvanceEntry,
  getAdvanceToStaffEntry,
  getAdvanceToStaffEntryByType,
} = require("./advanceToStaffEntry.controllers");

const advanceToStaffEntryRoutes = express.Router();

advanceToStaffEntryRoutes.post("/", createAdvanceToStaffEntry);
advanceToStaffEntryRoutes.get("/:id/:date", getAllAdvanceToStaffEntry);
advanceToStaffEntryRoutes.get("/:advanceNo", getAdvanceToStaffEntry);
advanceToStaffEntryRoutes.get("/", getAllAdvanceEntry);
advanceToStaffEntryRoutes.patch("/:id", updateAdvanceToStaffEntry);
advanceToStaffEntryRoutes.delete("/:id", deleteSingleAdvanceToStaffEntry);
advanceToStaffEntryRoutes.get("/staff/:type/:id", getAdvanceToStaffEntryByType);
module.exports = advanceToStaffEntryRoutes;
