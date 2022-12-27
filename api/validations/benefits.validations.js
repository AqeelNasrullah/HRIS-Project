//importing dependencies
const joi = require("joi");

//importing constants
const { BENEFITS_CATEGORY } = require("../../config/constants");

const benefitParam = joi.object({
  benefitId: joi
    .string()
    .regex(/^[a-f0-9]+$/)
    .length(24)
    .required(),
});

const benefitsSchema = joi.object({
  category: joi
    .string()
    .alphanum()
    .valid(...BENEFITS_CATEGORY)
    .required(),
  title: joi
    .string()
    .regex(/^[A-Z0-9 ]+$/)
    .trim()
    .required(),
  amount: joi.number().positive(),
});

const updateSchema = joi.object({
  _id: joi
    .string()
    .regex(/^[a-f0-9]+$/)
    .length(24),
  category: joi
    .string()
    .alphanum()
    .valid(...BENEFITS_CATEGORY),
  title: joi
    .string()
    .regex(/^[A-Z0-9 ]+$/)
    .trim(),
  amount: joi.number().positive(),
  result: joi.number().integer(),
  page: joi.number().integer(),
});

module.exports = { benefitsSchema, updateSchema, benefitParam };
