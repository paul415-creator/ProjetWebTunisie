const express = require('express');
const router = express.Router();
const User = require('../models/user');



router.post('/register', async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        
        // Vérifier si l'email existe déjà en utilisant le modèle Mongoose
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ 
                message: 'Cet email est déjà utilisé' 
            });
        }
        
        // Créer un nouvel utilisateur avec Mongoose
        const newUser = await User.create({
            name,
            email,
            password // Le hachage est géré par le middleware pre-save
        });
        
        res.status(201).json({
            message: `Bienvenue ${name}, ton compte a été créé avec succès !`
        });
    } catch (error) {
        console.error('Erreur lors de l\'inscription:', error);
        next(error);
    }
});
  
router.post('/login', async (req, res, next) => {
    try {
        const { email, password } = req.body;
        
        // Rechercher l'utilisateur par email et inclure le mot de passe pour la comparaison
        const user = await User.findOne({ email }).select('+password');
        
        // Vérifier si l'utilisateur existe
        if (!user) {
            return res.status(401).json({ message: 'Email non trouvé' });
        }
        
        // Vérifier si le mot de passe correspond
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Mot de passe incorrect' });
        }
        
        // Si tout est bon, renvoyer un message de succès
        res.status(200).json({ 
            message: `Bienvenue ${user.name} ! Connexion réussie.` 
        });
    } catch (error) {
        console.error('Erreur lors de la connexion:', error);
        next(error);
    }
});

module.exports = router;