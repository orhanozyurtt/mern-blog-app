import { rateLimit } from 'express-rate-limit';
import Response from '../lib/Response.js';

const createRateLimiter = (maxRequests, windowMs) => {
  return rateLimit({
    windowMs: windowMs || 15 * 60 * 1000, // Default: 15 minutes
    max: maxRequests,
    standardHeaders: true, // Sends the `RateLimit-*` headers.
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
    message: {
      status: 429,
      message: 'Too many requests, please try again later.',
    },
    handler: (req, res, next, options) => {
      res.status(options.statusCode).json(
        Response.errorResponse({
          status: options.statusCode,
          message: options.message.message,
        })
      );
    },
  });
};

export default createRateLimiter;
