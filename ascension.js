/**
 * ascension.js
 *
 * ------------------ Fiche Mémo : ascension.js -----------------------------
 * Description : Ce fichier gère toute la logique et les fonctionnalités liées au mécanisme
 * d'Ascension dans le jeu. L'Ascension permet au joueur de réinitialiser une partie de sa progression
 * en échange de Points d'Ascension (PA), qui peuvent ensuite être utilisés pour débloquer
 * des bonus permanents ou des automatisations. Ce module calcule les PA gagnés,
 * déclenche la réinitialisation du jeu et met à jour les éléments d'interface utilisateur
 * liés à l'Ascension.
 *
 * Dépendances :
 * - core.js : Fournit l'accès aux variables d'état globales (bonsPointsTotal, ascensionCount,
 * ascensionPoints, totalPAEarned, saveGameState, updateDisplay,
 * checkUnlockConditions, resetGameState, applyAllSkillEffects, ascensionUnlocked),
 * et la fonction de formatage des nombres (formatNumber).
 * - data.js : Contient les définitions des coûts et bonus liés à l'Ascension,
 * ainsi que les seuils pour gagner des PA (ASCENSION_POINT_THRESHOLD, ASCENSION_BASE_COST_MULTIPLIER).
 * - ui.js : Fournit la fonction de notification (showNotification) et est responsable
 * d'appeler les fonctions de mise à jour de l'interface utilisateur spécifiques à l'Ascension
 * (updateAscensionUI, updateAscensionButtonStates) en leur passant les éléments DOM.
 *
 * Variables Clés (utilisées par ascension.js, mais définies et gérées ailleurs) :
 * - bonsPointsTotal : Total cumulé de Bons Points gagnés sur toutes les parties, utilisé pour calculer les PA.
 * - ascensionCount : Nombre de fois que le joueur a effectué une Ascension.
 * - ascensionPoints : Monnaie d'Ascension actuelle du joueur.
 * - totalPAEarned : Total cumulé de Points d'Ascension gagnés sur toutes les Ascensions.
 * - ascensionUnlocked : Flag booléen indiquant si le menu d'Ascension est débloqué.
 *
 * Fonctions Clés Définies et Exportées :
 * - calculatePotentialAscensionPoints() : Calcule le nombre de Points d'Ascension que le joueur
 * gagnerait s'il effectuait une Ascension maintenant, basé sur bonsPointsTotal.
 * - performAscension() : Exécute le processus d'Ascension, réinitialise le jeu,
 * ajoute les PA gagnés et déclenche les mises à jour nécessaires.
 * - updateAscensionUI(domElements) : Met à jour l'affichage des informations d'Ascension
 * dans l'interface utilisateur.
 * - updateAscensionButtonStates(domElements) : Met à jour l'état (texte, classes CSS)
 * du bouton d'Ascension en fonction de la possibilité d'ascender.
 *
 * Éléments DOM Clés (référencés par ID, définis dans index.html et gérés via ui.js) :
 * Ce module n'accède pas directement aux éléments DOM via `document.getElementById`.
 * Il s'attend à ce que les fonctions d'UI qui le consomment (comme `updateAscensionUI` et
 * `updateAscensionButtonStates`) reçoivent les références DOM nécessaires ou que les éléments
 * soient globalement accessibles (par exemple, si `ui.js` les expose globalement après les avoir récupérés).
 *
 * Logique Générale :
 * Ce module est le cœur de la progression "soft reset". Il assure que l'Ascension est
 * un processus clair et impactant, récompensant le joueur pour sa progression globale
 * et lui permettant de débloquer de nouvelles couches de jeu. Il est appelé par `events.js`
 * pour l'interaction utilisateur et par la boucle de jeu pour les mises à jour visuelles.
 */

// Importations des variables d'état et fonctions globales depuis core.js
import {
    bonsPointsTotal,
    ascensionCount,
    ascensionPoints,
    totalPAEarned,
    saveGameState,
    updateDisplay,
    checkUnlockConditions,
    softResetGame, // Correction: Utiliser softResetGame pour la réinitialisation d'Ascension
    applyAllSkillEffects,
    ascensionUnlocked, // Flag de déverrouillage du menu d'Ascension
    formatNumber // Import formatNumber from core.js
} from './core.js';

// Importations des fonctions de calcul de coût/bonus depuis data.js
import {
    ASCENSION_POINT_THRESHOLD, // Seuil de BP total pour gagner 1 PA
    ASCENSION_BASE_COST_MULTIPLIER // Multiplicateur pour le coût des PA (si applicable)
} from './data.js';

// Importations des fonctions d'UI depuis ui.js
import {
    showNotification // Import showNotification from ui.js
} from './ui.js';

/**
 * Calcule le nombre de Points d'Ascension que le joueur gagnerait s'il effectuait une Ascension maintenant.
 * Basé sur le total cumulé de Bons Points gagnés (bonsPointsTotal).
 * @returns {Decimal} Le nombre de Points d'Ascension potentiels.
 */
export function calculatePotentialAscensionPoints() {
    // Le nombre de PA gagnés est basé sur bonsPointsTotal divisé par un seuil.
    // Chaque tranche du seuil donne 1 PA.
    // Par exemple, si ASCENSION_POINT_THRESHOLD est 1e10, et bonsPointsTotal est 2.5e10,
    // le joueur gagnerait 2 PA.
    if (bonsPointsTotal.lt(ASCENSION_POINT_THRESHOLD)) {
        return new Decimal(0);
    }
    return bonsPointsTotal.div(ASCENSION_POINT_THRESHOLD).floor();
}

/**
 * Exécute le processus d'Ascension.
 * Réinitialise le jeu, ajoute les PA gagnés et déclenche les mises à jour nécessaires.
 * Cette fonction est appelée par events.js.
 */
export function performAscension() {
    const potentialPA = calculatePotentialAscensionPoints();

    if (potentialPA.lt(1)) {
        showNotification("Pas assez de Bons Points cumulés pour Ascender !");
        return;
    }

    // Confirmation de l'Ascension (utilisation d'une notification personnalisée au lieu d'alert/confirm)
    showNotification(`Ascension en cours ! Vous gagnez ${formatNumber(potentialPA, 0)} Points d'Ascension.`);

    // Incrémenter le compteur d'Ascension
    window.ascensionCount = ascensionCount.add(1); // Assigner le nouveau Decimal

    // Ajouter les Points d'Ascension gagnés
    window.ascensionPoints = ascensionPoints.add(potentialPA); // Assigner le nouveau Decimal
    window.totalPAEarned = totalPAEarned.add(potentialPA); // Assigner le nouveau Decimal

    // Réinitialiser l'état du jeu (sauf les bonus permanents et les PA)
    softResetGame(); // Appelle la fonction de soft reset de core.js

    // Appliquer tous les effets de compétences (y compris les bonus permanents d'Ascension)
    applyAllSkillEffects();

    // Mettre à jour l'interface utilisateur via updateDisplay qui orchestrera les appels UI
    updateDisplay(); // Rafraîchit l'affichage global

    // Sauvegarder l'état du jeu
    saveGameState();

    showNotification("Ascension terminée ! Une nouvelle ère commence.");
}

/**
 * Met à jour l'affichage des informations d'Ascension dans l'interface utilisateur.
 * Cette fonction est appelée par ui.js.
 * @param {object} domElements - Un objet contenant les références aux éléments DOM nécessaires.
 * Ex: { ascensionPointsDisplay, totalPAEarnedDisplay, ascensionCountDisplay, ascensionMenuContainer }
 */
export function updateAscensionUI(domElements) {
    const { ascensionPointsDisplay, totalPAEarnedDisplay, ascensionCountDisplay, ascensionMenuContainer } = domElements;

    if (ascensionPointsDisplay) ascensionPointsDisplay.textContent = formatNumber(ascensionPoints, 0);
    if (totalPAEarnedDisplay) totalPAEarnedDisplay.textContent = formatNumber(totalPAEarned, 0);
    if (ascensionCountDisplay) ascensionCountDisplay.textContent = formatNumber(ascensionCount, 0);

    // Contrôler la visibilité du menu d'Ascension
    if (ascensionMenuContainer) {
        ascensionMenuContainer.style.display = ascensionUnlocked ? 'block' : 'none';
    }
}

/**
 * Met à jour l'état (texte, classes CSS) du bouton d'Ascension.
 * Cette fonction est appelée par ui.js.
 * @param {object} domElements - Un objet contenant les références aux éléments DOM nécessaires.
 * Ex: { ascensionButton }
 */
export function updateAscensionButtonStates(domElements) {
    const { ascensionButton } = domElements;
    const potentialPA = calculatePotentialAscensionPoints();

    if (!ascensionButton) return;

    if (potentialPA.gte(1)) {
        ascensionButton.innerHTML = `Ascender ! Gagner ${formatNumber(potentialPA, 0)} PA`;
        ascensionButton.classList.add('can-ascend');
        ascensionButton.classList.remove('cannot-ascend');
    } else {
        ascensionButton.innerHTML = `Pas assez de BP pour Ascender (besoin de ${formatNumber(ASCENSION_POINT_THRESHOLD, 0)} BP)`;
        ascensionButton.classList.add('cannot-ascend');
        ascensionButton.classList.remove('can-ascend');
    }
}
