// Question: Quelle est la différence entre un contrôleur et une route ?
// Réponse: Une route dirige les requêtes HTTP vers le contrôleur correspondant, qui contient la logique métier associée.

// Question : Pourquoi séparer la logique métier des routes ?
// Réponse : Pour maintenir un code organisé, réutilisable et faciliter les tests en isolant les responsabilités.


const { ObjectId } = require('mongodb');
const mongoService = require('../services/mongoService');
const redisService = require('../services/redisService');
const { getDb } = require('../config/db');
const logger = require('../utils/logger');

// Créer un nouveau cours
async function createCourse(req, res) {
  try {
      const { title, description, duration } = req.body;

      logger.info('Tentative de création d\'un nouveau cours.');

      // Validation des données
      if (!title || !description || !duration) {
          logger.warn('Données manquantes pour créer un cours.');
          return res.status(400).json({ error: 'Le titre, la description et la durée sont requis.' });
      }

      // Insertion dans la base de données
      const newCourse = { title, description, duration, createdAt: new Date() };
      const result = await mongoService.insertOne('courses', newCourse);

      logger.info(`Cours créé avec succès : ${result.insertedId}`);
      res.status(201).json({ message: 'Cours créé avec succès', courseId: result.insertedId });
  } catch (error) {
      logger.error('Erreur lors de la création du cours :', error);
      res.status(500).json({ error: 'Une erreur s’est produite lors de la création du cours.' });
  }
}

// Récupérer un cours par ID
async function getCourse(req, res) {
  try {
      const { id } = req.params;

      logger.info(`Récupération du cours avec ID : ${id}`);

      const course = await mongoService.findOneById('courses', id);

      if (!course) {
          logger.warn(`Cours avec ID ${id} non trouvé.`);
          return res.status(404).json({ error: 'Cours non trouvé.' });
      }

      logger.info(`Cours récupéré avec succès : ${id}`);
      res.status(200).json(course);
  } catch (error) {
      logger.error('Erreur lors de la récupération du cours :', error);
      res.status(500).json({ error: 'Une erreur s’est produite lors de la récupération du cours.' });
  }
}

// Obtenir des statistiques sur les cours
async function getCourseStats(req, res) {
    try {
      const db = getDb();
      const cacheKey = 'course:stats';

      logger.info('Tentative de récupération des statistiques des cours.');

      // Vérifier si les stats sont en cache
      const cachedStats = await redisService.getCache(cacheKey);
      if (cachedStats) {
          logger.info('Statistiques récupérées depuis le cache.');
          return res.status(200).json(JSON.parse(cachedStats));
      }

      // Calculer les statistiques
      const stats = await db.collection("courses").aggregate([
          {
              $group: {
                  _id: null,
                  totalCourses: { $sum: 1 },
                  avgDuration: { $avg: "$duration" },
              },
          },
      ]).toArray();

      const result = stats[0] || { totalCourses: 0, avgDuration: 0};

      logger.info('Statistiques calculées avec succès.');

      // Mettre en cache les stats pour 1 heure
      await redisService.cacheData(cacheKey, result, 10);

      logger.info('Statistiques mises en cache avec succès.');
      res.status(200).json(result);
  } catch (error) {
      logger.error('Erreur lors de la récupération des statistiques des cours :', error);
      res.status(500).json({ error: 'Une erreur s’est produite lors de la récupération des statistiques des cours.' });
  }
}

// Export des contrôleurs
module.exports = {
  // TODO: Exporter les fonctions du contrôleur
    createCourse,
    getCourse,
    getCourseStats,
};