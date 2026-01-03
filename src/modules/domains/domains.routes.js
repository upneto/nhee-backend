const express = require('express');
const router = express.Router();
const domainsController = require('./domains.controller');

// Rotas públicas - não requerem autenticação pois são dados de referência

/**
 * @route   GET /api/domains/knowledge-areas
 * @desc    Listar áreas do conhecimento ativas
 * @access  Public
 */
router.get('/knowledge-areas', domainsController.getKnowledgeAreas);

/**
 * @route   GET /api/domains/text-types
 * @desc    Listar tipos de texto ativos
 * @access  Public
 */
router.get('/text-types', domainsController.getTextTypes);

/**
 * @route   GET /api/domains/text-objectives
 * @desc    Listar objetivos de texto ativos
 * @access  Public
 */
router.get('/text-objectives', domainsController.getTextObjectives);

/**
 * @route   GET /api/domains/foundation-levels
 * @desc    Listar níveis de fundamentação ativos
 * @access  Public
 */
router.get('/foundation-levels', domainsController.getFoundationLevels);

/**
 * @route   GET /api/domains/question-types
 * @desc    Listar tipos de dúvida/contribuição ativos
 * @access  Public
 */
router.get('/question-types', domainsController.getQuestionTypes);

module.exports = router;
