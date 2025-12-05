const express = require('express');
const router = express.Router();
const Mascota = require('../models/Mascota');
const Persona = require('../models/Persona');

// GET - Obtener todas las mascotas
router.get('/', async (req, res) => {
  try {
    const mascotas = await Mascota.find()
      .populate('personaId', 'nombre apellido email')
      .sort({ createdAt: -1 });
    res.json(mascotas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET - Obtener mascotas por persona
router.get('/persona/:personaId', async (req, res) => {
  try {
    const mascotas = await Mascota.find({ personaId: req.params.personaId })
      .populate('personaId', 'nombre apellido email');
    res.json(mascotas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET - Obtener una mascota por ID
router.get('/:id', async (req, res) => {
  try {
    const mascota = await Mascota.findById(req.params.id)
      .populate('personaId', 'nombre apellido email');
    if (!mascota) {
      return res.status(404).json({ error: 'Mascota no encontrada' });
    }
    res.json(mascota);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST - Crear una nueva mascota
router.post('/', async (req, res) => {
  try {
    // Verificar que la persona existe
    const persona = await Persona.findById(req.body.personaId);
    if (!persona) {
      return res.status(404).json({ error: 'Persona no encontrada' });
    }

    const mascota = new Mascota(req.body);
    const result = await mascota.save();
    await result.populate('personaId', 'nombre apellido email');
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT - Actualizar una mascota
router.put('/:id', async (req, res) => {
  try {
    // Si se está actualizando personaId, verificar que existe
    if (req.body.personaId) {
      const persona = await Persona.findById(req.body.personaId);
      if (!persona) {
        return res.status(404).json({ error: 'Persona no encontrada' });
      }
    }

    const mascota = await Mascota.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('personaId', 'nombre apellido email');

    if (!mascota) {
      return res.status(404).json({ error: 'Mascota no encontrada' });
    }
    res.json(mascota);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE - Eliminar una mascota
router.delete('/:id', async (req, res) => {
  try {
    const mascota = await Mascota.findByIdAndDelete(req.params.id);
    if (!mascota) {
      return res.status(404).json({ error: 'Mascota no encontrada' });
    }
    res.json({ message: 'Mascota eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
