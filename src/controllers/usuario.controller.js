// src/controllers/usuarioController.js
import bcrypt from "bcryptjs";
import supabase from "../models/supabaseClient.js";

// Obtener todos los usuarios
export const getUsuarios = async (req, res) => {
  try {
    const { data, error } = await supabase.from("usuario").select("*");
    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener usuarios", error: error.message });
  }
};

// Obtener usuario por ID
export const getUsuarioById = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from("usuario")
      .select("*")
      .eq("id_usuario", id)
      .single();
    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener el usuario", error: error.message });
  }
};

// Crear un nuevo usuario (registro)
export const createUsuario = async (req, res) => {
  try {
    const { id_empleado, nombre_usuario, passwrd, estado } = req.body;
    if (!id_empleado || !nombre_usuario || !passwrd) {
      return res.status(400).json({
        message: "ID_Empleado, nombre_usuario y passwrd son requeridos.",
      });
    }

    // Hashear la passwrd
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(passwrd, salt);

    const { data, error } = await supabase
      .from("usuario")
      .insert([
        {
          ID_Empleado: id_empleado,
          Nombre_Usuario: nombre_usuario,
          passwrd: hashedPassword,
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

// Actualizar usuario (por ejemplo, cambiar perfil o estado)
export const updateUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre_usuario, estado } = req.body;

    const { data, error } = await supabase
      .from("usuario")
      .update({
        Nombre_Usuario: nombre_usuario,
        Estado: estado,
      })
      .eq("id_usuario", id)
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

// Cambio de passwrd
export const changePassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "La passwrd actual y la nueva passwrd son requeridas.",
      });
    }

    // Obtener usuario para verificar passwrd actual
    const { data: usuario, error: getError } = await supabase
      .from("usuario")
      .select("*")
      .eq("id_usuario", id)
      .single();

    if (getError || !usuario) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    const validPassword = await bcrypt.compare(
      currentPassword,
      usuario.passwrd
    );
    if (!validPassword) {
      return res
        .status(401)
        .json({ message: "La passwrd actual es incorrecta." });
    }

    // Hashear la nueva passwrd
    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);

    const { data, error } = await supabase
      .from("usuario")
      .update({ passwrd: hashedNewPassword })
      .eq("id_usuario", id)
      .select();

    if (error) throw error;
    res.status(200).json({ message: "passwrd actualizada exitosamente", data });
  } catch (error) {
    res.status(500).json({
      message: "Error al cambiar la passwrd",
      error: error.message,
    });
  }
};

// Eliminar (o inactivar) usuario
export const deleteUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    // Eliminación física o lógica (aquí se elimina físicamente)
    const { data, error } = await supabase
      .from("usuario")
      .delete()
      .eq("id_usuario", id);

    if (error) throw error;
    res.status(200).json({ message: "Usuario eliminado exitosamente", data });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al eliminar el usuario", error: error.message });
  }
};
