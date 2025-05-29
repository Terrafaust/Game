// Fiche Mémo : core.js
// Description : Ce fichier est le cœur de la logique du jeu. Il gère l'état global du jeu,
// les ressources principales, les compteurs, les fonctions de production,
// la sauvegarde et le chargement de la progression, les réinitialisations (soft, super soft, hard),
// le système de notifications, et la boucle de jeu principale.
// Il centralise également l'application de tous les effets de compétences, de prestiges et de succès.

// Dépendances :
// - break_infinity.min.js : La bibliothèque `Decimal` est supposée être globalement disponible
//                           pour la gestion des grands nombres.
// - data.js : Contient les données statiques du jeu (coûts de base, productions de base, définitions des compétences, etc.).
// - ui.js : Pour les fonctions de mise à jour de l'interface utilisateur (e.g., updateDisplay, updateButtonStates,
//           updateSectionVisibility, updateAutomationButtonStates, updateSettingsButtonStates,
//           renderSkillsMenu, renderQuests, renderAchievements, openTab, closeStatsModal,
//           showAchievementTooltip, hideAchievementTooltip, toggleAchievementTooltip, updateStatsDisplay).
//           Bien que core.js ne les appelle pas toutes directement, il les utilise pour rafraîchir l'UI.
// - studies.js : Pour les fonctions de calcul de coût et de production spécifiques aux études
//                (e.g., calculateNextEleveCost, elevesBpsPerItem, classesBpsPerItem, imagesBpsPerItem,
//                ProfesseurBpsPerItem).
// - automation.js : Pour la fonction d'exécution de l'automatisation (e.g., runAutomation) et le calcul de coût.
// - skills.js : Pour la logique d'application des effets de compétences (e.g., skillEffects, studiesSkillLevels,
//               ascensionSkillLevels, prestigeSkillLevels).
// - ascension.js : Pour les fonctions liées à l'ascension (e.g., calculatePAGained, performAscension).
// - prestige.js : Pour les fonctions liées au prestige (e.g., calculatePPGained, performPrestige,
//                getPrestigeBonusMultiplier).
// - quests.js : Pour la gestion des quêtes (e.g., checkQuests, updateQuestProgress, questsData, completedQuests).
// - achievements.js : Pour la gestion des succès (e.g., checkAchievements, achievementsData, unlockedAchievements,
//                    permanentBpsBonusFromAchievements).

// Variables Globales (état du jeu) - Exportées pour être accessibles par d'autres modules
export let bonsPoints;
export let totalBonsPointsParSeconde; // Production totale de BP/s
export let bonsPointsTotal; // Total cumulé de BP gagnés (pour les succès/stats)
export let images;
export let nombreEleves;
export let nombreClasses;
export let nombreProfesseur;
export let schoolCount; // Nombre d'Écoles
export let nombreLycees; // Nombre de Lycées
export let nombreColleges; // Nombre de Collèges
export let ascensionPoints; // Monnaie d'Ascension
export let ascensionCount; // Nombre d'Ascensions effectuées
export let totalPAEarned; // Total cumulé de PA gagnés (pour le prestige)
export let ascensionBonus; // Multiplicateur de bonus d'Ascension
export let prestigePoints; // Monnaie de Prestige
export let prestigeCount; // Nombre de Prestiges effectués
export let totalClicks; // Total des clics sur le bouton "Étudier"
export let currentPurchaseMultiplier; // Multiplicateur d'achat actuel (x1, x10, x100, max)

// Variables de déverrouillage des fonctionnalités
export let elevesUnlocked;
export let classesUnlocked;
export let imagesUnlocked;
export let ProfesseurUnlocked;
export let ascensionUnlocked;
export let prestigeUnlocked;
export let skillsButtonUnlocked;
export let settingsButtonUnlocked;
export let automationCategoryUnlocked;
export let questsUnlocked;
export let achievementsButtonUnlocked;
export let newSettingsUnlocked;
export let multiPurchaseOptionUnlocked;
export let maxPurchaseOptionUnlocked;
export let statsButtonUnlocked;
export let prestigeMenuButtonUnlocked; // Déverrouillage du bouton de menu Prestige
export let ascensionMenuButtonUnlocked; // Déverrouillage du bouton de menu Ascension

// Variables d'automatisation
export let autoEleveActive;
export let autoClasseActive;
export let autoImageActive;
export let autoProfesseurActive;

// Variables de compétences
export let studiesSkillPoints;
export let ascensionSkillPoints;
export let prestigeSkillPoints;
export let studiesSkillLevels; // { skillId: level, ... }
export let ascensionSkillLevels; // { skillId: level, ... }
export let prestigeSkillLevels; // { skillId: level, ... }
export let secretSkillClicks; // Compteur pour la compétence secrète

// Variables de paramètres
export let isDayTheme;
export let themeOptionUnlocked;
export let offlineProgressEnabled;
export let minimizeResourcesActive;
export let disableAscensionWarning; // Pour désactiver l'avertissement de première ascension
export let firstAscensionPerformed; // Pour suivre si la première ascension a eu lieu
export let disablePrestigeWarning; // Pour désactiver l'avertissement de prestige

// Variables de Prestige (quantités d'achats de prestige)
export let nombreLicences;
export let nombreMaster1;
export let nombreMaster2;
export let nombreDoctorat;
export let nombrePostDoctorat;

// Objets de bonus cumulés (mis à jour par applyAllSkillEffects)
// Ces objets agrègent tous les multiplicateurs et réductions de coût
// provenant des compétences, succès, et achats de prestige.
export let skillEffects = {
    clickBonsPointsBonus: new Decimal(0),
    eleveBpsMultiplier: new Decimal(1),
    classeBpsMultiplier: new Decimal(1),
    imageBpsMultiplier: new Decimal(1),
    ProfesseurBpsMultiplier: new Decimal(1),
    eleveCostReduction: new Decimal(0), // Pourcentage de réduction (0 à 1)
    classeCostReduction: new Decimal(0),
    imageCostReduction: new Decimal(0),
    ProfesseurCostReduction: new Decimal(0),
    ecoleCostReduction: new Decimal(0),
    automationCostReduction: new Decimal(0),
    allCostReduction: new Decimal(0), // Réduction de coût globale
    allBpsMultiplier: new Decimal(1), // Multiplicateur de production globale
    paGainMultiplier: new Decimal(1),
    ascensionBonusIncrease: new Decimal(0), // Augmentation additive du bonus d'ascension
    offlineProductionIncrease: new Decimal(0), // Augmentation du progrès hors ligne
    allProductionMultiplier: new Decimal(1), // Multiplicateur de production de toutes les structures

    // Effets spécifiques du Prestige
    licenceProfMultiplier: new Decimal(0), // Pourcentage de boost du multiplicateur Professeur
    master1ClassProduction: new Decimal(0), // Pourcentage de boost de la production des Classes par Prof
    master2ClassProduction: new Decimal(0), // Pourcentage de boost de la production des Classes par PP
    doctoratBPSBonus: new Decimal(0), // Pourcentage de boost BP/s du Doctorat
    doctoratMinClasses: 0, // Nombre minimum de classes après Ascension
    postDoctoratPAGain: new Decimal(0), // Pourcentage de boost de gain de PA par Ascension
};

// Variables pour les coûts actuels (utilisées par ui.js pour l'affichage)
export let coutEleveActuel;
export let coutClasseActuel;
export let coutImageActuel;
export let coutProfesseurActuel;
export let coutEcoleActuel;
export let coutLyceeActuel;
export let coutCollegeActuel;
export let coutLicenceActuel;
export let coutMaster1Actuel;
export let coutMaster2Actuel;
export let coutDoctoratActuel;
export let coutPostDoctoratActuel;

// Variables de temps pour la boucle de jeu
export const gameTickInterval = 50; // Intervalle de mise à jour de la logique du jeu en ms
export const displayUpdateInterval = 100; // Intervalle de mise à jour de l'affichage en ms
export const saveCheckInterval = 5000; // Intervalle de sauvegarde en ms

export let lastUpdate = Date.now(); // Dernière mise à jour pour le calcul du progrès hors ligne
export let lastDisplayUpdateTime = 0; // Dernière mise à jour de l'affichage
export let lastSaveCheckTime = 0; // Dernière vérification de sauvegarde

// --- Importation des fonctions et données des autres modules ---
// Ces imports sont nécessaires pour que core.js puisse appeler les fonctions
// ou accéder aux données définies dans ces modules.
import { calculateNextEleveCost, calculateNextClasseCost, calculateNextImageCost, calculateNextProfessorCost,
         elevesBpsPerItem, classesBpsPerItem, imagesBpsPerItem, ProfesseurBpsPerItem } from './studies.js';
import { calculateAutomationCost, runAutomation } from './automation.js';
import { skillsData } from './data.js'; // skillsData est défini dans data.js
import { calculatePAGained, performAscension, calculateNextEcoleCost, calculateNextLyceeCost, calculateNextCollegeCost } from './ascension.js';
import { calculatePPGained, performPrestige, getPrestigeBonusMultiplier, calculateLicenceCost, calculateMaster1Cost, calculateMaster2Cost, calculateDoctoratCost, calculatePostDoctoratCost } from './prestige.js';
import { checkQuests, updateQuestProgress, questsData, completedQuests, paMultiplierFromQuests } from './quests.js';
import { checkAchievements, achievementsData, unlockedAchievements, permanentBpsBonusFromAchievements } from './achievements.js';
import { updateDisplay, updateButtonStates, updateSectionVisibility, updateAutomationButtonStates,
         updateSettingsButtonStates, renderSkillsMenu, renderQuests, renderAchievements,
         openTab, closeStatsModal, showNotification, updateStatsDisplay,
         showAchievementTooltip, hideAchievementTooltip, toggleAchievementTooltip } from './ui.js';
import { prime_PA } from './data.js'; // prime_PA est défini dans data.js

// --- Fonctions Utilitaires ---

/**
 * Formate un nombre en notation scientifique ou standard.
 * @param {Decimal|number} num Le nombre à formater.
 * @param {number} decimalPlaces Le nombre de décimales à afficher.
 * @param {number} exponentThreshold Le seuil d'exposant pour passer en notation scientifique.
 * @returns {string} Le nombre formaté.
 */
export function formatNumber(num, decimalPlaces = 2, exponentThreshold = 6) {
    if (typeof num === 'number') {
        num = new Decimal(num);
    }

    if (num.lt(1000)) {
        return num.toFixed(0); // Pas de décimales pour les petits nombres
    }

    if (num.lt(new Decimal(10).pow(exponentThreshold))) {
        // Pour les nombres entre 1 000 et le seuil, utiliser des suffixes K, M, B, T, etc.
        const suffixes = ['', 'K', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y'];
        const log1000 = num.log10().div(3).floor();
        const value = num.div(new Decimal(1000).pow(log1000));
        return `${value.toFixed(decimalPlaces)}${suffixes[log1000.toNumber()]}`;
    }

    // Pour les très grands nombres, utiliser la notation scientifique
    return num.toExponential(decimalPlaces);
}

// --- Fonctions de Sauvegarde et Chargement ---

/**
 * Sauvegarde l'état actuel du jeu dans le localStorage.
 */
export function saveGameState() {
    const gameState = {
        bonsPoints: bonsPoints.toString(),
        totalBonsPointsParSeconde: totalBonsPointsParSeconde.toString(),
        bonsPointsTotal: bonsPointsTotal.toString(),
        images: images.toString(),
        nombreEleves: nombreEleves.toString(),
        nombreClasses: nombreClasses.toString(),
        nombreProfesseur: nombreProfesseur.toString(),
        schoolCount: schoolCount.toString(),
        nombreLycees: nombreLycees.toString(),
        nombreColleges: nombreColleges.toString(),
        ascensionPoints: ascensionPoints.toString(),
        ascensionCount: ascensionCount.toString(),
        totalPAEarned: totalPAEarned.toString(),
        ascensionBonus: ascensionBonus.toString(),
        prestigePoints: prestigePoints.toString(),
        prestigeCount: prestigeCount.toString(),
        totalClicks: totalClicks.toString(),
        currentPurchaseMultiplier: currentPurchaseMultiplier,
        elevesUnlocked: elevesUnlocked,
        classesUnlocked: classesUnlocked,
        imagesUnlocked: imagesUnlocked,
        ProfesseurUnlocked: ProfesseurUnlocked,
        ascensionUnlocked: ascensionUnlocked,
        prestigeUnlocked: prestigeUnlocked,
        skillsButtonUnlocked: skillsButtonUnlocked,
        settingsButtonUnlocked: settingsButtonUnlocked,
        automationCategoryUnlocked: automationCategoryUnlocked,
        questsUnlocked: questsUnlocked,
        achievementsButtonUnlocked: achievementsButtonUnlocked,
        newSettingsUnlocked: newSettingsUnlocked,
        multiPurchaseOptionUnlocked: multiPurchaseOptionUnlocked,
        maxPurchaseOptionUnlocked: maxPurchaseOptionUnlocked,
        statsButtonUnlocked: statsButtonUnlocked,
        prestigeMenuButtonUnlocked: prestigeMenuButtonUnlocked,
        ascensionMenuButtonUnlocked: ascensionMenuButtonUnlocked,
        autoEleveActive: autoEleveActive,
        autoClasseActive: autoClasseActive,
        autoImageActive: autoImageActive,
        autoProfesseurActive: autoProfesseurActive,
        studiesSkillPoints: studiesSkillPoints.toString(),
        ascensionSkillPoints: ascensionSkillPoints.toString(),
        prestigeSkillPoints: prestigeSkillPoints.toString(),
        studiesSkillLevels: studiesSkillLevels,
        ascensionSkillLevels: ascensionSkillLevels,
        prestigeSkillLevels: prestigeSkillLevels,
        secretSkillClicks: secretSkillClicks,
        isDayTheme: isDayTheme,
        themeOptionUnlocked: themeOptionUnlocked,
        offlineProgressEnabled: offlineProgressEnabled,
        minimizeResourcesActive: minimizeResourcesActive,
        disableAscensionWarning: disableAscensionWarning,
        firstAscensionPerformed: firstAscensionPerformed,
        disablePrestigeWarning: disablePrestigeWarning,
        nombreLicences: nombreLicences.toString(),
        nombreMaster1: nombreMaster1.toString(),
        nombreMaster2: nombreMaster2.toString(),
        nombreDoctorat: nombreDoctorat.toString(),
        nombrePostDoctorat: nombrePostDoctorat.toString(),
        lastUpdate: Date.now(), // Enregistrer le timestamp de la sauvegarde
        unlockedAchievements: unlockedAchievements, // Sauvegarder l'état des succès
        permanentBpsBonusFromAchievements: permanentBpsBonusFromAchievements.toString(),
        completedQuests: completedQuests, // Sauvegarder les quêtes terminées
        paMultiplierFromQuests: paMultiplierFromQuests.toString(),
    };
    localStorage.setItem('incrementalGameSave', JSON.stringify(gameState));
    // showNotification("Jeu sauvegardé !"); // Désactivé pour éviter le spam
}

/**
 * Charge l'état du jeu depuis le localStorage.
 * Initialise les variables de jeu si aucune sauvegarde n'est trouvée.
 */
export function loadGameState() {
    const savedState = localStorage.getItem('incrementalGameSave');
    if (savedState) {
        const gameState = JSON.parse(savedState);

        bonsPoints = new Decimal(gameState.bonsPoints || 0);
        totalBonsPointsParSeconde = new Decimal(gameState.totalBonsPointsParSeconde || 0);
        bonsPointsTotal = new Decimal(gameState.bonsPointsTotal || 0);
        images = new Decimal(gameState.images || 0);
        nombreEleves = new Decimal(gameState.nombreEleves || 0);
        nombreClasses = new Decimal(gameState.nombreClasses || 0);
        nombreProfesseur = new Decimal(gameState.nombreProfesseur || 0);
        schoolCount = new Decimal(gameState.schoolCount || 0);
        nombreLycees = new Decimal(gameState.nombreLycees || 0);
        nombreColleges = new Decimal(gameState.nombreColleges || 0);
        ascensionPoints = new Decimal(gameState.ascensionPoints || 0);
        ascensionCount = new Decimal(gameState.ascensionCount || 0);
        totalPAEarned = new Decimal(gameState.totalPAEarned || 0);
        ascensionBonus = new Decimal(gameState.ascensionBonus || 1); // Default to 1
        prestigePoints = new Decimal(gameState.prestigePoints || 0);
        prestigeCount = new Decimal(gameState.prestigeCount || 0);
        totalClicks = new Decimal(gameState.totalClicks || 0);
        currentPurchaseMultiplier = gameState.currentPurchaseMultiplier || '1';

        elevesUnlocked = gameState.elevesUnlocked || false;
        classesUnlocked = gameState.classesUnlocked || false;
        imagesUnlocked = gameState.imagesUnlocked || false;
        ProfesseurUnlocked = gameState.ProfesseurUnlocked || false;
        ascensionUnlocked = gameState.ascensionUnlocked || false;
        prestigeUnlocked = gameState.prestigeUnlocked || false;
        skillsButtonUnlocked = gameState.skillsButtonUnlocked || false;
        settingsButtonUnlocked = gameState.settingsButtonUnlocked || false;
        automationCategoryUnlocked = gameState.automationCategoryUnlocked || false;
        questsUnlocked = gameState.questsUnlocked || false;
        achievementsButtonUnlocked = gameState.achievementsButtonUnlocked || false;
        newSettingsUnlocked = gameState.newSettingsUnlocked || false;
        multiPurchaseOptionUnlocked = gameState.multiPurchaseOptionUnlocked || false;
        maxPurchaseOptionUnlocked = gameState.maxPurchaseOptionUnlocked || false;
        statsButtonUnlocked = gameState.statsButtonUnlocked || false;
        prestigeMenuButtonUnlocked = gameState.prestigeMenuButtonUnlocked || false;
        ascensionMenuButtonUnlocked = gameState.ascensionMenuButtonUnlocked || false;

        autoEleveActive = gameState.autoEleveActive || false;
        autoClasseActive = gameState.autoClasseActive || false;
        autoImageActive = gameState.autoImageActive || false;
        autoProfesseurActive = gameState.autoProfesseurActive || false;

        studiesSkillPoints = new Decimal(gameState.studiesSkillPoints || 0);
        ascensionSkillPoints = new Decimal(gameState.ascensionSkillPoints || 0);
        prestigeSkillPoints = new Decimal(gameState.prestigeSkillPoints || 0);
        studiesSkillLevels = gameState.studiesSkillLevels || {};
        ascensionSkillLevels = gameState.ascensionSkillLevels || {};
        prestigeSkillLevels = gameState.prestigeSkillLevels || {};
        secretSkillClicks = gameState.secretSkillClicks || 0;

        isDayTheme = gameState.isDayTheme !== undefined ? gameState.isDayTheme : true;
        themeOptionUnlocked = gameState.themeOptionUnlocked || false;
        offlineProgressEnabled = gameState.offlineProgressEnabled !== undefined ? gameState.offlineProgressEnabled : true;
        minimizeResourcesActive = gameState.minimizeResourcesActive || false;
        disableAscensionWarning = gameState.disableAscensionWarning || false;
        firstAscensionPerformed = gameState.firstAscensionPerformed || false;
        disablePrestigeWarning = gameState.disablePrestigeWarning || false;

        nombreLicences = new Decimal(gameState.nombreLicences || 0);
        nombreMaster1 = new Decimal(gameState.nombreMaster1 || 0);
        nombreMaster2 = new Decimal(gameState.nombreMaster2 || 0);
        nombreDoctorat = new Decimal(gameState.nombreDoctorat || 0);
        nombrePostDoctorat = new Decimal(gameState.nombrePostDoctorat || 0);

        lastUpdate = gameState.lastUpdate || Date.now(); // Charger le dernier timestamp de sauvegarde
        unlockedAchievements = gameState.unlockedAchievements || {};
        permanentBpsBonusFromAchievements = new Decimal(gameState.permanentBpsBonusFromAchievements || 0);
        completedQuests = gameState.completedQuests || {};
        paMultiplierFromQuests = new Decimal(gameState.paMultiplierFromQuests || 1);

        // Appliquer le thème immédiatement après le chargement
        document.body.classList.toggle('dark-theme', !isDayTheme);

        calculateOfflineProgress(); // Calculer le progrès hors ligne
        showNotification("Jeu chargé !");
    } else {
        // Initialiser le jeu si aucune sauvegarde n'existe
        resetGameVariables();
        showNotification("Nouveau jeu commencé !");
    }
    // Mettre à jour les coûts initiaux après le chargement ou l'initialisation
    updateCosts();
    applyAllSkillEffects(); // Appliquer tous les effets après le chargement
    updateCachedMultipliers(); // Mettre à jour les multiplicateurs en cache
}

/**
 * Réinitialise toutes les variables du jeu à leur état initial.
 */
function resetGameVariables() {
    bonsPoints = new Decimal(0);
    totalBonsPointsParSeconde = new Decimal(0);
    bonsPointsTotal = new Decimal(0);
    images = new Decimal(0);
    nombreEleves = new Decimal(0);
    nombreClasses = new Decimal(0);
    nombreProfesseur = new Decimal(0);
    schoolCount = new Decimal(0);
    nombreLycees = new Decimal(0);
    nombreColleges = new Decimal(0);
    ascensionPoints = new Decimal(0);
    ascensionCount = new Decimal(0);
    totalPAEarned = new Decimal(0);
    ascensionBonus = new Decimal(1);
    prestigePoints = new Decimal(0);
    prestigeCount = new Decimal(0);
    totalClicks = new Decimal(0);
    currentPurchaseMultiplier = '1';

    elevesUnlocked = false;
    classesUnlocked = false;
    imagesUnlocked = false;
    ProfesseurUnlocked = false;
    ascensionUnlocked = false;
    prestigeUnlocked = false;
    skillsButtonUnlocked = false;
    settingsButtonUnlocked = false;
    automationCategoryUnlocked = false;
    questsUnlocked = false;
    achievementsButtonUnlocked = false;
    newSettingsUnlocked = false;
    multiPurchaseOptionUnlocked = false;
    maxPurchaseOptionUnlocked = false;
    statsButtonUnlocked = false;
    prestigeMenuButtonUnlocked = false;
    ascensionMenuButtonUnlocked = false;

    autoEleveActive = false;
    autoClasseActive = false;
    autoImageActive = false;
    autoProfesseurActive = false;

    studiesSkillPoints = new Decimal(0);
    ascensionSkillPoints = new Decimal(0);
    prestigeSkillPoints = new Decimal(0);
    studiesSkillLevels = {};
    ascensionSkillLevels = {};
    prestigeSkillLevels = {};
    secretSkillClicks = 0;

    isDayTheme = true;
    themeOptionUnlocked = false;
    offlineProgressEnabled = true;
    minimizeResourcesActive = false;
    disableAscensionWarning = false;
    firstAscensionPerformed = false;
    disablePrestigeWarning = false;

    nombreLicences = new Decimal(0);
    nombreMaster1 = new Decimal(0);
    nombreMaster2 = new Decimal(0);
    nombreDoctorat = new Decimal(0);
    nombrePostDoctorat = new Decimal(0);

    lastUpdate = Date.now();
    unlockedAchievements = {};
    permanentBpsBonusFromAchievements = new Decimal(0);
    for (const ach of achievementsData) {
        ach.unlocked = false; // Réinitialiser l'état de déverrouillage dans la définition
    }

    // Réinitialiser les quêtes
    for (const questId in questsData) {
        questsData[questId].current = 0;
        questsData[questId].unlocked = false;
    }
    completedQuests = {};
    paMultiplierFromQuests = new Decimal(1);

    // Réinitialiser les effets de compétences
    resetSkillEffects();
    updateCosts();
    updateCachedMultipliers();
    calculateTotalBPS();
    updateDisplay();
    checkUnlockConditions();
    updateButtonStates();
    updateAutomationButtonStates();
    updateSettingsButtonStates();
    renderSkillsMenu();
    renderQuests();
    renderAchievements();
    openTab(document.getElementById('studiesMainContainer')); // Revenir à l'onglet Études
    document.body.classList.remove('dark-theme'); // S'assurer du thème par défaut
    closeStatsModal(); // Fermer la modale des stats si ouverte
}

/**
 * Réinitialise les effets de compétences à leurs valeurs par défaut.
 */
function resetSkillEffects() {
    skillEffects = {
        clickBonsPointsBonus: new Decimal(0),
        eleveBpsMultiplier: new Decimal(1),
        classeBpsMultiplier: new Decimal(1),
        imageBpsMultiplier: new Decimal(1),
        ProfesseurBpsMultiplier: new Decimal(1),
        eleveCostReduction: new Decimal(0),
        classeCostReduction: new Decimal(0),
        imageCostReduction: new Decimal(0),
        ProfesseurCostReduction: new Decimal(0),
        ecoleCostReduction: new Decimal(0),
        automationCostReduction: new Decimal(0),
        allCostReduction: new Decimal(0),
        allBpsMultiplier: new Decimal(1),
        paGainMultiplier: new Decimal(1),
        ascensionBonusIncrease: new Decimal(0),
        offlineProductionIncrease: new Decimal(0),
        allProductionMultiplier: new Decimal(1),
        licenceProfMultiplier: new Decimal(0),
        master1ClassProduction: new Decimal(0),
        master2ClassProduction: new Decimal(0),
        doctoratBPSBonus: new Decimal(0),
        doctoratMinClasses: 0,
        postDoctoratPAGain: new Decimal(0),
    };
}


/**
 * Réinitialisation complète du jeu (hard reset).
 * Perte de toutes les données, y compris Prestige.
 */
export function hardResetGame() {
    localStorage.removeItem('incrementalGameSave');
    resetGameVariables();
    showNotification("Jeu complètement réinitialisé !");
}

/**
 * Réinitialisation douce du jeu (soft reset).
 * Utilisé après une Ascension.
 */
export function softResetGame() {
    bonsPoints = new Decimal(0);
    images = new Decimal(0);
    nombreEleves = new Decimal(0);
    nombreClasses = new Decimal(0);
    nombreProfesseur = new Decimal(0);
    totalClicks = new Decimal(0);
    currentPurchaseMultiplier = '1';

    elevesUnlocked = false;
    classesUnlocked = false;
    imagesUnlocked = false;
    ProfesseurUnlocked = false;
    // ascensionUnlocked reste true après la première ascension
    // prestigeUnlocked reste true si déjà débloqué
    // skillsButtonUnlocked reste true si déjà débloqué
    // settingsButtonUnlocked reste true si déjà débloqué
    // automationCategoryUnlocked reste true si déjà débloqué
    // questsUnlocked reste true si déjà débloqué
    // achievementsButtonUnlocked reste true si déjà débloqué
    // newSettingsUnlocked reste true si déjà débloqué
    // multiPurchaseOptionUnlocked reste true si déjà débloqué
    // maxPurchaseOptionUnlocked reste true si déjà débloqué
    // statsButtonUnlocked reste true si déjà débloqué

    autoEleveActive = false;
    autoClasseActive = false;
    autoImageActive = false;
    autoProfesseurActive = false;

    studiesSkillPoints = new Decimal(0); // Les points d'études sont réinitialisés
    studiesSkillLevels = {}; // Les compétences d'études sont réinitialisées
    secretSkillClicks = 0;

    // Réinitialiser les quêtes non permanentes
    for (const questId in questsData) {
        if (!questsData[questId].permanent) {
            questsData[questId].current = 0;
            questsData[questId].unlocked = false;
        }
    }
    // Les quêtes terminées permanentes restent dans completedQuests

    updateCosts();
    applyAllSkillEffects(); // Réappliquer les effets après la réinitialisation
    updateCachedMultipliers();
    calculateTotalBPS();
    updateDisplay();
    checkUnlockConditions();
    updateButtonStates();
    updateAutomationButtonStates();
    updateSettingsButtonStates();
    renderSkillsMenu();
    renderQuests();
    renderAchievements();
    openTab(document.getElementById('studiesMainContainer'));
    saveGameState();
}

/**
 * Réinitialisation super douce du jeu (super soft reset).
 * Utilisé après un Prestige.
 */
export function superSoftResetGame() {
    bonsPoints = new Decimal(0);
    images = new Decimal(0);
    nombreEleves = new Decimal(0);
    nombreClasses = new Decimal(0);
    nombreProfesseur = new Decimal(0);
    schoolCount = new Decimal(0);
    nombreLycees = new Decimal(0);
    nombreColleges = new Decimal(0);
    ascensionPoints = new Decimal(0);
    ascensionCount = new Decimal(0);
    totalPAEarned = new Decimal(0);
    ascensionBonus = new Decimal(1);
    totalClicks = new Decimal(0);
    currentPurchaseMultiplier = '1';

    elevesUnlocked = false;
    classesUnlocked = false;
    imagesUnlocked = false;
    ProfesseurUnlocked = false;
    ascensionUnlocked = false;
    // prestigeUnlocked reste true
    skillsButtonUnlocked = false; // Les compétences sont réinitialisées
    settingsButtonUnlocked = false;
    automationCategoryUnlocked = false;
    questsUnlocked = false;
    achievementsButtonUnlocked = false;
    newSettingsUnlocked = false;
    multiPurchaseOptionUnlocked = false;
    maxPurchaseOptionUnlocked = false;
    statsButtonUnlocked = false;
    prestigeMenuButtonUnlocked = false;
    ascensionMenuButtonUnlocked = false;

    autoEleveActive = false;
    autoClasseActive = false;
    autoImageActive = false;
    autoProfesseurActive = false;

    studiesSkillPoints = new Decimal(0);
    ascensionSkillPoints = new Decimal(0);
    prestigeSkillPoints = prestigeSkillPoints.add(1); // Gagner 1 point de prestige
    studiesSkillLevels = {};
    ascensionSkillLevels = {};
    secretSkillClicks = 0;

    // Les quêtes sont réinitialisées sauf si permanentes
    for (const questId in questsData) {
        if (!questsData[questId].permanent) {
            questsData[questId].current = 0;
            questsData[questId].unlocked = false;
        }
    }
    // Les succès débloqués restent débloqués, mais leurs effets sont réappliqués.

    resetSkillEffects(); // Réinitialiser tous les effets
    updateCosts();
    applyAllSkillEffects(); // Réappliquer les effets après la réinitialisation
    updateCachedMultipliers();
    calculateTotalBPS();
    updateDisplay();
    checkUnlockConditions();
    updateButtonStates();
    updateAutomationButtonStates();
    updateSettingsButtonStates();
    renderSkillsMenu();
    renderQuests();
    renderAchievements();
    openTab(document.getElementById('studiesMainContainer'));
    saveGameState();
}

/**
 * Met à jour tous les coûts d'achat.
 * Doit être appelée après chaque achat ou réinitialisation.
 */
export function updateCosts() {
    coutEleveActuel = calculateNextEleveCost(nombreEleves);
    coutClasseActuel = calculateNextClasseCost(nombreClasses);
    coutImageActuel = calculateNextImageCost(images);
    coutProfesseurActuel = calculateNextProfessorCost(nombreProfesseur);
    coutEcoleActuel = calculateNextEcoleCost(schoolCount);
    coutLyceeActuel = calculateNextLyceeCost(nombreLycees);
    coutCollegeActuel = calculateNextCollegeCost(nombreColleges);
    coutLicenceActuel = calculateLicenceCost(nombreLicences);
    coutMaster1Actuel = calculateMaster1Cost(nombreMaster1);
    coutMaster2Actuel = calculateMaster2Cost(nombreMaster2);
    coutDoctoratActuel = calculateDoctoratCost(nombreDoctorat);
    coutPostDoctoratActuel = calculatePostDoctoratCost(nombrePostDoctorat);
}

/**
 * Calcule la production totale de Bons Points par seconde.
 * Prend en compte tous les multiplicateurs et bonus.
 */
export function calculateTotalBPS() {
    // Production de base des élèves
    let elevesBps = elevesBpsPerItem.times(nombreEleves);
    // Production de base des classes, multipliée par le nombre de professeurs
    let classesBps = classesBpsPerItem.times(nombreClasses).times(nombreProfesseur.add(1)); // +1 pour éviter 0 si aucun prof

    // Appliquer les multiplicateurs spécifiques aux items
    elevesBps = elevesBps.times(skillEffects.eleveBpsMultiplier);
    classesBps = classesBps.times(skillEffects.classeBpsMultiplier);

    // Production totale des études
    let studiesProduction = elevesBps.add(classesBps);

    // Appliquer les multiplicateurs globaux
    // Multiplicateur d'Ascension
    const currentAscensionMultiplier = ascensionBonus.times(skillEffects.ascensionBonusIncrease.add(1));

    // Multiplicateur de Prestige sur BPS
    const prestigeBpsMultiplier = getPrestigeBonusMultiplier('bps', prestigeCount, prestigePoints);

    // Multiplicateur permanent des succès
    const achievementBpsMultiplier = permanentBpsBonusFromAchievements.add(1);

    // Multiplicateur global de toutes les productions de structures
    const allProductionMultiplier = skillEffects.allProductionMultiplier;

    totalBonsPointsParSeconde = studiesProduction
        .times(currentAscensionMultiplier)
        .times(prestigeBpsMultiplier)
        .times(achievementBpsMultiplier)
        .times(skillEffects.allBpsMultiplier) // Multiplicateur global des compétences
        .times(allProductionMultiplier); // Multiplicateur global des structures
}

/**
 * Vérifie et applique les conditions de déverrouillage des fonctionnalités.
 */
export function checkUnlockConditions() {
    // Déverrouillage des élèves (toujours disponible au début)
    if (!elevesUnlocked) {
        elevesUnlocked = true;
        updateSectionVisibility();
    }

    // Déverrouillage des classes
    if (bonsPoints.gte(100) && !classesUnlocked) {
        classesUnlocked = true;
        showNotification("Salles de classe débloquées !");
        updateSectionVisibility();
    }

    // Déverrouillage des images
    if (bonsPoints.gte(1000) && !imagesUnlocked) {
        imagesUnlocked = true;
        showNotification("Images débloquées !");
        updateSectionVisibility();
    }

    // Déverrouillage des professeurs
    if (images.gte(1) && !ProfesseurUnlocked) {
        ProfesseurUnlocked = true;
        showNotification("Professeurs débloqués !");
        updateSectionVisibility();
    }

    // Déverrouillage du menu Ascension
    if (nombreProfesseur.gte(1) && !ascensionMenuButtonUnlocked) {
        ascensionMenuButtonUnlocked = true;
        showNotification("Menu Ascension débloqué !");
        updateSectionVisibility();
    }

    // Déverrouillage de l'Ascension elle-même (peut être effectuée)
    if (nombreProfesseur.gte(1) && !ascensionUnlocked) {
        ascensionUnlocked = true;
        showNotification("Vous pouvez maintenant Ascensionner !");
        updateSectionVisibility();
    }

    // Déverrouillage du menu Prestige (si au moins 1 ascension effectuée)
    if (ascensionCount.gte(1) && !prestigeMenuButtonUnlocked) {
        prestigeMenuButtonUnlocked = true;
        showNotification("Menu Prestige débloqué !");
        updateSectionVisibility();
    }

    // Déverrouillage du Prestige lui-même (si au moins 1 PA gagné)
    if (totalPAEarned.gte(1) && !prestigeUnlocked) {
        prestigeUnlocked = true;
        showNotification("Vous pouvez maintenant effectuer un Prestige !");
        updateSectionVisibility();
    }

    // Déverrouillage du bouton Compétences
    if ((studiesSkillPoints.gte(1) || ascensionSkillPoints.gte(1) || prestigeSkillPoints.gte(1)) && !skillsButtonUnlocked) {
        skillsButtonUnlocked = true;
        showNotification("Arbre de compétences débloqué !");
        updateSectionVisibility();
    }

    // Déverrouillage du bouton Paramètres
    if (totalClicks.gte(10) && !settingsButtonUnlocked) {
        settingsButtonUnlocked = true;
        showNotification("Menu Paramètres débloqué !");
        updateSectionVisibility();
    }

    // Déverrouillage des quêtes
    if (totalClicks.gte(5) && !questsUnlocked) {
        questsUnlocked = true;
        showNotification("Quêtes débloquées !");
        updateSectionVisibility();
        checkQuests(); // Initialiser les quêtes
    }

    // Déverrouillage des succès
    if (totalClicks.gte(15) && !achievementsButtonUnlocked) {
        achievementsButtonUnlocked = true;
        showNotification("Succès débloqués !");
        updateSectionVisibility();
        renderAchievements(); // Afficher les succès pour la première fois
    }

    // Déverrouillage de l'option d'achat multiple (x10, x100)
    if (multiPurchaseOptionUnlocked) {
        document.getElementById('setMultiplierX10').style.display = 'inline-block';
        document.getElementById('setMultiplierX100').style.display = 'inline-block';
    }

    // Déverrouillage de l'option d'achat max
    if (maxPurchaseOptionUnlocked) {
        document.getElementById('setMultiplierXmax').style.display = 'inline-block';
    }

    // Déverrouillage des nouveaux paramètres
    if (newSettingsUnlocked) {
        document.getElementById('offlineProgressSetting').style.display = 'flex';
        document.getElementById('minimizeResourcesSetting').style.display = 'flex';
        document.getElementById('statsButtonSetting').style.display = 'flex';
    }

    // Déverrouillage de la catégorie Automatisation
    if (automationCategoryUnlocked) {
        document.getElementById('automationTabBtn').style.display = 'inline-block';
    }

    // Déverrouillage des Lycées et Collèges
    if (schoolCount.gte(1)) {
        document.getElementById('achatLyceeSection').style.display = 'flex';
    }
    if (nombreLycees.gte(1)) {
        document.getElementById('achatCollegeSection').style.display = 'flex';
    }

    updateDisplay(); // Mettre à jour l'affichage après déverrouillage
}

/**
 * Applique tous les effets des compétences, succès et bonus de prestige.
 * Cette fonction réinitialise `skillEffects` et le reconstruit à chaque appel.
 */
export function applyAllSkillEffects() {
    // Réinitialiser tous les effets à leurs valeurs par défaut
    resetSkillEffects();

    // Appliquer les effets des compétences d'études
    for (const skillId in studiesSkillLevels) {
        const level = studiesSkillLevels[skillId];
        const skill = skillsData.studies.find(s => s.id === skillId);
        if (skill && skill.effect) {
            skill.effect(level);
        }
    }

    // Appliquer les effets des compétences d'ascension
    for (const skillId in ascensionSkillLevels) {
        const level = ascensionSkillLevels[skillId];
        const skill = skillsData.ascension.find(s => s.id === skillId);
        if (skill && skill.effect) {
            skill.effect(level);
        }
    }

    // Appliquer les effets des compétences de prestige
    for (const skillId in prestigeSkillLevels) {
        const level = prestigeSkillLevels[skillId];
        const skill = skillsData.prestige.find(s => s.id === skillId);
        if (skill && skill.effect) {
            skill.effect(level);
        }
    }

    // Appliquer les bonus permanents des succès
    // permanentBpsBonusFromAchievements est déjà cumulé dans achievements.js
    // et est une valeur directe à ajouter au multiplicateur global.
    // Les autres bonus de succès (réductions de coût, BP par clic) sont déjà
    // appliqués directement à skillEffects.

    // Appliquer les multiplicateurs de PA des quêtes
    skillEffects.paGainMultiplier = skillEffects.paGainMultiplier.times(paMultiplierFromQuests);

    // Appliquer les bonus des achats de prestige
    // Ces bonus sont déjà cumulés dans les variables nombreLicences, etc.,
    // et leurs effets sont appliqués via les fonctions de prestige.js
    // qui sont appelées ici.
    skillEffects.licenceProfMultiplier = skillEffects.licenceProfMultiplier.add(nombreLicences.times(0.01)); // Exemple: 1% par Licence
    skillEffects.master1ClassProduction = skillEffects.master1ClassProduction.add(nombreMaster1.times(0.01)); // Exemple: 1% par Master I
    skillEffects.master2ClassProduction = skillEffects.master2ClassProduction.add(nombreMaster2.times(0.01)); // Exemple: 1% par Master II
    skillEffects.doctoratBPSBonus = skillEffects.doctoratBPSBonus.add(nombreDoctorat.times(0.01)); // Exemple: 1% BP/s par Doctorat
    skillEffects.doctoratMinClasses = nombreDoctorat.times(5).toNumber(); // Exemple: 5 classes min par Doctorat
    skillEffects.postDoctoratPAGain = skillEffects.postDoctoratPAGain.add(nombrePostDoctorat.times(0.01)); // Exemple: 1% PA par Post-Doctorat

    // Mettre à jour les multiplicateurs en cache après avoir appliqué tous les effets
    updateCachedMultipliers();
    calculateTotalBPS(); // Recalculer la production totale après application des effets
}

/**
 * Met à jour les multiplicateurs mis en cache basés sur les skillEffects.
 * Ceci est utile pour les calculs de production et de coût.
 */
export function updateCachedMultipliers() {
    // Les multiplicateurs sont déjà mis à jour directement dans skillEffects
    // par applyAllSkillEffects. Cette fonction peut servir de point de contrôle
    // si des calculs intermédiaires sont nécessaires avant d'utiliser skillEffects.
    // Pour l'instant, elle appelle juste calculateTotalBPS pour s'assurer que la production est à jour.
    calculateTotalBPS();
}

/**
 * Calcule le progrès hors ligne et l'applique.
 */
export function calculateOfflineProgress() {
    if (!offlineProgressEnabled) return;

    const now = Date.now();
    const timeElapsed = (now - lastUpdate) / 1000; // Temps écoulé en secondes

    if (timeElapsed > 60) { // Si plus d'une minute s'est écoulée
        const offlineBps = totalBonsPointsParSeconde.times(skillEffects.offlineProductionIncrease.add(1));
        const bonsPointsGained = offlineBps.times(timeElapsed);
        bonsPoints = bonsPoints.add(bonsPointsGained);
        bonsPointsTotal = bonsPointsTotal.add(bonsPointsGained);

        showNotification(`Vous avez gagné ${formatNumber(bonsPointsGained, 2)} BP hors ligne !`, 8000);
    }
    lastUpdate = now; // Mettre à jour le dernier timestamp après le calcul
}

// --- Initialisation du Jeu ---
// Cette fonction sera appelée par le script principal (index.html) une fois le DOM chargé.
export function initializeGame() {
    loadGameState(); // Charge l'état du jeu ou l'initialise
    updateCosts(); // Mettre à jour les coûts initiaux
    applyAllSkillEffects(); // Appliquer tous les effets des compétences/succès/prestige
    updateCachedMultipliers(); // S'assurer que les multiplicateurs sont à jour
    calculateTotalBPS(); // Calculer la production initiale
    updateDisplay(); // Mettre à jour l'affichage initial
    checkUnlockConditions(); // Vérifier les déverrouillages initiaux
    updateButtonStates(); // Mettre à jour l'état des boutons
    updateAutomationButtonStates(); // Mettre à jour l'état des boutons d'automatisation
    updateSettingsButtonStates(); // Mettre à jour l'état des boutons de paramètres
    renderQuests(); // Rendre les quêtes
    renderAchievements(); // Rendre les succès
    renderSkillsMenu(); // Rendre l'arbre de compétences

    // S'assurer que l'onglet Études est ouvert par défaut au chargement
    // studiesMainContainer est un élément DOM, il doit être accessible globalement ou importé
    // Pour l'instant, on suppose qu'il est accessible via ui.js ou directement.
    const studiesMainContainer = document.getElementById('studiesMainContainer');
    if (studiesMainContainer) {
        openTab(studiesMainContainer);
    }

    showNotification("Bienvenue dans le Cahier d'Étude Avancé ! Prêt à apprendre ?", 5000);

    // Démarrer la boucle de jeu principale
    setInterval(() => {
        const now = Date.now();
        const deltaTime = gameTickInterval / 1000; // Convertir ms en secondes

        // Logique de jeu principale
        checkUnlockConditions();
        updateButtonStates(); // Mettre à jour les états des boutons d'achat
        updateAutomationButtonStates();
        updateSettingsButtonStates();
        checkQuests(); // Vérifier la progression des quêtes
        checkAchievements(); // Vérifier les succès

        // Production de Bons Points
        bonsPoints = bonsPoints.plus(totalBonsPointsParSeconde.times(deltaTime));
        bonsPointsTotal = bonsPointsTotal.plus(totalBonsPointsParSeconde.times(deltaTime));

        // Exécuter l'automatisation
        runAutomation();

        // Mettre à jour l'affichage moins fréquemment pour la performance
        if (now - lastDisplayUpdateTime >= displayUpdateInterval) {
            updateDisplay();
            renderSkillsMenu(); // Re-rendre les compétences pour mettre à jour déverrouillage/abordabilité
            renderQuests(); // Re-rendre les quêtes pour mettre à jour la progression
            renderAchievements(); // Re-rendre les succès
            updateStatsDisplay(); // Mettre à jour les statistiques si la modale est ouverte
            lastDisplayUpdateTime = now;
        }

        // Vérifier les déverrouillages et sauvegarder moins fréquemment
        if (now - lastSaveCheckTime >= saveCheckInterval) {
            checkUnlockConditions();
            saveGameState();
            lastSaveCheckTime = now;
        }
    }, gameTickInterval);
}

// Les fonctions `performPurchase`, `handleSkillClick`, `openStatsModal` sont définies dans d'autres modules
// (studies.js, skills.js, ui.js) et sont appelées par events.js.
// Elles ne sont pas définies ici dans core.js.
