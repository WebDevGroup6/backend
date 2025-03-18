const pool = require('../db/connection');

const getAllMuestras = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM muestra;');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getAllMuestras };