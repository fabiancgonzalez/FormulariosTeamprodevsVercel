require('dotenv').config();
const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors');
const bodyParser = require('body-parser');

// Importar rutas
const personasRoutes = require('./routes/personas');
const mascotasRoutes = require('./routes/mascotas');

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
const mongoUri = process.env.DATABASE_URL || 'mongodb+srv://Vercel-Admin-formulariomascota:Fabian04533309@formulariomascota.tqebomv.mongodb.net/?retryWrites=true&w=majority';
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
    console.log('Conectando a MongoDB...');
    await mongoClient.connect();
    db = mongoClient.db('formulariomascotas');
    console.log('✓ Conectado a MongoDB Atlas');
    
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
      console.error(err.stack);
      res.status(500).json({ error: err.message });
    });
    
    // 404
    app.use((req, res) => {
      res.status(404).json({ error: 'No encontrado' });
    });
    
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Servidor ejecutándose en puerto ${PORT}`);
    });
    
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

// Shutdown
process.on('SIGINT', async () => {
  if (db) await mongoClient.close();
  process.exit(0);
});

// Iniciar
setupServer();
