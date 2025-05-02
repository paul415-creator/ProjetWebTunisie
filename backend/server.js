// backend/server.js
const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('./config/database');
dotenv.config();


console.log("JWT_SECRET défini:", process.env.JWT_SECRET ? "Oui" : "Non");
console.log("MONGODB_URI défini:", process.env.MONGODB_URI ? "Oui" : "Non");


connectDB();
const app = express();
// Utiliser la variable d'environnement pour le port ou 3000 par défaut
const port = process.env.PORT || 3000;



// Importer les routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const carRoutes = require('./routes/vehicules'); // Nouvelle importation pour les voitures 
const reservationRoutes = require('./routes/reservationCar');


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
app.use('/api/cars', carRoutes); // Nouvelle route pour les voitures 
app.use('/api/users', userRoutes);
app.use('/api/reservations', reservationRoutes);


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: 'Une erreur est survenue sur le serveur'
  });
});

app.listen(port, () => {
  console.log(`Serveur backend démarré sur http://localhost:${port}`);
});