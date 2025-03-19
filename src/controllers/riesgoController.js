import pool from "../config/db";

const getRiesgos = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM Riesgo");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createRiesgo = async (req, res) => {
  try {
    const {
      codigo,
      descripcion,
      severidad,
      probabilidad,
      id_categoria,
      estado,
    } = req.body;
    const result = await pool.query(
      "INSERT INTO Riesgo (Codigo, Descripcion, Severidad, Probabilidad, ID_Categoria, Estado) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [codigo, descripcion, severidad, probabilidad, id_categoria, estado]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export { getRiesgos, createRiesgo };
