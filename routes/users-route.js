const express = require('express');
const router = express.Router();

const { sendCodeValidation, verifyEmailValidation, updateValidation } = require('../validations/users-validator.js');
const controller = require('../controllers/users-controller.js');

router.put('/users/:uuid', updateValidation, controller.update);
router.post('/users/send-verification-code', sendCodeValidation, controller.sendVerificationCode);
router.post('/users/verify-email', verifyEmailValidation, controller.verifyEmail);

router.get('/users/all', controller.getAllUsers);

module.exports = router;
