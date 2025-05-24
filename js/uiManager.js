/*
 * Fichier: uiManager.js
 * Description: Gère toutes les mises à jour de l'interface utilisateur,
 * les notifications, les modales et le thème du jeu.
 * Importe l'état du jeu depuis gameState.js.
 */

import { gameState, resetGameState } from './gameState.js'; // Importe gameState et resetGameState
import { skillsData } from './skillManager.js'; // Importe skillsData pour la mise à jour de l'arbre de compétences

/**
 * Formate un nombre Decimal en notation scientifique ou avec des suffixes.
 * @param {Decimal} number - Le nombre à formater.
 * @returns {string} Le nombre formaté.
 */
export function formatNumber(number) {
    if (number.lt(1000000)) { // Moins d'un million, affichage normal
        return number.floor().toString();
    }
    // Utilise la notation scientifique de break_infinity.js
    return number.toExponential(2); // Ex: 1.23e6
}

/**
 * Affiche une notification.
 * @param {string} message - Le message à afficher.
 * @param {'success'|'error'|'info'} type - Le type de notification pour le style CSS.
 */
export function showNotification(message, type = 'info') {
    const container = document.getElementById('notifications-container');
    if (!container) {
        console.warn('Conteneur de notifications non trouvé.');
        return;
    }

    const notification = document.createElement('div');
    notification.classList.add('notification-item', type);
    notification.textContent = message;
    container.appendChild(notification);

    // Supprimer la notification après l'animation
    notification.addEventListener('animationend', () => {
        notification.remove();
    });
}

/**
 * Affiche une modale.
 * @param {string} modalId - L'ID de la modale à afficher.
 */
export function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'flex'; // Utiliser flex pour centrer
        modal.classList.remove('hidden');
    }
}

/**
 * Cache une modale.
 * @param {string} modalId - L'ID de la modale à cacher.
 */
export function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        modal.classList.add('hidden');
    }
}

/**
 * Applique le thème spécifié au corps du document.
 * @param {'dark'|'light'} theme - Le thème à appliquer.
 */
export function applyTheme(theme) {
    if (theme === 'dark') {
        document.body.classList.add('dark-theme');
        gameState.currentTheme = 'dark';
    } else {
        document.body.classList.remove('dark-theme');
        gameState.currentTheme = 'light';
    }
}

/**
 * Gère le basculement du thème.
 * @param {Function} saveGameCallback - Fonction de rappel pour sauvegarder le jeu.
 */
export function toggleTheme(saveGameCallback) {
    if (!gameState.themeOptionUnlocked) {
        const cost = new Decimal(10);
        if (gameState.images.gte(cost)) {
            gameState.images = gameState.images.sub(cost);
            gameState.themeOptionUnlocked = true;
            showNotification('Option de thème débloquée !', 'success');
            // Le thème bascule immédiatement après le déblocage
            applyTheme(gameState.currentTheme === 'dark' ? 'light' : 'dark');
            if (saveGameCallback) saveGameCallback(); // Sauvegarder après le déblocage
        } else {
            showNotification("Pas assez d'Images pour débloquer l'option de thème.", 'error');
        }
    } else {
        applyTheme(gameState.currentTheme === 'dark' ? 'light' : 'dark');
        if (saveGameCallback) saveGameCallback(); // Sauvegarder la préférence de thème
    }
    updateUI(); // Mettre à jour le texte du bouton
}

/**
 * Gère l'affichage/masquage des conteneurs principaux.
 * @param {string} containerIdToShow - L'ID du conteneur à afficher.
 */
export function showMainContainer(containerIdToShow) {
    const containers = ['main-content', 'skillTreeContainer', 'settingsContainer', 'ascensionMenuContainer'];
    containers.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            if (id === containerIdToShow) {
                el.classList.remove('hidden');
            } else {
                el.classList.add('hidden');
            }
        }
    });
    // Mettre à jour l'UI après un changement de conteneur (notamment pour l'arbre de compétences)
    updateUI();
}

/**
 * Met à jour l'interface utilisateur avec les valeurs actuelles de gameState.
 * Cette fonction est exportée pour être appelée par la boucle de jeu et les fonctions d'achat.
 */
export function updateUI() {
    // Ressources
    document.getElementById('bonsPoints').textContent = formatNumber(gameState.bonsPoints);
    document.getElementById('imagesCount').textContent = formatNumber(gameState.images);
    document.getElementById('professeurs').textContent = formatNumber(gameState.nombreProfesseurs);
    document.getElementById('totalBpsInline').textContent = formatNumber(gameState.bonsPointsParSecondeEleves.add(gameState.bonsPointsParSecondeClasses).mul(gameState.ascensionBonusMultiplier).mul(gameState.schoolMultiplier));

    // Élèves
    document.getElementById('nombreEleves').textContent = formatNumber(gameState.nombreEleves);
    document.getElementById('coutEleve').textContent = formatNumber(gameState.coutEleveActuel);
    const acheterEleveButton = document.getElementById('acheterEleveButton');
    if (acheterEleveButton) {
        if (gameState.bonsPoints.gte(gameState.coutEleveActuel)) {
            acheterEleveButton.classList.remove('cannot-afford');
            acheterEleveButton.disabled = false;
        } else {
            acheterEleveButton.classList.add('cannot-afford');
            acheterEleveButton.disabled = true;
        }
    }

    // Classes
    document.getElementById('nombreClasses').textContent = formatNumber(gameState.nombreClasses);
    document.getElementById('coutClasse').textContent = formatNumber(gameState.coutClasseEnEleves);
    const acheterClasseButton = document.getElementById('acheterClasseButton');
    if (acheterClasseButton) {
        if (gameState.nombreEleves.gte(gameState.coutClasseEnEleves)) {
            acheterClasseButton.classList.remove('cannot-afford');
            acheterClasseButton.disabled = false;
        } else {
            acheterClasseButton.classList.add('cannot-afford');
            acheterClasseButton.disabled = true;
        }
    }

    // Images
    const acheterImageButton = document.getElementById('acheterImageButton');
    if (acheterImageButton) {
        document.getElementById('coutImage').textContent = formatNumber(gameState.coutImage);
        if (gameState.bonsPoints.gte(gameState.coutImage)) {
            acheterImageButton.classList.remove('cannot-afford');
            acheterImageButton.disabled = false;
        } else {
            acheterImageButton.classList.add('cannot-afford');
            acheterImageButton.disabled = true;
        }
    }

    // Professeurs
    const acheterProfesseurButton = document.getElementById('acheterProfesseurButton');
    if (acheterProfesseurButton) {
        document.getElementById('coutProfesseur').textContent = formatNumber(gameState.coutProfesseur);
        if (gameState.images.gte(gameState.coutProfesseur)) {
            acheterProfesseurButton.classList.remove('cannot-afford');
            acheterProfesseurButton.disabled = false;
        } else {
            acheterProfesseurButton.classList.add('cannot-afford');
            acheterProfesseurButton.disabled = true;
        }
    }


    // Visibilité des sections
    const achatClasseSection = document.getElementById('achatClasseSection');
    if (achatClasseSection) {
        if (gameState.nombreEleves.gte(20)) {
            achatClasseSection.classList.remove('hidden');
        } else {
            achatClasseSection.classList.add('hidden');
        }
    }

    const imagesDisplay = document.getElementById('imagesDisplay');
    const achatImageSection = document.getElementById('achatImageSection');
    if (imagesDisplay && achatImageSection) {
        if (gameState.bonsPoints.gte(500)) {
            imagesDisplay.classList.remove('hidden');
            achatImageSection.classList.remove('hidden');
        } else {
            imagesDisplay.classList.add('hidden');
            achatImageSection.classList.add('hidden');
        }
    }

    const professeursDisplay = document.getElementById('professeursDisplay');
    const achatProfesseurSection = document.getElementById('achatProfesseurSection');
    const skillsButton = document.getElementById('skillsButton');
    if (professeursDisplay && achatProfesseurSection && skillsButton) {
        if (gameState.images.gte(1)) {
            professeursDisplay.classList.remove('hidden');
            achatProfesseurSection.classList.remove('hidden');
            skillsButton.classList.remove('hidden');
        } else {
            professeursDisplay.classList.add('hidden');
            achatProfesseurSection.classList.add('hidden');
            skillsButton.classList.add('hidden');
        }
    }

    // Mettre à jour les professeurs disponibles dans l'arbre de compétences (si visible)
    const skillTreeContainer = document.getElementById('skillTreeContainer');
    if (skillTreeContainer && !skillTreeContainer.classList.contains('hidden')) {
        gameState.availableProfessors = gameState.nombreProfesseurs.sub(gameState.professorsUsedForSkills);
        document.getElementById('availableProfessorsCount').textContent = formatNumber(gameState.availableProfessors);
        // Appeler la fonction de mise à jour de l'arbre de compétences ici
        // Cela nécessite que skillManager soit importé et que updateSkillTreeUI soit exporté.
        if (typeof updateSkillTreeUI !== 'undefined') { // Vérifier si la fonction est disponible
            updateSkillTreeUI();
        }
    }

    // Mettre à jour le bouton de thème
    const themeToggleButton = document.getElementById('themeToggleButton');
    if (themeToggleButton) {
        if (gameState.themeOptionUnlocked) {
            themeToggleButton.textContent = 'Changer de Thème';
            themeToggleButton.disabled = false;
        } else {
            themeToggleButton.textContent = `Débloquer option Thème (${formatNumber(new Decimal(10))} I)`;
            themeToggleButton.disabled = gameState.images.lt(10);
        }
    }

    // Mettre à jour le bouton de réinitialisation de progression
    const resetProgressionButton = document.getElementById('resetProgressionButton');
    if (resetProgressionButton) {
        resetProgressionButton.disabled = gameState.images.lt(10);
    }

    // Visibilité des boutons de menu dans right-menu
    const settingsButton = document.getElementById('settingsButton');
    if (settingsButton) {
        if (gameState.images.gte(1) || gameState.bonsPoints.gte(10000)) {
            settingsButton.classList.remove('hidden');
        } else {
            settingsButton.classList.add('hidden');
        }
    }

    const ascensionMenuButton = document.getElementById('ascensionMenuButton');
    const currentAscensionPointsDisplay = document.getElementById('currentAscensionPointsDisplay');
    const ascensionCountDisplay = document.getElementById('ascensionCountDisplay');
    const ascensionBonusDisplay = document.getElementById('ascensionBonusDisplay');

    if (ascensionMenuButton && currentAscensionPointsDisplay && ascensionCountDisplay && ascensionBonusDisplay) {
        if (gameState.ascensionCount.gt(0)) {
            ascensionMenuButton.classList.remove('hidden');
            currentAscensionPointsDisplay.classList.remove('hidden');
            ascensionCountDisplay.classList.remove('hidden');
            document.getElementById('ascensionPointsCount').textContent = formatNumber(gameState.ascensionPoints);
            document.getElementById('totalPAEarnedSpanInline').textContent = formatNumber(gameState.totalPAEarned);
            document.getElementById('ascensionCountSpan').textContent = formatNumber(gameState.ascensionCount);
            document.getElementById('ascensionBonusValue').textContent = formatNumber(gameState.ascensionBonusMultiplier.sub(1).mul(100)) + '%';
            ascensionBonusDisplay.classList.remove('hidden');
        } else {
            ascensionMenuButton.classList.add('hidden');
            currentAscensionPointsDisplay.classList.add('hidden');
            ascensionCountDisplay.classList.add('hidden');
            ascensionBonusDisplay.classList.add('hidden');
        }
    }

    // Mettre à jour les PA potentiels dans la modale d'ascension
    const confirmAscensionModal = document.getElementById('confirmAscensionModal');
    const paGainedDisplay = document.getElementById('paGainedDisplay');
    if (confirmAscensionModal && paGainedDisplay && !confirmAscensionModal.classList.contains('hidden')) {
        // La fonction calculatePotentialPA doit être importée ou accessible globalement
        // Pour l'instant, nous laissons un placeholder ou nous l'importerons de main.js
        // ou d'un nouveau module gameLogic.js
        paGainedDisplay.textContent = formatNumber(new Decimal(0)); // Placeholder
    }

    // Mettre à jour les PA disponibles dans le menu d'ascension
    const ascensionMenuContainer = document.getElementById('ascensionMenuContainer');
    const ascensionMenuPACount = document.getElementById('ascensionMenuPACount');
    if (ascensionMenuContainer && ascensionMenuPACount && !ascensionMenuContainer.classList.contains('hidden')) {
        ascensionMenuPACount.textContent = formatNumber(gameState.ascensionPoints);
    }

    // Visibilité des multiplicateurs d'achat
    const purchaseMultiplierSelection = document.getElementById('purchaseMultiplierSelection');
    const unlockMultiPurchaseButton = document.getElementById('unlockMultiPurchaseButton');
    if (purchaseMultiplierSelection && unlockMultiPurchaseButton) {
        if (gameState.multiPurchaseOptionUnlocked) {
            purchaseMultiplierSelection.classList.remove('hidden');
            unlockMultiPurchaseButton.classList.add('hidden');
        } else {
            purchaseMultiplierSelection.classList.add('hidden');
            unlockMultiPurchaseButton.classList.remove('hidden');
            unlockMultiPurchaseButton.disabled = gameState.ascensionPoints.lt(10);
        }
    }

    const setMultiplierXMax = document.getElementById('setMultiplierXMax');
    const unlockMaxPurchaseButton = document.getElementById('unlockMaxPurchaseButton');
    if (setMultiplierXMax && unlockMaxPurchaseButton) {
        if (gameState.maxPurchaseOptionUnlocked) {
            setMultiplierXMax.classList.remove('hidden');
            unlockMaxPurchaseButton.classList.add('hidden');
        } else {
            setMultiplierXMax.classList.add('hidden');
            unlockMaxPurchaseButton.classList.remove('hidden');
            unlockMaxPurchaseButton.disabled = gameState.ascensionPoints.lt(100);
        }
    }

    // Visibilité de la section d'automatisation
    const automationSection = document.getElementById('automationSection');
    const unlockAutomationCategoryButton = document.getElementById('unlockAutomationCategoryButton');
    if (automationSection && unlockAutomationCategoryButton) {
        if (gameState.automationCategoryUnlocked) {
            automationSection.classList.remove('hidden');
            unlockAutomationCategoryButton.classList.add('hidden');
        } else {
            automationSection.classList.add('hidden');
            unlockAutomationCategoryButton.classList.remove('hidden');
            unlockAutomationCategoryButton.disabled = gameState.ascensionPoints.lt(1000);
        }
    }

    // Mettre à jour l'état des boutons d'automatisation
    const autoEleveButton = document.getElementById('autoEleveButton');
    if (autoEleveButton) {
        if (gameState.autoEleveActive) {
            autoEleveButton.classList.add('automation-active');
            autoEleveButton.textContent = 'Automatisation Élèves: ON';
        } else {
            autoEleveButton.classList.remove('automation-active');
            autoEleveButton.textContent = `Automatiser Élèves (${formatNumber(new Decimal(100))} PA)`;
            autoEleveButton.disabled = gameState.ascensionPoints.lt(100);
        }
    }

    const autoImageButton = document.getElementById('autoImageButton');
    if (autoImageButton) {
        if (gameState.autoImageActive) {
            autoImageButton.classList.add('automation-active');
            autoImageButton.textContent = 'Automatisation Images: ON';
        } else {
            autoImageButton.classList.remove('automation-active');
            autoImageButton.textContent = `Automatiser Images (${formatNumber(new Decimal(10000))} PA)`;
            autoImageButton.disabled = gameState.ascensionPoints.lt(10000);
        }
    }

    const autoProfesseurButton = document.getElementById('autoProfesseurButton');
    if (autoProfesseurButton) {
        if (gameState.autoProfesseurActive) {
            autoProfesseurButton.classList.add('automation-active');
            autoProfesseurButton.textContent = 'Automatisation Professeurs: ON';
        } else {
            autoProfesseurButton.classList.remove('automation-active');
            autoProfesseurButton.textContent = `Automatiser Professeurs (${formatNumber(new Decimal(100000))} PA)`;
            autoProfesseurButton.disabled = gameState.ascensionPoints.lt(100000);
        }
    }

    // Mettre à jour le coût des écoles
    const acheterEcoleButton = document.getElementById('acheterEcoleButton');
    if (acheterEcoleButton) {
        document.getElementById('coutEcole').textContent = formatNumber(gameState.coutEcoleActuel);
        document.getElementById('nombreEcoles').textContent = formatNumber(gameState.schoolCount);
        document.getElementById('ecoleMultiplier').textContent = formatNumber(gameState.schoolMultiplier.sub(1).mul(100)) + '%';
        acheterEcoleButton.disabled = gameState.ascensionPoints.lt(gameState.coutEcoleActuel);
    }
}
