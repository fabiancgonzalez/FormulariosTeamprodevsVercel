require('dotenv').config();
const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors');
const bodyParser = require('body-parser');

// Importar rutas
const personasRoutes = require('../backend-nodejs/routes/personas');
const mascotasRoutes = require('../backend-nodejs/routes/mascotas');

const app = express();

// Middleware base
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

// MongoDB
const mongoUri = process.env.DATABASE_URL || 'mongodb+srv://Vercel-Admin-formulariomascota:xxxxxxxxxx@formulariomascota.tqebomv.mongodb.net/?retryWrites=true&w=majority';
const mongoClient = new MongoClient(mongoUri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let db = null;

// Health (antes de DB)
app.get('/api/health', (req, res) => {
  res.json({ message: 'OK', db: !!db });
});

// Setup
async function setupServer() {
  try {
    if (!db) {
      console.log('[API] Conectando a MongoDB...');
      await mongoClient.connect();
      db = mongoClient.db('formulariomascotas');
      console.log('[API] ✓ Conectado a MongoDB Atlas');
    }
    
    // Middleware para inyectar DB
    app.use((req, res, next) => {
      if (!db) {
        return res.status(500).json({ error: 'DB no disponible' });
      }
      req.db = db;
      next();
    });
    
    // Rutas
    app.use('/api/personas', personasRoutes);
    app.use('/api/mascotas', mascotasRoutes);
    
    // Error handler
    app.use((err, req, res, next) => {
      console.error('[API-ERROR]', err.message);
      res.status(500).json({ error: err.message });
    });
    
  } catch (error) {
    console.error('[API] Error:', error.message);
  }
}

setupServer();

module.exports = app;
