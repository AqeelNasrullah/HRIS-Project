//importing model
const TimeoffsModel = require("../models/timeoffs");

//importing utils
const ApiFatures = require("../utils/classes/apiFeatures");

//creating Timeoff object
const timeoffCreate = async (timeoff) => {
  try {
    const newTimeoff = new TimeoffsModel(timeoff);

    return await newTimeoff.save();
  } catch (error) {
    throw error;
  }
};

//finding Timeoff by id
const getExistingTimeoffById = async (timeoffId) => {
  try {
    const existedTimeoff = await TimeoffsModel.findById(timeoffId).lean();

    return existedTimeoff;
  } catch (error) {
    throw error;
  }
};

//update Timeoff's any field
const timeoffUpdate = async (timeoffId, toBeUpdate) => {
  try {
    return await TimeoffsModel.findByIdAndUpdate(timeoffId, toBeUpdate, {
      new: true,
      runValidators: true,
    }).lean();
  } catch (error) {
    throw error;
  }
};

//get all Timeoffs
const getAllTimeoffs = async (query, resultPerPage) => {
  try {
    const apiFeatures = new ApiFatures(TimeoffsModel.find(), query)
      .search()
      .filter()
      .pagination(resultPerPage);
    const allTimeoffs = await apiFeatures.query;

    return allTimeoffs;
  } catch (error) {
    throw error;
  }
};

//get all benefits
const getTimeoffsReport = async (query, resultPerPage) => {
  try {
    const apiFeatures = new ApiFatures(
      TimeoffsModel.find()
        .populate({
          path: "employeeId",
          select: "basicInformation.firstName basicInformation.lastName",
          populate: {
            path: "jobDescription.job",
            select: "jobTitle department",
          },
        })
        .select("-createdAt -updatedAt -__v")
        .lean(),
      query
    )
      .search()
      .filter()
      .pagination(resultPerPage);
    const allEmployees = await apiFeatures.query;

    return allEmployees;
  } catch (error) {
    throw error;
  }
};

//getting Timeoff by emp id and start date
const getExistingTimeoff = async (employeeId, startTime) => {
  try {
    const existedTimeoff = TimeoffsModel.findOne({
      employeeId: { $eq: employeeId },
      startTime: { $eq: new Date(startTime) },
    }).lean();

    return existedTimeoff;
  } catch (error) {
    throw error;
  }
};

//getting Timeoff by emp id
const getEmployeeTimeoff = async (employeeId) => {
  try {
    const existedTimeoff = TimeoffsModel.find({
      employeeId: { $eq: employeeId },
    }).lean();

    return existedTimeoff;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  timeoffCreate,
  getAllTimeoffs,
  getExistingTimeoffById,
  timeoffUpdate,
  getExistingTimeoff,
  getEmployeeTimeoff,
  getTimeoffsReport,
};
