const express = require('express');
const router = express.Router();
const pool = require('../db/connection');

// Obtener todos los empleados
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM empleado');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al obtener empleados' });
    }
});

module.exports = router;