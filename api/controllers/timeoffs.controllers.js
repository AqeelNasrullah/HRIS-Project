//importing packages
const mongoose = require("mongoose");

//importing services
const Timeoffs = require("../services/timeoffs.services");
const { getExistingEmployeeById } = require("../services/employee.services");

//importing middlewares
const asyncErrorHandler = require("../middlewares/errors/asyncErrorHandler");

//impoting utils
const ErrorHandler = require("../utils/classes/errorHandler");
const sendResponse = require("../utils/sendResponse");
const { EMPLOYEE_STATUS } = require("../../config/constants");

//methods
//creating Timeoff
const createTimeoff = asyncErrorHandler(async (req, res, next) => {
  const timeoff = req.body;
  const { id } = req.query;
  timeoff.employeeId = mongoose.Types.ObjectId(id);

  //if emloyee doesn't exist
  if (timeoff.employeeId) {
    const existedEmployee = await getExistingEmployeeById(timeoff.employeeId);
    if (!existedEmployee || existedEmployee.status === EMPLOYEE_STATUS[1]) {
      return next(new ErrorHandler("Employee doesn't exist ", 404));
    }
  }

  //if Timeoff exists?
  const existedTimeoff = await Timeoffs.getExistingTimeoff(
    timeoff.employeeId,
    timeoff.startTime
  );
  if (existedTimeoff) {
    return next(new ErrorHandler("Timeoff has already been already set", 409));
  }

  // creating Timeoff
  const createdTimeoff = await Timeoffs.timeoffCreate(timeoff);
  if (!createdTimeoff) {
    return next(new ErrorHandler("INTERNAL SERVER ERROR", 500));
  }

  return sendResponse({ createdTimeoff }, 201, res);
});

//get all Timeoffs
const findAllTimeoffs = asyncErrorHandler(async (req, res, next) => {
  const query = req.query;
  const { result } = req.query;
  const allTimeoffs = await Timeoffs.getAllTimeoffs(query, result);
  if (!allTimeoffs) {
    return next(new ErrorHandler("Not a single Timeoff found", 404));
  }
  const countedTimeoffs = allTimeoffs.length;
  return sendResponse({ countedTimeoffs, allTimeoffs }, 200, res);
});

//get all Timeoffs
const findUpcomingTimeoffs = asyncErrorHandler(async (req, res, next) => {
  const query = req.query;
  const { result } = req.query;

  //getting all timeoffs
  const allTimeoffs = await Timeoffs.getAllTimeoffs(query, result);
  if (!allTimeoffs) {
    return next(new ErrorHandler("Not a single Timeoff found", 404));
  }

  //getting upcoming timeoffs
  const upcomingTimeOffs = allTimeoffs.filter(
    (time) => new Date(time.startTime) >= Date.now()
  );
  if (!upcomingTimeOffs) {
    return next(new ErrorHandler("Not a single Timeoff found", 404));
  }
  const countedTimeoffs = upcomingTimeOffs.length;

  return sendResponse({ countedTimeoffs, upcomingTimeOffs }, 200, res);
});

//get Timeoff
const getTimeoff = asyncErrorHandler(async (req, res, next) => {
  const { timeoffId } = req.params;
  const existedTimeoff = await Timeoffs.getExistingTimeoffById(timeoffId);
  if (!existedTimeoff) {
    return next(new ErrorHandler("Timeoff with given Id doesn't exists", 404));
  }

  return sendResponse({ existedTimeoff }, 200, res);
});

//update Timeoff
const updateTimeoff = asyncErrorHandler(async (req, res, next) => {
  const { timeoffId } = req.params;
  //checking existance
  const existedTimeoff = await Timeoffs.getExistingTimeoffById(timeoffId);
  if (!existedTimeoff) {
    return next(new ErrorHandler("Timeoff with given Id doesn't exists", 404));
  }

  const { id } = req.query;
  //if emloyee doesn't exist
  if (id) {
    const existedEmployee = await getExistingEmployeeById(id);
    if (!existedEmployee || existedEmployee.status === EMPLOYEE_STATUS[1]) {
      return next(new ErrorHandler("Employee doesn't exist ", 404));
    }
  }

  const toBeUpdate = req.body;
  toBeUpdate.employeeId = id;

  //if Timeoff exists?
  const otherTimeoff = await Timeoffs.getExistingTimeoff(
    toBeUpdate.employeeId,
    toBeUpdate.startTime
  );
  if (otherTimeoff) {
    return next(new ErrorHandler("Timeoff has already been already set", 409));
  }

  //updating
  const updatedTimeoff = await Timeoffs.timeoffUpdate(timeoffId, toBeUpdate);
  if (!updatedTimeoff) {
    return next(new ErrorHandler("Updation Failed.", 500));
  }

  return sendResponse({ updatedTimeoff }, 200, res);
});

module.exports = {
  createTimeoff,
  findAllTimeoffs,
  updateTimeoff,
  findUpcomingTimeoffs,
  getTimeoff,
};
