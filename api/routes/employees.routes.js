//adding dependencies
const express = require("express");

//importing middlewares
const upload = require("../middlewares/multer");
const { validateData } = require("../middlewares/validation");

const documentUpload = require("../middlewares/documentMulter");

//importing validations
const EmployeesValidation = require("../validations/employees.validations");

//importing controller
const EmployeesController = require("../controllers/Employees.controllers");

//initializing route
const router = express.Router();

//personal routes

router.post(
  "/create",
  validateData(EmployeesValidation.createSchema, "body"),
  EmployeesController.createEmployee
);

router.patch(
  "/profile/upload",
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
    validateData(EmployeesValidation.querySchema, "query"),
    validateData(EmployeesValidation.updateSchema, "body"),
    EmployeesController.updateEmployee
  )
  .delete(
    validateData(EmployeesValidation.querySchema, "query"),
    EmployeesController.deleteEmployee
  );

//employment routes
router.post(
  "/employment/add",
  validateData(EmployeesValidation.querySchema, "query"),
  validateData(EmployeesValidation.employmentAddSchema, "body"),
  EmployeesController.employment
);

router.patch(
  "/employment/update",
  validateData(EmployeesValidation.querySchema, "query"),
  validateData(EmployeesValidation.employmentUpdateSchema, "body"),
  EmployeesController.employment
);

//job routes
router.post(
  "/job/add",
  validateData(EmployeesValidation.querySchema, "query"),
  validateData(EmployeesValidation.jobAddSchema, "body"),
  EmployeesController.addJob
);

router.patch(
  "/job/:jobId",
  validateData(EmployeesValidation.querySchema, "query"),
  validateData(EmployeesValidation.jobUpdateSchema, "body"),
  EmployeesController.updateJob
);

//compensation routes
router.post(
  "/compensation/add",
  validateData(EmployeesValidation.querySchema, "query"),
  validateData(EmployeesValidation.compensationAddSchema, "body"),
  EmployeesController.addCompensation
);

router.patch(
  "/compensation/:compensationId",
  validateData(EmployeesValidation.querySchema, "query"),
  validateData(EmployeesValidation.compensationUpdateSchema, "body"),
  EmployeesController.updateCompensation
);

//onboarding tasks routes
router.post(
  "/onboarding/add",
  validateData(EmployeesValidation.querySchema, "query"),
  validateData(EmployeesValidation.onboardingAddSchema, "body"),
  EmployeesController.addOnboarding
);

router.patch(
  "/onboarding/:taskId",
  validateData(EmployeesValidation.querySchema, "query"),
  validateData(EmployeesValidation.onboardingUpdateSchema, "body"),
  EmployeesController.updateOnboarding
);

//offboarding tasks routes
router.post(
  "/offboarding/add",
  validateData(EmployeesValidation.querySchema, "query"),
  validateData(EmployeesValidation.offboardingAddSchema, "body"),
  EmployeesController.addOffboarding
);

router.patch(
  "/offboarding/:taskId",
  validateData(EmployeesValidation.querySchema, "query"),
  validateData(EmployeesValidation.offboardingUpdateSchema, "body"),
  EmployeesController.updateOffboarding
);

//benefits routes
router.post(
  "/benefits/add",
  validateData(EmployeesValidation.querySchema, "query"),
  validateData(EmployeesValidation.benefitAddSchema, "body"),
  EmployeesController.addBenefit
);

router.patch(
  "/benefits/:benefitId",
  validateData(EmployeesValidation.querySchema, "query"),
  validateData(EmployeesValidation.benefitUpdateSchema, "body"),
  EmployeesController.updateBenefit
);

//documents routes
router.post(
  "/documents/add",
  documentUpload.single("document"),
  validateData(EmployeesValidation.documentAddSchema, "query"),
  EmployeesController.addDocument
);

router.patch(
  "/documents/:documentId",
  validateData(EmployeesValidation.documentParam, "params"),
  validateData(EmployeesValidation.querySchema, "query"),
  EmployeesController.updateDocument
);

router.get(
  "/assets",
  validateData(EmployeesValidation.querySchema, "query"),
  EmployeesController.employeeAseet
);

module.exports = router;
