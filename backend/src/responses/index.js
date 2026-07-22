const successResponse = (res, data = null, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    error: null,
  });
};

const errorResponse = (res, error) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal Server Error';

  return res.status(statusCode).json({
    success: false,
    message,
    data: null,
    error: {
      name: error.name || 'Error',
      details: error.details || null,
    },
  });
};

module.exports = {
  successResponse,
  errorResponse,
};
