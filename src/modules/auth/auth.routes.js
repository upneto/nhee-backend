const express = require('express');
const { body } = require('express-validator');
const authController = require('./auth.controller');
const validate = require('../../shared/middleware/validate');
const authMiddleware = require('../../shared/middleware/auth');

const router = express.Router();

// Validações
const registerValidation = [
  body('username').trim().isLength({ min: 3, max: 50 }).withMessage('Username deve ter entre 3 e 50 caracteres'),
  body('email').isEmail().normalizeEmail().withMessage('Email inválido'),
  body('password').isLength({ min: 6 }).withMessage('Senha deve ter no mínimo 6 caracteres'),
  body('name').trim().isLength({ min: 3 }).withMessage('Nome deve ter no mínimo 3 caracteres'),
  validate
];

const loginValidation = [
  body('username').trim().notEmpty().withMessage('Username é obrigatório'),
  body('password').notEmpty().withMessage('Senha é obrigatória'),
  validate
];

const forgotPasswordValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Email inválido'),
  validate
];

// Rotas
router.post('/register', registerValidation, authController.register);
router.post('/login', loginValidation, authController.login);
router.post('/logout', authMiddleware, authController.logout);
router.post('/forgot-password', forgotPasswordValidation, authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.get('/validate-token', authMiddleware, authController.validateToken);

module.exports = router;
