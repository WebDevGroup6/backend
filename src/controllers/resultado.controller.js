const pool = require('../db/connection');

const getAllResultados = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM resultados');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getResultadoById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM resultados WHERE id_resultado = $1', [id]);
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createResultado = async (req, res) => {
    try {
        const { id_muestra, id_prueba, id_laboratorio, id_empleado, fecha_resultado, descripcion, estado } = req.body;
        const result = await pool.query(
            'INSERT INTO resultados (id_muestra, id_prueba, id_laboratorio, id_empleado, fecha_resultado, descripcion, estado) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [id_muestra, id_prueba, id_laboratorio, id_empleado, fecha_resultado, descripcion, estado]
        );
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateResultado = async (req, res) => {
    try {
        const { id } = req.params;
        const { id_muestra, id_prueba, id_laboratorio, id_empleado, fecha_resultado, descripcion, estado } = req.body;
        const result = await pool.query(
            'UPDATE resultados SET id_muestra=$1, id_prueba=$2, id_laboratorio=$3, id_empleado=$4, fecha_resultado=$5, descripcion=$6, estado=$7 WHERE id_resultado=$8 RETURNING *',
            [id_muestra, id_prueba, id_laboratorio, id_empleado, fecha_resultado, descripcion, estado, id]
        );
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteResultado = async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM resultados WHERE id_resultado = $1', [id]);
        res.json({ message: 'Resultado eliminado' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getAllResultados, getResultadoById, createResultado, updateResultado, deleteResultado };