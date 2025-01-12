// Question: Pourquoi séparer les routes dans différents fichiers ?
// Réponse : 
// Question : Comment organiser les routes de manière cohérente ?
// Réponse: 

const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');

// Routes pour les cours
router.post('/', courseController.createCourse);
router.get('/:id', courseController.getCourse); // Compréhesion: Il faut créer les deux fonction getCourse et getCourseStats dans courseController.js
router.get('/stats', courseController.getCourseStats); 

module.exports = router;