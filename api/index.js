require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const { attachDatabasePool } = require('@vercel/functions');

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

// Conexión a MongoDB Atlas con pool de conexiones
const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://Vercel-Admin-formulariomascota:wFHZOpHnFlnkR13E@formulariomascota.tqebomv.mongodb.net/?retryWrites=true&w=majority';

let mongooseConnection = null;

async function connectDB() {
  if (mongooseConnection) {
    return mongooseConnection;
  }

  try {
    mongooseConnection = await mongoose.connect(mongoUri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
    });
    console.log('✓ Conectado a MongoDB Atlas');
    
    // Usar pool de conexiones de Vercel para optimizar
    if (mongoose.connection.getClient && typeof attachDatabasePool === 'function') {
      attachDatabasePool(mongoose.connection.getClient());
    }
    
    return mongooseConnection;
  } catch (err) {
    console.error('✗ Error conectando a MongoDB:', err.message);
    throw err;
  }
}

// Inicializar conexión
connectDB().catch(err => console.error('Error inicial de conexión:', err));

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
