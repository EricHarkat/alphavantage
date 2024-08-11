const express = require('express');
const connectDB = require('./services/db');
const app = express();
const stockRoutes = require('./routes/stock');

// Connect to MongoDB
connectDB();

// Configurer le dossier des vues pour les templates Twig
app.set('views', './views');
app.set('view engine', 'twig');

// Middleware pour parser les requêtes JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the "public" directory
app.use(express.static('public'));

// Utiliser les routes définies dans stock.js
app.use('/stock', stockRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});
