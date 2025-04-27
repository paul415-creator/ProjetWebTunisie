const express = require('express');
const router = express.Router();

// Route pour enregistrer un nouvel utilisateur
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    
    // Vérifier si l'email existe déjà
    if (global.users.some(user => user.email === email)) {
      return res.status(400).json({ error: 'Cet email est déjà utilisé' });
    }
    
    // Ajouter l'utilisateur au tableau
    global.users.push({ name, email, password });  
    
    res.status(201).json({
      message: `Bienvenue ${name}, ton compte a été créé avec succès !`
    });
});
  
// Route pour la connexion
router.post('/login', (req, res) => {
    const { email, password } = req.body;
    
    // Rechercher l'utilisateur par email
    const user = global.users.find(user => user.email === email);
    
    // Vérifier si l'utilisateur existe et si le mot de passe correspond
    if (!user) {
      return res.status(401).json({ error: 'Email non trouvé' });
    }
    
    if (user.password !== password) {
      return res.status(401).json({ error: 'Mot de passe incorrect' });
    }
    
    // Si tout est bon, renvoyer un message de succès
    res.status(200).json({ 
      message: `Bienvenue ${user.name} ! Connexion réussie.` 
    });
});

module.exports = router;