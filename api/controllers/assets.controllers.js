//importing services
const Assets = require("../services/assets.services");
const { getExistingEmployeeById } = require("../services/employee.services");

//importing middlewares
const asyncErrorHandler = require("../middlewares/errors/asyncErrorHandler");

//impoting utils
const ErrorHandler = require("../utils/classes/errorHandler");
const sendResponse = require("../utils/sendResponse");

//importing constants
const {ASSET_STATUS}=require("../../config/constants")

//methods

//creating Asset
const createAsset = asyncErrorHandler(async (req, res, next) => {
  const asset = req.body;
  if (req.body.assignment) {
    return next(
      new ErrorHandler("You can't assign this asset in this route", 400)
    );
  }
  //if Asset exists?
  const existedAsset = await Assets.getExistingAsset(
    asset.serialNumber,
    asset.category
  );
  if (existedAsset) {
    return next(
      new ErrorHandler(
        "Provided serial number and category already belongs to other Asset",
        409
      )
    );
  }

  // creating Asset
  const createdAsset = await Assets.assetCreate(asset);
  if (!createdAsset) {
    return next(new ErrorHandler("INTERNAL SERVER ERROR", 500));
  }

  sendResponse({ createdAsset }, 201, res);
});

//get all Assets
const findAllAssets = asyncErrorHandler(async (req, res, next) => {
  const query = req.query;
  const resultPerPage = 2;
  const allAssets = await Assets.getAllAssets(query, resultPerPage);
  const countedAssets = await Assets.getCount();
  if (!allAssets) {
    return next(new ErrorHandler("Not a single Asset found", 404));
  }
  return sendResponse({ countedAssets, allAssets }, 200, res);
});

//get Asset
const getAsset = asyncErrorHandler(async (req, res, next) => {
  const { _id } = req.query;
  const existedAsset = await Assets.getExistingAssetById(_id);
  if (!existedAsset) {
    return next(new ErrorHandler("Asset with given Id doesn't exists", 404));
  }

  return sendResponse({ existedAsset }, 200, res);
});

//update Asset
const updateAsset = asyncErrorHandler(async (req, res, next) => {
  const { _id } = req.query;
  //checking existance
  const existedAsset = await Assets.getExistingAssetById(_id);
  if (!existedAsset) {
    return next(new ErrorHandler("Asset with given Id doesn't exists", 404));
  }

  //updating
  const toBeUpdate = req.body;
  const updatedAsset = await Assets.assetUpdate(_id, toBeUpdate);
  if (!updatedAsset) {
    return next(new ErrorHandler("Updation Failed.", 500));
  }

  return sendResponse({ updatedAsset }, 200, res);
});





// // remove Asset
// const deleteAsset = asyncErrorHandler(async (req, res, next) => {
//   const { assetId } = req.params;
//   //checing existance
//   const existedAsset = await Assets.getExistingAssetById(assetId);
//   if (!existedAsset) {
//     return next(new ErrorHandler("Asset with given Id doesn't exists", 404));
//   }

//   //removing
//   const toBeUpdate = { status: Asset_STATUS[1] };
//   const deletedAsset = await Assets.AssetUpdate(assetId, toBeUpdate);
//   return sendResponse({ deletedAsset }, 200, res);
// });

/*  ---------ASSET ASSIGNMENT ----------- */
//assign asset
const assign = asyncErrorHandler(async (req, res, next) => {

  const { _id } = req.query;
  //checking existance
  const existedAsset = await Assets.getExistingAssetById(_id);
  if (!existedAsset) {
    return next(new ErrorHandler("Asset with given Id doesn't exists", 404));
  }

  //checking availabilty to be assigned
  if(existedAsset.status===ASSET_STATUS[1]){ 
      return next(new ErrorHandler("Asset isn't available to assign.", 409));
    }

  const asset=req.body;

  //checking employee existance
  const existedEmployee = await getExistingEmployeeById(asset.employee);
  if (!existedEmployee) {
    return next(new ErrorHandler("Employee with given Id doesn't exists", 404));
  }

  asset.assignedDate=Date.now();

  //updating
  existedAsset.assignment.push(req.body);
  const toBeUpdate = { assignment:  existedAsset.assignment,status:ASSET_STATUS[1] };
  const updatedAsset = await Assets.assetUpdate(_id, toBeUpdate);
  if (!updatedAsset) {
    return next(new ErrorHandler("Updation Failed.", 500));
  }

  return sendResponse({ updatedAsset }, 200, res);
});

//update assignment
const updateAssignment = asyncErrorHandler(async (req, res, next) => {

  const {_id}=req.query
  //checking existance
  const existedAsset = await Assets.getExistingAssetById(_id);
  if (!existedAsset) {
    return next(new ErrorHandler("Asset with given Id doesn't exists", 404));
  }

  const { assignmentId } = req.params;
   //checking existance of assignment for same asset
   const assignmentExistance = existedAsset.assignment?.find((assign) =>
   assign._id.equals(assignmentId)
 );
 if (!assignmentExistance) {
   return next(
     new ErrorHandler(
       "Assignment with this id has never given to this asset",
       400
     )
   );
 }

  const asset=req.body;

  //checking employee existance
  if(asset.employee){
    const existedEmployee = await getExistingEmployeeById(asset.employee);
    if (!existedEmployee) {
      return next(new ErrorHandler("Employee with given Id doesn't exists", 404));
    }
  }

  if(asset.returnedDate){
    //date should be greater than assigned one
    if(assignmentExistance.assignedDate.toJSON()>asset.returnedDate){
      return next(new ErrorHandler("Returned Date should be greater than assigned date", 400));
    }
   
    //date should be less than last assigned one
    const notReturned=existedAsset.assignment.find(assign=>!assign.returnedDate)
    if(notReturned && notReturned!=assignmentExistance){
      if(notReturned.assignedDate.toJSON()<asset.returnedDate){
        return next(new ErrorHandler("Returned Date should be less than last assigned asset date", 400));
      }
    }
    else{
    existedAsset.status=ASSET_STATUS[0]
    }
  }

  if(asset.assignedDate){
    //date should be less than returned one
   
    if(assignmentExistance.returnedDate?.toJSON()<asset.assignedDate){
      return next(new ErrorHandler("Assigned Date should be less than returned date", 400));
    }
      }

  //updating
  assignmentExistance.employee = asset.employee
    ? asset.employee
    : assignmentExistance.employee;
    assignmentExistance.returnedDate = asset.returnedDate ? asset.returnedDate : assignmentExistance.returnedDate;
    assignmentExistance.assignedDate = asset.assignedDate
    ? asset.assignedDate
    : assignmentExistance.assignedDate;

  const toBeUpdate = { assignment:  existedAsset.assignment,status:existedAsset.status };
  const updatedAsset = await Assets.assetUpdate(_id, toBeUpdate);
  if (!updatedAsset) {
    return next(new ErrorHandler("Updation Failed.", 500));
  }

  return sendResponse({ updatedAsset }, 200, res);
});


module.exports = {
  createAsset,
  findAllAssets,
  updateAsset,
  //   deleteAsset,
  getAsset,
  assign,
  updateAssignment,
};
