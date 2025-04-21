import { Router } from "express";
import {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from "../controllers/employee.controller.js";
import {
  verifyToken,
  // isModeratorOrAdmin, // Removed import
} from "../middlewares/auth.middleware.js"; // Assuming you have auth middleware

const router = Router();

// Get all employees
router.get("/", [verifyToken], getAllEmployees); // Add middleware as needed

// Get a single employee by ID
router.get("/:id", [verifyToken], getEmployeeById);

// Create a new employee
// Add appropriate role check middleware here (e.g., isAdmin, isModerator)
router.post("/", [verifyToken /*, isModeratorOrAdmin */], createEmployee);

// Update an employee by ID
// Add appropriate role check middleware here (e.g., isAdmin, isModerator)
router.put("/:id", [verifyToken /*, isModeratorOrAdmin */], updateEmployee);

// Delete an employee by ID
// Add appropriate role check middleware here (e.g., isAdmin, isModerator)
router.delete("/:id", [verifyToken /*, isModeratorOrAdmin */], deleteEmployee);

export default router;
