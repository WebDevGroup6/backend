
const express = require('express');
const router = express.Router();
const { getAllMuestras } = require('../controllers/muestra.controller');

router.get('/', getAllMuestras); 

module.exports = router;