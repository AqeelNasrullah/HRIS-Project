const joi = require("joi");

const createSchema = joi.object({
    department:joi.string().trim().regex((/^[A-Za-z ]+$/)).required(),
    jobTitle:joi.string().trim().regex((/^[A-Za-z ]+$/)).required()
});

const updateSchema = joi.object({
    department:joi.string().trim().regex((/^[A-Za-z ]+$/)),
    jobTitle:joi.string().trim().regex((/^[A-Za-z ]+$/))
});

module.exports = {createSchema,updateSchema};