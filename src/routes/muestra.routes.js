import { Router } from "express";
import {
  getAllMuestras,
  getMuestraById,
  createMuestra,
  updateMuestra,
  deleteMuestra,
} from "../controllers/muestra.controller.js";

const router = Router();

router.get("/", getAllMuestras);
router.get("/:id", getMuestraById);
router.post("/", createMuestra);
router.put("/:id", updateMuestra);
router.delete("/:id", deleteMuestra);

export default router;