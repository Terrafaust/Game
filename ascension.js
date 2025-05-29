// ascension.js
// Les mécanismes d'ascension, les achats d'écoles, lycées, collèges,
// et les bonus associés.

// Import des variables et fonctions nécessaires
// (Note : Dans un environnement navigateur, ces "imports" sont implicites)
// import { bonsPoints, ascensionPoints, totalBonsPointsParSeconde } from './core.js';
// import { updateDisplay } from './ui.js';
// import { ascensionBaseCost } from './data.js';

let nombreEcoles = 0;
let nombreLycees = 0;
let nombreColleges = 0;

function acheterEcole() {
    const cost = calculateNextEcoleCost(nombreEcoles);
    if (bonsPoints.gte(cost)) {
        bonsPoints = bonsPoints.minus(cost);
        nombreEcoles++;
        updateTotalBPS();
        updateDisplay();
    }
}

function acheterLycee() {
    const cost = calculateNextLyceeCost(nombreLycees);
    if (bonsPoints.gte(cost)) {
        bonsPoints = bonsPoints.minus(cost);
        nombreLycees++;
        updateTotalBPS();
        updateDisplay();
    }
}

function acheterCollege() {
    const cost = calculateNextCollegeCost(nombreColleges);
    if (bonsPoints.gte(cost)) {
        bonsPoints = bonsPoints.minus(cost);
        nombreColleges++;
        updateTotalBPS();
        updateDisplay();
    }
}

function calculateNextEcoleCost(count) {
    return new Decimal(ascensionBaseCost).times(Decimal.pow(1.1, count));
}

function calculateNextLyceeCost(count) {
    return new Decimal(ascensionBaseCost).times(Decimal.pow(1.2, count)).times(10);
}

function calculateNextCollegeCost(count) {
    return new Decimal(ascensionBaseCost).times(Decimal.pow(1.3, count)).times(100);
}

function ascension() {
    if (bonsPoints.gte(ascensionBaseCost)) {
        ascensionPoints = ascensionPoints.plus(1);
        bonsPoints = new Decimal(0);
        totalBonsPointsParSeconde = new Decimal(0);
        nombreEcoles = 0;
        nombreLycees = 0;
        nombreColleges = 0;
        updateDisplay();
    }
}
