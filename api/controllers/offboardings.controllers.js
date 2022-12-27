//importing services
const Offboardings = require("../services/offboardings.services");
const { getExistingEmployeeById } = require("../services/employee.services");

//importing middlewares
const asyncErrorHandler = require("../middlewares/errors/asyncErrorHandler");

//impoting utils
const ErrorHandler = require("../utils/classes/errorHandler");
const sendResponse = require("../utils/sendResponse");
const { EMPLOYEE_STATUS } = require("../../config/constants");

//methods
//creating Offboarding
const createOffboarding = asyncErrorHandler(async (req, res, next) => {
  const offboarding = req.body;

  //if emloyee doesn't exist
  if (offboarding.assignedTo) {
    const existedEmployee = await getExistingEmployeeById(
      offboarding.assignedTo
    );

    if (!existedEmployee || existedEmployee.status === EMPLOYEE_STATUS[1]) {
      return next(
        new ErrorHandler("Employee doesn't exist to perform that task", 404)
      );
    }
  }

  //if Offboarding exists?
  const existedOffboarding = await Offboardings.getExistingOffboarding(
    offboarding.category,
    offboarding.taskName
  );

  if (existedOffboarding) {
    return next(
      new ErrorHandler(
        "Provided task already belongs to other Offboarding category",
        409
      )
    );
  }

  // creating Offboarding
  const createdOffboarding = await Offboardings.offboardingCreate(offboarding);
  if (!createdOffboarding) {
    return next(new ErrorHandler("INTERNAL SERVER ERROR", 500));
  }

  return sendResponse({ createdOffboarding }, 201, res);
});

//get all Offboardings
const findAllOffboardings = asyncErrorHandler(async (req, res, next) => {
  const query = req.query;
  const { result } = req.query;
  const allOffboardings = await Offboardings.getAllOffboardings(query, result);
  const countedOffboardings = allOffboardings.length;
  if (!allOffboardings) {
    return next(new ErrorHandler("Not a single Offboarding found", 404));
  }
  return sendResponse({ countedOffboardings, allOffboardings }, 200, res);
});

//get Offboarding
const getOffboarding = asyncErrorHandler(async (req, res, next) => {
  const { offboardingId } = req.params;
  const existedOffboarding = await Offboardings.getExistingOffboardingById(
    offboardingId
  );

  if (!existedOffboarding) {
    return next(
      new ErrorHandler("Offboarding with given Id doesn't exists", 404)
    );
  }

  return sendResponse({ existedOffboarding }, 200, res);
});

//update Offboarding
const updateOffboarding = asyncErrorHandler(async (req, res, next) => {
  const { offboardingId } = req.params;
  //checking existance
  const existedOffboarding = await Offboardings.getExistingOffboardingById(
    offboardingId
  );
  if (!existedOffboarding) {
    return next(
      new ErrorHandler("Offboarding with given Id doesn't exists", 404)
    );
  }

  const toBeUpdate = req.body;
  if (toBeUpdate.assignedTo) {
    //if emloyee doesn't exist
    const existedEmployee = await getExistingEmployeeById(
      toBeUpdate.assignedTo
    );
    if (!existedEmployee || existedEmployee.status === EMPLOYEE_STATUS[1]) {
      return next(
        new ErrorHandler("Employee doesn't exist to perform that task", 404)
      );
    }
  }

  //if Offboarding exists?
  const otherOffboarding = await Offboardings.getExistingOffboarding(
    toBeUpdate.category,
    toBeUpdate.taskName
  );
  if (otherOffboarding) {
    return next(
      new ErrorHandler(
        "Provided task already belongs to other Offboarding category",
        409
      )
    );
  }

  //updating
  const updatedOffboarding = await Offboardings.offboardingUpdate(
    offboardingId,
    toBeUpdate
  );
  if (!updatedOffboarding) {
    return next(new ErrorHandler("Updation Failed.", 500));
  }

  return sendResponse({ updatedOffboarding }, 200, res);
});

module.exports = {
  createOffboarding,
  updateOffboarding,
  findAllOffboardings,
  getOffboarding,
};
