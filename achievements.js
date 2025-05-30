// ------------------ Fiche Mémo : achievements.js ----------------------------
//
// Description : Ce fichier est dédié à la gestion complète du système de succès (Achievements)
// du jeu. Il définit les succès, leurs conditions de déverrouillage, les récompenses associées,
// et gère l'affichage de la grille des succès ainsi que les infobulles détaillées.
// Son rôle est d'encourager la progression du joueur en lui offrant des objectifs
// et des bonus permanents.
//
// Objectif : Fournir une interface et une logique robustes pour les succès,
// en intégrant leurs effets dans l'économie et la progression globale du jeu.
//
// ------------------ Variables Clés Définies et Exportées ------------------
//
// export const achievementsData;              // Tableau contenant la définition de tous les succès.
//                                            // Chaque succès est un objet avec :
//                                            // - id (string) : Identifiant unique du succès.
//                                            // - name (string) : Nom affiché du succès.
//                                            // - description (string) : Description de la condition du succès.
//                                            // - condition (function) : Fonction qui retourne true si le succès est débloqué.
//                                            // - rewardText (string) : Texte descriptif de la récompense.
//                                            // - rewardFn (function) : Fonction exécutée lors du déverrouillage du succès
//                                            //   pour appliquer la récompense (permanente ou additive).
//
// export let unlockedAchievements;           // Objet { achievementId: true } pour suivre les succès déjà débloqués.
//                                            // Persiste à travers les sauvegardes.
//
// export let permanentBpsBonusFromAchievements; // Decimal : Bonus cumulé à la production de BP/s
//                                            // provenant des récompenses de succès permanents.
//                                            // Persiste à travers les sauvegardes et est appliqué via `skillEffects`.
//
// export let activeAchievementTooltip;       // Référence à l'élément DOM de l'infobulle actuellement "cliquée"
//                                            // (pour gérer la persistance de l'infobulle au clic).
//
// ------------------ Fonctions Clés Définies et Exportées ------------------
//
// export function renderAchievements();
//   // Met à jour l'affichage de la grille des succès dans l'interface utilisateur.
//   // Parcourt `achievementsData` et crée/met à jour les éléments HTML correspondants,
//   // en appliquant les classes 'unlocked' ou 'locked' et en attachant les écouteurs d'événements.
//   // Appelée par `checkAchievements` et `ui.js` (lors de l'ouverture de l'onglet).
//
// export function checkAchievements();
//   // Vérifie les conditions de déverrouillage de tous les succès non encore débloqués.
//   // Si un succès est débloqué, il est marqué comme tel dans `unlockedAchievements`,
//   // sa `rewardFn` est exécutée, une notification est affichée, et l'affichage est mis à jour.
//   // Appelée fréquemment par la boucle de jeu principale dans `core.js`.
//
// export function showAchievementTooltip(event, ach);
//   // Affiche l'infobulle détaillée d'un succès au survol de la souris.
//   // Positionne l'infobulle près du curseur et la rend visible.
//   // Ne l'affiche pas si une infobulle est déjà "cliquée".
//   // Appelée par `events.js` (via délégation sur `achievementsGrid`).
//
// export function hideAchievementTooltip();
//   // Cache l'infobulle détaillée d'un succès.
//   // Ne la cache pas si une infobulle est actuellement "cliquée".
//   // Appelée par `events.js` (via délégation sur `achievementsGrid`).
//
// export function toggleAchievementTooltip(event, ach);
//   // Bascule la visibilité de l'infobulle d'un succès au clic.
//   // Si l'infobulle est déjà affichée et "cliquée" pour le même succès, elle la cache.
//   // Si une autre infobulle était "cliquée", elle la cache avant d'afficher la nouvelle.
//   // Marque l'infobulle comme "cliquée" pour la maintenir visible après le mouseout.
//   // Appelée par `events.js` (via délégation sur `achievementsGrid`).
//
// ------------------ Interactions avec d'autres Modules ------------------
//
// Dépendances (Imports) :
// - De './core.js' :
//   - Variables d'état (lecture pour les conditions et modification pour les récompenses additives) :
//     `bonsPoints`, `images`, `nombreEleves`, `nombreClasses`, `nombreProfesseur`, `schoolCount`,
//     `nombreLycees`, `nombreColleges`, `ascensionCount`, `totalClicks`, `totalPAEarned`,
//     `nombreLicences`, `nombreMaster1`, `nombreMaster2`, `nombreDoctorat`, `nombrePostDoctorat`,
//     `prestigeCount`, `prestigePoints`, `autoEleveActive`, `autoClasseActive`, `autoImageActive`,
//     `autoProfesseurActive`, `studiesSkillLevels`, `ascensionSkillLevels`, `prestigeSkillLevels`,
//     `totalBonsPointsParSeconde`, `completedQuests`, `ascensionPoints` (pour récompenses additives). (maj 30/05 achievements)
//   - Objets d'effets (modification pour les récompenses permanentes) : `skillEffects`.
//   - Fonctions de logique (appelées après déverrouillage) : `saveGameState`, `applyAllSkillEffects`,
//     `checkUnlockConditions`, `formatNumber`.
// - De './ui.js' :
//   - Fonctions d'affichage : `showNotification`, `updateDisplay`.
// - De './quests.js' : (maj 30/05 achievements)
//   - Variables d'état : `questsData` (nécessaire pour la condition `ACH_QUESTS_ALL`). (maj 30/05 achievements)
//
// Variables Globales Accédées (définies dans core.js, mais non importées directement car elles sont gérées par `window` ou via des fonctions de `ui.js`) :
// - `window.achievementsButtonUnlocked` : Utilisé pour vérifier si le bouton des succès est débloqué avant de rendre la grille.
//
// DOM (Elements HTML) :
// - `#achievementsGrid` : Conteneur principal pour l'affichage des succès.
//   - Les événements `mouseover`, `mouseout`, `click` sont attachés à ce conteneur
//     dans `events.js` via délégation pour gérer les infobulles.
// - `#achievementTooltip` : Élément HTML utilisé pour afficher l'infobulle détaillée d'un succès.
//
// ------------------ Flux de Données et Logique ------------------
//
// 1. Définition des Succès : `achievementsData` contient toutes les informations statiques.
// 2. Vérification : `checkAchievements()` est appelée régulièrement par `core.js`.
//    Elle évalue la `condition()` de chaque succès non débloqué en lisant l'état du jeu (variables importées de `core.js` et `quests.js`). (maj 30/05 achievements)
// 3. Déverrouillage : Si une condition est remplie, le succès est marqué dans `unlockedAchievements`.
// 4. Récompense : La `rewardFn()` du succès est exécutée.
//    - Pour les bonus permanents (multiplicateurs, réductions de coût), elle modifie des propriétés de l'objet `skillEffects`.
//      ou la variable `permanentBpsBonusFromAchievements`. Ces variables sont ensuite utilisées par `core.js`
//      dans ses calculs de production (`calculateTotalBPS`) et d'effets (`applyAllSkillEffects`).
//    - Pour les gains additifs (ex: +X PA), elle modifie directement la variable de ressource correspondante dans `core.js`
//      (ex: `ascensionPoints = ascensionPoints.add(X)`). La `rewardFn` doit retourner la nouvelle valeur pour que `achievements.js`
//      puisse la réassigner à la variable globale dans `core.js` via l'importation. (maj 30/05 achievements)
// 5. Mise à Jour UI : `renderAchievements()` est appelée pour rafraîchir l'affichage des succès.
//    `showNotification()` est appelée pour informer le joueur.
//    `updateDisplay()` de `ui.js` est appelée pour rafraîchir l'ensemble de l'interface.
//    `saveGameState()` de `core.js` est appelée pour persister les changements.
// 6. Infobulles : `showAchievementTooltip`, `hideAchievementTooltip`, `toggleAchievementTooltip`
//    gèrent l'affichage dynamique des détails des succès au survol ou au clic, en utilisant
//    l'élément `#achievementTooltip`.
//
// ---------------------------------------------------------------------
// Importations nécessaires
import {
    bonsPoints, images, nombreEleves, nombreClasses, nombreProfesseur, schoolCount,
    nombreLycees, nombreColleges, ascensionCount, totalClicks, autoEleveActive,
    autoClasseActive, autoImageActive, autoProfesseurActive, totalPAEarned,
    nombreLicences, nombreMaster1, nombreMaster2, nombreDoctorat, nombrePostDoctorat,
    prestigeCount, prestigePoints, skillEffects, studiesSkillLevels, ascensionSkillLevels,
    prestigeSkillLevels, totalBonsPointsParSeconde, completedQuests,
    saveGameState, applyAllSkillEffects, checkUnlockConditions, formatNumber,
    ascensionPoints // Importation de ascensionPoints pour les récompenses additives (maj 30/05 achievements)
} from './core.js';
import { showNotification, updateDisplay } from './ui.js';
import { questsData } from './quests.js'; // Importation de questsData pour la condition ACH_QUESTS_ALL (maj 30/05 achievements)

// --- Données des Succès ---
export const achievementsData = [
    // Bons Points Achievements
    {
        id: 'ACH_BP_1',
        name: 'Le Premier Pas',
        description: 'Atteindre 1 Bon Point.',
        condition: () => bonsPoints.gte(1),
        rewardText: '+0.1% BP/s',
        rewardFn: () => { permanentBpsBonusFromAchievements = permanentBpsBonusFromAchievements.add(0.001); }
    },
    {
        id: 'ACH_BP_1K',
        name: 'Mille Points',
        description: 'Atteindre 1 000 Bons Points.',
        condition: () => bonsPoints.gte('1e3'),
        rewardText: '+1% BP/s',
        rewardFn: () => { permanentBpsBonusFromAchievements = permanentBpsBonusFromAchievements.add(0.01); }
    },
    {
        id: 'ACH_BP_10K',
        name: 'Dix Mille Points',
        description: 'Atteindre 10 000 Bons Points.',
        condition: () => bonsPoints.gte('1e4'),
        rewardText: '+1.5% BP/s',
        rewardFn: () => { permanentBpsBonusFromAchievements = permanentBpsBonusFromAchievements.add(0.015); }
    },
    {
        id: 'ACH_BP_1M',
        name: 'Millionnaire en BP',
        description: 'Atteindre 1 Million de Bons Points.',
        condition: () => bonsPoints.gte('1e6'),
        rewardText: '+2% BP/s',
        rewardFn: () => { permanentBpsBonusFromAchievements = permanentBpsBonusFromAchievements.add(0.02); }
    },
    {
        id: 'ACH_BP_1B',
        name: 'Milliardaire en BP',
        description: 'Atteindre 1 Milliard de Bons Points.',
        condition: () => bonsPoints.gte('1e9'),
        rewardText: '+3% BP/s',
        rewardFn: () => { permanentBpsBonusFromAchievements = permanentBpsBonusFromAchievements.add(0.03); }
    },
    {
        id: 'ACH_BP_1T',
        name: 'Trillionnaire en BP',
        description: 'Atteindre 1 Trillion de Bons Points.',
        condition: () => bonsPoints.gte('1e12'),
        rewardText: '+5% BP/s',
        rewardFn: () => { permanentBpsBonusFromAchievements = permanentBpsBonusFromAchievements.add(0.05); }
    },
    {
        id: 'ACH_BP_1Qa',
        name: 'Quadrillionnaire en BP',
        description: 'Atteindre 1 Quadrillion de Bons Points.',
        condition: () => bonsPoints.gte('1e15'),
        rewardText: '+10% BP/s',
        rewardFn: () => { permanentBpsBonusFromAchievements = permanentBpsBonusFromAchievements.add(0.10); }
    },
    {
        id: 'ACH_BP_1Sx',
        name: 'Sextillionnaire en BP',
        description: 'Atteindre 1 Sextillion de Bons Points.',
        condition: () => bonsPoints.gte('1e21'),
        rewardText: '+20% BP/s',
        rewardFn: () => { permanentBpsBonusFromAchievements = permanentBpsBonusFromAchievements.add(0.20); }
    },
    {
        id: 'ACH_BP_1Oc',
        name: 'Octillionnaire en BP',
        description: 'Atteindre 1 Octillion de Bons Points.',
        condition: () => bonsPoints.gte('1e50'),
        rewardText: '+50% BP/s',
        rewardFn: () => { permanentBpsBonusFromAchievements = permanentBpsBonusFromAchievements.add(0.50); }
    },
    {
        id: 'ACH_BP_1Googol',
        name: 'Googol de BP',
        description: 'Atteindre 1e100 Bons Points.',
        condition: () => bonsPoints.gte('1e100'),
        rewardText: '+100% BP/s',
        rewardFn: () => { permanentBpsBonusFromAchievements = permanentBpsBonusFromAchievements.add(1); }
    },
    {
        id: 'ACH_BP_1Googolplex',
        name: 'Googolplex de BP',
        description: 'Atteindre 1e10000 Bons Points.',
        condition: () => bonsPoints.gte('1e10000'),
        rewardText: '+200% BP/s',
        rewardFn: () => { permanentBpsBonusFromAchievements = permanentBpsBonusFromAchievements.add(2); }
    },

    // Eleves Achievements
    {
        id: 'ACH_ELEVES_1',
        name: 'L\'Apprenti',
        description: 'Avoir 1 Élève.',
        condition: () => nombreEleves.gte(1),
        rewardText: 'Coût des élèves -0.1%',
        rewardFn: () => { skillEffects.eleveCostReduction = skillEffects.eleveCostReduction.add(0.001); }
    },
    {
        id: 'ACH_ELEVES_10',
        name: 'La Classe',
        description: 'Avoir 10 Élèves.',
        condition: () => nombreEleves.gte(10),
        rewardText: 'Coût des élèves -0.5%',
        rewardFn: () => { skillEffects.eleveCostReduction = skillEffects.eleveCostReduction.add(0.005); }
    },
    {
        id: 'ACH_ELEVES_100',
        name: 'Centurie d\'Élèves',
        description: 'Avoir 100 Élèves.',
        condition: () => nombreEleves.gte(100),
        rewardText: 'Coût des élèves -1%',
        rewardFn: () => { skillEffects.eleveCostReduction = skillEffects.eleveCostReduction.add(0.01); }
    },
    {
        id: 'ACH_ELEVES_1K',
        name: 'Mille Élèves',
        description: 'Avoir 1 000 Élèves.',
        condition: () => nombreEleves.gte(1000),
        rewardText: 'Coût des élèves -2%',
        rewardFn: () => { skillEffects.eleveCostReduction = skillEffects.eleveCostReduction.add(0.02); }
    },
    {
        id: 'ACH_ELEVES_10K',
        name: 'Dix Mille Élèves',
        description: 'Avoir 10 000 Élèves.',
        condition: () => nombreEleves.gte('1e4'),
        rewardText: 'Coût des élèves -3%',
        rewardFn: () => { skillEffects.eleveCostReduction = skillEffects.eleveCostReduction.add(0.03); }
    },
    {
        id: 'ACH_ELEVES_1M',
        name: 'Million d\'Élèves',
        description: 'Avoir 1 Million d\'Élèves.',
        condition: () => nombreEleves.gte('1e6'),
        rewardText: 'Coût des élèves -5%',
        rewardFn: () => { skillEffects.eleveCostReduction = skillEffects.eleveCostReduction.add(0.05); }
    },
    {
        id: 'ACH_ELEVES_1T',
        name: 'Trillion d\'Élèves',
        description: 'Avoir 1 Trillion d\'Élèves.',
        condition: () => nombreEleves.gte('1e12'),
        rewardText: 'Coût des élèves -10%',
        rewardFn: () => { skillEffects.eleveCostReduction = skillEffects.eleveCostReduction.add(0.10); }
    },

    // Images Achievements
    {
        id: 'ACH_IMAGES_1',
        name: 'Première Image',
        description: 'Posséder 1 Image.',
        condition: () => images.gte(1),
        rewardText: 'Coût des images -0.1%',
        rewardFn: () => { skillEffects.imageCostReduction = skillEffects.imageCostReduction.add(0.001); }
    },
    {
        id: 'ACH_IMAGES_10',
        name: 'Collectionneur d\'Images',
        description: 'Posséder 10 Images.',
        condition: () => images.gte(10),
        rewardText: 'Coût des images -1%',
        rewardFn: () => { skillEffects.imageCostReduction = skillEffects.imageCostReduction.add(0.01); }
    },
    {
        id: 'ACH_IMAGES_100',
        name: 'Album Photo',
        description: 'Posséder 100 Images.',
        condition: () => images.gte(100),
        rewardText: 'Coût des images -1.5%',
        rewardFn: () => { skillEffects.imageCostReduction = skillEffects.imageCostReduction.add(0.015); }
    },
    {
        id: 'ACH_IMAGES_1K',
        name: 'Galerie d\'Images',
        description: 'Posséder 1 000 Images.',
        condition: () => images.gte(1000),
        rewardText: 'Coût des images -2%',
        rewardFn: () => { skillEffects.imageCostReduction = skillEffects.imageCostReduction.add(0.02); }
    },
    {
        id: 'ACH_IMAGES_1M',
        name: 'Musée d\'Images',
        description: 'Posséder 1 Million d\'Images.',
        condition: () => images.gte('1e6'),
        rewardText: 'Coût des images -5%',
        rewardFn: () => { skillEffects.imageCostReduction = skillEffects.imageCostReduction.add(0.05); }
    },

    // Classes Achievements
    {
        id: 'ACH_CLASSES_1',
        name: 'Première Salle',
        description: 'Avoir 1 Salle de classe.',
        condition: () => nombreClasses.gte(1),
        rewardText: 'Coût des classes -0.1%',
        rewardFn: () => { skillEffects.classeCostReduction = skillEffects.classeCostReduction.add(0.001); }
    },
    {
        id: 'ACH_CLASSES_5',
        name: 'Petite École',
        description: 'Avoir 5 Salles de classe.',
        condition: () => nombreClasses.gte(5),
        rewardText: 'Coût des classes -0.5%',
        rewardFn: () => { skillEffects.classeCostReduction = skillEffects.classeCostReduction.add(0.005); }
    },
    {
        id: 'ACH_CLASSES_10',
        name: 'Petit Campus',
        description: 'Avoir 10 Salles de classe.',
        condition: () => nombreClasses.gte(10),
        rewardText: 'Coût des classes -1%',
        rewardFn: () => { skillEffects.classeCostReduction = skillEffects.classeCostReduction.add(0.01); }
    },
    {
        id: 'ACH_CLASSES_100',
        name: 'Grand Campus',
        description: 'Avoir 100 Salles de classe.',
        condition: () => nombreClasses.gte(100),
        rewardText: 'Coût des classes -2%',
        rewardFn: () => { skillEffects.classeCostReduction = skillEffects.classeCostReduction.add(0.02); }
    },
    {
        id: 'ACH_CLASSES_1K',
        name: 'Université',
        description: 'Avoir 1 000 Salles de classe.',
        condition: () => nombreClasses.gte(1000),
        rewardText: 'Coût des classes -5%',
        rewardFn: () => { skillEffects.classeCostReduction = skillEffects.classeCostReduction.add(0.05); }
    },

    // Professeur Achievements
    {
        id: 'ACH_PROFS_1',
        name: 'Premier Professeur',
        description: 'Avoir 1 Professeur.',
        condition: () => nombreProfesseur.gte(1),
        rewardText: 'Coût des Professeurs -0.1%',
        rewardFn: () => { skillEffects.ProfesseurCostReduction = skillEffects.ProfesseurCostReduction.add(0.001); }
    },
    {
        id: 'ACH_PROFS_5',
        name: 'Conseil Pédagogique',
        description: 'Avoir 5 Professeurs.',
        condition: () => nombreProfesseur.gte(5),
        rewardText: 'Coût des Professeurs -1%',
        rewardFn: () => { skillEffects.ProfesseurCostReduction = skillEffects.ProfesseurCostReduction.add(0.01); }
    },
    {
        id: 'ACH_PROFS_10',
        name: 'Corps Enseignant',
        description: 'Avoir 10 Professeurs.',
        condition: () => nombreProfesseur.gte(10),
        rewardText: 'Coût des Professeurs -2%',
        rewardFn: () => { skillEffects.ProfesseurCostReduction = skillEffects.ProfesseurCostReduction.add(0.02); }
    },
    {
        id: 'ACH_PROFS_20',
        name: 'Académie',
        description: 'Avoir 20 Professeurs.',
        condition: () => nombreProfesseur.gte(20),
        rewardText: 'Coût des Professeurs -5%',
        rewardFn: () => { skillEffects.ProfesseurCostReduction = skillEffects.ProfesseurCostReduction.add(0.05); }
    },
    {
        id: 'ACH_PROFS_50',
        name: 'Doyen de l\'Université',
        description: 'Avoir 50 Professeurs.',
        condition: () => nombreProfesseur.gte(50),
        rewardText: '+10% BP/s des Professeurs',
        rewardFn: () => { skillEffects.ProfesseurBpsMultiplier = skillEffects.ProfesseurBpsMultiplier.times(1.1); }
    },

    // Ecole Achievements
    {
        id: 'ACH_ECOLE_1',
        name: 'Première École',
        description: 'Acheter 1 École.',
        condition: () => schoolCount.gte(1),
        rewardText: '+0.1% PA/s',
        rewardFn: () => { permanentBpsBonusFromAchievements = permanentBpsBonusFromAchievements.add(0.001); }
    },
    {
        id: 'ACH_ECOLE_3',
        name: 'Groupe Scolaire',
        description: 'Acheter 3 Écoles.',
        condition: () => schoolCount.gte(3),
        rewardText: '+0.5% PA/s',
        rewardFn: () => { permanentBpsBonusFromAchievements = permanentBpsBonusFromAchievements.add(0.005); }
    },
    {
        id: 'ACH_ECOLE_5',
        name: 'Réseau Scolaire',
        description: 'Acheter 5 Écoles.',
        condition: () => schoolCount.gte(5),
        rewardText: '+1% PA/s',
        rewardFn: () => { permanentBpsBonusFromAchievements = permanentBpsBonusFromAchievements.add(0.01); }
    },
    {
        id: 'ACH_ECOLE_10',
        name: 'District Éducatif',
        description: 'Acheter 10 Écoles.',
        condition: () => schoolCount.gte(10),
        rewardText: '+2% PA/s',
        rewardFn: () => { permanentBpsBonusFromAchievements = permanentBpsBonusFromAchievements.add(0.02); }
    },

    // Lycee Achievements
    {
        id: 'ACH_LYCEE_1',
        name: 'Premier Lycée',
        description: 'Acheter 1 Lycée.',
        condition: () => nombreLycees.gte(1),
        rewardText: '+0.1% PA/s',
        rewardFn: () => { permanentBpsBonusFromAchievements = permanentBpsBonusFromAchievements.add(0.001); }
    },
    {
        id: 'ACH_LYCEE_3',
        name: 'Chaîne de Lycées',
        description: 'Acheter 3 Lycées.',
        condition: () => nombreLycees.gte(3),
        rewardText: '+1% PA/s',
        rewardFn: () => { permanentBpsBonusFromAchievements = permanentBpsBonusFromAchievements.add(0.01); }
    },
    {
        id: 'ACH_LYCEE_5',
        name: 'Réseau Lycéen',
        description: 'Acheter 5 Lycées.',
        condition: () => nombreLycees.gte(5),
        rewardText: '+1.5% PA/s',
        rewardFn: () => { permanentBpsBonusFromAchievements = permanentBpsBonusFromAchievements.add(0.015); }
    },

    // College Achievements
    {
        id: 'ACH_COLLEGE_1',
        name: 'Premier Collège',
        description: 'Acheter 1 Collège.',
        condition: () => nombreColleges.gte(1),
        rewardText: '+0.5% PA/s',
        rewardFn: () => { permanentBpsBonusFromAchievements = permanentBpsBonusFromAchievements.add(0.005); }
    },
    {
        id: 'ACH_COLLEGE_2',
        name: 'Réseau de Collèges',
        description: 'Acheter 2 Collèges.',
        condition: () => nombreColleges.gte(2),
        rewardText: '+1% PA/s',
        rewardFn: () => { permanentBpsBonusFromAchievements = permanentBpsBonusFromAchievements.add(0.01); }
    },
    {
        id: 'ACH_COLLEGE_3',
        name: 'Grand Collège',
        description: 'Acheter 3 Collèges.',
        condition: () => nombreColleges.gte(3),
        rewardText: '+1.5% PA/s',
        rewardFn: () => { permanentBpsBonusFromAchievements = permanentBpsBonusFromAchievements.add(0.015); }
    },

    // Ascension Achievements (Additive)
    {
        id: 'ACH_ASCEND_1',
        name: 'Première Ascension',
        description: 'Effectuer votre première Ascension.',
        condition: () => ascensionCount.gte(1),
        rewardText: '+5 PA uniques',
        rewardFn: () => { return ascensionPoints.add(5); } // (maj 30/05 achievements)
    },
    {
        id: 'ACH_ASCEND_2',
        name: 'Deuxième Ascension',
        description: 'Effectuer 2 Ascensions.',
        condition: () => ascensionCount.gte(2),
        rewardText: '+10 PA uniques',
        rewardFn: () => { return ascensionPoints.add(10); } // (maj 30/05 achievements)
    },
    {
        id: 'ACH_ASCEND_5',
        name: 'Ascension Maître',
        description: 'Effectuer 5 Ascensions.',
        condition: () => ascensionCount.gte(5),
        rewardText: '+25 PA uniques',
        rewardFn: () => { return ascensionPoints.add(25); } // (maj 30/05 achievements)
    },
    {
        id: 'ACH_ASCEND_10',
        name: 'Ascension Légende',
        description: 'Effectuer 10 Ascensions.',
        condition: () => ascensionCount.gte(10),
        rewardText: '+50 PA uniques',
        rewardFn: () => { return ascensionPoints.add(50); } // (maj 30/05 achievements)
    },
    {
        id: 'ACH_ASCEND_25',
        name: 'Ascension Divine',
        description: 'Effectuer 25 Ascensions.',
        condition: () => ascensionCount.gte(25),
        rewardText: '+100 PA uniques',
        rewardFn: () => { return ascensionPoints.add(100); } // (maj 30/05 achievements)
    },
    {
        id: 'ACH_ASCEND_50',
        name: 'Ascension Ultime',
        description: 'Effectuer 50 Ascensions.',
        condition: () => ascensionCount.gte(50),
        rewardText: '+250 PA uniques',
        rewardFn: () => { return ascensionPoints.add(250); } // (maj 30/05 achievements)
    },
    {
        id: 'ACH_TOTAL_PA_100',
        name: 'Cent Points d\'Ascension',
        description: 'Accumuler un total de 100 Points d\'Ascension.',
        condition: () => totalPAEarned.gte(100),
        rewardText: '+1% gain de PA permanent',
        rewardFn: () => { skillEffects.paGainMultiplier = skillEffects.paGainMultiplier.times(1.01); }
    },
    {
        id: 'ACH_TOTAL_PA_1000',
        name: 'Mille Points d\'Ascension',
        description: 'Accumuler un total de 1 000 Points d\'Ascension.',
        condition: () => totalPAEarned.gte(1000),
        rewardText: '+2% gain de PA permanent',
        rewardFn: () => { skillEffects.paGainMultiplier = skillEffects.paGainMultiplier.times(1.02); }
    },

    // Automation Achievements
    {
        id: 'ACH_AUTO_ELEVE',
        name: 'Auto-Élève',
        description: 'Débloquer l\'automatisation des Élèves.',
        condition: () => autoEleveActive,
        rewardText: 'Coût des élèves -0.5%',
        rewardFn: () => { skillEffects.eleveCostReduction = skillEffects.eleveCostReduction.add(0.005); }
    },
    {
        id: 'ACH_AUTO_CLASSE',
        name: 'Auto-Classe',
        description: 'Débloquer l\'automatisation des Classes.',
        condition: () => autoClasseActive,
        rewardText: 'Coût des classes -0.5%',
        rewardFn: () => { skillEffects.classeCostReduction = skillEffects.classeCostReduction.add(0.005); }
    },
    {
        id: 'ACH_AUTO_IMAGE',
        name: 'Auto-Image',
        description: 'Débloquer l\'automatisation des Images.',
        condition: () => autoImageActive,
        rewardText: 'Coût des images -0.5%',
        rewardFn: () => { skillEffects.imageCostReduction = skillEffects.imageCostReduction.add(0.005); }
    },
    {
        id: 'ACH_AUTO_PROF',
        name: 'Auto-Professeur',
        description: 'Débloquer l\'automatisation des Professeurs.',
        condition: () => autoProfesseurActive,
        rewardText: 'Coût des Professeurs -0.5%',
        rewardFn: () => { skillEffects.ProfesseurCostReduction = skillEffects.ProfesseurCostReduction.add(0.005); }
    },
    {
        id: 'ACH_AUTO_ALL_ACTIVE',
        name: 'Maître de l\'Automatisation',
        description: 'Avoir toutes les automatisations actives simultanément.',
        condition: () => autoEleveActive && autoClasseActive && autoImageActive && autoProfesseurActive,
        rewardText: '+5% production globale',
        rewardFn: () => { skillEffects.allBpsMultiplier = skillEffects.allBpsMultiplier.times(1.05); }
    },

    // Click Achievements (Additive)
    {
        id: 'ACH_CLICK_1',
        name: 'Premier Clic',
        description: 'Cliquez 1 fois sur "Étudier sagement".',
        condition: () => totalClicks.gte(1),
        rewardText: '+0.1 BP par clic',
        rewardFn: () => { skillEffects.clickBonsPointsBonus = skillEffects.clickBonsPointsBonus.add(0.1); }
    },
    {
        id: 'ACH_CLICK_10',
        name: 'Dix Clics',
        description: 'Cliquez 10 fois sur "Étudier sagement".',
        condition: () => totalClicks.gte(10), // (maj 30/05 achievements)
        rewardText: '+0.5 BP par clic',
        rewardFn: () => { skillEffects.clickBonsPointsBonus = skillEffects.clickBonsPointsBonus.add(0.5); }
    },
    {
        id: 'ACH_CLICK_100',
        name: 'Cent Clics',
        description: 'Cliquez 100 fois sur "Étudier sagement".',
        condition: () => totalClicks.gte(100),
        rewardText: '+1 BP par clic',
        rewardFn: () => { skillEffects.clickBonsPointsBonus = skillEffects.clickBonsPointsBonus.add(1); }
    },
    {
        id: 'ACH_CLICK_200',
        name: 'Deux Cents Clics',
        description: 'Cliquez 200 fois sur "Étudier sagement".',
        condition: () => totalClicks.gte(200),
        rewardText: '+2 BP par clic',
        rewardFn: () => { skillEffects.clickBonsPointsBonus = skillEffects.clickBonsPointsBonus.add(2); }
    },
    {
        id: 'ACH_CLICK_500',
        name: 'Cinq Cents Clics',
        description: 'Cliquez 500 fois sur "Étudier sagement".',
        condition: () => totalClicks.gte(500),
        rewardText: '+5 BP par clic',
        rewardFn: () => { skillEffects.clickBonsPointsBonus = skillEffects.clickBonsPointsBonus.add(5); }
    },
    {
        id: 'ACH_CLICK_1K',
        name: 'Mille Clics',
        description: 'Cliquez 1 000 fois sur "Étudier sagement".',
        condition: () => totalClicks.gte(1000),
        rewardText: '+10 BP par clic',
        rewardFn: () => { skillEffects.clickBonsPointsBonus = skillEffects.clickBonsPointsBonus.add(10); }
    },
    {
        id: 'ACH_CLICK_10K',
        name: 'Dix Mille Clics',
        description: 'Cliquez 10 000 fois sur "Étudier sagement".',
        condition: () => totalClicks.gte(10000),
        rewardText: '+20 BP par clic',
        rewardFn: () => { skillEffects.clickBonsPointsBonus = skillEffects.clickBonsPointsBonus.add(20); }
    },

    // Prestige Purchase Achievements (NEW)
    {
        id: 'ACH_LICENCE_1',
        name: 'Licencié',
        description: 'Acheter 1 Licence.',
        condition: () => nombreLicences.gte(1),
        rewardText: '+0.1% Prof Multiplier',
        rewardFn: () => { skillEffects.licenceProfMultiplier = skillEffects.licenceProfMultiplier.add(0.001); }
    },
    {
        id: 'ACH_LICENCE_5',
        name: 'Multi-Licencié',
        description: 'Acheter 5 Licences.',
        condition: () => nombreLicences.gte(5),
        rewardText: '+0.5% Prof Multiplier',
        rewardFn: () => { skillEffects.licenceProfMultiplier = skillEffects.licenceProfMultiplier.add(0.005); }
    },
    {
        id: 'ACH_MASTER1_1',
        name: 'Maître I',
        description: 'Acheter 1 Master I.',
        condition: () => nombreMaster1.gte(1),
        rewardText: '+0.1% Classe Production',
        rewardFn: () => { skillEffects.master1ClassProduction = skillEffects.master1ClassProduction.add(0.001); }
    },
    {
        id: 'ACH_MASTER1_3',
        name: 'Expert Master I',
        description: 'Acheter 3 Master I.',
        condition: () => nombreMaster1.gte(3),
        rewardText: '+0.3% Classe Production',
        rewardFn: () => { skillEffects.master1ClassProduction = skillEffects.master1ClassProduction.add(0.003); }
    },
    {
        id: 'ACH_MASTER2_1',
        name: 'Maître II',
        description: 'Acheter 1 Master II.',
        condition: () => nombreMaster2.gte(1),
        rewardText: '+0.1% Classe Production',
        rewardFn: () => { skillEffects.master2ClassProduction = skillEffects.master2ClassProduction.add(0.001); }
    },
    {
        id: 'ACH_MASTER2_3',
        name: 'Expert Master II',
        description: 'Acheter 3 Master II.',
        condition: () => nombreMaster2.gte(3),
        rewardText: '+0.3% Classe Production',
        rewardFn: () => { skillEffects.master2ClassProduction = skillEffects.master2ClassProduction.add(0.003); }
    },
    {
        id: 'ACH_DOCTORAT_1',
        name: 'Docteur',
        description: 'Acheter 1 Doctorat.',
        condition: () => nombreDoctorat.gte(1),
        rewardText: '+0.1% BP/s',
        rewardFn: () => { skillEffects.doctoratBPSBonus = skillEffects.doctoratBPSBonus.add(0.001); }
    },
    {
        id: 'ACH_DOCTORAT_2',
        name: 'Super Docteur',
        description: 'Acheter 2 Doctorats.',
        condition: () => nombreDoctorat.gte(2),
        rewardText: '+0.2% BP/s',
        rewardFn: () => { skillEffects.doctoratBPSBonus = skillEffects.doctoratBPSBonus.add(0.002); }
    },
    {
        id: 'ACH_POSTDOCTORAT_1',
        name: 'Post-Docteur',
        description: 'Acheter 1 Post-Doctorat.',
        condition: () => nombrePostDoctorat.gte(1),
        rewardText: '+0.1% PA Gain',
        rewardFn: () => { skillEffects.postDoctoratPAGain = skillEffects.postDoctoratPAGain.add(0.001); }
    },
    {
        id: 'ACH_POSTDOCTORAT_2',
        name: 'Chercheur Émérite',
        description: 'Acheter 2 Post-Doctorats.',
        condition: () => nombrePostDoctorat.gte(2),
        rewardText: '+0.2% PA Gain',
        rewardFn: () => { skillEffects.postDoctoratPAGain = skillEffects.postDoctoratPAGain.add(0.002); }
    },

    // Total Production Achievements (NEW)
    {
        id: 'ACH_BPS_1K',
        name: 'Producteur Efficace',
        description: 'Atteindre 1 000 BP/s.',
        condition: () => totalBonsPointsParSeconde.gte('1e3'),
        rewardText: '+1% production globale',
        rewardFn: () => { skillEffects.allBpsMultiplier = skillEffects.allBpsMultiplier.times(1.01); }
    },
    {
        id: 'ACH_BPS_1M',
        name: 'Usine à Bons Points',
        description: 'Atteindre 1 Million BP/s.',
        condition: () => totalBonsPointsParSeconde.gte('1e6'),
        rewardText: '+2% production globale',
        rewardFn: () => { skillEffects.allBpsMultiplier = skillEffects.allBpsMultiplier.times(1.02); }
    },
    {
        id: 'ACH_BPS_1B',
        name: 'Économie Galactique',
        description: 'Atteindre 1 Milliard BP/s.',
        condition: () => totalBonsPointsParSeconde.gte('1e9'),
        rewardText: '+3% production globale',
        rewardFn: () => { skillEffects.allBpsMultiplier = skillEffects.allBpsMultiplier.times(1.03); }
    },

    // Quests Achievements (NEW)
    {
        id: 'ACH_QUESTS_1',
        name: 'Premier Aventurier',
        description: 'Terminer 1 quête.',
        condition: () => Object.keys(completedQuests).length >= 1,
        rewardText: '+1 point de compétence d\'études',
        rewardFn: () => { return studiesSkillPoints.add(1); } // (maj 30/05 achievements)
    },
    {
        id: 'ACH_QUESTS_5',
        name: 'Chasseur de Quêtes',
        description: 'Terminer 5 quêtes.',
        condition: () => Object.keys(completedQuests).length >= 5,
        rewardText: '+1 point de compétence d\'ascension',
        rewardFn: () => { return ascensionSkillPoints.add(1); } // (maj 30/05 achievements)
    },
    {
        id: 'ACH_QUESTS_ALL',
        name: 'Maître des Quêtes',
        description: 'Terminer toutes les quêtes disponibles.',
        condition: () => Object.keys(completedQuests).length === questsData.length, // (maj 30/05 achievements)
        rewardText: '+1 point de compétence de prestige',
        rewardFn: () => { return prestigeSkillPoints.add(1); } // (maj 30/05 achievements)
    },

    // Skill Achievements (NEW)
    {
        id: 'ACH_SKILL_STUDIES_10',
        name: 'Étudiant Assidu',
        description: 'Dépenser 10 points de compétence d\'études.',
        condition: () => Object.values(studiesSkillLevels).reduce((sum, level) => sum + level, 0) >= 10,
        rewardText: '+0.5% BP/s',
        rewardFn: () => { permanentBpsBonusFromAchievements = permanentBpsBonusFromAchievements.add(0.005); }
    },
    {
        id: 'ACH_SKILL_ASCENSION_5',
        name: 'Visionnaire',
        description: 'Dépenser 5 points de compétence d\'ascension.',
        condition: () => Object.values(ascensionSkillLevels).reduce((sum, level) => sum + level, 0) >= 5,
        rewardText: '+1% gain de PA',
        rewardFn: () => { skillEffects.paGainMultiplier = skillEffects.paGainMultiplier.times(1.01); }
    },
    {
        id: 'ACH_SKILL_PRESTIGE_3',
        name: 'Légende du Prestige',
        description: 'Dépenser 3 points de compétence de prestige.',
        condition: () => Object.values(prestigeSkillLevels).reduce((sum, level) => sum + level, 0) >= 3,
        rewardText: '+1% BP/s permanent',
        rewardFn: () => { permanentBpsBonusFromAchievements = permanentBpsBonusFromAchievements.add(0.01); }
    },
];

// --- Variables d'état des Succès ---
export let unlockedAchievements = {}; // Suivre les succès débloqués { achievementId: true }
export let permanentBpsBonusFromAchievements = new Decimal(0); // Bonus cumulé des succès sur la production de BP/s
export let activeAchievementTooltip = null; // Pour gérer l'infobulle de succès cliquée

// --- Fonctions de Gestion des Succès ---

/**
 * Met à jour l'affichage de la grille des succès.
 * Doit être appelée lorsque les succès sont débloqués ou que l'onglet est ouvert.
 */
export function renderAchievements() {
    const achievementsGrid = document.getElementById('achievementsGrid');
    // achievementsButtonUnlocked est une variable globale définie dans core.js
    // Pas besoin de window. pour les imports directs.
    const achievementsButtonUnlocked = typeof window.achievementsButtonUnlocked !== 'undefined' ? window.achievementsButtonUnlocked : false; // (maj 30/05 achievements)

    if (!achievementsGrid || !achievementsButtonUnlocked) return;
    achievementsGrid.innerHTML = ''; // Effacer la grille pour le re-rendu

    achievementsData.forEach(ach => {
        const achDiv = document.createElement('div');
        achDiv.classList.add('achievement-item');
        achDiv.dataset.achId = ach.id; // Ajouter un attribut de données pour la délégation

        const isUnlocked = unlockedAchievements[ach.id];
        if (isUnlocked) {
            achDiv.classList.add('unlocked');
        } else {
            achDiv.classList.add('locked');
        }

        achDiv.innerHTML = `
            <h4>${ach.name}</h4>
            <p>${ach.description}</p>
            <span class="reward">Récompense : ${ach.rewardText}</span>
        `;
        achievementsGrid.appendChild(achDiv);
    });
}

/**
 * Vérifie les conditions de tous les succès et débloque ceux qui sont remplis.
 * Applique les récompenses.
 */
export function checkAchievements() {
    let newAchievementUnlocked = false;

    achievementsData.forEach(ach => {
        const isUnlocked = unlockedAchievements[ach.id];
        let canUnlock = false; // (maj 30/05 achievements)

        // Gestion spécifique de la condition pour ACH_QUESTS_ALL (maj 30/05 achievements)
        if (ach.id === 'ACH_QUESTS_ALL') { // (maj 30/05 achievements)
            canUnlock = ach.condition(completedQuests, questsData); // (maj 30/05 achievements)
        } else { // (maj 30/05 achievements)
            canUnlock = ach.condition(); // (maj 30/05 achievements)
        } // (maj 30/05 achievements)

        if (!isUnlocked && canUnlock) {
            unlockedAchievements[ach.id] = true;
            // Gérer les récompenses additives qui modifient directement une variable globale
            // La rewardFn doit retourner la nouvelle valeur (maj 30/05 achievements)
            if (ach.id.startsWith('ACH_ASCEND_') || ach.id.startsWith('ACH_QUESTS_')) { // (maj 30/05 achievements)
                // Pour les récompenses qui ajoutent des points (PA, SP), la rewardFn retourne la nouvelle valeur
                if (ach.id.startsWith('ACH_ASCEND_')) { // (maj 30/05 achievements)
                    ascensionPoints = ach.rewardFn(); // (maj 30/05 achievements)
                } else if (ach.id.startsWith('ACH_QUESTS_')) { // (maj 30/05 achievements)
                    // Gérer les différents types de points de compétence des quêtes (maj 30/05 achievements)
                    if (ach.rewardText.includes('point de compétence d\'études')) { // (maj 30/05 achievements)
                        studiesSkillPoints = ach.rewardFn(); // (maj 30/05 achievements)
                    } else if (ach.rewardText.includes('point de compétence d\'ascension')) { // (maj 30/05 achievements)
                        ascensionSkillPoints = ach.rewardFn(); // (maj 30/05 achievements)
                    } else if (ach.rewardText.includes('point de compétence de prestige')) { // (maj 30/05 achievements)
                        prestigeSkillPoints = ach.rewardFn(); // (maj 30/05 achievements)
                    }
                }
            } else {
                // Pour les récompenses qui modifient skillEffects ou permanentBpsBonusFromAchievements directement
                ach.rewardFn();
            }

            showNotification(`Succès débloqué : ${ach.name} ! (${ach.rewardText})`);
            newAchievementUnlocked = true;
        }
    });

    if (newAchievementUnlocked) {
        applyAllSkillEffects(); // Appliquer tous les effets après déverrouillage
        renderAchievements();
        updateDisplay(); // Mettre à jour l'affichage global
        saveGameState(); // Sauvegarder l'état du jeu
    }
}

/**
 * Affiche l'infobulle d'un succès.
 * @param {Event} event L'événement souris.
 * @param {Object} ach L'objet succès.
 */
export function showAchievementTooltip(event, ach) {
    const achievementTooltip = document.getElementById('achievementTooltip');
    if (!achievementTooltip) return;

    // Si une infobulle est déjà active et a été "cliquée", ne pas la cacher au survol.
    if (activeAchievementTooltip && activeAchievementTooltip.classList.contains('clicked')) return;

    achievementTooltip.innerHTML = `
        <strong>${ach.name}</strong><br>
        ${ach.description}<br>
        <span class="reward">Récompense : ${ach.rewardText}</span>
    `;

    // Positionner l'infobulle par rapport au curseur de la souris
    achievementTooltip.style.left = `${event.clientX + 10}px`;
    achievementTooltip.style.top = `${event.clientY + 10}px`;
    achievementTooltip.classList.add('visible');
    achievementTooltip.style.display = 'block';
    // activeAchievementTooltip n'est défini ici que pour le survol, pas pour le clic.
    // Il sera écrasé ou réinitialisé par toggleAchievementTooltip si un clic se produit.
}

/**
 * Cache l'infobulle d'un succès.
 */
export function hideAchievementTooltip() {
    const achievementTooltip = document.getElementById('achievementTooltip');
    if (!achievementTooltip) return;

    // Si une infobulle est actuellement "cliquée", ne pas la cacher au simple mouseout.
    // La fonction toggleAchievementTooltip gérera sa fermeture au clic.
    if (activeAchievementTooltip && activeAchievementTooltip.classList.contains('clicked')) return;

    achievementTooltip.classList.remove('visible');
    achievementTooltip.style.display = 'none';
    // Ne pas réinitialiser activeAchievementTooltip ici si elle a été définie par un clic.
    // C'est le rôle de toggleAchievementTooltip de le faire.
}

/**
 * Bascule la visibilité de l'infobulle d'un succès au clic.
 * @param {Event} event L'événement clic.
 * @param {Object} ach L'objet succès.
 */
export function toggleAchievementTooltip(event, ach) {
    event.stopPropagation(); // Empêcher le clic de se propager au document

    const achievementTooltip = document.getElementById('achievementTooltip');
    if (!achievementTooltip) return;

    // Si une infobulle est déjà active et que c'est CELLE-CI (même ID), la cacher.
    if (activeAchievementTooltip && activeAchievementTooltip.dataset.achId === ach.id && achievementTooltip.classList.contains('clicked')) {
        achievementTooltip.classList.remove('visible', 'clicked');
        achievementTooltip.style.display = 'none';
        activeAchievementTooltip = null; // Réinitialiser l'infobulle active
        return;
    }

    // Si une autre infobulle était active et "cliquée", la cacher d'abord.
    if (activeAchievementTooltip && activeAchievementTooltip.classList.contains('clicked')) {
        activeAchievementTooltip.classList.remove('visible', 'clicked');
        activeAchievementTooltip.style.display = 'none';
        activeAchievementTooltip = null;
    }

    // Afficher la nouvelle infobulle et la marquer comme cliquée
    achievementTooltip.innerHTML = `
        <strong>${ach.name}</strong><br>
        ${ach.description}<br>
        <span class="reward">Récompense : ${ach.rewardText}</span>
    `;
    achievementTooltip.dataset.achId = ach.id; // Stocker l'ID du succès sur l'infobulle
    achievementTooltip.style.left = `${event.clientX + 10}px`;
    achievementTooltip.style.top = `${event.clientY + 10}px`;
    achievementTooltip.classList.add('visible', 'clicked');
    achievementTooltip.style.display = 'block';
    activeAchievementTooltip = achievementTooltip; // Définir l'infobulle actuellement cliquée
}
