// backend/routes/car.js
const express = require('express');
const router = express.Router();
const Vehicule = require('../models/vehicule');  // et non '../models/Vehicule'

// Pour l'importation du middleware d'authentification

//const auth = require('../middleware/auth'); 


// Route pour obtenir toutes les voitures disponibles
router.get('/available', async (req, res) => {
  try {
    const cars = await Vehicule .find({ disponible: true });
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




// Route pour ajouter un nouveau véhicule (temporairement sans authentification)
// RETIRÉ LE MIDDLEWARE auth POUR LE TEST
router.post('/', async (req, res) => {
    try {
      const newVehicule = new Vehicule(req.body);
      const savedVehicule = await newVehicule.save();
      
      res.status(201).json(savedVehicule);
    } catch (error) {
      console.error('Erreur lors de l\'ajout d\'un véhicule:', error);
      res.status(400).json({ error: error.message });
    }
  });


module.exports = router;


