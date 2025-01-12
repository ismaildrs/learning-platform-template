// Question: Pourquoi est-il important de valider les variables d'environnement au démarrage ?
// Réponse: Les variables d'environnement contiennent des informations essentielles à la configuration de l'application, 
// telles que les détails de connexion à une base de données ou des clés API. 
// La validation au démarrage garantit que l'application dispose des paramètres nécessaires pour fonctionner correctement. 
// Cela permet d'éviter des comportements inattendus ou des erreurs liées à l'absence ou à la mauvaise configuration d'une variable

// Question: Que se passe-t-il si une variable requise est manquante ?
// Réponse: Si une variable requise est manquante, l'application risque de ne pas démarrer ou de fonctionner de manière incorrecte. 
// Par exemple, elle pourrait échouer à se connecter à des services externes ou charger des configurations critiques, 
// entraînant ainsi des pannes ou des comportements erratiques. Une validation préalable détecte et corrige ce type de problème rapidement.

const dotenv = require('dotenv');
dotenv.config();

const requiredEnvVars = [
  'MONGODB_URI',
  'MONGODB_DB_NAME',
  'REDIS_URI'
];

// Validation des variables d'environnement
function validateEnv() {
  // TODO: Implémenter la validation
  // Si une variable manque, lever une erreur explicative
  
  if (!process.env.PORT) {
    throw new Error("La variable d'environnement 'PORT' doit être présente dans le fichier .env.");
  }
  
  if (!process.env.MONGODB_URI) {
    throw new Error("La variable d'environnement 'MONGODB_URI' doit être présente dans le fichier .env.");
  }
  
  if (!process.env.MONGODB_DB_NAME) {
    throw new Error("La variable d'environnement 'MONGODB_DB_NAME' doit être présente dans le fichier .env.");
  }
  
  if (!process.env.REDIS_URI) {
    throw new Error("La variable d'environnement 'REDIS_URI' doit être présente dans le fichier .env.");
  }
  
}

module.exports = {
  mongodb: {
    uri: process.env.MONGODB_URI,
    dbName: process.env.MONGODB_DB_NAME
  },
  redis: {
    uri: process.env.REDIS_URI
  },
  port: process.env.PORT || 3000,
  validateEnv
};
