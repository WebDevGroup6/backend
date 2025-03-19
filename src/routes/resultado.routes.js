const express = require('express');
const router = express.Router();
const resultadoController = require('../controllers/resultado.controller');

router.get('/', resultadoController.getAllResultados);
router.get('/:id', resultadoController.getResultadoById);
router.post('/', resultadoController.createResultado);
router.put('/:id', resultadoController.updateResultado);
router.delete('/:id', resultadoController.deleteResultado);

module.exports = router;