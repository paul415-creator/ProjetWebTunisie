// backend/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Le nom est requis']
  },
  email: {
    type: String,
    required: [true, "L'email est requis"],
    unique: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Veuillez fournir un email valide']
  },
  password: {
    type: String,
    required: [true, 'Le mot de passe est requis'],
    minlength: 3,
    select: false // Ne pas inclure le mot de passe dans les requêtes
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Middleware pour hacher le mot de passe avant de l'enregistrer
userSchema.pre('save', async function(next) {
  // Si le mot de passe n'a pas été modifié, passer à l'étape suivante
  if (!this.isModified('password')) return next();
  
  // Hacher le mot de passe avec un facteur de coût de 12
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Méthode pour comparer les mots de passe
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;