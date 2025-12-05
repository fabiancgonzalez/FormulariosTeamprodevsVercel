require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { PrismaClient } = require('@prisma/client');

// Importar Prisma
const prisma = new PrismaClient({
  errorFormat: 'pretty',
  log: ['error', 'warn'],
});

// Importar rutas
const personasRoutes = require('./backend-nodejs/routes/personas');
const mascotasRoutes = require('./backend-nodejs/routes/mascotas');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors({
  origin: [
    'http://localhost:4200',
    'http://localhost:3000',
    'https://formulariomascota.vercel.app',
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
  res.json({ message: 'Backend funcionando correctamente', status: 'ok', timestamp: new Date() });
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Error interno del servidor',
    status: err.status || 500
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada', path: req.path });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`✓ Servidor corriendo en http://localhost:${PORT}`);
  console.log(`✓ API Health: http://localhost:${PORT}/api/health`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM recibido, cerrando...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT recibido, cerrando...');
  await prisma.$disconnect();
  process.exit(0);
});

module.exports = app;
