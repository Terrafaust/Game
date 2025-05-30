/**
 * automation.js
 *
 * ------------------ Fiche Mémo : automation.js -----------------------------
 * Description : Ce fichier gère toute la logique et les fonctionnalités liées à l'automatisation
 * des achats dans le jeu. Il permet d'activer ou de désactiver l'automatisation pour
 * les Élèves, Classes, Images et Professeurs, de calculer les coûts associés à ces automatisations,
 * et de déclencher les achats automatiques à chaque tick de jeu.
 *
 * Dépendances :
 * - core.js : Fournit l'accès aux variables d'état globales (ascensionPoints, autoEleveActive,
 * autoClasseActive, autoImageActive, autoProfesseurActive), à la fonction d'achat générique (performPurchase),
 * et à la fonction de formatage des nombres (formatNumber).
 * - ui.js : Fournit les fonctions de notification (showNotification) et de mise à jour
 * de l'interface utilisateur spécifique à l'automatisation (updateAutomationButtonStates), aux fonctions de sauvegarde (saveGameState),
 * de mise à jour de l'affichage global (updateDisplay)
 *
 * Variables Clés (utilisées par automation.js, mais définies et gérées ailleurs) :
 * - ascensionPoints : Monnaie utilisée pour acheter les automatisations.
 * - autoEleveActive, autoClasseActive, autoImageActive, autoProfesseurActive : Flags booléens
 * indiquant si une automatisation spécifique est active.
 * - skillEffects : Objet contenant les effets cumulés des compétences, notamment les réductions de coût.
 *
 * Fonctions Clés Définies et Exportées :
 * - calculateAutomationCost(baseCost) : Calcule le coût d'une automatisation en tenant compte des réductions de coût.
 * - runAutomation() : Exécute les achats pour toutes les automatisations actives.
 * - toggleAutomation(itemType, baseCost) : Active ou désactive une automatisation spécifique,
 * gère le coût en Points d'Ascension et les notifications.
 *
 * Éléments DOM Clés (référencés par ID, définis dans index.html et gérés via ui.js) :
 * Ce module n'accède pas directement aux éléments DOM via `document.getElementById`.
 * Il s'attend à ce que les fonctions d'UI qui le consomment (comme `updateAutomationButtonStates`)
 * reçoivent les références DOM nécessaires ou que les éléments soient globalement accessibles
 * (par exemple, si `ui.js` les expose globalement après les avoir récupérés).
 *
 * Logique Générale :
 * Ce module centralise la gestion des automatisations, permettant une séparation claire
 * des préoccupations par rapport à la logique d'achat de base ou aux mises à jour de l'interface.
 * Il est appelé par `events.js` pour les interactions utilisateur et par la boucle de jeu
 * principale (`core.js`) pour l'exécution périodique des automatisations.
 */

// Importations des variables d'état et fonctions globales depuis core.js
import {
    ascensionPoints,
    autoEleveActive,
    autoClasseActive,
    autoImageActive,
    autoProfesseurActive,
    saveGameState,
    performPurchase,
    skillEffects,
    formatNumber
} from './core.js';
// Importations des fonctions d'UI depuis ui.js
import {
    showNotification, // Import showNotification from ui.js
    updateAutomationButtonStates, // This function is defined in ui.js
    updateDisplay
} from './ui.js';

/**
 * Calcule le coût d'une automatisation en tenant compte des réductions de coût.
 * @param {Decimal} baseCost - Le coût de base de l'automatisation.
 * @returns {Decimal} Le coût final après application des réductions.
 */
export function calculateAutomationCost(baseCost) {
    // Assurez-vous que baseCost est un objet Decimal
    let cost = new Decimal(baseCost);

    // Appliquer la réduction de coût des compétences d'automatisation
    // skillEffects.automationCostReduction est un pourcentage de réduction (ex: 0.1 pour 10%)
    if (skillEffects.automationCostReduction.gt(0)) {
        cost = cost.mul(new Decimal(1).sub(skillEffects.automationCostReduction));
    }

    // Appliquer la réduction de coût globale
    if (skillEffects.allCostReduction.gt(0)) {
        cost = cost.mul(new Decimal(1).sub(skillEffects.allCostReduction));
    }

    return cost;
}

/**
 * Exécute les achats pour toutes les automatisations actives.
 * Cette fonction est appelée par la boucle de jeu principale dans core.js.
 */
export function runAutomation() {
    if (autoEleveActive.value) { // Access the value property of the Decimal object
        performPurchase('eleve', '1', true);
    }
    if (autoClasseActive.value) { // Access the value property of the Decimal object
        performPurchase('classe', '1', true);
    }
    if (autoImageActive.value) { // Access the value property of the Decimal object
        performPurchase('image', '1', true);
    }
    if (autoProfesseurActive.value) { // Access the value property of the Decimal object
        performPurchase('Professeur', '1', true);
    }
}

/**
 * Active ou désactive une automatisation spécifique.
 * Gère le coût en Points d'Ascension et les notifications.
 * Cette fonction est appelée par events.js.
 * @param {string} itemType - Le type d'objet à automatiser ('eleve', 'classe', 'image', 'Professeur').
 * @param {Decimal} baseCost - Le coût de base de l'automatisation en Points d'Ascension.
 */
export function toggleAutomation(itemType, baseCost) {
    let currentAutomationState;
    let automationFlag; // Use a direct reference to the Decimal object, not its value
    switch (itemType) {
        case 'eleve':
            currentAutomationState = autoEleveActive.value;
            automationFlag = autoEleveActive;
            break;
        case 'classe':
            currentAutomationState = autoClasseActive.value;
            automationFlag = autoClasseActive;
            break;
        case 'image':
            currentAutomationState = autoImageActive.value;
            automationFlag = autoImageActive;
            break;
        case 'Professeur':
            currentAutomationState = autoProfesseurActive.value;
            automationFlag = autoProfesseurActive;
            break;
        default:
            console.error(`Type d'automatisation inconnu : ${itemType}`);
            return;
    }

    const cost = calculateAutomationCost(new Decimal(baseCost)); // Ensure baseCost is a Decimal

    if (currentAutomationState) {
        // Désactiver l'automatisation
        automationFlag.value = false; // Set the value property of the Decimal object
        showNotification(`Auto ${itemType.charAt(0).toUpperCase() + itemType.slice(1)} désactivée.`);
    } else {
        // Activer l'automatisation
        if (ascensionPoints.gte(cost)) {
            // ascensionPoints est une Decimal, la soustraction retourne une nouvelle Decimal
            ascensionPoints.assign(ascensionPoints.sub(cost)); // Utiliser assign pour Decimal
            automationFlag.value = true; // Set the value property of the Decimal object
            showNotification(`Auto ${itemType.charAt(0).toUpperCase() + itemType.slice(1)} activée !`);
        } else {
            showNotification(`Pas assez de PA (${formatNumber(cost, 0)} PA) !`);
            return; // Ne pas continuer si pas assez de PA
        }
    }

    // `updateDisplay()` est appelée pour rafraîchir l'affichage global,
    // ce qui inclura la mise à jour des boutons d'automatisation via `ui.js`.
    updateDisplay();
    saveGameState();
}
