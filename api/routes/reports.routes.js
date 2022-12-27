//adding dependencies
const express = require("express");

//importing controller
const ReportsControllers = require("../controllers/reports.controllers");

//importing middlewares
const AuthorizeTo = require("../middlewares/Auth/Authorization");

//importing constants
const { SYSTEM_ROLES_ENUM } = require("../../config/constants");

//initializing route
const router = express.Router();

router.get(
  "/benefits",
  AuthorizeTo(SYSTEM_ROLES_ENUM[0]),
  ReportsControllers.benefitsReport
);

router.get(
  "/assets",
  AuthorizeTo(SYSTEM_ROLES_ENUM[0]),
  ReportsControllers.assetsReports
);

router.get(
  "/timeoffs",
  AuthorizeTo(SYSTEM_ROLES_ENUM[0]),
  ReportsControllers.timeoffsReport
);

router.get(
  "/salaries",
  AuthorizeTo(SYSTEM_ROLES_ENUM[0]),
  ReportsControllers.salaryReport
);

module.exports = router;
