const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sql = require('mssql');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configuración de SQL Server (SIMPLIFICADA - Igual que test-connection.js)
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
    connectTimeout: 15000,
    connectionTimeout: 15000,
    requestTimeout: 30000,
    isolation: 'READ_COMMITTED'
  }
};

let pool;

// Inicializar conexión
async function initializePool() {
  try {
    console.log('🔄 Conectando a SQL Server...');
    pool = new sql.ConnectionPool(config);
    await pool.connect();
    console.log('✓ Conectado a SQL Server exitosamente');
    console.log(`  Servidor: ${config.server}:${config.port}`);
    console.log(`  Base de datos: ${config.database}`);
    console.log('');
    
    // Crear tablas si no existen
    await initializeDatabase();
    return true;
  } catch (err) {
    console.error('✗ Error al conectar:', err.message);
    throw err;
  }
}

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
          fecha_nacimiento DATE,
          estatura DECIMAL(5,2),
          fecha_creacion DATETIME DEFAULT GETDATE()
        );
      END
    `);

    // Agregar columnas si no existen (para bases de datos existentes)
    await request.query(`
      IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Personas' AND COLUMN_NAME = 'fecha_nacimiento')
      BEGIN
        ALTER TABLE Personas ADD fecha_nacimiento DATE;
      END
    `);

    await request.query(`
      IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Personas' AND COLUMN_NAME = 'estatura')
      BEGIN
        ALTER TABLE Personas ADD estatura DECIMAL(5,2);
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
          color NVARCHAR(50),
          edad INT,
          id_persona INT,
          fecha_creacion DATETIME DEFAULT GETDATE(),
          FOREIGN KEY (id_persona) REFERENCES Personas(id) ON DELETE CASCADE
        );
      END
    `);

    // Agregar columna color si no existe
    await request.query(`
      IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Mascotas' AND COLUMN_NAME = 'color')
      BEGIN
        ALTER TABLE Mascotas ADD color NVARCHAR(50);
      END
    `);

    console.log('✓ Tablas verificadas/creadas correctamente');
  } catch (err) {
    console.error('Error al crear tablas:', err.message);
  }
}

// ========== RUTAS PARA PERSONAS ==========

app.get('/api/personas', async (req, res) => {
  try {
    const result = await pool.request().query('SELECT * FROM Personas ORDER BY fecha_creacion DESC');
    res.json(result.recordset);
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/personas/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM Personas WHERE id = @id');
    
    res.json(result.recordset[0] || null);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/personas', async (req, res) => {
  try {
    const { nombre, apellido, email, telefono, fecha_nacimiento, estatura } = req.body;

    if (!nombre || !apellido) {
      res.status(400).json({ error: 'Nombre y apellido son requeridos' });
      return;
    }

    const result = await pool.request()
      .input('nombre', sql.NVarChar(100), nombre)
      .input('apellido', sql.NVarChar(100), apellido)
      .input('email', sql.NVarChar(100), email || null)
      .input('telefono', sql.NVarChar(20), telefono || null)
      .input('fecha_nacimiento', sql.Date, fecha_nacimiento || null)
      .input('estatura', sql.Decimal(5,2), estatura || null)
      .query('INSERT INTO Personas (nombre, apellido, email, telefono, fecha_nacimiento, estatura) VALUES (@nombre, @apellido, @email, @telefono, @fecha_nacimiento, @estatura); SELECT @@IDENTITY as id');
    
    const id = result.recordset[0].id;
    res.json({ id, nombre, apellido, email, telefono, fecha_nacimiento, estatura });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/personas/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, apellido, email, telefono, fecha_nacimiento, estatura } = req.body;

    console.log(`📝 Actualizando persona ID ${id}:`, req.body);

    await pool.request()
      .input('id', sql.Int, id)
      .input('nombre', sql.NVarChar(100), nombre)
      .input('apellido', sql.NVarChar(100), apellido)
      .input('email', sql.NVarChar(100), email || null)
      .input('telefono', sql.NVarChar(20), telefono || null)
      .input('fecha_nacimiento', sql.Date, fecha_nacimiento || null)
      .input('estatura', sql.Decimal(5,2), estatura || null)
      .query('UPDATE Personas SET nombre = @nombre, apellido = @apellido, email = @email, telefono = @telefono, fecha_nacimiento = @fecha_nacimiento, estatura = @estatura WHERE id = @id');
    
    console.log(`✓ Persona ${id} actualizada exitosamente`);
    res.json({ id: parseInt(id), nombre, apellido, email, telefono, fecha_nacimiento, estatura });
  } catch (err) {
    console.error('Error al actualizar persona:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/personas/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM Personas WHERE id = @id');
    
    res.json({ success: true, deletedId: id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ========== RUTAS PARA MASCOTAS ==========

app.get('/api/mascotas', async (req, res) => {
  try {
    const result = await pool.request().query('SELECT * FROM Mascotas ORDER BY fecha_creacion DESC');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/personas/:id/mascotas', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.request()
      .input('id_persona', sql.Int, id)
      .query('SELECT * FROM Mascotas WHERE id_persona = @id_persona ORDER BY fecha_creacion DESC');
    
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/mascotas', async (req, res) => {
  try {
    const { nombre, tipo, raza, color, edad, id_persona } = req.body;

    if (!nombre || !tipo) {
      res.status(400).json({ error: 'Nombre y tipo son requeridos' });
      return;
    }

    const result = await pool.request()
      .input('nombre', sql.NVarChar(100), nombre)
      .input('tipo', sql.NVarChar(50), tipo)
      .input('raza', sql.NVarChar(100), raza || null)
      .input('color', sql.NVarChar(50), color || null)
      .input('edad', sql.Int, edad || null)
      .input('id_persona', sql.Int, id_persona || null)
      .query('INSERT INTO Mascotas (nombre, tipo, raza, color, edad, id_persona) VALUES (@nombre, @tipo, @raza, @color, @edad, @id_persona); SELECT @@IDENTITY as id');
    
    const id = result.recordset[0].id;
    res.json({ id, nombre, tipo, raza, color, edad, id_persona });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/mascotas/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, tipo, raza, color, edad, id_persona } = req.body;

    console.log(`🐾 Actualizando mascota ID ${id}:`, req.body);

    await pool.request()
      .input('id', sql.Int, id)
      .input('nombre', sql.NVarChar(100), nombre)
      .input('tipo', sql.NVarChar(50), tipo)
      .input('raza', sql.NVarChar(100), raza || null)
      .input('color', sql.NVarChar(50), color || null)
      .input('edad', sql.Int, edad || null)
      .input('id_persona', sql.Int, id_persona || null)
      .query('UPDATE Mascotas SET nombre = @nombre, tipo = @tipo, raza = @raza, color = @color, edad = @edad, id_persona = @id_persona WHERE id = @id');
    
    console.log(`✓ Mascota ${id} actualizada exitosamente`);
    res.json({ id: parseInt(id), nombre, tipo, raza, color, edad, id_persona });
  } catch (err) {
    console.error('Error al actualizar mascota:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/mascotas/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM Mascotas WHERE id = @id');
    
    res.json({ success: true, deletedId: id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ========== REPORTES ==========

app.get('/api/reporte/personas-mascotas', async (req, res) => {
  try {
    // Obtener todas las personas
    const personasResult = await pool.request().query('SELECT * FROM Personas ORDER BY nombre, apellido');
    const personas = personasResult.recordset;

    // Para cada persona, obtener sus mascotas
    const personasConMascotas = await Promise.all(
      personas.map(async (persona) => {
        const mascotasResult = await pool.request()
          .input('id_persona', sql.Int, persona.id)
          .query('SELECT * FROM Mascotas WHERE id_persona = @id_persona');
        
        return {
          ...persona,
          mascotas: mascotasResult.recordset
        };
      })
    );

    res.json(personasConMascotas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend funcionando correctamente' });
});

// Iniciar servidor
async function startServer() {
  try {
    await initializePool();
    
    app.listen(PORT, () => {
      console.log(`✓ Servidor ejecutándose en http://localhost:${PORT}`);
      console.log('Presiona Ctrl+C para detener el servidor\n');
    });
  } catch (err) {
    console.error('Error al iniciar el servidor:', err.message);
    process.exit(1);
  }
}

process.on('SIGINT', async () => {
  console.log('\nCerrando servidor...');
  if (pool) await pool.close();
  process.exit(0);
});

startServer();
