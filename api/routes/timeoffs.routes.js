//adding dependencies
const express = require("express");

//importing controller
const TimeoffsController = require("../controllers/timeoffs.controllers");

//importing middlewares
const { validateData } = require("../middlewares/validation");
const AuthorizeTo = require("../middlewares/Auth/Authorization");

//importing validations
const {
  createSchema,
  updateSchema,
  param,
} = require("../validations/timeoffs.validations");

//importing constants
const { SYSTEM_ROLES_ENUM } = require("../../config/constants");

//initializing route
const router = express.Router();

router.post(
  "/create",
  AuthorizeTo(SYSTEM_ROLES_ENUM[2]),
  validateData(createSchema, "body"),
  TimeoffsController.createTimeoff
);

//report enabled filteration
router.get(
  "/all",
  AuthorizeTo(SYSTEM_ROLES_ENUM[2]),
  validateData(updateSchema, "query"),
  TimeoffsController.findAllTimeoffs
);

//upcoming timeoffs
router.get(
  "/upcoming",
  AuthorizeTo(SYSTEM_ROLES_ENUM[2], AuthorizeTo(SYSTEM_ROLES_ENUM[0])),
  validateData(updateSchema, "query"),
  TimeoffsController.findUpcomingTimeoffs
);

router
  .route("/:timeoffId")
  .get(
    AuthorizeTo(SYSTEM_ROLES_ENUM[2]),
    validateData(param, "params"),
    TimeoffsController.getTimeoff
  )
  .patch(
    AuthorizeTo(SYSTEM_ROLES_ENUM[2]),
    validateData(param, "params"),
    validateData(updateSchema, "body"),
    TimeoffsController.updateTimeoff
  );

module.exports = router;
