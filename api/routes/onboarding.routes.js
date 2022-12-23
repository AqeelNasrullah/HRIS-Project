//adding dependencies
const express = require("express");

//importing controller
const OnboardingsController = require("../controllers/onboardings.controllers");

//importing middlewares
const {validateData}=require("../middlewares/validation")

//importing validations
const {createSchema,updateSchema}=require("../validations/onboardings.validations")

//initializing route
const router = express.Router();

router.post("/create",validateData(createSchema,"body"), OnboardingsController.createOnboarding);

router.get("/all",OnboardingsController.findAllOnboardings);

router
  .route("/:onboardingId")
  .get(OnboardingsController.getOnboarding)
  .patch(validateData(updateSchema,"body"), OnboardingsController.updateOnboarding)
//   .delete( OnboardingsController.deleteOnboarding);

module.exports = router;
