//importing packages
const joi = require("joi");

//importing constants
const { TIMEOFF_STATUS } = require("../../config/constants");

const hoursSchema = joi.object({
  from: joi.date().iso().required(),
  to: joi.date().iso().required(),
  status: joi
    .string()
    .valid(...TIMEOFF_STATUS)
    .required(),
});

const limitSchema = joi.object({
  limit: joi.number().integer(),
});

module.exports = { limitSchema, hoursSchema };
