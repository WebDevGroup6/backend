import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import employeeRoutes from "./routes/employee.routes.js";
import productRoutes from "./routes/product.routes.js"; // Import product routes
import laboratoryRoutes from "./routes/laboratory.routes.js"; // Import laboratory routes
import muestraRoutes from "./routes/muestra.routes.js";
import proveedorRoutes from "./routes/proveedor.routes.js"; // Import supplier routes
import userRoutes from "./routes/user.routes.js"; // Import user routes
// Import other routes as needed

dotenv.config();

const app = express();

// Middlewares
app.use(cors()); // Enable CORS for all origins (adjust in production)
app.use(express.json()); // Parse JSON request bodies

// Routes
app.get("/", (req, res) => {
  res.send("Backend API is running!");
});

app.use("/api/auth", authRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/products", productRoutes); // Use product routes
app.use("/api/laboratories", laboratoryRoutes); // Use laboratory routes
app.use("/api/muestras", muestraRoutes);
app.use("/api/proveedores", proveedorRoutes); // Use supplier routes
app.use("/api/user", userRoutes); // Use user routes

// Use other routes

// Basic Error Handling (can be expanded)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

const PORT = process.env.PORT || 3001; // Use 3001 as a fallback if PORT not in .env

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

export default app; // Optional: export for testing
