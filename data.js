// ------------------ Fiche Mémo : data.js -----------------------------
//
// Description : Ce fichier est le dépôt central de toutes les données statiques et de configuration du jeu.
// Il contient les valeurs de base pour les coûts des améliorations, les productions des unités,
// les définitions complètes des arbres de compétences (Études, Ascension, Prestige),
// les détails des achats de Prestige, les définitions des quêtes,
// et d'autres constantes ou seuils importants pour la progression du jeu.
//
// Objectif : Fournir une source unique et fiable pour toutes les données numériques et structurelles
// du jeu qui ne changent pas dynamiquement pendant une partie.
// Ce fichier ne contient aucune logique de jeu active (calculs, modifications d'état) ;
// il est purement déclaratif.
//
// ------------------ Dépendances ------------------
//
// - `break_infinity.min.js` : La bibliothèque `Decimal` est supposée être globalement disponible.
//   Impact : Essentielle pour toutes les valeurs numériques importantes définies ici,
//             assurant une précision illimitée pour les très grands nombres.
//             Toutes les propriétés numériques exportées sont des objets `Decimal`.
//
// ------------------ Variables Clés Définies et Exportées ------------------
//
// export const initialCosts : Objet JavaScript contenant les coûts de base initiaux pour chaque type d'achat.
//   Description : Définit le coût de la première unité de chaque type d'amélioration.
//   Type : Objet littéral, chaque valeur est un `Decimal`.
//   Propriétés :
//     - `eleve` (Decimal) : Coût de base pour acquérir un Élève.
//     - `classe` (Decimal) : Coût de base pour acquérir une Classe.
//     - `image` (Decimal) : Coût de base pour acquérir une Image.
//     - `Professeur` (Decimal) : Coût de base pour acquérir un Professeur, exprimé en Images.
//     - `ecole` (Decimal) : Coût de base pour acquérir une École, exprimé en Points d'Ascension (PA).
//     - `lycee` (Decimal) : Coût de base pour acquérir un Lycée, exprimé en Points d'Ascension (PA).
//     - `college` (Decimal) : Coût de base pour acquérir un Collège, exprimé en Points d'Ascension (PA).
//     - `licence` (Decimal) : Coût de base pour acquérir une Licence, exprimé en Points de Prestige (PP).
//     - `master1` (Decimal) : Coût de base pour acquérir un Master I, exprimé en Points de Prestige (PP).
//     - `master2` (Decimal) : Coût de base pour acquérir un Master II, exprimé en Points de Prestige (PP).
//     - `doctorat` (Decimal) : Coût de base pour acquérir un Doctorat, exprimé en Points de Prestige (PP).
//     - `postDoctorat` (Decimal) : Coût de base pour acquérir un Post-Doctorat, exprimé en Points de Prestige (PP).
//   Impact sur d'autres modules :
//     - Utilisé par `studies.js` pour `calculateNextEleveCost`, `calculateNextClasseCost`,
//       `calculateNextImageCost`, `calculateNextProfessorCost`.
//     - Utilisé par `ascension.js` pour `calculateNextEcoleCost`, `calculateNextLyceeCost`,
//       `calculateNextCollegeCost`.
//     - Utilisé par `prestige.js` pour `calculateLicenceCost`, `calculateMaster1Cost`,
//       `calculateMaster2Cost`, `calculateDoctoratCost`, `calculatePostDoctoratCost`.
//     - `core.js` peut y accéder pour les coûts de base lors de la réinitialisation ou de l'initialisation.
//
// export const baseProductions : Objet JavaScript définissant la production de base de chaque unité.
//   Description : Représente la quantité de Bons Points par seconde (BP/s) ou le multiplicateur
//                 de production de base fourni par une seule unité de chaque type.
//   Type : Objet littéral, chaque valeur est un `Decimal`.
//   Propriétés :
//     - `eleveBps` (Decimal) : Production de BP/s générée par un Élève.
//     - `classeBps` (Decimal) : Production de BP/s générée par une Classe.
//     - `imageBpsMultiplier` (Decimal) : Multiplicateur appliqué à la production totale de BP/s par Image.
//     - `ProfesseurClassMultiplier` (Decimal) : Multiplicateur appliqué à la production des Classes par Professeur.
//   Impact sur d'autres modules :
//     - Utilisé par `studies.js` pour `calculateStudiesBPS`.
//     - Utilisé par `core.js` dans `calculateTotalBPS` pour les calculs de production de base.
//
// export const skillsData : Objet complexe contenant les définitions structurées de tous les arbres de compétences du jeu.
//   Description : Organisé par catégories ('studies', 'ascension', 'prestige'), chaque catégorie est un tableau de compétences.
//                 Chaque compétence est un objet avec des propriétés définissant son comportement et son effet.
//   Type : Objet littéral contenant des tableaux d'objets.
//   Structure de chaque compétence :
//     - `id` (string) : Identifiant unique.
//     - `name` (string) : Nom affiché.
//     - `description` (string) : Explication de l'effet.
//     - `cost` (number) : Coût en points de compétence.
//     - `maxLevel` (number) : Niveau maximal.
//     - `tier` (number) : Rangée dans l'arbre.
//     - `prerequisites` (array of strings) : IDs des compétences prérequises (doivent être au `maxLevel`).
//     - `effect` (function) : Fonction exécutée à l'achat/changement de niveau, modifie `skillEffects` (de `core.js`).
//   Impact sur d'autres modules :
//     - Utilisé par `skills.js` pour la logique d'achat, de réinitialisation et d'application des effets.
//     - Utilisé par `ui.js` dans `renderSkillPanel` pour générer l'affichage de l'arbre de compétences.
//     - Utilisé par `core.js` dans `applyAllSkillEffects` pour appliquer les bonus cumulés.
//
// export const prestigePurchasesData : Tableau d'objets définissant toutes les améliorations permanentes
//                                    qui peuvent être achetées avec la monnaie de Prestige (Points de Prestige - PP).
//   Description : Chaque objet représente un achat de prestige avec ses propriétés, coûts, effets et prérequis.
//   Type : Tableau d'objets.
//   Structure de chaque achat de prestige :
//     - `id` (string) : Identifiant unique.
//     - `name` (string) : Nom affiché.
//     - `baseCost` (Decimal) : Coût de base en PP.
//     - `costMultiplier` (Decimal) : Multiplicateur de coût pour les achats successifs.
//     - `getEffectValue` (function) : Calcule la valeur numérique de l'effet de l'amélioration
//                                   en fonction de son level actuel. Utilisée pour l'affichage de l'effet.
//     - `effect` (function) : Une fonction de rappel qui prend le niveau actuel de l'amélioration et l'objet skillEffects.
//                           Elle modifie directement les propriétés de skillEffects pour appliquer le bonus permanent de l'amélioration.
//     - `getMinClasses` (function, spécifique à 'doctorat') : Une fonction utilitaire pour le Doctorat,
//                                                           calculant le nombre minimum de classes après Ascension
//                                                           en fonction du niveau de Doctorat.
//     - `prerequisites` (function) : Une fonction qui retourne true si les conditions préalables à l'achat
//                                  de cette amélioration sont remplies, false sinon.
//   Impact sur d'autres modules :
//     - Utilisé par `prestige.js` pour la logique d'achat et l'application des effets.
//     - Utilisé par `ui.js` dans `updateStatsDisplay` pour afficher les bonus de prestige.
//     - Utilisé par `core.js` dans `applyAllSkillEffects` pour les bonus cumulés.
//
// export const questsData : Tableau d'objets définissant toutes les quêtes disponibles dans le jeu.
//   Description : Chaque quête est un objectif que le joueur peut accomplir pour obtenir des récompenses.
//   Type : Tableau d'objets.
//   Structure de chaque quête :
//     - `id` (string) : Identifiant unique.
//     - `name` (string) : Nom affiché.
//     - `description` (string) : Texte décrivant l'objectif.
//     - `category` (string) : Catégorie de la quête (ex: "Fondations", "Expansion Académique").
//     - `condition` (function) : Fonction qui retourne `true` si l'objectif est atteint (prend un objet `gameState` en paramètre).
//     - `reward` (object) : Objet décrivant la récompense (`type`, `amount`).
//     - `rewardText` (string) : Description textuelle de la récompense.
//     - `permanent` (boolean) : Indique si la quête persiste à travers les réinitialisations.
//   Impact sur d'autres modules :
//     - Utilisé par `quests.js` pour `updateQuestProgress` et `claimQuestReward`.
//     - Utilisé par `ui.js` dans `renderQuests` pour afficher la liste des quêtes.
//
// export const achievementsData : Tableau d'objets définissant tous les succès disponibles dans le jeu.
//   Description : Chaque succès est un objectif que le joueur peut accomplir pour obtenir des récompenses.
//   Type : Tableau d'objets.
//   Structure de chaque succès :
//     - `id` (string) : Identifiant unique.
//     - `name` (string) : Nom affiché.
//     - `description` (string) : Texte décrivant la condition du succès.
//     - `condition` (function) : Fonction qui retourne `true` si le succès est débloqué (prend un objet `gameState` en paramètre).
//     - `rewardText` (string) : Texte descriptif de la récompense.
//     - `rewardFn` (function) : Fonction exécutée lors du déverrouillage du succès pour appliquer la récompense.
//                               Elle prend `skillEffects` et `permanentBpsBonusFromAchievements` ou `gameState` en paramètres
//                               selon le type de récompense, et peut retourner une nouvelle valeur pour les points (PA, SP).
//   Impact sur d'autres modules :
//     - Utilisé par `achievements.js` pour `checkAchievements` et `renderAchievements`.
//
// export const bonusPointThresholds : Tableau d'objets Decimal définissant les seuils de Bons Points (BP)
//                                   que le joueur doit atteindre pour gagner des Points de Compétence d'Études supplémentaires.
//   Description : Chaque valeur représente un seuil successif pour l'obtention d'un point de compétence d'études.
//   Type : Tableau de `Decimal`.
//   Impact sur d'autres modules :
//     - Utilisé par `core.js` pour la logique de gain de points de compétence d'études.
//
// export const prime_PA : Constante Decimal représentant la valeur de base utilisée dans le calcul
//                       des Points d'Ascension (PA) gagnés lors d'une Ascension.
//   Description : Sert de multiplicateur ou de base pour la formule de gain de PA.
//   Type : `Decimal`.
//   Impact sur d'autres modules :
//     - Utilisé par `ascension.js` dans `calculatePAGained`.
//
// export const ASCENSION_POINT_THRESHOLD : Constante Decimal qui définit le seuil de Bons Points Total
//                                        requis pour gagner 1 Point d'Ascension (PA) lors d'une Ascension.
//   Description : Fondamentale pour déterminer la quantité de PA obtenue par le joueur.
//   Type : `Decimal`.
//   Impact sur d'autres modules :
//     - Utilisé par `ascension.js` dans `calculatePAGained`.
//
// export const PRESTIGE_POINT_THRESHOLD : Constante Decimal qui définit le seuil de Points d'Ascension Total
//                                        requis pour gagner 1 Point de Prestige (PP) lors d'un Prestige.
//   Description : Fondamentale pour déterminer la quantité de PP obtenue par le joueur.
//   Type : `Decimal`.
//   Impact sur d'autres modules :
//     - Utilisé par `prestige.js` dans `calculatePPGained`.
//
// ------------------ Logique Générale ------------------
//
// `data.js` est un fichier de configuration statique. Il ne contient aucune logique de jeu
// active (pas de fonctions qui modifient l'état du jeu ou l'interface directement).
// Son rôle est de centraliser toutes les valeurs numériques, les définitions de structures
// (compétences, achats de prestige, quêtes, succès) et les seuils qui sont constants tout au long
// de la partie. Cela rend le jeu plus facile à équilibrer et à modifier, car toutes les
// données clés sont regroupées en un seul endroit.
//
// ------------------ Notes Spécifiques ------------------
//
// - **Purement Déclaratif** : Ce fichier est conçu pour être purement déclaratif.
//   Toutes les fonctions `effect`, `condition` ou `rewardFn` définies dans les objets (`skillsData`,
//   `prestigePurchasesData`, `questsData`, `achievementsData`) sont des fonctions de rappel qui seront
//   exécutées par d'autres modules (ex: `core.js`, `skills.js`, `quests.js`, `prestige.js`, `achievements.js`).
//   Elles ne sont pas exécutées directement dans `data.js`.
// - **Utilisation de Decimal** : L'utilisation de `new Decimal()` pour toutes les valeurs
//   numériques importantes est cruciale pour gérer les très grands nombres inhérents aux jeux
//   incrémentaux sans perte de précision.
// - **Facilité de Modification** : La centralisation des données ici permet de modifier
//   facilement l'équilibrage du jeu (coûts, productions, effets) sans avoir à toucher
//   à la logique métier complexe.
//
// ---------------------------------------------------------------------


// Importation de la bibliothèque Decimal pour la gestion des grands nombres
// Assurez-vous que break_infinity.min.js est chargé AVANT ce script dans index.html
// Si Decimal n'est pas global, vous devrez l'importer explicitement si vous utilisez un système de modules.
// Pour l'instant, nous supposons qu'il est globalement disponible.
import { Decimal } from './break_infinity.min.js'; // Décommentez si vous utilisez un module bundler

// Définition des coûts initiaux pour chaque type d'achat
export const initialCosts = {
    eleve: new Decimal(10),
    classe: new Decimal(100),
    image: new Decimal(1000),
    Professeur: new Decimal(10), // Coût en Images
    ecole: new Decimal(1), // Coût en Points d'Ascension
    lycee: new Decimal(5), // Coût en Points d'Ascension
    college: new Decimal(25), // Coût en Points d'Ascension
    licence: new Decimal(1), // Coût en Points de Prestige
    master1: new Decimal(5), // Coût en Points de Prestige
    master2: new Decimal(25), // Coût en Points de Prestige
    doctorat: new Decimal(100), // Coût en Points de Prestige
    postDoctorat: new Decimal(500), // Coût en Points de Prestige
};

// Définition des productions de base pour chaque unité
export const baseProductions = {
    eleveBps: new Decimal(1),
    classeBps: new Decimal(10),
    imageBpsMultiplier: new Decimal(1.05), // Chaque image donne un multiplicateur de 1.05
    ProfesseurClassMultiplier: new Decimal(2), // Chaque professeur double la production des classes
};

// Définition des données de compétences
export const skillsData = {
    studies: [
        {
            id: 'STUDY_CLICK_POWER',
            name: 'Force de Clic',
            description: 'Augmente les Bons Points gagnés par clic de 10%.',
            cost: 1,
            maxLevel: 10,
            tier: 1,
            prerequisites: [],
            effect: (level, skillEffects) => { skillEffects.clickBonsPointsBonus = skillEffects.clickBonsPointsBonus.add(new Decimal(0.1).times(level)); }
        },
        {
            id: 'STUDY_ELEVE_EFFICIENCY',
            name: 'Efficacité Élèves',
            description: 'Augmente la production des Élèves de 25%.',
            cost: 1,
            maxLevel: 5,
            tier: 1,
            prerequisites: [],
            effect: (level, skillEffects) => { skillEffects.eleveBpsMultiplier = skillEffects.eleveBpsMultiplier.times(new Decimal(1).add(new Decimal(0.25).times(level))); }
        },
        {
            id: 'STUDY_CLASS_EFFICIENCY',
            name: 'Efficacité Classes',
            description: 'Augmente la production des Classes de 20%.',
            cost: 2,
            maxLevel: 5,
            tier: 2,
            prerequisites: ['STUDY_ELEVE_EFFICIENCY'],
            effect: (level, skillEffects) => { skillEffects.classeBpsMultiplier = skillEffects.classeBpsMultiplier.times(new Decimal(1).add(new Decimal(0.20).times(level))); }
        },
        {
            id: 'STUDY_IMAGE_EFFICIENCY',
            name: 'Efficacité Images',
            description: 'Augmente le multiplicateur des Images de 0.01 par niveau.',
            cost: 3,
            maxLevel: 10,
            tier: 2,
            prerequisites: ['STUDY_CLICK_POWER'],
            effect: (level, skillEffects) => { skillEffects.imageBpsMultiplier = skillEffects.imageBpsMultiplier.add(new Decimal(0.01).times(level)); }
        },
        {
            id: 'STUDY_PROFESSOR_EFFICIENCY',
            name: 'Efficacité Professeurs',
            description: 'Augmente le multiplicateur des Professeurs de 0.5 par niveau.',
            cost: 5,
            maxLevel: 5,
            tier: 3,
            prerequisites: ['STUDY_CLASS_EFFICIENCY', 'STUDY_IMAGE_EFFICIENCY'],
            effect: (level, skillEffects) => { skillEffects.ProfesseurBpsMultiplier = skillEffects.ProfesseurBpsMultiplier.times(new Decimal(1).add(new Decimal(0.5).times(level))); }
        },
        {
            id: 'STUDY_ALL_BPS',
            name: 'Maîtrise Académique',
            description: 'Multiplie la production totale de BP/s par 1.5.',
            cost: 10,
            maxLevel: 1,
            tier: 4,
            prerequisites: ['STUDY_PROFESSOR_EFFICIENCY'],
            effect: (level, skillEffects) => {
                if (level === 1) {
                    skillEffects.allBpsMultiplier = skillEffects.allBpsMultiplier.times(1.5);
                }
            }
        },
        {
            id: 'STUDY_COST_REDUCTION_ELEVE',
            name: 'Optimisation Élève',
            description: 'Réduit le coût des Élèves de 5% par niveau.',
            cost: 2,
            maxLevel: 5,
            tier: 2,
            prerequisites: ['STUDY_ELEVE_EFFICIENCY'],
            effect: (level, skillEffects) => { skillEffects.eleveCostReduction = skillEffects.eleveCostReduction.add(new Decimal(0.05).times(level)); }
        },
        {
            id: 'STUDY_COST_REDUCTION_CLASS',
            name: 'Optimisation Classe',
            description: 'Réduit le coût des Classes de 5% par niveau.',
            cost: 3,
            maxLevel: 5,
            tier: 3,
            prerequisites: ['STUDY_COST_REDUCTION_ELEVE'],
            effect: (level, skillEffects) => { skillEffects.classeCostReduction = skillEffects.classeCostReduction.add(new Decimal(0.05).times(level)); }
        },
        {
            id: 'STUDY_COST_REDUCTION_IMAGE',
            name: 'Optimisation Image',
            description: 'Réduit le coût des Images de 5% par niveau.',
            cost: 4,
            maxLevel: 5,
            tier: 3,
            prerequisites: ['STUDY_IMAGE_EFFICIENCY'],
            effect: (level, skillEffects) => { skillEffects.imageCostReduction = skillEffects.imageCostReduction.add(new Decimal(0.05).times(level)); }
        },
        {
            id: 'STUDY_COST_REDUCTION_PROFESSOR',
            name: 'Optimisation Professeur',
            description: 'Réduit le coût des Professeurs de 5% par niveau.',
            cost: 5,
            maxLevel: 5,
            tier: 4,
            prerequisites: ['STUDY_COST_REDUCTION_CLASS', 'STUDY_COST_REDUCTION_IMAGE'],
            effect: (level, skillEffects) => { skillEffects.ProfesseurCostReduction = skillEffects.ProfesseurCostReduction.add(new Decimal(0.05).times(level)); }
        },
        {
            id: 'STUDY_ALL_COST_REDUCTION',
            name: 'Économie Générale',
            description: 'Réduit tous les coûts d\'études de 10%.',
            cost: 15,
            maxLevel: 1,
            tier: 5,
            prerequisites: ['STUDY_COST_REDUCTION_PROFESSOR', 'STUDY_ALL_BPS'],
            effect: (level, skillEffects) => {
                if (level === 1) {
                    skillEffects.allCostReduction = skillEffects.allCostReduction.add(0.10);
                }
            }
        },
    ],
    ascension: [
        {
            id: 'ASC_PA_BOOST',
            name: 'Boost de PA',
            description: 'Augmente le gain de Points d\'Ascension de 25%.',
            cost: 1,
            maxLevel: 5,
            tier: 1,
            prerequisites: [],
            effect: (level, skillEffects) => { skillEffects.paGainMultiplier = skillEffects.paGainMultiplier.times(new Decimal(1).add(new Decimal(0.25).times(level))); }
        },
        {
            id: 'ASC_OFFLINE_PROD',
            name: 'Production Hors Ligne',
            description: 'Augmente la production hors ligne de 10% par niveau.',
            cost: 2,
            maxLevel: 10,
            tier: 1,
            prerequisites: [],
            effect: (level, skillEffects) => { skillEffects.offlineProductionIncrease = skillEffects.offlineProductionIncrease.add(new Decimal(0.10).times(level)); }
        },
        {
            id: 'ASC_ECOLE_EFFICIENCY',
            name: 'Efficacité Écoles',
            description: 'Augmente le multiplicateur des Écoles de 0.1 par niveau.',
            cost: 3,
            maxLevel: 5,
            tier: 2,
            prerequisites: ['ASC_PA_BOOST'],
            effect: (level, skillEffects) => { skillEffects.ascensionBonusIncrease = skillEffects.ascensionBonusIncrease.add(new Decimal(0.1).times(level)); }
        },
        {
            id: 'ASC_LYCEE_EFFICIENCY',
            name: 'Efficacité Lycées',
            description: 'Augmente le multiplicateur des Lycées de 0.2 par niveau.',
            cost: 4,
            maxLevel: 5,
            tier: 3,
            prerequisites: ['ASC_ECOLE_EFFICIENCY'],
            effect: (level, skillEffects) => { skillEffects.ascensionBonusIncrease = skillEffects.ascensionBonusIncrease.add(new Decimal(0.2).times(level)); }
        },
        {
            id: 'ASC_COLLEGE_EFFICIENCY',
            name: 'Efficacité Collèges',
            description: 'Augmente le multiplicateur des Collèges de 0.3 par niveau.',
            cost: 5,
            maxLevel: 5,
            tier: 4,
            prerequisites: ['ASC_LYCEE_EFFICIENCY'],
            effect: (level, skillEffects) => { skillEffects.ascensionBonusIncrease = skillEffects.ascensionBonusIncrease.add(new Decimal(0.3).times(level)); }
        },
        {
            id: 'ASC_ALL_PROD_BOOST',
            name: 'Synergie Ascension',
            description: 'Multiplie toute la production de BP/s par 2 après Ascension.',
            cost: 10,
            maxLevel: 1,
            tier: 5,
            prerequisites: ['ASC_COLLEGE_EFFICIENCY'],
            effect: (level, skillEffects) => {
                if (level === 1) {
                    skillEffects.allProductionMultiplier = skillEffects.allProductionMultiplier.times(2);
                }
            }
        },
    ],
    prestige: [
        {
            id: 'PRES_PP_BOOST',
            name: 'Boost de PP',
            description: 'Augmente le gain de Points de Prestige de 25%.',
            cost: 1,
            maxLevel: 5,
            tier: 1,
            prerequisites: [],
            effect: (level, skillEffects) => { skillEffects.ppGainMultiplier = skillEffects.ppGainMultiplier.times(new Decimal(1).add(new Decimal(0.25).times(level))); }
        },
        {
            id: 'PRES_AUTOMATION_COST_REDUCTION',
            name: 'Optimisation Automation',
            description: 'Réduit le coût d\'achat des automatisations de 10% par niveau.',
            cost: 2,
            maxLevel: 5,
            tier: 1,
            prerequisites: [],
            effect: (level, skillEffects) => { skillEffects.automationCostReduction = skillEffects.automationCostReduction.add(new Decimal(0.10).times(level)); }
        },
        {
            id: 'PRES_ALL_SKILL_POINTS',
            name: 'Maîtrise des Points',
            description: 'Augmente le gain de tous les points de compétence (Études, Ascension, Prestige) de 10%.',
            cost: 3,
            maxLevel: 5,
            tier: 2,
            prerequisites: ['PRES_PP_BOOST', 'PRES_AUTOMATION_COST_REDUCTION'],
            effect: (level, skillEffects) => {
                skillEffects.studiesSkillPointGainMultiplier = skillEffects.studiesSkillPointGainMultiplier.times(new Decimal(1).add(new Decimal(0.10).times(level)));
                skillEffects.ascensionSkillPointGainMultiplier = skillEffects.ascensionSkillPointGainMultiplier.times(new Decimal(1).add(new Decimal(0.10).times(level)));
                skillEffects.prestigeSkillPointGainMultiplier = skillEffects.prestigeSkillPointGainMultiplier.times(new Decimal(1).add(new Decimal(0.10).times(level)));
            }
        },
        {
            id: 'PRES_GLOBAL_BPS_BOOST',
            name: 'Influence Cosmique',
            description: 'Multiplie la production totale de BP/s par 3 après Prestige.',
            cost: 10,
            maxLevel: 1,
            tier: 3,
            prerequisites: ['PRES_ALL_SKILL_POINTS'],
            effect: (level, skillEffects) => {
                if (level === 1) {
                    skillEffects.allBpsMultiplier = skillEffects.allBpsMultiplier.times(3);
                }
            }
        },
    ]
};

// Définition des achats de prestige
export const prestigePurchasesData = [
    {
        id: 'licence',
        name: 'Licence',
        baseCost: new Decimal(1),
        costMultiplier: new Decimal(2),
        getEffectValue: (level) => new Decimal(0.01).times(level), // 1% de boost par Licence
        effect: (level, skillEffects) => {
            skillEffects.licenceProfMultiplier = skillEffects.licenceProfMultiplier.add(new Decimal(0.01).times(level));
        },
        prerequisites: (totalPAEarned, prestigeCount) => totalPAEarned.gte(new Decimal(1e3))
    },
    {
        id: 'master1',
        name: 'Master I',
        baseCost: new Decimal(5),
        costMultiplier: new Decimal(2.5),
        getEffectValue: (level) => new Decimal(0.02).times(level), // 2% de boost par Master I
        effect: (level, skillEffects) => {
            skillEffects.master1ClassProduction = skillEffects.master1ClassProduction.add(new Decimal(0.02).times(level));
        },
        prerequisites: (totalPAEarned, prestigeCount, nombreLicences) => nombreLicences >= 10
    },
    {
        id: 'master2',
        name: 'Master II',
        baseCost: new Decimal(25),
        costMultiplier: new Decimal(3),
        getEffectValue: (level) => new Decimal(0.05).times(level), // 5% de boost par Master II
        effect: (level, skillEffects) => {
            skillEffects.master2ClassProduction = skillEffects.master2ClassProduction.add(new Decimal(0.05).times(level));
        },
        prerequisites: (totalPAEarned, prestigeCount, nombreLicences, nombreMaster1) => nombreMaster1 >= 5
    },
    {
        id: 'doctorat',
        name: 'Doctorat',
        baseCost: new Decimal(100),
        costMultiplier: new Decimal(4),
        getEffectValue: (level) => new Decimal(0.10).times(level), // 10% de boost BP/s
        effect: (level, skillEffects) => {
            skillEffects.doctoratBPSBonus = skillEffects.doctoratBPSBonus.add(new Decimal(0.10).times(level));
            skillEffects.doctoratMinClasses = level; // Chaque Doctorat garantit 1 classe après ascension
        },
        getMinClasses: (level) => level, // Fonction spécifique pour le nombre de classes minimum
        prerequisites: (totalPAEarned, prestigeCount, nombreLicences, nombreMaster1, nombreMaster2) => nombreMaster2 >= 3
    },
    {
        id: 'postDoctorat',
        name: 'Post-Doctorat',
        baseCost: new Decimal(500),
        costMultiplier: new Decimal(5),
        getEffectValue: (level) => new Decimal(0.05).times(level), // 5% de boost de gain de PA
        effect: (level, skillEffects) => {
            skillEffects.postDoctoratPAGain = skillEffects.postDoctoratPAGain.add(new Decimal(0.05).times(level));
        },
        prerequisites: (totalPAEarned, prestigeCount, nombreLicences, nombreMaster1, nombreMaster2, nombreDoctorat) => nombreDoctorat >= 1
    }
];

// Définition des quêtes
export const questsData = [
    {
        id: 'Q_FIRST_CLICK',
        name: 'Premier Clic',
        description: 'Cliquez sur "Étudier sagement" pour la première fois.',
        category: 'Fondations',
        condition: (gameState) => gameState.totalClicks >= 1,
        reward: { type: 'bonsPoints', amount: new Decimal(10) },
        rewardText: '10 Bons Points',
        permanent: false
    },
    {
        id: 'Q_FIRST_ELEVE',
        name: 'Premier Élève',
        description: 'Achetez votre premier Élève.',
        category: 'Fondations',
        condition: (gameState) => gameState.nombreEleves.gte(1),
        reward: { type: 'bonsPoints', amount: new Decimal(50) },
        rewardText: '50 Bons Points',
        permanent: false
    },
    {
        id: 'Q_10_ELEVES',
        name: 'La Classe Déborde',
        description: 'Possédez 10 Élèves.',
        category: 'Fondations',
        condition: (gameState) => gameState.nombreEleves.gte(10),
        reward: { type: 'bonsPoints', amount: new Decimal(200) },
        rewardText: '200 Bons Points',
        permanent: false
    },
    {
        id: 'Q_FIRST_CLASS',
        name: 'Première Classe',
        description: 'Achetez votre première Classe.',
        category: 'Expansion Académique',
        condition: (gameState) => gameState.nombreClasses.gte(1),
        reward: { type: 'images', amount: new Decimal(1) },
        rewardText: '1 Image',
        permanent: false
    },
    {
        id: 'Q_10_CLASSES',
        name: 'Le Campus s\'agrandit',
        description: 'Possédez 10 Classes.',
        category: 'Expansion Académique',
        condition: (gameState) => gameState.nombreClasses.gte(10),
        reward: { type: 'images', amount: new Decimal(5) },
        rewardText: '5 Images',
        permanent: false
    },
    {
        id: 'Q_FIRST_IMAGE',
        name: 'Première Image',
        description: 'Achetez votre première Image.',
        category: 'Expansion Académique',
        condition: (gameState) => gameState.images.gte(1),
        reward: { type: 'bonsPoints', amount: new Decimal(1000) },
        rewardText: '1,000 Bons Points',
        permanent: false
    },
    {
        id: 'Q_FIRST_PROFESSOR',
        name: 'Premier Professeur',
        description: 'Achetez votre premier Professeur.',
        category: 'Excellence Pédagogique',
        condition: (gameState) => gameState.nombreProfesseur.gte(1),
        reward: { type: 'ascensionPoints', amount: new Decimal(1) },
        rewardText: '1 Point d\'Ascension',
        permanent: false
    },
    {
        id: 'Q_5_PROFESSORS',
        name: 'Conseil des Professeurs',
        description: 'Possédez 5 Professeurs.',
        category: 'Excellence Pédagogique',
        condition: (gameState) => gameState.nombreProfesseur.gte(5),
        reward: { type: 'ascensionPoints', amount: new Decimal(5) },
        rewardText: '5 Points d\'Ascension',
        permanent: false
    },
    {
        id: 'Q_FIRST_ASCENSION',
        name: 'Le Cycle Infini',
        description: 'Effectuez votre première Ascension.',
        category: 'Cycles de Progression',
        condition: (gameState) => gameState.ascensionCount >= 1,
        reward: { type: 'paMultiplier', amount: new Decimal(0.10) }, // +10% au multiplicateur de PA
        rewardText: 'Multiplicateur de gain de PA +10%',
        permanent: true // Cette quête est permanente
    },
    {
        id: 'Q_FIRST_PRESTIGE',
        name: 'Le Grand Reset',
        description: 'Effectuez votre premier Prestige.',
        category: 'Cycles de Progression',
        condition: (gameState) => gameState.prestigeCount >= 1,
        reward: { type: 'ppMultiplier', amount: new Decimal(0.10) }, // Exemple: +10% au multiplicateur de PP
        rewardText: 'Multiplicateur de gain de PP +10%',
        permanent: true // Cette quête est permanente
    },
    {
        id: 'Q_BPS_1K',
        name: 'Production Stable',
        description: 'Atteignez 1K Bons Points par Seconde (BP/s).',
        category: 'Performance',
        condition: (gameState) => gameState.totalBonsPointsParSeconde.gte(new Decimal(1e3)),
        reward: { type: 'bonsPoints', amount: new Decimal(1e4) },
        rewardText: '10,000 Bons Points',
        permanent: false
    },
    {
        id: 'Q_BPS_1M',
        name: 'Usine à Bons Points',
        description: 'Atteignez 1M Bons Points par Seconde (BP/s).',
        category: 'Performance',
        condition: (gameState) => gameState.totalBonsPointsParSeconde.gte(new Decimal(1e6)),
        reward: { type: 'images', amount: new Decimal(10) },
        rewardText: '10 Images',
        permanent: false
    },
    {
        id: 'Q_TOTAL_CLICKS_100',
        name: 'Dextérité Digitale',
        description: 'Accumulez 100 clics sur le bouton "Étudier sagement".',
        category: 'Interaction',
        condition: (gameState) => gameState.totalClicks >= 100,
        reward: { type: 'studiesSkillPoints', amount: 1 },
        rewardText: '1 Point de Compétence d\'Études',
        permanent: false
    },
    {
        id: 'Q_AUTOMATION_UNLOCKED',
        name: 'L\'Ère de l\'Automatisation',
        description: 'Débloquez la catégorie d\'automatisation.',
        category: 'Automatisation',
        condition: (gameState) => gameState.automationCategoryUnlocked,
        reward: { type: 'ascensionPoints', amount: new Decimal(2) },
        rewardText: '2 Points d\'Ascension',
        permanent: false
    },
    {
        id: 'Q_ALL_AUTOMATION_ACTIVE',
        name: 'Maître de l\'Automatisation',
        description: 'Activez toutes les automatisations (Élèves, Classes, Images, Professeurs).',
        category: 'Automatisation',
        condition: (gameState) => gameState.autoEleveActive && gameState.autoClasseActive && gameState.autoImageActive && gameState.autoProfesseurActive,
        reward: { type: 'paMultiplier', amount: new Decimal(0.20) }, // +20% au multiplicateur de PA
        rewardText: 'Multiplicateur de gain de PA +20%',
        permanent: true
    },
    {
        id: 'Q_STUDIES_SKILL_TREE',
        name: 'Arbre des Savoirs',
        description: 'Débloquez l\'arbre de compétences d\'Études.',
        category: 'Compétences',
        condition: (gameState) => gameState.studiesSkillsUnlocked,
        reward: { type: 'studiesSkillPoints', amount: 3 },
        rewardText: '3 Points de Compétence d\'Études',
        permanent: false
    },
    {
        id: 'Q_ASCENSION_SKILL_TREE',
        name: 'Arbre de l\'Évolution',
        description: 'Débloquez l\'arbre de compétences d\'Ascension.',
        category: 'Compétences',
        condition: (gameState) => gameState.ascensionSkillsUnlocked,
        reward: { type: 'ascensionSkillPoints', amount: 3 },
        rewardText: '3 Points de Compétence d\'Ascension',
        permanent: false
    },
    {
        id: 'Q_PRESTIGE_SKILL_TREE',
        name: 'Arbre de la Domination',
        description: 'Débloquez l\'arbre de compétences de Prestige.',
        category: 'Compétences',
        condition: (gameState) => gameState.prestigeSkillsUnlocked,
        reward: { type: 'prestigeSkillPoints', amount: 3 },
        rewardText: '3 Points de Compétence de Prestige',
        permanent: false
    },
    {
        id: 'Q_100_PA_EARNED',
        name: 'Collectionneur de PA',
        description: 'Gagnez un total de 100 Points d\'Ascension cumulés.',
        category: 'Progression Profonde',
        condition: (gameState) => gameState.totalPAEarned.gte(100),
        reward: { type: 'prestigePoints', amount: new Decimal(1) },
        rewardText: '1 Point de Prestige',
        permanent: true
    },
    {
        id: 'Q_10_ASCENSIONS',
        name: 'Maître des Cycles',
        description: 'Effectuez 10 Ascensions.',
        category: 'Progression Profonde',
        condition: (gameState) => gameState.ascensionCount >= 10,
        reward: { type: 'paMultiplier', amount: new Decimal(0.50) },
        rewardText: 'Multiplicateur de gain de PA +50%',
        permanent: true
    },
    {
        id: 'Q_ALL_STUDIES_SKILLS',
        name: 'Savoir Complet',
        description: 'Débloquez toutes les compétences d\'Études.',
        category: 'Accomplissements Majeurs',
        condition: (gameState) => {
            const totalStudiesSkills = Object.keys(skillsData.studies).length;
            let unlockedStudiesSkills = 0;
            for (const skillId in gameState.studiesSkillLevels) {
                if (gameState.studiesSkillLevels[skillId] === skillsData.studies.find(s => s.id === skillId).maxLevel) {
                    unlockedStudiesSkills++;
                }
            }
            return unlockedStudiesSkills === totalStudiesSkills;
        },
        reward: { type: 'allCostReduction', amount: new Decimal(0.05) }, // Réduction de 5% de tous les coûts
        rewardText: 'Réduction de 5% de tous les coûts',
        permanent: true
    },
    {
        id: 'Q_ALL_QUESTS_COMPLETED',
        name: 'Quête Ultime',
        description: 'Complétez toutes les quêtes non permanentes.',
        category: 'Accomplissements Majeurs',
        condition: (gameState) => {
            const nonPermanentQuests = questsData.filter(q => !q.permanent);
            return nonPermanentQuests.every(q => gameState.completedQuests[q.id] && gameState.completedQuests[q.id].completed);
        },
        reward: { type: 'allBpsMultiplier', amount: new Decimal(1.10) }, // +10% à la production totale de BP/s
        rewardText: 'Multiplicateur de BP/s total +10%',
        permanent: true
    },
];

// Définition des succès
export const achievementsData = [
    // Bons Points Achievements
    {
        id: 'ACH_BP_1',
        name: 'Le Premier Pas',
        description: 'Atteindre 1 Bon Point.',
        condition: (gameState) => gameState.bonsPoints.gte(1),
        rewardText: '+0.1% BP/s',
        rewardFn: (skillEffects, permanentBpsBonusFromAchievements) => { permanentBpsBonusFromAchievements = permanentBpsBonusFromAchievements.add(0.001); return permanentBpsBonusFromAchievements; }
    },
    {
        id: 'ACH_BP_1K',
        name: 'Mille Points',
        description: 'Atteindre 1 000 Bons Points.',
        condition: (gameState) => gameState.bonsPoints.gte('1e3'),
        rewardText: '+1% BP/s',
        rewardFn: (skillEffects, permanentBpsBonusFromAchievements) => { permanentBpsBonusFromAchievements = permanentBpsBonusFromAchievements.add(0.01); return permanentBpsBonusFromAchievements; }
    },
    {
        id: 'ACH_BP_10K',
        name: 'Dix Mille Points',
        description: 'Atteindre 10 000 Bons Points.',
        condition: (gameState) => gameState.bonsPoints.gte('1e4'),
        rewardText: '+1.5% BP/s',
        rewardFn: (skillEffects, permanentBpsBonusFromAchievements) => { permanentBpsBonusFromAchievements = permanentBpsBonusFromAchievements.add(0.015); return permanentBpsBonusFromAchievements; }
    },
    {
        id: 'ACH_BP_1M',
        name: 'Millionnaire en BP',
        description: 'Atteindre 1 Million de Bons Points.',
        condition: (gameState) => gameState.bonsPoints.gte('1e6'),
        rewardText: '+2% BP/s',
        rewardFn: (skillEffects, permanentBpsBonusFromAchievements) => { permanentBpsBonusFromAchievements = permanentBpsBonusFromAchievements.add(0.02); return permanentBpsBonusFromAchievements; }
    },
    {
        id: 'ACH_BP_1B',
        name: 'Milliardaire en BP',
        description: 'Atteindre 1 Milliard de Bons Points.',
        condition: (gameState) => gameState.bonsPoints.gte('1e9'),
        rewardText: '+3% BP/s',
        rewardFn: (skillEffects, permanentBpsBonusFromAchievements) => { permanentBpsBonusFromAchievements = permanentBpsBonusFromAchievements.add(0.03); return permanentBpsBonusFromAchievements; }
    },
    {
        id: 'ACH_BP_1T',
        name: 'Trillionnaire en BP',
        description: 'Atteindre 1 Trillion de Bons Points.',
        condition: (gameState) => gameState.bonsPoints.gte('1e12'),
        rewardText: '+5% BP/s',
        rewardFn: (skillEffects, permanentBpsBonusFromAchievements) => { permanentBpsBonusFromAchievements = permanentBpsBonusFromAchievements.add(0.05); return permanentBpsBonusFromAchievements; }
    },
    {
        id: 'ACH_BP_1Qa',
        name: 'Quadrillionnaire en BP',
        description: 'Atteindre 1 Quadrillion de Bons Points.',
        condition: (gameState) => gameState.bonsPoints.gte('1e15'),
        rewardText: '+10% BP/s',
        rewardFn: (skillEffects, permanentBpsBonusFromAchievements) => { permanentBpsBonusFromAchievements = permanentBpsBonusFromAchievements.add(0.10); return permanentBpsBonusFromAchievements; }
    },
    {
        id: 'ACH_BP_1Sx',
        name: 'Sextillionnaire en BP',
        description: 'Atteindre 1 Sextillion de Bons Points.',
        condition: (gameState) => gameState.bonsPoints.gte('1e21'),
        rewardText: '+20% BP/s',
        rewardFn: (skillEffects, permanentBpsBonusFromAchievements) => { permanentBpsBonusFromAchievements = permanentBpsBonusFromAchievements.add(0.20); return permanentBpsBonusFromAchievements; }
    },
    {
        id: 'ACH_BP_1Oc',
        name: 'Octillionnaire en BP',
        description: 'Atteindre 1 Octillion de Bons Points.',
        condition: (gameState) => gameState.bonsPoints.gte('1e50'),
        rewardText: '+50% BP/s',
        rewardFn: (skillEffects, permanentBpsBonusFromAchievements) => { permanentBpsBonusFromAchievements = permanentBpsBonusFromAchievements.add(0.50); return permanentBpsBonusFromAchievements; }
    },
    {
        id: 'ACH_BP_1Googol',
        name: 'Googol de BP',
        description: 'Atteindre 1e100 Bons Points.',
        condition: (gameState) => gameState.bonsPoints.gte('1e100'),
        rewardText: '+100% BP/s',
        rewardFn: (skillEffects, permanentBpsBonusFromAchievements) => { permanentBpsBonusFromAchievements = permanentBpsBonusFromAchievements.add(1); return permanentBpsBonusFromAchievements; }
    },
    {
        id: 'ACH_BP_1Googolplex',
        name: 'Googolplex de BP',
        description: 'Atteindre 1e10000 Bons Points.',
        condition: (gameState) => gameState.bonsPoints.gte('1e10000'),
        rewardText: '+200% BP/s',
        rewardFn: (skillEffects, permanentBpsBonusFromAchievements) => { permanentBpsBonusFromAchievements = permanentBpsBonusFromAchievements.add(2); return permanentBpsBonusFromAchievements; }
    },

    // Eleves Achievements
    {
        id: 'ACH_ELEVES_1',
        name: 'L\'Apprenti',
        description: 'Avoir 1 Élève.',
        condition: (gameState) => gameState.nombreEleves.gte(1),
        rewardText: 'Coût des élèves -0.1%',
        rewardFn: (skillEffects) => { skillEffects.eleveCostReduction = skillEffects.eleveCostReduction.add(0.001); }
    },
    {
        id: 'ACH_ELEVES_10',
        name: 'La Classe',
        description: 'Avoir 10 Élèves.',
        condition: (gameState) => gameState.nombreEleves.gte(10),
        rewardText: 'Coût des élèves -0.5%',
        rewardFn: (skillEffects) => { skillEffects.eleveCostReduction = skillEffects.eleveCostReduction.add(0.005); }
    },
    {
        id: 'ACH_ELEVES_100',
        name: 'Centurie d\'Élèves',
        description: 'Avoir 100 Élèves.',
        condition: (gameState) => gameState.nombreEleves.gte(100),
        rewardText: 'Coût des élèves -1%',
        rewardFn: (skillEffects) => { skillEffects.eleveCostReduction = skillEffects.eleveCostReduction.add(0.01); }
    },
    {
        id: 'ACH_ELEVES_1K',
        name: 'Mille Élèves',
        description: 'Avoir 1 000 Élèves.',
        condition: (gameState) => gameState.nombreEleves.gte(1000),
        rewardText: 'Coût des élèves -2%',
        rewardFn: (skillEffects) => { skillEffects.eleveCostReduction = skillEffects.eleveCostReduction.add(0.02); }
    },
    {
        id: 'ACH_ELEVES_10K',
        name: 'Dix Mille Élèves',
        description: 'Avoir 10 000 Élèves.',
        condition: (gameState) => gameState.nombreEleves.gte('1e4'),
        rewardText: 'Coût des élèves -3%',
        rewardFn: (skillEffects) => { skillEffects.eleveCostReduction = skillEffects.eleveCostReduction.add(0.03); }
    },
    {
        id: 'ACH_ELEVES_1M',
        name: 'Million d\'Élèves',
        description: 'Avoir 1 Million d\'Élèves.',
        condition: (gameState) => gameState.nombreEleves.gte('1e6'),
        rewardText: 'Coût des élèves -5%',
        rewardFn: (skillEffects) => { skillEffects.eleveCostReduction = skillEffects.eleveCostReduction.add(0.05); }
    },
    {
        id: 'ACH_ELEVES_1T',
        name: 'Trillion d\'Élèves',
        description: 'Avoir 1 Trillion d\'Élèves.',
        condition: (gameState) => gameState.nombreEleves.gte('1e12'),
        rewardText: 'Coût des élèves -10%',
        rewardFn: (skillEffects) => { skillEffects.eleveCostReduction = skillEffects.eleveCostReduction.add(0.10); }
    },

    // Images Achievements
    {
        id: 'ACH_IMAGES_1',
        name: 'Première Image',
        description: 'Posséder 1 Image.',
        condition: (gameState) => gameState.images.gte(1),
        rewardText: 'Coût des images -0.1%',
        rewardFn: (skillEffects) => { skillEffects.imageCostReduction = skillEffects.imageCostReduction.add(0.001); }
    },
    {
        id: 'ACH_IMAGES_10',
        name: 'Collectionneur d\'Images',
        description: 'Posséder 10 Images.',
        condition: (gameState) => gameState.images.gte(10),
        rewardText: 'Coût des images -1%',
        rewardFn: (skillEffects) => { skillEffects.imageCostReduction = skillEffects.imageCostReduction.add(0.01); }
    },
    {
        id: 'ACH_IMAGES_100',
        name: 'Album Photo',
        description: 'Posséder 100 Images.',
        condition: (gameState) => gameState.images.gte(100),
        rewardText: 'Coût des images -1.5%',
        rewardFn: (skillEffects) => { skillEffects.imageCostReduction = skillEffects.imageCostReduction.add(0.015); }
    },
    {
        id: 'ACH_IMAGES_1K',
        name: 'Galerie d\'Images',
        description: 'Posséder 1 000 Images.',
        condition: (gameState) => gameState.images.gte(1000),
        rewardText: 'Coût des images -2%',
        rewardFn: (skillEffects) => { skillEffects.imageCostReduction = skillEffects.imageCostReduction.add(0.02); }
    },
    {
        id: 'ACH_IMAGES_1M',
        name: 'Musée d\'Images',
        description: 'Posséder 1 Million d\'Images.',
        condition: (gameState) => gameState.images.gte('1e6'),
        rewardText: 'Coût des images -5%',
        rewardFn: (skillEffects) => { skillEffects.imageCostReduction = skillEffects.imageCostReduction.add(0.05); }
    },

    // Classes Achievements
    {
        id: 'ACH_CLASSES_1',
        name: 'Première Salle',
        description: 'Avoir 1 Salle de classe.',
        condition: (gameState) => gameState.nombreClasses.gte(1),
        rewardText: 'Coût des classes -0.1%',
        rewardFn: (skillEffects) => { skillEffects.classeCostReduction = skillEffects.classeCostReduction.add(0.001); }
    },
    {
        id: 'ACH_CLASSES_5',
        name: 'Petite École',
        description: 'Avoir 5 Salles de classe.',
        condition: (gameState) => gameState.nombreClasses.gte(5),
        rewardText: 'Coût des classes -0.5%',
        rewardFn: (skillEffects) => { skillEffects.classeCostReduction = skillEffects.classeCostReduction.add(0.005); }
    },
    {
        id: 'ACH_CLASSES_10',
        name: 'Petit Campus',
        description: 'Avoir 10 Salles de classe.',
        condition: (gameState) => gameState.nombreClasses.gte(10),
        rewardText: 'Coût des classes -1%',
        rewardFn: (skillEffects) => { skillEffects.classeCostReduction = skillEffects.classeCostReduction.add(0.01); }
    },
    {
        id: 'ACH_CLASSES_100',
        name: 'Grand Campus',
        description: 'Avoir 100 Salles de classe.',
        condition: (gameState) => gameState.nombreClasses.gte(100),
        rewardText: 'Coût des classes -2%',
        rewardFn: (skillEffects) => { skillEffects.classeCostReduction = skillEffects.classeCostReduction.add(0.02); }
    },
    {
        id: 'ACH_CLASSES_1K',
        name: 'Université',
        description: 'Avoir 1 000 Salles de classe.',
        condition: (gameState) => gameState.nombreClasses.gte(1000),
        rewardText: 'Coût des classes -5%',
        rewardFn: (skillEffects) => { skillEffects.classeCostReduction = skillEffects.classeCostReduction.add(0.05); }
    },

    // Professeur Achievements
    {
        id: 'ACH_PROFS_1',
        name: 'Premier Professeur',
        description: 'Avoir 1 Professeur.',
        condition: (gameState) => gameState.nombreProfesseur.gte(1),
        rewardText: 'Coût des Professeurs -0.1%',
        rewardFn: (skillEffects) => { skillEffects.ProfesseurCostReduction = skillEffects.ProfesseurCostReduction.add(0.001); }
    },
    {
        id: 'ACH_PROFS_5',
        name: 'Conseil Pédagogique',
        description: 'Avoir 5 Professeurs.',
        condition: (gameState) => gameState.nombreProfesseur.gte(5),
        rewardText: 'Coût des Professeurs -1%',
        rewardFn: (skillEffects) => { skillEffects.ProfesseurCostReduction = skillEffects.ProfesseurCostReduction.add(0.01); }
    },
    {
        id: 'ACH_PROFS_10',
        name: 'Corps Enseignant',
        description: 'Avoir 10 Professeurs.',
        condition: (gameState) => gameState.nombreProfesseur.gte(10),
        rewardText: 'Coût des Professeurs -2%',
        rewardFn: (skillEffects) => { skillEffects.ProfesseurCostReduction = skillEffects.ProfesseurCostReduction.add(0.02); }
    },
    {
        id: 'ACH_PROFS_20',
        name: 'Académie',
        description: 'Avoir 20 Professeurs.',
        condition: (gameState) => gameState.nombreProfesseur.gte(20),
        rewardText: 'Coût des Professeurs -5%',
        rewardFn: (skillEffects) => { skillEffects.ProfesseurCostReduction = skillEffects.ProfesseurCostReduction.add(0.05); }
    },
    {
        id: 'ACH_PROFS_50',
        name: 'Doyen de l\'Université',
        description: 'Avoir 50 Professeurs.',
        condition: (gameState) => gameState.nombreProfesseur.gte(50),
        rewardText: '+10% BP/s des Professeurs',
        rewardFn: (skillEffects) => { skillEffects.ProfesseurBpsMultiplier = skillEffects.ProfesseurBpsMultiplier.times(1.1); }
    },

    // Ecole Achievements
    {
        id: 'ACH_ECOLE_1',
        name: 'Première École',
        description: 'Acheter 1 École.',
        condition: (gameState) => gameState.schoolCount.gte(1),
        rewardText: '+0.1% PA/s',
        rewardFn: (skillEffects, permanentBpsBonusFromAchievements) => { permanentBpsBonusFromAchievements = permanentBpsBonusFromAchievements.add(0.001); return permanentBpsBonusFromAchievements; }
    },
    {
        id: 'ACH_ECOLE_3',
        name: 'Groupe Scolaire',
        description: 'Acheter 3 Écoles.',
        condition: (gameState) => gameState.schoolCount.gte(3),
        rewardText: '+0.5% PA/s',
        rewardFn: (skillEffects, permanentBpsBonusFromAchievements) => { permanentBpsBonusFromAchievements = permanentBpsBonusFromAchievements.add(0.005); return permanentBpsBonusFromAchievements; }
    },
    {
        id: 'ACH_ECOLE_5',
        name: 'Réseau Scolaire',
        description: 'Acheter 5 Écoles.',
        condition: (gameState) => gameState.schoolCount.gte(5),
        rewardText: '+1% PA/s',
        rewardFn: (skillEffects, permanentBpsBonusFromAchievements) => { permanentBpsBonusFromAchievements = permanentBpsBonusFromAchievements.add(0.01); return permanentBpsBonusFromAchievements; }
    },
    {
        id: 'ACH_ECOLE_10',
        name: 'District Éducatif',
        description: 'Acheter 10 Écoles.',
        condition: (gameState) => gameState.schoolCount.gte(10),
        rewardText: '+2% PA/s',
        rewardFn: (skillEffects, permanentBpsBonusFromAchievements) => { permanentBpsBonusFromAchievements = permanentBpsBonusFromAchievements.add(0.02); return permanentBpsBonusFromAchievements; }
    },

    // Lycee Achievements
    {
        id: 'ACH_LYCEE_1',
        name: 'Premier Lycée',
        description: 'Acheter 1 Lycée.',
        condition: (gameState) => gameState.nombreLycees.gte(1),
        rewardText: '+0.1% PA/s',
        rewardFn: (skillEffects, permanentBpsBonusFromAchievements) => { permanentBpsBonusFromAchievements = permanentBpsBonusFromAchievements.add(0.001); return permanentBpsBonusFromAchievements; }
    },
    {
        id: 'ACH_LYCEE_3',
        name: 'Chaîne de Lycées',
        description: 'Acheter 3 Lycées.',
        condition: (gameState) => gameState.nombreLycees.gte(3),
        rewardText: '+1% PA/s',
        rewardFn: (skillEffects, permanentBpsBonusFromAchievements) => { permanentBpsBonusFromAchievements = permanentBpsBonusFromAchievements.add(0.01); return permanentBpsBonusFromAchievements; }
    },
    {
        id: 'ACH_LYCEE_5',
        name: 'Réseau Lycéen',
        description: 'Acheter 5 Lycées.',
        condition: (gameState) => gameState.nombreLycees.gte(5),
        rewardText: '+1.5% PA/s',
        rewardFn: (skillEffects, permanentBpsBonusFromAchievements) => { permanentBpsBonusFromAchievements = permanentBpsBonusFromAchievements.add(0.015); return permanentBpsBonusFromAchievements; }
    },

    // College Achievements
    {
        id: 'ACH_COLLEGE_1',
        name: 'Premier Collège',
        description: 'Acheter 1 Collège.',
        condition: (gameState) => gameState.nombreColleges.gte(1),
        rewardText: '+0.5% PA/s',
        rewardFn: (skillEffects, permanentBpsBonusFromAchievements) => { permanentBpsBonusFromAchievements = permanentBpsBonusFromAchievements.add(0.005); return permanentBpsBonusFromAchievements; }
    },
    {
        id: 'ACH_COLLEGE_2',
        name: 'Réseau de Collèges',
        description: 'Acheter 2 Collèges.',
        condition: (gameState) => gameState.nombreColleges.gte(2),
        rewardText: '+1% PA/s',
        rewardFn: (skillEffects, permanentBpsBonusFromAchievements) => { permanentBpsBonusFromAchievements = permanentBpsBonusFromAchievements.add(0.01); return permanentBpsBonusFromAchievements; }
    },
    {
        id: 'ACH_COLLEGE_3',
        name: 'Grand Collège',
        description: 'Acheter 3 Collèges.',
        condition: (gameState) => gameState.nombreColleges.gte(3),
        rewardText: '+1.5% PA/s',
        rewardFn: (skillEffects, permanentBpsBonusFromAchievements) => { permanentBpsBonusFromAchievements = permanentBpsBonusFromAchievements.add(0.015); return permanentBpsBonusFromAchievements; }
    },

    // Ascension Achievements (Additive)
    {
        id: 'ACH_ASCEND_1',
        name: 'Première Ascension',
        description: 'Effectuer votre première Ascension.',
        condition: (gameState) => gameState.ascensionCount.gte(1),
        rewardText: '+5 PA uniques',
        rewardFn: (gameState) => { return gameState.ascensionPoints.add(5); }
    },
    {
        id: 'ACH_ASCEND_2',
        name: 'Deuxième Ascension',
        description: 'Effectuer 2 Ascensions.',
        condition: (gameState) => gameState.ascensionCount.gte(2),
        rewardText: '+10 PA uniques',
        rewardFn: (gameState) => { return gameState.ascensionPoints.add(10); }
    },
    {
        id: 'ACH_ASCEND_5',
        name: 'Ascension Maître',
        description: 'Effectuer 5 Ascensions.',
        condition: (gameState) => gameState.ascensionCount.gte(5),
        rewardText: '+25 PA uniques',
        rewardFn: (gameState) => { return gameState.ascensionPoints.add(25); }
    },
    {
        id: 'ACH_ASCEND_10',
        name: 'Ascension Légende',
        description: 'Effectuer 10 Ascensions.',
        condition: (gameState) => gameState.ascensionCount.gte(10),
        rewardText: '+50 PA uniques',
        rewardFn: (gameState) => { return gameState.ascensionPoints.add(50); }
    },
    {
        id: 'ACH_ASCEND_25',
        name: 'Ascension Divine',
        description: 'Effectuer 25 Ascensions.',
        condition: (gameState) => gameState.ascensionCount.gte(25),
        rewardText: '+100 PA uniques',
        rewardFn: (gameState) => { return gameState.ascensionPoints.add(100); }
    },
    {
        id: 'ACH_ASCEND_50',
        name: 'Ascension Ultime',
        description: 'Effectuer 50 Ascensions.',
        condition: (gameState) => gameState.ascensionCount.gte(50),
        rewardText: '+250 PA uniques',
        rewardFn: (gameState) => { return gameState.ascensionPoints.add(250); }
    },
    {
        id: 'ACH_TOTAL_PA_100',
        name: 'Cent Points d\'Ascension',
        description: 'Accumuler un total de 100 Points d\'Ascension.',
        condition: (gameState) => gameState.totalPAEarned.gte(100),
        rewardText: '+1% gain de PA permanent',
        rewardFn: (skillEffects) => { skillEffects.paGainMultiplier = skillEffects.paGainMultiplier.times(1.01); }
    },
    {
        id: 'ACH_TOTAL_PA_1000',
        name: 'Mille Points d\'Ascension',
        description: 'Accumuler un total de 1 000 Points d\'Ascension.',
        condition: (gameState) => gameState.totalPAEarned.gte(1000),
        rewardText: '+2% gain de PA permanent',
        rewardFn: (skillEffects) => { skillEffects.paGainMultiplier = skillEffects.paGainMultiplier.times(1.02); }
    },

    // Automation Achievements
    {
        id: 'ACH_AUTO_ELEVE',
        name: 'Auto-Élève',
        description: 'Débloquer l\'automatisation des Élèves.',
        condition: (gameState) => gameState.autoEleveActive,
        rewardText: 'Coût des élèves -0.5%',
        rewardFn: (skillEffects) => { skillEffects.eleveCostReduction = skillEffects.eleveCostReduction.add(0.005); }
    },
    {
        id: 'ACH_AUTO_CLASSE',
        name: 'Auto-Classe',
        description: 'Débloquer l\'automatisation des Classes.',
        condition: (gameState) => gameState.autoClasseActive,
        rewardText: 'Coût des classes -0.5%',
        rewardFn: (skillEffects) => { skillEffects.classeCostReduction = skillEffects.classeCostReduction.add(0.005); }
    },
    {
        id: 'ACH_AUTO_IMAGE',
        name: 'Auto-Image',
        description: 'Débloquer l\'automatisation des Images.',
        condition: (gameState) => gameState.autoImageActive,
        rewardText: 'Coût des images -0.5%',
        rewardFn: (skillEffects) => { skillEffects.imageCostReduction = skillEffects.imageCostReduction.add(0.005); }
    },
    {
        id: 'ACH_AUTO_PROF',
        name: 'Auto-Professeur',
        description: 'Débloquer l\'automatisation des Professeurs.',
        condition: (gameState) => gameState.autoProfesseurActive,
        rewardText: 'Coût des Professeurs -0.5%',
        rewardFn: (skillEffects) => { skillEffects.ProfesseurCostReduction = skillEffects.ProfesseurCostReduction.add(0.005); }
    },
    {
        id: 'ACH_AUTO_ALL_ACTIVE',
        name: 'Maître de l\'Automatisation',
        description: 'Avoir toutes les automatisations actives simultanément.',
        condition: (gameState) => gameState.autoEleveActive && gameState.autoClasseActive && gameState.autoImageActive && gameState.autoProfesseurActive,
        rewardText: '+5% production globale',
        rewardFn: (skillEffects) => { skillEffects.allBpsMultiplier = skillEffects.allBpsMultiplier.times(1.05); }
    },

    // Click Achievements (Additive)
    {
        id: 'ACH_CLICK_1',
        name: 'Premier Clic',
        description: 'Cliquez 1 fois sur "Étudier sagement".',
        condition: (gameState) => gameState.totalClicks.gte(1),
        rewardText: '+0.1 BP par clic',
        rewardFn: (skillEffects) => { skillEffects.clickBonsPointsBonus = skillEffects.clickBonsPointsBonus.add(0.1); }
    },
    {
        id: 'ACH_CLICK_10',
        name: 'Dix Clics',
        description: 'Cliquez 10 fois sur "Étudier sagement".',
        condition: (gameState) => gameState.totalClicks.gte(10),
        rewardText: '+0.5 BP par clic',
        rewardFn: (skillEffects) => { skillEffects.clickBonsPointsBonus = skillEffects.clickBonsPointsBonus.add(0.5); }
    },
    {
        id: 'ACH_CLICK_100',
        name: 'Cent Clics',
        description: 'Cliquez 100 fois sur "Étudier sagement".',
        condition: (gameState) => gameState.totalClicks.gte(100),
        rewardText: '+1 BP par clic',
        rewardFn: (skillEffects) => { skillEffects.clickBonsPointsBonus = skillEffects.clickBonsPointsBonus.add(1); }
    },
    {
        id: 'ACH_CLICK_200',
        name: 'Deux Cents Clics',
        description: 'Cliquez 200 fois sur "Étudier sagement".',
        condition: (gameState) => gameState.totalClicks.gte(200),
        rewardText: '+2 BP par clic',
        rewardFn: (skillEffects) => { skillEffects.clickBonsPointsBonus = skillEffects.clickBonsPointsBonus.add(2); }
    },
    {
        id: 'ACH_CLICK_500',
        name: 'Cinq Cents Clics',
        description: 'Cliquez 500 fois sur "Étudier sagement".',
        condition: (gameState) => gameState.totalClicks.gte(500),
        rewardText: '+5 BP par clic',
        rewardFn: (skillEffects) => { skillEffects.clickBonsPointsBonus = skillEffects.clickBonsPointsBonus.add(5); }
    },
    {
        id: 'ACH_CLICK_1K',
        name: 'Mille Clics',
        description: 'Cliquez 1 000 fois sur "Étudier sagement".',
        condition: (gameState) => gameState.totalClicks.gte(1000),
        rewardText: '+10 BP par clic',
        rewardFn: (skillEffects) => { skillEffects.clickBonsPointsBonus = skillEffects.clickBonsPointsBonus.add(10); }
    },
    {
        id: 'ACH_CLICK_10K',
        name: 'Dix Mille Clics',
        description: 'Cliquez 10 000 fois sur "Étudier sagement".',
        condition: (gameState) => gameState.totalClicks.gte(10000),
        rewardText: '+20 BP par clic',
        rewardFn: (skillEffects) => { skillEffects.clickBonsPointsBonus = skillEffects.clickBonsPointsBonus.add(20); }
    },

    // Prestige Purchase Achievements (NEW)
    {
        id: 'ACH_LICENCE_1',
        name: 'Licencié',
        description: 'Acheter 1 Licence.',
        condition: (gameState) => gameState.nombreLicences.gte(1),
        rewardText: '+0.1% Prof Multiplier',
        rewardFn: (skillEffects) => { skillEffects.licenceProfMultiplier = skillEffects.licenceProfMultiplier.add(0.001); }
    },
    {
        id: 'ACH_LICENCE_5',
        name: 'Multi-Licencié',
        description: 'Acheter 5 Licences.',
        condition: (gameState) => gameState.nombreLicences.gte(5),
        rewardText: '+0.5% Prof Multiplier',
        rewardFn: (skillEffects) => { skillEffects.licenceProfMultiplier = skillEffects.licenceProfMultiplier.add(0.005); }
    },
    {
        id: 'ACH_MASTER1_1',
        name: 'Maître I',
        description: 'Acheter 1 Master I.',
        condition: (gameState) => gameState.nombreMaster1.gte(1),
        rewardText: '+0.1% Classe Production',
        rewardFn: (skillEffects) => { skillEffects.master1ClassProduction = skillEffects.master1ClassProduction.add(0.001); }
    },
    {
        id: 'ACH_MASTER1_3',
        name: 'Expert Master I',
        description: 'Acheter 3 Master I.',
        condition: (gameState) => gameState.nombreMaster1.gte(3),
        rewardText: '+0.3% Classe Production',
        rewardFn: (skillEffects) => { skillEffects.master1ClassProduction = skillEffects.master1ClassProduction.add(0.003); }
    },
    {
        id: 'ACH_MASTER2_1',
        name: 'Maître II',
        description: 'Acheter 1 Master II.',
        condition: (gameState) => gameState.nombreMaster2.gte(1),
        rewardText: '+0.1% Classe Production',
        rewardFn: (skillEffects) => { skillEffects.master2ClassProduction = skillEffects.master2ClassProduction.add(0.001); }
    },
    {
        id: 'ACH_MASTER2_3',
        name: 'Expert Master II',
        description: 'Acheter 3 Master II.',
        condition: (gameState) => gameState.nombreMaster2.gte(3),
        rewardText: '+0.3% Classe Production',
        rewardFn: (skillEffects) => { skillEffects.master2ClassProduction = skillEffects.master2ClassProduction.add(0.003); }
    },
    {
        id: 'ACH_DOCTORAT_1',
        name: 'Docteur',
        description: 'Acheter 1 Doctorat.',
        condition: (gameState) => gameState.nombreDoctorat.gte(1),
        rewardText: '+0.1% BP/s',
        rewardFn: (skillEffects) => { skillEffects.doctoratBPSBonus = skillEffects.doctoratBPSBonus.add(0.001); }
    },
    {
        id: 'ACH_DOCTORAT_2',
        name: 'Super Docteur',
        description: 'Acheter 2 Doctorats.',
        condition: (gameState) => gameState.nombreDoctorat.gte(2),
        rewardText: '+0.2% BP/s',
        rewardFn: (skillEffects) => { skillEffects.doctoratBPSBonus = skillEffects.doctoratBPSBonus.add(0.002); }
    },
    {
        id: 'ACH_POSTDOCTORAT_1',
        name: 'Post-Docteur',
        description: 'Acheter 1 Post-Doctorat.',
        condition: (gameState) => gameState.nombrePostDoctorat.gte(1),
        rewardText: '+0.1% PA Gain',
        rewardFn: (skillEffects) => { skillEffects.postDoctoratPAGain = skillEffects.postDoctoratPAGain.add(0.001); }
    },
    {
        id: 'ACH_POSTDOCTORAT_2',
        name: 'Chercheur Émérite',
        description: 'Acheter 2 Post-Doctorats.',
        condition: (gameState) => gameState.nombrePostDoctorat.gte(2),
        rewardText: '+0.2% PA Gain',
        rewardFn: (skillEffects) => { skillEffects.postDoctoratPAGain = skillEffects.postDoctoratPAGain.add(0.002); }
    },

    // Total Production Achievements (NEW)
    {
        id: 'ACH_BPS_1K',
        name: 'Producteur Efficace',
        description: 'Atteindre 1 000 BP/s.',
        condition: (gameState) => gameState.totalBonsPointsParSeconde.gte('1e3'),
        rewardText: '+1% production globale',
        rewardFn: (skillEffects) => { skillEffects.allBpsMultiplier = skillEffects.allBpsMultiplier.times(1.01); }
    },
    {
        id: 'ACH_BPS_1M',
        name: 'Usine à Bons Points',
        description: 'Atteindre 1 Million BP/s.',
        condition: (gameState) => gameState.totalBonsPointsParSeconde.gte('1e6'),
        rewardText: '+2% production globale',
        rewardFn: (skillEffects) => { skillEffects.allBpsMultiplier = skillEffects.allBpsMultiplier.times(1.02); }
    },
    {
        id: 'ACH_BPS_1B',
        name: 'Économie Galactique',
        description: 'Atteindre 1 Milliard BP/s.',
        condition: (gameState) => gameState.totalBonsPointsParSeconde.gte('1e9'),
        rewardText: '+3% production globale',
        rewardFn: (skillEffects) => { skillEffects.allBpsMultiplier = skillEffects.allBpsMultiplier.times(1.03); }
    },

    // Quests Achievements (NEW)
    {
        id: 'ACH_QUESTS_1',
        name: 'Premier Aventurier',
        description: 'Terminer 1 quête.',
        condition: (gameState) => Object.keys(gameState.completedQuests).length >= 1,
        rewardText: '+1 point de compétence d\'études',
        rewardFn: (gameState) => { return gameState.studiesSkillPoints.add(1); }
    },
    {
        id: 'ACH_QUESTS_5',
        name: 'Chasseur de Quêtes',
        description: 'Terminer 5 quêtes.',
        condition: (gameState) => Object.keys(gameState.completedQuests).length >= 5,
        rewardText: '+1 point de compétence d\'ascension',
        rewardFn: (gameState) => { return gameState.ascensionSkillPoints.add(1); }
    },
    {
        id: 'ACH_QUESTS_ALL',
        name: 'Maître des Quêtes',
        description: 'Terminer toutes les quêtes disponibles.',
        condition: (gameState, questsData) => Object.keys(gameState.completedQuests).length === questsData.length,
        rewardText: '+1 point de compétence de prestige',
        rewardFn: (gameState) => { return gameState.prestigeSkillPoints.add(1); }
    },

    // Skill Achievements (NEW)
    {
        id: 'ACH_SKILL_STUDIES_10',
        name: 'Étudiant Assidu',
        description: 'Dépenser 10 points de compétence d\'études.',
        condition: (gameState) => Object.values(gameState.studiesSkillLevels).reduce((sum, level) => sum + level, 0) >= 10,
        rewardText: '+0.5% BP/s',
        rewardFn: (skillEffects, permanentBpsBonusFromAchievements) => { permanentBpsBonusFromAchievements = permanentBpsBonusFromAchievements.add(0.005); return permanentBpsBonusFromAchievements; }
    },
    {
        id: 'ACH_SKILL_ASCENSION_5',
        name: 'Visionnaire',
        description: 'Dépenser 5 points de compétence d\'ascension.',
        condition: (gameState) => Object.values(gameState.ascensionSkillLevels).reduce((sum, level) => sum + level, 0) >= 5,
        rewardText: '+1% gain de PA',
        rewardFn: (skillEffects) => { skillEffects.paGainMultiplier = skillEffects.paGainMultiplier.times(1.01); }
    },
    {
        id: 'ACH_SKILL_PRESTIGE_3',
        name: 'Légende du Prestige',
        description: 'Dépenser 3 points de compétence de prestige.',
        condition: (gameState) => Object.values(gameState.prestigeSkillLevels).reduce((sum, level) => sum + level, 0) >= 3,
        rewardText: '+1% BP/s permanent',
        rewardFn: (skillEffects, permanentBpsBonusFromAchievements) => { permanentBpsBonusFromAchievements = permanentBpsBonusFromAchievements.add(0.01); return permanentBpsBonusFromAchievements; }
    },
];

// Définition des seuils de Bons Points pour gagner des Points de Compétence d'Études
export const bonusPointThresholds = [
    new Decimal(100), new Decimal(1000), new Decimal(10000), new Decimal(1e5), new Decimal(1e6),
    new Decimal(1e7), new Decimal(1e8), new Decimal(1e9), new Decimal(1e10), new Decimal(1e11),
    new Decimal(1e12), new Decimal(1e13), new Decimal(1e14), new Decimal(1e15), new Decimal(1e16),
    new Decimal(1e17), new Decimal(1e18), new Decimal(1e19), new Decimal(1e20), new Decimal(1e21),
    new Decimal(1e22), new Decimal(1e23), new Decimal(1e24), new Decimal(1e25), new Decimal(1e26),
    new Decimal(1e27), new Decimal(1e28), new Decimal(1e29), new Decimal(1e30), new Decimal(1e31),
    new Decimal(1e32), new Decimal(1e33), new Decimal(1e34), new Decimal(1e35), new Decimal(1e36),
    new Decimal(1e37), new Decimal(1e38), new Decimal(1e39), new Decimal(1e40), new Decimal(1e41),
    new Decimal(1e42), new Decimal(1e43), new Decimal(1e44), new Decimal(1e45), new Decimal(1e46),
    new Decimal(1e47), new Decimal(1e48), new Decimal(1e49), new Decimal(1e50), new Decimal(1e51),
    new Decimal(1e52), new Decimal(1e53), new Decimal(1e54), new Decimal(1e55), new Decimal(1e56),
    new Decimal(1e57), new Decimal(1e58), new Decimal(1e59), new Decimal(1e60), new Decimal(1e61),
    new Decimal(1e62), new Decimal(1e63), new Decimal(1e64), new Decimal(1e65), new Decimal(1e66),
    new Decimal(1e67), new Decimal(1e68), new Decimal(1e69), new Decimal(1e70), new Decimal(1e71),
    new Decimal(1e72), new Decimal(1e73), new Decimal(1e74), new Decimal(1e75), new Decimal(1e76),
    new Decimal(1e77), new Decimal(1e78), new Decimal(1e79), new Decimal(1e80), new Decimal(1e81),
    new Decimal(1e82), new Decimal(1e83), new Decimal(1e84), new Decimal(1e85), new Decimal(1e86),
    new Decimal(1e87), new Decimal(1e88), new Decimal(1e89), new Decimal(1e90), new Decimal(1e91),
    new Decimal(1e92), new Decimal(1e93), new Decimal(1e94), new Decimal(1e95), new Decimal(1e96),
    new Decimal(1e97), new Decimal(1e98), new Decimal(1e99), new Decimal(1e100), new Decimal(1e101),
    new Decimal(1e102), new Decimal(1e103), new Decimal(1e104), new Decimal(1e105), new Decimal(1e106),
    new Decimal(1e107), new Decimal(1e108), new Decimal(1e109), new Decimal(1e110), new Decimal(1e111),
    new Decimal(1e112), new Decimal(1e113), new Decimal(1e114), new Decimal(1e115), new Decimal(1e116),
    new Decimal(1e117), new Decimal(1e118), new Decimal(1e119), new Decimal(1e120), new Decimal(1e121),
    new Decimal(1e122), new Decimal(1e123), new Decimal(1e124), new Decimal(1e125), new Decimal(1e126),
    new Decimal(1e127), new Decimal(1e128), new Decimal(1e129), new Decimal(1e130), new Decimal(1e131),
    new Decimal(1e132), new Decimal(1e133), new Decimal(1e134), new Decimal(1e135), new Decimal(1e136),
    new Decimal(1e137), new Decimal(1e138), new Decimal(1e139), new Decimal(1e140), new Decimal(1e141),
    new Decimal(1e142), new Decimal(1e143), new Decimal(1e144), new Decimal(1e145), new Decimal(1e146),
    new Decimal(1e147), new Decimal(1e148), new Decimal(1e149), new Decimal(1e150), new Decimal(1e151),
    new Decimal(1e152), new Decimal(1e153), new Decimal(1e154), new Decimal(1e155), new Decimal(1e156),
    new Decimal(1e157), new Decimal(1e158), new Decimal(1e159), new Decimal(1e160), new Decimal(1e161),
    new Decimal(1e162), new Decimal(1e163), new Decimal(1e164), new Decimal(1e165), new Decimal(1e166),
    new Decimal(1e167), new Decimal(1e168), new Decimal(1e169), new Decimal(1e170), new Decimal(1e171),
    new Decimal(1e172), new Decimal(1e173), new Decimal(1e174), new Decimal(1e175), new Decimal(1e176),
    new Decimal(1e177), new Decimal(1e178), new Decimal(1e179), new Decimal(1e180), new Decimal(1e181),
    new Decimal(1e182), new Decimal(1e183), new Decimal(1e184), new Decimal(1e185), new Decimal(1e186),
    new Decimal(1e187), new Decimal(1e188), new Decimal(1e189), new Decimal(1e190), new Decimal(1e191),
    new Decimal(1e192), new Decimal(1e193), new Decimal(1e194), new Decimal(1e195), new Decimal(1e196),
    new Decimal(1e197), new Decimal(1e198), new Decimal(1e199), new Decimal(1e200), new Decimal(1e201),
    new Decimal(1e202), new Decimal(1e203), new Decimal(1e204), new Decimal(1e205), new Decimal(1e206),
    new Decimal(1e207), new Decimal(1e208), new Decimal(1e209), new Decimal(1e210), new Decimal(1e211),
    new Decimal(1e212), new Decimal(1e213), new Decimal(1e214), new Decimal(1e215), new Decimal(1e216),
    new Decimal(1e217), new Decimal(1e218), new Decimal(1e219), new Decimal(1e220), new Decimal(1e221),
    new Decimal(1e222), new Decimal(1e223), new Decimal(1e224), new Decimal(1e225), new Decimal(1e226),
    new Decimal(1e227), new Decimal(1e228), new Decimal(1e229), new Decimal(1e230), new Decimal(1e231),
    new Decimal(1e232), new Decimal(1e233), new Decimal(1e234), new Decimal(1e235), new Decimal(1e236),
    new Decimal(1e237), new Decimal(1e238), new Decimal(1e239), new Decimal(1e240), new Decimal(1e241),
    new Decimal(1e242), new Decimal(1e243), new Decimal(1e244), new Decimal(1e245), new Decimal(1e246),
    new Decimal(1e247), new Decimal(1e248), new Decimal(1e249), new Decimal(1e250), new Decimal(1e251),
    new Decimal(1e252), new Decimal(1e253), new Decimal(1e254), new Decimal(1e255), new Decimal(1e256),
    new Decimal(1e257), new Decimal(1e258), new Decimal(1e259), new Decimal(1e260), new Decimal(1e261),
    new Decimal(1e262), new Decimal(1e263), new Decimal(1e264), new Decimal(1e265), new Decimal(1e266),
    new Decimal(1e267), new Decimal(1e268), new Decimal(1e269), new Decimal(1e270), new Decimal(1e271),
    new Decimal(1e272), new Decimal(1e273), new Decimal(1e274), new Decimal(1e275), new Decimal(1e276),
    new Decimal(1e277), new Decimal(1e278), new Decimal(1e279), new Decimal(1e280), new Decimal(1e281),
    new Decimal(1e282), new Decimal(1e283), new Decimal(1e284), new Decimal(1e285), new Decimal(1e286),
    new Decimal(1e287), new Decimal(1e288), new Decimal(1e289), new Decimal(1e290), new Decimal(1e291),
    new Decimal(1e292), new Decimal(1e293), new Decimal(1e294), new Decimal(1e295), new Decimal(1e296),
    new Decimal(1e297), new Decimal(1e298), new Decimal(1e299), new Decimal(1e300), new Decimal(1e301),
    new Decimal(1e302), new Decimal(1e303), new Decimal(1e304), new Decimal(1e305), new Decimal(1e306),
    new Decimal(1e307), new Decimal(1e308), new Decimal('1e309'), new Decimal('1e310'), new Decimal('1e311'),
    new Decimal('1e312'), new Decimal('1e313'), new Decimal('1e314'), new Decimal('1e315'), new Decimal('1e316'),
    new Decimal('1e317'), new Decimal('1e318'), new Decimal('1e319'), new Decimal('1e320'), new Decimal('1e321'),
    new Decimal('1e322'), new Decimal('1e323'), new Decimal('1e324'), new Decimal('1e325'), new Decimal('1e326'),
    new Decimal('1e327'), new Decimal('1e328'), new Decimal('1e329'), new Decimal('1e330'), new Decimal('1e331'),
    new Decimal('1e332'), new Decimal('1e333'), new Decimal('1e334'), new Decimal('1e335'), new Decimal('1e336'),
    new Decimal('1e337'), new Decimal('1e338'), new Decimal('1e339'), new Decimal('1e340'), new Decimal('1e341'),
    new Decimal('1e342'), new Decimal('1e343'), new Decimal('1e344'), new Decimal('1e345'), new Decimal('1e346'),
    new Decimal('1e347'), new Decimal('1e348'), new Decimal('1e349'), new Decimal('1e350'), new Decimal('1e351'),
    new Decimal('1e352'), new Decimal('1e353'), new Decimal('1e354'), new Decimal('1e355'), new Decimal('1e356'),
    new Decimal('1e357'), new Decimal('1e358'), new Decimal('1e359'), new Decimal('1e360'), new Decimal('1e361'),
    new Decimal('1e362'), new Decimal('1e363'), new Decimal('1e364'), new Decimal('1e365'), new Decimal('1e366'),
    new Decimal('1e367'), new Decimal('1e368'), new Decimal('1e369'), new Decimal('1e370'), new Decimal('1e371'),
    new Decimal('1e372'), new Decimal('1e373'), new Decimal('1e374'), new Decimal('1e375'), new Decimal('1e376'),
    new Decimal('1e377'), new Decimal('1e378'), new Decimal('1e379'), new Decimal('1e380'), new Decimal('1e381'),
    new Decimal('1e382'), new Decimal('1e383'), new Decimal('1e384'), new Decimal('1e385'), new Decimal('1e386'),
    new Decimal('1e387'), new Decimal('1e388'), new Decimal('1e389'), new Decimal('1e390'), new Decimal('1e391'),
    new Decimal('1e392'), new Decimal('1e393'), new Decimal('1e394'), new Decimal('1e395'), new Decimal('1e396'),
    new Decimal('1e397'), new Decimal('1e398'), new Decimal('1e399'), new Decimal('1e400'), new Decimal('1e401'),
    new Decimal('1e402'), new Decimal('1e403'), new Decimal('1e404'), new Decimal('1e405'), new Decimal('1e406'),
    new Decimal('1e407'), new Decimal('1e408'), new Decimal('1e409'), new Decimal('1e410'), new Decimal('1e411'),
    new Decimal('1e412'), new Decimal('1e413'), new Decimal('1e414'), new Decimal('1e415'), new Decimal('1e416'),
    new Decimal('1e417'), new Decimal('1e418'), new Decimal('1e419'), new Decimal('1e420'), new Decimal('1e421'),
    new Decimal('1e422'), new Decimal('1e423'), new Decimal('1e424'), new Decimal('1e425'), new Decimal('1e426'),
    new Decimal('1e427'), new Decimal('1e428'), new Decimal('1e429'), new Decimal('1e430'), new Decimal('1e431'),
    new Decimal('1e432'), new Decimal('1e433'), new Decimal('1e434'), new Decimal('1e435'), new Decimal('1e436'),
    new Decimal('1e437'), new Decimal('1e438'), new Decimal('1e439'), new Decimal('1e440'), new Decimal('1e441'),
    new Decimal('1e442'), new Decimal('1e443'), new Decimal('1e444'), new Decimal('1e445'), new Decimal('1e446'),
    new Decimal('1e447'), new Decimal('1e448'), new Decimal('1e449'), new Decimal('1e450'), new Decimal('1e451'),
    new Decimal('1e452'), new Decimal('1e453'), new Decimal('1e454'), new Decimal('1e455'), new Decimal('1e456'),
    new Decimal('1e457'), new Decimal('1e458'), new Decimal('1e459'), new Decimal('1e460'), new Decimal('1e461'),
    new Decimal('1e462'), new Decimal('1e463'), new Decimal('1e464'), new Decimal('1e465'), new Decimal('1e466'),
    new Decimal('1e467'), new Decimal('1e468'), new Decimal('1e469'), new Decimal('1e470'), new Decimal('1e471'),
    new Decimal('1e472'), new Decimal('1e473'), new Decimal('1e474'), new Decimal('1e475'), new Decimal('1e476'),
    new Decimal('1e477'), new Decimal('1e478'), new Decimal('1e479'), new Decimal('1e480'), new Decimal('1e481'),
    new Decimal('1e482'), new Decimal('1e483'), new Decimal('1e484'), new Decimal('1e485'), new Decimal('1e486'),
    new Decimal('1e487'), new Decimal('1e488'), new Decimal('1e489'), new Decimal('1e490'), new Decimal('1e491'),
    new Decimal('1e492'), new Decimal('1e493'), new Decimal('1e494'), new Decimal('1e495'), new Decimal('1e496'),
    new Decimal('1e497'), new Decimal('1e498'), new Decimal('1e499'), new Decimal('1e500'), new Decimal('1e501'),
    new Decimal('1e502'), new Decimal('1e503'), new Decimal('1e504'), new Decimal('1e505'), new Decimal('1e506'),
    new Decimal('1e507'), new Decimal('1e508'), new Decimal('1e509'), new Decimal('1e510'), new Decimal('1e511'),
    new Decimal('1e512'), new Decimal('1e513'), new Decimal('1e514'), new Decimal('1e515'), new Decimal('1e516'),
    new Decimal('1e517'), new Decimal('1e518'), new Decimal('1e519'), new Decimal('1e520'), new Decimal('1e521'),
    new Decimal('1e522'), new Decimal('1e523'), new Decimal('1e524'), new Decimal('1e525'), new Decimal('1e526'),
    new Decimal('1e527'), new Decimal('1e528'), new Decimal('1e529'), new Decimal('1e530'), new Decimal('1e531'),
    new Decimal('1e532'), new Decimal('1e533'), new Decimal('1e534'), new Decimal('1e535'), new Decimal('1e536'),
    new Decimal('1e537'), new Decimal('1e538'), new Decimal('1e539'), new Decimal('1e540'), new Decimal('1e541'),
    new Decimal('1e542'), new Decimal('1e543'), new Decimal('1e544'), new Decimal('1e545'), new Decimal('1e546'),
    new Decimal('1e547'), new Decimal('1e548'), new Decimal('1e549'), new Decimal('1e550'), new Decimal('1e551'),
    new Decimal('1e552'), new Decimal('1e553'), new Decimal('1e554'), new Decimal('1e555'), new Decimal('1e556'),
    new Decimal('1e557'), new Decimal('1e558'), new Decimal('1e559'), new Decimal('1e560'), new Decimal('1e561'),
    new Decimal('1e562'), new Decimal('1e563'), new Decimal('1e564'), new Decimal('1e565'), new Decimal('1e566'),
    new Decimal('1e567'), new Decimal('1e568'), new Decimal('1e569'), new Decimal('1e570'), new Decimal('1e571'),
    new Decimal('1e572'), new Decimal('1e573'), new Decimal('1e574'), new Decimal('1e575'), new Decimal('1e576'),
    new Decimal('1e577'), new Decimal('1e578'), new Decimal('1e579'), new Decimal('1e580'), new Decimal('1e581'),
    new Decimal('1e582'), new Decimal('1e583'), new Decimal('1e584'), new Decimal('1e585'), new Decimal('1e586'),
    new Decimal('1e587'), new Decimal('1e588'), new Decimal('1e589'), new Decimal('1e590'), new Decimal('1e591'),
    new Decimal('1e592'), new Decimal('1e593'), new Decimal('1e594'), new Decimal('1e595'), new Decimal('1e596'),
    new Decimal('1e597'), new Decimal('1e598'), new Decimal('1e599'), new Decimal('1e600'), new Decimal('1e601'),
    new Decimal('1e602'), new Decimal('1e603'), new Decimal('1e604'), new Decimal('1e605'), new Decimal('1e606'),
    new Decimal('1e607'), new Decimal('1e608'), new Decimal('1e609'), new Decimal('1e610'), new Decimal('1e611'),
    new Decimal('1e612'), new Decimal('1e613'), new Decimal('1e614'), new Decimal('1e615'), new Decimal('1e616'),
    new Decimal('1e617'), new Decimal('1e618'), new Decimal('1e619'), new Decimal('1e620'), new Decimal('1e621'),
    new Decimal('1e622'), new Decimal('1e623'), new Decimal('1e624'), new Decimal('1e625'), new Decimal('1e626'),
    new Decimal('1e627'), new Decimal('1e628'), new Decimal('1e629'), new Decimal('1e630'), new Decimal('1e631'),
    new Decimal('1e632'), new Decimal('1e633'), new Decimal('1e634'), new Decimal('1e635'), new Decimal('1e636'),
    new Decimal('1e637'), new Decimal('1e638'), new Decimal('1e639'), new Decimal('1e640'), new Decimal('1e641'),
    new Decimal('1e642'), new Decimal('1e643'), new Decimal('1e644'), new Decimal('1e645'), new Decimal('1e646'),
    new Decimal('1e647'), new Decimal('1e648'), new Decimal('1e649'), new Decimal('1e650'), new Decimal('1e651'),
    new Decimal('1e652'), new Decimal('1e653'), new Decimal('1e654'), new Decimal('1e655'), new Decimal('1e656'),
    new Decimal('1e657'), new Decimal('1e658'), new Decimal('1e659'), new Decimal('1e660'), new Decimal('1e661'),
    new Decimal('1e662'), new Decimal('1e663'), new Decimal('1e664'), new Decimal('1e665'), new Decimal('1e666'),
    new Decimal('1e667'), new Decimal('1e668'), new Decimal('1e669'), new Decimal('1e670'), new Decimal('1e671'),
    new Decimal('1e672'), new Decimal('1e673'), new Decimal('1e674'), new Decimal('1e675'), new Decimal('1e676'),
    new Decimal('1e677'), new Decimal('1e678'), new Decimal('1e679'), new Decimal('1e680'), new Decimal('1e681'),
    new Decimal('1e682'), new Decimal('1e683'), new Decimal('1e684'), new Decimal('1e685'), new Decimal('1e686'),
    new Decimal('1e687'), new Decimal('1e688'), new Decimal('1e689'), new Decimal('1e690'), new Decimal('1e691'),
    new Decimal('1e692'), new Decimal('1e693'), new Decimal('1e694'), new Decimal('1e695'), new Decimal('1e696'),
    new Decimal('1e697'), new Decimal('1e698'), new Decimal('1e699'), new Decimal('1e700'), new Decimal('1e701'),
    new Decimal('1e702'), new Decimal('1e703'), new Decimal('1e704'), new Decimal('1e705'), new Decimal('1e706'),
    new Decimal('1e707'), new Decimal('1e708'), new Decimal('1e709'), new Decimal('1e710'), new Decimal('1e711'),
    new Decimal('1e712'), new Decimal('1e713'), new Decimal('1e714'), new Decimal('1e715'), new Decimal('1e716'),
    new Decimal('1e717'), new Decimal('1e718'), new Decimal('1e719'), new Decimal('1e720'), new Decimal('1e721'),
    new Decimal('1e722'), new Decimal('1e723'), new Decimal('1e724'), new Decimal('1e725'), new Decimal('1e726'),
    new Decimal('1e727'), new Decimal('1e728'), new Decimal('1e729'), new Decimal('1e730'), new Decimal('1e731'),
    new Decimal('1e732'), new Decimal('1e733'), new Decimal('1e734'), new Decimal('1e735'), new Decimal('1e736'),
    new Decimal('1e737'), new Decimal('1e738'), new Decimal('1e739'), new Decimal('1e740'), new Decimal('1e741'),
    new Decimal('1e742'), new Decimal('1e743'), new Decimal('1e744'), new Decimal('1e745'), new Decimal('1e746'),
    new Decimal('1e747'), new Decimal('1e748'), new Decimal('1e749'), new Decimal('1e750'), new Decimal('1e751'),
    new Decimal('1e752'), new Decimal('1e753'), new Decimal('1e754'), new Decimal('1e755'), new Decimal('1e756'),
    new Decimal('1e757'), new Decimal('1e758'), new Decimal('1e759'), new Decimal('1e760'), new Decimal('1e761'),
    new Decimal('1e762'), new Decimal('1e763'), new Decimal('1e764'), new Decimal('1e765'), new Decimal('1e766'),
    new Decimal('1e767'), new Decimal('1e768'), new Decimal('1e769'), new Decimal('1e770'), new Decimal('1e771'),
    new Decimal('1e772'), new Decimal('1e773'), new Decimal('1e774'), new Decimal('1e775'), new Decimal('1e776'),
    new Decimal('1e777'), new Decimal('1e778'), new Decimal('1e779'), new Decimal('1e780'), new Decimal('1e781'),
    new Decimal('1e782'), new Decimal('1e783'), new Decimal('1e784'), new Decimal('1e785'), new Decimal('1e786'),
    new Decimal('1e787'), new Decimal('1e788'), new Decimal('1e789'), new Decimal('1e790'), new Decimal('1e791'),
    new Decimal('1e792'), new Decimal('1e793'), new Decimal('1e794'), new Decimal('1e795'), new Decimal('1e796'),
    new Decimal('1e797'), new Decimal('1e798'), new Decimal('1e799'), new Decimal('1e800'), new Decimal(1e801),
    new Decimal(1e802), new Decimal(1e803), new Decimal(1e804), new Decimal(1e805), new Decimal(1e806),
    new Decimal(1e807), new Decimal(1e808), new Decimal(1e809), new Decimal(1e810), new Decimal(1e811),
    new Decimal(1e812), new Decimal(1e813), new Decimal(1e814), new Decimal(1e815), new Decimal(1e816),
    new Decimal(1e817), new Decimal(1e818), new Decimal(1e819), new Decimal(1e820), new Decimal(1e821),
    new Decimal(1e822), new Decimal(1e823), new Decimal(1e824), new Decimal(1e825), new Decimal(1e826),
    new Decimal(1e827), new Decimal(1e828), new Decimal(1e829), new Decimal(1e830), new Decimal(1e831),
    new Decimal(1e832), new Decimal(1e833), new Decimal(1e834), new Decimal(1e835), new Decimal(1e836),
    new Decimal(1e837), new Decimal(1e838), new Decimal(1e839), new Decimal(1e840), new Decimal(1e841),
    new Decimal(1e842), new Decimal(1e843), new Decimal(1e844), new Decimal(1e845), new Decimal(1e846),
    new Decimal(1e847), new Decimal(1e848), new Decimal(1e849), new Decimal(1e850), new Decimal(1e851),
    new Decimal(1e852), new Decimal(1e853), new Decimal(1e854), new Decimal(1e855), new Decimal(1e856),
    new Decimal(1e857), new Decimal(1e858), new Decimal(1e859), new Decimal(1e860), new Decimal(1e861),
    new Decimal(1e862), new Decimal(1e863), new Decimal(1e864), new Decimal(1e865), new Decimal(1e866),
    new Decimal(1e867), new Decimal(1e868), new Decimal(1e869), new Decimal(1e870), new Decimal(1e871),
    new Decimal(1e872), new Decimal(1e873), new Decimal(1e874), new Decimal(1e875), new Decimal(1e876),
    new Decimal(1e877), new Decimal(1e878), new Decimal(1e879), new Decimal(1e880), new Decimal(1e881),
    new Decimal(1e882), new Decimal(1e883), new Decimal(1e884), new Decimal(1e885), new Decimal(1e886),
    new Decimal(1e887), new Decimal(1e888), new Decimal(1e889), new Decimal(1e890), new Decimal(1e891),
    new Decimal(1e892), new Decimal(1e893), new Decimal(1e894), new Decimal(1e895), new Decimal(1e896),
    new Decimal(1e897), new Decimal(1e898), new Decimal(1e899), new Decimal(1e900), new Decimal(1e901),
    new Decimal(1e902), new Decimal(1e903), new Decimal(1e904), new Decimal(1e905), new Decimal(1e906),
    new Decimal(1e907), new Decimal(1e908), new Decimal(1e909), new Decimal(1e910), new Decimal(1e911),
    new Decimal(1e912), new Decimal(1e913), new Decimal(1e914), new Decimal(1e915), new Decimal(1e916),
    new Decimal(1e917), new Decimal(1e918), new Decimal(1e919), new Decimal(1e920), new Decimal(1e921),
    new Decimal(1e922), new Decimal(1e923), new Decimal(1e924), new Decimal(1e925), new Decimal(1e926),
    new Decimal(1e927), new Decimal(1e928), new Decimal(1e929), new Decimal(1e930), new Decimal(1e931),
    new Decimal(1e932), new Decimal(1e933), new Decimal(1e934), new Decimal(1e935), new Decimal(1e936),
    new Decimal(1e937), new Decimal(1e938), new Decimal(1e939), new Decimal(1e940), new Decimal(1e941),
    new Decimal(1e942), new Decimal(1e943), new Decimal(1e944), new Decimal(1e945), new Decimal(1e946),
    new Decimal(1e947), new Decimal(1e948), new Decimal(1e949), new Decimal(1e950), new Decimal(1e951),
    new Decimal(1e952), new Decimal(1e953), new Decimal(1e954), new Decimal(1e955), new Decimal(1e956),
    new Decimal(1e957), new Decimal(1e958), new Decimal(1e959), new Decimal(1e960), new Decimal(1e961),
    new Decimal(1e962), new Decimal(1e963), new Decimal(1e964), new Decimal(1e965), new Decimal(1e966),
    new Decimal(1e967), new Decimal(1e968), new Decimal(1e969), new Decimal(1e970), new Decimal(1e971),
    new Decimal(1e972), new Decimal(1e973), new Decimal(1e974), new Decimal(1e975), new Decimal(1e976),
    new Decimal(1e977), new Decimal(1e978), new Decimal(1e979), new Decimal(1e980), new Decimal(1e981),
    new Decimal(1e982), new Decimal(1e983), new Decimal(1e984), new Decimal(1e985), new Decimal(1e986),
    new Decimal(1e987), new Decimal(1e988), new Decimal(1e989), new Decimal(1e990), new Decimal(1e991),
    new Decimal(1e992), new Decimal(1e993), new Decimal(1e994), new Decimal(1e995), new Decimal(1e996),
    new Decimal(1e997), new Decimal(1e998), new Decimal(1e999), new Decimal(1e1000), new Decimal(1e1001),
    new Decimal(1e1002), new Decimal(1e1003), new Decimal(1e1004), new Decimal(1e1005), new Decimal(1e1006),
    new Decimal(1e1007), new Decimal(1e1008), new Decimal(1e1009), new Decimal(1e1010), new Decimal(1e1011),
    new Decimal(1e1012), new Decimal(1e1013), new Decimal(1e1014), new Decimal(1e1015), new Decimal(1e1016),
    new Decimal(1e1017), new Decimal(1e1018), new Decimal(1e1019), new Decimal(1e1020), new Decimal(1e1021),
    new Decimal(1e1022), new Decimal(1e1023), new Decimal(1e1024), new Decimal(1e1025), new Decimal(1e1026),
    new Decimal(1e1027), new Decimal(1e1028), new Decimal(1e1029), new Decimal(1e1030), new Decimal(1e1031),
    new Decimal(1e1032), new Decimal(1e1033), new Decimal(1e1034), new Decimal(1e1035), new Decimal(1e1036),
    new Decimal(1e1037), new Decimal(1e1038), new Decimal(1e1039), new Decimal(1e1040), new Decimal(1e1041),
    new Decimal(1e1042), new Decimal(1e1043), new Decimal(1e1044), new Decimal(1e1045), new Decimal(1e1046),
    new Decimal(1e1047), new Decimal(1e1048), new Decimal(1e1049), new Decimal(1e1050), new Decimal(1e1051),
    new Decimal(1e1052), new Decimal(1e1053), new Decimal(1e1054), new Decimal(1e1055), new Decimal(1e1056),
    new Decimal(1e1057), new Decimal(1e1058), new Decimal(1e1059), new Decimal(1e1060), new Decimal(1e1061),
    new Decimal(1e1062), new Decimal(1e1063), new Decimal(1e1064), new Decimal(1e1065), new Decimal(1e1066),
    new Decimal(1e1067), new Decimal(1e1068), new Decimal(1e1069), new Decimal(1e1070), new Decimal(1e1071),
    new Decimal(1e1072), new Decimal(1e1073), new Decimal(1e1074), new Decimal(1e1075), new Decimal(1e1076),
    new Decimal(1e1077), new Decimal(1e1078), new Decimal(1e1079), new Decimal(1e1080), new Decimal(1e1081),
    new Decimal(1e1082), new Decimal(1e1083), new Decimal(1e1084), new Decimal(1e1085), new Decimal(1e1086),
    new Decimal(1e1087), new Decimal(1e1088), new Decimal(1e1089), new Decimal(1e1090), new Decimal(1e1091),
    new Decimal(1e1092), new Decimal(1e1093), new Decimal(1e1094), new Decimal(1e1095), new Decimal(1e1096),
    new Decimal(1e1097), new Decimal(1e1098), new Decimal(1e1099), new Decimal(1e1100), new Decimal(1e1101),
    new Decimal(1e1102), new Decimal(1e1103), new Decimal(1e1104), new Decimal(1e1105), new Decimal(1e1106),
    new Decimal(1e1107), new Decimal(1e1108), new Decimal(1e1109), new Decimal(1e1110), new Decimal(1e1111),
    new Decimal(1e1112), new Decimal(1e1113), new Decimal(1e1114), new Decimal(1e1115), new Decimal(1e1116),
    new Decimal(1e1117), new Decimal(1e1118), new Decimal(1e1119), new Decimal(1e1120), new Decimal(1e1121),
    new Decimal(1e1122), new Decimal(1e1123), new Decimal(1e1124), new Decimal(1e1125), new Decimal(1e1126),
    new Decimal(1e1127), new Decimal(1e1128), new Decimal(1e1129), new Decimal(1e1130), new Decimal(1e1131),
    new Decimal(1e1132), new Decimal(1e1133), new Decimal(1e1134), new Decimal(1e1135), new Decimal(1e1136),
    new Decimal(1e1137), new Decimal(1e1138), new Decimal(1e1139), new Decimal(1e1140), new Decimal(1e1141),
    new Decimal(1e1142), new Decimal(1e1143), new Decimal(1e1144), new Decimal(1e1145), new Decimal(1e1146),
    new Decimal(1e1147), new Decimal(1e1148), new Decimal(1e1149), new Decimal(1e1150), new Decimal(1e1151),
    new Decimal(1e1152), new Decimal(1e1153), new Decimal(1e1154), new Decimal(1e1155), new Decimal(1e1156),
    new Decimal(1e1157), new Decimal(1e1158), new Decimal(1e1159), new Decimal(1e1160), new Decimal(1e1161),
    new Decimal(1e1162), new Decimal(1e1163), new Decimal(1e1164), new Decimal(1e1165), new Decimal(1e1166),
    new Decimal(1e1167), new Decimal(1e1168), new Decimal(1e1169), new Decimal(1e1170), new Decimal(1e1171),
    new Decimal(1e1172), new Decimal(1e1173), new Decimal(1e1174), new Decimal(1e1175), new Decimal(1e1176),
    new Decimal(1e1177), new Decimal(1e1178), new Decimal(1e1179), new Decimal(1e1180), new Decimal(1e1181),
    new Decimal(1e1182), new Decimal(1e1183), new Decimal(1e1184), new Decimal(1e1185), new Decimal(1e1186),
    new Decimal(1e1187), new Decimal(1e1188), new Decimal(1e1189), new Decimal(1e1190), new Decimal(1e1191),
    new Decimal(1e1192), new Decimal(1e1193), new Decimal(1e1194), new Decimal(1e1195), new Decimal(1e1196),
    new Decimal(1e1197), new Decimal(1e1198), new Decimal(1e1199), new Decimal(1e1200), new Decimal(1e1201),
    new Decimal(1e1202), new Decimal(1e1203), new Decimal(1e1204), new Decimal(1e1205), new Decimal(1e1206),
    new Decimal(1e1207), new Decimal(1e1208), new Decimal(1e1209), new Decimal(1e1210), new Decimal(1e1211),
    new Decimal(1e1212), new Decimal(1e1213), new Decimal(1e1214), new Decimal(1e1215), new Decimal(1e1216),
    new Decimal(1e1217), new Decimal(1e1218), new Decimal(1e1219), new Decimal(1e1220), new Decimal(1e1221),
    new Decimal(1e1222), new Decimal(1e1223), new Decimal(1e1224), new Decimal(1e1225), new Decimal(1e1226),
    new Decimal(1e1227), new Decimal(1e1228), new Decimal(1e1229), new Decimal(1e1230), new Decimal(1e1231),
    new Decimal(1e1232), new Decimal(1e1233), new Decimal(1e1234), new Decimal(1e1235), new Decimal(1e1236),
    new Decimal(1e1237), new Decimal(1e1238), new Decimal(1e1239), new Decimal(1e1240), new Decimal(1e1241),
    new Decimal(1e1242), new Decimal(1e1243), new Decimal(1e1244), new Decimal(1e1245), new Decimal(1e1246),
    new Decimal(1e1247), new Decimal(1e1248), new Decimal(1e1249), new Decimal(1e1250), new Decimal(1e1251),
    new Decimal(1e1252), new Decimal(1e1253), new Decimal(1e1254), new Decimal(1e1255), new Decimal(1e1256),
    new Decimal(1e1257), new Decimal(1e1258), new Decimal(1e1259), new Decimal(1e1260), new Decimal(1e1261),
    new Decimal(1e1262), new Decimal(1e1263), new Decimal(1e1264), new Decimal(1e1265), new Decimal(1e1266),
    new Decimal(1e1267), new Decimal(1e1268), new Decimal(1e1269), new Decimal(1e1270), new Decimal(1e1271),
    new Decimal(1e1272), new Decimal(1e1273), new Decimal(1e1274), new Decimal(1e1275), new Decimal(1e1276),
    new Decimal(1e1277), new Decimal(1e1278), new Decimal(1e1279), new Decimal(1e1280), new Decimal(1e1281),
    new Decimal(1e1282), new Decimal(1e1283), new Decimal(1e1284), new Decimal(1e1285), new Decimal(1e1286),
    new Decimal(1e1287), new Decimal(1e1288), new Decimal(1e1289), new Decimal(1e1290), new Decimal(1e1291),
    new Decimal(1e1292), new Decimal(1e1293), new Decimal(1e1294), new Decimal(1e1295), new Decimal(1e1296),
    new Decimal(1e1297), new Decimal(1e1298), new Decimal(1e1299), new Decimal(1e1300), new Decimal(1e1301),
    new Decimal(1e1302), new Decimal(1e1303), new Decimal(1e1304), new Decimal(1e1305), new Decimal(1e1306),
    new Decimal(1e1307), new Decimal(1e1308)
];

// Constante utilisée dans le calcul des Points d'Ascension
export const prime_PA = new Decimal(1000); // Exemple de valeur

// Seuil de Bons Points Total requis pour gagner 1 Point d'Ascension
export const ASCENSION_POINT_THRESHOLD = new Decimal(1e10); // Exemple de seuil

// Seuil de Points d'Ascension Total requis pour gagner 1 Point de Prestige
export const PRESTIGE_POINT_THRESHOLD = new Decimal(1e5); // Exemple de seuil
