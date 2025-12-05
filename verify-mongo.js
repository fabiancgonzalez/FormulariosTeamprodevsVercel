require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');

const mongoUri = process.env.DATABASE_URL;
const client = new MongoClient(mongoUri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function test() {
  try {
    await client.connect();
    const db = client.db('formulariomascotas');
    
    const personas = await db.collection('personas').find({}).toArray();
    console.log('Personas:', personas.length, personas.length > 0 ? personas[0] : 'vacío');
    
    await client.close();
  } catch (e) {
    console.error('Error:', e.message);
  }
}

test();
