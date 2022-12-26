const joi = require("joi");
const {
  EMPLOYEE_GENDER,
  EMPLOYEE_MARITAL_STATUS,
  EMPLOYEE_SHIRT_SIZE,
  EMPLOYEE_DEGREE,
  EMPLOYEE_STATUS,
  EMPLOYEE_PAY_SCHEDULE,
  EMPLOYEE_PAY_TYPE,
  EMPLOYEE_PAY_PER,
  EMPLOYEE_OVERTIME_STATUS,
  EMPLOYEE_PAY_CHANGE_REASON,
  EMPLOYMENT_STATUS,
  TASKS_STATUS,
  BENEFITS_STATUS,
  DOCUMENT_CATEGORY,
} = require("../../config/constants");

const createSchema = joi.object({
  hireDate: joi.date().iso(),
  basicInformation: joi.object({
    firstName: joi
      .string()
      .trim()
      .regex(/^[A-Za-z]+$/)
      .required(),
    lastName: joi
      .string()
      .trim()
      .regex(/^[A-Za-z]+$/)
      .required(),
    DOB: joi.date().iso(),
    gender: joi.string().valid(...EMPLOYEE_GENDER),
    maritalStatus: joi.string().valid(...EMPLOYEE_MARITAL_STATUS),
    SSN: joi
      .string()
      .regex(/^\d{3}-\d{2}-\d{4}$/)
      .required(),
    shirtSize: joi.string().valid(...EMPLOYEE_SHIRT_SIZE),
    allergies: joi.array().items(joi.string()),
  }),
  address: joi.object({
    house: joi.string().alphanum().trim(),
    streetNumber: joi.string().alphanum().trim(),
    postalCode: joi.number().integer().max(99999).min(10000),
    city: joi
      .string()
      .regex(/^[A-Za-z]+$/)
      .trim()
      .max(25),
    country: joi
      .string()
      .regex(/^[A-Za-z]+$/)
      .trim()
      .max(20),
  }),
  contact: joi.object({
    phoneNumber: joi
      .string()
      .regex(/^\d{3}-\d{3}-\d{4}$/)
      .required(),
    email: joi
      .string()
      .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } }),
  }),
  education: joi.array().items(
    joi.object({
      institute: joi.string().regex(/^[A-Za-z ]+$/).trim(),
      degree: joi.string().valid(...EMPLOYEE_DEGREE),
      major: joi.string().trim(),
      CGPA: joi.number().precision(2).strict(),
      startDate: joi.date().iso(),
      endDate: joi.date().iso(),
    })
  ),
});

const updateSchema = joi.object({
  _id: joi
    .string()
    .regex(/^[a-f0-9]+$/)
    .length(24),
  hireDate: joi.date(),
  profileImage: joi.string(),
  status: joi.string().valid(...EMPLOYEE_STATUS),
  basicInformation: joi.object({
    firstName: joi
      .string()
      .regex(/^[A-Za-z]+$/)
      .trim(),
    lastName: joi
      .string()
      .regex(/^[A-Za-z]+$/)
      .trim(),
    DOB: joi.date().iso(),
    gender: joi.string().valid(...EMPLOYEE_GENDER),
    maritalStatus: joi.string().valid(...EMPLOYEE_MARITAL_STATUS),
    SSN: joi.string().regex(/^\d{3}-\d{2}-\d{4}$/),
    shirtSize: joi.string().valid(...EMPLOYEE_SHIRT_SIZE),
    allergies: joi.array().items(joi.string()),
  }),
  address: joi.object({
    house: joi.string().alphanum().trim(),
    streetNumber: joi.string().alphanum().trim(),
    postalCode: joi.number().integer().max(99999).min(10000),
    city: joi
      .string()
      .regex(/^[A-Za-z]+$/)
      .trim()
      .max(25),
    country: joi
      .string()
      .regex(/^[A-Za-z]+$/)
      .trim()
      .max(20),
  }),
  contact: joi.object({
    phoneNumber: joi.string().regex(/^\d{3}-\d{3}-\d{4}$/),
    email: joi
      .string()
      .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } }),
  }),
  education: joi.array().items(
    joi.object({
      institute: joi.string().regex(/^[A-Za-z ]+$/).trim(),
      degree: joi.string().valid(...EMPLOYEE_DEGREE),
      major: joi.string().trim(),
      CGPA: joi.number().precision(2).strict(),
      startDate: joi.date().iso(),
      endDate: joi.date().iso(),
    })
  ),
});

//education validations
const addEducation = joi.object({
  institute: joi.string().regex(/^[A-Za-z ]+$/).trim().required(),
  degree: joi.string().valid(...EMPLOYEE_DEGREE).required(),
      major: joi.string().trim().required(),
      CGPA: joi.number().precision(2).strict(),
      startDate: joi.date().iso().required(),
      endDate: joi.date().iso().required(),
});

const updateEducation = joi.object({
  institute: joi.string().regex(/^[A-Za-z ]+$/).trim(),
  degree: joi.string().valid(...EMPLOYEE_DEGREE),
  major: joi.string().trim(),
  CGPA: joi.number().precision(2).strict(),
  startDate: joi.date().iso(),
  endDate: joi.date().iso(),
});

const educationParam=joi.object({
  educationId: joi
  .string()
  .regex(/^[a-f0-9]+$/)
  .length(24).required(),
})

const querySchema = joi.object({
  _id: joi
    .string()
    .regex(/^[a-f0-9]+$/)
    .length(24).required(),
    category:joi.string().valid(...DOCUMENT_CATEGORY)
});

const benefitsReportSchema = joi.object({
  _id: joi
    .string()
    .regex(/^[a-f0-9]+$/),
    result:joi.number().integer(),
    page:joi.number().integer()
    
});

//jobs validations
const jobAddSchema = joi.object({
  effectiveDate: joi.date().iso().required(),
  job: joi
    .string()
    .regex(/^[a-f0-9]+$/)
    .length(24)
    .required(),
  reportsTo: joi
    .string()
    .regex(/^[a-f0-9]+$/)
    .length(24),
});

const jobUpdateSchema = joi.object({
  effectiveDate: joi.date(),
  job: joi
    .string()
    .length(24)
    .regex(/^[a-f0-9]+$/),
  reportsTo: joi
    .string()
    .regex(/^[a-f0-9]+$/)
    .length(24),
});

//compensation validations
const compensationAddSchema = joi.object({
  effectiveDate: joi.date().iso().required(),
  paySchedule: joi
    .string()
    .valid(...EMPLOYEE_PAY_SCHEDULE)
    .required(),
  payType: joi
    .string()
    .valid(...EMPLOYEE_PAY_TYPE)
    .required(),
  payRate: joi.number().precision(2).strict().required(),
  payPer: joi
    .string()
    .valid(...EMPLOYEE_PAY_PER)
    .required(),
  overtimeStatus: joi.string().valid(...EMPLOYEE_OVERTIME_STATUS),
  changeReason: joi
    .string()
    .valid(...EMPLOYEE_PAY_CHANGE_REASON)
    .required(),
  comment: joi.string().trim().max(100),
});

const compensationUpdateSchema = joi.object({
  effectiveDate: joi.date().iso(),
  paySchedule: joi.string().valid(...EMPLOYEE_PAY_SCHEDULE),
  payType: joi.string().valid(...EMPLOYEE_PAY_TYPE),
  payRate: joi.number().precision(2).strict(),
  payPer: joi.string().valid(...EMPLOYEE_PAY_PER),
  overtimeStatus: joi.string().valid(...EMPLOYEE_OVERTIME_STATUS),
  changeReason: joi.string().valid(...EMPLOYEE_PAY_CHANGE_REASON),
  comment: joi.string().trim().max(100),
});

const compensationParam=joi.object({
  compensationId: joi
  .string()
  .regex(/^[a-f0-9]+$/)
  .length(24).required(),
})

//employment validations
const employmentAddSchema = joi.object({
  effectiveDate: joi.date().iso().required(),
  employmentStatus: joi
    .string()
    .valid(...EMPLOYMENT_STATUS)
    .required(),
  comment: joi.string().trim().max(100),
});

const employmentUpdateSchema = joi.object({
  effectiveDate: joi.date().iso(),
  employmentStatus: joi.string().valid(...EMPLOYMENT_STATUS),
  comment: joi.string().trim().max(100),
});

//onboarding validations
const onboardingUpdateSchema = joi.object({
  onboardingTask: joi
    .string()
    .regex(/^[a-f0-9]+$/)
    .length(24),
  date: joi.date().iso(),
  status: joi.string().valid(...TASKS_STATUS),
  description: joi.string().trim().max(100),
});

const onboardingAddSchema = joi.object({
  onboardingTask: joi
    .string()
    .regex(/^[a-f0-9]+$/)
    .length(24)
    .required(),
  date: joi.date().iso().required(),
  status: joi.string().valid(...TASKS_STATUS),
  description: joi.string().trim().max(100),
});

//offboarding validations
const offboardingAddSchema = joi.object({
  offboardingTask: joi
    .string()
    .regex(/^[a-f0-9]+$/)
    .length(24)
    .required(),
  date: joi.date().iso().required(),
  status: joi.string().valid(...TASKS_STATUS),
  description: joi.string().trim().max(100),
});

const offboardingUpdateSchema = joi.object({
  offboardingTask: joi
    .string()
    .regex(/^[a-f0-9]+$/)
    .length(24),
  date: joi.date().iso(),
  status: joi.string().valid(...TASKS_STATUS),
  description: joi.string().trim().max(100),
});

//benefits validations
const benefitAddSchema = joi.object({
  benefitId: joi
    .string()
    .regex(/^[a-f0-9]+$/)
    .length(24)
    .required(),
  effectiveDate: joi.date().iso().required(),
  employeePays: joi.number().precision(2).strict(),
  status: joi
    .string()
    .valid(...BENEFITS_STATUS)
    .required(),
});

const benefitUpdateSchema = joi.object({
  benefitId: joi
    .string()
    .regex(/^[a-f0-9]+$/)
    .length(24),
  effectiveDate: joi.date().iso(),
  employeePays: joi.number().precision(2).strict(),
  status: joi.string().valid(...BENEFITS_STATUS),
});

//documents validation
const documentAddSchema=joi.object({
  _id: joi
  .string()
  .regex(/^[a-f0-9]+$/)
  .length(24).required(),
  category:joi.string().valid(...DOCUMENT_CATEGORY).required()
})

const documentParam=joi.object({
  documentId: joi
  .string()
  .regex(/^[a-f0-9]+$/)
  .length(24).required(),
})

module.exports = {
  createSchema,
  updateSchema,
  jobAddSchema,
  jobUpdateSchema,
  compensationAddSchema,
  compensationUpdateSchema,
  compensationParam,
  employmentAddSchema,
  employmentUpdateSchema,
  onboardingUpdateSchema,
  onboardingAddSchema,
  offboardingAddSchema,
  offboardingUpdateSchema,
  benefitAddSchema,
  benefitUpdateSchema,
  querySchema,
  documentAddSchema,
  documentParam,
  addEducation,
  updateEducation,
  educationParam,
  benefitsReportSchema
};
