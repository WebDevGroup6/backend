import express from "express";
import {
  getAllProveedores,
  getProveedorById,
  createProveedor,
  updateProveedor,
  deleteProveedor,
  // getProveedoresReport // Uncomment if you implement the report function
} from "../controllers/proveedor.controller.js";
// import { verifyToken } from "../middlewares/auth.middleware.js"; // Optional: Add auth middleware if needed
// import { checkRole } from "../middlewares/role.middleware.js"; // Optional: Add role middleware if needed

const router = express.Router();

// Public routes (or apply middleware globally/selectively)
router.get("/", getAllProveedores); // Get all suppliers
router.get("/:id", getProveedorById); // Get a single supplier by ID

// Routes requiring authentication (example)
// router.use(verifyToken); // Apply auth middleware to subsequent routes

router.post("/", createProveedor); // Create a new supplier (potentially restricted by role)
router.put("/:id", updateProveedor); // Update a supplier (potentially restricted by role)
router.delete("/:id", deleteProveedor); // Delete a supplier (potentially restricted by role, e.g., admin only)

// Optional Report Route
// router.get("/report/active", getProveedoresReport); // Example report route

export default router;
