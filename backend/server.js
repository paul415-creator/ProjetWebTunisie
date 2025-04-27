// backend/server.js
const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Tableau global des utilisateurs (à remplacer par une base de données plus tard)
global.users = [];

// Importer les routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../fronted')));

// Route pour la page d'accueil
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../fronted', 'Accueil.html'));
});

// Monter les routes API
app.use('/api/auth', authRoutes);  // Toutes les routes d'auth commenceront par /api/auth
app.use('/api/users', userRoutes); // Toutes les routes d'utilisateurs commenceront par /api/users

app.listen(port, () => {
  console.log(`Serveur backend démarré sur http://localhost:${port}`);
});