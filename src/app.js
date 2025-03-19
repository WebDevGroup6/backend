import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./routes";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Rutas de la API
app.use("/api", routes);

app.get("/", (req, res) => {
  res.send("✅ API de Sistema de Muestras funcionando correctamente");
});

export default app;
