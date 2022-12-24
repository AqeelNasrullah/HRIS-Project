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
    .regex(/^[A-Za-z ]+$/)
    .required(),
  jobTitle: joi
    .string()
    .trim()
    .regex(/^[A-Za-z ]+$/)
    .required(),
});

const updateSchema = joi.object({
  _id: joi
    .string()
    .regex(/^[a-f0-9]+$/)
    .length(24),
  department: joi
    .string()
    .trim()
    .regex(/^[A-Za-z ]+$/),
  jobTitle: joi
    .string()
    .trim()
    .regex(/^[A-Za-z ]+$/),
});

module.exports = { createSchema, updateSchema, jobParam };
