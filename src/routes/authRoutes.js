// src/routes/authRoutes.js
import express from "express";
import { login, renewToken, logout } from "../controllers/auth.Controller.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/login", login);
router.post("/logout", authenticateToken, logout); // Opcional, dependiendo de la implementación
router.get("/renew", authenticateToken, renewToken);

export default router;
