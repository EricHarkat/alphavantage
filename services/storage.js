const fs = require('fs');

// Fonction pour écrire des données dans le fichier JSON
function writeDataToFile(data, filePath) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    console.log('Données écrites dans le fichier');
}

// Fonction pour lire des données depuis le fichier JSON
function readDataFromFile(filePath) {
    if (!fs.existsSync(filePath)) {
        console.log('Le fichier n\'existe pas, retour d\'un tableau vide');
        return [];
    }

    const rawData = fs.readFileSync(filePath, 'utf-8');
    
    if (rawData.trim() === '') {
        console.log('Le fichier est vide, retour d\'un tableau vide');
        return [];
    }

    try {
        return JSON.parse(rawData);
    } catch (error) {
        console.error('Erreur lors de l\'analyse du fichier JSON:', error);
        return [];
    }
}

// Fonction pour ajouter un objet au tableau dans le fichier JSON
function addObjectToFile(newObject, filePath) {
    const data = readDataFromFile(filePath);
    data.push(newObject);
    writeDataToFile(data, filePath);
}

module.exports = {
    writeDataToFile,
    readDataFromFile,
    addObjectToFile
}