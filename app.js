const express = require("express");
const cors = require("cors");
const productoRoutes = require("./src/routes/productoRoutes");
const riesgoRoutes = require("./src/routes/riesgoRoutes");

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

module.exports = app;
