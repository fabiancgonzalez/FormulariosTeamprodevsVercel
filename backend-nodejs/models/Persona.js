const mongoose = require('mongoose');

const personaSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  apellido: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: /.+\@.+\..+/
  },
  telefono: {
    type: String,
    trim: true
  },
  cedula: {
    type: String,
    unique: true,
    sparse: true,
    trim: true
  },
  direccion: {
    type: String,
    trim: true
  },
  ciudad: {
    type: String,
    trim: true
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
personaSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Persona', personaSchema);
