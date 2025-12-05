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

// Conectar a MongoDB al iniciar
async function connectMongo() {
  try {
    await mongoClient.connect();
    db = mongoClient.db('formulariomascotas');
    console.log('[MONGO] ✓ Conectado a MongoDB Atlas');
    return true;
  } catch (error) {
    console.error('[MONGO] ✗ Error conectando:', error.message);
    process.exit(1);
  }
}

// Importar rutas
const personasRoutes = require('./backend-nodejs/routes/personas');
const mascotasRoutes = require('./backend-nodejs/routes/mascotas');

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

console.log('[SETUP] Agregando middleware de MongoDB...');

// Middleware para pasar DB a las rutas
app.use((req, res, next) => {
  if (!db) {
    return res.status(500).json({ error: 'Base de datos no disponible' });
  }
  console.log('[MIDDLEWARE-DB]', req.method, req.path);
  req.db = db;
  next();
});

console.log('[SETUP] Registrando rutas...');

// Rutas
app.use('/api/personas', personasRoutes);
app.use('/api/mascotas', mascotasRoutes);

// Ruta de prueba
app.get('/api/health', (req, res) => {
  res.json({ message: 'Backend funcionando correctamente', status: 'ok', timestamp: new Date() });
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error('[ERROR]', err);
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
async function startServer() {
  await connectMongo();
  
  app.listen(PORT, () => {
    console.log('[SERVER] DATABASE_URL:', process.env.DATABASE_URL ? 'Configurada' : 'NO configurada');
    console.log(`[SERVER] ✓ Servidor corriendo en http://localhost:${PORT}`);
    console.log(`[SERVER] ✓ API Health: http://localhost:${PORT}/api/health`);
  });
}

startServer();

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('[SERVER] SIGTERM recibido, cerrando...');
  await mongoClient.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('[SERVER] SIGINT recibido, cerrando...');
  await mongoClient.close();
  process.exit(0);
});

module.exports = app;

