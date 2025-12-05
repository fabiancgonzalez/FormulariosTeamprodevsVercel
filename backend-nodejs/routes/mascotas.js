const express = require('express');
const router = express.Router();

// GET - Obtener todas las mascotas
router.get('/', async (req, res) => {
  try {
    const mascotas = await req.prisma.mascota.findMany({
      orderBy: { createdAt: 'desc' },
      include: { persona: true }
    });
    res.json(mascotas);
  } catch (error) {
    console.error('Error obteniendo mascotas:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET - Obtener mascotas por persona
router.get('/persona/:personaId', async (req, res) => {
  try {
    const mascotas = await req.prisma.mascota.findMany({
      where: { personaId: req.params.personaId },
      include: { persona: true }
    });
    res.json(mascotas);
  } catch (error) {
    console.error('Error obteniendo mascotas por persona:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET - Obtener una mascota por ID
router.get('/:id', async (req, res) => {
  try {
    const mascota = await req.prisma.mascota.findUnique({
      where: { id: req.params.id },
      include: { persona: true }
    });
    if (!mascota) {
      return res.status(404).json({ error: 'Mascota no encontrada' });
    }
    res.json(mascota);
  } catch (error) {
    console.error('Error obteniendo mascota:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST - Crear una nueva mascota
router.post('/', async (req, res) => {
  try {
    // Verificar que la persona existe
    const persona = await req.prisma.persona.findUnique({
      where: { id: req.body.personaId }
    });
    if (!persona) {
      return res.status(404).json({ error: 'Persona no encontrada' });
    }

    const mascota = await req.prisma.mascota.create({
      data: {
        nombre: req.body.nombre,
        tipo: req.body.tipo,
        raza: req.body.raza,
        color: req.body.color,
        edad: req.body.edad ? parseInt(req.body.edad) : null,
        descripcion: req.body.descripcion,
        foto: req.body.foto,
        personaId: req.body.personaId
      },
      include: { persona: true }
    });
    res.status(201).json(mascota);
  } catch (error) {
    console.error('Error creando mascota:', error);
    res.status(400).json({ error: error.message });
  }
});

// PUT - Actualizar una mascota
router.put('/:id', async (req, res) => {
  try {
    // Si se está actualizando personaId, verificar que existe
    if (req.body.personaId) {
      const persona = await req.prisma.persona.findUnique({
        where: { id: req.body.personaId }
      });
      if (!persona) {
        return res.status(404).json({ error: 'Persona no encontrada' });
      }
    }

    const mascota = await req.prisma.mascota.update({
      where: { id: req.params.id },
      data: {
        nombre: req.body.nombre,
        tipo: req.body.tipo,
        raza: req.body.raza,
        color: req.body.color,
        edad: req.body.edad ? parseInt(req.body.edad) : null,
        descripcion: req.body.descripcion,
        foto: req.body.foto,
        personaId: req.body.personaId
      },
      include: { persona: true }
    });

    if (!mascota) {
      return res.status(404).json({ error: 'Mascota no encontrada' });
    }
    res.json(mascota);
  } catch (error) {
    console.error('Error actualizando mascota:', error);
    res.status(400).json({ error: error.message });
  }
});

// DELETE - Eliminar una mascota
router.delete('/:id', async (req, res) => {
  try {
    await req.prisma.mascota.delete({
      where: { id: req.params.id }
    });
    res.json({ message: 'Mascota eliminada correctamente' });
  } catch (error) {
    console.error('Error eliminando mascota:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
