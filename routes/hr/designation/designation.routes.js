const express = require("express");
const {
  createSingleDesignation,
  getAllDesignation,
  getSingleDesignation,
  updateSingleDesignation,
  deleteSingleDesignation,
} = require("./designation.controllers");

const designationRoutes = express.Router();

designationRoutes.post(
  "/",
  createSingleDesignation
);
designationRoutes.get("/", getAllDesignation);
designationRoutes.get(
  "/:id",
  getSingleDesignation
);
designationRoutes.put(
  "/:id",
  updateSingleDesignation
);
designationRoutes.delete(
  "/:id",
  deleteSingleDesignation
);

module.exports = designationRoutes;
