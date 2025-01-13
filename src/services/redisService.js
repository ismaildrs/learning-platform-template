// Question : Comment gérer efficacement le cache avec Redis ?
// Réponse :
// Le cache est stocké en mémoire rapide (RAM) pour des accès fréquents. Redis est idéal pour le cache grâce à :
// - Expiration des clés avec TTL (ex: EXPIRE).
// - Stratégies d'éviction (ex: LRU pour supprimer les clés les moins utilisées).
// - Mise à jour incrémentale et partitionnement pour optimiser l'espace et éviter les collisions.

// Question: Quelles sont les bonnes pratiques pour les clés Redis ?
// Réponse :
// - Utiliser un format structuré : "namespace:objet:attribut" (ex: "user:123:name") pour imiter une hiérarchie.
// - Éviter les collisions en utilisant des namespaces.
// - Garder les clés courtes mais descriptives.
// - Inclure des identifiants uniques pour chaque entité (ex: "order:20230112:items").
// - Configurer un TTL pour les données temporaires.

const {getRedisClient} = require("../config/db"); 

// Fonctions utilitaires pour Redis
async function cacheData(key, data, ttl) {
  // TODO: Implémenter une fonction générique de cache
  const redisClient = getRedisClient(); 
  try{
    await redisClient.hSet(key, JSON.stringify(data), "EX", ttl);

  } catch(e) {
    throw new Error(`Erreur lors de l'insertion : ${e.message}`);
  }
}

async function getCache(key){
  const redisClient = getRedisClient(); 
  try{
    const cacheData = await redisClient.get(key);
    return cacheData;
  } catch(e){
    return null;
  }
}

async function removeCache(key) {
  const redisClient = getRedisClient(); 
  try {
      await redisClient.del(key);
  } catch (err) {
      return null;
  }
}

module.exports = {
  // TODO: Exporter les fonctions utilitaires
  cacheData,
  getCache,
  removeCache
};