// routes/reservationRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { calculateRentalPrice } = require('../utils/calculator');
const Reservation = require('../models/reservCars');
const Vehicule = require('../models/vehicule');

// Route pour récupérer les réservations de l'utilisateur
router.get('/user', auth, async (req, res) => {
  try {
      const userId = req.user.id;
      
      // Ne récupérer que les réservations qui ne sont pas annulées
      const reservations = await Reservation.find({ 
          utilisateur: userId,
          statut: { $ne: 'annulée' } // $ne signifie "not equal"
      });
      
      res.json(reservations);
      
  } catch (error) {
      console.error("Erreur:", error);
      res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Route pour créer une nouvelle réservation
router.post('/', auth, async (req, res) => {
    try {
      console.log("Tentative de création de réservation:", req.body);
      
      const { voiture, dateDebut, dateFin } = req.body;
      const userId = req.user._id;
      
      // Validation de base
      if (!voiture || !dateDebut || !dateFin) {
        return res.status(400).json({ message: 'Veuillez fournir toutes les informations requises' });
      }
      
      // Vérifier les dates
      if (new Date(dateDebut) >= new Date(dateFin)) {
        return res.status(400).json({ message: 'La date de fin doit être après la date de début' });
      }
      
      // Récupérer les informations de la voiture
      const vehicule = await Vehicule.findById(voiture);
      if (!vehicule) {
        return res.status(404).json({ message: 'Véhicule non trouvé' });
      }
      
      // Calculer le prix
      const priceDetails = calculateRentalPrice(vehicule.prix, dateDebut, dateFin);
      
      // Créer la réservation avec les informations de prix
      const reservation = new Reservation({
        voiture,
        utilisateur: userId,
        dateDebut,
        dateFin,
        prixJournalier: priceDetails.pricePerDay,
        nombreJours: priceDetails.numberOfDays,
        prixTotal: priceDetails.totalPrice,
        statut: 'confirmée',
        dateCreation: new Date()
      });


      // j'avais une error avant : Le problème était que vous utilisiez des données fictives en 
      // dur dans la route /user au lieu de récupérer 
      // les vraies réservations de la base de données.
      
      await reservation.save();
      
      // Renvoyer la réservation avec les détails de prix
      res.status(201).json({
        message: 'Réservation créée avec succès',
        reservation: reservation,
        priceDetails: priceDetails
      });
      
    } catch (error) {
      console.error("Erreur lors de la création de la réservation:", error);
      res.status(500).json({ message: 'Erreur serveur lors de la création de la réservation' });
    }
});

// Route pour calculer le prix d'une réservation
router.post('/calculate-price', auth, async (req, res) => {
    try {
      const { voiture, dateDebut, dateFin } = req.body;
      
      // Validation
      if (!voiture || !dateDebut || !dateFin) {
        return res.status(400).json({ 
          message: 'Veuillez fournir l\'ID du véhicule et les dates' 
        });
      }
      
      // Vérifier si les dates sont valides
      if (new Date(dateDebut) >= new Date(dateFin)) {
        return res.status(400).json({ 
          message: 'La date de fin doit être après la date de début' 
        });
      }
      
      // Récupérer le véhicule
      const vehicule = await Vehicule.findById(voiture);
      if (!vehicule) {
        return res.status(404).json({ message: 'Véhicule non trouvé' });
      }
      
      // Calculer le prix
      const priceDetails = calculateRentalPrice(vehicule.prix, dateDebut, dateFin);
      
      // Renvoyer les détails
      res.json({
        vehicule: {
          id: vehicule._id,
          marque: vehicule.marque,
          modele: vehicule.modele,
          prixJournalier: vehicule.prix
        },
        priceDetails: {
          numberOfDays: priceDetails.numberOfDays,
          pricePerDay: priceDetails.pricePerDay,
          totalPrice: priceDetails.totalPrice
        }
      });
      
    } catch (error) {
      console.error("Erreur lors du calcul du prix:", error);
      res.status(500).json({ 
        message: 'Erreur serveur lors du calcul du prix' 
      });
    }
});





        // Route pour annuler une réservation
    router.put('/:id/cancel', auth, async (req, res) => {
      try {
          const reservationId = req.params.id;
          const userId = req.user._id; // ID de l'utilisateur connecté

          // 1. Trouver la réservation
          const reservation = await Reservation.findById(reservationId);

          // 2. Vérifier si la réservation existe
          if (!reservation) {
              return res.status(404).json({ message: 'Réservation non trouvée' });
          }

          // 3. Vérifier si l'utilisateur est le propriétaire de la réservation
          if (reservation.utilisateur.toString() !== userId.toString()) {
              return res.status(403).json({ message: 'Vous n\'êtes pas autorisé à annuler cette réservation' });
          }

          // 4. Vérifier si la réservation peut être annulée
          if (reservation.statut === 'annulée') {
              return res.status(400).json({ message: 'Cette réservation est déjà annulée' });
          }

          // 5. Vérifier si ce n'est pas trop tard pour annuler (optionnel)
          const today = new Date();
          const debutReservation = new Date(reservation.dateDebut);
          
          // 6. Mettre à jour le statut
          reservation.statut = 'annulée';
          await reservation.save();

          // 7. Renvoyer la réponse
          res.json({ 
              message: 'Réservation annulée avec succès',
              reservation: reservation
          });

      } catch (error) {
          console.error('Erreur lors de l\'annulation:', error);
          res.status(500).json({ message: 'Erreur serveur lors de l\'annulation' });
      }
    });

// GET - Obtenir une réservation par ID
router.get('/:id', (req, res) => {
  res.json({ message: `Détails de la réservation ${req.params.id} (à implémenter)` });
});

module.exports = router;