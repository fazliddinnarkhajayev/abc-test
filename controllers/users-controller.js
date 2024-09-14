const userModel = require('../models/user-model.js');
const { BadRequestError, NoContentError, NotFoundError, InternalServerError } = require('../utils/errors.js');
const { validationResult } = require('express-validator');
const { generateVerificationCode, generateCodeVerificationExpDateTime, isCodeExpired } = require('../utils/helper.js');
const { sendMail } = require('../services/mail.service.js');
const { ErrorMessages } = require('../utils/error-messages.js');

exports.update = async (req, res, next) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 'error',
      errors: errors.array(),
    });
  }

  const { fullName, email } = req.body;
  const uuid = req.params.uuid;

  try {
    const user = await userModel.findOneByUuid(uuid);
    if (!user) {
      throw new NotFoundError(ErrorMessages.NotFound);
    }

    const isUpdated = await userModel.update(fullName, email, new Date(), uuid);
    if(!isUpdated) {
      throw new InternalServerError(ErrorMessages.FailedToUpdate);
    }

    res.status(200).json({
      status: 'success',
      message: 'User updated successfully',
    });
  } catch (error) {
    next(error); // Pass the error to the error handler
  }
};

exports.sendVerificationCode = async (req, res, next) => {
  // Validate request body
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 'error',
      errors: errors.array(),
    });
  }

  const { email } = req.body;

  try {
       
    const user = await userModel.findOneByEmail(email);
    if (!user) {
      throw new NotFoundError(ErrorMessages.NotFound);
    }

    if (user.isVerified) {
      throw new BadRequestError(ErrorMessages.AlreadyVerified);
    }

    const verificationCode = generateVerificationCode();
    const expDateTime = generateCodeVerificationExpDateTime();

    const isSet = await userModel.setVerificationCodeWithExpDateTime(user?.uuid, verificationCode, expDateTime);

    if (!isSet) {
      throw new InternalServerError(ErrorMessages.FaliedToSendVerificationCode);
    }

    // Send verification code to user's email
    await sendMail(email, 'Verification code', `Your verification code is: ${verificationCode}`);

    res.status(200).json({
      status: 'success',
      message: 'Verification code sent',
    });
  } catch (error) {
    next(error); // Pass the error to the error handler 
  }
};

exports.verifyEmail = async (req, res, next) => {
  // Validate request body
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 'error',
      errors: errors.array(),
    });
  }

  const { code, email } = req.body;

  try {

    const user = await userModel.findOneByEmail(email);
    if (!user) {
      throw new NotFoundError(ErrorMessages.NotFound);
    }
    if(+user.verificationCode !== +code) {
      throw new BadRequestError(ErrorMessages.InvalidVerificationCode);
    } 
    const isExpired = isCodeExpired(user.codeExpDateTime);
    if(isExpired) {
      throw new BadRequestError(ErrorMessages.VerificationCodeExpired);
    }

    const isVerified = await userModel.verifyUserEmail(email);
    if (!isVerified) {
      throw new InternalServerError(ErrorMessages.FailedToVerifyEmail);
    }

    res.status(200).json({
      status: 'success',
      message: 'Email verified successfully',
    });
  } catch (error) {
    next(error); // Pass the error to the error handler
  }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    let { pageSize, pageIndex } = req.query;
    pageSize = +pageSize || 10;
    pageIndex = +pageIndex || 0;
    
    const users = await userModel.findAll(pageSize, pageIndex);

    if(!users.success) {
      throw new NoContentError(ErrorMessages.NoContent);
    }
    
    res.status(200).json({
      status: 'success',
      data: { content: users.data, totalItemsCount: users.totalCount, pageSize, pageIndex },
    });

  } catch (error) {
    next(error); // Pass the error to the error handler
  }
}