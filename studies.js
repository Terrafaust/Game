// studies.js
// Gère l'achat et la production des éléments d'étude (élèves, classes, images, professeurs).

// Import des variables et fonctions nécessaires
// (Note : Dans un environnement navigateur, ces "imports" sont implicites
//  car tous les scripts sont chargés dans le même contexte global)
// import { bonsPoints, totalBonsPointsParSeconde, formatNumber } from './core.js';
// import { updateDisplay } from './ui.js';
// import { eleveBaseCost, classeBaseCost, professeurBaseCost, imageBaseCost,
//          classeMultiplier, professeurMultiplier, imageMultiplier } from './data.js';

// Variables locales
let nombreEleves = 0;
let nombreClasses = 0;
let nombreProfesseurs = 0;
let nombreImages = 0;

// Fonctions d'achat
function acheterEleve() {
    const cost = calculateNextEleveCost(nombreEleves);
    if (bonsPoints.gte(cost)) {
        bonsPoints = bonsPoints.minus(cost);
        nombreEleves++;
        totalEleves = totalEleves.plus(1);
        updateTotalBPS();
        updateDisplay();
    }
}

function acheterClasse() {
    const cost = calculateNextClasseCost(nombreClasses);
    if (bonsPoints.gte(cost)) {
        bonsPoints = bonsPoints.minus(cost);
        nombreClasses++;
        totalClasses
