//importing dependencies
const joi = require("joi");

//importing constants
const { OFFBOARDING_CATEGORY } = require("../../config/constants");

const offboardingParam = joi.object({
  offboardingId: joi
    .string()
    .regex(/^[a-f0-9]+$/)
    .length(24)
    .required(),
});

const createSchema = joi.object({
  category: joi
    .string()
    .valid(...OFFBOARDING_CATEGORY)
    .required(),
  taskName: joi.string().trim().required(),
  assignedTo: joi.string(),
  due: joi.string().trim(),
});

const updateSchema = joi.object({
  _id: joi
    .string()
    .regex(/^[a-f0-9]+$/)
    .length(24),
  category: joi.string().valid(...OFFBOARDING_CATEGORY),
  taskName: joi.string().trim(),
  assignedTo: joi.string(),
  due: joi.string().trim(),
  result: joi.number().integer(),
  page: joi.number().integer(),
});

module.exports = { createSchema, offboardingParam, updateSchema };
