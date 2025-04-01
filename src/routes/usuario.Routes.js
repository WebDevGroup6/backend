// src/routes/usuarioRoutes.js
import express from "express";
import {
  getUsuarios,
  getUsuarioById,
  createUsuario,
  updateUsuario,
  changePassword,
  deleteUsuario,
} from "../controllers/usuario.controller.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Rutas públicas o protegidas según corresponda
router.get("/", authenticateToken, getUsuarios);
router.get("/:id", authenticateToken, getUsuarioById);
router.post("/", authenticateToken, createUsuario);
router.put("/:id", authenticateToken, updateUsuario);
router.put("/:id/change-password", authenticateToken, changePassword);
router.delete("/:id", authenticateToken, deleteUsuario);

export default router;
