const pool = require('../db/connection');

const getAllEmpleados = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM empleado');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getEmpleadoById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM empleado WHERE id_empleado = $1', [id]);
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createEmpleado = async (req, res) => {
    try {
        const { cedula, nombre, cargo, contacto, estado } = req.body;
        const result = await pool.query(
            'INSERT INTO empleado (cedula, nombre, cargo, contacto, estado) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [cedula, nombre, cargo, contacto, estado]
        );
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateEmpleado = async (req, res) => {
    try {
        const { id } = req.params;
        const { cedula, nombre, cargo, contacto, estado } = req.body;
        const result = await pool.query(
            'UPDATE empleado SET cedula=$1, nombre=$2, cargo=$3, contacto=$4, estado=$5 WHERE id_empleado=$6 RETURNING *',
            [cedula, nombre, cargo, contacto, estado, id]
        );
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteEmpleado = async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM empleado WHERE id_empleado = $1', [id]);
        res.json({ message: 'Empleado eliminado' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getAllEmpleados, getEmpleadoById, createEmpleado, updateEmpleado, deleteEmpleado };