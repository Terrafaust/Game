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
// // break_infinity.min.js : La bibliothèque Decimal est importée pour gérer les très grands nombres.
// //                         Toutes les valeurs numériques importantes sont converties en objets Decimal
// //                         dès leur définition ici pour assurer une précision illimitée.
//
// ------------------ Variables Clés Définies et Exportées ------------------
//
// // export const initialCosts : Objet JavaScript contenant les coûts de base initiaux pour chaque type d'achat.
// //   Chaque propriété de cet objet représente un type d'unité ou d'amélioration.
// //   La valeur associée est un objet Decimal représentant le coût de base de la première unité de ce type.
// //   Ces coûts servent de point de départ pour les calculs de prix dynamiques effectués dans les modules de logique
// //   tels que studies.js et ascension.js, où ils sont ajustés par des multiplicateurs et des réductions.
// //   Propriétés :
// //     - eleve (Decimal) : Coût de base pour acquérir un Élève.
// //     - classe (Decimal) : Coût de base pour acquérir une Classe.
// //     - image (Decimal) : Coût de base pour acquérir une Image.
// //     - Professeur (Decimal) : Coût de base pour acquérir un Professeur, exprimé en Images.
// //     - ecole (Decimal) : Coût de base pour acquérir une École, exprimé en Points d'Ascension (PA).
// //     - lycee (Decimal) : Coût de base pour acquérir un Lycée, exprimé en Points d'Ascension (PA).
// //     - college (Decimal) : Coût de base pour acquérir un Collège, exprimé en Points d'Ascension (PA).
// //     - licence (Decimal) : Coût de base pour acquérir une Licence, exprimé en Points de Prestige (PP).
// //     - master1 (Decimal) : Coût de base pour acquérir un Master I, exprimé en Points de Prestige (PP).
// //     - master2 (Decimal) : Coût de base pour acquérir un Master II, exprimé en Points de Prestige (PP).
// //     - doctorat (Decimal) : Coût de base pour acquérir un Doctorat, exprimé en Points de Prestige (PP).
// //     - postDoctorat (Decimal) : Coût de base pour acquérir un Post-Doctorat, exprimé en Points de Prestige (PP).
//
// // export const baseProductions : Objet JavaScript définissant la production de base de chaque unité.
// //   Ces valeurs représentent la quantité de Bons Points par seconde (BP/s) ou le multiplicateur
// //   de production de base fourni par une seule unité de chaque type.
// //   Ces productions de base sont ensuite augmentées par des multiplicateurs provenant des compétences,
// //   de l'Ascension et du Prestige dans le module core.js.
// //   Propriétés :
// //     - eleveBps (Decimal) : Production de BP/s générée par un Élève.
// //     - classeBps (Decimal) : Production de BP/s générée par une Classe.
// //     - imageBpsMultiplier (Decimal) : Multiplicateur appliqué à la production totale de BP/s par Image.
// //     - ProfesseurClassMultiplier (Decimal) : Multiplicateur appliqué à la production des Classes par Professeur.
//
// // export const skillsData : Objet complexe contenant les définitions structurées de tous les arbres de compétences du jeu.
// //   Il est organisé par catégories principales : 'studies' (Études), 'ascension' (Ascension), et 'prestige' (Prestige).
// //   Chaque catégorie est un tableau de compétences.
// //   Chaque compétence est un objet avec les propriétés suivantes :
// //     - id (string) : L'identifiant unique de la compétence, utilisé pour le suivi de son niveau et de ses prérequis.
// //     - name (string) : Le nom affiché de la compétence dans l'interface utilisateur.
// //     - description (string) : Une brève explication de l'effet de la compétence.
// //     - cost (number) : Le coût en points de compétence de la catégorie correspondante pour débloquer cette compétence.
// //     - maxLevel (number) : Le niveau maximal que cette compétence peut atteindre.
// //     - tier (number) : Le niveau ou la "rangée" de la compétence dans son arbre, influençant son positionnement visuel.
// //     - prerequisites (array of strings) : Une liste des id de compétences qui doivent être entièrement débloquées
// //                                         (atteindre leur maxLevel) avant que cette compétence ne puisse être achetée.
// //     - effect (function) : Une fonction de rappel qui est exécutée lorsque la compétence est achetée ou que son niveau change.
// //                           Elle prend deux arguments : level (le niveau actuel de la compétence) et skillEffects
// //                           (l'objet global des effets cumulés défini dans core.js).
// //                           Cette fonction modifie directement les propriétés de skillEffects pour appliquer les bonus de la compétence.
//
// // export const prestigePurchasesData : Tableau d'objets définissant toutes les améliorations permanentes
// //                                    qui peuvent être achetées avec la monnaie de Prestige (Points de Prestige - PP).
// //   Chaque achat de prestige est un objet avec les propriétés suivantes :
// //     - id (string) : L'identifiant unique de l'achat de prestige.
// //     - name (string) : Le nom affiché de l'amélioration de prestige.
// //     - baseCost (Decimal) : Le coût de base de la première unité de cette amélioration, exprimé en PP.
// //     - costMultiplier (Decimal) : Le multiplicateur appliqué au coût pour chaque achat successif de cette amélioration.
// //     - getEffectValue (function) : Une fonction qui calcule la valeur numérique de l'effet de l'amélioration
// //                                   en fonction de son level actuel. Utilisée pour l'affichage de l'effet.
// //     - effect (function) : Une fonction de rappel qui prend le niveau actuel de l'amélioration et l'objet skillEffects.
// //                           Elle modifie directement les propriétés de skillEffects pour appliquer le bonus permanent de l'amélioration.
// //     - getMinClasses (function, spécifique à 'doctorat') : Une fonction utilitaire pour le Doctorat,
// //                                                           calculant le nombre minimum de classes après Ascension
// //                                                           en fonction du niveau de Doctorat.
// //     - prerequisites (function) : Une fonction qui retourne true si les conditions préalables à l'achat
// //                                  de cette amélioration sont remplies, false sinon.
// //   Achats de prestige définis : 'licence', 'master1', 'master2', 'doctorat', 'postDoctorat'.
//
// // export const questsData : Tableau d'objets définissant toutes les quêtes disponibles dans le jeu.
// //   Chaque quête est un objectif que le joueur peut accomplir pour obtenir des récompenses.
// //   Chaque quête est un objet avec les propriétés suivantes :
// //     - id (string) : L'identifiant unique de la quête.
// //     - name (string) : Le nom affiché de la quête.
// //     - description (string) : Le texte décrivant l'objectif à atteindre pour compléter la quête.
// //     - condition (function) : Une fonction qui prend en arguments les variables d'état du jeu pertinentes
// //                              (ex: totalClicks, nombreEleves, ascensionCount, totalPAEarned, prestigeCount)
// //                              et retourne true si l'objectif de la quête est atteint.
// //     - reward (object) : Un objet décrivant la récompense de la quête. Il a les propriétés :
// //       - type (string) : Le type de récompense (ex: 'studiesSkillPoints', 'ascensionSkillPoints', 'prestigeSkillPoints', 'paMultiplier', 'ppMultiplier').
// //       - amount (Decimal) : La quantité de la récompense.
// //     - rewardText (string) : Une chaîne de caractères décrivant la récompense pour l'affichage dans l'interface.
// //     - current (number) : Un champ optionnel pour suivre la progression actuelle de la quête (non sauvegardé par défaut, géré par quests.js).
// //     - unlocked (boolean) : Un champ optionnel indiquant si la quête est débloquée ou visible (non sauvegardé par défaut, géré par quests.js).
// //     - permanent (boolean) : Un indicateur si la quête persiste à travers les réinitialisations (Ascension/Prestige) ou si elle est réinitialisée.
//
// // export const bonusPointThresholds : Tableau d'objets Decimal définissant les seuils de Bons Points (BP)
// //                                   que le joueur doit atteindre pour gagner des Points de Compétence d'Études supplémentaires.
// //                                   Chaque valeur dans le tableau représente un seuil successif, et le joueur gagne
// //                                   un point de compétence à chaque fois qu'un nouveau seuil est dépassé.
//
// // export const prime_PA : Constante Decimal représentant la valeur de base utilisée dans le calcul
// //                       des Points d'Ascension (PA) gagnés lors d'une Ascension.
// //                       Elle sert de multiplicateur ou de base pour la formule de gain de PA.
//
// // export const ASCENSION_POINT_THRESHOLD : Constante Decimal qui définit le seuil de Bons Points Total
// //                                        requis pour gagner 1 Point d'Ascension (PA) lors d'une Ascension.
// //                                        Cette valeur est fondamentale pour déterminer la quantité de PA
// //                                        obtenue par le joueur en fonction de sa progression cumulée.
//
// // export const PRESTIGE_POINT_THRESHOLD : Constante Decimal qui définit le seuil de Points d'Ascension Total
// //                                        requis pour gagner 1 Point de Prestige (PP) lors d'un Prestige.
// //                                        Cette valeur est fondamentale pour déterminer la quantité de PP
// //                                        obtenue par le joueur en fonction de sa progression cumulée en PA.
//
// ------------------ Fonctions de Calcul de Coût (RETIREES DE CE FICHIER) ------------------
//
// // Note Importante : Les fonctions de calcul de coût telles que calculateNextImageCost et calculateAutomationCost
// //                  ont été retirées de data.js. Ce fichier est strictement destiné aux données statiques.
// //                  Les fonctions de calcul de coût doivent être définies dans les modules de logique
// //                  qui les utilisent (par exemple, studies.js pour calculateNextImageCost
// //                  et automation.js pour calculateAutomationCost).
// //                  Cela assure une meilleure séparation des préoccupations et une architecture plus propre.
//
// --------------------------------------------------------------------

// --- Coûts Initiaux de Base ---
// Ces coûts sont les valeurs de départ pour les calculs de prix dans les modules respectifs.
export const initialCosts = {
    eleve: new Decimal(10),
    classe: new Decimal(100),
    image: new Decimal(1000),
    Professeur: new Decimal(2), // Coût en Images
    ecole: new Decimal(15), // Coût en PA
    lycee: new Decimal(50), // Coût en PA
    college: new Decimal(250), // Coût en PA
    licence: new Decimal(100), // Coût en PP
    master1: new Decimal(200), // Coût en PP
    master2: new Decimal(1000), // Coût en PP
    doctorat: new Decimal(1000), // Coût en PP
    postDoctorat: new Decimal(10000), // Coût en PP
};

// --- Productions de Base ---
// Ces valeurs définissent la production de base de chaque unité.
export const baseProductions = {
    eleveBps: new Decimal(0.1),
    classeBps: new Decimal(1),
    imageBpsMultiplier: new Decimal(0.01), // Multiplicateur pour la production totale de BP/s par image
    ProfesseurClassMultiplier: new Decimal(0.1), // Multiplicateur pour la production des classes par professeur
};

// --- Définitions des Compétences ---
// Chaque fonction 'effect' prend le niveau de la compétence et l'objet 'skillEffects' en argument.
// Elle modifie 'skillEffects' directement. 'skillEffects' est défini et géré dans 'core.js'.
export const skillsData = {
    studies: [
        {
            id: 'S1_1_BP_Click',
            name: 'Clic Amélioré',
            description: 'Augmente les BP par clic de +1.',
            cost: 1,
            maxLevel: 1,
            tier: 1,
            prerequisites: [],
            effect: (level, skillEffects) => { skillEffects.clickBonsPointsBonus = skillEffects.clickBonsPointsBonus.add(level); }
        },
        {
            id: 'S1_2_Eleve_BPS',
            name: 'Productivité Élèves',
            description: 'Augmente la production de BP/s des Élèves de 10%.',
            cost: 1,
            maxLevel: 1,
            tier: 1,
            prerequisites: [],
            effect: (level, skillEffects) => { skillEffects.eleveBpsMultiplier = skillEffects.eleveBpsMultiplier.times(new Decimal(1).add(new Decimal(0.1).times(level))); }
        },
        {
            id: 'S2_1_Eleve_Cost',
            name: 'Optimisation Élèves',
            description: 'Réduit le coût des Élèves de 1%.',
            cost: 1,
            maxLevel: 1,
            tier: 2,
            prerequisites: ['S1_1_BP_Click'],
            effect: (level, skillEffects) => { skillEffects.eleveCostReduction = skillEffects.eleveCostReduction.add(new Decimal(0.01).times(level)); }
        },
        {
            id: 'S2_2_Classe_BPS',
            name: 'Efficacité Classes',
            description: 'Augmente la production de BP/s des Classes de 10%.',
            cost: 1,
            maxLevel: 1,
            tier: 2,
            prerequisites: ['S1_2_Eleve_BPS'],
            effect: (level, skillEffects) => { skillEffects.classeBpsMultiplier = skillEffects.classeBpsMultiplier.times(new Decimal(1).add(new Decimal(0.1).times(level))); }
        },
        {
            id: 'S3_1_Image_Cost',
            name: 'Réduction Coût Image',
            description: 'Réduit le coût des Images de 1%.',
            cost: 1,
            maxLevel: 1,
            tier: 3,
            prerequisites: ['S2_1_Eleve_Cost'],
            effect: (level, skillEffects) => { skillEffects.imageCostReduction = skillEffects.imageCostReduction.add(new Decimal(0.01).times(level)); }
        },
        {
            id: 'S3_2_Professeur_Cost',
            name: 'Formation Professeurs',
            description: 'Réduit le coût des Professeurs de 1%.',
            cost: 1,
            maxLevel: 1,
            tier: 3,
            prerequisites: ['S2_2_Classe_BPS'],
            effect: (level, skillEffects) => { skillEffects.ProfesseurCostReduction = skillEffects.ProfesseurCostReduction.add(new Decimal(0.01).times(level)); }
        },
        {
            id: 'S4_1_All_BPS',
            name: 'Synergie Générale',
            description: 'Augmente la production totale de BP/s de 5%.',
            cost: 1,
            maxLevel: 1,
            tier: 4,
            prerequisites: ['S3_1_Image_Cost', 'S3_2_Professeur_Cost'],
            effect: (level, skillEffects) => { skillEffects.allBpsMultiplier = skillEffects.allBpsMultiplier.times(new Decimal(1).add(new Decimal(0.05).times(level))); }
        },
        {
            id: 'S5_1_All_Cost',
            name: 'Maître des Coûts',
            description: 'Réduit tous les coûts de 0.5%.',
            cost: 1,
            maxLevel: 1,
            tier: 5,
            prerequisites: ['S4_1_All_BPS'],
            effect: (level, skillEffects) => { skillEffects.allCostReduction = skillEffects.allCostReduction.add(new Decimal(0.005).times(level)); }
        },
        {
            id: 'S5_2_Secret',
            name: 'Le Secret de l\'Étude',
            description: 'Débloque un secret après 100 clics sur cette compétence.',
            cost: 1,
            maxLevel: 1,
            tier: 5,
            prerequisites: ['S4_1_All_BPS'],
            effect: (level, skillEffects) => { /* Pas d'effet direct, géré par un compteur de clics */ }
        }
    ],
    ascension: [
        {
            id: 'A1_1_PA_Gain',
            name: 'Potentiel Ascension',
            description: 'Augmente le gain de PA de 10%.',
            cost: 1,
            maxLevel: 1,
            tier: 1,
            prerequisites: [],
            effect: (level, skillEffects) => { skillEffects.paGainMultiplier = skillEffects.paGainMultiplier.times(new Decimal(1).add(new Decimal(0.1).times(level))); }
        },
        {
            id: 'A1_2_Ecole_Cost',
            name: 'Construction Efficace',
            description: 'Réduit le coût des Écoles de 1%.',
            cost: 1,
            maxLevel: 1,
            tier: 1,
            prerequisites: [],
            effect: (level, skillEffects) => { skillEffects.ecoleCostReduction = skillEffects.ecoleCostReduction.add(new Decimal(0.01).times(level)); }
        },
        {
            id: 'A2_1_Ascension_Bonus',
            name: 'Maîtrise Ascension',
            description: 'Augmente le bonus d\'Ascension de +0.01x.',
            cost: 1,
            maxLevel: 1,
            tier: 2,
            prerequisites: ['A1_1_PA_Gain', 'A1_2_Ecole_Cost'],
            effect: (level, skillEffects) => { skillEffects.ascensionBonusIncrease = skillEffects.ascensionBonusIncrease.add(new Decimal(0.01).times(level)); }
        },
        {
            id: 'A3_1_Offline_Production',
            name: 'Progrès Ininterrompu',
            description: 'Augmente la production hors ligne de 10%.',
            cost: 1,
            maxLevel: 1,
            tier: 3,
            prerequisites: ['A2_1_Ascension_Bonus'],
            effect: (level, skillEffects) => { skillEffects.offlineProductionIncrease = skillEffects.offlineProductionIncrease.add(new Decimal(0.1).times(level)); }
        },
        {
            id: 'A4_1_Automation_Cost',
            name: 'Automatisation Avancée',
            description: 'Réduit le coût des automatisations de 1%.',
            cost: 1,
            maxLevel: 1,
            tier: 4,
            prerequisites: ['A3_1_Offline_Production'],
            effect: (level, skillEffects) => { skillEffects.automationCostReduction = skillEffects.automationCostReduction.add(new Decimal(0.01).times(level)); }
        }
    ],
    prestige: [
        {
            id: 'P1_1_All_Production',
            name: 'Infusion de Puissance',
            description: 'Augmente la production de toutes les structures de 1%.',
            cost: 1,
            maxLevel: 1,
            tier: 1,
            prerequisites: [],
            effect: (level, skillEffects) => { skillEffects.allProductionMultiplier = skillEffects.allProductionMultiplier.times(new Decimal(1).add(new Decimal(0.01).times(level))); }
        },
        {
            id: 'P1_2_BP_Click_Prestige',
            name: 'Clic Divin',
            description: 'Augmente les BP par clic de 100.',
            cost: 1,
            maxLevel: 1,
            tier: 1,
            prerequisites: [],
            effect: (level, skillEffects) => { skillEffects.clickBonsPointsBonus = skillEffects.clickBonsPointsBonus.add(new Decimal(100).times(level)); }
        },
        {
            id: 'P2_1_PA_Gain_Prestige',
            name: 'Essence d\'Ascension',
            description: 'Augmente le gain de PA de 5%.',
            cost: 1,
            maxLevel: 1,
            tier: 2,
            prerequisites: ['P1_1_All_Production', 'P1_2_BP_Click_Prestige'],
            effect: (level, skillEffects) => { skillEffects.paGainMultiplier = skillEffects.paGainMultiplier.times(new Decimal(1).add(new Decimal(0.05).times(level))); }
        }
    ]
};

// --- Définitions des Achats de Prestige ---
export const prestigePurchasesData = [ // Changed to array to match common usage in UI/logic
    {
        id: 'licence',
        name: 'Licence',
        baseCost: new Decimal(100),
        costMultiplier: new Decimal(1.5),
        getEffectValue: (level) => new Decimal(1).add(new Decimal(0.01).times(level)), // Example: 1% per level
        effect: (level, skillEffects) => { skillEffects.licenceProfMultiplier = skillEffects.licenceProfMultiplier.add(new Decimal(0.01).times(level)); }, // 1% de boost au multiplicateur Professeur par niveau
        prerequisites: () => true // No prerequisites for now, adjust as needed
    },
    {
        id: 'master1',
        name: 'Master I',
        baseCost: new Decimal(200),
        costMultiplier: new Decimal(1.5),
        getEffectValue: (level) => new Decimal(1).add(new Decimal(0.01).times(level)), // Example: 1% per level
        effect: (level, skillEffects) => { skillEffects.master1ClassProduction = skillEffects.master1ClassProduction.add(new Decimal(0.01).times(level)); }, // 1% de boost à la production des Classes par Prof par niveau
        prerequisites: () => true
    },
    {
        id: 'master2',
        name: 'Master II',
        baseCost: new Decimal(1000),
        costMultiplier: new Decimal(1.5),
        getEffectValue: (level) => new Decimal(1).add(new Decimal(0.01).times(level)), // Example: 1% per level
        effect: (level, skillEffects) => { skillEffects.master2ClassProduction = skillEffects.master2ClassProduction.add(new Decimal(0.01).times(level)); }, // 1% de boost à la production des Classes par PP par niveau
        prerequisites: () => true
    },
    {
        id: 'doctorat',
        name: 'Doctorat',
        baseCost: new Decimal(1000),
        costMultiplier: new Decimal(1.5),
        getEffectValue: (level) => new Decimal(1).add(new Decimal(0.01).times(level)), // Example: 1% per level
        effect: (level, skillEffects) => {
            skillEffects.doctoratBPSBonus = skillEffects.doctoratBPSBonus.add(new Decimal(0.01).times(level)); // 1% de boost BP/s par niveau
            // skillEffects.doctoratMinClasses = level * 5; // This direct assignment is problematic, should be part of a calculation in core.js if needed
        },
        getMinClasses: (level) => level * 5, // Helper to get min classes based on level
        prerequisites: () => true // Example prerequisite, adjust as needed
    },
    {
        id: 'postDoctorat',
        name: 'Post-Doctorat',
        baseCost: new Decimal(10000),
        costMultiplier: new Decimal(1.5),
        getEffectValue: (level) => new Decimal(1).add(new Decimal(0.01).times(level)), // Example: 1% per level
        effect: (level, skillEffects) => { skillEffects.postDoctoratPAGain = skillEffects.postDoctoratPAGain.add(new Decimal(0.01).times(level)); }, // 1% de boost au gain de PA par Ascension par niveau
        prerequisites: () => true
    },
];

// --- Définitions des Quêtes ---
export const questsData = [ // Changed to array to match common usage in UI/logic
    {
        id: 'click_10',
        name: 'Premiers Clics',
        description: 'Cliquez 10 fois sur "Étudier sagement".',
        condition: (totalClicks) => totalClicks.gte(10),
        reward: { type: 'studiesSkillPoints', amount: new Decimal(1) },
        rewardText: '1 Point de Compétence Études',
        current: 0,
        unlocked: false,
        permanent: false,
    },
    {
        id: 'eleves_10',
        name: 'Petite Classe',
        description: 'Achetez 10 Élèves.',
        condition: (nombreEleves) => nombreEleves.gte(10),
        reward: { type: 'studiesSkillPoints', amount: new Decimal(1) },
        rewardText: '1 Point de Compétence Études',
        current: 0,
        unlocked: false,
        permanent: false,
    },
    {
        id: 'classes_1',
        name: 'Première Salle',
        description: 'Achetez 1 Salle de classe.',
        condition: (nombreClasses) => nombreClasses.gte(1),
        reward: { type: 'studiesSkillPoints', amount: new Decimal(1) },
        rewardText: '1 Point de Compétence Études',
        current: 0,
        unlocked: false,
        permanent: false,
    },
    {
        id: 'professeur_1',
        name: 'Le Mentor',
        description: 'Achetez 1 Professeur.',
        condition: (nombreProfesseur) => nombreProfesseur.gte(1),
        reward: { type: 'ascensionSkillPoints', amount: new Decimal(1) },
        rewardText: '1 Point de Compétence Ascension',
        current: 0,
        unlocked: false,
        permanent: true,
    },
    {
        id: 'ascension_1',
        name: 'Renaissance Académique',
        description: 'Effectuez votre première Ascension.',
        condition: (ascensionCount) => ascensionCount.gte(1),
        reward: { type: 'prestigeSkillPoints', amount: new Decimal(1) },
        rewardText: '1 Point de Compétence Prestige',
        current: 0,
        unlocked: false,
        permanent: true,
    },
    {
        id: 'total_pa_100',
        name: 'Richesse Académique',
        description: 'Gagnez un total de 100 PA.',
        condition: (totalPAEarned) => totalPAEarned.gte(100),
        reward: { type: 'paMultiplier', amount: new Decimal(0.1) }, // 10% de boost aux gains de PA
        rewardText: '+10% au gain de PA',
        current: 0,
        unlocked: false,
        permanent: true,
    },
    {
        id: 'prestige_1',
        name: 'Le Savoir Ultime',
        description: 'Effectuez votre premier Prestige.',
        condition: (prestigeCount) => prestigeCount.gte(1),
        reward: { type: 'ppMultiplier', amount: new Decimal(0.1) }, // 10% de boost aux gains de PP
        rewardText: '+10% au gain de PP',
        current: 0,
        unlocked: false,
        permanent: true,
    },
];

// --- Seuils de Bons Points pour les Points de Compétence d'Études ---
export const bonusPointThresholds = [
    new Decimal(100), new Decimal(1000), new Decimal(10000), new Decimal(100000), new Decimal(1e6),
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
    new Decimal(1e97), new Decimal(1e98), new Decimal(1e99), new Decimal(1e100)
];

// --- Valeur de Base pour le Calcul des PA ---
export const prime_PA = new Decimal(2);

// --- Seuil de Bons Points Total pour gagner 1 Point d'Ascension ---
export const ASCENSION_POINT_THRESHOLD = new Decimal("1e10");

// --- Seuil de Points d'Ascension Total pour gagner 1 Point de Prestige ---
export const PRESTIGE_POINT_THRESHOLD = new Decimal("1000"); // Valeur par défaut, ajustez si nécessaire
