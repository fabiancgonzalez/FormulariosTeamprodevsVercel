require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');

const mongoUri = process.env.DATABASE_URL;
const client = new MongoClient(mongoUri, { serverApi: { version: ServerApiVersion.v1 } });

async function test() {
  try {
    await client.connect();
    const db = client.db('formulariomascotas');
    
    const mascota = await db.collection('mascotas').findOne({});
    console.log('Mascota estructura:');
    console.log(JSON.stringify(mascota, null, 2));
    
    await client.close();
  } catch (e) {
    console.error('Error:', e.message);
  }
}

test();
