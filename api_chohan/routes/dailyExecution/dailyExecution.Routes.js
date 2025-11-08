const express = require("express");

const {
  createdailyExecution,
  deleteSingledailyExecution,
  getSingleDailyExecution,
  getAllDailyExecution,
  updateDailyExecution,
  SingledailyExecutionbydate
  
} = require("./dailyExecution.controllers");

const dailyExecutionRoutes = express.Router();

dailyExecutionRoutes.post(
  "/",
  createdailyExecution
);
dailyExecutionRoutes.get(
  "/",
  getAllDailyExecution
);
// dailyExecutionRoutes.get(
//   "/:id",
//   getSingleDailyExecution
// );

dailyExecutionRoutes.put(
  "/:id",
  updateDailyExecution
);
dailyExecutionRoutes.delete(
  "/:id",
  deleteSingledailyExecution
);
dailyExecutionRoutes.get(
  "/:id",
  SingledailyExecutionbydate
  
  
);

module.exports = dailyExecutionRoutes;
