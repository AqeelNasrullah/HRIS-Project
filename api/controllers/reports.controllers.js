//importing services
const Reports = require("../services/reports.services");
const { getAllBenefits,getAllEmployements } = require("../services/employee.services");
const { getAssetsReport } = require("../services/assets.services");
const { getTimeoffsReport } = require("../services/timeoffs.services");

//importing middlewares
const asyncErrorHandler = require("../middlewares/errors/asyncErrorHandler");

//impoting utils
const ErrorHandler = require("../utils/classes/errorHandler");
const sendResponse = require("../utils/sendResponse");

//methods

//reports

//get all benefits
const benefitsReport = asyncErrorHandler(async (req, res, next) => {
  const query = req.query;
  const { result } = req.query;
  const allBenefits = await getAllBenefits(query, result);
  const countedBenefits = allBenefits.length;
  if (!allBenefits) {
    return next(new ErrorHandler("Not a single benefit found", 404));
  }

  //filter by job title
  if (req.query.jobTitle) {
    const benefits = allBenefits.filter((emp) =>
      emp.jobDescription
        .slice(-1)
        .find((j) => j.job.jobTitle == req.query.jobTitle)
    );
    if (!benefits) {
      return next(
        new ErrorHandler(
          "Not a single benefit found with provide jobTitle",
          404
        )
      );
    }
    const count = benefits.length;
    return sendResponse(
      { countBenefits: count, allBenefits: benefits },
      200,
      res
    );
  }
  //filter by category
  if (req.query.category) {
    const benefits = allBenefits.filter((emp) =>
      emp.benefits.find(
        (benefit) => benefit.benefitId.category == req.query.category
      )
    );
    if (!benefits) {
      return next(
        new ErrorHandler(
          "Not a single benefit found with provide category",
          404
        )
      );
    }
    const count = benefits.length;
    return sendResponse(
      { countBenefits: count, allBenefits: benefits },
      200,
      res
    );
  }
  return sendResponse({ countedBenefits, allBenefits }, 200, res);
});

//get all Assets
const assetsReports = asyncErrorHandler(async (req, res, next) => {
  const query = req.query;
  const { result } = req.query;
  const allAssets = await getAssetsReport(query, result);
  const countedAssets = allAssets.length;
  if (!allAssets) {
    return next(new ErrorHandler("Not a single Asset found", 404));
  }
  return sendResponse({ countedAssets, allAssets }, 200, res);
});

//get all benefits
const timeoffsReport = asyncErrorHandler(async (req, res, next) => {
  const query = req.query;
  const { result } = req.query;
  const allTimeoffs = await getTimeoffsReport(query, result);
  const countedTimeoffs = allTimeoffs.length;
  if (!allTimeoffs) {
    return next(new ErrorHandler("Not a single benefit found", 404));
  }

  //filter by job title
  if (req.query.jobTitle) {
    const timeoffs = allTimeoffs.filter((time) =>
      time.employeeId.jobDescription
        .slice(-1)
        .find((j) => j.job.jobTitle == req.query.jobTitle)
    );
    if (!timeoffs) {
      return next(
        new ErrorHandler(
          "Not a single timeoffs found with provide jobTitle",
          404
        )
      );
    }
    const count = timeoffs.length;
    return sendResponse(
      { countBenefits: count, allTimeoffs: timeoffs },
      200,
      res
    );
  }
  //filter by category
  if (req.query.category) {
    const benefits = allBenefits.filter((emp) =>
      emp.benefits.find(
        (benefit) => benefit.benefitId.category == req.query.category
      )
    );
    if (!benefits) {
      return next(
        new ErrorHandler(
          "Not a single benefit found with provide category",
          404
        )
      );
    }
    const count = benefits.length;
    return sendResponse(
      { countBenefits: count, allBenefits: benefits },
      200,
      res
    );
  }
  return sendResponse({ countedTimeoffs, allTimeoffs }, 200, res);
});

//get all employement salary
const salaryReport = asyncErrorHandler(async (req, res, next) => {
    const query = req.query;
    const { result } = req.query;
    const employes= await getAllEmployements(query, result);
    const countedEmployees = employes.length;
    if (!employes) {
      return next(new ErrorHandler("Not a single employee found", 404));
    }
  
 
    return sendResponse({ countedEmployees, employes }, 200, res);
  });

module.exports = {
  benefitsReport,
  assetsReports,
  timeoffsReport,
  salaryReport
};
