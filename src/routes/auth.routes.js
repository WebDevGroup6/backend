import { Router } from "express";
import { login, logout } from "../controllers/auth.controller.js";

const router = Router();

router.post("/login", login);
router.post("/logout", logout); // Or GET depending on your implementation

export default router;
