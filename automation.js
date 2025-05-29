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
 * (updateDisplay), et à la fonction d'achat générique (performPurchase).
 * - data.js : Contient la fonction de calcul des coûts d'automatisation (calculateAutomationCost).
 * - ui.js : Pour les fonctions de formatage des nombres (formatNumber) et la mise à jour
 * de l'interface utilisateur spécifique à l'automatisation (updateAutomationButtonStates).
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
    skillEffects // For cost reductions
} from './core.js'; // Assurez-vous que le chemin est correct

// Importations des fonctions de calcul de coût depuis data.js
import {
    calculateAutomationCost // Assuming this is defined in data.js
} from './data.js'; // Assurez-vous que le chemin est correct

// Importations des fonctions d'UI depuis ui.js
import {
    formatNumber
} from './ui.js'; // Assurez-vous que le chemin est correct

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
        // Note: Pour modifier une variable importée de core.js, vous devrez peut-être
        // passer par une fonction de modification dans core.js si elles ne sont pas
        // directement mutables via l'import. Pour l'exemple, nous utilisons eval(),
        // mais une meilleure pratique serait une fonction setAutoEleveActive(false) dans core.js.
        // Puisque les variables sont exportées avec 'let', elles sont mutables.
        if (automationFlagName === 'autoEleveActive') autoEleveActive.value = false;
        if (automationFlagName === 'autoClasseActive') autoClasseActive.value = false;
        if (automationFlagName === 'autoImageActive') autoImageActive.value = false;
        if (automationFlagName === 'autoProfesseurActive') autoProfesseurActive.value = false;

        showNotification(`Auto ${itemType.charAt(0).toUpperCase() + itemType.slice(1)} désactivée.`);
    } else {
        // Activer l'automatisation
        if (ascensionPoints.gte(cost)) {
            ascensionPoints.sub(cost); // Utilisation de .sub() pour Decimal
            if (automationFlagName === 'autoEleveActive') autoEleveActive.value = true;
            if (automationFlagName === 'autoClasseActive') autoClasseActive.value = true;
            if (automationFlagName === 'autoImageActive') autoImageActive.value = true;
            if (automationFlagName === 'autoProfesseurActive') autoProfesseurActive.value = true;
            showNotification(`Auto ${itemType.charAt(0).toUpperCase() + itemType.slice(1)} activée !`);
        } else {
            showNotification(`Pas assez de PA (${formatNumber(cost, 0)} PA) !`);
            return; // Ne pas continuer si pas assez de PA
        }
    }

    updateAutomationButtonStates(); // Met à jour l'état des boutons d'automatisation
    updateDisplay(); // Rafraîchit l'affichage global
    saveGameState(); // Sauvegarde l'état du jeu
}

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
