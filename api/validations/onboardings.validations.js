//importing dependencies
const joi = require("joi");

//importing constants
const { ONBOARDING_CATEGORY } = require("../../config/constants");

const onboardingParam = joi.object({
  onboardingId: joi
    .string()
    .regex(/^[a-f0-9]+$/)
    .length(24)
    .required(),
});

const createSchema = joi.object({
  category: joi
    .string()
    .valid(...ONBOARDING_CATEGORY)
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
  category: joi.string().valid(...ONBOARDING_CATEGORY),
  taskName: joi.string().trim(),
  assignedTo: joi.string(),
  due: joi.string().trim(),
  result: joi.number().integer(),
  page: joi.number().integer(),
});

module.exports = { createSchema, onboardingParam, updateSchema };
