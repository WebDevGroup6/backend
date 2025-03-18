const pool = require('../db/connection');

const getAllResultados = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM resultados;');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getAllResultados };