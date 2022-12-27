const sendResponse = (data, statusCode, res) => {
  res.status(statusCode).json({
    success: true,
    data: data,
  });
};

module.exports = sendResponse;
