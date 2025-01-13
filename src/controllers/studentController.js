const { ObjectId } = require('mongodb');
const mongoService = require('../services/mongoService');
const redisService = require('../services/redisService');

async function getStudent(req, res) {
    const id = req.params.id;

    try {
        // Validation de l'ID
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ error: "ID d'étudiant non valide." });
        }

        // Vérification du cache Redis
        const cachedStudent = await redisService.getCache(`student:${id}`);
        if (cachedStudent) {
            return res.status(200).json(cachedStudent);
        }

        // Si non trouvé dans le cache, récupère depuis MongoDB
        const student = await mongoService.findOneById('students', id);

        if (!student) {
            return res.status(404).json({ error: "Étudiant non trouvé." });
        }

        // Mise en cache des données pour les futures requêtes
        await redisService.cacheData(`student:${id}`, student);

        res.status(200).json(student);
    } catch (error) {
        console.error("Erreur lors de la récupération de l'étudiant :", error);
        res.status(500).json({ error: "Une erreur s’est produite lors de la récupération de l'étudiant." });
    }
}

async function getStudents(req, res) {
    try {
        // Vérification du cache Redis
        const cachedStudents = await redisService.getCache('students');
        if (cachedStudents) {
            return res.status(200).json(cachedStudents);
        }

        // Si non trouvé dans le cache, récupère depuis MongoDB
        const students = await mongoService.findAll('students');

        // Mise en cache des données pour les futures requêtes
        await redisService.cacheData('students', students);

        res.status(200).json(students);
    } catch (error) {
        console.error("Erreur lors de la récupération des étudiants :", error);
        res.status(500).json({ error: "Une erreur s’est produite lors de la récupération des étudiants." });
    }
}

async function createStudent(req, res) {
    try {
        const { name, age, email } = req.body;

        // Validation des données
        if (!name || !age || !email) {
            return res.status(400).json({ error: "Le nom, l'âge et l'email sont requis." });
        }

        // Création d'un nouvel étudiant
        const newStudent = { name, age, email, createdAt: new Date() };
        const result = await mongoService.insertOne('students', newStudent);

        // Suppression du cache des étudiants
        await redisService.cacheData('students', null); // Cela forcera un rechargement du cache lors de la prochaine requête

        res.status(201).json({ message: "Étudiant créé avec succès", studentId: result.insertedId });
    } catch (error) {
        console.error("Erreur lors de la création de l'étudiant :", error);
        res.status(500).json({ error: "Une erreur s’est produite lors de la création de l'étudiant." });
    }
}

async function deleteStudent(req, res) {
    const id = req.params.id;

    try {
        // Validation de l'ID
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ error: "ID d'étudiant non valide." });
        }

        const result = await mongoService.deleteOneById('students', id);

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: "Étudiant non trouvé." });
        }

        // Suppression du cache pour cet étudiant spécifique et de la liste complète
        await redisService.cacheData(`student:${id}`, null);
        await redisService.cacheData('students', null);

        res.status(200).json({ message: "Étudiant supprimé avec succès." });
    } catch (error) {
        console.error("Erreur lors de la suppression de l'étudiant :", error);
        res.status(500).json({ error: "Une erreur s’est produite lors de la suppression de l'étudiant." });
    }
}

async function updateStudent(req, res) {
    const id = req.params.id;
    const updatedData = req.body;

    try {
        // Validation de l'ID
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ error: "ID d'étudiant non valide." });
        }

        // Mise à jour de l'étudiant
        const result = await mongoService.updateOneById('students', id, updatedData);

        if (result.matchedCount === 0) {
            return res.status(404).json({ error: "Étudiant non trouvé." });
        }

        // Suppression du cache pour cet étudiant spécifique et de la liste complète
        await redisService.cacheData(`student:${id}`, null);
        await redisService.cacheData('students', null);

        res.status(200).json({ message: "Étudiant mis à jour avec succès." });
    } catch (error) {
        console.error("Erreur lors de la mise à jour de l'étudiant :", error);
        res.status(500).json({ error: "Une erreur s’est produite lors de la mise à jour de l'étudiant." });
    }
}

module.exports = {
    getStudent,
    getStudents,
    createStudent,
    deleteStudent,
    updateStudent,
};
