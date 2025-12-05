require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

// Importar rutas
const personasRoutes = require('./routes/personas');
const mascotasRoutes = require('./routes/mascotas');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:4200',
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Conexión a MongoDB Atlas
const mongoUri = process.env.MONGO_URI || 'mongodb+srv://ceferinomonier:Fabian0453*@cluster0.igvuqqt.mongodb.net/?appName=Cluster0&retryWrites=true&w=majority';

console.log('Conectando a MongoDB...');

mongoose.connect(mongoUri, {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
})
  .then(() => {
    console.log('✓ Conectado a MongoDB Atlas');
  })
  .catch(err => {
    console.error('✗ Error conectando a MongoDB:', err.message);
    process.exit(1);
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor ejecutándose en puerto ${PORT}`);
});
