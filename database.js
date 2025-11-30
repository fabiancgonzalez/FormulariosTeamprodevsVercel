const sql = require('mssql');

// Configuración de conexión a SQL Server
const config = {
  server: '127.0.0.1',
  port: 1433,
  user: 'sa',
  password: 'fabiansqlserver',
  database: 'TeamProDevsDB',
  authentication: {
    type: 'default',
    options: {
      userName: 'sa',
      password: 'fabiansqlserver'
    }
  },
  options: {
    encrypt: false,
    trustServerCertificate: true,
    enableKeepAlive: true,
    connectTimeout: 15000,
    connectionTimeout: 15000,
    requestTimeout: 30000,
    isolation: 'READ_COMMITTED'
  }
};

let pool;

// Crear pool de conexiones
async function connectDB() {
  try {
    pool = new sql.ConnectionPool(config);
    await pool.connect();
    console.log('✓ Conectado a SQL Server exitosamente');
    console.log(`Servidor: ${config.server}:${config.port}`);
    console.log(`Base de datos: ${config.database}`);
    await initializeDatabase();
    return pool;
  } catch (err) {
    console.error('✗ Error al conectar con SQL Server:', err.message);
    throw err;
  }
}

// Inicializar las tablas de la base de datos
async function initializeDatabase() {
  try {
    const request = pool.request();

    // Crear tabla Personas
    await request.query(`
      IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'Personas')
      BEGIN
        CREATE TABLE Personas (
          id INT PRIMARY KEY IDENTITY(1,1),
          nombre NVARCHAR(100) NOT NULL,
          apellido NVARCHAR(100) NOT NULL,
          email NVARCHAR(100),
          telefono NVARCHAR(20),
          fecha_creacion DATETIME DEFAULT GETDATE()
        );
        PRINT 'Tabla Personas creada';
      END
    `);

    // Crear tabla Mascotas
    await request.query(`
      IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'Mascotas')
      BEGIN
        CREATE TABLE Mascotas (
          id INT PRIMARY KEY IDENTITY(1,1),
          nombre NVARCHAR(100) NOT NULL,
          tipo NVARCHAR(50) NOT NULL,
          raza NVARCHAR(100),
          edad INT,
          id_persona INT,
          fecha_creacion DATETIME DEFAULT GETDATE(),
          FOREIGN KEY (id_persona) REFERENCES Personas(id) ON DELETE CASCADE
        );
        PRINT 'Tabla Mascotas creada';
      END
    `);

    console.log('✓ Tablas verificadas/creadas correctamente');
  } catch (err) {
    console.error('Error al inicializar la base de datos:', err.message);
    throw err;
  }
}

// Función para obtener el pool
function getPool() {
  if (!pool) {
    throw new Error('Pool de conexiones no inicializado');
  }
  return pool;
}

// Función para cerrar la conexión
async function closeDB() {
  if (pool) {
    await pool.close();
    console.log('✓ Conexión cerrada');
  }
}

module.exports = {
  connectDB,
  getPool,
  closeDB,
  sql
};
