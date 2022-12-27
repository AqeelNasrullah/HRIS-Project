//importing model
const BenefitsModel = require("../models/benefits");

//importing utils
const ApiFatures = require("../utils/classes/apiFeatures");

//methods
//creating Benefit object
const benefitCreate = async (benefit) => {
  try {
    const newBenefit = new BenefitsModel(benefit);
    return await newBenefit.save();
  } catch (error) {
    throw error;
  }
};

//get all Benefit
const getAllBenefits = async (query, resultPerPage) => {
  try {
    const apiFeatures = new ApiFatures(BenefitsModel.find().lean(), query)
      .search()
      .filter()
      .pagination(resultPerPage);
    const allBenefits = await apiFeatures.query;
    return allBenefits;
  } catch (error) {
    throw error;
  }
};

//finding Benefit by id
const getExistingBenefitById = async (benefitId) => {
  try {
    const existedBenefit = await BenefitsModel.findById(benefitId).lean();
    return existedBenefit;
  } catch (error) {
    throw error;
  }
};

//update Benefit's any field
const benefitUpdate = async (benefitId, toBeUpdate) => {
  try {
    return await BenefitsModel.findByIdAndUpdate(benefitId, toBeUpdate, {
      new: true,
      runValidators: true,
    }).lean();
  } catch (error) {
    throw error;
  }
};

//getting Benefit by title
const getExistingBenefit = async (category, title) => {
  try {
    const existedBenefit = BenefitsModel.findOne({
      category: { $eq: category },
      title: { $eq: title },
    }).lean();
    return existedBenefit;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  benefitCreate,
  getAllBenefits,
  getExistingBenefitById,
  benefitUpdate,
  getExistingBenefit,
};
