import express from "express";
import { supabase } from "../config/database.js"; // Ajusta ruta si es diferente

const router = express.Router();

// Obtener todos los tipos de prueba
router.get("/tipos-prueba", async (req, res) => {
  const { data, error } = await supabase
    .from("tipo_prueba")
    .select("id_tipo, nombre");

  if (error) return res.status(500).json({ error: error.message });

  res.json(data);
});

export default router;