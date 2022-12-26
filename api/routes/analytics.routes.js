//adding dependencies
const express = require("express");

//importing controller
const AnalyticsController = require("../controllers/analytics.controllers");

//importing middlewares
const { validateData } = require("../middlewares/validation");
const AuthorizeTo = require("../middlewares/Auth/Authorization");


//initializing route
const router = express.Router();

router.get("/hours_time_range", AnalyticsController.getHoursByRange);

router.get("/gender_percentage", AnalyticsController.getEmployeeGenderPercentage);

router.get("/age_percentage", AnalyticsController.getEmployeeAgePercentage);


module.exports = router;
