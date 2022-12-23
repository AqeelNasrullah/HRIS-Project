//adding dependenciescontroller
const express = require("express");

//importing controller
const TimeoffsController = require("../controllers/timeoffs.controllers");

//importing middlewares
const {validateData}=require("../middlewares/validation")

//importing validations
const {createSchema,updateSchema}=require("../validations/timeoffs.validations")

//initializing route
const router = express.Router();

router.post("/create", validateData(createSchema,"body"),TimeoffsController.createTimeoff);

router.get("/all",TimeoffsController.findAllTimeoffs);

router
  .route("/:timeoffId")
  .get(TimeoffsController.getTimeoff)
  .patch(validateData(updateSchema,"body"),TimeoffsController.updateTimeoff)
//   .delete( TimeoffsController.deleteTimeoff);

module.exports = router;
