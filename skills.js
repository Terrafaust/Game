/**
 * skills.js
 *
 * ------------------ Fiche Mémo : skills.js -----------------------------
 * Description : Ce fichier gère toute la logique et les fonctionnalités liées aux compétences
 * (Skills) du jeu. Il permet l'achat de compétences dans différentes catégories (Études, Ascension, Prestige),
 * gère les points de compétence requis, applique les effets des compétences, et met à jour
 * l'interface utilisateur du menu des compétences.
 *
 * Dépendances :
 * - core.js : Fournit l'accès aux variables d'état globales (studiesSkillPoints, ascensionSkillPoints,
 * prestigeSkillPoints, skillEffects, studiesSkillLevels, ascensionSkillLevels, prestigeSkillLevels,
 * showNotification, saveGameState, checkUnlockConditions, applyAllSkillEffects,
 * totalClicks, nombreProfesseur, prestigeCount).
 * - data.js : Contient les définitions des compétences (skillsData) incluant leurs coûts,
 * effets, et conditions de déverrouillage.
 * - ui.js : Pour les fonctions de formatage des nombres (formatNumber) et la mise à jour
 * de l'interface utilisateur spécifique aux compétences (updateSkillsUI, renderSkillsMenu) et générale (updateDisplay).
 *
 * Variables Clés (utilisées par skills.js, mais définies et gérées ailleurs) :
 * - studiesSkillPoints, ascensionSkillPoints, prestigeSkillPoints : Monnaies utilisées pour acheter les compétences.
 * - skillEffects : Objet accumulant tous les bonus actifs des compétences achetées.
 * - studiesSkillLevels, ascensionSkillLevels, prestigeSkillLevels : Objets pour suivre les niveaux des compétences achetées.
 * - totalClicks, nombreProfesseur, prestigeCount : Utilisés pour vérifier les conditions de déverrouillage des compétences.
 *
 * Fonctions Clés Définies et Exportées :
 * - purchaseSkill(skillId, skillType) : Gère la logique d'achat d'une compétence,
 * vérifie les coûts, déduit les points, marque la compétence comme achetée et applique ses effets.
 * - updateSkillsUI(domElements) : Met à jour l'état (texte, classes CSS, visibilité)
 * des éléments de l'interface utilisateur du menu des compétences.
 * - renderSkillsMenu(domElements) : Construit ou met à jour dynamiquement la structure HTML
 * du menu des compétences en fonction des compétences débloquées et achetées.
 *
 * Éléments DOM Clés (référencés par ID, définis dans index.html et gérés via ui.js) :
 * Ce module n'accède pas directement aux éléments DOM via `document.getElementById`.
 * Il s'attend à ce que les fonctions d'UI qui le consomment (comme `updateSkillsUI` et `renderSkillsMenu`)
 * reçoivent les références DOM nécessaires ou que les éléments soient globalement accessibles
 * (par exemple, si `ui.js` les expose globalement après les avoir récupérés).
 *
 * Logique Générale :
 * Ce module est le centre de la progression par compétences. Il interagit avec les données
 * du jeu pour déterminer la disponibilité des compétences et avec l'état global pour
 * appliquer leurs bonus. Il est appelé par `events.js` pour les interactions utilisateur
 * et par la boucle de jeu principale pour les mises à jour visuelles.
 */

// --- Imports des modules nécessaires ---
import {
    studiesSkillPoints,
    ascensionSkillPoints,
    prestigeSkillPoints,
    studiesSkillLevels, // Importation correcte des niveaux de compétences
    ascensionSkillLevels, // Importation correcte des niveaux de compétences
    prestigeSkillLevels, // Importation correcte des niveaux de compétences
    skillEffects,
    totalClicks,
    nombreProfesseur,
    prestigeCount,
    saveGameState,
    checkUnlockConditions,
    applyAllSkillEffects
} from './core.js';

import { skillsData } from './data.js';

// Importation des fonctions d'UI (assurez-vous qu'elles sont exportées par ui.js)
import { 
    formatNumber,
    showNotification,
    updateDisplay
} from './ui.js';


/**
 * Gère l'achat d'une compétence.
 * @param {string} skillId L'ID de la compétence à acheter.
 * @param {string} skillType Le type de compétence ('studies', 'ascension', 'prestige').
 */
export function purchaseSkill(skillId, skillType) {
    const skillCategory = skillsData[skillType];
    if (!skillCategory) {
        console.error(`Catégorie de compétence inconnue: ${skillType}`);
        return;
    }

    // Trouver la compétence dans le tableau de la catégorie
    const skill = skillCategory.find(s => s.id === skillId);
    if (!skill) {
        console.error(`Compétence non trouvée: ${skillId} dans la catégorie ${skillType}`);
        return;
    }

    let currentSkillPoints; // Variable pour les points de compétence de la catégorie
    let skillLevelsObject; // Objet pour suivre les niveaux de compétences de la catégorie

    // Assigner les bonnes variables en fonction du type de compétence
    switch (skillType) {
        case 'studies':
            currentSkillPoints = studiesSkillPoints;
            skillLevelsObject = studiesSkillLevels;
            break;
        case 'ascension':
            currentSkillPoints = ascensionSkillPoints;
            skillLevelsObject = ascensionSkillLevels;
            break;
        case 'prestige':
            currentSkillPoints = prestigeSkillPoints;
            skillLevelsObject = prestigeSkillLevels;
            break;
        default:
            console.error(`Type de compétence non géré: ${skillType}`);
            return;
    }

    const currentLevel = skillLevelsObject[skillId] || 0; // Niveau actuel de la compétence

    // Vérifier si la compétence est déjà au niveau max
    if (currentLevel >= skill.maxLevel) {
        showNotification(`${skill.name} est déjà au niveau maximum !`);
        return;
    }

    // Vérifier les prérequis (toutes les compétences prérequises doivent être au niveau max)
    const allPrerequisitesMet = skill.prerequisites.every(prereqId => {
        const prereqSkill = skillCategory.find(s => s.id === prereqId);
        return prereqSkill && (skillLevelsObject[prereqId] || 0) >= prereqSkill.maxLevel;
    });

    if (!allPrerequisitesMet) {
        showNotification(`Prérequis non remplis pour ${skill.name} !`);
        return;
    }

    const cost = new Decimal(skill.cost);

    // Vérifier si le joueur a assez de points de compétence
    if (currentSkillPoints.lt(cost)) {
        showNotification(`Pas assez de points de compétence pour acheter "${skill.name}" ! (Coût: ${formatNumber(cost, 0)})`);
        return;
    }

    // Effectuer l'achat
    // Déduire le coût des points de compétence appropriés
    switch (skillType) {
        case 'studies':
            studiesSkillPoints.minus(cost); // Mise à jour directe de la variable exportée
            break;
        case 'ascension':
            ascensionSkillPoints.minus(cost);
            break;
        case 'prestige':
            prestigeSkillPoints.minus(cost);
            break;
    }

    skillLevelsObject[skillId] = currentLevel + 1; // Incrémenter le niveau de la compétence

    // Appliquer l'effet de la compétence
    if (skill.effect) {
        skill.effect(skillLevelsObject[skillId], skillEffects);
    }

    // Cas spécial pour la compétence secrète (si elle existe et est gérée par un clic)
    if (skillId === 'S5_2_Secret' && skillType === 'studies') {
        // La logique spécifique à cette compétence (ex: incrémenter un compteur de clics)
        // devrait être gérée dans events.js lors du clic sur l'élément DOM de la compétence,
        // ou ici si l'achat lui-même déclenche un effet unique.
        // Pour l'instant, l'achat marque juste la compétence comme "acquise".
    }

    showNotification(`Compétence "${skill.name}" achetée !`);

    // Mettre à jour l'interface et sauvegarder l'état du jeu
    applyAllSkillEffects(); // Réappliquer tous les effets des compétences après l'achat
    updateDisplay(); // Mettre à jour l'affichage global
    // Les fonctions updateSkillsUI et renderSkillsMenu seront appelées par la boucle de jeu
    // ou par ui.js si elles sont déclenchées par un événement UI.
    checkUnlockConditions(); // Vérifier si de nouvelles fonctionnalités sont débloquées
    saveGameState(); // Sauvegarder l'état du jeu
}

/**
 * Met à jour l'état (texte, classes CSS, visibilité) des éléments de l'interface utilisateur du menu des compétences.
 * Cette fonction est appelée par ui.js.
 * @param {object} domElements - Un objet contenant les références aux éléments DOM nécessaires.
 * Ex: { studiesSkillPointsSpan, ascensionSkillPointsSpan, prestigeSkillPointsSpan, skillsContainer }
 */
export function updateSkillsUI(domElements) {
    const { studiesSkillPointsSpan, ascensionSkillPointsSpan, prestigeSkillPointsSpan } = domElements;

    // Mise à jour de l'affichage des points de compétence
    if (studiesSkillPointsSpan) studiesSkillPointsSpan.textContent = formatNumber(studiesSkillPoints, 0);
    if (ascensionSkillPointsSpan) ascensionSkillPointsSpan.textContent = formatNumber(ascensionSkillPoints, 0);
    if (prestigeSkillPointsSpan) prestigeSkillPointsSpan.textContent = formatNumber(prestigeSkillPoints, 0);

    // Note: La mise à jour des classes CSS des compétences individuelles
    // (can-afford, purchased, cannot-afford) est gérée par `renderSkillsMenu`
    // qui reconstruit ou met à jour les éléments de la grille.
}

/**
 * Construit ou met à jour dynamiquement la structure HTML du menu des compétences.
 * Cette fonction est appelée par ui.js.
 * @param {object} domElements - Un objet contenant les références aux éléments DOM nécessaires.
 * Ex: { studiesSkillsGrid, ascensionSkillsGrid, prestigeSkillsGrid }
 */
export function renderSkillsMenu(domElements) {
    const { studiesSkillsGrid, ascensionSkillsGrid, prestigeSkillsGrid } = domElements;

    // Fonction utilitaire pour rendre une grille de compétences
    const renderGrid = (gridElement, skillCategory, currentPoints, skillLevelsObject) => {
        if (!gridElement) return; // S'assurer que l'élément DOM existe

        gridElement.innerHTML = ''; // Nettoyer la grille avant de la reconstruire

        // Itérer sur le tableau des compétences pour la catégorie donnée
        for (const skill of skillsData[skillCategory]) {
            // Vérifier les conditions de déverrouillage (exemple simple, à étendre si nécessaire)
            let isUnlocked = true;
            // Exemple de conditions de déverrouillage basées sur des propriétés de skill (si définies dans data.js)
            if (skill.unlockedBy) {
                if (skill.unlockedBy.totalClicks && totalClicks.lt(skill.unlockedBy.totalClicks)) isUnlocked = false;
                if (skill.unlockedBy.nombreProfesseur && nombreProfesseur.lt(skill.unlockedBy.nombreProfesseur)) isUnlocked = false;
                if (skill.unlockedBy.prestigeCount && prestigeCount.lt(skill.unlockedBy.prestigeCount)) isUnlocked = false;
                // Ajoutez d'autres conditions de déverrouillage ici si nécessaire
            }

            if (!isUnlocked) continue; // Ne pas afficher les compétences non débloquées

            const skillDiv = document.createElement('div');
            skillDiv.classList.add('skill-item');
            skillDiv.dataset.skillId = skill.id; // Utiliser skill.id
            skillDiv.dataset.skillType = skillCategory;

            const isMaxLevel = (skillLevelsObject[skill.id] || 0) >= skill.maxLevel;
            const canAfford = currentPoints.gte(new Decimal(skill.cost));

            if (isMaxLevel) {
                skillDiv.classList.add('purchased'); // Utiliser 'purchased' pour indiquer max level
            } else if (canAfford) {
                skillDiv.classList.add('can-afford');
            } else {
                skillDiv.classList.add('cannot-afford');
            }

            // Déterminer le texte du coût et du niveau
            let costText = `Coût: ${formatNumber(new Decimal(skill.cost), 0)} Pts`;
            if (skill.currency) { // Si une devise spécifique est définie dans data.js
                costText = `Coût: ${formatNumber(new Decimal(skill.cost), 0)} ${skill.currency.replace('SkillPoints', ' Pts')}`;
            }

            const currentLevel = skillLevelsObject[skill.id] || 0;
            const levelText = `Niveau: ${currentLevel}/${skill.maxLevel}`;

            skillDiv.innerHTML = `
                <h3>${skill.name}</h3>
                <p>${skill.description}</p>
                <p class="skill-cost">${costText}</p>
                <p class="skill-level">${levelText}</p>
            `;

            // Ajouter l'écouteur d'événement seulement si la compétence n'est pas au niveau max
            if (!isMaxLevel) {
                skillDiv.addEventListener('click', () => purchaseSkill(skill.id, skillCategory));
            }

            gridElement.appendChild(skillDiv);
        }
    };

    // Appeler renderGrid pour chaque catégorie de compétences
    renderGrid(studiesSkillsGrid, 'studies', studiesSkillPoints, studiesSkillLevels);
    renderGrid(ascensionSkillsGrid, 'ascension', ascensionSkillPoints, ascensionSkillLevels);
    renderGrid(prestigeSkillsGrid, 'prestige', prestigeSkillPoints, prestigeSkillLevels);
}
