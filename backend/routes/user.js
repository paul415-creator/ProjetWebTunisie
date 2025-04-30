// backend/routes/userRoutes.js
const auth = require('../middleware/auth'); 
const express = require('express');
const router = express.Router();
const userController = require('../controllers/usercontroll');


// Route GET pour récupérer tous les utilisateurs
router.get('/', (req, res) => {
    res.json(global.users);
});


// Ajouter cette route pour supprimer un utilisateur
// DELETE /api/users/:id - Supprimer un utilisateur

router.delete('/:id', auth, userController.deleteUser);

  
module.exports = router;