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
  const maxRetries = 3;
  let nbRetries = 0;

  while(nbRetries<maxRetries){
    try{
      mongoClient = new MongoClient(config.mongodb.uri);
      await mongoClient.connect();
      db = mongoClient.db(config.mongodb.dbName);
    } catch(e){
      nbRetries++;
      if(nbRetries>=maxRetries) throw new Error('Erreur lors de la connexion à MongoDB après plusieurs tentatives :', e.message);
      await new Promise(res => setTimeout(res, 2000)); // Attendre un peu avant de réessayer
    }
  } 
}

async function connectRedis() {
  // TODO: Implémenter la connexion Redis
  // Gérer les erreurs et les retries
  const maxRetries = 3;
  let nbRetries = 0;


  while(nbRetries<maxRetries){
    try{
      redisClient = redis.createClient({
        url: config.redis.uri,
      });

      redisClient = redis.createClient({ url: config.redis.uri });

      redisClient.on('connect', () => {
      });

      redisClient.on('error', (err) => {
        console.error('Error connecting to Redis:', err);
      });

      await redisClient.connect();
    } catch(e){
      nbRetries++;
      if(nbRetries>= maxRetries) throw new Error('Erreur Redis :', e.message);
      await new Promise(res => setTimeout(res, 2000)); // Attendre un peu avant de réessayer
    }
  }
}


function getDb(){
  return db;
}

function getRedisClient(){
  return redisClient;
}

// Export des fonctions et clients
module.exports = {
  // TODO: Exporter les clients et fonctions utiles
  connectMongo,
  connectRedis,
  getRedisClient,
  getDb,
};