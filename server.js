import express from "express";
import dotenv from "dotenv";

export const apps = express();
require("dotenv").config();

const PORT = process.env.PORT;

apps.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
dotenv.config();
