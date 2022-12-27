//importing dependencies
const joi = require("joi");

//importing constants
const { SYSTEM_ROLES_ENUM } = require("../../config/constants");

const createSchema = joi.object({
  firstName: joi
    .string()
    .uppercase()
    .trim()
    .regex(/^[A-Za-z]+$/)
    .required(),
  lastName: joi
    .string()
    .trim()
    .regex(/^[A-Za-z]+$/)
    .required(),
  phoneNumber: joi
    .string()
    .regex(/^\d{3}-\d{3}-\d{4}$/)
    .required(),
  email: joi
    .string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .lowercase()
    .required(),
  password: joi.string().alphanum().min(5).max(12).strict().required(),
  confirmPassword: joi.string().valid(joi.ref("password")).required(),
  systemRole: joi
    .string()
    .valid(...SYSTEM_ROLES_ENUM)
    .required(),
});

const updateSchema = joi.object({
  firstName: joi
    .string()
    .trim()
    .regex(/^[A-Z]+$/)
    .uppercase(),
  lastName: joi
    .string()
    .trim()
    .regex(/^[A-Za-z]+$/),
  phoneNumber: joi.string().regex(/^\d{3}-\d{3}-\d{4}$/),
  email: joi
    .string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .lowercase(),
});

const passwordSchema = joi.object({
  password: joi.string().alphanum().min(5).max(12).strict().required(),
  confirmPassword: joi.string().valid(joi.ref("password")).required(),
});

const OTPSchema = joi.object({
  code: joi.string().alphanum().length(10),
});

module.exports = { createSchema, updateSchema, passwordSchema, OTPSchema };
