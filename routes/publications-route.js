const express = require('express');
const router = express.Router();

const { createValidation, updateValidation, uuidParamValidation } = require('../validations/publications-validator.js');
const controller = require('../controllers/publications-controller.js');

router.post('/publications', createValidation, controller.create);
router.put('/publications/:uuid', updateValidation, controller.update);
router.delete('/publications/:uuid', uuidParamValidation, controller.delete);
router.get('/publications', controller.getAll);

router.post('/publications/like/:uuid', uuidParamValidation, controller.createLike);



module.exports = router;
