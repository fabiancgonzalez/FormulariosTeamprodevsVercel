require('dotenv').config();
const mongoose = require('mongoose');

// Opciones para la conexión de MongoDB
const mongooseOptions = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

// Intentar conexión con la URI completa
async function connectMongoDB() {
  try {
    // Método 1: Usando la URI directa sin encoding
    const uri = `mongodb+srv://ceferinomonier:Fabian0453*@cluster0.igvuqqt.mongodb.net/?appName=Cluster0&retryWrites=true&w=majority`;
    
    console.log('Intentando conexión a MongoDB...');
    console.log('URI:', uri.replace(/:[^:@]*@/, ':****@'));
    
    await mongoose.connect(uri, mongooseOptions);
    console.log('✓ Conectado a MongoDB Atlas exitosamente');
    return true;
  } catch (error) {
    console.error('✗ Error con método 1:', error.message);
    
    // Método 2: Intentar con encoding
    try {
      const user = process.env.MONGO_USER || 'ceferinomonier';
      const password = encodeURIComponent(process.env.MONGO_PASSWORD || 'Fabian0453*');
      const cluster = process.env.MONGO_CLUSTER || 'cluster0.igvuqqt.mongodb.net';
      
      const uri2 = `mongodb+srv://${user}:${password}@${cluster}/?appName=Cluster0&retryWrites=true&w=majority`;
      
      console.log('Intentando conexión con método 2 (URI codificada)...');
      console.log('URI:', uri2.replace(/:[^:@]*@/, ':****@'));
      
      await mongoose.connect(uri2, mongooseOptions);
      console.log('✓ Conectado a MongoDB Atlas exitosamente');
      return true;
    } catch (error2) {
      console.error('✗ Error con método 2:', error2.message);
      throw error2;
    }
  }
}

module.exports = { connectMongoDB };
