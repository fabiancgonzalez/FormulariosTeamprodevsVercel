const { MongoClient, ServerApiVersion } = require('mongodb');
const fs = require('fs');
const path = require('path');

// Cargar .env manualmente
const envPath = path.join(__dirname, '.env');
let databaseUrl = null;
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  const match = envContent.match(/DATABASE_URL="([^"]+)"/);
  if (match) {
    databaseUrl = match[1];
  }
}

const uris = [
  // Opción 1: Sin encode (literal)
  {
    name: 'Sin encode (literal)',
    uri: "mongodb+srv://Vercel-Admin-formulariomascota:Fabian04533309@formulariomascota.tqebomv.mongodb.net/?retryWrites=true&w=majority"
  },
  // Opción 2: URL-encoded
  {
    name: 'URL-encoded',
    uri: "mongodb+srv://Vercel-Admin-formulariomascota:" + encodeURIComponent("Fabian04533309") + "@formulariomascota.tqebomv.mongodb.net/?retryWrites=true&w=majority"
  },
  // Opción 3: Usando DATABASE_URL del .env
  {
    name: 'DATABASE_URL del .env',
    uri: databaseUrl
  }
];

async function testConnection(uri, name) {
  console.log(`\n------- Probando: ${name} -------`);
  console.log('URI:', uri.replace(/:[^:@]*@/, ':****@'));

  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
  });

  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("✓ ¡CONEXIÓN EXITOSA!");
    return true;
  } catch (error) {
    console.error("✗ Error:", error.message);
    return false;
  } finally {
    await client.close();
  }
}

async function runTests() {
  console.log('Probando conexiones a MongoDB Atlas...\n');
  
  for (const { name, uri } of uris) {
    if (!uri) {
      console.log(`\n------- Skipping: ${name} (sin URI) -------`);
      continue;
    }
    await testConnection(uri, name);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Esperar 1 segundo entre pruebas
  }
}

runTests().catch(console.error);
