const { errorResponse } = require('../responses');
const { BaseError } = require('../errors');

const errorHandler = (err, req, res, next) => {
  let error = err;

  console.error(err);

  if (!(error instanceof BaseError)) {
    if (err.name === 'CastError') {
      error = { message: `Resource not found with id of ${err.value}`, statusCode: 404, name: 'NotFoundError' };
    } else if (err.code === 11000) {
      error = { message: 'Duplicate field value entered', statusCode: 400, name: 'ValidationError' };
    } else if (err.name === 'ValidationError') {
      const message = Object.values(err.errors).map((val) => val.message).join(', ');
      error = { message, statusCode: 400, name: 'ValidationError' };
    } else if (err.name === 'JsonWebTokenError') {
      error = { message: 'Invalid token. Please log in again.', statusCode: 401, name: 'UnauthorizedError' };
    } else if (err.name === 'TokenExpiredError') {
      error = { message: 'Token expired. Please log in again.', statusCode: 401, name: 'UnauthorizedError' };
    } else if (err.name === 'MulterError') {
      let message = err.message || 'File upload error';
      if (err.code === 'LIMIT_FILE_SIZE') {
        message = 'File too large. Maximum allowed size is 10 MB per image.';
      }
      error = { message, statusCode: 400, name: 'ValidationError' };
    } else if (err.message && err.message.toLowerCase().includes('unknown file format')) {
      error = { message: 'Unsupported file format. Please upload valid images (JPG, PNG, WebP) or documents (PDF).', statusCode: 400, name: 'ValidationError' };
    } else if (err.name === 'TimeoutError' || err.http_code === 499) {
      error = { message: 'Image upload timed out. Please try again with smaller images or check your internet connection.', statusCode: 408, name: 'TimeoutError' };
    }
  }

  return errorResponse(res, error);
};

module.exports = errorHandler;
