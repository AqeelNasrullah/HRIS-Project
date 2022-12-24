const joi = require("joi");
const { ASSET_CATEGORY } = require("../../config/constants");

const param = joi.object({
  assignmentId: joi
    .string()
    .regex(/^[a-f0-9]+$/)
    .length(24)
    .required(),
});

const query = joi.object({
  _id: joi
    .string()
    .regex(/^[a-f0-9]+$/)
    .length(24)
    .required(),
});

const createAsset = joi.object({
  category: joi
    .string()
    .alphanum()
    .valid(...ASSET_CATEGORY)
    .required(),
  description: joi.string().max(50).alphanum().trim(),
  serialNumber: joi.string().max(25).required(),
});

const updateAsset = joi.object({
  _id: joi
    .string()
    .regex(/^[a-f0-9]+$/)
    .length(24),
  category: joi
    .string()
    .alphanum()
    .valid(...ASSET_CATEGORY),
  description: joi.string().max(50).alphanum().trim(),
  serialNumber: joi.string().max(25),
});

const assignmentAdd = joi.object({
  employee: joi
    .string()
    .regex(/^[a-f0-9]+$/)
    .length(24)
    .required(),
});

const assignmentUpdate = joi.object({
  employee: joi
    .string()
    .regex(/^[a-f0-9]+$/)
    .length(24),
  assignedDate: joi.date().iso(),
  returnedDate: joi.date().iso(),
});

module.exports = {
  createAsset,
  updateAsset,
  assignmentAdd,
  assignmentUpdate,
  param,
  query,
};
