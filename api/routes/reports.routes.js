//adding dependencies
const express = require("express");

//importing controller
const ReportsControllers = require("../controllers/reports.controllers");

//importing middlewares
const { validateData } = require("../middlewares/validation");
const AuthorizeTo = require("../middlewares/Auth/Authorization");

//importing validations
const {
  benefitsSchema,
  updateSchema,
  benefitParam,
} = require("../validations/benefits.validations");



//initializing route
const router = express.Router();

router.get("/benefits", ReportsControllers.benefitsReport);

router.get("/assets", ReportsControllers.assetsReports);

router.get("/timeoffs", ReportsControllers.timeoffsReport);

router.get("/salaries", ReportsControllers.salaryReport);


module.exports = router;
