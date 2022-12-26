//adding dependencies
const JWT = require("jsonwebtoken");
//imporing user services
const { getUserById } = require("../../services/users.services");
//importing middlewares
const asyncErrorHandler = require("../errors/asyncErrorHandler");
//importing utils
const ErrorHandler = require("../../utils/classes/errorHandler");

//Authenticatation
module.exports = asyncErrorHandler(async (req, res, next) => {
  let token = req.headers["authorization"];
  if (token?.split(" ")[0] !== "Bearer") {
    return next(new ErrorHandler("Access Denied", 401));
  }
  token = token.split(" ")[1];

  //getting decoded token
  const decoded = JWT.verify(token, process.env.JWT_SECRET);
  if (!decoded._id) {
    return next(new ErrorHandler("You're unauthorized to do this action", 401));
  }

  //CHECK USER EXISTANCE
  const userExist = await getUserById(decoded._id);
  if (!userExist?.uniqueKeys.includes(decoded.uniqueKey)) {
    return next(new ErrorHandler("Session ended", 400));
  }
  req.user = userExist;
  req.token = decoded;
  next();
});
