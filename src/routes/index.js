const express = require('express');
const router = express.Router();

const proveedorRoutes = require('./proveedor.routes');
const productoRoutes = require('./producto.routes');
const empleadoRoutes = require('./empleado.routes');
const muestraRoutes = require('./muestra.routes');
const resultadoRoutes = require('./resultado.routes');

router.use('/api/proveedores', proveedorRoutes);
router.use('/api/productos', productoRoutes);
router.use('/api/empleados', empleadoRoutes);
router.use('/api/muestras', muestraRoutes);
router.use('/api/resultados', resultadoRoutes);

module.exports = router;