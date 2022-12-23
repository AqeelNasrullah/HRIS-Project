//importing services
const Onboardings = require("../services/onboardings.services");
const {getExistingEmployeeById}=require("../services/employee.services")

//importing middlewares
const asyncErrorHandler = require("../middlewares/errors/asyncErrorHandler");

//impoting utils
const ErrorHandler = require("../utils/classes/errorHandler");
const sendResponse = require("../utils/sendResponse");
const { EMPLOYEE_STATUS } = require("../../config/constants");

//methods

//creating Onboarding
const createOnboarding = asyncErrorHandler(async (req, res, next) => {
  const onboarding = req.body;
  
  //if emloyee doesn't exist
  if(onboarding.assignedTo){
      const existedEmployee=await getExistingEmployeeById(onboarding.assignedTo);
      if(!existedEmployee || existedEmployee.status===EMPLOYEE_STATUS[1]){
          return next(
              new ErrorHandler("Employee doesn't exist to perform that task", 404)
            ); 
      }
  }

  //if Onboarding exists?
  const existedOnboarding = await Onboardings.getExistingOnboarding(onboarding.category,onboarding.taskName);
  if (existedOnboarding) {
    return next(
      new ErrorHandler("Provided task already belongs to other Onboarding category", 409)
    );
  }

  // creating Onboarding
  const createdOnboarding = await Onboardings.onboardingCreate(onboarding);
  if (!createdOnboarding) {
    return next(new ErrorHandler("INTERNAL SERVER ERROR", 500));
  }

  sendResponse({ createdOnboarding }, 201, res);
});

//get all Onboardings
const findAllOnboardings = asyncErrorHandler(async (req, res, next) => {
  const query = req.query;
  const resultPerPage = 2;
  const allOnboardings = await Onboardings.getAllOnboardings(query, resultPerPage);
  const countedOnboardings = await Onboardings.getCount();
  if (!allOnboardings) {
  return  next(new ErrorHandler("Not a single Onboarding found", 404));
  }
  return sendResponse({countedOnboardings,allOnboardings},200,res)
});

//get Onboarding
const getOnboarding = asyncErrorHandler(async (req, res, next) => {
  const { onboardingId } = req.params;
  const existedOnboarding = await Onboardings.getExistingOnboardingById(onboardingId);
  if (!existedOnboarding) {
    return next(new ErrorHandler("Onboarding with given Id doesn't exists", 404));
  }

  return sendResponse({ existedOnboarding }, 200, res);
});

//update Onboarding
const updateOnboarding = asyncErrorHandler(async (req, res, next) => {
  const { onboardingId } = req.params;
  //checking existance
  const existedOnboarding = await Onboardings.getExistingOnboardingById(onboardingId);
  if (!existedOnboarding) {
    return next(new ErrorHandler("Onboarding with given Id doesn't exists", 404));
  }

  const toBeUpdate = req.body;
  if(toBeUpdate.assignedTo){
     //if emloyee doesn't exist
const existedEmployee=await getExistingEmployeeById(toBeUpdate.assignedTo);
if(!existedEmployee || existedEmployee.status===EMPLOYEE_STATUS[1]){
    return next(
        new ErrorHandler("Employee doesn't exist to perform that task", 404)
      ); 
}
  }

   //if Onboarding exists?
   const otherOnboarding = await Onboardings.getExistingOnboarding(toBeUpdate.category,toBeUpdate.taskName);
   if (otherOnboarding) {
     return next(
       new ErrorHandler("Provided task already belongs to other Onboarding category", 409)
     );
   }

  //updating
  const updatedOnboarding = await Onboardings.onboardingUpdate(onboardingId, toBeUpdate);
  if (!updatedOnboarding) {
    return next(new ErrorHandler("Updation Failed.", 500));
  }

  return sendResponse({ updatedOnboarding }, 200, res);
});

// // remove Onboarding
// const deleteOnboarding = asyncErrorHandler(async (req, res, next) => {
//   const { onboardingId } = req.params;
//   //checing existance
//   const existedOnboarding = await Onboardings.getExistingOnboardingById(onboardingId);
//   if (!existedOnboarding) {
//     return next(new ErrorHandler("Onboarding with given Id doesn't exists", 404));
//   }

//   //removing
//   const toBeUpdate = { status: Onboarding_STATUS[1] };
//   const deletedOnboarding = await Onboardings.OnboardingUpdate(onboardingId, toBeUpdate);
//   return sendResponse({ deletedOnboarding }, 200, res);
// });

module.exports = {
  createOnboarding,
  updateOnboarding,
  findAllOnboardings,
  //   deleteOnboarding,
  getOnboarding,
};
