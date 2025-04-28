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




////////////////////////////////////////////////////////////////////////////////:


// Route pour obtenir les détails d'une voiture spécifique
router.get('/:id', async (req, res) => {
    try {
      const car = await Car.findById(req.params.id);
      
      if (!car) {
        return res.status(404).json({ error: 'Voiture non trouvée' });
      }
      
      res.json(car);
    } catch (error) {
      console.error('Erreur lors de la récupération des détails de la voiture:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  });



  // Route pour ajouter une nouvelle voiture
// Si vous utilisez l'authentification, remplacez router.post('/', async...) par router.post('/', auth, async...)
router.post('/', async (req, res) => {
    try {
      const newCar = new Car(req.body);
      const savedCar = await newCar.save();
      
      res.status(201).json(savedCar);
    } catch (error) {
      console.error('Erreur lors de l\'ajout d\'une voiture:', error);
      res.status(400).json({ error: error.message });
    }


});




module.exports = router;


