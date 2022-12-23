//adding dependencies
const express = require("express");

//importing controller
const BenefitsController = require("../controllers/benefits.controllers");

//importing middlewares
const {validateData}=require("../middlewares/validation")

//importing validations
const {benefitsSchema,updateSchema}=require("../validations/benefits.validations")

//initializing route
const router = express.Router();

router.post("/create",validateData(benefitsSchema,"body"), BenefitsController.createBenefit);

router.get("/all",BenefitsController.findAllBenefits);

router
  .route("/:benefitId")
  .get(BenefitsController.getBenefit)
  .patch(validateData(updateSchema,"body"),BenefitsController.updateBenefit)
//   .delete( BenefitsController.deleteBenefit);

module.exports = router;
