const userModel = require('../models/user-model.js');
const postModel = require('../models/post-model.js');
const { BadRequestError } = require('../utils/errors.js');
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

    const isCreated = await postModel.create(title, content, userUuid);
    if(!isCreated) {
      throw new BadRequestError('Failed to create post');
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

     const postExists = await postModel.postExists(uuid, userUuid);
    if (!postExists) {
      throw new BadRequestError('Post not found');
    }

    const isUpdated = await postModel.update(title, content, new Date(), uuid, userUuid);
    if(!isUpdated) {
      throw new BadRequestError('Failed to update post');
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

    const postExists = await postModel.postExists(uuid, userUuid);
    if (!postExists) {
      throw new BadRequestError('Post not found');
    }

    const isDeleted = await postModel.delete(uuid, userUuid);
    if(!isDeleted) {
      throw new BadRequestError('Failed to delete post');
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

    const post = await postModel.findOneByUuid(uuid);
    if (!post) {
      throw new BadRequestError('Post not found');
    }

    if(post.userUuid == userUuid) {
      throw new BadRequestError('Cannot like your own post');
    }

    const isAlreadyLiked = await postModel.isAlreadyLiked(uuid, userUuid);
    if(isAlreadyLiked) {
      throw new BadRequestError('Post already liked');
    }

    const isLiked = await postModel.createLike(uuid, userUuid);
    if(!isLiked) {
      throw new BadRequestError('Failed to like post');
    }
    res.status(200).json({
      status: 'success',
      message: 'Post liked successfully',
    });
  } catch (error) {
    next(error); // Pass the error to the error handler 
  }
};