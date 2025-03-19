const express = require('express');
const router = express.Router();
const muestraController = require('../controllers/muestra.controller');

// Obtener todas las muestras
router.get('/', muestraController.getAllMuestras);

// Obtener una muestra por ID
router.get('/:id', muestraController.getMuestraById);

// Crear una nueva muestra
router.post('/', muestraController.createMuestra);

// Actualizar una muestra por ID
router.put('/:id', muestraController.updateMuestra);

// Eliminar una muestra por ID
router.delete('/:id', muestraController.deleteMuestra);

module.exports = router;