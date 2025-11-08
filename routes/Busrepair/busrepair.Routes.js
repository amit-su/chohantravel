const express = require("express");

const {
  getAllProformaInvoice,
  createbusrepair,
  deleteSingleInvoice,
  getbusrepair,
  updateProformaInvoice,
  powerBiLogin,getAllBusrepair,
  getAllInvoicebooking,deleteSinglebookingInvoice,getbusrepairEdit,
  deleteRepair
} = require("./busrepair.controller");

const RepairRoutes = express.Router();

RepairRoutes.post(
  "/",
  createbusrepair,

);
RepairRoutes.get(
  "/",
  getAllBusrepair,

);


RepairRoutes.get(
  "/:id",
  getbusrepair
);
RepairRoutes.get(
  "/edit/:id",
  getbusrepairEdit
);

RepairRoutes.delete("/:id", deleteRepair);



RepairRoutes.post("/powerbilogin", powerBiLogin);
module.exports = RepairRoutes;
