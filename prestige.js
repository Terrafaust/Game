// prestige.js
// Tout ce qui concerne le prestige et les achats de prestige.

// Import des variables et fonctions nécessaires
// (Note : Dans un environnement navigateur, ces "imports" sont implicites)
// import { bonsPoints, prestigePoints, totalBonsPointsParSeconde } from './core.js';
// import { updateDisplay } from './ui.js';
// import { prestigeBaseCost } from './data.js';

let prestigeMultiplier = new Decimal(1);

function calculatePrestigeGain() {
    return bonsPointsTotal.dividedBy(prestigeBaseCost).pow(0.1).floor();
}

function prestige() {
    if (bonsPointsTotal.gte(prestigeBaseCost)) {
        prestigePoints = prestigePoints.plus(calculatePrestigeGain());
        bonsPoints = new Decimal(0);
        bonsPointsTotal = new Decimal(0);
        totalBonsPointsParSeconde = new Decimal(0);
        prestigeMultiplier = prestigeMultiplier.plus(calculatePrestigeGain().times(0.02)); // Example bonus
        updateDisplay();
    }
}
