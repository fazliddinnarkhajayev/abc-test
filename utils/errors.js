class AppError extends Error {
    constructor(message, statusCode) {
      super(message);
      this.statusCode = statusCode;
      this.isOperational = true;
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  class BadRequestError extends AppError {
    constructor(message) {
      super(message, 400);
    }
  }
  
  class InternalServerError extends AppError {
    constructor(message) {
      super(message, 500);
    }
  }

  class DatabaseError extends AppError {
    constructor(message) {
        super(message, 500);
    }
}

  
  // Add other custom errors as needed
  
  module.exports = {
    BadRequestError,
    InternalServerError,
    DatabaseError
  };
  