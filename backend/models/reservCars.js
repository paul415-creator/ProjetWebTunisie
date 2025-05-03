// models/reservation.js
const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  voiture: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicule',  // Assurez-vous que cela correspond à votre modèle de véhicule
    required: true
  },
  utilisateur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  dateDebut: {
    type: Date,
    required: true
  },
  dateFin: {
    type: Date,
    required: true
  },
  prixJournalier: {
    type: Number,
    required: true
  },
  nombreJours: {
    type: Number,
    required: true
  },
  prixTotal: {
    type: Number,
    required: true
  },
  statut: {
    type: String,
    enum: ['confirmée', 'en attente', 'annulée'],
    default: 'confirmée'
  },
  dateCreation: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Reservation', reservationSchema);