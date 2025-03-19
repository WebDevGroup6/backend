import pool from "../db/connection";

const getAllProductos = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM producto");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProductoById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "SELECT * FROM producto WHERE id_producto = $1",
      [id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createProducto = async (req, res) => {
  try {
    const { nombre, descripcion, tipo } = req.body;
    const result = await pool.query(
      "INSERT INTO producto (nombre, descripcion, tipo) VALUES ($1, $2, $3) RETURNING *",
      [nombre, descripcion, tipo]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, tipo } = req.body;
    const result = await pool.query(
      "UPDATE producto SET nombre=$1, descripcion=$2, tipo=$3 WHERE id_producto=$4 RETURNING *",
      [nombre, descripcion, tipo, id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteProducto = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM producto WHERE id_producto = $1", [id]);
    res.json({ message: "Producto eliminado" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  getAllProductos,
  getProductoById,
  createProducto,
  updateProducto,
  deleteProducto,
};
