import { MongoClient, MongoClientOptions } from 'mongodb';
import { attachDatabasePool } from '@vercel/functions';

const options: MongoClientOptions = {
  appName: 'formulariomascota.vercel.app',
  maxIdleTimeMS: 5000,
  maxPoolSize: 10,
  minPoolSize: 2,
  serverSelectionTimeoutMS: 5000,
};

const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://Vercel-Admin-formulariomascota:wFHZOpHnFlnkR13E@formulariomascota.tqebomv.mongodb.net/?retryWrites=true&w=majority';

let client: MongoClient | null = null;

async function getMongoClient(): Promise<MongoClient> {
  if (client) {
    return client;
  }

  try {
    client = new MongoClient(mongoUri, options);
    
    // Attach the client to ensure proper cleanup on function suspension
    attachDatabasePool(client);
    
    await client.connect();
    console.log('✓ Conectado a MongoDB Atlas');
    
    return client;
  } catch (error) {
    console.error('✗ Error conectando a MongoDB:', error);
    throw error;
  }
}

export async function getDatabase(dbName: string = 'test') {
  const mongoClient = await getMongoClient();
  return mongoClient.db(dbName);
}

export default getMongoClient;
