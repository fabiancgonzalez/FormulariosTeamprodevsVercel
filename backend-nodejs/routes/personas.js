const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');

// Middleware para buscar por ID (string o ObjectId)
const findByIdMiddleware = (req, res, next) => {
  req.recordId = req.params.id;
  next();
};

// GET - Obtener todas las personas
router.get('/', async (req, res) => {
  try {
    const db = req.db;
    const personas = await db.collection('personas').find({}).sort({ createdAt: -1 }).toArray();
    res.json(personas);
  } catch (error) {
    console.error('Error obteniendo personas:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// POST - Crear una nueva persona
router.post('/', async (req, res) => {
  try {
    const db = req.db;
    const persona = {
      nombre: req.body.nombre,
      fechaNacimiento: req.body.fechaNacimiento || '',
      estatura: req.body.estatura ? req.body.estatura.toString() : '',
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

// GET - Obtener una persona por ID
router.get('/:id', findByIdMiddleware, async (req, res) => {
  try {
    const db = req.db;
    const persona = await db.collection('personas').findOne({ 
      $or: [
        { _id: new ObjectId(req.params.id) },
        { _id: req.params.id }
      ]
    });
    if (!persona) {
      return res.status(404).json({ error: 'Persona no encontrada' });
    }
    res.json(persona);
  } catch (error) {
    console.error('Error obteniendo persona:', error);
    res.status(500).json({ error: error.message });
  }
});

// PUT - Actualizar una persona
router.put('/:id', findByIdMiddleware, async (req, res) => {
  try {
    const db = req.db;
    const update = {
      nombre: req.body.nombre,
      fechaNacimiento: req.body.fechaNacimiento || '',
      estatura: req.body.estatura ? req.body.estatura.toString() : '',
      updatedAt: new Date()
    };
    const result = await db.collection('personas').findOneAndUpdate(
      { 
        $or: [
          { _id: new ObjectId(req.params.id) },
          { _id: req.params.id }
        ]
      },
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
router.delete('/:id', findByIdMiddleware, async (req, res) => {
  try {
    const db = req.db;
    
    // Primero eliminar mascotas relacionadas
    await db.collection('mascotas').deleteMany({ personaId: req.params.id });
    
    // Luego eliminar la persona
    const result = await db.collection('personas').deleteOne({ 
      $or: [
        { _id: new ObjectId(req.params.id) },
        { _id: req.params.id }
      ]
    });
    
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
