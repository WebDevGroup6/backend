// filepath: c:\Users\obala\Desktop\Proyectos\Desarrollo web final\Backend\src\controllers\user.controller.js
import { supabase } from "../config/database.js";
import bcrypt from "bcryptjs";

// Obtener perfil del usuario (actualmente solo nombre de usuario)
export const getProfile = async (req, res) => {
  // El id_usuario se obtiene del token JWT verificado por el middleware
  const userId = req.user.id_usuario;

  try {
    const { data: user, error } = await supabase
      .from("usuario")
      .select("id_usuario, nombre_usuario, id_empleado, estado") // Selecciona los campos necesarios
      .eq("id_usuario", userId)
      .single();

    if (error) {
      console.error("Error fetching profile:", error);
      return res.status(500).json({ message: "Error al obtener el perfil" });
    }

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // No devolver la contraseña
    const { passwrd, ...profileData } = user;

    res.json(profileData);
  } catch (error) {
    console.error("Server error fetching profile:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// Actualizar perfil del usuario (nombre de usuario y/o contraseña)
export const updateProfile = async (req, res) => {
  const userId = req.user.id_usuario;
  const { nombre_usuario, current_password, new_password } = req.body;

  // Validaciones básicas
  if (!nombre_usuario && !new_password) {
    return res
      .status(400)
      .json({
        message:
          "Se requiere al menos un campo para actualizar (nombre de usuario o nueva contraseña)",
      });
  }
  if (new_password && !current_password) {
    return res
      .status(400)
      .json({
        message: "Se requiere la contraseña actual para establecer una nueva",
      });
  }

  try {
    // 1. Obtener el usuario actual para verificar la contraseña si es necesario
    const { data: currentUser, error: fetchError } = await supabase
      .from("usuario")
      .select("passwrd, nombre_usuario") // Solo necesitamos la contraseña y el nombre actual
      .eq("id_usuario", userId)
      .single();

    if (fetchError) {
      console.error("Error fetching current user for update:", fetchError);
      return res.status(500).json({ message: "Error al verificar el usuario" });
    }

    if (!currentUser) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const updateData = {};

    // 2. Si se proporciona una nueva contraseña, verificar la actual
    if (new_password) {
      // Comparar la contraseña actual proporcionada con la almacenada
      // const isPasswordValid = await bcrypt.compare(current_password, currentUser.passwrd); // Usar bcrypt en producción

      // *** INICIO: Comparación de texto plano (SOLO PARA PRUEBAS) ***
      const isPasswordValid = current_password === currentUser.passwrd;
      // *** FIN: Comparación de texto plano ***

      if (!isPasswordValid) {
        return res
          .status(401)
          .json({ message: "La contraseña actual es incorrecta" });
      }

      // Hashear la nueva contraseña antes de guardarla
      // const hashedNewPassword = await bcrypt.hash(new_password, 10); // Usar bcrypt en producción
      // updateData.passwrd = hashedNewPassword;

      // *** INICIO: Guardar contraseña en texto plano (SOLO PARA PRUEBAS) ***
      updateData.passwrd = new_password; // ¡¡¡NO HACER ESTO EN PRODUCCIÓN!!!
      // *** FIN: Guardar contraseña en texto plano ***
    }

    // 3. Si se proporciona un nuevo nombre de usuario, verificar si ya existe (opcional pero recomendado)
    if (nombre_usuario && nombre_usuario !== currentUser.nombre_usuario) {
      const { data: existingUser, error: checkUserError } = await supabase
        .from("usuario")
        .select("id_usuario")
        .eq("nombre_usuario", nombre_usuario)
        .neq("id_usuario", userId) // Excluir al usuario actual
        .maybeSingle(); // Puede que no exista otro usuario con ese nombre

      if (checkUserError) {
        console.error("Error checking existing username:", checkUserError);
        return res
          .status(500)
          .json({ message: "Error al verificar el nombre de usuario." });
      }

      if (existingUser) {
        return res
          .status(409)
          .json({
            message: "El nombre de usuario ya está en uso por otra cuenta.",
          });
      }
      updateData.nombre_usuario = nombre_usuario;
    }

    // 4. Realizar la actualización si hay datos para actualizar
    if (Object.keys(updateData).length === 0) {
      return res
        .status(400)
        .json({ message: "No se proporcionaron cambios válidos." });
    }

    const { error: updateError } = await supabase
      .from("usuario")
      .update(updateData)
      .eq("id_usuario", userId);

    if (updateError) {
      console.error("Error updating profile:", updateError);
      // Manejar errores específicos de la base de datos si es necesario
      if (updateError.code === "23505") {
        // Código de violación de unicidad (ej. nombre_usuario duplicado)
        return res
          .status(409)
          .json({ message: "Error: El nombre de usuario ya existe." });
      }
      return res.status(500).json({ message: "Error al actualizar el perfil" });
    }

    res.json({ message: "Perfil actualizado exitosamente" });
  } catch (error) {
    console.error("Server error updating profile:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};
