require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();

// Configuración de MongoDB
const mongoUri = process.env.DATABASE_URL || 'mongodb+srv://Vercel-Admin-formulariomascota:Fabian04533309@formulariomascota.tqebomv.mongodb.net/?retryWrites=true&w=majority';
const mongoClient = new MongoClient(mongoUri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let db = null;

// Conectar a MongoDB al iniciar
async function connectMongo() {
  try {
    await mongoClient.connect();
    db = mongoClient.db('test');
    console.log('[MONGO] ✓ Conectado a MongoDB Atlas');
    return true;
  } catch (error) {
    console.error('[MONGO] ✗ Error conectando:', error.message);
    throw error;
  }
}

// Importar rutas
const personasRoutes = require('../backend-nodejs/routes/personas');
const mascotasRoutes = require('../backend-nodejs/routes/mascotas');

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

// Middleware para pasar DB a las rutas
app.use((req, res, next) => {
  if (!db) {
    console.error('[ERROR] DB no está disponible');
    return res.status(503).json({ error: 'Servicio no disponible', details: 'Base de datos no conectada' });
  }
  req.db = db;
  next();
});

// Rutas
app.use('/api/personas', personasRoutes);
app.use('/api/mascotas', mascotasRoutes);

// Ruta de prueba
app.get('/api/health', (req, res) => {
  res.json({ message: 'Backend funcionando correctamente', status: 'ok', db: !!db });
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error('[ERROR-HANDLER]', err);
  res.status(500).json({ 
    error: 'Error interno del servidor', 
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Iniciar conexión a MongoDB
connectMongo().catch(err => {
  console.error('Error crítico al conectar a MongoDB:', err);
});

module.exports = app;
