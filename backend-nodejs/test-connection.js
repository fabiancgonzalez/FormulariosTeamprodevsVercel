const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

const user = process.env.MONGO_USER;
const password = encodeURIComponent(process.env.MONGO_PASSWORD);
const cluster = process.env.MONGO_CLUSTER;

const uri = `mongodb+srv://${user}:${password}@${cluster}/?appName=Cluster0`;

console.log('Probando conexión con URI:', uri.replace(/:[^:]*@/, ':****@'));

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("✓ ¡Conexión exitosa a MongoDB Atlas!");
    const databases = await client.db("admin").admin().listDatabases();
    console.log("Bases de datos disponibles:");
    databases.databases.forEach(db => console.log(`  - ${db.name}`));
  } catch (error) {
    console.error("✗ Error de conexión:", error.message);
  } finally {
    await client.close();
  }
}

run().catch(console.dir);
