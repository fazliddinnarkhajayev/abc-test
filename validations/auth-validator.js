const { body } = require('express-validator');

// Regular expression for Latin and Cyrillic letters in lowercase
const fullNameRegex = /^[a-zа-яё ]*$/;

const registerValidation = [
  body('fullName')
    .notEmpty()
    .withMessage('Full name is required')
    .matches(fullNameRegex)
    .withMessage('Full name must contain only Latin or Cyrillic letters in lowercase')
    .isLength({ min: 6, max: 999 })
    .withMessage('Full name must be between 6 and 999 characters long'),
  body('email')
    .isEmail()
    .withMessage('Invalid email format')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

const loginValidation = [
    body('username')
      .notEmpty()
      .withMessage('Useranme is required')
      .isLength({ min: 6, max: 999 })
      .withMessage('Username must be at least 6 characters long'),
    body('password')
      .notEmpty()
      .withMessage('Password is required')
  ];

module.exports = {
  registerValidation,
  loginValidation
};
