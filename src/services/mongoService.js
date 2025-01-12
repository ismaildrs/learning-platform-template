// Question: Pourquoi créer des services séparés ?
// Réponse: 
// Les services séparés permettent d'organiser le code en couches distinctes, améliorant ainsi la lisibilité et la maintenabilité. 
// Ils encapsulent la logique métier, facilitent la réutilisation, et réduisent les dépendances entre les modules. 
// Cela rend également les tests plus simples et améliore la modularité de l'application.

const { ObjectId } = require('mongodb');
const {mongoClient} = require("../config/db");

// Fonctions utilitaires pour MongoDB
async function findOneById(collection, id) {
  // TODO: Implémenter une fonction générique de recherche par ID.
  mongoClient.
}

// Export des services
module.exports = {
  // TODO: Exporter les fonctions utilitaires
};