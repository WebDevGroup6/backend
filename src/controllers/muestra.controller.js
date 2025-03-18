const pool = require('../db/connection');

const getAllMuestras = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM muestra');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getMuestraById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM muestra WHERE id_muestra = $1', [id]);
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createMuestra = async (req, res) => {
    try {
        const { id_proveedor, id_producto, id_empleado, fecha_muestra, observaciones, campo } = req.body;
        const result = await pool.query(
            'INSERT INTO muestra (id_proveedor, id_producto, id_empleado, fecha_muestra, observaciones, campo) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [id_proveedor, id_producto, id_empleado, fecha_muestra, observaciones, campo]
        );
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateMuestra = async (req, res) => {
    try {
        const { id } = req.params;
        const { id_proveedor, id_producto, id_empleado, fecha_muestra, observaciones, campo } = req.body;
        const result = await pool.query(
            'UPDATE muestra SET id_proveedor=$1, id_producto=$2, id_empleado=$3, fecha_muestra=$4, observaciones=$5, campo=$6 WHERE id_muestra=$7 RETURNING *',
            [id_proveedor, id_producto, id_empleado, fecha_muestra, observaciones, campo, id]
        );
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteMuestra = async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM muestra WHERE id_muestra = $1', [id]);
        res.json({ message: 'Muestra eliminada' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getAllMuestras, getMuestraById, createMuestra, updateMuestra, deleteMuestra };