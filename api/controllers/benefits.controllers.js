//importing services
const Benefits = require("../services/benefits.services");

//importing middlewares
const asyncErrorHandler = require("../middlewares/errors/asyncErrorHandler");

//impoting utils
const ErrorHandler = require("../utils/classes/errorHandler");
const sendResponse = require("../utils/sendResponse");

//methods

//creating Benefit
const createBenefit = asyncErrorHandler(async (req, res, next) => {
  const benefit = req.body;

  //if Benefit exists?
  const existedBenefit = await Benefits.getExistingBenefit(benefit.category,benefit.title);
  if (existedBenefit) {
    return next(
      new ErrorHandler("This title already belongs to other benefit", 409)
    );
  }

  // creating Benefit
  const createdBenefit = await Benefits.benefitCreate(benefit);
  if (!createdBenefit) {
    return next(new ErrorHandler("INTERNAL SERVER ERROR", 500));
  }

  sendResponse({ createdBenefit }, 201, res);
});

//get all Benefits
const findAllBenefits = asyncErrorHandler(async (req, res, next) => {
  const query = req.query;
  const resultPerPage = 10;
  const allBenefits = await Benefits.getAllBenefits(query, resultPerPage);
  const countedBenefits = await Benefits.getCount();
  if (!allBenefits) {
  return  next(new ErrorHandler("Not a single Benefit found", 404));
  }
  return sendResponse({countedBenefits,allBenefits},200,res)
});

//get Benefit
const getBenefit = asyncErrorHandler(async (req, res, next) => {
  const { benefitId } = req.params;
  const existedBenefit = await Benefits.getExistingBenefitById(benefitId);
  if (!existedBenefit) {
    return next(new ErrorHandler("Benefit with given Id doesn't exists", 404));
  }

  return sendResponse({ existedBenefit }, 200, res);
});

//update Benefit
const updateBenefit = asyncErrorHandler(async (req, res, next) => {
  const { benefitId } = req.params;
  //checking existance
  const existedBenefit = await Benefits.getExistingBenefitById(benefitId);
  if (!existedBenefit) {
    return next(new ErrorHandler("Benefit with given Id doesn't exists", 404));
  }
  
  const toBeUpdate = req.body;
  if(!toBeUpdate.category){
    toBeUpdate.category=existedBenefit.category
  }

//if Benefit exists?
const otherBenefit = await Benefits.getExistingBenefit(toBeUpdate.category,toBeUpdate.title);
if (otherBenefit) {
  return next(
    new ErrorHandler("This title already belongs to other benefit", 409)
  );
}

  //updating
  const updatedBenefit = await Benefits.benefitUpdate(benefitId, toBeUpdate);
  if (!updatedBenefit) {
    return next(new ErrorHandler("Updation Failed.", 500));
  }

  return sendResponse({ updatedBenefit }, 200, res);
});

// // remove Benefit
// const deleteBenefit = asyncErrorHandler(async (req, res, next) => {
//   const { benefitId } = req.params;
//   //checing existance
//   const existedBenefit = await Benefits.getExistingBenefitById(benefitId);
//   if (!existedBenefit) {
//     return next(new ErrorHandler("Benefit with given Id doesn't exists", 404));
//   }

//   //removing
//   const toBeUpdate = { status: Benefit_STATUS[1] };
//   const deletedBenefit = await Benefits.BenefitUpdate(benefitId, toBeUpdate);
//   return sendResponse({ deletedBenefit }, 200, res);
// });

module.exports = {
  createBenefit,
  updateBenefit,
  findAllBenefits,
  //   deleteBenefit,
  getBenefit,
};
