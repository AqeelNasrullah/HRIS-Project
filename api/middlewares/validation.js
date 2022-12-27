//importing middleware
const asyncErrorHandler = require("./errors/asyncErrorHandler");

const validateData = (schema, objectType) => {
  return asyncErrorHandler(async (req, res, next) => {
    const data = req[objectType];
    await schema.validateAsync(data, { abortEarly: false });
    next();
  });
};

module.exports = { validateData };
