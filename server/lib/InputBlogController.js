import { check, validationResult } from 'express-validator';
// Validation Middleware
const validateAddBlog = [
  check('title').notEmpty().withMessage('Title is required'),
  check('content').notEmpty().withMessage('Content is required'),
  check('tags').optional().isArray().withMessage('Tags should be an array'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
// Update doğrulama middleware'i
export const validateUpdate = [
  check('title').optional().notEmpty().withMessage('Title cannot be empty'),
  check('content').optional().notEmpty().withMessage('Content cannot be empty'),
  check('tags').optional().isArray().withMessage('Tags should be an array'),
  check('newTags')
    .optional()
    .isArray()
    .withMessage('New tags should be an array'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
export default validateAddBlog;
