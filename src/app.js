const express = require('express');
const cors = require('cors');
require('dotenv').config();
const routes = require('./routes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); 

// Rutas de la API
app.use('/api', routes);

module.exports = app;

app.get('/', (req, res) => {
    res.send('✅ API de Sistema de Muestras funcionando correctamente');
});