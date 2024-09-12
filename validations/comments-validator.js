const { body, param } = require('express-validator');

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
  commentPostValidation
};
