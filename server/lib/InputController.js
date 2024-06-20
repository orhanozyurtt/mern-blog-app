import { validationResult } from 'express-validator';
import { check } from 'express-validator';

export const controller = [
  check('name').notEmpty().withMessage('Name is required'),
  check('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Email must be a valid email address'),
  check('password')
    .notEmpty()
    .withMessage('Password is required')
    .isStrongPassword({ minLength: 6 })
    .withMessage(
      'Password must be at least 6 characters long and include one uppercase letter, one lowercase letter, one number, and one symbol'
    ),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// Create validators for the user update
export const updateController = [
  // Check if 'name' is provided and not empty
  check('name').optional().notEmpty().withMessage('Name cannot be empty'),

  // Check if 'email' is provided and is a valid email address
  check('email')
    .optional()
    .notEmpty()
    .withMessage('Email cannot be empty')
    .isEmail()
    .withMessage('Email must be a valid email address'),

  // Check if 'password' is provided and meets the strong password criteria
  check('password')
    .optional()
    .notEmpty()
    .withMessage('Password cannot be empty')
    .isStrongPassword({ minLength: 6 })
    .withMessage(
      'Password must be at least 6 characters long and include one uppercase letter, one lowercase letter, one number, and one symbol'
    ),

  // Middleware to handle validation errors
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
