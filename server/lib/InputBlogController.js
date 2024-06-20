import { check, validationResult } from 'express-validator';
// Validation Middleware
const validateAddBlog = [
  check('title').notEmpty().withMessage('Title is required'),
  check('content').notEmpty().withMessage('Content is required'),
  check('tags').optional().isArray().withMessage('Tags should be an array'),
  check('category').notEmpty().withMessage('Category is required'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
// Update doğrulama middleware'i
// !bunların hepsi zorunlu alan olamaz kontrol et
export const validateUpdate = [
  check('title').optional().notEmpty().withMessage('Title cannot be empty'),
  check('content').optional().notEmpty().withMessage('Content cannot be empty'),
  check('tags').optional().isArray().withMessage('Tags should be an array'),
  check('newTags')
    .optional()
    .isArray()
    .withMessage('New tags should be an array'),
  check('category').optional().isString().withMessage('category is a string'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
export default validateAddBlog;
