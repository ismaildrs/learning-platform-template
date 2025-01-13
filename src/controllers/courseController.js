// Question: Quelle est la différence entre un contrôleur et une route ?
// Réponse:
// Question : Pourquoi séparer la logique métier des routes ?
// Réponse :

const { ObjectId } = require('mongodb');
const mongoService = require('../services/mongoService');
const redisService = require('../services/redisService');
const { getDb } = require('../config/db');

// Créer un nouveau cours
async function createCourse(req, res) {
  try {
      const { title, description, duration } = req.body;

      // Validation des données
      if (!title || !description || !duration) {
          return res.status(400).json({ error: 'Le titre, la description et la durée sont requis.' });
      }

      // Insertion dans la base de données
      const newCourse = { title, description, duration, createdAt: new Date() };
      const result = await mongoService.insertOne('courses', newCourse);

      res.status(201).json({ message: 'Cours créé avec succès', courseId: result.insertedId });
  } catch (error) {
      console.error('Erreur lors de la création du cours :', error);
      res.status(500).json({ error: 'Une erreur s’est produite lors de la création du cours.' });
  }
}

// Récupérer un cours par ID
async function getCourse(req, res) {
  try {
      const { id } = req.params;

      const course = await mongoService.findOneById('courses', id);

      res.status(200).json(course);
  } catch (error) {
      console.error('Erreur lors de la récupération du cours :', error);
      res.status(500).json({ error: 'Une erreur s’est produite lors de la récupération du cours.' });
  }
}

// Obtenir des statistiques sur les cours
async function getCourseStats(req, res) {
    try {
      const db= getDb();
      const cacheKey = 'courseStats';

      // Vérifier si les stats sont en cache
      const cachedStats = await redisService.getCache(cacheKey);
      if (cachedStats) {
          return res.status(200).json(JSON.parse(cachedStats));
      }

      // Calculer les statistiques
      const stats = await db.aggregate('courses', [
          {
              $group: {
                  _id: null,
                  totalCourses: { $sum: 1 },
                  avgDuration: { $avg: "$duration" },
              },
          },
      ]);

      const result = stats[0] || { totalCourses: 0, avgDuration: 0 };

      // Mettre en cache les stats pour 1 heure
      await redisService.cacheData(cacheKey, result, 3600);

      res.status(200).json(result);
  } catch (error) {
      console.error('Erreur lors de la récupération des statistiques des cours :', error);
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