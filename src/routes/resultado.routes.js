const express = require('express');
const router = express.Router();
const { getAllResultados } = require('../controllers/resultado.controller');

router.get('/', getAllResultados); 

module.exports = router;