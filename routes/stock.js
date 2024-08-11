const express = require('express');
const router = express.Router();
const axios = require('axios');
const Stock = require('../models/Stock');
const getDate = require('../public/js/date')
const { writeDataToFile, readDataFromFile, addObjectToFile}= require('../services/storage')
const path = './data.json';

// Crédentialq pour l'API Alpha Vantage
const apiKey = 'U4ANEOQLK0GXOZ0O';
const functionType = 'TIME_SERIES_DAILY';

router.get('/', (req, res) => {
  res.render('index');
});

recordOfTheDay=[]
let dataRecord = null

router.get('/search', (req, res) => {
  const symbol = req.query.symbol.toUpperCase();
  dataRecord = readDataFromFile(path);
  console.log('data',dataRecord);
  res.render('index', { options: true, symbol });
});

router.get('/search/api', async (req, res) => {
  const symbol = req.query.symbol.toUpperCase();
  const url = `https://www.alphavantage.co/query?function=${functionType}&symbol=${symbol}&apikey=${apiKey}`;

  let api = true;
 
  try {
    const response = await axios.get(url);
    const data = response.data;

    //console.log(data.Information)
    if (data.Information == "Thank you for using Alpha Vantage! Our standard API rate limit is 25 requests per day. Please subscribe to any of the premium plans at https://www.alphavantage.co/premium/ to instantly remove all daily rate limits."){
      res.render('index', { error: 'Le nombre de requetes max par jours a été atteint (25)', options: true, symbol });
    } 

    if (data['Error Message']) {
      res.render('index', { error: 'Symbole invalide. Veuillez essayer de nouveau.', options: true, symbol });
      return;
    }
    
    if (!data['Meta Data'] || !data['Time Series (Daily)']) {
      res.render('index', { error: 'Données introuvables pour le symbole spécifié.', options: true, symbol });
      return;
    }

    // Extraire le prix de clôture de la dernière journée de négociation
    const lastRefreshed = data['Meta Data']['3. Last Refreshed'];
    const timeSeries = data['Time Series (Daily)'];

    if (!lastRefreshed || !timeSeries[lastRefreshed]) {
      res.render('index', { error: 'Données introuvables pour la dernière date disponible.', options: true, symbol });
      return;
    }

    const closingPrice = timeSeries[lastRefreshed]['4. close'];

    // Rendre le template Twig avec les données
    res.render('index', { symbol, lastRefreshed, closingPrice,api });
  } catch (error) {
    console.error('Erreur lors de la récupération des données :', error);
    res.status(500).send('Erreur lors de la récupération des données');
  }
});

router.get('/search/db', async (req, res) => {
  const symbol = req.query.symbol.toUpperCase();

  recordOfTheDay
  dataRecord
  console.log("recordBDD",recordOfTheDay)

  let bdd = true;
  try {
    // Récupérer les données existantes dans la base de données
    const existingStocks = await Stock.find({ symbol }).sort({ lastRefreshed: 1 });

    if (!existingStocks.length) {
      res.render('index', { error: 'Aucune donnée trouvée dans la base de données pour ce symbole.', options: true, symbol });
      return;
    }

    // Formater les données pour le graphique
    const dates = existingStocks.map(stock => stock.lastRefreshed);
    const prices = existingStocks.map(stock => stock.closingPrice);

    // Rendre le template Twig avec les données
    res.render('index', { symbol,existingStocks, dates: JSON.stringify(dates), prices: JSON.stringify(prices),dataRecord,bdd });
  } catch (error) {
    console.error('Erreur lors de la récupération des données depuis la base de données :', error);
    res.status(500).send('Erreur lors de la récupération des données depuis la base de données');
  }
});

router.post('/save', async (req, res) => {
  const { symbol, lastRefreshed, closingPrice } = req.body;
  try {
    // On vérifie si une entrée avec le même symbole et la même date existe déjà
    const existingStock = await Stock.findOne({ symbol, lastRefreshed });

    if (existingStock) {
      const existingStocks = await Stock.find({ symbol }).sort({ lastRefreshed: 1 });

      // Formater les données pour le graphique
      const dates = existingStocks.map(stock => stock.lastRefreshed);
      const prices = existingStocks.map(stock => stock.closingPrice);

      res.render('index', { error: 'Les données pour cette date existent déjà.', symbol, lastRefreshed, closingPrice });
    } else {
      // Si une entrée avec le même symbole existe mais avec une date différente, ajouter une nouvelle entrée
      const newStock = new Stock({
        symbol,
        lastRefreshed,
        closingPrice,
      });

      await newStock.save();
      const existingStocks = await Stock.find({ symbol }).sort({ lastRefreshed: 1 });

      // Formater les données pour le graphique
      const dates = existingStocks.map(stock => stock.lastRefreshed);
      const prices = existingStocks.map(stock => stock.closingPrice);
      
      //let date = JSON.stringify(getDate)

      recordOfTheDay.push({name:symbol,date:getDate()})
      console.log("save",recordOfTheDay)

      
      addObjectToFile(recordOfTheDay, path);
       
      
      res.render('index', { success: 'Données enregistrées avec succès.', symbol, lastRefreshed, closingPrice, dates: JSON.stringify(dates), prices: JSON.stringify(prices),recordOfTheDay });
    }
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement des données :', error);
    res.status(500).send('Erreur lors de l\'enregistrement des données');
  }
});

module.exports = router;
