// Question: Pourquoi créer des services séparés ?
// Réponse: 
// Les services séparés permettent d'organiser le code en couches distinctes, améliorant ainsi la lisibilité et la maintenabilité. 
// Ils encapsulent la logique métier, facilitent la réutilisation, et réduisent les dépendances entre les modules. 
// Cela rend également les tests plus simples et améliore la modularité de l'application.

const { ObjectId } = require('mongodb');
const { db } = require("../config/db");

// Fonctions utilitaires pour MongoDB
async function findOneById(collection, id) {
    try {
        // Valider que l'ID est valide
        if (!ObjectId.isValid(id)) {
            throw new Error("L'ID fourni n'est pas valide.");
        }

        // Construire la requête et rechercher
        const query = { _id: new ObjectId(id) };
        const result = await db.collection(collection).findOne(query);

        if (!result) {
            throw new Error("Aucun document trouvé avec l'ID spécifié.");
        }

        return result;
    } catch (e) {
        throw new Error(`Erreur lors de la récupération des données : ${e.message}`);
    }
}

async function findAll(collection) {
    try {
        const result = await db.collection(collection).find().toArray();
        return result;
    } catch (e) {
        throw new Error(`Erreur lors de la récupération des données : ${e.message}`);
    }
}

async function insertOne(collection, document) {
    try {
        const result = await db.collection(collection).insertOne(document);
        return result;
    } catch (e) {
        throw new Error(`Erreur lors de l'insertion du document : ${e.message}`);
    }
}

async function deleteOneById(collection, id) {
    try {
        // Valider que l'ID est valide
        if (!ObjectId.isValid(id)) {
            throw new Error("L'ID fourni n'est pas valide.");
        }

        const result = await db.collection(collection).deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount === 0) {
            throw new Error("Aucun document supprimé. L'ID peut être incorrect.");
        }

        return result;
    } catch (e) {
        throw new Error(`Erreur lors de la suppression du document : ${e.message}`);
    }
}

async function updateOneById(collection, id, updatedDocument) {
    try {
        // Valider que l'ID est valide
        if (!ObjectId.isValid(id)) {
            throw new Error("L'ID fourni n'est pas valide.");
        }

        const result = await db.collection(collection).updateOne(
            { _id: new ObjectId(id) },
            { $set: updatedDocument }
        );

        if (result.matchedCount === 0) {
            throw new Error("Aucun document trouvé pour l'ID spécifié.");
        }

        return result;
    } catch (e) {
        throw new Error(`Erreur lors de la mise à jour du document : ${e.message}`);
    }
}

// Export des services
module.exports = {
    findOneById,
    findAll,
    insertOne,
    deleteOneById,
    updateOneById
};

