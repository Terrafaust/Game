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
 * prestigeSkillPoints, skillEffects, purchasedSkills, showNotification, saveGameState,
 * updateDisplay, checkUnlockConditions, applyAllSkillEffects, totalClicks, nombreProfesseur,
 * prestigeCount).
 * - data.js : Contient les définitions des compétences (skillsData) incluant leurs coûts,
 * effets, et conditions de déverrouillage.
 * - ui.js : Pour les fonctions de formatage des nombres (formatNumber) et la mise à jour
 * de l'interface utilisateur spécifique aux compétences (updateSkillsUI, renderSkillsMenu).
 *
 * Variables Clés (utilisées par skills.js, mais définies et gérées ailleurs) :
 * - studiesSkillPoints, ascensionSkillPoints, prestigeSkillPoints : Monnaies utilisées pour acheter les compétences.
 * - skillEffects : Objet accumulant tous les bonus actifs des compétences achetées.
 * - purchasedSkills : Objet pour suivre les compétences déjà achetées.
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

// Importations des variables d'état et fonctions globales depuis core.js
import {
    studiesSkillPoints,
    ascensionSkillPoints,
    prestigeSkillPoints,
    skillEffects,
    purchasedSkills, // Assurez-vous que cette variable est définie et exportée dans core.js
    showNotification,
    saveGameState,
    updateDisplay,
    checkUnlockConditions,
    applyAllSkillEffects,
    totalClicks,
    nombreProfesseur,
    prestigeCount
} from './core.js'; // Assurez-vous que le chemin est correct

// Importations des définitions de compétences depuis data.js
import {
    skillsData // Assurez-vous que cette variable est définie et exportée dans data.js
} from './data.js'; // Assurez-vous que le chemin est correct

// Importations des fonctions d'UI depuis ui.js
import {
    formatNumber
} from './ui.js'; // Assurez-vous que le chemin est correct

/**
 * Gère la logique d'achat d'une compétence.
 * @param {string} skillId - L'ID unique de la compétence à acheter.
 * @param {string} skillType - Le type de compétence ('studies', 'ascension', 'prestige').
 */
export function purchaseSkill(skillId, skillType) {
    const skill = skillsData[skillType]?.[skillId];

    if (!skill) {
        console.error(`Compétence non trouvée: ${skillId} de type ${skillType}`);
        return;
    }

    if (purchasedSkills[skillId]) {
        showNotification(`Vous avez déjà acheté "${skill.name}" !`);
        return;
    }

    let currentPoints;
    let pointsName;
    switch (skill.currency) {
        case 'studiesSkillPoints':
            currentPoints = studiesSkillPoints;
            pointsName = 'Points d\'Étude';
            break;
        case 'ascensionSkillPoints':
            currentPoints = ascensionSkillPoints;
            pointsName = 'Points d\'Ascension';
            break;
        case 'prestigeSkillPoints':
            currentPoints = prestigeSkillPoints;
            pointsName = 'Points de Prestige';
            break;
        default:
            console.error(`Devise de compétence inconnue: ${skill.currency}`);
            return;
    }

    const cost = new Decimal(skill.cost);

    if (currentPoints.gte(cost)) {
        currentPoints.sub(cost); // Utilisation de .sub() pour Decimal
        purchasedSkills[skillId] = true; // Marque la compétence comme achetée
        applyAllSkillEffects(); // Réapplique tous les effets des compétences
        showNotification(`Compétence "${skill.name}" achetée !`);
    } else {
        showNotification(`Pas assez de ${pointsName} pour acheter "${skill.name}" ! (Coût: ${formatNumber(cost, 0)})`);
        return;
    }

    checkUnlockConditions(); // Vérifie si de nouvelles choses sont débloquées
    updateSkillsUI(); // Met à jour l'interface des compétences
    updateDisplay(); // Rafraîchit l'affichage global
    saveGameState(); // Sauvegarde l'état du jeu
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

    // Mise à jour de l'état des boutons de compétences (gérée par renderSkillsMenu)
    // Cette fonction se concentre sur les points de compétence.
    // La mise à jour des boutons individuels est mieux gérée par renderSkillsMenu
    // car elle peut recréer ou modifier les éléments.
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
    const renderGrid = (gridElement, skillCategory, currentPoints) => {
        if (!gridElement) return; // S'assurer que l'élément existe

        gridElement.innerHTML = ''; // Nettoyer la grille avant de la reconstruire

        for (const skillId in skillsData[skillCategory]) {
            const skill = skillsData[skillCategory][skillId];

            // Vérifier les conditions de déverrouillage (exemple simple, à étendre si nécessaire)
            let isUnlocked = true;
            if (skill.unlockedBy) {
                if (skill.unlockedBy.totalClicks && totalClicks.lt(skill.unlockedBy.totalClicks)) isUnlocked = false;
                if (skill.unlockedBy.nombreProfesseur && nombreProfesseur.lt(skill.unlockedBy.nombreProfesseur)) isUnlocked = false;
                if (skill.unlockedBy.prestigeCount && prestigeCount.lt(skill.unlockedBy.prestigeCount)) isUnlocked = false;
                // Ajoutez d'autres conditions de déverrouillage ici
            }

            if (!isUnlocked) continue; // Ne pas afficher les compétences non débloquées

            const skillDiv = document.createElement('div');
            skillDiv.classList.add('skill-item');
            skillDiv.dataset.skillId = skillId;
            skillDiv.dataset.skillType = skillCategory;

            const isPurchased = purchasedSkills[skillId];
            const canAfford = currentPoints.gte(new Decimal(skill.cost));

            if (isPurchased) {
                skillDiv.classList.add('purchased');
            } else if (canAfford) {
                skillDiv.classList.add('can-afford');
            } else {
                skillDiv.classList.add('cannot-afford');
            }

            skillDiv.innerHTML = `
                <h3>${skill.name}</h3>
                <p>${skill.description}</p>
                <p class="skill-cost">Coût: ${formatNumber(new Decimal(skill.cost), 0)} ${skill.currency.replace('SkillPoints', ' Pts')}</p>
            `;

            if (!isPurchased) {
                skillDiv.addEventListener('click', () => purchaseSkill(skillId, skillCategory));
            }

            gridElement.appendChild(skillDiv);
        }
    };

    renderGrid(studiesSkillsGrid, 'studies', studiesSkillPoints);
    renderGrid(ascensionSkillsGrid, 'ascension', ascensionSkillPoints);
    renderGrid(prestigeSkillsGrid, 'prestige', prestigeSkillPoints);
}
