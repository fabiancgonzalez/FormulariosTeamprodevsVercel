require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();
const PORT = process.env.PORT || 5001;

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

// Middleware base (CORS, bodyParser)
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

// Health check (antes de que DB esté conectada)
app.get('/api/health', (req, res) => {
  res.json({ message: 'OK', db_connected: !!db });
});

// Middleware para inyectar DB (SIEMPRE se ejecuta si la ruta existe)
const ensureDB = (req, res, next) => {
  if (!db) {
    console.error('[MIDDLEWARE] ERROR: db no disponible');
    return res.status(500).json({ error: 'DB not available in route' });
  }
  console.log('[MIDDLEWARE] ✓ DB disponible:', !!db);
  req.db = db;
  next();
};

// Conectar a MongoDB y configurar rutas
async function setupServer() {
  try {
    console.log('[MONGO] Iniciando conexión a MongoDB...');
    await mongoClient.connect();
    db = mongoClient.db('formulariomascotas');
    console.log('[MONGO] ✓ Conectado a MongoDB Atlas');
    console.log('[MONGO] Variable db es:', typeof db);
    
    // Importar rutas
    const personasRoutes = require('./backend-nodejs/routes/personas');
    const mascotasRoutes = require('./backend-nodejs/routes/mascotas');
    
    // Registrar middleware ANTES de las rutas
    app.use(ensureDB);
    
    // Registrar rutas
    app.use('/api/personas', personasRoutes);
    app.use('/api/mascotas', mascotasRoutes);
    console.log('[SETUP] ✓ Rutas registradas');

    // Manejo de errores global
    app.use((err, req, res, next) => {
      console.error('[ERROR]', err.message);
      res.status(err.status || 500).json({
        error: err.message || 'Error interno del servidor'
      });
    });

    // 404 handler
    app.use((req, res) => {
      res.status(404).json({ error: 'Ruta no encontrada' });
    });

    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`[SERVER] ✓ Servidor corriendo en http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error('[ERROR] Error crítico:', error.message);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('[SERVER] SIGTERM recibido');
  if (db) await mongoClient.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('[SERVER] SIGINT recibido');
  if (db) await mongoClient.close();
  process.exit(0);
});

// Iniciar
setupServer();

