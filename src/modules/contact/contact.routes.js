const express = require('express');
const { body } = require('express-validator');
const contactController = require('./contact.controller');
const validate = require('../../shared/middleware/validate');

const router = express.Router();

const contactValidation = [
  body('name').trim().notEmpty().withMessage('Nome é obrigatório'),
  body('email').isEmail().normalizeEmail().withMessage('Email inválido'),
  body('subject').trim().notEmpty().withMessage('Assunto é obrigatório'),
  body('message').trim().isLength({ min: 10 }).withMessage('Mensagem deve ter no mínimo 10 caracteres'),
  validate
];

router.post('/send', contactValidation, contactController.send);

module.exports = router;
