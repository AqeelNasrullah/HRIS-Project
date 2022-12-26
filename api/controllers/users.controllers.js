// importing packages
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const { randomBytes: randomBytesCb } = require("crypto");
const { promisify } = require("util");
const sendEmail = require("../middlewares/email");
const crypto = require("crypto");

// importing services
const Users = require("../services/users.services");
const { getExistingHR } = require("../services/employee.services");

//importing middlewares
const asyncErrorHandler = require("../middlewares/errors/asyncErrorHandler");

//importing utils
const sendResponse = require("../utils/sendResponse");

const {
  JWT_SECRET,
  TWILIO_ACCOUNT_SID,
  TWILIO_ACCOUNT_AUTH_TOKEN,
  TWILIO_VERIFY_SID,
} = require("../../config/credentials");
const ErrorHandler = require("../utils/classes/errorHandler");

const client = require("twilio")(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_ACCOUNT_AUTH_TOKEN
);

const randomBytes = promisify(randomBytesCb);

const signup = asyncErrorHandler(async (req, res, next) => {
  const user = req.body;

  //check user existance
  const userExists = await Users.getUserExistance({
    email: user.email,
  });
  if (userExists) {
    return next(new ErrorHandler("Email already exists", 400));
  }

  //hashing password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(user.password, salt);
  user["password"] = hashedPassword;

  //checking employee existance
  const existedUser = await getExistingHR(user.systemRole);
  if (!existedUser) {
    return next(new ErrorHandler("Employee not found", 500));
  }
  const foundRole = existedUser.find((user) =>
    user.jobDescription.slice(-1).find((des) => des.job !== null)
  );
  if (!foundRole) {
    return next(new ErrorHandler("Employee not found", 500));
  }
  user.employee = foundRole._id;

  // creating user
  const createdUser = await Users.createUser(user);

  return sendResponse({ createdUser }, 200, res);
});

const login = asyncErrorHandler(async (req, res, next) => {
  const { password, email } = req.body;

  //check user existance
  const user = await Users.getUserExistance({ email });
  if (!user) {
    return next(new ErrorHandler("Incorrect credentails.", 401));
  }

  //check password
  const passwordMatched = await bcrypt.compare(password, user.password);
  if (!passwordMatched) {
    return next(new ErrorHandler("Incorrect credentails.", 401));
  }

  //sending mail
  const buff = await randomBytes(6);
  const loginToken = buff.toString("hex");

  //hashing token and save in model
  const resetLoginToken = crypto
    .createHash("sha256")
    .update(loginToken)
    .digest("hex");
    //setting expire ResetPassword
    const resetLoginExpire = Date.now() + 15 * 60 * 1000;
    console.log(resetLoginToken);

  const toBeUpdate = {
    resetPasswordToken: resetLoginToken,
    resetPaswordExpire: resetLoginExpire,
  };

  const updatedUser = await Users.updateUser({userId:user._id, toBeUpdate});
  if (!updatedUser) {
    return next(new ErrorHandler("INTERNAL SERVER ERROR", 500));
  }
  const verificationUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/users/verification/${loginToken}/${updatedUser._id}`;
  const message = `Enter your phone verification code on this site : -  \n\n${verificationUrl}\n\n If you didn't request this email, then ignore it  :)`;
  try {
    sendEmail({
      email: user.email,
      subject: `Human Resource Information System`,
      message,
    });
  } catch (error) {
    const toBeUpdate = {
      resetPasswordToken: undefined,
      resetPaswordExpire: undefined,
    };
    const updatedUser = await Users.updateUser({userId:user._id, toBeUpdate});
    if (!updatedUser) {
      return next(new ErrorHandler("INTERNAL SERVER ERROR", 500));
    }
    return next(new ErrorHandler(error.message, 500));
  }

//sending OTP
const otpBuff = await randomBytes(5);

const OTP = otpBuff.toString("hex");

console.log(`${otpBuff.length} bytes of random data: ${OTP}`);

const sentSMS = await client.messages.create({
  body: OTP,
  messagingServiceSid: process.env.TWILIO_MESSAGING_SERVICE_SID,
  to: user.phoneNumber,
});

const updatesUser = await Users.updateUser({
  userId: user._id,
  dataToUpdate: { OTP },
});

  return sendResponse({message:`Email sent to ${user.email} successfully`},200,res)
});


//forget password
const forgetPassword = asyncErrorHandler(async (req, res, next) => {
  const { email } = req.body;
  //check user existance
  const user = await Users.getUserExistance({ email });
  if (!user) {
    return next(new ErrorHandler("Incorrect credentails.", 401));
  }
  const buff = await randomBytes(6);
  const resetToken = buff.toString("hex");

  //hashing token and save in model
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  //setting expire ResetPassword
  const resetPaswordExpire = Date.now() + 15 * 60 * 1000;

  const toBeUpdate = {
    resetPasswordToken: resetPasswordToken,
    resetPaswordExpire: resetPaswordExpire,
  };
  const updatedUser = await Users.updateUser(user._id, toBeUpdate);
  if (!updatedUser) {
    return next(new ErrorHandler("INTERNAL SERVER ERROR", 500));
  }
  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/users/reset/${resetToken}`;
  const message = `Your password reset token is : -  \n\n${resetPasswordUrl}\n\n If you didn't request this email, then ignore it  :)`;
  try {
    sendEmail({
      email: user.email,
      subject: `Human Resource Information System`,
      message,
    });
  } catch (error) {
    const toBeUpdate = {
      resetPasswordToken: undefined,
      resetPaswordExpire: undefined,
    };
    const updatedUser = await Users.updateUser(user._id, toBeUpdate);
    if (!updatedUser) {
      return next(new ErrorHandler("INTERNAL SERVER ERROR", 500));
    }
    return next(new ErrorHandler(error.message, 500));
  }

  return res.status(200).json({
    success: true,
    message: `Email sent to ${user.email} successfully`,
  });
});

//reset password
const resetPassword = asyncErrorHandler(async (req, res, next) => {
  const { token } = req.params;
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const user = await Users.userResetToken(resetPasswordToken);
  if (!user) {
    return next(new ErrorHandler("Provided token is invalid or expired.", 400));
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password doesn't match.", 400));
  }

  //hashing password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);
  user["password"] = hashedPassword;

  //removing reset tokens
  const toBeUpdate = {
    resetPasswordToken: "",
    resetPaswordExpire: "",
    password: hashedPassword,
  };
  const updatedUser = await Users.updateUser({ userId: user._id, toBeUpdate });

  if (!updatedUser) {
    return next(new ErrorHandler("INTERNAL SERVER ERROR", 500));
  }
  sendResponse(updatedUser, 200, res);
});

const updateUser = asyncErrorHandler(async (req, res, next) => {
  const { user } = req;

  //checking user existance
  const existedUser = await Users.getUserById(user._id);
  if (!existedUser) {
    return next(new ErrorHandler("User not found", 500));
  }

  //update user
  const dataToUpdate = req.body;
  const updatedUser = await Users.updateUser({
    userId: user._id,
    dataToUpdate,
  });

  return sendResponse(updatedUser, 200, res);
});

const logout = asyncErrorHandler(async (req, res, next) => {
  const { token } = req;

  const userFound = await Users.getUserById(token._id);

  console.log(token.uniqueKey);
  if (!userFound.uniqueKeys?.includes(token.uniqueKey)) {
    return next(new ErrorHandler("INTERNAL SERVER ERROR", 500));
  }
  await Users.updateUser({
    userId: token._id,
    dataToUpdate: { uniqueKeys: [] },
  });
  return sendResponse(null, 200, res);
});

const getUser = asyncErrorHandler(async (req, res, next) => {
  const { user } = req;

  //checking user existance
  const existedUser = await Users.getDetailedUserById(user?._id);
  if (!existedUser) {
    return next(new ErrorHandler("User not found", 500));
  }

  return sendResponse(existedUser, 200, res);
});

const verifyOTP =asyncErrorHandler( async (req, res,next) => {
    const { code } = req.body;
    const { userId } = req.params;
    const user = await Users.verifyOTP({ userId,code });
    if (!user) {
      return next(new ErrorHandler("Verification failed!",401)) ;
    }

    const uniqueKey = uuidv4();
    const payload = {
      _id: user._id,
      email: user.email,
      userName: user.userName,
      firstName: user.firstName,
      lastName: user.lastName,
      uniqueKey,
    };

    const token = JWT.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    await Users.updateUser({
      userId: user._id,
      dataToUpdate: { $addToSet: { uniqueKeys: uniqueKey }, OTP: "" },
    });

    return sendResponse({token},200,res)
});

module.exports = {
  signup,
  login,
  forgetPassword,
  resetPassword,
  updateUser,
  getUser,
  logout,
  verifyOTP,
};
