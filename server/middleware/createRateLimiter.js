import { rateLimit } from 'express-rate-limit';

const createRateLimiter = (maxRequests, windowMs) => {
  return rateLimit({
    windowMs: windowMs || 15 * 60 * 1000, // Default: 15 minutes
    max: maxRequests,
    standardHeaders: true, // Sends the `RateLimit-*` headers.
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  });
};

export default createRateLimiter;
