// routes/reservationRoutes.js
const express = require('express');
const router = express.Router();

// Route temporaire simple pour créer une réservation
router.post('/', (req, res) => {
  try {
    console.log('Données de réservation reçues:', req.body);
    // Ici, vous pourriez normalement sauvegarder dans la base de données
    res.status(201).json({ 
      message: 'Réservation créée avec succès', 
      data: {
        _id: 'temp-' + Date.now(), // ID temporaire
        ...req.body,
        dateCreation: new Date()
      }
    });
  } catch (error) {
    console.error('Erreur lors de la création de la réservation:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la création de la réservation' });
  }
});

// Autres routes que vous pourriez ajouter plus tard
// GET - Obtenir toutes les réservations
router.get('/', (req, res) => {
  res.json({ message: 'Liste des réservations (à implémenter)' });
});

// GET - Obtenir une réservation par ID
router.get('/:id', (req, res) => {
  res.json({ message: `Détails de la réservation ${req.params.id} (à implémenter)` });
});

module.exports = router;