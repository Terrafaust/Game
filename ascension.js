/**
 * ascension.js
 *
 * ------------------ Fiche Mémo : ascension.js -----------------------------
 * Description : Ce fichier gère toute la logique et les fonctionnalités liées au mécanisme
 * d'Ascension dans le jeu. L'Ascension est un "soft reset" qui réinitialise une partie de la
 * progression du joueur (ressources, bâtiments, etc.) en échange de Points d'Ascension (PA).
 * L'Ascension se débloque après avoir acquis au moins 5 Professeurs. Le nombre de PA gagnés
 * dépend du total des Bons Points (BP) accumulés au cours de la partie actuelle. Le coût
 * de l'Ascension n'augmente pas.
 *
 * Dépendances :
 * - core.js : Fournit l'accès aux variables d'état globales (bonsPointsTotal, ascensionCount,
 * ascensionPoints, totalPAEarned, saveGameState,
 * checkUnlockConditions, softResetGame, applyAllSkillEffects, ascensionUnlocked, nombreProfesseur),
 * et la fonction de formatage des nombres (formatNumber).
 * - data.js : Contient les définitions des seuils pour gagner des PA (ASCENSION_POINT_THRESHOLD) et les coûts initiaux (initialCosts). (modif 30/05)
 * - ui.js : Fournit la fonction de notification (showNotification) et (updateDisplay) et est responsable
 * d'appeler les fonctions de mise à jour de l'interface utilisateur spécifiques à l'Ascension
 * (updateAscensionUI, updateAscensionButtonStates) en leur passant les éléments DOM.
 *
 * Variables Clés (utilisées par ascension.js, mais définies et gérées ailleurs) :
 * - bonsPointsTotal : Total cumulé de Bons Points gagnés sur la partie actuelle, utilisé pour calculer les PA.
 * - ascensionCount : Nombre de fois que le joueur a effectué une Ascension.
 * - ascensionPoints : Monnaie d'Ascension actuelle du joueur.
 * - totalPAEarned : Total cumulé de Points d'Ascension gagnés sur toutes les Ascensions.
 * - ascensionUnlocked : Flag booléen indiquant si le menu d'Ascension est débloqué.
 * - nombreProfesseur : Le nombre actuel de Professeurs possédés.
 *
 * Fonctions Clés Définies et Exportées :
 * - calculatePAGained() : Calcule le nombre de Points d'Ascension que le joueur
 * gagnerait s'il effectuait une Ascension maintenant, basé sur bonsPointsTotal. (modif 30/05)
 * - performAscension() : Exécute le processus d'Ascension, réinitialise le jeu (sauf les PA et bonus),
 * ajoute les PA gagnés et déclenche les mises à jour nécessaires. L'Ascension nécessite au moins 5 Professeurs.
 * - calculateNextEcoleCost(count) : Calcule le coût de la prochaine École. (modif 30/05)
 * - calculateNextLyceeCost(count) : Calcule le coût du prochain Lycée. (modif 30/05)
 * - calculateNextCollegeCost(count) : Calcule le coût du prochain Collège. (modif 30/05)
 * - updateAscensionUI(domElements) : Met à jour l'affichage des informations d'Ascension
 * dans l'interface utilisateur.
 * - updateAscensionButtonStates(domElements) : Met à jour l'état (texte, classes CSS)
 * du bouton d'Ascension en fonction de la possibilité d'ascender (au moins 5 Professeurs et PA potentiels > 0).
 *
 * Éléments DOM Clés (référencés par ID, définis dans index.html et gérés via ui.js) :
 * Ce module n'accède pas directement aux éléments DOM via `document.getElementById`.
 * Il s'attend à ce que les fonctions d'UI qui le consomment (comme `updateAscensionUI` et
 * `updateAscensionButtonStates`) reçoivent les références DOM nécessaires ou que les éléments
 * soient globalement accessibles (par exemple, si `ui.js` les expose globalement après les avoir récupérés).
 *
 * Logique Générale :
 * Ce module gère le mécanisme de "soft reset" via l'Ascension. Il calcule les récompenses en PA
 * en fonction de la progression, vérifie la condition du nombre de Professeurs, réinitialise l'état
 * du jeu et met à jour l'interface utilisateur pour refléter les changements.
 */

// Importations des variables d'état et fonctions globales depuis core.js
import {
    bonsPointsTotal,
    ascensionCount,
    ascensionPoints,
    totalPAEarned,
    saveGameState,
    checkUnlockConditions,
    softResetGame,
    applyAllSkillEffects,
    ascensionUnlocked,
    nombreProfesseur,
    formatNumber
} from './core.js';

// Importations des fonctions de calcul de coût/bonus depuis data.js
import {
    ASCENSION_POINT_THRESHOLD, // Seuil de BP total pour gagner 1 PA
    initialCosts // (modif 30/05)
    // ASCENSION_BASE_COST_MULTIPLIER est supprimé car l'ascension ne coûte pas d'argent
} from './data.js';

// Importations des fonctions d'UI depuis ui.js
import {
    showNotification,
    updateDisplay
} from './ui.js';

/**
 * Calcule le nombre de Points d'Ascension que le joueur gagnerait s'il effectuait une Ascension maintenant.
 * Basé sur le total cumulé de Bons Points gagnés (bonsPointsTotal).
 * @returns {Decimal} Le nombre de Points d'Ascension potentiels.
 */
export function calculatePAGained() { // (modif 30/05)
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
 * Calcule le coût de la prochaine École.
 * @param {Decimal} currentCount Le nombre actuel d'Écoles possédées.
 * @returns {Decimal} Le coût de la prochaine École.
 */
export function calculateNextEcoleCost(currentCount) { // (modif 30/05)
    const baseCost = initialCosts.ecole;
    const costMultiplier = new Decimal(1.15); // Exemple de multiplicateur, à ajuster si nécessaire (modif 30/05)
    return baseCost.times(costMultiplier.pow(currentCount));
}

/**
 * Calcule le coût du prochain Lycée.
 * @param {Decimal} currentCount Le nombre actuel de Lycées possédés.
 * @returns {Decimal} Le coût du prochain Lycée.
 */
export function calculateNextLyceeCost(currentCount) { // (modif 30/05)
    const baseCost = initialCosts.lycee;
    const costMultiplier = new Decimal(1.18); // Exemple de multiplicateur, à ajuster si nécessaire (modif 30/05)
    return baseCost.times(costMultiplier.pow(currentCount));
}

/**
 * Calcule le coût du prochain Collège.
 * @param {Decimal} currentCount Le nombre actuel de Collèges possédés.
 * @returns {Decimal} Le coût du prochain Collège.
 */
export function calculateNextCollegeCost(currentCount) { // (modif 30/05)
    const baseCost = initialCosts.college;
    const costMultiplier = new Decimal(1.2); // Exemple de multiplicateur, à ajuster si nécessaire (modif 30/05)
    return baseCost.times(costMultiplier.pow(currentCount));
}

/**
 * Exécute le processus d'Ascension.
 * Réinitialise le jeu (sauf les PA et bonus), ajoute les PA gagnés et déclenche les mises à jour nécessaires.
 * L'Ascension nécessite au moins 5 Professeurs.
 * Cette fonction est appelée par events.js.
 */
export function performAscension() {
    if (nombreProfesseur.lt(5)) {
        showNotification("Vous avez besoin d'au moins 5 Professeurs pour Ascender !");
        return;
    }

    const potentialPA = calculatePAGained(); // (modif 30/05)

    if (potentialPA.lt(1)) {
        showNotification("Pas assez de Bons Points cumulés pour Ascender !");
        return;
    }

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
    const potentialPA = calculatePAGained(); // (modif 30/05)

    if (!ascensionButton) return;

    if (nombreProfesseur.gte(5) && potentialPA.gte(1)) {
        ascensionButton.innerHTML = `Ascender ! Gagner ${formatNumber(potentialPA, 0)} PA`;
        ascensionButton.classList.add('can-ascend');
        ascensionButton.classList.remove('cannot-ascend');
    } else if (nombreProfesseur.lt(5)) {
        ascensionButton.innerHTML = `Besoin de 5 Professeurs pour Ascender`;
        ascensionButton.classList.add('cannot-ascend');
        ascensionButton.classList.remove('can-ascend');
    } else {
        ascensionButton.innerHTML = `Pas assez de BP pour Ascender (besoin de ${formatNumber(ASCENSION_POINT_THRESHOLD, 0)} BP)`;
        ascensionButton.classList.add('cannot-ascend');
        ascensionButton.classList.remove('can-ascend');
    }
}
