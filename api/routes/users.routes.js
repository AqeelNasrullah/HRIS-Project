//importing dependencies
const express = require("express");

//importing controller
const UsersController = require("../controllers/users.controllers");

//importing middlewares
const checkAuth = require("../middlewares/Auth/checkAuth");
const { validateData } = require("../middlewares/validation");

//importing validations
const {
  createSchema,
  updateSchema,
  passwordSchema,
} = require("../validations/users.validations");

const router = express.Router();

router.post(
  "/signup",
  validateData(createSchema, "body"),
  UsersController.signup
);

router.post("/login", UsersController.login);

router.post("/reset", UsersController.forgetPassword);

router.put(
  "/reset/:token",
  validateData(passwordSchema, "body"),
  UsersController.resetPassword
);

// router.post('/verify-OTP/:userId', UserController.verifyOTP)

//update me
router.patch(
  "/update",
  validateData(updateSchema, "body"),
  checkAuth,
  UsersController.updateUser
);

router.get("/info", checkAuth, UsersController.getUser);

router.get("/logout", checkAuth, UsersController.logout);

module.exports = router;
