const userModel = require('../models/user-model.js');
const publicationModel = require('../models/publication-model.js');
const { BadRequestError, NoContentError, InternalServerError, NotFoundError } = require('../utils/errors.js');
const { validationResult } = require('express-validator');
const { ErrorMessages } = require('../utils/error-messages.js');

exports.create = async (req, res, next) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {  
    return res.status(400).json({
      status: 'error',
      errors: errors.array(),
    });
  }
  
  const { title, content } = req.body;
  const userUuid = req.user.userUuid;
  
  try {
    const user = await userModel.findOneByUuid(userUuid);
    if(!user.isVerified) { 
      throw new BadRequestError(ErrorMessages.UnverifiedUser);
    }

    const isCreated = await publicationModel.create(title, content, userUuid);
    if(!isCreated) {
      throw new InternalServerError(ErrorMessages.FailedToCreate);
    }

    res.status(201).json({
      status: 'success',
      message: 'Post created successfully',
    });
  } catch (error) {
    next(error); // Pass the error to the error handler
  }
};

exports.update = async (req, res, next) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 'error',
      errors: errors.array(),
    });
  }

  const { title, content } = req.body;
  const uuid = req.params.uuid;
  const userUuid = req.user.userUuid;

  try {

     const postExists = await publicationModel.postExists(uuid, userUuid);
    if (!postExists) {
      throw new NotFoundError(ErrorMessages.NotFound);
    }

    const isUpdated = await publicationModel.update(title, content, new Date(), uuid, userUuid);
    if(!isUpdated) {
      throw new InternalServerError(ErrorMessages.FailedToUpdate);
    }

    res.status(200).json({
      status: 'success',
      message: 'Post updated successfully',
    });
  } catch (error) {
    next(error); // Pass the error to the error handler
  }
};

exports.delete = async (req, res, next) => {
  const uuid = req.params.uuid;
  const userUuid = req.user.userUuid;

  try {

    const postExists = await publicationModel.postExists(uuid, userUuid);
    if (!postExists) {
      throw new NotFoundError(ErrorMessages.NotFound);
    }

    const isDeleted = await publicationModel.delete(uuid, userUuid);
    if(!isDeleted) {
      throw new InternalServerError(ErrorMessages.FailedToDelete);
    }

    res.status(200).json({
      status: 'success',
      message: 'Post deleted successfully',
    });
  } catch (error) {
    next(error); // Pass the error to the error handler
  }
};

exports.createLike = async (req, res, next) => {
  const uuid = req.params.uuid;
  const userUuid = req.user.userUuid;
  try {

    const publication = await publicationModel.findOneByUuid(uuid);
    if (!publication) {
      throw new NotFoundError(ErrorMessages.NotFound);
    }

    if(publication.userUuid == userUuid) {
      throw new BadRequestError(ErrorMessages.SelfLike);
    }

    const isAlreadyLiked = await publicationModel.isAlreadyLiked(uuid, userUuid);
    if(isAlreadyLiked) {
      throw new BadRequestError(ErrorMessages.AlreadyLiked);
    }

    const isLiked = await publicationModel.createLike(uuid, userUuid);
    if(!isLiked) {
      throw new InternalServerError(ErrorMessages.FailedToLike);
    }
    res.status(200).json({
      status: 'success',
      message: 'Post liked successfully',
    });
  } catch (error) {
    next(error); // Pass the error to the error handler 
  }
};

exports.getAll = async (req, res, next) => {
  try {
    let { pageSize, pageIndex } = req.query;
    pageSize = +pageSize || 10;
    pageIndex = +pageIndex || 0;

    const publications = await publicationModel.findAll(pageSize, pageIndex);
    if(!publications.success) {
      throw new NoContentError(ErrorMessages.NoContent);
    }

    res.status(200).json({
      status: 'success',
      data: { content: publications.data, totalItemsCount: publications.totalCount, pageSize, pageIndex }
    });
  } catch (error) {
    next(error); // Pass the error to the error handler
  }
}

exports.getOne = async (req, res, next) => {
  try {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        errors: errors.array(),
      });
    }

    let { uuid } = req.query;

    const publication = await publicationModel.findOne(uuid);
    if(!publication) {
      throw new NoContentError(ErrorMessages.NoContent);
    }

    res.status(200).json({
      status: 'success',
      data: publication
    });
  } catch (error) {
    next(error); // Pass the error to the error handler
  }
}