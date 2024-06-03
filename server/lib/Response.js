import CustomError from '../lib/Error.js';
import { HTTP_CODES } from '../config/Enum.js';
import mongoose from 'mongoose';
class Response {
  constructor() {}

  static successResponse(data, message = 'ok', code = 200) {
    return {
      code,
      data,
      message,
    };
  }
  static errorResponse(error) {
    if (error instanceof CustomError) {
      return {
        code: error.code,
        error: {
          message: error.message,
          description: error.description,
        },
      };
    } else if (error.message.includes('E11000 ')) {
      return {
        code: HTTP_CODES.CONFLICT,
        error: {
          message: 'Already exists',
          description: 'Already exists',
        },
      };
    } else if (error instanceof mongoose.Error.CastError) {
      return {
        code: HTTP_CODES.BAD_REQUEST,
        error: {
          message: 'Invalid input',
          description:
            'One or more fields have invalid values. Please correct your input and try again.',
        },
      };
    } else if (
      error instanceof SyntaxError &&
      error.status === 400 &&
      'body' in error
    ) {
      return {
        code: HTTP_CODES.BAD_REQUEST,
        error: {
          message: 'Invalid JSON payload',
          description:
            'The request payload contains malformed JSON. Please check your input and try again.',
        },
      };
    }

    /*
    if (error instanceof mongoose.Error.CastError) {
        const customError = new CustomError(
          HTTP_CODES.BAD_REQUEST,
          'Invalid input',
          'One or more fields have invalid values. Please correct your input and try again.'
        );
    
    */
    return {
      code: HTTP_CODES.INT_SERVER_ERROR,
      error: {
        message: 'Unknown error',
        description: error.message,
      },
    };
  }
}

export default Response;
