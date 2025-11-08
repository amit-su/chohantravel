const express = require("express");
const {
  getPartyPaginated,
  addParty,
  deleteParty,
  updateParty,
} = require("./party.controller");

const partyRoutes = express.Router();

partyRoutes.get("/",  getPartyPaginated);
partyRoutes.post("/",  addParty);
partyRoutes.delete("/:id",  deleteParty);
partyRoutes.patch("/:id",  updateParty);

module.exports = {
  partyRoutes,
};
