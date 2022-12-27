//importing model
const OnboardingsModel = require("../models/onboardings");

//importing utils
const ApiFatures = require("../utils/classes/apiFeatures");

//creating Onboarding object
const onboardingCreate = async (onboarding) => {
  try {
    const newOnboarding = new OnboardingsModel(onboarding);

    return await newOnboarding.save();
  } catch (error) {
    throw error;
  }
};

//get all Onboardings
const getAllOnboardings = async (query, resultPerPage) => {
  try {
    const apiFeatures = new ApiFatures(OnboardingsModel.find().lean(), query)
      .search()
      .filter()
      .pagination(resultPerPage);
    const allOnboardings = await apiFeatures.query;

    return allOnboardings;
  } catch (error) {
    throw error;
  }
};

//finding Onboarding by id
const getExistingOnboardingById = async (onboardingId) => {
  try {
    const existedOnboarding = await OnboardingsModel.findById(
      onboardingId
    ).lean();

    return existedOnboarding;
  } catch (error) {
    throw error;
  }
};

//update Onboarding's any field
const onboardingUpdate = async (onboardingId, toBeUpdate) => {
  try {
    return await OnboardingsModel.findByIdAndUpdate(onboardingId, toBeUpdate, {
      new: true,
      runValidators: true,
    }).lean();
  } catch (error) {
    throw error;
  }
};

//getting Onboarding by category
const getExistingOnboarding = async (category, taskName) => {
  try {
    const existedOnboarding = OnboardingsModel.findOne({
      category: { $eq: category },
      taskName: { $eq: taskName },
    }).lean();

    return existedOnboarding;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  onboardingCreate,
  getAllOnboardings,
  getExistingOnboardingById,
  onboardingUpdate,
  getExistingOnboarding,
};
