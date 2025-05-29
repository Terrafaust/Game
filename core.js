// core.js
// Contient les variables globales, les fonctions utilitaires,
// la boucle de jeu principale et la gestion de la sauvegarde/chargement.

// Variables globales
let bonsPoints = new Decimal(0);
let bonsPointsTotal = new Decimal(0);
let totalBonsPointsParSeconde = new Decimal(0);
let images = 0;
let classes = 0;
let professeurs = 0;
let eleves = 0;
let totalEleves = new Decimal(0);
let totalClasses = new Decimal(0);
let totalProfesseurs = new Decimal(0);
let prestigePoints = new Decimal(0);
let ascensionPoints = new Decimal(0);

// Paramètres de la boucle de jeu et de l'affichage
const gameTickInterval = 50; // Milliseconds
const displayUpdateInterval = 100; // Milliseconds
const saveCheckInterval = 5000; // Milliseconds

let lastDisplayUpdateTime = 0;
let lastSaveCheckTime = 0;

// Fonctions utilitaires
function formatNumber(nombre, decimales) {
    if (nombre instanceof Decimal) {
        return nombre.format(decimales, true);
    }
    return parseFloat(nombre).toFixed(decimales);
}

// Fonction de sauvegarde
function saveGameState() {
    let gameState = {
        bonsPoints: bonsPoints.toString(),
        bonsPointsTotal: bonsPointsTotal.toString(),
        totalBonsPointsParSeconde: totalBonsPointsParSeconde.toString(),
        images: images,
        classes: classes,
        professeurs: professeurs,
        eleves: eleves,
        totalEleves: totalEleves.toString(),
        totalClasses: totalClasses.toString(),
        totalProfesseurs: totalProfesseurs.toString(),
        prestigePoints: prestigePoints.toString(),
        ascensionPoints: ascensionPoints.toString(),
        // ... (Ajoute ici les autres variables à sauvegarder)
    };
    localStorage.setItem('gameState', JSON.stringify(gameState));
}

// Fonction de chargement
function loadGameState() {
    let savedState = localStorage.getItem('gameState');
    if (savedState) {
        let gameState = JSON.parse(savedState);
        bonsPoints = new Decimal(gameState.bonsPoints);
        bonsPointsTotal = new Decimal(gameState.bonsPointsTotal);
        totalBonsPointsParSeconde = new Decimal(gameState.totalBonsPointsParSeconde);
        images = gameState.images;
        classes = gameState.classes;
        professeurs = gameState.professeurs;
        eleves = gameState.eleves;
        totalEleves = new Decimal(gameState.totalEleves);
        totalClasses = new Decimal(gameState.totalClasses);
        totalProfesseurs = new Decimal(gameState.totalProfesseurs);
        prestigePoints = new Decimal(gameState.prestigePoints);
        ascensionPoints = new Decimal(gameState.ascensionPoints);
        // ... (Charge ici les autres variables sauvegardées)
    }
}

// Boucle de jeu principale
function startGameLoop() {
    setInterval(() => {
        const now = Date.now();
        const deltaTime = gameTickInterval / 1000; // Convert ms to seconds

        // Production de Bons Points
        bonsPoints = bonsPoints.plus(totalBonsPointsParSeconde.times(deltaTime));
        bonsPointsTotal = bonsPointsTotal.plus(totalBonsPointsParSeconde.times(deltaTime));

        // ... (Appels aux autres fonctions de logique)

        // Update display less frequently for performance
        if (now - lastDisplayUpdateTime >= displayUpdateInterval) {
            // updateDisplay(); // Fonction dans ui.js
            lastDisplayUpdateTime = now;
        }

        // Check unlocks and save less frequently
        if (now - lastSaveCheckTime >= saveCheckInterval) {
            // checkUnlockConditions(); // Fonction à répartir dans les modules
            saveGameState();
            lastSaveCheckTime = now;
        }
    }, gameTickInterval);
}

// Initialisation du jeu
loadGameState();
startGameLoop();
