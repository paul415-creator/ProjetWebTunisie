// backend/middlewares/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const dotenv = require("dotenv");
dotenv.config();

const auth = async (req, res, next) => {
  try {
    // 1) Vérifier si le token existe
    let token;
    console.log("Headers reçus:", req.headers); // Log tous les headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
      console.log("Token extrait:", token); // Log le token extrait
    }
    
    if (!token) {
      console.log("Aucun token trouvé dans la requête"); // Log l'absence de token
      return res.status(401).json({ error: 'Vous n\'êtes pas connecté. Veuillez vous connecter pour accéder à cette ressource.' });
    }
    
    // 2) Vérifier si le token est valide
    console.log("JWT_SECRET utilisé:", process.env.JWT_SECRET ? "Défini" : "Non défini"); // Vérifier si la variable d'environnement est définie
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Token décodé:", decoded); // Log le contenu du token décodé
    
    // 3) Vérifier si l'utilisateur existe toujours
    console.log("Recherche utilisateur avec ID:", decoded.userId);
    const currentUser = await User.findById(decoded.userId); // Utilisez decoded.userId au lieu de decoded.id
    console.log("Utilisateur trouvé:", currentUser ? "Oui" : "Non");
    
    if (!currentUser) {
      console.log("Utilisateur  non trouvé dans la base de données");
      return res.status(401).json({ error: 'L\'utilisateur associé à ce token n\'existe plus.' });
    }
    
    // 4) Accorder l'accès à la route protégée
    console.log("Structure de l'utilisateur:", currentUser);
    req.user = currentUser;
    next();
  } catch (error) {
    console.log("Erreur d'authentification:", error.name, error.message);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Token invalide. Veuillez vous reconnecter.' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Votre session a expiré. Veuillez vous reconnecter.' });
    }
    return res.status(500).json({ error: 'Erreur serveur.' });
  }
};
  
  module.exports = auth;