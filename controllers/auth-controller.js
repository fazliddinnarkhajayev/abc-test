const bcrypt = require('bcryptjs');
const userModel = require('../models/user-model.js');
const { BadRequestError } = require('../utils/errors.js');
const { generateToken } = require('../utils/helper.js');
const { validationResult } = require('express-validator');
const { ErrorMessages } = require('../utils/error-messages.js');
exports.register = async (req, res, next) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 'error',
      errors: errors.array(),
    });
  }

  const { fullName, email, password } = req.body;

  try {
    const userExists = await userModel.userExists(email);
    if (userExists) {
      throw new BadRequestError(ErrorMessages.UserExists);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await userModel.create(fullName, email, hashedPassword);

    res.status(201).json({
      status: 'success',
      message: 'User registered.',
    });
  } catch (error) {
    next(error); // Pass the error to the error handler
  }
};

exports.login = async (req, res, next) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 'error',
      errors: errors.array(),
    });
  }
  
  const { username, password } = req.body;

  try {
    const user = await userModel.findOneByEmail(username);
    if (!user) {
      throw new BadRequestError(ErrorMessages.InvalidCredentials);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new BadRequestError(ErrorMessages.InvalidCredentials);
    }

    const token = generateToken(user.uuid);

    res.json({
      status: 'success',
      token,
    });
  } catch (error) {
    next(error); // Pass the error to the error handler
  }
};
