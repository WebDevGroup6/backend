// src/controllers/usuario.controller.js
import supabase from "../models/supabaseClient.js";

// Obtener todos los usuarios
export const getUsuarios = async (req, res) => {
  try {
    const { data, error } = await supabase.from("Usuario").select("*");
    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener usuarios", error: error.message });
  }
};

// Obtener un usuario por ID
export const getUsuarioById = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from("Usuario")
      .select("*")
      .eq("ID_Usuario", id)
      .single();
    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener el usuario", error: error.message });
  }
};

// Crear un nuevo usuario
export const createUsuario = async (req, res) => {
  try {
    const { id_empleado, nombre_usuario, contraseña, estado } = req.body;
    // Validación básica
    if (!id_empleado || !nombre_usuario || !contraseña) {
      return res.status(400).json({
        message:
          "ID_Empleado, nombre de usuario y contraseña son obligatorios.",
      });
    }
    // Aquí podrías implementar hashing de contraseña antes de almacenarla
    const { data, error } = await supabase
      .from("Usuario")
      .insert([
        {
          ID_Empleado: id_empleado,
          Nombre_Usuario: nombre_usuario,
          Contraseña: contraseña,
          Estado: estado || "Activo",
        },
      ])
      .select();
    if (error) throw error;
    res.status(201).json({ message: "Usuario creado exitosamente", data });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al crear el usuario", error: error.message });
  }
};

// Actualizar un usuario
export const updateUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre_usuario, contraseña, estado } = req.body;
    const { data, error } = await supabase
      .from("Usuario")
      .update({
        Nombre_Usuario: nombre_usuario,
        Contraseña: contraseña,
        Estado: estado,
      })
      .eq("ID_Usuario", id)
      .select();
    if (error) throw error;
    res.status(200).json({ message: "Usuario actualizado exitosamente", data });
  } catch (error) {
    res.status(500).json({
      message: "Error al actualizar el usuario",
      error: error.message,
    });
  }
};

// Eliminar un usuario
export const deleteUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from("Usuario")
      .delete()
      .eq("ID_Usuario", id);
    if (error) throw error;
    res.status(200).json({ message: "Usuario eliminado exitosamente", data });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al eliminar el usuario", error: error.message });
  }
};
