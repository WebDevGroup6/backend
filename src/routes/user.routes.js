// filepath: c:\Users\obala\Desktop\Proyectos\Desarrollo web final\Backend\src\routes\user.routes.js
import { Router } from "express";
import { getProfile, updateProfile } from "../controllers/user.controller.js";
import authenticateToken from "../middlewares/auth.middleware.js"; // Middleware de autenticación

const router = Router();

// Ruta para obtener el perfil del usuario autenticado
// Se aplica el middleware para asegurar que solo usuarios logueados accedan
router.get("/profile", authenticateToken, getProfile);

// Ruta para actualizar el perfil del usuario autenticado
// Se aplica el middleware
router.put("/profile", authenticateToken, updateProfile);

export default router;
