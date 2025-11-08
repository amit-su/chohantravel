const express = require("express");
const {
  createRolePermission,
  getAllRolePermission,
  getSingleRolePermission,
  updateRolePermission,
  deleteSingleRolePermission,
} = require("./rolePermission.controllers");

const rolePermissionRoutes = express.Router();

rolePermissionRoutes.post(
  "/",
  createRolePermission
);
rolePermissionRoutes.get(
  "/",
  getAllRolePermission
);
rolePermissionRoutes.get(
  "/:id",
  getSingleRolePermission
);
rolePermissionRoutes.put(
  "/:id",
  updateRolePermission
);
rolePermissionRoutes.delete(
  "/:id",
  deleteSingleRolePermission
);

module.exports = rolePermissionRoutes;
