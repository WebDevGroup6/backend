import { supabase } from "../config/database.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET must be defined in .env file");
}

// Placeholder for authentication logic (login, logout)
export const login = async (req, res) => {
  const { nombre_usuario, passwrd } = req.body;

  if (!nombre_usuario || !passwrd) {
    return res
      .status(400)
      .json({ message: "Nombre de usuario y contraseña son requeridos" });
  }

  try {
    // 1. Buscar al usuario por nombre_usuario
    const { data: user, error: userError } = await supabase
      .from("usuario")
      .select("*, empleado:empleado(id_empleado, nombre, cargo)") // Incluir datos del empleado si es necesario
      .eq("nombre_usuario", nombre_usuario)
      .single(); // .single() espera una sola fila o null

    if (userError && userError.code !== "PGRST116") {
      // PGRST116: Row not found
      console.error("Error fetching user:", userError);
      return res.status(500).json({ message: "Error al buscar el usuario" });
    }

    if (!user) {
      return res.status(401).json({ message: "Credenciales inválidas" }); // Usuario no encontrado
    }

    // 2. Verificar si el usuario está activo
    if (user.estado !== "Activo") {
      return res.status(403).json({ message: "Usuario inactivo" });
    }

    // 3. Comparar la contraseña proporcionada con la almacenada (hasheada)
    // const isPasswordValid = await bcrypt.compare(passwrd, user.passwrd); // Comentado para pruebas con texto plano

    // *** INICIO: Comparación de texto plano (SOLO PARA PRUEBAS) ***
    const isPasswordValid = passwrd === user.passwrd;
    // *** FIN: Comparación de texto plano ***

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Credenciales inválidas" }); // Contraseña incorrecta
    }

    // 4. Generar el token JWT
    const payload = {
      id_usuario: user.id_usuario,
      id_empleado: user.id_empleado,
      nombre_usuario: user.nombre_usuario,
      // Puedes añadir más datos al payload si es necesario, como el rol o cargo
      cargo: user.empleado?.cargo, // Acceso seguro por si la relación empleado no existe
    };

    const token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: "1h", // El token expira en 1 hora (puedes ajustarlo)
    });

    // 5. Enviar el token al cliente
    // Excluir la contraseña del objeto de usuario que se devuelve
    const { passwrd: _, ...userWithoutPassword } = user;

    res.json({
      message: "Inicio de sesión exitoso",
      token,
      user: userWithoutPassword, // Opcional: devolver datos del usuario (sin contraseña)
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const logout = async (req, res) => {
  // La invalidación de JWT generalmente se maneja en el lado del cliente
  // eliminando el token. Si necesitas una lista negra de tokens en el servidor,
  // requeriría una implementación más compleja (p. ej., almacenar tokens inválidos en Redis).
  res.json({
    message: "Logout placeholder - el cliente debe eliminar el token",
  });
};

// Add other auth-related controller functions (e.g., register, password reset) if needed
