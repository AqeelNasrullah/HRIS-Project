//adding dependencies
const express = require("express");

//importing controller
const OnboardingsController = require("../controllers/onboardings.controllers");

//importing middlewares
const { validateData } = require("../middlewares/validation");
const AuthorizeTo = require("../middlewares/Auth/Authorization");

//importing validations
const {
  createSchema,
  updateSchema,
  onboardingParam,
} = require("../validations/onboardings.validations");

//importing constants
const { SYSTEM_ROLES_ENUM } = require("../../config/constants");

//initializing route
const router = express.Router();

router.post(
  "/create",
  AuthorizeTo(SYSTEM_ROLES_ENUM[0]),
  validateData(createSchema, "body"),
  OnboardingsController.createOnboarding
);

router.get(
  "/all",
  AuthorizeTo(SYSTEM_ROLES_ENUM[0], SYSTEM_ROLES_ENUM[2]),
  validateData(updateSchema, "query"),
  OnboardingsController.findAllOnboardings
);

router
  .route("/:onboardingId")
  .get(
    AuthorizeTo(SYSTEM_ROLES_ENUM[0], SYSTEM_ROLES_ENUM[2]),
    validateData(onboardingParam, "params"),
    OnboardingsController.getOnboarding
  )
  .patch(
    AuthorizeTo(SYSTEM_ROLES_ENUM[0]),
    validateData(onboardingParam, "params"),
    validateData(updateSchema, "body"),
    OnboardingsController.updateOnboarding
  );

module.exports = router;
