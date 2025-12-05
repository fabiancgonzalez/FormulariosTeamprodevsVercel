const express = require('express');
const router = express.Router();

// GET - Obtener todas las personas
router.get('/', async (req, res) => {
  try {
    console.log('[PERSONAS] GET / - req.db:', typeof req.db);
    const db = req.db;
    if (!db) {
      return res.status(500).json({ error: 'DB not available in route' });
    }
    const personas = await db.collection('personas').find({}).sort({ createdAt: -1 }).toArray();
    console.log('[PERSONAS] ✓ Encontradas', personas.length, 'personas');
    res.json(personas);
  } catch (error) {
    console.error('[PERSONAS] Error obteniendo personas:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// GET - Obtener una persona por ID
router.get('/:id', async (req, res) => {
  try {
    const { ObjectId } = require('mongodb');
    const db = req.db;
    const persona = await db.collection('personas').findOne({ _id: new ObjectId(req.params.id) });
    if (!persona) {
      return res.status(404).json({ error: 'Persona no encontrada' });
    }
    res.json(persona);
  } catch (error) {
    console.error('Error obteniendo persona:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST - Crear una nueva persona
router.post('/', async (req, res) => {
  try {
    const db = req.db;
    const persona = {
      nombre: req.body.nombre,
      apellido: req.body.apellido,
      email: req.body.email,
      telefono: req.body.telefono,
      cedula: req.body.cedula,
      direccion: req.body.direccion,
      ciudad: req.body.ciudad,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const result = await db.collection('personas').insertOne(persona);
    res.status(201).json({ ...persona, _id: result.insertedId });
  } catch (error) {
    console.error('Error creando persona:', error);
    res.status(400).json({ error: error.message });
  }
});

// PUT - Actualizar una persona
router.put('/:id', async (req, res) => {
  try {
    const { ObjectId } = require('mongodb');
    const db = req.db;
    const update = {
      nombre: req.body.nombre,
      apellido: req.body.apellido,
      email: req.body.email,
      telefono: req.body.telefono,
      cedula: req.body.cedula,
      direccion: req.body.direccion,
      ciudad: req.body.ciudad,
      updatedAt: new Date()
    };
    const result = await db.collection('personas').findOneAndUpdate(
      { _id: new ObjectId(req.params.id) },
      { $set: update },
      { returnDocument: 'after' }
    );
    if (!result.value) {
      return res.status(404).json({ error: 'Persona no encontrada' });
    }
    res.json(result.value);
  } catch (error) {
    console.error('Error actualizando persona:', error);
    res.status(400).json({ error: error.message });
  }
});

// DELETE - Eliminar una persona
router.delete('/:id', async (req, res) => {
  try {
    const { ObjectId } = require('mongodb');
    const db = req.db;
    
    // Primero eliminar mascotas relacionadas
    await db.collection('mascotas').deleteMany({ personaId: req.params.id });
    
    // Luego eliminar la persona
    const result = await db.collection('personas').deleteOne({ _id: new ObjectId(req.params.id) });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Persona no encontrada' });
    }
    
    res.json({ message: 'Persona eliminada correctamente' });
  } catch (error) {
    console.error('Error eliminando persona:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
