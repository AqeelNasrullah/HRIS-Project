//importing model
const AssetsModel = require("../models/assets");

//importing utils
const ApiFatures = require("../utils/classes/apiFeatures");

//creating Asset object
const assetCreate = async (asset) => {
  try {
    const newAsset = new AssetsModel(asset);

    return await newAsset.save();
  } catch (error) {
    throw error;
  }
};

//finding Asset by id
const getExistingAssetById = async (assetId) => {
  try {
    const existedAsset = await AssetsModel.findById(assetId).lean();

    return existedAsset;
  } catch (error) {
    throw error;
  }
};

//update Asset's any field
const assetUpdate = async (assetId, toBeUpdate) => {
  try {
    return await AssetsModel.findByIdAndUpdate(assetId, toBeUpdate, {
      new: true,
      runValidators: true,
    }).lean();
  } catch (error) {
    throw error;
  }
};

//get all Asset
const getAllAssets = async (query, resultPerPage) => {
  try {
    const apiFeatures = new ApiFatures(AssetsModel.find().lean(), query)
      .search()
      .filter()
      .pagination(resultPerPage);
    const allAssets = await apiFeatures.query;
    if (!allAssets) {
      return null;
    }
    return allAssets;
  } catch (error) {
    throw error;
  }
};

//get all Assets for
const getAssetsReport = async (query, resultPerPage) => {
  try {
    const apiFeatures = new ApiFatures(
      AssetsModel.find()
        .populate({
          path: "assignment.employee",
          select: "basicInformation.firstName",
        })
        .select("-createdAt -updatedAt -__v -status"),
      query
    )
      .search()
      .filter()
      .pagination(resultPerPage);
    const allAssets = await apiFeatures.query;

    return allAssets;
  } catch (error) {
    throw error;
  }
};

const getEmployeeAssets = async (id) => {
  try {
    const allAssets = await AssetsModel.find({
      assignment: {
        $elemMatch: {
          $and: [
            { employee: { $eq: id } },
            { returnedDate: { $exists: false } },
          ],
        },
      },
    })
      .select("id category serialNumber description")
      .lean();
    return allAssets;
  } catch (error) {
    throw error;
  }
};

//getting Asset by specific fields
const getExistingAsset = async (serialNumber, category) => {
  try {
    const existedAsset = AssetsModel.findOne({
      serialNumber: { $eq: serialNumber },
      category: { $eq: category },
    }).lean();
    return existedAsset;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  assetCreate,
  getAllAssets,
  getExistingAssetById,
  assetUpdate,
  getExistingAsset,
  getEmployeeAssets,
  getAssetsReport,
};
