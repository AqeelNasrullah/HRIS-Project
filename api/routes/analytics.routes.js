//adding dependencies
const express = require("express");

//importing controller
const AnalyticsController = require("../controllers/analytics.controllers");

//importing middlewares
const { validateData } = require("../middlewares/validation");
const AuthorizeTo = require("../middlewares/Auth/Authorization");

//importing validations
const AnalyticsValidations = require("../validations/analytics.validations");

//importing constants
const { SYSTEM_ROLES_ENUM } = require("../../config/constants");

//initializing route
const router = express.Router();

router.get(
  "/hours_time_range",
  AuthorizeTo(SYSTEM_ROLES_ENUM[0]),
  validateData(AnalyticsValidations.hoursSchema),
  AnalyticsController.getHoursByRange
);

router.get(
  "/gender_percentage",
  AuthorizeTo(SYSTEM_ROLES_ENUM[0]),
  AnalyticsController.getEmployeeGenderPercentage
);

router.get(
  "/age_percentage",
  AuthorizeTo(SYSTEM_ROLES_ENUM[0]),
  validateData(AnalyticsValidations.limitSchema),
  AnalyticsController.getEmployeeAgePercentage
);

module.exports = router;
