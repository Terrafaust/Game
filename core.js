// ------------------ Fiche Mémo : core.js ----------------------------
//
// Description : Ce fichier est le cœur de la logique du jeu incrémental.
// Il gère l'état global du jeu, les variables principales (ressources, compteurs, déverrouillages),
// les fonctions essentielles de sauvegarde/chargement, les calculs de production,
// la gestion des achats, l'application des effets de compétences/bonus,
// et la boucle de jeu principale.
//
// Objectif : Centraliser l'état du jeu et les fonctions critiques pour assurer
// la cohérence des données et la bonne exécution de la logique.
//
// ------------------ Variables Globales (état du jeu) ------------------
//
// export let bonsPoints;                     // Monnaie principale du jeu.
// export let totalBonsPointsParSeconde;      // Production totale de Bons Points par seconde (BP/s).
// export let bonsPointsTotal;                // Total cumulé de Bons Points gagnés (pour les succès/stats).
// export let images;                         // Ressource "Images".
// export let nombreEleves;                   // Nombre d'unités "Élèves".
// export let nombreClasses;                  // Nombre d'unités "Classes".
// export let nombreProfesseur;               // Nombre d'unités "Professeur".
// export let schoolCount;                    // Nombre d'unités "Écoles".
// export let nombreLycees;                   // Nombre d'unités "Lycées".
// export let nombreColleges;                 // Nombre d'unités "Collèges".
// export let ascensionPoints;                // Monnaie d'Ascension (PA).
// export let ascensionCount;                 // Nombre d'Ascensions effectuées.
// export let totalPAEarned;                  // Total cumulé de PA gagnés (pour le prestige).
// export let ascensionBonus;                 // Multiplicateur de bonus d'Ascension.
// export let prestigePoints;                 // Monnaie de Prestige (PP).
// export let prestigeCount;                  // Nombre de Prestiges effectués.
// export let totalClicks;                    // Total des clics sur le bouton "Étudier".
// export let currentPurchaseMultiplier;      // Multiplicateur d'achat actuel (x1, x10, x100, max).
//
// ------------------ Variables de Déverrouillage des Fonctionnalités ------------------
//
// export let elevesUnlocked;                 // Vrai si les Élèves sont débloqués.
// export let classesUnlocked;                // Vrai si les Classes sont débloquées.
// export let imagesUnlocked;                 // Vrai si les Images sont débloquées.
// export let ProfesseurUnlocked;             // Vrai si les Professeurs sont débloqués.
// export let ascensionUnlocked;              // Vrai si l'Ascension est débloquée (peut être effectuée).
// export let prestigeUnlocked;               // Vrai si le Prestige est débloqué (peut être effectuée).
// export let skillsButtonUnlocked;           // Vrai si le bouton "Compétences" est débloqué.
// export let settingsButtonUnlocked;         // Vrai si le bouton "Paramètres" est débloqué.
// export let automationCategoryUnlocked;     // Vrai si la catégorie "Automatisation" est débloquée.
// export let questsUnlocked;                 // Vrai si les "Quêtes" sont débloquées.
// export let achievementsButtonUnlocked;     // Vrai si le bouton "Succès" est débloqué.
// export let newSettingsUnlocked;            // Vrai si de nouveaux paramètres sont débloqués.
// export let multiPurchaseOptionUnlocked;    // Vrai si les options d'achat multiple (x10, x100) sont débloquées.
// export let maxPurchaseOptionUnlocked;      // Vrai si l'option d'achat "max" est débloquée.
// export let statsButtonUnlocked;            // Vrai si le bouton "Statistiques" est débloqué.
// export let prestigeMenuButtonUnlocked;     // Vrai si le bouton de menu "Prestige" est débloqué.
// export let ascensionMenuButtonUnlocked;    // Vrai si le bouton de menu "Ascension" est débloqué.
// export let lyceesUnlocked;                 // Vrai si les Lycées sont débloqués. (maj 30/05 - debug)
// export let collegesUnlocked;               // Vrai si les Collèges sont débloqués. (maj 30/05 - debug)
// export let studiesSkillsUnlocked;          // Vrai si les compétences d'études sont débloquées. (maj 30/05 - debug)
// export let ascensionSkillsUnlocked;        // Vrai si les compétences d'ascension sont débloquées. (maj 30/05 - debug)
// export let prestigeSkillsUnlocked;         // Vrai si les compétences de prestige sont débloquées. (maj 30/05 - debug)
//
// ------------------ Variables d'Automatisation ------------------
//
// export let autoEleveActive;                // Vrai si l'automatisation des Élèves est active.
// export let autoClasseActive;               // Vrai si l'automatisation des Classes est active.
// export let autoImageActive;                // Vrai si l'automatisation des Images est active.
// export let autoProfesseurActive;           // Vrai si l'automatisation des Professeurs est active.
//
// ------------------ Variables de Compétences ------------------
//
// export let studiesSkillPoints;             // Points de compétence d'Études.
// export let ascensionSkillPoints;           // Points de compétence d'Ascension.
// export let prestigeSkillPoints;            // Points de compétence de Prestige.
// export let studiesSkillLevels;             // Objet { skillId: level, ... } pour les niveaux de compétences d'études.
// export let ascensionSkillLevels;           // Objet { skillId: level, ... } pour les niveaux de compétences d'ascension.
// export let prestigeSkillLevels;            // Objet { skillId: level, ... } pour les niveaux de compétences de prestige.
// export let secretSkillClicks;              // Compteur pour la compétence secrète (clics).
//
// ------------------ Variables de Paramètres ------------------
//
// export let isDayTheme;                     // Vrai si le thème actuel est le thème de jour.
// export let themeOptionUnlocked;            // Vrai si l'option de changement de thème est débloquée.
// export let offlineProgressEnabled;         // Vrai si le progrès hors ligne est activé.
// export let minimizeResourcesActive;        // Vrai si l'affichage des ressources est minimisé.
// export let disableAscensionWarning;        // Vrai pour désactiver l'avertissement de première ascension.
// export let firstAscensionPerformed;        // Vrai si la première ascension a été effectuée.
// export let disablePrestigeWarning;         // Vrai pour désactiver l'avertissement de prestige.
//
// ------------------ Variables de Prestige (quantités d'achats de prestige) ------------------
//
// export let nombreLicences;                 // Nombre de Licences achetées.
// export let nombreMaster1;                  // Nombre de Master 1 achetés.
// export let nombreMaster2;                  // Nombre de Master 2 achetés.
// export let nombreDoctorat;                 // Nombre de Doctorats achetés.
// export let nombrePostDoctorat;             // Nombre de Post-Doctorats achetés.
//
// ------------------ Objets de Bonus Cumulés (skillEffects) ------------------
// Cet objet agrège tous les multiplicateurs et réductions de coût provenant
// des compétences, succès et achats de prestige. Il est mis à jour par `applyAllSkillEffects`.
//
// export let skillEffects = {
//     clickBonsPointsBonus: new Decimal(0),       // Bonus additif aux BP gagnés par clic.
//     eleveBpsMultiplier: new Decimal(1),         // Multiplicateur de production des Élèves.
//     classeBpsMultiplier: new Decimal(1),        // Multiplicateur de production des Classes.
//     imageBpsMultiplier: new Decimal(1),         // Multiplicateur de production des Images.
//     ProfesseurBpsMultiplier: new Decimal(1),    // Multiplicateur de production des Professeurs.
//     eleveCostReduction: new Decimal(0),         // Pourcentage de réduction du coût des Élèves (0 à 1).
//     classeCostReduction: new Decimal(0),        // Pourcentage de réduction du coût des Classes.
//     imageCostReduction: new Decimal(0),         // Pourcentage de réduction du coût des Images.
//     ProfesseurCostReduction: new Decimal(0),    // Pourcentage de réduction du coût des Professeurs.
//     ecoleCostReduction: new Decimal(0),         // Pourcentage de réduction du coût des Écoles.
//     automationCostReduction: new Decimal(0),    // Pourcentage de réduction du coût d'automatisation.
//     allCostReduction: new Decimal(0),           // Réduction de coût globale.
//     allBpsMultiplier: new Decimal(1),           // Multiplicateur de production globale de BP/s.
//     paGainMultiplier: new Decimal(1),           // Multiplicateur de gain de Points d'Ascension.
//     ascensionBonusIncrease: new Decimal(0),     // Augmentation additive du bonus d'Ascension.
//     offlineProductionIncrease: new Decimal(0),  // Augmentation du progrès hors ligne.
//     allProductionMultiplier: new Decimal(1),    // Multiplicateur de production de toutes les structures.
//     licenceProfMultiplier: new Decimal(0),      // Pourcentage de boost du multiplicateur Professeur par Licence.
//     master1ClassProduction: new Decimal(0),     // Pourcentage de boost de la production des Classes par Master I.
//     master2ClassProduction: new Decimal(0),     // Pourcentage de boost de la production des Classes par Master II.
//     doctoratBPSBonus: new Decimal(0),           // Pourcentage de boost BP/s du Doctorat.
//     doctoratMinClasses: 0,                      // Nombre minimum de classes après Ascension par Doctorat.
//     postDoctoratPAGain: new Decimal(0),         // Pourcentage de boost de gain de PA par Ascension par Post-Doctorat.
// };
//
// export let permanentBpsBonusFromAchievements; // Decimal : Bonus cumulé à la production de BP/s provenant des récompenses de succès permanents. Cette variable est gérée par 'achievements.js' via les fonctions de récompense des succès qui la reçoivent en paramètre. (maj 30/05 débug)
//
// ------------------ Variables pour les Coûts Actuels ------------------
// Ces variables stockent les coûts actuels des achats pour l'affichage dans ui.js.
//
// export let coutEleveActuel;                // Coût actuel d'un Élève.
// export let coutClasseActuel;               // Coût actuel d'une Classe.
// export let coutImageActuel;                // Coût actuel d'une Image.
// export let coutProfesseurActuel;           // Coût actuel d'un Professeur.
// export let coutEcoleActuel;                // Coût actuel d'une École.
// export let coutLyceeActuel;                // Coût actuel d'un Lycée.
// export let coutCollegeActuel;              // Coût actuel d'un Collège.
// export let coutLicenceActuel;              // Coût actuel d'une Licence.
// export let coutMaster1Actuel;              // Coût actuel d'un Master 1.
// export let coutMaster2Actuel;              // Coût actuel d'un Master 2.
// export let coutDoctoratActuel;             // Coût actuel d'un Doctorat.
// export let coutPostDoctoratActuel;         // Coût actuel d'un Post-Doctorat.
//
// ------------------ Variables de Temps pour la Boucle de Jeu ------------------
//
// export const gameTickInterval = 50;        // Intervalle de mise à jour de la logique du jeu en ms.
// export const displayUpdateInterval = 100;  // Intervalle de mise à jour de l'affichage en ms.
// export const saveCheckInterval = 5000;     // Intervalle de sauvegarde en ms.
//
// export let lastUpdate = Date.now();        // Dernier timestamp de mise à jour pour le progrès hors ligne.
// export let lastDisplayUpdateTime = 0;      // Dernier timestamp de mise à jour de l'affichage.
// export let lastSaveCheckTime = 0;          // Dernier timestamp de vérification de sauvegarde.
//
// ------------------ Fonctions Utilitaires ------------------
//
// export function formatNumber(num, decimalPlaces = 2, exponentThreshold = 6)
//   // Formate un nombre (Decimal ou number) en notation scientifique ou standard
//   // (ex: 1.23K, 4.56M, 7.89e+9).
//   // - num: Le nombre à formater.
//   // - decimalPlaces: Nombre de décimales à afficher.
//   // - exponentThreshold: Seuil d'exposant pour passer en notation scientifique.
//
// export function performPurchase(itemType, quantityRequested, isAutomated = false)
//   // Gère l'achat d'un élément du jeu (Élève, Classe, Image, Professeur, École, Lycée, Collège,
//   // Licences, Masters, Doctorats, Post-Doctorats).
//   // Calcule le coût, déduit les ressources, incrémente le compteur d'éléments,
//   // met à jour les quêtes, applique les effets de compétences et sauvegarde le jeu.
//   // - itemType: Le type d'élément à acheter (chaîne de caractères).
//   // - quantityRequested: La quantité à acheter (Decimal, '1', '10', '100', 'max').
//   // - isAutomated: Vrai si l'achat est effectué par l'automatisation (désactive les notifications).
//
// ------------------ Fonctions de Sauvegarde et Chargement ------------------
//
// export function saveGameState()
//   // Sauvegarde l'état actuel de toutes les variables du jeu dans le localStorage.
//   // Convertit les objets Decimal en chaînes de caractères pour la sauvegarde.
//   // Inclut les données de succès (`unlockedAchievements`, `permanentBpsBonusFromAchievements`)
//   // et de quêtes (`completedQuests`, `paMultiplierFromQuêtes`). (maj 30/05 core)
//
// export function loadGameState()
//   // Charge l'état du jeu depuis le localStorage.
//   // Si aucune sauvegarde n'est trouvée, initialise le jeu à son état par défaut.
//   // Convertit les chaînes de caractères chargées en objets Decimal.
//   // Applique le thème, calcule le progrès hors ligne et affiche une notification.
//   // Gère la rétrocompatibilité des sauvegardes pour les nouvelles variables, incluant la variable 'permanentBpsBonusFromAchievements'. (maj 30/05 core)
//
// export function resetGameVariables()
//   // Réinitialise toutes les variables du jeu à leur état initial par défaut.
//   // Utilisée lors d'un nouveau jeu ou d'un hard reset.
//   // Réinitialise également l'état des succès, des quêtes non permanentes et la variable 'permanentBpsBonusFromAchievements'. (maj 30/05 core)
//
// function resetSkillEffects()
//   // Réinitialise l'objet `skillEffects` à ses valeurs par défaut.
//   // Appelée avant d'appliquer les effets des compétences/bonus pour éviter les cumuls incorrects.
//
// export function hardResetGame()
//   // Effectue une réinitialisation complète du jeu (hard reset).
//   // Supprime la sauvegarde du localStorage et réinitialise toutes les variables.
//
// export function softResetGame()
//   // Effectue une réinitialisation douce du jeu (soft reset), utilisée après une Ascension.
//   // Réinitialise certaines variables (BP, images, élèves, classes, professeurs, clics, compétences d'études)
//   // tout en conservant les déverrouillages majeurs et les progrès d'Ascension/Prestige.
//   // Réinitialise les quêtes non permanentes. (maj 30/05 core)
//
// export function superSoftResetGame()
//   // Effectue une réinitialisation super douce du jeu (super soft reset), utilisée après un Prestige.
//   // Réinitialise la plupart des variables comme un soft reset, mais conserve les points de prestige
//   // et les achats de prestige, et réinitialise les compétences d'Ascension.
//   // Réinitialise les quêtes non permanentes. (maj 30/05 core)
//
// ------------------ Fonctions de Calcul et de Mise à Jour ------------------
//
// export function updateCosts()
//   // Met à jour les coûts actuels de tous les éléments achetables (Élèves, Classes, Écoles, etc.)
//   // en appelant les fonctions de calcul de coût respectives des autres modules.
//
// export function calculateTotalBPS()
//   // Calcule la production totale de Bons Points par seconde (BP/s).
//   // Prend en compte la production de base des unités et applique tous les multiplicateurs
//   // provenant des compétences, de l'Ascension, du Prestige, des Succès (via 'permanentBpsBonusFromAchievements') et des Quêtes. (maj 30/05 core)
//
// export function checkUnlockConditions()
//   // Vérifie les conditions de déverrouillage de toutes les fonctionnalités du jeu
//   // (nouvelles unités, menus, options) et les débloque si les conditions sont remplies.
//   // Met à jour la visibilité des sections de l'interface utilisateur.
//   // Déclenche le rendu initial des quêtes et succès lors de leur déverrouillage. (maj 30/05 core)
//
// export function applyAllSkillEffects()
//   // Applique tous les effets cumulés des compétences (études, ascension, prestige),
//   // des succès permanents et des bonus des achats de prestige.
//   // Réinitialise `skillEffects` puis le reconstruit avec les bonus actifs.
//   // Il intègre les multiplicateurs de PA des quêtes et s'assure que les bonus permanents des succès (gérés par 'achievements.js' dans 'permanentBpsBonusFromAchievements') sont pris en compte dans le calcul global des BP/s. (maj 30/05 core)
//
// export function updateCachedMultipliers()
//   // Met à jour les multiplicateurs mis en cache, en s'assurant que `calculateTotalBPS`
//   // est appelée pour refléter les derniers effets.
//
// export function calculateOfflineProgress()
//   // Calcule les Bons Points gagnés pendant que le joueur était hors ligne,
//   // en fonction du temps écoulé et de la production hors ligne.
//   // N'applique le progrès que si le temps écoulé dépasse un certain seuil.
//
// ------------------ Fonction d'Initialisation du Jeu ------------------
//
// export function initializeGame()
//   // Fonction principale d'initialisation du jeu, appelée au chargement de la page.
//   // Charge l'état du jeu, met à jour tous les éléments d'interface,
//   // vérifie les déverrouillages initiaux et démarre la boucle de jeu principale.
//   // La boucle de jeu met à jour la logique et l'affichage à intervalles réguliers.
//   // S'assure que les quêtes et succès sont rendus au démarrage. (maj 30/05 core)
//
// ------------------ Dépendances (Imports) ------------------
//
// Importations depuis './studies.js':
//   - calculateNextEleveCost, calculateNextClasseCost, calculateNextImageCost, calculateNextProfessorCost
//   - elevesBpsPerItem, classesBpsPerItem, imagesBpsPerItem, ProfesseurBpsPerItem
// Importations depuis './automation.js':
//   - calculateAutomationCost, runAutomation
// Importations depuis './data.js':
//   - skillsData, prime_PA, prestigePurchasesData
// Importations depuis './ascension.js':
//   - calculatePAGained, performAscension, calculateNextEcoleCost, calculateNextLyceeCost, calculateNextCollegeCost
// Importations depuis './prestige.js':
//   - calculatePPGained, performPrestige, getPrestigeBonusMultiplier, calculateLicenceCost, calculateMaster1Cost, calculateMaster2Cost, calculateDoctoratCost, calculatePostDoctoratCost
// Importations depuis './quests.js':
//   - updateQuestProgress, questsData
// Importations depuis './achievements.js':
//   - checkAchievements, achievementsData, unlockedAchievements
//   - Note : La variable 'permanentBpsBonusFromAchievements' est déclarée et exportée par 'core.js'. Elle est modifiée par 'achievements.js' via les fonctions de récompense des succès qui la reçoivent en paramètre. (maj 30/05 débug)
// Importations depuis './ui.js':
//   - updateDisplay, updateButtonStates, updateSectionVisibility, updateAutomationButtonStates,
//     updateSettingsButtonStates, renderSkillsMenu, renderQuests, renderAchievements,
//     openTab, closeStatsModal, updateStatsDisplay, showNotification
//   - Note : Les fonctions de tooltip (`showAchievementTooltip`, `hideAchievementTooltip`, `toggleAchievementTooltip`)
//     sont gérées directement par `events.js` via délégation et appellent des fonctions de `achievements.js`. (maj 30/05 core)
//
// Remarque: La bibliothèque Decimal.js (ou break_infinity.min.js) est supposée être chargée
// globalement avant ce script pour la gestion des grands nombres.
//
// ---------------------------------------------------------------------

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
export let lyceesUnlocked = false; // Vrai si les Lycées sont débloqués. (maj 30/05 - debug)
export let collegesUnlocked = false; // Vrai si les Collèges sont débloqués. (maj 30/05 - debug)
export let studiesSkillsUnlocked = false; // Vrai si les compétences d'études sont débloquées. (maj 30/05 - debug)
export let ascensionSkillsUnlocked = false; // Vrai si les compétences d'ascension sont débloquées. (maj 30/05 - debug)
export let prestigeSkillsUnlocked = false; // Vrai si les compétences de prestige sont débloquées. (maj 30/05 - debug)

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

// Variables pour les quêtes (maj 30/05 Quetes)
export let completedQuests = {}; // Objet pour suivre l'état de complétion et de réclamation des quêtes (maj 30/05 Quetes)
export let paMultiplierFromQuests = new Decimal(1); // Multiplicateur de gain de PA provenant des quêtes (maj 30/05 Quetes)

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

    // Multiplicateurs spécifiques aux structures d'Ascension (maj 30/05 débug v2)
    ecoleMultiplier: new Decimal(1),
    lyceeMultiplier: new Decimal(1),
    collegeMultiplier: new Decimal(1),

    // Effets spécifiques du Prestige
    licenceProfMultiplier: new Decimal(0), // Pourcentage de boost du multiplicateur Professeur
    master1ClassProduction: new Decimal(0), // Pourcentage de boost de la production des Classes par Prof
    master2ClassProduction: new Decimal(0), // Pourcentage de boost de la production des Classes par PP
    doctoratBPSBonus: new Decimal(0), // Pourcentage de boost BP/s du Doctorat
    doctoratMinClasses: 0, // Nombre minimum de classes après Ascension
    postDoctoratPAGain: new Decimal(0), // Pourcentage de boost de gain de PA par Ascension
};

// Variable pour le bonus permanent de BPS provenant des succès (maj 30/05 débug)
export let permanentBpsBonusFromAchievements; 

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
import { updateQuestProgress, questsData } from './quests.js'; // completedQuests et paMultiplierFromQuests sont maintenant définis dans core.js (maj 30/05 Quetes)
import { checkAchievements, achievementsData, unlockedAchievements } from './achievements.js'; // permanentBpsBonusFromAchievements n'est plus importé ici, il est exporté par core.js (maj 30/05 débug)
import { updateDisplay, updateButtonStates, updateSectionVisibility, updateAutomationButtonStates,
         updateSettingsButtonStates, renderSkillsMenu, renderQuests, renderAchievements,
         openTab, closeStatsModal, updateStatsDisplay, showNotification } from './ui.js'; // (maj 30/05 core)
import { prime_PA, prestigePurchasesData } from './data.js'; // prime_PA et prestigePurchasesData sont définis dans data.js

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


/**
 * Gère l'achat d'un élément du jeu.
 * @param {string} itemType Le type d'élément à acheter (e.g., 'eleve', 'classe', 'image', 'Professeur').
 * @param {Decimal|string} quantityRequested La quantité à acheter (Decimal, '1', '10', '100', 'max').
 * @param {boolean} isAutomated Indique si l'achat est effectué par l'automatisation.
 */
export function performPurchase(itemType, quantityRequested, isAutomated = false) {
    let currentResource, costFunction, itemCounter, resourceToDecrement;
    let totalCostPA = new Decimal(0); // Track total PA cost for automation purchases
    let totalCostPP = new Decimal(0); // Track total PP cost for prestige purchases
    // First, check for and apply any new achievement multipliers before calculating cost
    checkAchievements(); // (maj 30/05 core)

    switch (itemType) {
        case 'eleve':
            currentResource = bonsPoints;
            costFunction = calculateNextEleveCost;
            itemCounter = nombreEleves;
            resourceToDecrement = 'bonsPoints';
            break;
        case 'classe':
            currentResource = bonsPoints;
            costFunction = calculateNextClasseCost;
            itemCounter = nombreClasses;
            resourceToDecrement = 'bonsPoints';
            break;
        case 'image':
            currentResource = bonsPoints;
            costFunction = calculateNextImageCost;
            itemCounter = images;
            resourceToDecrement = 'bonsPoints';
            break;
        case 'Professeur':
            currentResource = images;
            costFunction = calculateNextProfessorCost;
            itemCounter = nombreProfesseur;
            resourceToDecrement = 'images';
            break;
        case 'ecole': // Added for école purchase
            currentResource = ascensionPoints;
            costFunction = calculateNextEcoleCost;
            itemCounter = schoolCount;
            resourceToDecrement = 'ascensionPoints';
            break;
        case 'lycee': // Added for lycee purchase
            currentResource = ascensionPoints;
            costFunction = calculateNextLyceeCost;
            itemCounter = nombreLycees;
            resourceToDecrement = 'ascensionPoints';
            break;
        case 'college': // Added for college purchase
            currentResource = ascensionPoints;
            costFunction = calculateNextCollegeCost;
            itemCounter = nombreColleges;
            resourceToDecrement = 'ascensionPoints';
            break;
        case 'licence':
            currentResource = prestigePoints;
            costFunction = calculateLicenceCost;
            itemCounter = nombreLicences;
            resourceToDecrement = 'prestigePoints';
            break;
        case 'master1':
            currentResource = prestigePoints;
            costFunction = calculateMaster1Cost;
            itemCounter = nombreMaster1;
            resourceToDecrement = 'prestigePoints';
            break;
        case 'master2':
            currentResource = prestigePoints;
            costFunction = calculateMaster2Cost;
            itemCounter = nombreMaster2;
            resourceToDecrement = 'prestigePoints';
            break;
        case 'doctorat':
            currentResource = prestigePoints;
            costFunction = calculateDoctoratCost;
            itemCounter = nombreDoctorat;
            resourceToDecrement = 'prestigePoints';
            break;
        case 'postDoctorat':
            currentResource = prestigePoints;
            costFunction = calculatePostDoctoratCost;
            itemCounter = nombrePostDoctorat;
            resourceToDecrement = 'prestigePoints';
            break;
        default:
            return;
    }

    // Check prerequisites for prestige purchases
    // prestigePurchasesData est importé de data.js (maj 30/05 core)
    if (itemType === 'doctorat' && !prestigePurchasesData.find(p => p.id === 'doctorat').prerequisites()) {
        showNotification("Conditions pour Doctorat non remplies (10 Prestiges nécessaires) !");
        return;
    }
    if (itemType === 'postDoctorat' && !prestigePurchasesData.find(p => p.id === 'postDoctorat').prerequisites()) {
        showNotification("Conditions pour Post-Doctorat non remplies (30 Prestiges, 100 Ascensions nécessaires) !");
        return;
    }

    let quantityToBuy = new Decimal(0);
    let currentCost = new Decimal(0);

    if (quantityRequested === 'max') {
        let tempItemCounter = itemCounter;
        let tempResource = currentResource;

        // Add a safety limit for max buy to prevent potential infinite loops or extreme calculations
        const maxIterations = 100000; // Cap the number of items to check
        let iterations = 0;

        while (iterations < maxIterations) {
            let costPerItem = costFunction(tempItemCounter); // Pass tempItemCounter to cost function
            if (tempResource.gte(costPerItem)) {
                tempResource = tempResource.sub(costPerItem);
                tempItemCounter = tempItemCounter.add(1);
                quantityToBuy = quantityToBuy.add(1);
                currentCost = currentCost.add(costPerItem); // Accumulate total cost for 'max'
                iterations++;
            } else {
                break; // Not enough resources
            }
        }
    } else {
        // For x1, x10, x100
        let numToBuy = new Decimal(quantityRequested);
        let tempItemCounter = itemCounter;
        let tempResource = currentResource;
        let totalCostForQuantity = new Decimal(0);

        for (let i = 0; i < numToBuy.toNumber(); i++) {
            let costPerItem = costFunction(tempItemCounter); // Pass tempItemCounter to cost function
            if (tempResource.gte(costPerItem)) {
                tempResource = tempResource.sub(costPerItem);
                tempItemCounter = tempItemCounter.add(1);
                totalCostForQuantity = totalCostForQuantity.add(costPerItem);
                quantityToBuy = quantityToBuy.add(1);
            } else {
                break; // Cannot afford all requested items
            }
        }
        currentCost = totalCostForQuantity;
    }

    if (quantityToBuy.gt(0)) {
        // Decrement resource
        if (resourceToDecrement === 'bonsPoints') bonsPoints = bonsPoints.sub(currentCost);
        else if (resourceToDecrement === 'images') images = images.sub(currentCost);
        else if (resourceToDecrement === 'ascensionPoints') ascensionPoints = ascensionPoints.sub(currentCost);
        else if (resourceToDecrement === 'prestigePoints') prestigePoints = prestigePoints.sub(currentCost);

        // Increment item counter
        switch (itemType) {
            case 'eleve':
                nombreEleves = nombreEleves.add(quantityToBuy);
                break;
            case 'classe':
                nombreClasses = nombreClasses.add(quantityToBuy);
                break;
            case 'image':
                images = images.add(quantityToBuy);
                break;
            case 'Professeur':
                nombreProfesseur = nombreProfesseur.add(quantityToBuy);
                break;
            case 'ecole':
                schoolCount = schoolCount.add(quantityToBuy);
                break;
            case 'lycee':
                nombreLycees = nombreLycees.add(quantityToBuy);
                break;
            case 'college':
                nombreColleges = nombreColleges.add(quantityToBuy);
                break;
            case 'licence':
                nombreLicences = nombreLicences.add(quantityToBuy);
                break;
            case 'master1':
                nombreMaster1 = nombreMaster1.add(quantityToBuy);
                break;
            case 'master2':
                nombreMaster2 = nombreMaster2.add(quantityToBuy);
                break;
            case 'doctorat':
                nombreDoctorat = nombreDoctorat.add(quantityToBuy);
                break;
            case 'postDoctorat':
                nombrePostDoctorat = nombrePostDoctorat.add(quantityToBuy);
                break;
        }

        // Update quests related to the purchased item
        updateQuestProgress(itemType, quantityToBuy);
        // updateQuestProgress('totalBonsPointsEarned', currentCost); // If applicable for BP purchases - This line seems incorrect, totalBonsPointsEarned is not a purchase type (maj 30/05 core)

        // Apply skill effects and update display after purchase
        applyAllSkillEffects();
        updateCosts();
        calculateTotalBPS();
        updateDisplay();
        checkUnlockConditions();
        saveGameState();

        if (!isAutomated) {
            showNotification(`Acheté ${formatNumber(quantityToBuy, 0)} ${itemType}(s) !`);
        }
    } else if (!isAutomated) {
        showNotification(`Pas assez de ressources pour acheter ${itemType}(s) !`);
    }
}


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
        lyceesUnlocked: lyceesUnlocked, // (maj 30/05 - debug)
        collegesUnlocked: collegesUnlocked, // (maj 30/05 - debug)
        studiesSkillsUnlocked: studiesSkillsUnlocked, // (maj 30/05 - debug)
        ascensionSkillsUnlocked: ascensionSkillsUnlocked, // (maj 30/05 - debug)
        prestigeSkillsUnlocked: prestigeSkillsUnlocked, // (maj 30/05 - debug)
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
        unlockedAchievements: unlockedAchievements, // Sauvegarder l'état des succès (maj 30/05 core)
        permanentBpsBonusFromAchievements: permanentBpsBonusFromAchievements.toString(), // (maj 30/05 core)
        completedQuests: completedQuests, // Sauvegarder les quêtes terminées (maj 30/05 Quetes)
        paMultiplierFromQuests: paMultiplierFromQuests.toString(), // (maj 30/05 Quetes)
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
        lyceesUnlocked = gameState.lyceesUnlocked || false; // (maj 30/05 - debug)
        collegesUnlocked = gameState.collegesUnlocked || false; // (maj 30/05 - debug)
        studiesSkillsUnlocked = gameState.studiesSkillsUnlocked || false; // (maj 30/05 - debug)
        ascensionSkillsUnlocked = gameState.ascensionSkillsUnlocked || false; // (maj 30/05 - debug)
        prestigeSkillsUnlocked = gameState.prestigeSkillsUnlocked || false; // (maj 30/05 - debug)

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

        lastUpdate = gameState.lastUpdate || Date.now(); // Enregistrer le timestamp de la sauvegarde
        unlockedAchievements = gameState.unlockedAchievements || {}; // (maj 30/05 core)
        permanentBpsBonusFromAchievements = new Decimal(gameState.permanentBpsBonusFromAchievements || 0); // Initialisation de la variable (maj 30/05 débug)
        completedQuests = gameState.completedQuests || {}; // (maj 30/05 Quetes)
        paMultiplierFromQuests = new Decimal(gameState.paMultiplierFromQuests || 1); // (maj 30/05 Quetes)

        // Appliquer le thème immédiatement après le chargement
        document.body.classList.toggle('dark-theme', !isDayTheme); // (maj 30/05 core)

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
export function resetGameVariables() {
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
    lyceesUnlocked = false; // (maj 30/05 - debug)
    collegesUnlocked = false; // (maj 30/05 - debug)
    studiesSkillsUnlocked = false; // (maj 30/05 - debug)
    ascensionSkillsUnlocked = false; // (maj 30/05 - debug)
    prestigeSkillsUnlocked = false; // (maj 30/05 - debug)

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
    unlockedAchievements = {}; // (maj 30/05 core)
    permanentBpsBonusFromAchievements = new Decimal(0); // Réinitialisation de la variable (maj 30/05 débug)

    // Réinitialiser les quêtes (maj 30/05 Quetes)
    completedQuests = {}; // (maj 30/05 Quetes)
    paMultiplierFromQuests = new Decimal(1); // (maj 30/05 Quetes)

    resetSkillEffects();
    updateCosts();
    applyAllSkillEffects();
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
    document.body.classList.remove('dark-theme'); // S'assurer du thème par défaut (maj 30/05 core)
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
        // Multiplicateurs spécifiques aux structures d'Ascension (maj 30/05 débug v2)
        ecoleMultiplier: new Decimal(1),
        lyceeMultiplier: new Decimal(1),
        collegeMultiplier: new Decimal(1),
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

    // Réinitialiser les quêtes non permanentes (maj 30/05 Quetes)
    for (const questId in questsData) {
        if (!questsData[questId].permanent) {
            // Seules les quêtes non permanentes sont réinitialisées
            const quest = questsData[questId];
            if (completedQuests[quest.id]) { // Si la quête était complétée
                delete completedQuests[quest.id]; // La retirer des quêtes complétées (maj 30/05 Quetes)
            }
        }
    }
    paMultiplierFromQuests = new Decimal(1); // Réinitialiser le multiplicateur de PA des quêtes (maj 30/05 Quetes)

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

    // Les quêtes sont réinitialisées sauf si permanentes (maj 30/05 Quetes)
    for (const questId in questsData) {
        if (!questsData[questId].permanent) {
            const quest = questsData[questId];
            if (completedQuests[quest.id]) {
                delete completedQuests[quest.id];
            }
        }
    }
    paMultiplierFromQuests = new Decimal(1); // Réinitialiser le multiplicateur de PA des quêtes (maj 30/05 Quetes)

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
    const prestigeBpsMultiplier = getPrestigeBonusMultiplier('bps', prestigeCount);

    // Multiplicateur permanent des succès (maj 30/05 core)
    const achievementBpsMultiplier = permanentBpsBonusFromAchievements.add(1); // (maj 30/05 core)

    // Multiplicateur global de toutes les productions de structures
    const allProductionMultiplier = skillEffects.allProductionMultiplier;

    totalBonsPointsParSeconde = studiesProduction
        .times(currentAscensionMultiplier)
        .times(prestigeBpsMultiplier)
        .times(achievementBpsMultiplier) // Appliquer le bonus des succès (maj 30/05 core)
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
        updateQuestProgress(); // Initialiser les quêtes (maj 30/05 core)
    }

    // Déverrouillage des succès
    if (totalClicks.gte(15) && !achievementsButtonUnlocked) {
        achievementsButtonUnlocked = true;
        showNotification("Succès débloqués !");
        updateSectionVisibility();
        renderAchievements(); // Afficher les succès pour la première fois (maj 30/05 core)
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

    // Déverrouillage des Lycées et Collèges (maj 30/05 - debug)
    if (schoolCount.gte(1) && !lyceesUnlocked) {
        lyceesUnlocked = true;
        showNotification("Lycées débloqués !");
        updateSectionVisibility();
    }
    if (nombreLycees.gte(1) && !collegesUnlocked) {
        collegesUnlocked = true;
        showNotification("Collèges débloqués !");
        updateSectionVisibility();
    }

    // Déverrouillage des panneaux de compétences (maj 30/05 - debug)
    if (studiesSkillPoints.gt(0) && !studiesSkillsUnlocked) {
        studiesSkillsUnlocked = true;
        showNotification("Compétences d'Études débloquées !");
        updateSectionVisibility();
    }
    if (ascensionSkillPoints.gt(0) && !ascensionSkillsUnlocked) {
        ascensionSkillsUnlocked = true;
        showNotification("Compétences d'Ascension débloquées !");
        updateSectionVisibility();
    }
    if (prestigeSkillPoints.gt(0) && !prestigeSkillsUnlocked) {
        prestigeSkillsUnlocked = true;
        showNotification("Compétences de Prestige débloquées !");
        updateSectionVisibility();
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
            skill.effect(level, skillEffects); // Passer skillEffects pour modification (maj 30/05 core)
        }
    }

    // Appliquer les effets des compétences d'ascension
    for (const skillId in ascensionSkillLevels) {
        const level = ascensionSkillLevels[skillId];
        const skill = skillsData.ascension.find(s => s.id === skillId);
        if (skill && skill.effect) {
            skill.effect(level, skillEffects); // Passer skillEffects pour modification (maj 30/05 core)
        }
    }

    // Appliquer les effets des compétences de prestige
    for (const skillId in prestigeSkillLevels) {
        const level = prestigeSkillLevels[skillId];
        const skill = skillsData.prestige.find(s => s.id === skillId);
        if (skill && skill.effect) {
            skill.effect(level, skillEffects); // Passer skillEffects pour modification (maj 30/05 core)
        }
    }

    // Appliquer les bonus permanents des succès (maj 30/05 core)
    // permanentBpsBonusFromAchievements est déjà cumulé dans achievements.js
    // et est une valeur directe à ajouter au multiplicateur global.
    // Les autres bonus de succès (réductions de coût, BP par clic) sont déjà
    // appliqués directement à skillEffects par achievements.js.
    // skillEffects.allBpsMultiplier est déjà multiplié par achievementBpsMultiplier dans calculateTotalBPS.
    // Donc, pas de modification directe de skillEffects.allBpsMultiplier ici pour permanentBpsBonusFromAchievements.

    // Appliquer les multiplicateurs de PA des quêtes (maj 30/05 Quetes)
    skillEffects.paGainMultiplier = skillEffects.paGainMultiplier.times(paMultiplierFromQuests); // (maj 30/05 Quetes)

    // Appliquer les bonus des achats de prestige (maj 30/05 core)
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
    renderAchievements(); // Rendre les succès (maj 30/05 core)
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
        updateQuestProgress(); // Vérifier la progression des quêtes
        checkAchievements(); // Vérifier les succès (maj 30/05 core)

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
            renderAchievements(); // Re-rendre les succès (maj 30/05 core)
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
