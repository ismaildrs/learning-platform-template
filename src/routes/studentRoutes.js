const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

/**
 * @swagger
 * /students/{id}:
 *   get:
 *     summary: Récupérer un étudiant par ID
 *     description: Récupère un étudiant à partir de son ID unique.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de l'étudiant à récupérer
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Étudiant trouvé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 age:
 *                   type: integer
 *                 email:
 *                   type: string
 *       400:
 *         description: ID d'étudiant non valide
 *       404:
 *         description: Étudiant non trouvé
 */
router.get('/:id', studentController.getStudent);

/**
 * @swagger
 * /students:
 *   get:
 *     summary: Récupérer tous les étudiants
 *     description: Récupère la liste de tous les étudiants.
 *     responses:
 *       200:
 *         description: Liste des étudiants
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   age:
 *                     type: integer
 *                   email:
 *                     type: string
 *       500:
 *         description: Erreur interne du serveur
 */
router.get('/', studentController.getStudents);

/**
 * @swagger
 * /students:
 *   post:
 *     summary: Créer un nouvel étudiant
 *     description: Crée un étudiant avec les informations fournies.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               age:
 *                 type: integer
 *               email:
 *                 type: string
 *     responses:
 *       201:
 *         description: Étudiant créé avec succès
 *       400:
 *         description: Données manquantes ou invalides
 */
router.post('/', studentController.createStudent);

/**
 * @swagger
 * /students/{id}:
 *   put:
 *     summary: Mettre à jour un étudiant
 *     description: Met à jour un étudiant en fonction de son ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de l'étudiant à mettre à jour
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               age:
 *                 type: integer
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Étudiant mis à jour avec succès
 *       400:
 *         description: ID d'étudiant non valide
 *       404:
 *         description: Étudiant non trouvé
 */
router.put('/:id', studentController.updateStudent);

/**
 * @swagger
 * /students/{id}:
 *   delete:
 *     summary: Supprimer un étudiant
 *     description: Supprime un étudiant à partir de son ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de l'étudiant à supprimer
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Étudiant supprimé avec succès
 *       400:
 *         description: ID d'étudiant non valide
 *       404:
 *         description: Étudiant non trouvé
 */
router.delete('/:id', studentController.deleteStudent);

module.exports = router;
