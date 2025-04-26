// backend/server.js
const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;
const path = require('path');
const users = []; // stockage temporaire des utilisateurs

// Middleware
app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, '../fronted')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../fronted', 'index.html'));
});

// Route pour enregistrer un nouvel utilisateur
app.post('/api/register', (req, res) => {
  const { name, email, password } = req.body;
  users.push({ name, email, password });
  res.status(201).json({
    message: `Bienvenue ${name}, ton compte a été créé avec succès !`
  });
});


// 🔥 Route GET pour récupérer tous les utilisateurs
app.get('/api/users', (req, res) => {
  res.json(users);
});



// Ajouter cette route à votre fichier server.js
app.post('/api/index', (req, res) => {
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





/*
app.delete('/api/users/name/:name', async (req, res) => {
    const { name } = req.params;
  
    try {
      const deletedUser = await User.findOneAndDelete({ name });
  
      if (!deletedUser) {
        return res.status(404).json({ error: 'Utilisateur non trouvé' });
      }
  
      res.json({ message: `Utilisateur ${deletedUser.name} supprimé.` });
    } catch (err) {
      res.status(500).json({ error: 'Erreur lors de la suppression' });
    }
  });
  
*/

app.listen(port, () => {
  console.log(`Serveur backend démarré sur http://localhost:${port}`);
});
