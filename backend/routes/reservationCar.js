// routes/reservationRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');



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

  router.post('/', auth, async (req, res) => {
    try {
      console.log("Tentative de création de réservation:", req.body);
      
      // Récupérer les données de la réservation
      const { voiture, dateDebut, dateFin } = req.body;
      
      // Récupérer l'ID de l'utilisateur depuis le token


      //C'est une erreur courante avec MongoDB, car les documents MongoDB
      //  utilisent _id et non id comme identifiant par défaut.
      const userId = req.user._id;
      
      // Validation de base
      if (!voiture || !dateDebut || !dateFin) {
        return res.status(400).json({ message: 'Veuillez fournir toutes les informations requises' });
      }
      
      // Créer un objet réservation (à adapter selon votre modèle)
      const newReservation = {
        _id: "reservation_" + Date.now(), // Générer un ID temporaire
        voiture: voiture,
        utilisateur: userId,
        dateDebut: dateDebut,
        dateFin: dateFin,
        statut: "confirmée",
        dateCreation: new Date()
      };
      
      // Si vous avez un modèle Mongoose, vous utiliserez quelque chose comme :
      // const reservation = new Reservation(newReservation);
      // await reservation.save();
      
      // Pour le moment, nous simulons une création réussie
      console.log("Réservation créée avec succès:", newReservation);
      
      // Renvoyer la réservation créée
      res.status(201).json(newReservation);
      
    } catch (error) {
      console.error("Erreur lors de la création de la réservation:", error);
      res.status(500).json({ message: 'Erreur serveur lors de la création de la réservation' });
    }
  });

  
// GET - Obtenir une réservation par ID
router.get('/:id', (req, res) => {
  res.json({ message: `Détails de la réservation ${req.params.id} (à implémenter)` });
});

module.exports = router;