/*
 * Fichier: gameState.js
 * Description: Définit la structure de l'état global du jeu (gameState)
 * et initialise ses valeurs par défaut.
 * Utilise la bibliothèque break_infinity.js pour la gestion des grands nombres.
 */

// Assurez-vous que break_infinity.min.js est chargé avant ce fichier
// si vous utilisez ce module de manière autonome ou sans bundler.

/**
 * @typedef {Object} GameState
 * @property {Decimal} bonsPoints - Monnaie principale du jeu.
 * @property {Decimal} nombreEleves - Nombre d'élèves possédés.
 * @property {Decimal} coutEleveBase - Coût de base d'un élève.
 * @property {Decimal} coutEleveActuel - Coût actuel d'un élève.
 * @property {Decimal} bonsPointsParSecondeEleves - Production de BP/s des élèves.
 * @property {Decimal} nombreClasses - Nombre de salles de classe possédées.
 * @property {Decimal} coutClasseEnEleves - Coût d'une classe en élèves.
 * @property {Decimal} bonsPointsParSecondeClasses - Production de BP/s des classes.
 * @property {Decimal} images - Ressource secondaire.
 * @property {Decimal} coutImage - Coût d'une image en BP.
 * @property {Decimal} nombreProfesseurs - Nombre total de professeurs.
 * @property {Decimal} coutProfesseur - Coût d'un professeur en Images.
 * @property {Decimal} professorsUsedForSkills - Professeurs dépensés en compétences.
 * @property {Decimal} availableProfessors - Professeurs disponibles pour les compétences.
 * @property {Decimal} ascensionPoints - Points d'Ascension non dépensés.
 * @property {Decimal} totalPAEarned - Total des PA gagnés cumulés.
 * @property {Decimal} ascensionCount - Nombre d'ascensions effectuées.
 * @property {Decimal} ascensionBonusMultiplier - Multiplicateur de bonus d'ascension.
 * @property {Decimal} schoolCount - Nombre d'écoles.
 * @property {Decimal} coutEcoleBase - Coût de base d'une école en PA.
 * @property {Decimal} coutEcoleActuel - Coût actuel d'une école en PA.
 * @property {Decimal} schoolMultiplier - Multiplicateur de production des écoles.
 * @property {string} currentTheme - Thème actuel ('dark' ou 'light').
 * @property {boolean} disableEleveWarning - Si l'avertissement d'achat d'élève est désactivé.
 * @property {boolean} disableAscensionWarning - Si l'avertissement d'ascension est désactivé.
 * @property {boolean} themeOptionUnlocked - Si l'option de thème est débloquée.
 * @property {boolean} multiPurchaseOptionUnlocked - Si l'option d'achat multiple est débloquée.
 * @property {boolean} maxPurchaseOptionUnlocked - Si l'option d'achat max est débloquée.
 * @property {boolean} newSettingsUnlocked - Si les nouveaux réglages sont débloqués.
 * @property {boolean} automationCategoryUnlocked - Si la catégorie d'automatisation est débloquée.
 * @property {boolean} autoEleveActive - Si l'automatisation des élèves est active.
 * @property {boolean} autoImageActive - Si l'automatisation des images est active.
 * @property {boolean} autoProfesseurActive - Si l'automatisation des professeurs est active.
 * @property {Object.<string, boolean>} unlockedSkills - Compétences débloquées.
 * @property {Object} skillEffects - Effets des compétences sur le jeu.
 * @property {number} currentPurchaseMultiplier - Multiplicateur d'achat (1, 10, 100, ou Infinity pour 'max').
 * @property {number} lastTickTime - Horodatage du dernier tick pour le calcul du delta.
 */

/**
 * Initialise l'état du jeu avec les valeurs par défaut.
 * Toutes les propriétés numériques importantes sont des objets Decimal.
 * @returns {GameState} L'état du jeu initialisé.
 */
export function getInitialGameState() {
    return {
        bonsPoints: new Decimal(0),
        nombreEleves: new Decimal(0),
        coutEleveBase: new Decimal(10),
        coutEleveActuel: new Decimal(10), // Sera recalculé
        bonsPointsParSecondeEleves: new Decimal(0),

        nombreClasses: new Decimal(0),
        coutClasseEnEleves: new Decimal(30),
        bonsPointsParSecondeClasses: new Decimal(0),

        images: new Decimal(0),
        coutImage: new Decimal(1000), // Coût initial d'une image

        nombreProfesseurs: new Decimal(0),
        coutProfesseur: new Decimal(2), // Coût initial d'un professeur en Images
        professorsUsedForSkills: new Decimal(0),
        availableProfessors: new Decimal(0), // Calculé dynamiquement

        ascensionPoints: new Decimal(0),
        totalPAEarned: new Decimal(0),
        ascensionCount: new Decimal(0),
        ascensionBonusMultiplier: new Decimal(1),

        schoolCount: new Decimal(0),
        coutEcoleBase: new Decimal(15),
        coutEcoleActuel: new Decimal(15),
        schoolMultiplier: new Decimal(1),

        currentTheme: 'dark', // Thème par défaut
        disableEleveWarning: false,
        disableAscensionWarning: false,
        themeOptionUnlocked: false,
        multiPurchaseOptionUnlocked: false,
        maxPurchaseOptionUnlocked: false,
        newSettingsUnlocked: false,
        automationCategoryUnlocked: false,
        autoEleveActive: false,
        autoImageActive: false,
        autoProfesseurActive: false,

        unlockedSkills: {}, // { skillId: true }
        skillEffects: { // Stocke les bonus appliqués par les compétences
            eleveBpsBonus: new Decimal(1),
            classeMultiplierBonus: new Decimal(1),
            eleveCostReduction: new Decimal(1),
            // Ajoutez d'autres effets de compétences ici au besoin
        },

        currentPurchaseMultiplier: 1, // 1, 10, 100, Infinity (pour max)
        lastTickTime: Date.now(), // Pour le calcul du delta time
    };
}

// Nous allons exporter une instance de gameState qui sera importée et modifiée
// par d'autres modules. Cela permet d'avoir une seule source de vérité pour l'état du jeu.
export let gameState = getInitialGameState();

// Fonction pour réinitialiser l'état du jeu à ses valeurs initiales
// Utile pour les ascensions ou les réinitialisations complètes.
export function resetGameState(initialState) {
    // Garder les références d'objet pour éviter de casser les liens
    // avec les autres modules qui importent `gameState`.
    for (const key in gameState) {
        delete gameState[key]; // Supprime toutes les anciennes propriétés
    }
    for (const key in initialState) {
        gameState[key] = initialState[key]; // Ajoute les nouvelles propriétés
    }
}
