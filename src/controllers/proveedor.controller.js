const pool = require('../db/connection');

// Obtener todos los proveedores
const getProveedores = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM GetAllProveedores()');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Crear un proveedor
const createProveedor = async (req, res) => {
    const { rnc, nombre, direccion, contacto, estado } = req.body;
    try {
        await pool.query('CALL InsertProveedor($1, $2, $3, $4, $5)', [
            rnc, nombre, direccion, contacto, estado
        ]);
        res.json({ message: 'Proveedor agregado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Eliminar un proveedor por ID
const deleteProveedor = async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('CALL DeleteProveedor($1)', [id]);
        res.json({ message: 'Proveedor eliminado' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getProveedores, createProveedor, deleteProveedor };