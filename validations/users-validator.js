const { body, param } = require('express-validator');

// Regular expression for Latin and Cyrillic letters in lowercase
const fullNameRegex = /^[a-zа-яё ]*$/;


const updateValidation = [
  body('fullName')
    .notEmpty()
    .withMessage('Full name is required')
    .matches(fullNameRegex)
    .withMessage('Full name must contain only Latin or Cyrillic letters in lowercase')
    .isLength({ min: 6, max: 999 })
    .withMessage('Full name must be between 6 and 999 characters long'),  // Updated message
  body('email')
    .isEmail()
    .withMessage('Invalid email format')
    .normalizeEmail(),
  param('uuid')
    .notEmpty()
    .withMessage('Uuid is required')
    .isUUID()
    .withMessage('Uuid must be a valid UUID')
];

const verifyEmailValidation = [
    body('email')
      .notEmpty()
      .withMessage('email is required')
      .isEmail()
      .withMessage('Invalid email format'),
    body('code')
      .notEmpty()
      .withMessage('code is required')
  ];

const sendCodeValidation = [
  body('email')
    .notEmpty()
    .withMessage('email is required')
    .isEmail()
    .withMessage('Invalid email format')
];

module.exports = {
  sendCodeValidation,
  verifyEmailValidation,
  updateValidation
};
