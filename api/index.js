require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// Importar Prisma
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Importar rutas
const personasRoutes = require('../backend-nodejs/routes/personas');
const mascotasRoutes = require('../backend-nodejs/routes/mascotas');

const app = express();

// Middleware
app.use(cors({
  origin: [
    'http://localhost:4200',
    'http://localhost:3000',
    process.env.CORS_ORIGIN || '*'
  ],
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware para pasar Prisma a las rutas
app.use((req, res, next) => {
  req.prisma = prisma;
  next();
});

// Rutas
app.use('/api/personas', personasRoutes);
app.use('/api/mascotas', mascotasRoutes);

// Ruta de prueba
app.get('/api/health', (req, res) => {
  res.json({ message: 'Backend funcionando correctamente', status: 'ok' });
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno del servidor', message: err.message });
});

module.exports = app;
