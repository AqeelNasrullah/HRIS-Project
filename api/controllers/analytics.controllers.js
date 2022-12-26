//importing services
const Reports = require("../services/reports.services");
const AnalyticsServices=require("../services/analytics.services");

//importing middlewares
const asyncErrorHandler = require("../middlewares/errors/asyncErrorHandler");

//impoting utils
const ErrorHandler = require("../utils/classes/errorHandler");
const sendResponse = require("../utils/sendResponse");

//methods


//reports

//get all hours range time
const getHoursByRange = asyncErrorHandler(async (req, res, next) => {
    const allHours = await AnalyticsServices.hoursByRange(req.body.from, req.body.to,req.body.status);
    if (!allHours) {
      return next(new ErrorHandler("Not found", 404));
    }
  
    return sendResponse({ allHours }, 200, res);
  });

  //get gender percentage
const getEmployeeGenderPercentage = asyncErrorHandler(async (req, res, next) => {
    const percentage = await AnalyticsServices.genderPercentage();
    if (!percentage) {
      return next(new ErrorHandler("Not found", 404));
    }
  
    return sendResponse({ percentage }, 200, res);
  });

    //get age percentage
const getEmployeeAgePercentage = asyncErrorHandler(async (req, res, next) => {
    const percentage = await AnalyticsServices.agePercentage(req.body.limit);
    if (!percentage) {
      return next(new ErrorHandler("Not found", 404));
    }
  
    return sendResponse({ percentage }, 200, res);
  });


module.exports = {
    getEmployeeGenderPercentage,
    getHoursByRange,
    getEmployeeAgePercentage
  
};
