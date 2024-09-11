// middleware/errorHandler.js
const { BadRequestError, InternalServerError, DatabaseError } = require('../utils/errors');

const errorHandler = (err, req, res, next) => {
  if (err instanceof BadRequestError) {
    res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  } else if (err instanceof InternalServerError) {
    res.status(err.statusCode).json({
      status: 'error',
      message: 'Internal server error',
    });
  } else if (err instanceof DatabaseError) {
    console.error('Database error:', err.message);
    res.status(err.statusCode).json({
        status: 'error',
        message: err.message,
    });
  } else {
    // For unknown errors
    console.error('Unexpected error:', err);
    res.status(500).json({
      status: 'error',
      message: 'An unexpected error occurred',
    });
  }
};

module.exports = errorHandler;
