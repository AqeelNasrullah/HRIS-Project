const { number } = require("joi");
const joi = require("joi");

const jobParam = joi.object({
  jobId: joi
    .string()
    .regex(/^[a-f0-9]+$/)
    .length(24)
    .required(),
});

const createSchema = joi.object({
  department: joi
    .string()
    .trim()
    .regex(/^[A-Z ]+$/)
    .required(),
  jobTitle: joi
    .string()
    .trim()
    .regex(/^[A-Z ]+$/)
    .required(),
});

const updateSchema = joi.object({
  _id: joi
    .string()
    .regex(/^[a-f0-9]+$/)
    .length(24),
    page:joi.number(),
    result:joi.number(),
  department: joi
    .string()
    .trim()
    .regex(/^[A-Z ]+$/),
  jobTitle: joi
    .string()
    .trim()
    .regex(/^[A-Z ]+$/),
});

module.exports = { createSchema, updateSchema, jobParam };
