import pool from "../db/connection";

const getAllProveedores = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM proveedor");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProveedorById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "SELECT * FROM proveedor WHERE id_proveedor = $1",
      [id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createProveedor = async (req, res) => {
  try {
    const { rnc, nombre, direccion, contacto, estado } = req.body;
    const result = await pool.query(
      "INSERT INTO proveedor (rnc, nombre, direccion, contacto, estado) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [rnc, nombre, direccion, contacto, estado]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProveedor = async (req, res) => {
  try {
    const { id } = req.params;
    const { rnc, nombre, direccion, contacto, estado } = req.body;
    const result = await pool.query(
      "UPDATE proveedor SET rnc=$1, nombre=$2, direccion=$3, contacto=$4, estado=$5 WHERE id_proveedor=$6 RETURNING *",
      [rnc, nombre, direccion, contacto, estado, id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteProveedor = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM proveedor WHERE id_proveedor = $1", [id]);
    res.json({ message: "Proveedor eliminado" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  getAllProveedores,
  getProveedorById,
  createProveedor,
  updateProveedor,
  deleteProveedor,
};
