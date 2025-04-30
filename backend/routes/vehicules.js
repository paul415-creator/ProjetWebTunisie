// backend/routes/car.js
const express = require('express');
const router = express.Router();
const Vehicule = require('../models/vehicule');  // et non '../models/Vehicule'
const mongoose = require('mongoose'); // J'importe 


// Pour l'importation du middleware d'authentification

//const auth = require('../middleware/auth'); 


// Route pour obtenir toutes les voitures disponibles
router.get('/available', async (req, res) => {
  try {
    const cars = await Vehicule.find({ disponible: true });
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
      const car = await Vehicule.findById(req.params.id);
      
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
// Dans backend/routes/vehicules.js ou backend/routes/car.js


//Les routes les plus spécifiques doivent toujours venir
//  avant les routes plus génériques avec des paramètres :

// soit /test d'abord et après /:id



router.delete('/test', (req, res) => {
    res.json({ message: 'Route DELETE fonctionne!' });
  });

// Dans backend/routes/vehicules.js ou backend/routes/car.js

router.delete('/:id', async (req, res) => {
    try {
      const id = req.params.id;
      
      // Vérifier si l'ID est valide
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'ID de véhicule invalide' });
        //j'avais une erreur avec cette ligne car je n'aportais pas mongoose 
      }
      
      // Rechercher et supprimer le véhicule
      const deletedVehicule = await Vehicule.findByIdAndDelete(id);
      
      // Si aucun véhicule n'est trouvé avec cet ID
      if (!deletedVehicule) {
        return res.status(404).json({ error: 'Véhicule non trouvé' });
      }
      
      // Retourner une confirmation de suppression
      res.json({ message: 'Véhicule supprimé avec succès', vehicule: deletedVehicule });
      
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  });


  



module.exports = router;


