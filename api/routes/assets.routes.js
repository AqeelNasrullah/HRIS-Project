//adding dependencies
const express = require("express");

//importing controller
const AssetsController = require("../controllers/assets.controllers");

//importing middlewares
const { validateData } = require("../middlewares/validation");
const AuthorizeTo = require("../middlewares/Auth/Authorization");

//importing validations
const AssetsSchema = require("../validations/assets.validations");

//importing constants
const { SYSTEM_ROLES_ENUM } = require("../../config/constants");

//initializing route
const router = express.Router();

router.post(
  "/create",
  AuthorizeTo(SYSTEM_ROLES_ENUM[3]),
  validateData(AssetsSchema.createAsset, "body"),
  AssetsController.createAsset
);

router
  .route("")
  .get(
    AuthorizeTo(SYSTEM_ROLES_ENUM[3]),
    validateData(AssetsSchema.query, "query"),
    AssetsController.getAsset
  )
  .patch(
    AuthorizeTo(SYSTEM_ROLES_ENUM[3]),
    validateData(AssetsSchema.query, "query"),
    validateData(AssetsSchema.updateAsset, "body"),
    AssetsController.updateAsset
  );


//assignment routes
router.post(
  "/assignment",
  AuthorizeTo(SYSTEM_ROLES_ENUM[3]),
  validateData(AssetsSchema.query, "query"),
  validateData(AssetsSchema.assignmentAdd, "body"),
  AssetsController.assign
);

router.patch(
  "/assignment/:assignmentId",
  AuthorizeTo(SYSTEM_ROLES_ENUM[3]),
  validateData(AssetsSchema.param, "params"),
  validateData(AssetsSchema.query, "query"),
  validateData(AssetsSchema.assignmentUpdate, "body"),
  AssetsController.updateAssignment
);

module.exports = router;
