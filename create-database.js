/**
 * Script para crear la base de datos 'TeamProDevsDB' en SQL Server
 * Ejecutar: node create-database.js
 */

const sql = require('mssql');

// Configuración de conexión a SQL Server (sin especificar base de datos)
const configMaster = {
  server: '127.0.0.1',
  port: 1433,
  user: 'sa',
  password: 'fabiansqlserver',
  database: 'master',
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
    connectTimeout: 15000,
    connectionTimeout: 15000,
    requestTimeout: 30000
  }
};

async function createDatabase() {
  let pool;
  try {
    console.log('🔄 Conectando a SQL Server...');
    pool = new sql.ConnectionPool(configMaster);
    await pool.connect();
    console.log('✓ Conectado a SQL Server');

    const request = pool.request();

    // Crear la base de datos si no existe
    console.log('🔄 Creando base de datos "TeamProDevsDB"...');
    await request.query(`
      IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'TeamProDevsDB')
      BEGIN
        CREATE DATABASE TeamProDevsDB;
        PRINT 'Base de datos TeamProDevsDB creada exitosamente';
      END
      ELSE
      BEGIN
        PRINT 'Base de datos TeamProDevsDB ya existe';
      END
    `);
    console.log('✓ Base de datos verificada/creada');

    // Cerrar conexión a master
    await pool.close();

    // Conectar a la nueva base de datos para crear las tablas
    console.log('🔄 Conectando a la base de datos "TeamProDevsDB"...');
    const configDB = { ...configMaster };
    configDB.options.database = 'TeamProDevsDB';

    pool = new sql.ConnectionPool(configDB);
    await pool.connect();
    console.log('✓ Conectado a la base de datos TeamProDevsDB');

    const request2 = pool.request();

    // Crear tabla Personas
    console.log('🔄 Creando tabla "Personas"...');
    await request2.query(`
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
      ELSE
      BEGIN
        PRINT 'Tabla Personas ya existe';
      END
    `);
    console.log('✓ Tabla Personas verificada/creada');

    // Crear tabla Mascotas
    console.log('🔄 Creando tabla "Mascotas"...');
    await request2.query(`
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
      ELSE
      BEGIN
        PRINT 'Tabla Mascotas ya existe';
      END
    `);
    console.log('✓ Tabla Mascotas verificada/creada');

    console.log('\n✓ Base de datos y tablas creadas exitosamente');
    console.log('\nInformación de conexión:');
    console.log('  Servidor: localhost');
    console.log('  Usuario: sa');
    console.log('  Base de datos: TeamProDevsDB');
    console.log('\nPuede iniciar el servidor con: npm run server');

    await pool.close();
  } catch (err) {
    console.error('✗ Error:', err.message);
    console.error('\nVerifique que:');
    console.error('  1. SQL Server está instalado y ejecutándose');
    console.error('  2. Las credenciales sean correctas (usuario: sa, clave: fabiansqlserver)');
    console.error('  3. El servidor está en localhost (127.0.0.1)');
    process.exit(1);
  }
}

createDatabase();
