import { Router } from "express";
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js"; // Assuming token verification is needed

const router = Router();

// Get all products
router.get("/", [verifyToken], getAllProducts);

// Get a single product by ID
router.get("/:id", [verifyToken], getProductById);

// Create a new product
// Add role checks if needed: e.g., [verifyToken, isModeratorOrAdmin]
router.post("/", [verifyToken], createProduct);

// Update a product by ID
// Add role checks if needed: e.g., [verifyToken, isModeratorOrAdmin]
router.put("/:id", [verifyToken], updateProduct);

// Delete a product by ID
// Add role checks if needed: e.g., [verifyToken, isModeratorOrAdmin]
router.delete("/:id", [verifyToken], deleteProduct);

export default router;
