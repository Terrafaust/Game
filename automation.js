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
 * autoClasseActive, autoImageActive, autoProfesseurActive), aux fonctions de notification
 * (showNotification), de sauvegarde (saveGameState), de mise à jour de l'affichage global
 * (updateDisplay), à la fonction d'achat générique (performPurchase), et à la fonction
 * de formatage des nombres (formatNumber).
 * - data.js : Contient la fonction de calcul des coûts d'automatisation (calculateAutomationCost).
 * - ui.js : Pour la mise à jour de l'interface utilisateur spécifique à l'automatisation (updateAutomationButtonStates).
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
 * - updateAutomationButtonStates(domElements) : Met à jour l'état (texte, classes CSS)
 * des boutons d'automatisation dans l'interface utilisateur.
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
    showNotification,
    saveGameState,
    updateDisplay, // For global display refresh
    performPurchase, // The general purchase function
    skillEffects, // For cost reductions
    formatNumber // Import formatNumber from core.js
} from './core.js';

// Importations des fonctions de calcul de coût depuis data.js
import {
    calculateAutomationCost // Assuming this is defined in data.js
} from './data.js';

// Importations des fonctions d'UI depuis ui.js (pour updateAutomationButtonStates)
import {
    updateAutomationButtonStates // This function is defined in ui.js
} from './ui.js';

/**
 * Exécute les achats pour toutes les automatisations actives.
 * Cette fonction est appelée par la boucle de jeu principale dans core.js.
 */
export function runAutomation() {
    if (autoEleveActive) {
        performPurchase('eleve', '1', true); // '1' pour un achat unitaire, true pour automatisé
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
            window.autoEleveActive = false; // Use window object for direct modification if not directly mutable
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

    // Ces fonctions sont appelées après la modification de l'état
    // pour rafraîchir l'interface utilisateur et sauvegarder le jeu.
    // Note: updateAutomationButtonStates est importée de ui.js et doit être appelée avec les éléments DOM.
    // Puisque automation.js ne manipule pas le DOM directement, cette fonction sera appelée
    // par events.js ou core.js en passant les références DOM nécessaires.
    // Pour l'instant, nous laissons l'appel ici, mais il faut s'assurer que les éléments DOM sont passés.
    // Si updateAutomationButtonStates est appelée depuis ui.js, elle n'a pas besoin de domElements en paramètre ici.
    // Pour éviter une dépendance circulaire ou une manipulation directe du DOM ici,
    // nous allons supposer que `updateAutomationButtonStates` est appelée par `ui.js`
    // après que `toggleAutomation` ait mis à jour les variables d'état.
    // Cependant, pour que le bouton se mette à jour immédiatement après le clic,
    // il faudrait que `events.js` appelle `updateAutomationButtonStates` après `toggleAutomation`.
    // Pour l'exemple, je vais commenter l'appel direct ici, car la mise à jour sera faite par `updateDisplay()`
    // qui est appelée et qui elle-même appelle `updateAutomationButtonStates` dans `ui.js`.

    updateDisplay(); // Rafraîchit l'affichage global, qui inclura les boutons d'automatisation
    saveGameState(); // Sauvegarde l'état du jeu
}

// Note: updateAutomationButtonStates est une fonction qui met à jour l'UI.
// Elle devrait être appelée par ui.js ou events.js qui ont accès aux éléments DOM.
// Le code ci-dessous est celui que vous avez fourni, il est correct pour sa fonction.
// Je l'ai gardé ici pour l'intégralité du document, mais son appel direct dans toggleAutomation
// a été ajusté pour refléter la gestion du DOM par ui.js.
/**
 * Met à jour l'état (texte, classes CSS) des boutons d'automatisation dans l'interface utilisateur.
 * Cette fonction est appelée par ui.js.
 * @param {object} domElements - Un objet contenant les références aux éléments DOM nécessaires.
 * Ex: { autoEleveBtn, autoClasseBtn, autoImageBtn, autoProfesseurBtn }
 */
export function updateAutomationButtonStates(domElements) {
    const { autoEleveBtn, autoClasseBtn, autoImageBtn, autoProfesseurBtn } = domElements;

    // Élèves
    const costEleve = calculateAutomationCost(100);
    if (autoEleveActive) {
        autoEleveBtn.textContent = "Désactiver Auto Élèves";
        autoEleveBtn.classList.add('automation-active');
    } else {
        autoEleveBtn.innerHTML = `Automatiser Élèves : <span class="ascension-points-color">${formatNumber(costEleve, 0)} PA</span>`;
        autoEleveBtn.classList.remove('automation-active');
        autoEleveBtn.classList.toggle('can-afford', ascensionPoints.gte(costEleve));
        autoEleveBtn.classList.toggle('cannot-afford', ascensionPoints.lt(costEleve));
    }

    // Classes
    const costClasse = calculateAutomationCost(500);
    if (autoClasseActive) {
        autoClasseBtn.textContent = "Désactiver Auto Classes";
        autoClasseBtn.classList.add('automation-active');
    } else {
        autoClasseBtn.innerHTML = `Automatiser Classes : <span class="ascension-points-color">${formatNumber(costClasse, 0)} PA</span>`;
        autoClasseBtn.classList.remove('automation-active');
        autoClasseBtn.classList.toggle('can-afford', ascensionPoints.gte(costClasse));
        autoClasseBtn.classList.toggle('cannot-afford', ascensionPoints.lt(costClasse));
    }

    // Images
    const costImage = calculateAutomationCost(10000);
    if (autoImageActive) {
        autoImageBtn.textContent = "Désactiver Auto Images";
        autoImageBtn.classList.add('automation-active');
    } else {
        autoImageBtn.innerHTML = `Automatiser Images : <span class="ascension-points-color">${formatNumber(costImage, 0)} PA</span>`;
        autoImageBtn.classList.remove('automation-active');
        autoImageBtn.classList.toggle('can-afford', ascensionPoints.gte(costImage));
        autoImageBtn.classList.toggle('cannot-afford', ascensionPoints.lt(costImage));
    }

    // Professeurs
    const costProfesseur = calculateAutomationCost(100000);
    if (autoProfesseurActive) {
        autoProfesseurBtn.textContent = "Désactiver Auto Profs";
        autoProfesseurBtn.classList.add('automation-active');
    } else {
        autoProfesseurBtn.innerHTML = `Automatiser Professeur : <span class="ascension-points-color">${formatNumber(costProfesseur, 0)} PA</span>`;
        autoProfesseurBtn.classList.remove('automation-active');
        autoProfesseurBtn.classList.toggle('can-afford', ascensionPoints.gte(costProfesseur));
        autoProfesseurBtn.classList.toggle('cannot-afford', ascensionPoints.lt(costProfesseur));
    }
}
