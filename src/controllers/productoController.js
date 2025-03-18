const pool = require("../config/db");

const getProductos = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM Producto");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getProductoById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "SELECT * FROM Producto WHERE ID_Producto = $1",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createProducto = async (req, res) => {
  try {
    const {
      nombre,
      descripcion,
      tipo,
      fabricante,
      fecha_aprobacion,
      estado,
      precio,
      codigo_digemaps,
    } = req.body;
    const result = await pool.query(
      "INSERT INTO Producto (Nombre, Descripcion, Tipo, Fabricante, Fecha_Aprobacion, Estado, Precio, Codigo_DIGEMAPS) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
      [
        nombre,
        descripcion,
        tipo,
        fabricante,
        fecha_aprobacion,
        estado,
        precio,
        codigo_digemaps,
      ]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      nombre,
      descripcion,
      tipo,
      fabricante,
      fecha_aprobacion,
      estado,
      precio,
      codigo_digemaps,
    } = req.body;
    const result = await pool.query(
      "UPDATE Producto SET Nombre = $1, Descripcion = $2, Tipo = $3, Fabricante = $4, Fecha_Aprobacion = $5, Estado = $6, Precio = $7, Codigo_DIGEMAPS = $8 WHERE ID_Producto = $9 RETURNING *",
      [
        nombre,
        descripcion,
        tipo,
        fabricante,
        fecha_aprobacion,
        estado,
        precio,
        codigo_digemaps,
        id,
      ]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "DELETE FROM Producto WHERE ID_Producto = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }
    res.json({ message: "Producto eliminado" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getProductos,
  getProductoById,
  createProducto,
  updateProducto,
  deleteProducto,
};
