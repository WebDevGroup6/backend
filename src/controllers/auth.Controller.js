// src/controllers/authController.js
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import supabase from "../models/supabaseClient.js";
import dotenv from "dotenv";

dotenv.config();

const generateToken = (user) => {
  return jwt.sign(user, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// Login: valida credenciales y devuelve un token JWT
export const login = async (req, res) => {
  try {
    const { nombre_usuario, contraseña } = req.body;

    if (!nombre_usuario || !contraseña) {
      return res
        .status(400)
        .json({ message: "Nombre de usuario y contraseña son requeridos." });
    }

    // Buscar el usuario por nombre
    const { data: usuario, error } = await supabase
      .from("usuario")
      .select("*")
      .eq("nombre_usuario", nombre_usuario)
      .single();

    if (error || !usuario) {
      return res.status(401).json({ message: "Credenciales inválidas." });
    }

    // Comparar la contraseña proporcionada con la almacenada
    const validPassword = await bcrypt.compare(contraseña, usuario.contraseña);
    if (!validPassword) {
      return res.status(401).json({ message: "Credenciales inválidas." });
    }

    // Generar token
    const token = generateToken({
      id_usuario: usuario.id_usuario,
      nombre_usuario: usuario.nombre_usuario,
    });
    res.status(200).json({ message: "Inicio de sesión exitoso", token });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error en el login", error: error.message });
  }
};

// Renueva el token (requiere autenticación)
export const renewToken = async (req, res) => {
  try {
    // req.user viene del middleware de autenticación
    const newToken = generateToken({
      id_usuario: req.user.id_usuario,
      nombre_usuario: req.user.nombre_usuario,
    });
    res.status(200).json({ token: newToken });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al renovar el token", error: error.message });
  }
};

// Logout (opcional, si se implementa mecanismo de blacklist)
export const logout = async (req, res) => {
  // Si se utiliza blacklist de tokens, se debe agregar el token a la lista negra.
  res.status(200).json({ message: "Sesión cerrada correctamente" });
};
