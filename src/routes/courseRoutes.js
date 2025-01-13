// Question: Pourquoi séparer les routes dans différents fichiers ?
// Réponse : 
// Question : Comment organiser les routes de manière cohérente ?
// Réponse: 

const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');


/**
 * @swagger
 * /courses:
 *   post:
 *     summary: Créer un nouveau cours
 *     tags:
 *       - Cours
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               duration:
 *                 type: number
 *             required:
 *               - title
 *               - description
 *               - duration
 *     responses:
 *       201:
 *         description: Cours créé avec succès
 *       400:
 *         description: Données invalides
 *       500:
 *         description: Erreur serveur
 */
router.post('/', courseController.createCourse);

/**
 * @swagger
 * /courses/stats:
 *   get:
 *     summary: Obtenir des statistiques sur les cours
 *     tags:
 *       - Statistiques
 *     responses:
 *       200:
 *         description: Statistiques des cours récupérées avec succès
 *       500:
 *         description: Erreur serveur
 */
router.get('/stats', courseController.getCourseStats);

/**
 * @swagger
 * /courses/{id}:
 *   get:
 *     summary: Récupérer un cours par ID
 *     tags:
 *       - Cours
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cours récupéré avec succès
 *       404:
 *         description: Cours introuvable
 *       500:
 *         description: Erreur serveur
 */
router.get('/:id', courseController.getCourse);

module.exports = router;