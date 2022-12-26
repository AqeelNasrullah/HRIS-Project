//importing services
const Jobs = require("../services/jobs.services");

//importing middlewares
const asyncErrorHandler = require("../middlewares/errors/asyncErrorHandler");

//impoting utils
const ErrorHandler = require("../utils/classes/errorHandler");
const sendResponse = require("../utils/sendResponse");

//methods

//creating Job
const createJob = asyncErrorHandler(async (req, res, next) => {
  const job = req.body;

  //if Job exists?
  const existedJob = await Jobs.getExistingJob(job.jobTitle);
  if (existedJob) {
    return next(
      new ErrorHandler("This title already belongs to other Job", 409)
    );
  }

  // creating job
  const createdJob = await Jobs.jobCreate(job);
  if (!createdJob) {
    return next(new ErrorHandler("INTERNAL SERVER ERROR", 500));
  }

  sendResponse({ createdJob }, 201, res);
});

//get all Jobs
const findAllJobs = asyncErrorHandler(async (req, res, next) => {
  const query = req.query;
  const {result} = req.query;
  const allJobs = await Jobs.getAllJobs(query, result);
  const countedJobs = await Jobs.getCount();
  if (!allJobs) {
  return  next(new ErrorHandler("Not a single Job found", 404));
  }
  return sendResponse({countedJobs,allJobs},200,res)
});

//get Job
const getJob = asyncErrorHandler(async (req, res, next) => {
  const { jobId } = req.params;
  const existedJob = await Jobs.getExistingJobById(jobId);
  if (!existedJob) {
    return next(new ErrorHandler("Job with given Id doesn't exists", 404));
  }

  return sendResponse({ existedJob }, 200, res);
});

//update Job
const updateJob = asyncErrorHandler(async (req, res, next) => {
  const { jobId } = req.params;
  //checking existance
  const existedJob = await Jobs.getExistingJobById(jobId);
  if (!existedJob) {
    return next(new ErrorHandler("Job with given Id doesn't exists", 404));
  }
  
  const toBeUpdate = req.body;
//if Job exists?
const otherJob = await Jobs.getExistingJob(toBeUpdate.jobTitle);
if (otherJob) {
  return next(
    new ErrorHandler("This title already belongs to other Job", 409)
  );
}

  //updating
  const updatedJob = await Jobs.jobUpdate(jobId, toBeUpdate);
  if (!updatedJob) {
    return next(new ErrorHandler("Updation Failed.", 500));
  }

  return sendResponse({ updatedJob }, 200, res);
});

// // remove Job
// const deleteJob = asyncErrorHandler(async (req, res, next) => {
//   const { jobId } = req.params;
//   //checing existance
//   const existedJob = await Jobs.getExistingJobById(jobId);
//   if (!existedJob) {
//     return next(new ErrorHandler("Job with given Id doesn't exists", 404));
//   }

//   //removing
//   const toBeUpdate = { status: Job_STATUS[1] };
//   const deletedJob = await Jobs.JobUpdate(jobId, toBeUpdate);
//   return sendResponse({ deletedJob }, 200, res);
// });

module.exports = {
  createJob,
  updateJob,
  findAllJobs,
  //   deleteJob,
  getJob,
};
