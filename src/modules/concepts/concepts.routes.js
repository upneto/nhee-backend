const express = require('express');
const conceptsController = require('./concepts.controller');

const router = express.Router();

router.get('/', conceptsController.list);
router.get('/map', conceptsController.getMap);

module.exports = router;
