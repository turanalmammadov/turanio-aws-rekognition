'use strict';

/**
 * Custom error classes for structured error handling across the API.
 * Each error carries a statusCode for automatic HTTP response mapping.
 */

class AppError extends Error {
  constructor(message, statusCode = 500, code = 'INTERNAL_ERROR') {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

class ValidationError extends AppError {
  constructor(message, field) {
    super(message, 400, 'VALIDATION_ERROR');
    this.field = field || null;
  }
}

class ImageFormatError extends AppError {
  constructor(message) {
    super(message, 415, 'UNSUPPORTED_MEDIA_TYPE');
  }
}

class RekognitionError extends AppError {
  constructor(message, awsErrorCode) {
    super(message, 502, 'AWS_REKOGNITION_ERROR');
    this.awsErrorCode = awsErrorCode || null;
  }
}

class NotFoundError extends AppError {
  constructor(message) {
    super(message || 'Resource not found', 404, 'NOT_FOUND');
  }
}

module.exports = {
  AppError,
  ValidationError,
  ImageFormatError,
  RekognitionError,
  NotFoundError,
};
