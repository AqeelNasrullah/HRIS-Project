//adding dependencies
const express = require("express");

//importing controller
const BenefitsController = require("../controllers/benefits.controllers");

//importing middlewares
const { validateData } = require("../middlewares/validation");
const AuthorizeTo = require("../middlewares/Auth/Authorization");

//importing validations
const {
  benefitsSchema,
  updateSchema,
  benefitParam,
} = require("../validations/benefits.validations");

//importing constants
const { SYSTEM_ROLES_ENUM } = require("../../config/constants");

//initializing route
const router = express.Router();

router.post(
  "/create",
  AuthorizeTo(SYSTEM_ROLES_ENUM[0]),
  validateData(benefitsSchema, "body"),
  BenefitsController.createBenefit
);

router.get(
  "/all",
  AuthorizeTo(SYSTEM_ROLES_ENUM[0], SYSTEM_ROLES_ENUM[1]),
  validateData(updateSchema, "query"),
  BenefitsController.findAllBenefits
);

router
  .route("/:benefitId")
  .get(
    AuthorizeTo(SYSTEM_ROLES_ENUM[0], SYSTEM_ROLES_ENUM[1]),
    validateData(benefitParam, "params"),
    BenefitsController.getBenefit
  )
  .patch(
    AuthorizeTo(SYSTEM_ROLES_ENUM[0]),
    validateData(benefitParam, "params"),
    validateData(updateSchema, "body"),
    BenefitsController.updateBenefit
  );
//   .delete( BenefitsController.deleteBenefit);

module.exports = router;
