//importing model
const DocumentsModel = require("../models/documents");

//importing utils
const ApiFatures=require("../utils/classes/apiFeatures")

//creating Document object
const documentCreate = async (document) => {
  try {
    const newDocument = new DocumentsModel(document);
    return await newDocument.save();
  } catch (error) {
    throw error;
  }
};

//finding Document by id
const getExistingDocumentById = async (documentId) => {
  try {
    const existedDocument = await DocumentsModel.findById(documentId).lean();
    return existedDocument;
  } catch (error) {
    throw error;
  }
};

//get all Document
const getAllDocuments = async (query, resultPerPage) => {
  try {
    const apiFeatures = new ApiFatures(DocumentsModel.find(), query)
      .search()
      .filter()
      .pagination(resultPerPage);
    const allDocuments = await apiFeatures.query;
    if (!allDocuments) {
      return null;
    }
    return allDocuments;
  } catch (error) {
    throw error;
  }
};

//update Document's any field
const documentUpdate = async (documentId, toBeUpdate) => {
  try {
    return await DocumentsModel.findByIdAndUpdate(documentId, toBeUpdate, {
      new: true,
      runValidators: true,
    }).lean();
  } catch (error) {
    throw error;
  }
};

//getting Document by url
const getExistingDocument = async (url) => {
  try {
    const existedDocument = DocumentsModel.findOne({ documentUrl: { $eq: url }}).lean();
    return existedDocument;
  } catch (error) {
    throw error;
  }
};

//get docs count
const getCount = async () => {
  try {
    return await DocumentsModel.countDocuments();
  } catch (error) {
    throw error;
  }
};

module.exports = {
  documentCreate,
  getAllDocuments,
  getExistingDocumentById,
  documentUpdate,
  getExistingDocument,
  getCount,
};
