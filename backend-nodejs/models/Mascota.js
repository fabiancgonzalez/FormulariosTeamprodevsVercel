const mongoose = require('mongoose');

const mascotaSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  tipo: {
    type: String,
    required: true,
    enum: ['perro', 'gato', 'pajaro', 'conejo', 'otro'],
    trim: true
  },
  raza: {
    type: String,
    trim: true
  },
  color: {
    type: String,
    trim: true
  },
  edad: {
    type: Number,
    min: 0
  },
  personaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Persona',
    required: true
  },
  descripcion: {
    type: String,
    trim: true
  },
  foto: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Actualizar el campo updatedAt antes de guardar
mascotaSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Mascota', mascotaSchema);
