const userModel = require('../models/user-model.js');
const publicationModel = require('../models/publication-model.js');
const { BadRequestError, NoContentError } = require('../utils/errors.js');
const { validationResult } = require('express-validator');


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
      throw new BadRequestError('unverifiedUserCannotCreatePost');
    }

    const isCreated = await publicationModel.create(title, content, userUuid);
    if(!isCreated) {
      throw new BadRequestError('Failed to create publication');
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
      throw new BadRequestError('Post not found');
    }

    const isUpdated = await publicationModel.update(title, content, new Date(), uuid, userUuid);
    if(!isUpdated) {
      throw new BadRequestError('Failed to update publication');
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
      throw new BadRequestError('Post not found');
    }

    const isDeleted = await publicationModel.delete(uuid, userUuid);
    if(!isDeleted) {
      throw new BadRequestError('Failed to delete publication');
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
      throw new BadRequestError('Post not found');
    }

    if(publication.userUuid == userUuid) {
      throw new BadRequestError('Cannot like your own publication');
    }

    const isAlreadyLiked = await publicationModel.isAlreadyLiked(uuid, userUuid);
    if(isAlreadyLiked) {
      throw new BadRequestError('Post already liked');
    }

    const isLiked = await publicationModel.createLike(uuid, userUuid);
    if(!isLiked) {
      throw new BadRequestError('Failed to like publication');
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

    const publications = await publicationModel.findAll();
    if(!publications.length) {
      throw new NoContentError('No publications found');
    }

    res.status(200).json({
      status: 'success',
      data: publications,
    });
  } catch (error) {
    next(error); // Pass the error to the error handler
  }
}