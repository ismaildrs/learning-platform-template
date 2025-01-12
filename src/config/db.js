// Question : Pourquoi créer un module séparé pour les connexions aux bases de données ?
// Réponse : 
// Un module dédié centralise la logique des connexions, ce qui améliore la maintenabilité, 
// facilite la réutilisation, isole les détails de configuration, et rend le code plus facile à tester.

// Question : Comment gérer proprement la fermeture des connexions ?
// Réponse : 
// 1. Écouter les événements système (SIGINT, SIGTERM) pour fermer les connexions proprement. 
// 2. Appeler explicitement la méthode de fermeture (ex. client.close()). 
// 3. Utiliser un bloc try...catch pour gérer les erreurs lors de la fermeture.

const { MongoClient } = require('mongodb');
const redis = require('redis');
const config = require('./env');

let mongoClient, redisClient, db;

async function connectMongo() {
  // TODO: Implémenter la connexion MongoDB
  // Gérer les erreurs et les retries
  try{
    mongoClient = new MongoClient(config.mongodb);
    await mongoClient.connect();
  } catch(e){
    throw new Error(console.error('Erreur Mongo :', e.message));
  }
    
}

async function connectRedis() {
  // TODO: Implémenter la connexion Redis
  // Gérer les erreurs et les retries
  try{
    redisClient = redis.createClient({
      url: config.redis.uri,
    });
    await redisClient.connect();
  } catch(e){
    throw new Error(console.error('Erreur Redis :', e.message));
  }
}

// Export des fonctions et clients
module.exports = {
  // TODO: Exporter les clients et fonctions utiles
  mongo:{
    mongoClient,
    connectMongo
  },
  redis:{
    redisClient,
    connectRedis
  }
};