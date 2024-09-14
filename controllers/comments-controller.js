const userModel = require('../models/user-model.js');
const commentModel = require('../models/comment-model.js');
const publicationModel = require('../models/publication-model.js');
const { BadRequestError, NoContentError } = require('../utils/errors.js');
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
  const publicationUUid = req.params.publicationUUid;

  try {

    const user = await userModel.findOneByUuid(userUuid);
    if(!user.isVerified) {
      throw new BadRequestError('unverifiedUserCannotCreateComment');
    }

    const publication = await publicationModel.findOneByUuid(publicationUUid);
    if (!publication) {
      throw new BadRequestError('Post not found');
    }
    const isCreated = await commentModel.createComment(content, userUuid, publicationUUid);
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
  const publicationUUid = req.params.publicationUUid;

  try {
    // check if desired comment exists
    const comment = await commentModel.commentExists(commentUuid, publicationUUid);
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

exports.getAll = async (req, res, next) => {
  try {
    let { pageSize, pageIndex } = req.query;
    pageSize = +pageSize || 10;
    pageIndex = +pageIndex || 0;

    const comments = await commentModel.findAll(pageSize, pageIndex);
    if(!comments.success) {
      throw new NoContentError('No comments found');
    }

    res.status(200).json({
      status: 'success',
      data: { content: comments.data, totalItemsCount: comments.totalCount, pageSize, pageIndex }
    });
  } catch (error) {
    next(error); // Pass the error to the error handler
  }
}