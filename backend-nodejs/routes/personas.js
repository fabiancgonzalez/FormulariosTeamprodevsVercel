const express = require('express');
const router = express.Router();

// GET - Obtener todas las personas
router.get('/', async (req, res) => {
  try {
    const personas = await req.prisma.persona.findMany({
      orderBy: { createdAt: 'desc' },
      include: { mascotas: true }
    });
    res.json(personas);
  } catch (error) {
    console.error('Error obteniendo personas:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET - Obtener una persona por ID
router.get('/:id', async (req, res) => {
  try {
    const persona = await req.prisma.persona.findUnique({
      where: { id: req.params.id },
      include: { mascotas: true }
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

// POST - Crear una nueva persona
router.post('/', async (req, res) => {
  try {
    const persona = await req.prisma.persona.create({
      data: {
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        email: req.body.email,
        telefono: req.body.telefono,
        cedula: req.body.cedula,
        direccion: req.body.direccion,
        ciudad: req.body.ciudad
      },
      include: { mascotas: true }
    });
    res.status(201).json(persona);
  } catch (error) {
    console.error('Error creando persona:', error);
    res.status(400).json({ error: error.message });
  }
});

// PUT - Actualizar una persona
router.put('/:id', async (req, res) => {
  try {
    const persona = await req.prisma.persona.update({
      where: { id: req.params.id },
      data: {
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        email: req.body.email,
        telefono: req.body.telefono,
        cedula: req.body.cedula,
        direccion: req.body.direccion,
        ciudad: req.body.ciudad
      },
      include: { mascotas: true }
    });
    res.json(persona);
  } catch (error) {
    console.error('Error actualizando persona:', error);
    res.status(400).json({ error: error.message });
  }
});

// DELETE - Eliminar una persona
router.delete('/:id', async (req, res) => {
  try {
    // Primero eliminar mascotas relacionadas
    await req.prisma.mascota.deleteMany({
      where: { personaId: req.params.id }
    });
    
    // Luego eliminar la persona
    await req.prisma.persona.delete({
      where: { id: req.params.id }
    });
    
    res.json({ message: 'Persona eliminada correctamente' });
  } catch (error) {
    console.error('Error eliminando persona:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
