const joi = require("joi");
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
  title: joi.string().max(15).alphanum().trim().required(),
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
  title: joi.string().max(15).alphanum().trim(),
  amount: joi.number().positive(),
});

module.exports = { benefitsSchema, updateSchema, benefitParam };
