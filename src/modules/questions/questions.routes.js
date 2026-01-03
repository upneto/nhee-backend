const express = require('express');
const { body } = require('express-validator');
const questionsController = require('./questions.controller');
const validate = require('../../shared/middleware/validate');
const authMiddleware = require('../../shared/middleware/auth');

const router = express.Router();

const createValidation = [
  body('title').trim().isLength({ min: 10, max: 255 }).withMessage('Título deve ter entre 10 e 255 caracteres'),
  body('content').trim().isLength({ min: 100 }).withMessage('Conteúdo deve ter no mínimo 100 caracteres'),
  body('type').trim().notEmpty().withMessage('Tipo é obrigatório'),
  validate
];

router.get('/texts/:textId/questions', questionsController.list);
router.post('/texts/:textId/questions', authMiddleware, createValidation, questionsController.create);
router.delete('/texts/:textId/questions/:id', authMiddleware, questionsController.delete);

module.exports = router;
