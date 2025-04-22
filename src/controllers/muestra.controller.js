/* src/controllers/muestra.controller.js */
import { supabase } from "../config/database.js";

// Obtener todas las muestras
export const getAllMuestras = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("muestra")
      .select("*");
    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error("Error fetching muestras:", error);
    res.status(500).json({ message: "Error fetching muestras", error: error.message });
  }
};

// Obtener muestra por ID
export const getMuestraById = async (req, res) => {
  const { id } = req.params;
  try {
    const { data, error } = await supabase
      .from("muestra")
      .select("*")
      .eq("id_muestra", id)
      .single();
    if (error) {
      return res.status(404).json({ message: "Muestra not found" });
    }
    res.json(data);
  } catch (error) {
    console.error(`Error fetching muestra ${id}:`, error);
    res.status(500).json({ message: "Error fetching muestra", error: error.message });
  }
};

// Crear nueva muestra
export const createMuestra = async (req, res) => {
  const { id_proveedor, id_producto, id_empleado, fechamuestra, observaciones, id_prueba } = req.body;
  if (!id_proveedor || !id_producto || !id_empleado || !fechamuestra || !id_prueba) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  try {
    const { data, error } = await supabase
      .from("muestra")
      .insert([
        { id_proveedor, id_producto, id_empleado, fechamuestra, observaciones, id_prueba }
      ])
      .select();
    if (error) throw error;
    res.status(201).json({ message: "Muestra created", muestra: data[0] });
  } catch (error) {
    console.error("Error creating muestra:", error);
    res.status(500).json({ message: "Error creating muestra", error: error.message });
  }
};

// Actualizar muestra
export const updateMuestra = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  delete updates.id_muestra;

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ message: "No update data provided" });
  }

  try {
    const { data, error } = await supabase
      .from("muestra")
      .update(updates)
      .eq("id_muestra", id)
      .select();
    if (error) throw error;
    if (!data || data.length === 0) {
      return res.status(404).json({ message: `Muestra with ID ${id} not found` });
    }
    res.json({ message: "Muestra updated", muestra: data[0] });
  } catch (error) {
    console.error(`Error updating muestra ${id}:`, error);
    res.status(500).json({ message: "Error updating muestra", error: error.message });
  }
};

// Eliminar muestra
export const deleteMuestra = async (req, res) => {
  const { id } = req.params;
  try {
    const { error, count } = await supabase
      .from("muestra")
      .delete({ count: "exact" })
      .eq("id_muestra", id);
    if (error) throw error;
    if (count === 0) {
      return res.status(404).json({ message: `Muestra with ID ${id} not found` });
    }
    res.json({ message: `Muestra with ID ${id} deleted` });
  } catch (error) {
    console.error(`Error deleting muestra ${id}:`, error);
    res.status(500).json({ message: "Error deleting muestra", error: error.message });
  }
};
