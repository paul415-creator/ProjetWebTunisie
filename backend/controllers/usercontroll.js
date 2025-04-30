// Dans controllers/userController.js

// Supposons que vous avez déjà d'autres fonctions comme register, login, etc.

const User = require('../models/user');

// Fonction pour supprimer un utilisateur
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Vérification des permissions (seul l'utilisateur lui-même ou un admin peut supprimer un compte)
    if (req.user.id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Vous n\'êtes pas autorisé à supprimer ce compte' });
    }
    
    // Vérifier si l'utilisateur existe
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    
    // Option 1: Vérifier si l'utilisateur a des réservations actives avant suppression
    const activeReservations = await Reservation.find({
      utilisateur: userId,
      dateFin: { $gte: new Date() },
      statut: { $nin: ['annulée', 'terminée'] }
    });
    
    if (activeReservations.length > 0) {
      return res.status(400).json({ 
        message: 'Impossible de supprimer le compte car des réservations sont en cours',
        reservations: activeReservations
      });
    }
    
    // Option 2: Supprimer toutes les réservations liées à cet utilisateur
    // Décommentez ces lignes si vous préférez cette approche
    // await Reservation.deleteMany({ utilisateur: userId });
    
    // Supprimer l'utilisateur
    await User.findByIdAndDelete(userId);
    
    res.json({ message: 'Compte utilisateur supprimé avec succès' });
    
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'utilisateur:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la suppression de l\'utilisateur' });
  }
};