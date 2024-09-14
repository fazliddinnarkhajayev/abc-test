const express = require('express');
const router = express.Router();

const { commentPostValidation } = require('../validations/comments-validator.js');
const controller = require('../controllers/comments-controller.js');


router.post('/comment/:publicationUUid', commentPostValidation, controller.createComment);
router.delete('/comment/:publicationUUid/:commentUuid',  controller.deleteComment);
router.get('/comments', controller.getAll);

module.exports = router;
