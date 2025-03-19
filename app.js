import express from "express";
import cors from "cors";
import productoRoutes from "./src/routes/productoRoutes";
import riesgoRoutes from "./src/routes/riesgoRoutes";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Rutas
app.use("/api/productos", productoRoutes);
app.use("/api/riesgos", riesgoRoutes);

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Algo salió mal en el servidor" });
});

export default app;
