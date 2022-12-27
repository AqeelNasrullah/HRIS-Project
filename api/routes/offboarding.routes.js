//adding dependencies
const express = require("express");

//importing controller
const OffboardingsController = require("../controllers/offboardings.controllers");

//importing middlewares
const { validateData } = require("../middlewares/validation");
const AuthorizeTo = require("../middlewares/Auth/Authorization");

//importing validations
const {
  createSchema,
  updateSchema,
  offboardingParam,
} = require("../validations/offboardings.validations");

//importing constants
const { SYSTEM_ROLES_ENUM } = require("../../config/constants");

//initializing route
const router = express.Router();

router.post(
  "/create",
  AuthorizeTo(SYSTEM_ROLES_ENUM[0]),
  validateData(createSchema, "body"),
  OffboardingsController.createOffboarding
);

router.get(
  "/all",
  AuthorizeTo(SYSTEM_ROLES_ENUM[0], SYSTEM_ROLES_ENUM[2]),
  validateData(updateSchema, "query"),
  OffboardingsController.findAllOffboardings
);

router
  .route("/:offboardingId")
  .get(
    AuthorizeTo(SYSTEM_ROLES_ENUM[0], SYSTEM_ROLES_ENUM[2]),
    validateData(offboardingParam, "params"),
    OffboardingsController.getOffboarding
  )
  .patch(
    AuthorizeTo(SYSTEM_ROLES_ENUM[0]),
    validateData(offboardingParam, "params"),
    validateData(updateSchema, "body"),
    OffboardingsController.updateOffboarding
  );

module.exports = router;
