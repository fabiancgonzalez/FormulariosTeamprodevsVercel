require('dotenv').config();
const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();
const mongoUri = process.env.DATABASE_URL;
const mongoClient = new MongoClient(mongoUri, { serverApi: { version: ServerApiVersion.v1 } });

let db = null;

// Setup
async function setup() {
  await mongoClient.connect();
  db = mongoClient.db('formulariomascotas');
  console.log('[SETUP] DB conectada:', !!db);
  
  // Middleware
  app.use((req, res, next) => {
    console.log('[MW] Ejecutado para:', req.path);
    req.db = db;
    next();
  });
  
  // Ruta test
  app.get('/test', (req, res) => {
    console.log('[ROUTE] Ejecutado, req.db:', typeof req.db);
    res.json({ db: !!req.db });
  });
  
  // Ruta personas
  app.get('/personas', async (req, res) => {
    console.log('[PERSONAS] req.db:', typeof req.db);
    try {
      const personas = await req.db.collection('personas').find({}).toArray();
      res.json(personas);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });
  
  app.listen(5002, () => {
    console.log('[SERVER] Escuchando en :5002');
  });
}

setup().catch(console.error);
