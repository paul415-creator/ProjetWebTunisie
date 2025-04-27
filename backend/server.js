// backend/server.js
const express = require('express');
const path = require('path');
const app = express();
const port = 3000;
const users = [];



// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../fronted')));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../fronted', 'Accueil.html'));
});




// Route pour enregistrer un nouvel utilisateur
app.post('/api/register', async (req, res) => {
  const { name, email, password } = req.body;
  
  // Vérifier si l'email existe déjà
  if (users.some(user => user.email === email)) {
    return res.status(400).json({ error: 'Cet email est déjà utilisé' });
  }
  
  // Ajouter l'utilisateur au tableau
  users.push({ name, email, password });  
  
  res.status(201).json({
    message: `Bienvenue ${name}, ton compte a été créé avec succès !`
  });
});



// Route GET pour récupérer tous les utilisateurs
app.get('/api/users', (req, res) => {
  res.json(users);
});


// Route pour la connexion
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  
  // Rechercher l'utilisateur par email
  const user = users.find(user => user.email === email);
  
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


app.listen(port, () => {
  console.log(`Serveur backend démarré sur http://localhost:${port}`);
});