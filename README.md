# Projet : Application pour tester l'API ALPHA VANTAGE (stock market data)

## Étapes du projet

### 1. Récupérer des données (Extraction)
- **Objectif :** Utiliser l' API de marché boursié pour obtenir des données sur les valeurs boursieres.
- **Exemple de données à récupérer :**
  - Valeur d'ouverture
  - Valeur de cloture
  - Cotation d'une valeur recherchée
- **API:**
  - [API ALPHA VANTAGE]([https://openweathermap.org/](https://www.alphavantage.co/))
- **Outils :**
  - `axios` ou `fetch` pour les appels API.

---

### 2. Stocker les données (Chargement)
- **Objectif :** Configurer un système de stockage pour les données récupérées.
- **Options de stockage :**
  - **Local :** Fichiers JSON ou base de données MongoDB.
- **Points importants :**
  - Implémenter une logique pour éviter de surcharger l’API (limitation des appels).
  - Prévoir une méthode pour vérifier et valider les données stockées.

---

### 3. Nettoyer et structurer les données (Transformation)
- **Objectif :** Organiser les données pour leur exploitation.
- **Actions à réaliser :**
  - Identifier et gérer les données manquantes.
  - Agréger les données par jour ou par semaine pour simplifier l'analyse.
- **Outils :**
  - `moment.js` ou `date-fns` pour la gestion des dates.
  - Scripts en JavaScript pour transformer les données.

---

### 4. Visualiser les données
- **Objectif :** Présenter les données sous forme de graphiques et de visualisations claires.
- **Types de visualisations :**
  - Evolution des cotations
- **Outils suggérés :**
  - [Chart.js](https://www.chartjs.org/)

---

### Langage
- **JavaScript**
  - Backend : Node.js
  - Frontend (optionnel) : Twig

### APIs
- API ALPHA VANTAGE ou toute autre source publique.

### Base de données
- MongoDB

### Bibliothèques utiles
- **Pour les appels API :** `axios`, `fetch`.
- **Pour la visualisation :** Chart.js,
