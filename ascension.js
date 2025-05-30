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
 * autoClasseActive, autoImageActive, autoProfesseurActive),aux fonctions de sauvegarde (saveGameState),, à la fonction d'achat générique (performPurchase), et à la fonction
 * de formatage des nombres (formatNumber).
 * - data.js : Contient la fonction de calcul des coûts d'automatisation (calculateAutomationCost).
 * - ui.js : Fournit la fonction de mise à jour de l'interface utilisateur spécifique à l'automatisation (updateAutomationButtonStates). de mise à jour de 
 * l'affichage global (updateDisplay),  aux fonctions de notification (showNotification),
 *
 * Variables Clés (utilisées par automation.js, mais définies et gérées ailleurs) :
 * - ascensionPoints : Monnaie utilisée pour acheter les automatisations.
 * - autoEleveActive, autoClasseActive, autoImageActive, autoProfesseurActive : Flags booléens
 * indiquant si une automatisation spécifique est active.
 * - skillEffects : Objet contenant les effets cumulés des compétences, notamment les réductions de coût.
 *
 * Fonctions Clés Définies et Exportées :
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
// Importations des fonctions de calcul de coût depuis data.js
import {
    calculateAutomationCost
} from './data.js';
// Importations des fonctions d'UI depuis ui.js (pour updateAutomationButtonStates)
import {
    updateAutomationButtonStates // This function is defined in ui.js
    showNotification,
    updateDisplay,

} from './ui.js';
/**
 * Exécute les achats pour toutes les automatisations actives.
 * Cette fonction est appelée par la boucle de jeu principale dans core.js.
 */
export function runAutomation() {
    if (autoEleveActive) {
        performPurchase('eleve', '1', true);
    }
    if (autoClasseActive) {
        performPurchase('classe', '1', true);
    }
    if (autoImageActive) {
        performPurchase('image', '1', true);
    }
    if (autoProfesseurActive) {
        performPurchase('Professeur', '1', true);
    }
}

/**
 * Active ou désactive une automatisation spécifique.
 * Gère le coût en Points d'Ascension et les notifications.
 * Cette fonction est appelée par events.js.
 * @param {string} itemType - Le type d'objet à automatiser ('eleve', 'classe', 'image', 'Professeur').
 * @param {number} baseCost - Le coût de base de l'automatisation en Points d'Ascension.
 */
export function toggleAutomation(itemType, baseCost) {
    let currentAutomationState;
    let automationFlagName;
    switch (itemType) {
        case 'eleve':
            currentAutomationState = autoEleveActive;
            automationFlagName = 'autoEleveActive';
            break;
        case 'classe':
            currentAutomationState = autoClasseActive;
            automationFlagName = 'autoClasseActive';
            break;
        case 'image':
            currentAutomationState = autoImageActive;
            automationFlagName = 'autoImageActive';
            break;
        case 'Professeur':
            currentAutomationState = autoProfesseurActive;
            automationFlagName = 'autoProfesseurActive';
            break;
        default:
            console.error(`Type d'automatisation inconnu : ${itemType}`);
            return;
    }

    const cost = calculateAutomationCost(baseCost);

    if (currentAutomationState) {
        // Désactiver l'automatisation
        // Les variables autoEleveActive, etc., sont exportées avec 'let' de core.js,
        // donc elles peuvent être réassignées directement.
        if (automationFlagName === 'autoEleveActive') {
            window.autoEleveActive = false;
        }
        if (automationFlagName === 'autoClasseActive') {
            window.autoClasseActive = false;
        }
        if (automationFlagName === 'autoImageActive') {
            window.autoImageActive = false;
        }
        if (automationFlagName === 'autoProfesseurActive') {
            window.autoProfesseurActive = false;
        }

        showNotification(`Auto ${itemType.charAt(0).toUpperCase() + itemType.slice(1)} désactivée.`);
    } else {
        // Activer l'automatisation
        if (ascensionPoints.gte(cost)) {
            // ascensionPoints est une Decimal, la soustraction retourne une nouvelle Decimal
            window.ascensionPoints = ascensionPoints.sub(cost);
            if (automationFlagName === 'autoEleveActive') {
                window.autoEleveActive = true;
            }
            if (automationFlagName === 'autoClasseActive') {
                window.autoClasseActive = true;
            }
            if (automationFlagName === 'autoImageActive') {
                window.autoImageActive = true;
            }
            if (automationFlagName === 'autoProfesseurActive') {
                window.autoProfesseurActive = true;
            }
            showNotification(`Auto ${itemType.charAt(0).toUpperCase() + itemType.slice(1)} activée !`);
        } else {
            showNotification(`Pas assez de PA (${formatNumber(cost, 0)} PA) !`);
            return; // Ne pas continuer si pas assez de PA
        }
    }

    // `updateDisplay()` est appelée pour rafraîchir l'affichage global,
    // ce qui inclura la mise à jour des boutons d'automatisation via `ui.js`.
    // L'appel direct à `updateAutomationButtonStates()` ici est supprimé
    // pour éviter la redeclaration et maintenir la séparation des responsabilités.
    updateDisplay();
    saveGameState();
}

// La fonction `updateAutomationButtonStates` a été déplacée dans `ui.js`
// et n'est plus définie ici pour éviter la redeclaration.
// Ce fichier l'importe de `ui.js` pour l'utiliser si nécessaire.
