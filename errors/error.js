// src/exceptions/CustomError.js
class CustomError extends Error {
  constructor(message, statusCode = 500, code = null, details = null) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.timestamp = new Date().toISOString();
    Error.captureStackTrace(this, this.constructor);
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      statusCode: this.statusCode,
      code: this.code,
      details: this.details,
      timestamp: this.timestamp
    };
  }
}

// src/exceptions/ValidationError.js
class ValidationError extends CustomError {
  constructor(message, details = null) {
    super(message, 400, 'VALIDATION_ERROR', details);
  }
}

// src/exceptions/NotFoundError.js
class NotFoundError extends CustomError {
  constructor(resource = 'Resource') {
    super(`${resource} not found`, 404, 'NOT_FOUND');
  }
}

// src/exceptions/UnauthorizedError.js
class UnauthorizedError extends CustomError {
  constructor(message = 'Unauthorized access') {
    super(message, 401, 'UNAUTHORIZED');
  }
}

// src/exceptions/ForbiddenError.js
class ForbiddenError extends CustomError {
  constructor(message = 'Forbidden access') {
    super(message, 403, 'FORBIDDEN');
  }
}

// src/exceptions/DatabaseError.js
class DatabaseError extends CustomError {
  constructor(message, originalError = null) {
    super(message, 500, 'DATABASE_ERROR', originalError?.message);
    this.originalError = originalError;
  }
}

// src/exceptions/BusinessLogicError.js
class BusinessLogicError extends CustomError {
  constructor(message, code = 'BUSINESS_LOGIC_ERROR') {
    super(message, 422, code);
  }
}

// src/exceptions/index.js
module.exports = {
  CustomError,
  ValidationError,
  NotFoundError,
  UnauthorizedError,
  ForbiddenError,
  DatabaseError,
  BusinessLogicError
};