const express = require('express');
const { body, query } = require('express-validator');
const textsController = require('./texts.controller');
const questionsController = require('../questions/questions.controller');
const validate = require('../../shared/middleware/validate');
const authMiddleware = require('../../shared/middleware/auth');

const router = express.Router();

// Validações
const createTextValidation = [
  body('title').trim().isLength({ min: 10, max: 255 }).withMessage('Título deve ter entre 10 e 255 caracteres'),
  body('content').trim().isLength({ min: 200 }).withMessage('Conteúdo deve ter no mínimo 200 caracteres'),
  body('area').trim().notEmpty().withMessage('Área do conhecimento é obrigatória'),
  body('author').trim().notEmpty().withMessage('Autor é obrigatório'),
  validate
];

// Rotas públicas
router.get('/', textsController.list);
router.get('/:id', textsController.get);

// Rotas autenticadas
router.post('/', authMiddleware, createTextValidation, textsController.create);
router.put('/:id', authMiddleware, createTextValidation, textsController.update);
router.delete('/:id', authMiddleware, textsController.delete);
router.get('/my-texts', authMiddleware, textsController.getMyTexts);
router.post('/:id/evaluate', authMiddleware, [
  body('rating').isInt({ min: 1, max: 10 }).withMessage('Nota deve ser entre 1 e 10'),
  validate
], textsController.evaluate);

// Rotas de questões (sub-recurso de texts)
router.get('/:textId/questions', questionsController.list);
router.post('/:textId/questions', authMiddleware, [
  body('type').trim().notEmpty().withMessage('Tipo de contribuição é obrigatório'),
  body('content').trim().isLength({ min: 10 }).withMessage('Conteúdo deve ter no mínimo 10 caracteres'),
  validate
], questionsController.create);
router.delete('/:textId/questions/:id', authMiddleware, questionsController.delete);

module.exports = router;
