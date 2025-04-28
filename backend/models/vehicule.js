// backend/models/Car.js
const mongoose = require('mongoose');

const CarSchema = new mongoose.Schema({
  marque: {
    type: String,
    required: true,
    trim: true
  },
  modele: {
    type: String,
    required: true,
    trim: true
  },
  annee: {
    type: Number,
    required: true
  },
  prix: {
    type: Number,
    required: true
  },
  disponible: {
    type: Boolean,
    default: true
  },
  description: {
    type: String,
    trim: true
  }
});

module.exports = mongoose.model('Car', CarSchema);