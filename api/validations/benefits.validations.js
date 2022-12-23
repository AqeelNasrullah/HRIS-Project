const joi = require("joi");
const { BENEFITS_CATEGORY } = require("../../config/constants");

const benefitsSchema = joi.object({
    category: joi
    .string().alphanum()
    .valid(...BENEFITS_CATEGORY)
    .required(),
    title: joi.string().max(15).alphanum().trim().required(),
    amount:joi.number().positive()
});

const updateSchema = joi.object({
    category: joi
    .string().alphanum()
    .valid(...BENEFITS_CATEGORY),
    title: joi.string().max(15).alphanum().trim(),
    amount:joi.number().positive()
});

module.exports = {benefitsSchema,updateSchema};