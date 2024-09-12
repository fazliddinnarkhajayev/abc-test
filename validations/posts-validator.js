const { body, param } = require('express-validator');

// Regular expression for Latin and Cyrillic letters in lowercase
const titleRegex = /^[a-zа-яё]+$/i;

const createValidation = [
  body('title')
    .notEmpty()
    .withMessage('title is required')
    .matches(titleRegex)
    .withMessage('Title must contain only Latin or Cyrillic letters in lowercase')
    .isLength({ min: 6, max: 999 })
    .withMessage('Title must be between 6 and 999 characters long'),
  body('content')
    .notEmpty()
    .withMessage('Content is required')
    .isLength({ max: 999 })
    .withMessage('Content must be maximum 999 characters long')
];

const updateValidation = [
    body('title')
      .notEmpty()
      .withMessage('title is required')
      .matches(titleRegex)
      .withMessage('Title must contain only Latin or Cyrillic letters in lowercase')
      .isLength({ min: 6, max: 999 })
      .withMessage('Title must be between 6 and 999 characters long'),
    body('content')
      .notEmpty()
      .withMessage('Content is required')
      .isLength({ max: 999 })
      .withMessage('Content must be less than 10_000 characters'),
    param('uuid')
      .notEmpty()
      .withMessage('Uuid is required')
      .isUUID()
      .withMessage('Uuid must be a valid UUID')
  ];

  const uuidParamValidation = [
    param('uuid')
     .notEmpty()
     .withMessage('Uuid is required')
     .isUUID()
     .withMessage('Uuid must be a valid UUID')
  ];

  const commentPostValidation = [
    body('content')
      .notEmpty()
      .withMessage('Content is required'),
    param('uuid')
      .notEmpty()
      .withMessage('Uuid is required')
      .isUUID()
      .withMessage('Uuid must be a valid UUID')
  ];

module.exports = {
  createValidation,
  updateValidation,
  uuidParamValidation,
  commentPostValidation
};
