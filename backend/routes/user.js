// backend/routes/userRoutes.js
const express = require('express');
const router = express.Router();

// Route GET pour récupérer tous les utilisateurs
router.get('/', (req, res) => {
    res.json(global.users);
});
  
module.exports = router;