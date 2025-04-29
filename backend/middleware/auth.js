// backend/middlewares/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/user');


const auth = async (req, res, next) => {
    try {
      // 1) Vérifier si le token existe
      let token;
      if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
      }
  
      if (!token) {
        return res.status(401).json({ error: 'Vous n\'êtes pas connecté. Veuillez vous connecter pour accéder à cette ressource.' });
      }
  
      // 2) Vérifier si le token est valide
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
      // 3) Vérifier si l'utilisateur existe toujours
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        return res.status(401).json({ error: 'L\'utilisateur associé à ce token n\'existe plus.' });
      }
  
      // 4) Accorder l'accès à la route protégée
      req.user = currentUser;
      next();
    } catch (error) {
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