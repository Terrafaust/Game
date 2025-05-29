// Fiche Mémo : data.js
// Description : Ce fichier centralise toutes les données statiques et de configuration du jeu.
// Cela inclut les coûts de base des améliorations, les productions de base,
// les définitions complètes des compétences (études, ascension, prestige),
// les définitions des achats de prestige, les définitions des quêtes,
// et d'autres seuils ou valeurs constantes.
// Ce fichier n'effectue aucune logique de jeu ni de modification d'état,
// il fournit simplement les données brutes que d'autres modules (comme core.js, studies.js, skills.js)
// utiliseront pour leurs calculs et leur logique.

// Dépendances :
// - break_infinity.min.js : La bibliothèque `Decimal` est supposée être globalement disponible
//                           pour la gestion des grands nombres.
//                           Les valeurs numériques sont converties en objets Decimal ici.

// Variables Clés Définies et Exportées :
// - initialCosts : Coûts de base des éléments achetables.
// - baseProductions : Productions de base par élément.
// - skillsData : Définitions complètes de tous les arbres de compétences.
// - prestigePurchasesData : Définitions des améliorations de prestige.
// - questsData : Définitions de toutes les quêtes.
// - bonusPointThresholds : Seuils de Bons Points pour gagner des points de compétence d'études.
// - prime_PA : Valeur de base pour le calcul des Points d'Ascension.
// - calculateNextImageCost : Fonction pour calculer le coût de la prochaine image.
// - calculateAutomationCost : Fonction pour calculer le coût de la prochaine automatisation.

// --- Coûts Initiaux de Base ---
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
export const baseProductions = {
    eleveBps: new Decimal(0.1),
    classeBps: new Decimal(1),
    imageBpsMultiplier: new Decimal(0.01), // Multiplicateur pour la production totale de BP/s par image
    ProfesseurClassMultiplier: new Decimal(0.1), // Multiplicateur pour la production des classes par professeur
};

// --- Fonctions de Calcul de Coût (ajoutées pour résoudre les erreurs d'import) ---

/**
 * Calcule le coût de la prochaine image à acheter.
 * @param {Decimal} currentImages - Le nombre actuel d'images possédées.
 * @returns {Decimal} Le coût de la prochaine image.
 */
export function calculateNextImageCost(currentImages) {
    // Exemple de logique de coût : coût de base * (multiplicateur de coût ^ nombre actuel)
    // Vous devrez ajuster cette logique pour correspondre à votre jeu.
    const baseCost = initialCosts.image;
    const costMultiplier = new Decimal(1.15); // Exemple de multiplicateur de coût
    return baseCost.times(costMultiplier.pow(currentImages));
}

/**
 * Calcule le coût de la prochaine amélioration d'automatisation.
 * @param {Decimal} currentAutomationLevel - Le niveau actuel de l'automatisation.
 * @returns {Decimal} Le coût de la prochaine amélioration d'automatisation.
 */
export function calculateAutomationCost(currentAutomationLevel) {
    // Exemple de logique de coût : coût de base * (multiplicateur de coût ^ niveau actuel)
    // Vous devrez ajuster cette logique pour correspondre à votre jeu.
    // Pour l'exemple, nous allons utiliser un coût de base pour l'automatisation.
    // Si l'automatisation a des types différents (eleve, classe, image, professeur),
    // vous devrez passer le type en argument pour calculer le coût spécifique.
    const baseCost = new Decimal(10000); // Coût de base arbitraire pour l'automatisation
    const costMultiplier = new Decimal(1.5); // Exemple de multiplicateur de coût
    return baseCost.times(costMultiplier.pow(currentAutomationLevel));
}


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
export const prestigePurchasesData = {
    licence: {
        id: 'licence',
        name: 'Licence',
        baseCost: new Decimal(100),
        costMultiplier: new Decimal(1.5),
        effect: (level, skillEffects) => { skillEffects.licenceProfMultiplier = skillEffects.licenceProfMultiplier.add(new Decimal(0.01).times(level)); } // 1% de boost au multiplicateur Professeur par niveau
    },
    master1: {
        id: 'master1',
        name: 'Master I',
        baseCost: new Decimal(200),
        costMultiplier: new Decimal(1.5),
        effect: (level, skillEffects) => { skillEffects.master1ClassProduction = skillEffects.master1ClassProduction.add(new Decimal(0.01).times(level)); } // 1% de boost à la production des Classes par Prof par niveau
    },
    master2: {
        id: 'master2',
        name: 'Master II',
        baseCost: new Decimal(1000),
        costMultiplier: new Decimal(1.5),
        effect: (level, skillEffects) => { skillEffects.master2ClassProduction = skillEffects.master2ClassProduction.add(new Decimal(0.01).times(level)); } // 1% de boost à la production des Classes par PP par niveau
    },
    doctorat: {
        id: 'doctorat',
        name: 'Doctorat',
        baseCost: new Decimal(1000),
        costMultiplier: new Decimal(1.5),
        effect: (level, skillEffects) => {
            skillEffects.doctoratBPSBonus = skillEffects.doctoratBPSBonus.add(new Decimal(0.01).times(level)); // 1% de boost BP/s par niveau
            skillEffects.doctoratMinClasses = level * 5; // 5 classes min après Ascension par niveau
        }
    },
    postDoctorat: {
        id: 'postDoctorat',
        name: 'Post-Doctorat',
        baseCost: new Decimal(10000),
        costMultiplier: new Decimal(1.5),
        effect: (level, skillEffects) => { skillEffects.postDoctoratPAGain = skillEffects.postDoctoratPAGain.add(new Decimal(0.01).times(level)); } // 1% de boost au gain de PA par Ascension par niveau
    },
};

// --- Définitions des Quêtes ---
export const questsData = {
    'click_10': {
        id: 'click_10',
        name: 'Premiers Clics',
        description: 'Cliquez 10 fois sur "Étudier sagement".',
        condition: (totalClicks) => totalClicks.gte(10),
        reward: { type: 'studiesSkillPoints', amount: new Decimal(1) },
        rewardText: '1 Point de Compétence Études',
        current: 0, // Suivi de la progression (non sauvegardé si non permanent)
        unlocked: false, // État de déverrouillage
        permanent: false, // Si la quête est permanente (ne se réinitialise pas à l'Ascension)
    },
    'eleves_10': {
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
    'classes_1': {
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
    'professeur_1': {
        id: 'professeur_1',
        name: 'Le Mentor',
        description: 'Achetez 1 Professeur.',
        condition: (nombreProfesseur) => nombreProfesseur.gte(1),
        reward: { type: 'ascensionSkillPoints', amount: new Decimal(1) },
        rewardText: '1 Point de Compétence Ascension',
        current: 0,
        unlocked: false,
        permanent: true, // Cette quête est permanente
    },
    'ascension_1': {
        id: 'ascension_1',
        name: 'Renaissance Académique',
        description: 'Effectuez votre première Ascension.',
        condition: (ascensionCount) => ascensionCount.gte(1),
        reward: { type: 'prestigeSkillPoints', amount: new Decimal(1) },
        rewardText: '1 Point de Compétence Prestige',
        current: 0,
        unlocked: false,
        permanent: true, // Cette quête est permanente
    },
    'total_pa_100': {
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
    'prestige_1': {
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
};

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
