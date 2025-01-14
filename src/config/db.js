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
const logger = require('../utils/logger');

let mongoClient, redisClient, db;

async function connectMongo() {
  // TODO: Implémenter la connexion MongoDB
  // Gérer les erreurs et les retries
  const maxRetries = 3;
  let nbRetries = 0;

  logger.info('Attempting MongoDB connection', {
    uri: config.mongodb.uri,
    dbName: config.mongodb.dbName
  });

  while(nbRetries<maxRetries){
    try{
      mongoClient = new MongoClient(config.mongodb.uri);
      await mongoClient.connect();
      db = mongoClient.db(config.mongodb.dbName);

      logger.info('Successfully connected to MongoDB', {
        attempt: nbRetries + 1,
        dbName: config.mongodb.dbName
      });

      return {mongoClient, db};
    } catch(e){
      nbRetries++;

      logger.error('MongoDB connection attempt failed', {
        attempt: nbRetries,
        maxRetries,
        error: error.message,
        stack: error.stack,
        timestamp: new Date()
      });

      if (nbRetries >= maxRetries) {
        throw new Error('Erreur lors de la connexion à MongoDB après plusieurs tentatives : ' + error.message);
      }
    
      await new Promise(res => setTimeout(res, 2000)); // Attendre un peu avant de réessayer
    }
  } 
}

async function connectRedis() {
  // TODO: Implémenter la connexion Redis
  // Gérer les erreurs et les retries
  const maxRetries = 3;
  let nbRetries = 0;


  logger.info('Attempting Redis connection', {
    uri: config.redis.uri,
  });

  while(nbRetries<maxRetries){
    try{
      redisClient = redis.createClient({
        url: config.redis.uri
      });

      redisClient.on('connect', () => {
        logger.info('Redis client connected');
      });

      redisClient.on('error', (err) => {
        logger.error('Redis client error', {
          error: err.message,
          timestamp: new Date()
        });
      });

      logger.info('Successfully connected to Redis', {
        attempt: nbRetries + 1
      });

      await redisClient.connect();
      return {redisClient};
    } catch(e){
      nbRetries++;

      logger.error('Redis connection attempt failed', {
        attempt: nbRetries,
        maxRetries,
        error: error.message,
        stack: error.stack,
        timestamp: new Date()
      });

      if(nbRetries>= maxRetries) throw new Error('Erreur Redis :', e.message);
      await new Promise(res => setTimeout(res, 2000)); // Attendre un peu avant de réessayer
    }
  }
}

function closeMongoCon(){
  try{
    if(mongoClient){
      mongoClient.close();
      logger.info('MongoDB connection closed successfully');
    }
  } catch(e){
    logger.error('Error closing MongoDB connection', {
      error: error.message,
      stack: error.stack,
      timestamp: new Date()
    });
    throw new Error("Erreur lors de la fermeture de la connection Mongo: "+e.message);
  }
}


function closeRedisCon(){
  try{
    if(redisClient){
      logger.info('Redis connection closed successfully');
    }
  } catch (error) {
    logger.error('Error closing Redis connection', {
      error: error.message,
      stack: error.stack,
      timestamp: new Date()
    });
    throw new Error("Erreur lors de la fermeture de la connection Mongo: "+e.message);
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
  closeRedisCon,
  closeMongoCon
};