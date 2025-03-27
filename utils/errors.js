class CustomError extends Error {
    constructor(message, statusCode) {
      super(message);
      this.statusCode = statusCode;
      this.name = this.constructor.name;
      Error.captureStackTrace(this, this.constructor);
    }
  }

  class ValidationError extends CustomError {
    constructor(message) {
      super(message, 400);
    }
  }

  class ForbiddenError extends CustomError {
    constructor(message) {
      super(message, 403);
    }
  }

  class NotFoundError extends CustomError {
    constructor(message) {
      super(message, 404);
    }
  }

  module.exports = {
    CustomError,
    ValidationError,
    ForbiddenError,
    NotFoundError
  };
