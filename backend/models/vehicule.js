// backend/models/Vehicle.js
const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  make: {
    type: String,
    required: [true, 'La marque du véhicule est requise']
  },
  model: {
    type: String,
    required: [true, 'Le modèle du véhicule est requis']
  },
  year: {
    type: Number,
    required: [true, "L'année du véhicule est requise"]
  },
  type: {
    type: String,
    required: [true, 'Le type de véhicule est requis'],
    enum: ['Compacte', 'SUV', 'Berline', 'Berline premium', 'Cabriolet', 'Utilitaire']
  },
  fuel: {
    type: String,
    required: [true, 'Le type de carburant est requis'],
    enum: ['Essence', 'Diesel', 'Electrique', 'Hybride']
  },
  pricePerDay: {
    type: Number,
    required: [true, 'Le prix par jour est requis']
  },
  available: {
    type: Boolean,
    default: true
  },
  description: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Vehicle = mongoose.model('Vehicle', vehicleSchema);

module.exports = Vehicle;