//importing model
const JobsModel = require("../models/jobs");

//importing utils
const ApiFatures=require("../utils/classes/apiFeatures")

//creating Job object
const jobCreate = async (job) => {
  try {
    const newJob = new JobsModel(job);
    return await newJob.save();
  } catch (error) {
    throw error;
  }
};

//get all Job
const getAllJobs = async (query, resultPerPage) => {
  try {
    const apiFeatures = new ApiFatures(JobsModel.find(), query)
      .search()
      .filter()
      .pagination(resultPerPage);
    const allJobs = await apiFeatures.query;
    return allJobs;
  } catch (error) {
    throw error;
  }
};

//finding Job by id
const getExistingJobById = async (jobId) => {
  try {
    const existedJob = await JobsModel.findById(jobId).lean();
    return existedJob;
  } catch (error) {
    throw error;
  }
};

//update Job's any field
const jobUpdate = async (jobId, toBeUpdate) => {
  try {
    //  const error= toBeUpdate.validateSync();
    //  console.log(error);
    return await JobsModel.findByIdAndUpdate(jobId, toBeUpdate, {
      new: true,
      runValidators: true,
    }).lean();
  } catch (error) {
    throw error;
  }
};

//getting Job by ssn
const getExistingJob = async (title) => {
  try {
    const existedJob = JobsModel.findOne({ jobTitle: { $eq: title } }).lean();
    return existedJob;
  } catch (error) {
    throw error;
  }
};

//get docs count
const getCount = async () => {
  try {
    return await JobsModel.countDocuments();
  } catch (error) {
    throw error;
  }
};

module.exports = {
  jobCreate,
  getAllJobs,
  getExistingJobById,
  jobUpdate,
  getExistingJob,
  getCount,
};
