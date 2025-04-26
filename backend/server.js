// backend/server.js
const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;
const path = require('path');
const fs = require('fs').promises;

// Chemin vers le fichier JSON qui contiendra les utilisateurs
const usersFilePath = path.join(__dirname, 'users.json');

// Fonction pour charger les utilisateurs depuis le fichier
async function loadUsers() {
  try {
    const data = await fs.readFile(usersFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    // Si le fichier n'existe pas ou ne peut pas être lu, retourner un tableau vide
    return [];
  }
}

// Fonction pour sauvegarder les utilisateurs dans le fichier
async function saveUsers(users) {
  await fs.writeFile(usersFilePath, JSON.stringify(users, null, 2));
}

// Variable qui contiendra les utilisateurs
let users = [];

// Charger les utilisateurs au démarrage du serveur
(async () => {
  users = await loadUsers();
  console.log(`${users.length} utilisateurs chargés depuis le fichier`);
})();
// Middleware

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, '../fronted')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../fronted', 'index.html'));
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
  
  // Sauvegarder le tableau mis à jour dans le fichier
  await saveUsers(users);
  
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




// Ajouter cette route à votre server.js
app.get('/api/view-users-file', async (req, res) => {
  try {
    const data = await fs.readFile(usersFilePath, 'utf8');
    res.type('json').send(data);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la lecture du fichier' });
  }
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
