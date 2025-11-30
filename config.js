/**
 * Archivo de configuración centralizado para SQL Server
 * Edita este archivo con tus credenciales de SQL Server
 */

module.exports = {
  // Configuración de SQL Server
  database: {
    server: 'localhost\\SQLEXPRESS',    // Usar instancia SQLEXPRESS
    port: 1433,                    // Puerto (default: 1433)
    user: 'sa',                    // Usuario
    password: 'fabiansqlserver',   // Contraseña
    database: 'TeamProDevsDB',     // Nombre de la base de datos
    trustServerCertificate: true,  // Para desarrollo (no usar en producción)
    encrypt: false,                // Sin encriptación (para desarrollo)
    connectTimeout: 15000          // Timeout de conexión en ms
  },

  // Configuración de Express
  server: {
    port: 3000,
    host: 'localhost'
  },

  // Configuración de CORS
  cors: {
    origin: 'http://localhost:4200',
    credentials: true
  }
};
