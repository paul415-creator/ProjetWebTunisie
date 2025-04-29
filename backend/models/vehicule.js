// backend/models/Vehicule.js
const mongoose = require('mongoose');

const vehiculeSchema = new mongoose.Schema({
  marque: {
    type: String,
    required: [true, 'La marque est requise'],
    trim: true
  },
  modele: {
    type: String,
    required: [true, 'Le modèle est requis'],
    trim: true
  },
  annee: {
    type: Number,
    required: [true, "L'année est requise"]
  },
  prix: {
    type: Number,
    required: [true, 'Le prix est requis']
  },
  disponible: {
    type: Boolean,
    default: true
  },
  images: {
    type: [String],
    default: []
  },
  description: {
    type: String,
    trim: true
  },
  caracteristiques: {
    places: Number,
    portes: Number,
    transmission: String,
    carburant: String
  },
  dateAjout: {
    type: Date,
    default: Date.now
  }
});

// Le troisième paramètre 'voitures' spécifie que les données seront stockées 
// dans la collection 'voitures' de MongoDB
const Vehicule = mongoose.model('Vehicule', vehiculeSchema);


module.exports = Vehicule;