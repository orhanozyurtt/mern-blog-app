// import { check, validationResult } from 'express-validator';
// // Validation Middleware
// const validateAddBlog = [
//   check('title').notEmpty().withMessage('Title is required'),
//   check('content').notEmpty().withMessage('Content is required'),
//   check('tags').optional().isArray().withMessage('Tags should be an array'),
//   check('category').notEmpty().withMessage('Category is required'),
//   check('publishDate').optional().isDate().withMessage('tarih hatası'),

//   (req, res, next) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }
//     next();
//   },
// ];
// // Update doğrulama middleware'i
// // !bunların hepsi zorunlu alan olamaz kontrol et
// export const validateUpdate = [
//   check('title').optional().notEmpty().withMessage('Title cannot be empty'),
//   check('content').optional().notEmpty().withMessage('Content cannot be empty'),
//   check('tags').optional().isArray().withMessage('Tags should be an array'),
//   check('newTags')
//     .optional()
//     .isArray()
//     .withMessage('New tags should be an array'),
//   check('category').optional().isString().withMessage('category is a string'),

//   (req, res, next) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }
//     next();
//   },
// ];
// export default validateAddBlog;
import { check, validationResult } from 'express-validator';

// Yardımcı Fonksiyon: isValidDate
const isValidDate = (value) => {
  const [day, month, year] = value.split('/');
  const date = new Date(`${year}-${month}-${day}`);
  return (
    !isNaN(date.getTime()) &&
    date.getDate() == day &&
    date.getMonth() + 1 == month &&
    date.getFullYear() == year
  );
};

// Validation Middleware
const validateAddBlog = [
  check('title').notEmpty().withMessage('Title is required'),
  check('content').notEmpty().withMessage('Content is required'),
  check('tags').optional().isArray().withMessage('Tags should be an array'),
  check('category').notEmpty().withMessage('Category is required'),
  check('isPublished')
    .optional()
    .isBoolean()
    .withMessage('isPublished must be boolean'),
  // check('publishDate')
  //   .optional()
  //   .custom(isValidDate)
  //   .withMessage('Invalid date format, use DD/MM/YYYY'),

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
  check('category').optional().isString().withMessage('Category is a string'),
  check('isPublished')
    .optional()
    .isBoolean()
    .withMessage('Published is a boolean'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

export default validateAddBlog;
