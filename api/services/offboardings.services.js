//importing model
const OffboardingsModel = require("../models/offboardings");

//importing utils
const ApiFatures=require("../utils/classes/apiFeatures")

//creating Offboarding object
const offboardingCreate = async (offboarding) => {
  try {
    const newOffboarding = new OffboardingsModel(offboarding);
    return await newOffboarding.save();
  } catch (error) {
    throw error;
  }
};

//get all Offboardings
const getAllOffboardings = async (query, resultPerPage) => {
  try {
    const apiFeatures = new ApiFatures(OffboardingsModel.find(), query)
      .search()
      .filter()
      .pagination(resultPerPage);
    const allOffboardings = await apiFeatures.query;
    if (!allOffboardings) {
      return null;
    }
    return allOffboardings;
  } catch (error) {
    throw error;
  }
};

//finding Offboarding by id
const getExistingOffboardingById = async (offboardingId) => {
  try {
    const existedOffboarding = await OffboardingsModel.findById(offboardingId).lean();
    return existedOffboarding;
  } catch (error) {
    throw error;
  }
};

//update Offboarding's any field
const offboardingUpdate = async (offboardingId, toBeUpdate) => {
  try {
    return await OffboardingsModel.findByIdAndUpdate(offboardingId, toBeUpdate, {
      new: true,
      runValidators: true,
    }).lean();
  } catch (error) {
    throw error;
  }
};

//getting Offboarding by cat and tasks
const getExistingOffboarding = async (category,taskName) => {
  try {
    const existedOffboarding = OffboardingsModel.findOne({ category: { $eq: category },  taskName: { $eq: taskName }}).lean();
    return existedOffboarding;
  } catch (error) {
    throw error;
  }
};

//get docs count
const getCount = async () => {
  try {
    return await OffboardingsModel.countDocuments();
  } catch (error) {
    throw error;
  }
};

module.exports = {
  offboardingCreate,
  getAllOffboardings,
  getExistingOffboardingById,
  offboardingUpdate,
  getExistingOffboarding,
  getCount,
};
