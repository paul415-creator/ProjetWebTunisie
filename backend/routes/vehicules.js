// backend/routes/car.js
const express = require('express');
const router = express.Router();
const Car = require('../models/vehicule');

// Route pour obtenir toutes les voitures disponibles
router.get('/available', async (req, res) => {
  try {
    const cars = await Car.find({ disponible: true });
    res.json(cars);
  } catch (error) {
    console.error('Erreur lors de la récupération des voitures:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;