//adding dependencies
const express = require("express");

//importing controller
const JobsController = require("../controllers/jobs.controllers");

//importing middlewares
const {validateData}=require("../middlewares/validation")

//importing validations
const {createSchema,updateSchema}=require("../validations/jobs.validations")

//initializing route
const router = express.Router();

router.post("/create", validateData(createSchema,"body"),JobsController.createJob);

router.get("/all",JobsController.findAllJobs);

router
  .route("/:jobId")
  .get(JobsController.getJob)
  .patch(validateData(updateSchema,"body"),JobsController.updateJob)
//   .delete( JobsController.deleteJob);

module.exports = router;
