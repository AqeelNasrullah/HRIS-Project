const joi = require("joi");
const { TIMEOFF_CATEGORY } = require("../../config/constants");

const createSchema = joi.object({
    startTime:joi.date().required(),
    endTime:joi.date().required(),
    category:joi.string().valid(...TIMEOFF_CATEGORY).required(),
    hour:joi.number().integer().min(1).max(72).required(),
    employeeId:joi.string(),
    note:joi.string().trim()
});

const updateSchema = joi.object({
    startTime:joi.date(),
    endTime:joi.date(),
    category:joi.string().valid(...TIMEOFF_CATEGORY),
    hour:joi.number().integer().min(1).max(72),
    employeeId:joi.string(),
    note:joi.string().trim()
});

module.exports = {createSchema,updateSchema};