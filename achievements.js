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
// export const achievementsData;              // Tableau contenant la définition de tous les succès, IMPORTÉ de `data.js`.
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
//     `totalBonsPointsParSeconde`, `completedQuests`, `ascensionPoints`, `studiesSkillPoints`,
//     `ascensionSkillPoints`, `prestigeSkillPoints`.
//   - Objets d'effets (modification pour les récompenses permanentes) : `skillEffects`.
//   - Fonctions de logique (appelées après déverrouillage) : `saveGameState`, `applyAllSkillEffects`,
//     `checkUnlockConditions`, `formatNumber`.
// - De './ui.js' :
//   - Fonctions d'affichage : `showNotification`, `updateDisplay`.
// - De './data.js' :
//   - Variables d'état : `achievementsData` (contient la définition de tous les succès), `questsData` (nécessaire pour la condition `ACH_QUESTS_ALL`).
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
// 1. Définition des Succès : `achievementsData` (importé de `data.js`) contient toutes les informations statiques.
// 2. Vérification : `checkAchievements()` est appelée régulièrement par `core.js`.
//    Elle construit un objet `gameState` à partir des variables d'état importées, puis évalue la `condition()`
//    de chaque succès non débloqué en lui passant cet objet `gameState`.
// 3. Déverrouillage : Si une condition est remplie, le succès est marqué dans `unlockedAchievements`.
// 4. Récompense : La `rewardFn()` du succès est exécutée.
//    - Pour les bonus permanents (multiplicateurs, réductions de coût), elle modifie des propriétés de l'objet `skillEffects`
//      ou la variable `permanentBpsBonusFromAchievements`. Ces fonctions `rewardFn` reçoivent `skillEffects` et
//      `permanentBpsBonusFromAchievements` en paramètres et peuvent retourner la nouvelle valeur de `permanentBpsBonusFromAchievements`.
//    - Pour les gains additifs (ex: +X PA, +X SP), la `rewardFn` reçoit l'objet `gameState` et doit retourner la nouvelle valeur
//      pour que `achievements.js` puisse la réassigner à la variable globale correspondante dans `core.js` via l'importation.
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
    ascensionPoints,
    // Ajout des importations pour les points de compétence si non déjà présents dans core.js
    studiesSkillPoints,
    ascensionSkillPoints,
    prestigeSkillPoints
} from './core.js';
import { showNotification, updateDisplay } from './ui.js';
import { achievementsData } from './data.js'; // Importation de achievementsData depuis data.js
import { questsData } from './quests.js'; // Importation de questsData pour la condition ACH_QUESTS_ALL

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
    const achievementsButtonUnlocked = typeof window.achievementsButtonUnlocked !== 'undefined' ? window.achievementsButtonUnlocked : false;

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

    // Construire un objet gameState à partir des variables importées pour le passer aux conditions et récompenses
    // C'est une solution temporaire si core.js n'exporte pas un objet gameState unique.
    const gameState = {
        bonsPoints: bonsPoints,
        images: images,
        nombreEleves: nombreEleves,
        nombreClasses: nombreClasses,
        nombreProfesseur: nombreProfesseur,
        schoolCount: schoolCount,
        nombreLycees: nombreLycees,
        nombreColleges: nombreColleges,
        ascensionCount: ascensionCount,
        totalClicks: totalClicks,
        autoEleveActive: autoEleveActive,
        autoClasseActive: autoClasseActive,
        autoImageActive: autoImageActive,
        autoProfesseurActive: autoProfesseurActive,
        totalPAEarned: totalPAEarned,
        nombreLicences: nombreLicences,
        nombreMaster1: nombreMaster1,
        nombreMaster2: nombreMaster2,
        nombreDoctorat: nombreDoctorat,
        nombrePostDoctorat: nombrePostDoctorat,
        prestigeCount: prestigeCount,
        prestigePoints: prestigePoints,
        skillEffects: skillEffects,
        studiesSkillLevels: studiesSkillLevels,
        ascensionSkillLevels: ascensionSkillLevels,
        prestigeSkillLevels: prestigeSkillLevels,
        totalBonsPointsParSeconde: totalBonsPointsParSeconde,
        completedQuests: completedQuests,
        ascensionPoints: ascensionPoints,
        studiesSkillPoints: studiesSkillPoints,
        ascensionSkillPoints: ascensionSkillPoints,
        prestigeSkillPoints: prestigeSkillPoints,
        permanentBpsBonusFromAchievements: permanentBpsBonusFromAchievements // Passer la variable locale
    };

    achievementsData.forEach(ach => {
        const isUnlocked = unlockedAchievements[ach.id];
        let canUnlock = false;

        // Toutes les conditions reçoivent maintenant l'objet gameState
        canUnlock = ach.condition(gameState);

        if (!isUnlocked && canUnlock) {
            unlockedAchievements[ach.id] = true;

            let returnedValue;

            // Logique pour appeler rewardFn en fonction de son comportement attendu défini dans data.js
            // Cas 1: rewardFn modifie skillEffects et/ou permanentBpsBonusFromAchievements directement (et retourne le nouveau permanentBpsBonusFromAchievements)
            if (ach.id.startsWith('ACH_BP_') || ach.id.startsWith('ACH_ECOLE_') || ach.id.startsWith('ACH_LYCEE_') || ach.id.startsWith('ACH_COLLEGE_') || ach.id === 'ACH_SKILL_STUDIES_10' || ach.id === 'ACH_SKILL_PRESTIGE_3') {
                returnedValue = ach.rewardFn(skillEffects, permanentBpsBonusFromAchievements);
                if (returnedValue !== undefined) {
                    permanentBpsBonusFromAchievements = returnedValue; // Réaffecter la variable locale
                }
            }
            // Cas 2: rewardFn modifie skillEffects directement (pas de retour attendu)
            else if (
                ach.id.startsWith('ACH_ELEVES_') || ach.id.startsWith('ACH_IMAGES_') || ach.id.startsWith('ACH_CLASSES_') || ach.id.startsWith('ACH_PROFS_') ||
                ach.id.startsWith('ACH_AUTO_') || ach.id.startsWith('ACH_CLICK_') ||
                ach.id.startsWith('ACH_LICENCE_') || ach.id.startsWith('ACH_MASTER1_') || ach.id.startsWith('ACH_MASTER2_') ||
                ach.id.startsWith('ACH_DOCTORAT_') || ach.id.startsWith('ACH_POSTDOCTORAT_') ||
                ach.id.startsWith('ACH_BPS_') || ach.id.startsWith('ACH_SKILL_ASCENSION_5') || ach.id.startsWith('ACH_TOTAL_PA_')
            ) {
                ach.rewardFn(skillEffects); // Passer skillEffects
            }
            // Cas 3: rewardFn attend gameState et retourne une nouvelle valeur pour les points (PA, SP)
            else if (ach.id.startsWith('ACH_ASCEND_') || ach.id.startsWith('ACH_QUESTS_')) {
                returnedValue = ach.rewardFn(gameState); // Passer gameState
                if (ach.id.startsWith('ACH_ASCEND_')) {
                    ascensionPoints = returnedValue; // Réaffecter la variable importée
                } else if (ach.id.startsWith('ACH_QUESTS_')) {
                    // Logique basée sur rewardText pour déterminer quel point de compétence mettre à jour
                    if (ach.rewardText.includes('point de compétence d\'études')) {
                        studiesSkillPoints = returnedValue;
                    } else if (ach.rewardText.includes('point de compétence d\'ascension')) {
                        ascensionSkillPoints = returnedValue;
                    } else if (ach.rewardText.includes('point de compétence de prestige')) {
                        prestigeSkillPoints = returnedValue;
                    }
                }
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
