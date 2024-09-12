const userModel = require('../models/user-model.js');
const commentModel = require('../models/comment-model.js');
const { BadRequestError } = require('../utils/errors.js');
const { validationResult } = require('express-validator');


exports.createComment = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 'error',
      errors: errors.array(),
    });
  }
  const { content } = req.body;
  const userUuid = req.user.userUuid;
  const postUuid = req.params.postUuid;

  try {

    const user = await userModel.findOneByUuid(userUuid);
    if(!user.isVerified) {
      throw new BadRequestError('unverifiedUserCannotCreateComment');
    }

    const post = await postModel.findOneByUuid(postUuid);
    if (!post) {
      throw new BadRequestError('Post not found');
    }
    const isCreated = await commentModel.createComment(content, userUuid, postUuid);
    if(!isCreated) {
      throw new BadRequestError('Failed to create comment');
    }
    res.status(201).json({
      status: 'success',
      message: 'Comment created successfully',
    });
  } catch (error) {
    next(error); // Pass the error to the error handler
  }
};

exports.deleteComment = async (req, res, next) => {
  const commentUuid = req.params.commentUuid;
  const postUuid = req.params.postUuid;

  try {
    // check if desired comment exists
    const comment = await commentModel.commentExists(commentUuid, postUuid);
    if (!comment) {
      throw new BadRequestError('Comment not found');
    }

    const isDeleted = await commentModel.deleteComment(commentUuid);
    if(!isDeleted) {
      throw new BadRequestError('Failed to delete comment');
    }
    res.status(200).json({
      status: 'success',
      message: 'Comment deleted successfully',
    });
  } catch (error) {
    next(error); // Pass the error to the error handler
  }
};
