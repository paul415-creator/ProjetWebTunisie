const jwt = require('jsonwebtoken');

// Idéalement, cette clé secrète devrait être dans votre fichier .env
// Vous pourriez la récupérer avec: const JWT_SECRET = process.env.JWT_SECRET;
const JWT_SECRET = 'votre_clé_secrète_très_complexe_à_changer_en_production';

/**
 * Génère un JWT token pour l'authentification
 * @param {string} userId - L'ID de l'utilisateur
 * @returns {string} Le token JWT généré
 */
const generateToken = (userId) => {
  // Création du payload du token
  const payload = {
    userId: userId,
    // Vous pouvez ajouter d'autres données au payload si nécessaire
    // Par exemple: role: user.role,
  };

  // Options du token
  const options = {
    expiresIn: '24h', // Le token expire après 24 heures
  };

  // Génération du token avec le payload, la clé secrète et les options
  const token = jwt.sign(payload, JWT_SECRET, options);
  
  // Log du token généré (pour debug)
  console.log(`Token généré pour l'utilisateur ${userId}:`, token.substring(0, 20) + "...");
  
  return token;
};

/**
 * Vérifie et décode un JWT token
 * @param {string} token - Le token à vérifier
 * @returns {object|null} Le payload décodé ou null si invalide
 */
const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (error) {
    console.error("Erreur de vérification du token:", error.message);
    return null;
  }
};

module.exports = {
  generateToken,
  verifyToken
};