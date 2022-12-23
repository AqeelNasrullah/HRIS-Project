//adding dependencies
const express = require("express");

//importing middlewares
const {validateData}=require("../middlewares/validation")

//importing validations
const AssetsSchema=require("../validations/assets.validations")


//importing controller
const AssetsController = require("../controllers/assets.controllers");

//initializing route
const router = express.Router();

router.post("/create", validateData(AssetsSchema.createAsset,"body"),AssetsController.createAsset);

router.get("/all",AssetsController.findAllAssets);

router
  .route("")
  .get(validateData(AssetsSchema.query, "query"),AssetsController.getAsset)
  .patch(validateData(AssetsSchema.query, "query"),validateData(AssetsSchema.updateAsset,"body"),AssetsController.updateAsset)
//   .delete( AssetsController.deleteAsset);

//assignment routes
router.post(
  "/assignment",
  validateData(AssetsSchema.query, "query"),
  validateData(AssetsSchema.assignmentAdd, "body"),
  AssetsController.assign
);

router.patch(
  "/assignment/:assignmentId",
  validateData(AssetsSchema.param,"params"),
  validateData(AssetsSchema.query, "query"),
  validateData(AssetsSchema.assignmentUpdate, "body"),
  AssetsController.updateAssignment
);

module.exports = router;
