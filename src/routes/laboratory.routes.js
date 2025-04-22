import { Router } from "express";
import {
  getAllLaboratories,
  getLaboratoryById,
  createLaboratory,
  updateLaboratory,
  deleteLaboratory,
} from "../controllers/laboratory.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js"; // Assuming token verification is needed
// Import role middleware if specific roles are required for certain actions
// import { isModeratorOrAdmin } from "../middlewares/role.middleware.js";

const router = Router();

// Get all laboratories
router.get("/", [verifyToken], getAllLaboratories);

// Get a single laboratory by ID
router.get("/:id", [verifyToken], getLaboratoryById);

// Create a new laboratory
// Add role checks if needed: e.g., [verifyToken, isModeratorOrAdmin]
router.post("/", [verifyToken], createLaboratory);

// Update a laboratory by ID
// Add role checks if needed: e.g., [verifyToken, isModeratorOrAdmin]
router.put("/:id", [verifyToken], updateLaboratory);

// Delete a laboratory by ID
// Add role checks if needed: e.g., [verifyToken, isModeratorOrAdmin]
router.delete("/:id", [verifyToken], deleteLaboratory);

export default router;
