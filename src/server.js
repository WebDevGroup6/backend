import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./routes/index.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", routes);

app.get("/", (req, res) => {
  res.send(
    "🚀 API corriendo correctamente. Usa /api para acceder a los endpoints."
  );
});

app.get('/', (req, res) => {
    res.send('🚀 API corriendo correctamente. Usa /api para acceder a los endpoints.');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
