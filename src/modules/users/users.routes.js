const express = require('express');
const { body } = require('express-validator');
const usersController = require('./users.controller');
const validate = require('../../shared/middleware/validate');
const authMiddleware = require('../../shared/middleware/auth');

const router = express.Router();

router.get('/profile', authMiddleware, usersController.getProfile);
router.put('/profile', authMiddleware, usersController.updateProfile);
router.post('/change-password', authMiddleware, [
  body('oldPassword').notEmpty().withMessage('Senha atual é obrigatória'),
  body('newPassword').isLength({ min: 6 }).withMessage('Nova senha deve ter no mínimo 6 caracteres'),
  validate
], usersController.changePassword);

module.exports = router;
