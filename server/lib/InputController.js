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
];
/*
import { validationResult } from 'express-validator';

export const controller = [
  // Name validation
  check('name').trim().notEmpty().withMessage('Name is required'),

  // Email validation
  check('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Email must be a valid email address'),

  // Password validation
  check('password')
    .trim()
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
    .withMessage('Password must include at least one uppercase letter, one lowercase letter, one number, and one symbol')
];

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

*/
