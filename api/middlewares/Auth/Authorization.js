//importing middlewares
const asyncErrorHandler=require("../errors/asyncErrorHandler");

//importing utils
const ErrorHandler=require("../../utils/classes/errorHandler")

const AuthorizeTo = (...systemRoles) => {
    return asyncErrorHandler( async (req, res, next) => {
        const { user } = req;
      
        if (!systemRoles.includes(user?.systemRole)) {
            return next(new ErrorHandler("You are unauthrized to do this action.",401))
        }
        next();
    });
  };
  
  module.exports = AuthorizeTo;
  