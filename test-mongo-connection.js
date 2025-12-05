const { MongoClient, ServerApiVersion } = require('mongodb');

async function testConnection() {
  const uri = process.env.DATABASE_URL || "mongodb+srv://Vercel-Admin-formulariomascota:wFHZOpHnFlnkR13E@formulariomascota.tqebomv.mongodb.net/?retryWrites=true&w=majority";

  console.log('Intentando conectar a MongoDB...');
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
    // Connect the client to the server
    await client.connect();
    
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("✓ Pinged your deployment. You successfully connected to MongoDB!");
    
    // List databases
    const adminDb = client.db("admin");
    const databases = await adminDb.admin().listDatabases();
    console.log("✓ Databases:", databases.databases.map(db => db.name));
    
    return true;
  } catch (error) {
    console.error("✗ Error connecting to MongoDB:", error.message);
    return false;
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

testConnection().then(success => {
  process.exit(success ? 0 : 1);
});
