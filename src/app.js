// Question: Comment organiser le point d'entrée de l'application ?


// Question: Quelle est la meilleure façon de gérer le démarrage de l'application ?


const express = require('express');
const config = require('./config/env');
const db = require('./config/db');

const courseRoutes = require('./routes/courseRoutes');
const studentRoutes = require('./routes/studentRoutes');

const swaggerUi = require('swagger-ui-express');
const env = require('./config/env');
const { swaggerDocs } = require('./utils/swagger');

const app = express();

async function startServer() {
  try {
    // TODO: Initialiser les connexions aux bases de données
    db.connectRedis();
    db.connectMongo();
    // TODO: Configurer les middlewares Express
    app.use(express.json());
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
    // TODO: Monter les routes
    app.use('/courses', courseRoutes);
    app.use('/students', studentRoutes);
    // TODO: Démarrer le serveur
    app.listen(config.port, () => console.log(`Serveur en cours d'exécution sur le port ${config.port}`));
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Gestion propre de l'arrêt
process.on('SIGTERM', async () => {
  // TODO: Implémenter la fermeture propre des connexions
  db.mongoClient.close();
  db.redisClient.close();
});


env.validateEnv();
startServer();