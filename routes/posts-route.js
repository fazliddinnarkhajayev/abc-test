const express = require('express');
const router = express.Router();

const { createValidation, updateValidation, uuidParamValidation } = require('../validations/posts-validator.js');
const controller = require('../controllers/posts-controller.js');

router.post('/posts', createValidation, controller.create);
router.put('/posts/:uuid', updateValidation, controller.update);
router.delete('/posts/:uuid', uuidParamValidation, controller.delete);

router.post('/posts/like/:uuid', uuidParamValidation, controller.createLike);



module.exports = router;
