const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');

// GET - Obtener todas las mascotas
router.get('/', async (req, res) => {
  try {
    const db = req.db;
    const mascotas = await db.collection('mascotas').find({}).sort({ createdAt: -1 }).toArray();
    res.json(mascotas);
  } catch (error) {
    console.error('Error obteniendo mascotas:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET - Obtener mascotas por persona (DEBE IR ANTES de /:id)
router.get('/persona/:personaId', async (req, res) => {
  try {
    const db = req.db;
    const mascotas = await db.collection('mascotas')
      .find({ personaId: req.params.personaId })
      .toArray();
    res.json(mascotas);
  } catch (error) {
    console.error('Error obteniendo mascotas por persona:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST - Crear una nueva mascota (DEBE IR ANTES de /:id para evitar confusión)
router.post('/', async (req, res) => {
  try {
    const db = req.db;
    
    // Verificar que la persona existe
    const persona = await db.collection('personas').findOne({ _id: new ObjectId(req.body.personaId) });
    if (!persona) {
      return res.status(404).json({ error: 'Persona no encontrada' });
    }

    const mascota = {
      nombre: req.body.nombre,
      tipo: req.body.tipo,
      raza: req.body.raza,
      color: req.body.color,
      edad: req.body.edad ? parseInt(req.body.edad) : null,
      descripcion: req.body.descripcion,
      foto: req.body.foto,
      personaId: req.body.personaId,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await db.collection('mascotas').insertOne(mascota);
    res.status(201).json({ ...mascota, _id: result.insertedId });
  } catch (error) {
    console.error('Error creando mascota:', error);
    res.status(400).json({ error: error.message });
  }
});

// GET - Obtener una mascota por ID
router.get('/:id', async (req, res) => {
  try {
    const db = req.db;
    const mascota = await db.collection('mascotas').findOne({ _id: new ObjectId(req.params.id) });
    if (!mascota) {
      return res.status(404).json({ error: 'Mascota no encontrada' });
    }
    res.json(mascota);
  } catch (error) {
    console.error('Error obteniendo mascota:', error);
    res.status(500).json({ error: error.message });
  }
});

// PUT - Actualizar una mascota
router.put('/:id', async (req, res) => {
  try {
    const db = req.db;
    
    // Si se está actualizando personaId, verificar que existe
    if (req.body.personaId) {
      const persona = await db.collection('personas').findOne({ _id: new ObjectId(req.body.personaId) });
      if (!persona) {
        return res.status(404).json({ error: 'Persona no encontrada' });
      }
    }

    const update = {
      nombre: req.body.nombre,
      tipo: req.body.tipo,
      raza: req.body.raza,
      color: req.body.color,
      edad: req.body.edad ? parseInt(req.body.edad) : null,
      descripcion: req.body.descripcion,
      foto: req.body.foto,
      personaId: req.body.personaId,
      updatedAt: new Date()
    };

    const result = await db.collection('mascotas').findOneAndUpdate(
      { _id: new ObjectId(req.params.id) },
      { $set: update },
      { returnDocument: 'after' }
    );

    if (!result.value) {
      return res.status(404).json({ error: 'Mascota no encontrada' });
    }
    res.json(result.value);
  } catch (error) {
    console.error('Error actualizando mascota:', error);
    res.status(400).json({ error: error.message });
  }
});

// DELETE - Eliminar una mascota
router.delete('/:id', async (req, res) => {
  try {
    const db = req.db;
    const result = await db.collection('mascotas').deleteOne({ _id: new ObjectId(req.params.id) });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Mascota no encontrada' });
    }
    
    res.json({ message: 'Mascota eliminada correctamente' });
  } catch (error) {
    console.error('Error eliminando mascota:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
