// src/controllers/empleado.controller.js
import supabase from "../models/supabaseClient.js";

// Obtener todos los empleados
export const getEmpleados = async (req, res) => {
  try {
    const { data, error } = await supabase.from("Empleado").select("*");
    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener empleados", error: error.message });
  }
};

// Obtener un empleado por ID
export const getEmpleadoById = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from("Empleado")
      .select("*")
      .eq("ID_Empleado", id)
      .single();
    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener el empleado", error: error.message });
  }
};

// Crear un nuevo empleado
export const createEmpleado = async (req, res) => {
  try {
    const { cedula, nombre, cargo, contacto, estado } = req.body;
    // Validación básica
    if (!cedula || !nombre || !cargo || !contacto) {
      return res
        .status(400)
        .json({
          message:
            "Los campos cedula, nombre, cargo y contacto son obligatorios.",
        });
    }
    const { data, error } = await supabase
      .from("Empleado")
      .insert([
        {
          Cedula: cedula,
          Nombre: nombre,
          Cargo: cargo,
          Contacto: contacto,
          Estado: estado || "Activo",
        },
      ])
      .select();
    if (error) throw error;
    res.status(201).json({ message: "Empleado creado exitosamente", data });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al crear el empleado", error: error.message });
  }
};

// Actualizar un empleado
export const updateEmpleado = async (req, res) => {
  try {
    const { id } = req.params;
    const { cedula, nombre, cargo, contacto, estado } = req.body;
    const { data, error } = await supabase
      .from("Empleado")
      .update({
        Cedula: cedula,
        Nombre: nombre,
        Cargo: cargo,
        Contacto: contacto,
        Estado: estado,
      })
      .eq("ID_Empleado", id)
      .select();
    if (error) throw error;
    res
      .status(200)
      .json({ message: "Empleado actualizado exitosamente", data });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error al actualizar el empleado",
        error: error.message,
      });
  }
};

// Eliminar un empleado (puede ser eliminación lógica o física)
export const deleteEmpleado = async (req, res) => {
  try {
    const { id } = req.params;
    // Aquí se podría implementar una eliminación lógica cambiando el estado a "Inactivo"
    // o eliminación física usando .delete()
    const { data, error } = await supabase
      .from("Empleado")
      .delete()
      .eq("ID_Empleado", id);
    if (error) throw error;
    res.status(200).json({ message: "Empleado eliminado exitosamente", data });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al eliminar el empleado", error: error.message });
  }
};
