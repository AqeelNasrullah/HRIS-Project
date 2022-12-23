//adding dependencies
const express = require("express");

//importing controller
const OffboardingsController = require("../controllers/offboardings.controllers");

//importing middlewares
const { validateData } = require("../middlewares/validation");

//importing validations
const {
  createSchema,
  updateSchema,
} = require("../validations/offboardings.validations");

//initializing route
const router = express.Router();

router.post(
  "/create",
  validateData(createSchema, "body"),
  OffboardingsController.createOffboarding
);

router.get("/all", OffboardingsController.findAllOffboardings);

router
  .route("/:offboardingId")
  .get(OffboardingsController.getOffboarding)
  .patch(
    validateData(updateSchema, "body"),
    OffboardingsController.updateOffboarding
  );
//   .delete( OffboardingsController.deleteOffboarding);

module.exports = router;
