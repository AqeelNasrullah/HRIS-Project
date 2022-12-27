//adding dependencies
const express = require("express");

//importing controller
const JobsController = require("../controllers/jobs.controllers");

//importing middlewares
const { validateData } = require("../middlewares/validation");
const AuthorizeTo = require("../middlewares/Auth/Authorization");

//importing validations
const {
  createSchema,
  updateSchema,
  jobParam,
} = require("../validations/jobs.validations");

//importing constants
const { SYSTEM_ROLES_ENUM } = require("../../config/constants");

//initializing route
const router = express.Router();

router.post(
  "/create",
  AuthorizeTo(SYSTEM_ROLES_ENUM[0]),
  validateData(createSchema, "body"),
  JobsController.createJob
);

router.get(
  "/all",
  AuthorizeTo(SYSTEM_ROLES_ENUM[0], SYSTEM_ROLES_ENUM[1]),
  validateData(updateSchema, "query"),
  JobsController.findAllJobs
);

router
  .route("/:jobId")
  .get(
    AuthorizeTo(SYSTEM_ROLES_ENUM[0], SYSTEM_ROLES_ENUM[1]),
    validateData(jobParam, "params"),
    JobsController.getJob
  )
  .patch(
    AuthorizeTo(SYSTEM_ROLES_ENUM[0]),
    validateData(jobParam, "params"),
    validateData(updateSchema, "body"),
    JobsController.updateJob
  );

module.exports = router;
