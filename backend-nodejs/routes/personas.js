const express = require('express');
const router = express.Router();
const Persona = require('../models/Persona');

// GET - Obtener todas las personas
router.get('/', async (req, res) => {
  try {
    const personas = await Persona.find().sort({ createdAt: -1 });
    res.json(personas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET - Obtener una persona por ID
router.get('/:id', async (req, res) => {
  try {
    const persona = await Persona.findById(req.params.id);
    if (!persona) {
      return res.status(404).json({ error: 'Persona no encontrada' });
    }
    res.json(persona);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST - Crear una nueva persona
router.post('/', async (req, res) => {
  try {
    const persona = new Persona(req.body);
    const result = await persona.save();
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT - Actualizar una persona
router.put('/:id', async (req, res) => {
  try {
    const persona = await Persona.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!persona) {
      return res.status(404).json({ error: 'Persona no encontrada' });
    }
    res.json(persona);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE - Eliminar una persona
router.delete('/:id', async (req, res) => {
  try {
    const persona = await Persona.findByIdAndDelete(req.params.id);
    if (!persona) {
      return res.status(404).json({ error: 'Persona no encontrada' });
    }
    res.json({ message: 'Persona eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
