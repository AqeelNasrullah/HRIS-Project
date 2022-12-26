//adding dependencies
const express = require("express");

//importing middlewares
const upload = require("../middlewares/multer");
const { validateData } = require("../middlewares/validation");
const documentUpload = require("../middlewares/documentMulter");
const AuthorizeTo=require("../middlewares/Auth/Authorization")

//importing validations
const EmployeesValidation = require("../validations/employees.validations");
const { benefitParam } = require("../validations/benefits.validations");
const { jobParam } = require("../validations/jobs.validations");
const { offboardingParam } = require("../validations/offboardings.validations");
const { onboardingParam } = require("../validations/onboardings.validations");

//importing controller
const EmployeesController = require("../controllers/Employees.controllers");

//importing constants
const {SYSTEM_ROLES_ENUM}=require("../../config/constants")

//initializing route
const router = express.Router();

//personal routes

router.post(
  "/create",
  AuthorizeTo(SYSTEM_ROLES_ENUM[3]),
  validateData(EmployeesValidation.createSchema, "body"),
  EmployeesController.createEmployee
);

router.patch(
  "/profile/upload",
  AuthorizeTo(SYSTEM_ROLES_ENUM[3]),
  upload.single("avatar"),
  validateData(EmployeesValidation.querySchema, "query"),
  EmployeesController.uploadProfileImage
);

router.get(
  "/all",
  validateData(EmployeesValidation.updateSchema, "query"),
  EmployeesController.findAllEmployees
);

//
router
  .route("")
  .get(
    validateData(EmployeesValidation.querySchema, "query"),
    EmployeesController.getEmployee
  )
  .patch(
    AuthorizeTo(SYSTEM_ROLES_ENUM[3]),
    validateData(EmployeesValidation.querySchema, "query"),
    validateData(EmployeesValidation.updateSchema, "body"),
    EmployeesController.updateEmployee
  )
  .delete(
    AuthorizeTo(SYSTEM_ROLES_ENUM[3]),
    validateData(EmployeesValidation.querySchema, "query"),
    EmployeesController.deleteEmployee
  );

//education routes
router.post(
  "/education/add",
  AuthorizeTo(SYSTEM_ROLES_ENUM[3]),
  validateData(EmployeesValidation.querySchema, "query"),
  validateData(EmployeesValidation.addEducation, "body"),
  EmployeesController.addEducation
);

router.patch(
  "/education/:educationId",
  AuthorizeTo(SYSTEM_ROLES_ENUM[3]),
  validateData(EmployeesValidation.educationParam, "params"),
  validateData(EmployeesValidation.querySchema, "query"),
  validateData(EmployeesValidation.updateEducation, "body"),
  EmployeesController.updateEducation
);

//employment routes
router.post(
  "/employment/add",
  AuthorizeTo(SYSTEM_ROLES_ENUM[1]),
  validateData(EmployeesValidation.querySchema, "query"),
  validateData(EmployeesValidation.employmentAddSchema, "body"),
  EmployeesController.employment
);

router.patch(
  "/employment/update",
  AuthorizeTo(SYSTEM_ROLES_ENUM[1]),
  validateData(EmployeesValidation.querySchema, "query"),
  validateData(EmployeesValidation.employmentUpdateSchema, "body"),
  EmployeesController.updateEmployment
);

//job routes
router.post(
  "/job/add",
  AuthorizeTo(SYSTEM_ROLES_ENUM[1]),
  validateData(EmployeesValidation.querySchema, "query"),
  validateData(EmployeesValidation.jobAddSchema, "body"),
  EmployeesController.addJob
);

router.patch(
  "/job/:jobId",
  AuthorizeTo(SYSTEM_ROLES_ENUM[1]),
  validateData(jobParam, "params"),
  validateData(EmployeesValidation.querySchema, "query"),
  validateData(EmployeesValidation.jobUpdateSchema, "body"),
  EmployeesController.updateJob
);

//compensation routes
router.post(
  "/compensation/add",
  AuthorizeTo(SYSTEM_ROLES_ENUM[1]),
  validateData(EmployeesValidation.querySchema, "query"),
  validateData(EmployeesValidation.compensationAddSchema, "body"),
  EmployeesController.addCompensation
);

router.patch(
  "/compensation/:compensationId",
  AuthorizeTo(SYSTEM_ROLES_ENUM[1]),
  validateData(EmployeesValidation.compensationParam, "params"),
  validateData(EmployeesValidation.querySchema, "query"),
  validateData(EmployeesValidation.compensationUpdateSchema, "body"),
  EmployeesController.updateCompensation
);

//jobs,employement,compensation
router.get(
  "/jobs",
  AuthorizeTo(SYSTEM_ROLES_ENUM[1],SYSTEM_ROLES_ENUM[0]),
  validateData(EmployeesValidation.querySchema, "query"),
  EmployeesController.findAllJobs
);

//onboarding tasks routes
router.post(
  "/onboarding/add",
  // AuthorizeTo(SYSTEM_ROLES_ENUM[2]),
  validateData(EmployeesValidation.querySchema, "query"),
  validateData(EmployeesValidation.onboardingAddSchema, "body"),
  EmployeesController.addOnboarding
);

router.patch(
  "/onboarding/:taskId",
  AuthorizeTo(SYSTEM_ROLES_ENUM[2]),
  validateData(onboardingParam, "params"),
  validateData(EmployeesValidation.querySchema, "query"),
  validateData(EmployeesValidation.onboardingUpdateSchema, "body"),
  EmployeesController.updateOnboarding
);

//offboarding tasks routes
router.post(
  "/offboarding/add",
  // AuthorizeTo(SYSTEM_ROLES_ENUM[2]),
  validateData(EmployeesValidation.querySchema, "query"),
  validateData(EmployeesValidation.offboardingAddSchema, "body"),
  EmployeesController.addOffboarding
);

router.patch(
  "/offboarding/:taskId",
  AuthorizeTo(SYSTEM_ROLES_ENUM[2]),
  validateData(offboardingParam, "params"),
  validateData(EmployeesValidation.querySchema, "query"),
  validateData(EmployeesValidation.offboardingUpdateSchema, "body"),
  EmployeesController.updateOffboarding
);

//onboarding and offboarding tasks
router.get(
  "/tasks",
  AuthorizeTo(SYSTEM_ROLES_ENUM[2],SYSTEM_ROLES_ENUM[0]),
  validateData(EmployeesValidation.querySchema, "query"),
  EmployeesController.findAllTasks
);

//benefits routes
router.post(
  "/benefits/add",
  AuthorizeTo(SYSTEM_ROLES_ENUM[1]),
  validateData(EmployeesValidation.querySchema, "query"),
  validateData(EmployeesValidation.benefitAddSchema, "body"),
  EmployeesController.addBenefit
);

router.patch(
  "/benefits/:benefitId",
  AuthorizeTo(SYSTEM_ROLES_ENUM[1]),
  validateData(benefitParam, "params"),
  validateData(EmployeesValidation.querySchema, "query"),
  validateData(EmployeesValidation.benefitUpdateSchema, "body"),
  EmployeesController.updateBenefit
);

router.get(
  "/benefits",
  AuthorizeTo(SYSTEM_ROLES_ENUM[1],SYSTEM_ROLES_ENUM[0]),
  validateData(EmployeesValidation.querySchema, "query"),
  EmployeesController.findEmployeeBenefits
);

//documents routes
router.post(
  "/documents/add",
  AuthorizeTo(SYSTEM_ROLES_ENUM[2]),
  documentUpload.single("document"),
  validateData(EmployeesValidation.documentAddSchema, "query"),
  EmployeesController.addDocument
);

router.patch(
  "/documents/:documentId",
  AuthorizeTo(SYSTEM_ROLES_ENUM[2]),
  validateData(EmployeesValidation.documentParam, "params"),
  validateData(EmployeesValidation.querySchema, "query"),
  EmployeesController.updateDocument
);

router.get(
  "/documents",
  AuthorizeTo(SYSTEM_ROLES_ENUM[2],SYSTEM_ROLES_ENUM[0]),
  validateData(EmployeesValidation.querySchema, "query"),
  EmployeesController.findAllDocuments
);

//assets routes
router.get(
  "/assets",
  AuthorizeTo(SYSTEM_ROLES_ENUM[3],SYSTEM_ROLES_ENUM[0]),
  validateData(EmployeesValidation.querySchema, "query"),
  EmployeesController.getEmployeeAseet
);

//timeoff routes
router.get(
  "/timeoffs",
  AuthorizeTo(SYSTEM_ROLES_ENUM[2],AuthorizeTo(SYSTEM_ROLES_ENUM[0]),),
  validateData(EmployeesValidation.querySchema, "query"),
  EmployeesController.getEmployeeTimeoffs
);

module.exports = router;
