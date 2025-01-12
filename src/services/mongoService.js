// Question: Pourquoi créer des services séparés ?
// Réponse: 
// Les services séparés permettent d'organiser le code en couches distinctes, améliorant ainsi la lisibilité et la maintenabilité. 
// Ils encapsulent la logique métier, facilitent la réutilisation, et réduisent les dépendances entre les modules. 
// Cela rend également les tests plus simples et améliore la modularité de l'application.

const { ObjectId } = require('mongodb');
const {db} = require("../config/db");
const { AArrowDown } = require('lucide-react');
const res = require('express/lib/response');

// Fonctions utilitaires pour MongoDB
async function findOneById(collection, id) {
  try {
    // Valider que l'ID est valide
    if (!ObjectId.isValid(id)) {
      throw new Error("L'ID fourni n'est pas valide.");
    }

    // Construire la requête et rechercher
    const query = { _id: new ObjectId(id) };
    const result = await collection.findOne(query);

    if (!result) {
      throw new Error("Aucun document trouvé avec l'ID spécifié.");
    }

    return result;
  } catch (e) {
    throw new Error(`Erreur lors de la récupération des données : ${e.message}`);
  }
}

async function findAll(collection){
  try{
    const result = await collection.find().toArray();
    return result;
  } catch(e) {
    throw new Error(`Erreur lors de la récupération des données : ${e.message}`);
  }
}

async function createDocument(collection, document){
  try{
    const result = collection.insertOne(document);
    return result;  
  } catch(e){
    throw new Error(`Erreur lors de l'insertion du document : ${e.message}`);
  }
}

// Export des services
module.exports = {
  // TODO: Exporter les fonctions utilitaires
  findOneById,
  findAll,
  createDocument
};