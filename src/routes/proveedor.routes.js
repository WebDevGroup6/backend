const express = require('express');
const { getProveedores, createProveedor, deleteProveedor } = require('../controllers/proveedor.controller');

const router = express.Router();

router.get('/', getProveedores);
router.post('/', createProveedor);
router.delete('/:id', deleteProveedor);

module.exports = router;