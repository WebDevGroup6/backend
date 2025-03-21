const express = require('express');
const router = express.Router();
const proveedorController = require('../controllers/proveedor.controller'); // Asegúrate de que este archivo existe

router.get('/', proveedorController.getAllProveedores);
router.get('/:id', proveedorController.getProveedorById);
router.post('/', proveedorController.createProveedor);
router.put('/:id', proveedorController.updateProveedor);
router.delete('/:id', proveedorController.deleteProveedor);

module.exports = router;