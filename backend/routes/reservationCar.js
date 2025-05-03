// routes/reservationRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { calculateRentalPrice } = require('../utils/calculator');
const Reservation = require('../models/reservCars');
const Vehicule = require('../models/vehicule');





// il y avait avant une erreur ce n'etait pas un objet message qu'attendais le fronted mais un tableau et 
// ma route backend etait config pour envoyer un objet message 
router.get('/user', auth, async (req, res) => {
    try {
      // Récupérer l'ID de l'utilisateur depuis le token
      const userId = req.user.id;
      
      console.log("Recherche des réservations pour l'utilisateur:", userId);
      
      // Si vous avez un modèle de réservation, utilisez-le pour la recherche
      // const reservations = await Reservation.find({ utilisateur: userId });
      
      // Sinon, pour un test, renvoyez un tableau avec au moins une réservation fictive
      const reservations = [
        {
          _id: "reservation123", 
          voiture: "681157233849fca548b82c21", // Utilisez un ID de voiture valide de votre base de données
          utilisateur: userId,
          dateDebut: "2025-05-01",
          dateFin: "2025-05-10",
          statut: "confirmée"
        }
      ];
      
      // Important : renvoyez le tableau directement, pas un objet contenant le tableau
      res.json(reservations);
      
    } catch (error) {
      console.error("Erreur:", error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  });



// cette route : Importe la fonction de calcul de prix
//Récupère les informations du véhicule avec son prix
//Calcule automatiquement le prix total
//Enregistre ces informations dans la réservation


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



  // Ajoutez cette route dans routes/reservationCar.js
  //Cette route permet aux utilisateurs d'obtenir une estimation du prix sans créer de réservation.

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



  
// GET - Obtenir une réservation par ID
router.get('/:id', (req, res) => {
  res.json({ message: `Détails de la réservation ${req.params.id} (à implémenter)` });
});

module.exports = router;