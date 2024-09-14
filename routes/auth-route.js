const express = require('express');
const router = express.Router();

const controller = require('../controllers/auth-controller.js');
const { registerValidation, loginValidation } = require('../validations/auth-validator.js');

router.post('/auth/register', registerValidation, controller.register);
router.post('/auth/login', loginValidation, controller.login);

module.exports = router;
