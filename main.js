/*
 * Fichier: main.js
 * Description: Point d'entrée principal du jeu incrémental.
 * Coordonne les différents modules et gère la boucle de jeu principale.
 */

import { gameState, getInitialGameState, resetGameState } from './gameState.js';
import { 
    updateUI, 
    formatNumber, 
    showNotification, 
    showModal, 
    hideModal, 
    applyTheme, 
    toggleTheme,
    showMainContainer 
} from './uiManager.js';
import { 
    skillsData, 
    generateSkillTreeUI, 
    updateSkillTreeUI, 
    buySkill, 
    resetSkills 
} from './skillManager.js';

// =============================================================================
// 1. Constantes et Configuration
// =============================================================================

const SAVE_KEY = 'incrementalGameSave';
const AUTOSAVE_INTERVAL = 30000; // 30 secondes
const GAME_TICK_RATE = 50; // 20 FPS (50ms par tick)

// =============================================================================
// 2. Système de Sauvegarde et Chargement
// =============================================================================

/**
 * Sauvegarde l'état actuel du jeu dans le localStorage.
 */
export function saveGame() {
    try {
        const saveState = {};
        for (const key in gameState) {
            if (gameState[key] instanceof Decimal) {
                saveState[key] = gameState[key].toString();
            } else if (typeof gameState[key] === 'object' && gameState[key] !== null && !Array.isArray(gameState[key])) {
                saveState[key] = {};
                for (const subKey in gameState[key]) {
                    if (gameState[key][subKey] instanceof Decimal) {
                        saveState[key][subKey] = gameState[key][subKey].toString();
                    } else {
                        saveState[key][subKey] = gameState[key][subKey];
                    }
                }
            } else {
                saveState[key] = gameState[key];
            }
        }
        localStorage.setItem(SAVE_KEY, JSON.stringify(saveState));
        showNotification('Partie sauvegardée !', 'success');
    } catch (e) {
        console.error("Erreur lors de la sauvegarde :", e);
        showNotification('Échec de la sauvegarde !', 'error');
    }
}

/**
 * Charge l'état du jeu depuis le localStorage.
 */
function loadGame() {
    try {
        const savedState = localStorage.getItem(SAVE_KEY);
        if (savedState) {
            const parsedState = JSON.parse(savedState);
            const newState = getInitialGameState();

            for (const key in newState) {
                if (parsedState.hasOwnProperty(key)) {
                    if (newState[key] instanceof Decimal) {
                        newState[key] = new Decimal(parsedState[key]);
                    } else if (typeof newState[key] === 'object' && newState[key] !== null && !Array.isArray(newState[key])) {
                        for (const subKey in newState[key]) {
                            if (parsedState[key] && parsedState[key].hasOwnProperty(subKey)) {
                                if (newState[key][subKey] instanceof Decimal) {
                                    newState[key][subKey] = new Decimal(parsedState[key][subKey]);
                                } else {
                                    newState[key][subKey] = parsedState[key][subKey];
                                }
                            }
                        }
                    } else {
                        newState[key] = parsedState[key];
                    }
                }
            }
            resetGameState(newState);
            console.log("Partie chargée avec succès !");
            showNotification('Partie chargée !', 'success');
        } else {
            console.log("Aucune sauvegarde trouvée, nouvelle partie initiée.");
            resetGameState(getInitialGameState());
        }
    } catch (e) {
        console.error("Erreur lors du chargement de la sauvegarde :", e);
        showNotification('Sauvegarde corrompue, nouvelle partie !', 'error');
        resetGameState(getInitialGameState());
    }
    gameState.lastTickTime = Date.now();
    applyTheme(gameState.currentTheme);
}

// =============================================================================
// 3. Calculs du Jeu
// =============================================================================

/**
 * Recalcule toutes les valeurs du jeu qui dépendent d'autres valeurs.
 */
export function recalculateGameValues() {
    // Coût des élèves
    gameState.coutEleveActuel = gameState.coutEleveBase.mul(Decimal.pow(1.15, gameState.nombreEleves));
    gameState.coutEleveActuel = gameState.coutEleveActuel.div(gameState.skillEffects.eleveCostReduction);

    // Production des élèves
    const baseEleveProduction = new Decimal(0.5);
    gameState.bonsPointsParSecondeEleves = gameState.nombreEleves.mul(baseEleveProduction).mul(gameState.skillEffects.eleveBpsBonus);

    // Production des classes
    const baseClasseProduction = new Decimal(25);
    gameState.bonsPointsParSecondeClasses = gameState.nombreClasses.mul(baseClasseProduction).mul(gameState.skillEffects.classeMultiplierBonus);

    // Professeurs disponibles
    gameState.availableProfessors = gameState.nombreProfesseurs.sub(gameState.professorsUsedForSkills);

    // Bonus d'ascension
    if (gameState.ascensionCount.gt(0)) {
        gameState.ascensionBonusMultiplier = new Decimal(1).add(gameState.totalPAEarned.mul(0.05));
    } else {
        gameState.ascensionBonusMultiplier = new Decimal(1);
    }

    // Coût et multiplicateur des écoles
    gameState.coutEcoleActuel = gameState.coutEcoleBase.mul(Decimal.pow(1.5, gameState.schoolCount));
    gameState.schoolMultiplier = new Decimal(1).add(gameState.schoolCount.mul(0.1));
}

/**
 * Calcule le nombre de PA potentiels à gagner lors de l'ascension.
 */
function calculatePotentialPA() {
    const professorThreshold = new Decimal(10);
    if (gameState.nombreProfesseurs.lt(professorThreshold)) {
        return new Decimal(0);
    }
    return gameState.nombreProfesseurs.sub(professorThreshold).div(10).floor();
}

// =============================================================================
// 4. Fonctions d'Achat
// =============================================================================

/**
 * Calcule le coût total pour acheter N unités avec croissance exponentielle.
 */
function calculateTotalCost(currentOwned, quantityToBuy, baseCost, growthRate, costReduction = new Decimal(1)) {
    let totalCost = new Decimal(0);
    for (let i = 0; i < quantityToBuy.toNumber(); i++) {
        const unitCost = baseCost.mul(Decimal.pow(growthRate, currentOwned.add(i))).div(costReduction);
        totalCost = totalCost.add(unitCost);
    }
    return totalCost;
}

/**
 * Achète un ou plusieurs élèves.
 */
export function buyEleve(quantity = new Decimal(1), isAutomated = false) {
    let actualQuantity = quantity;
    
    if (!isAutomated && gameState.currentPurchaseMultiplier === Infinity) {
        actualQuantity = gameState.bonsPoints.div(gameState.coutEleveActuel).floor();
    } else if (!isAutomated && gameState.currentPurchaseMultiplier > 1) {
        actualQuantity = new Decimal(gameState.currentPurchaseMultiplier);
    }

    if (actualQuantity.lt(1)) return;

    const totalCost = calculateTotalCost(
        gameState.nombreEleves, 
        actualQuantity, 
        gameState.coutEleveBase, 
        new Decimal(1.15), 
        gameState.skillEffects.eleveCostReduction
    );

    if (gameState.bonsPoints.gte(totalCost)) {
        // Vérifier l'avertissement pour les élèves
        if (!isAutomated && !gameState.disableEleveWarning && gameState.nombreEleves.mod(30).eq(0) && actualQuantity.gt(0)) {
            showModal('confirmElevePurchaseModal');
            // Stocker la quantité et le coût pour l'utiliser après confirmation
            window.pendingElevePurchase = { quantity: actualQuantity, cost: totalCost };
            return;
        }

        gameState.bonsPoints = gameState.bonsPoints.sub(totalCost);
        gameState.nombreEleves = gameState.nombreEleves.add(actualQuantity);
        recalculateGameValues();
        if (!isAutomated) {
            showNotification(`Acheté ${formatNumber(actualQuantity)} élève(s) !`, 'success');
        }
    } else if (!isAutomated) {
        showNotification("Pas assez de Bons Points pour acheter cet élève.", 'error');
    }
}

/**
 * Achète une ou plusieurs salles de classe.
 */
export function buyClasse() {
    const cost = gameState.coutClasseEnEleves;
    if (gameState.nombreEleves.gte(cost)) {
        gameState.nombreEleves = gameState.nombreEleves.sub(cost);
        gameState.nombreClasses = gameState.nombreClasses.add(1);
        gameState.coutEleveBase = gameState.coutEleveBase.mul(1.05);
        recalculateGameValues();
        showNotification('Acheté une salle de classe !', 'success');
    } else {
        showNotification("Pas assez d'élèves pour acheter une salle de classe.", 'error');
    }
}

/**
 * Achète une ou plusieurs images.
 */
export function buyImage(quantity = new Decimal(1), isAutomated = false) {
    let actualQuantity = quantity;
    
    if (!isAutomated && gameState.currentPurchaseMultiplier === Infinity) {
        actualQuantity = gameState.bonsPoints.div(gameState.coutImage).floor();
    } else if (!isAutomated && gameState.currentPurchaseMultiplier > 1) {
        actualQuantity = new Decimal(gameState.currentPurchaseMultiplier);
    }

    if (actualQuantity.lt(1)) return;

    const totalCost = gameState.coutImage.mul(actualQuantity);

    if (gameState.bonsPoints.gte(totalCost)) {
        gameState.bonsPoints = gameState.bonsPoints.sub(totalCost);
        gameState.images = gameState.images.add(actualQuantity);
        if (!isAutomated) {
            showNotification(`Acheté ${formatNumber(actualQuantity)} image(s) !`, 'success');
        }
    } else if (!isAutomated) {
        showNotification("Pas assez de Bons Points pour acheter cette image.", 'error');
    }
}

/**
 * Achète un ou plusieurs professeurs.
 */
export function buyProfesseur(quantity = new Decimal(1), isAutomated = false) {
    let actualQuantity = quantity;
    
    if (!isAutomated && gameState.currentPurchaseMultiplier === Infinity) {
        actualQuantity = gameState.images.div(gameState.coutProfesseur).floor();
    } else if (!isAutomated && gameState.currentPurchaseMultiplier > 1) {
        actualQuantity = new Decimal(gameState.currentPurchaseMultiplier);
    }

    if (actualQuantity.lt(1)) return;

    const totalCost = gameState.coutProfesseur.mul(actualQuantity);

    if (gameState.images.gte(totalCost)) {
        gameState.images = gameState.images.sub(totalCost);
        gameState.nombreProfesseurs = gameState.nombreProfesseurs.add(actualQuantity);
        recalculateGameValues();
        if (!isAutomated) {
            showNotification(`Acheté ${formatNumber(actualQuantity)} professeur(s) !`, 'success');
        }
    } else if (!isAutomated) {
        showNotification("Pas assez d'Images pour acheter ce professeur.", 'error');
    }
}

/**
 * Achète une école avec des PA.
 */
export function buySchool() {
    const cost = gameState.coutEcoleActuel;
    if (gameState.ascensionPoints.gte(cost)) {
        gameState.ascensionPoints = gameState.ascensionPoints.sub(cost);
        gameState.schoolCount = gameState.schoolCount.add(1);
        recalculateGameValues();
        showNotification('École achetée !', 'success');
    } else {
        showNotification("Pas assez de Points d'Ascension pour acheter une école.", 'error');
    }
}

// =============================================================================
// 5. Système d'Ascension
// =============================================================================

/**
 * Effectue une ascension.
 */
export function performAscension() {
    const paGained = calculatePotentialPA();
    if (paGained.lt(1)) {
        showNotification("Vous n'avez pas assez de professeurs pour ascensionner.", 'error');
        return;
    }

    // Sauvegarder les valeurs persistantes
    const persistentValues = {
        ascensionPoints: gameState.ascensionPoints.add(paGained),
        totalPAEarned: gameState.totalPAEarned.add(paGained),
        ascensionCount: gameState.ascensionCount.add(1),
        ascensionBonusMultiplier: gameState.ascensionBonusMultiplier,
        schoolCount: gameState.schoolCount,
        schoolMultiplier: gameState.schoolMultiplier,
        currentTheme: gameState.currentTheme,
        themeOptionUnlocked: gameState.themeOptionUnlocked,
        multiPurchaseOptionUnlocked: gameState.multiPurchaseOptionUnlocked,
        maxPurchaseOptionUnlocked: gameState.maxPurchaseOptionUnlocked,
        automationCategoryUnlocked: gameState.automationCategoryUnlocked,
        autoEleveActive: gameState.autoEleveActive,
        autoImageActive: gameState.autoImageActive,
        autoProfesseurActive: gameState.autoProfesseurActive,
        disableEleveWarning: gameState.disableEleveWarning,
        disableAscensionWarning: gameState.disableAscensionWarning
    };

    // Réinitialiser l'état
    const newState = getInitialGameState();
    
    // Restaurer les valeurs persistantes
    Object.assign(newState, persistentValues);
    
    resetGameState(newState);
    recalculateGameValues();
    saveGame();
    showNotification(`Ascension effectuée ! Vous avez gagné ${formatNumber(paGained)} PA.`, 'success');
}

// =============================================================================
// 6. Fonctions d'Amélioration d'Ascension
// =============================================================================

/**
 * Débloque l'option d'achat multiple.
 */
export function unlockMultiPurchase() {
    const cost = new Decimal(10);
    if (gameState.ascensionPoints.gte(cost)) {
        gameState.ascensionPoints = gameState.ascensionPoints.sub(cost);
        gameState.multiPurchaseOptionUnlocked = true;
        showNotification('Achat multiple débloqué !', 'success');
    } else {
        showNotification("Pas assez de PA pour débloquer l'achat multiple.", 'error');
    }
}

/**
 * Débloque l'option d'achat max.
 */
export function unlockMaxPurchase() {
    const cost = new Decimal(100);
    if (gameState.ascensionPoints.gte(cost)) {
        gameState.ascensionPoints = gameState.ascensionPoints.sub(cost);
        gameState.maxPurchaseOptionUnlocked = true;
        showNotification('Achat Max débloqué !', 'success');
    } else {
        showNotification("Pas assez de PA pour débloquer l'achat Max.", 'error');
    }
}

/**
 * Débloque la catégorie d'automatisation.
 */
export function unlockAutomationCategory() {
    const cost = new Decimal(1000);
    if (gameState.ascensionPoints.gte(cost)) {
        gameState.ascensionPoints = gameState.ascensionPoints.sub(cost);
        gameState.automationCategoryUnlocked = true;
        showNotification("Catégorie d'automatisation débloquée !", 'success');
    } else {
        showNotification("Pas assez de PA pour débloquer l'automatisation.", 'error');
    }
}

// =============================================================================
// 7. Système d'Automatisation
// =============================================================================

/**
 * Active/désactive l'automatisation des élèves.
 */
export function toggleAutoEleve() {
    const cost = new Decimal(100);
    if (!gameState.autoEleveActive) {
        if (gameState.ascensionPoints.gte(cost)) {
            gameState.ascensionPoints = gameState.ascensionPoints.sub(cost);
            gameState.autoEleveActive = true;
            showNotification('Automatisation des élèves activée !', 'success');
        } else {
            showNotification("Pas assez de PA pour activer l'automatisation des élèves.", 'error');
        }
    } else {
        gameState.autoEleveActive = false;
        showNotification('Automatisation des élèves désactivée.', 'info');
    }
}

/**
 * Active/désactive l'automatisation des images.
 */
export function toggleAutoImage() {
    const cost = new Decimal(10000);
    if (!gameState.autoImageActive) {
        if (gameState.ascensionPoints.gte(cost)) {
            gameState.ascensionPoints = gameState.ascensionPoints.sub(cost);
            gameState.autoImageActive = true;
            showNotification('Automatisation des images activée !', 'success');
        } else {
            showNotification("Pas assez de PA pour activer l'automatisation des images.", 'error');
        }
    } else {
        gameState.autoImageActive = false;
        showNotification('Automatisation des images désactivée.', 'info');
    }
}

/**
 * Active/désactive l'automatisation des professeurs.
 */
export function toggleAutoProfesseur() {
    const cost = new Decimal(100000);
    if (!gameState.autoProfesseurActive) {
        if (gameState.ascensionPoints.gte(cost)) {
            gameState.ascensionPoints = gameState.ascensionPoints.sub(cost);
            gameState.autoProfesseurActive = true;
            showNotification('Automatisation des professeurs activée !', 'success');
        } else {
            showNotification("Pas assez de PA pour activer l'automatisation des professeurs.", 'error');
        }
    } else {
        gameState.autoProfesseurActive = false;
        showNotification('Automatisation des professeurs désactivée.', 'info');
    }
}

// =============================================================================
// 8. Autres Fonctions
// =============================================================================

/**
 * Réinitialise la progression du jeu.
 */
export function resetProgression() {
    const cost = new Decimal(10);
    if (gameState.images.gte(cost)) {
        if (confirm("Êtes-vous sûr de vouloir réinitialiser votre progression ? Cela coûtera 10 Images.")) {
            gameState.images = gameState.images.sub(cost);
            localStorage.removeItem(SAVE_KEY);
            location.reload();
        }
    } else {
        showNotification("Pas assez d'Images pour réinitialiser la progression.", 'error');
    }
}

/**
 * Change le multiplicateur d'achat.
 */
export function setPurchaseMultiplier(multiplier) {
    gameState.currentPurchaseMultiplier = multiplier;
    updateUI();
}

// =============================================================================
// 9. Boucle de Jeu Principal
// =============================================================================

let lastAutomationTick = 0;
const AUTOMATION_INTERVAL = 1000; // 1 seconde

/**
 * La boucle principale du jeu.
 */
function gameLoop(timestamp) {
    const deltaTime = (timestamp - gameState.lastTickTime) / 1000;
    gameState.lastTickTime = timestamp;

    // Production de Bons Points
    const totalBps = gameState.bonsPointsParSecondeEleves
        .add(gameState.bonsPointsParSecondeClasses)
        .mul(gameState.ascensionBonusMultiplier)
        .mul(gameState.schoolMultiplier);
    
    gameState.bonsPoints = gameState.bonsPoints.add(totalBps.mul(deltaTime));

    // Automatisation (limitée à 1 fois par seconde)
    if (timestamp - lastAutomationTick >= AUTOMATION_INTERVAL) {
        lastAutomationTick = timestamp;
        
        if (gameState.autoEleveActive && gameState.bonsPoints.gte(gameState.coutEleveActuel)) {
            buyEleve(new Decimal(1), true);
        }
        
        if (gameState.autoImageActive && gameState.bonsPoints.gte(gameState.coutImage)) {
            buyImage(new Decimal(1), true);
        }
        
        if (gameState.autoProfesseurActive && gameState.images.gte(gameState.coutProfesseur)) {
            buyProfesseur(new Decimal(1), true);
        }
    }

    recalculateGameValues();
    updateUI();
    
    requestAnimationFrame(gameLoop);
}

// =============================================================================
// 10. Initialisation et Event Listeners
// =============================================================================

/**
 * Initialise le jeu au chargement de la page.
 */
function initGame() {
    // Charger la sauvegarde
    loadGame();
    
    // Générer l'arbre de compétences
    generateSkillTreeUI();
    
    // Initialiser l'UI
    recalculateGameValues();
    updateUI();
    
    // Démarrer la boucle de jeu
    requestAnimationFrame(gameLoop);
    
    // Démarrer la sauvegarde automatique
    setInterval(saveGame, AUTOSAVE_INTERVAL);
    
    // Initialiser les event listeners
    initEventListeners();
}

/**
 * Initialise tous les event listeners.
 */
function initEventListeners() {
    // Bouton principal
    document.getElementById('etudierButton')?.addEventListener('click', () => {
        gameState.bonsPoints = gameState.bonsPoints.add(1);
        updateUI();
    });

    // Boutons d'achat
    document.getElementById('acheterEleveButton')?.addEventListener('click', () => buyEleve());
    document.getElementById('acheterClasseButton')?.addEventListener('click', buyClasse);
    document.getElementById('acheterImageButton')?.addEventListener('click', () => buyImage());
    document.getElementById('acheterProfesseurButton')?.addEventListener('click', () => buyProfesseur());
    document.getElementById('acheterEcoleButton')?.addEventListener('click', buySchool);

    // Navigation
    document.getElementById('skillsButton')?.addEventListener('click', () => showMainContainer('skillTreeContainer'));
    document.getElementById('settingsButton')?.addEventListener('click', () => showMainContainer('settingsContainer'));
    document.getElementById('ascensionMenuButton')?.addEventListener('click', () => showMainContainer('ascensionMenuContainer'));

    // Bouton d'ascension
    document.getElementById('ascensionButton')?.addEventListener('click', () => {
        showModal('confirmAscensionModal');
        document.getElementById('paGainedDisplay').textContent = formatNumber(calculatePotentialPA());
    });

    // Confirmation d'ascension
    document.getElementById('confirmAscensionYes')?.addEventListener('click', () => {
        hideModal('confirmAscensionModal');
        performAscension();
    });

    document.getElementById('confirmAscensionNo')?.addEventListener('click', () => {
        hideModal('confirmAscensionModal');
    });

    // Confirmation d'achat d'élève
    document.getElementById('confirmElevePurchaseYes')?.addEventListener('click', () => {
        hideModal('confirmElevePurchaseModal');
        if (window.pendingElevePurchase) {
            const { quantity, cost } = window.pendingElevePurchase;
            gameState.bonsPoints = gameState.bonsPoints.sub(cost);
            gameState.nombreEleves = gameState.nombreEleves.add(quantity);
            recalculateGameValues();
            showNotification(`Acheté ${formatNumber(quantity)} élève(s) !`, 'success');
            window.pendingElevePurchase = null;
        }
    });

    document.getElementById('confirmElevePurchaseNo')?.addEventListener('click', () => {
        hideModal('confirmElevePurchaseModal');
        window.pendingElevePurchase = null;
    });

    // Checkbox d'avertissement
    document.getElementById('disableEleveWarningCheckbox')?.addEventListener('change', (e) => {
        gameState.disableEleveWarning = e.target.checked;
        saveGame();
    });

    document.getElementById('disableAscensionWarningCheckbox')?.addEventListener('change', (e) => {
        gameState.disableAscensionWarning = e.target.checked;
        saveGame();
    });

    // Paramètres
    document.getElementById('themeToggleButton')?.addEventListener('click', () => toggleTheme(saveGame));
    document.getElementById('resetProgressionButton')?.addEventListener('click', resetProgression);

    // Améliorations d'ascension
    document.getElementById('unlockMultiPurchaseButton')?.addEventListener('click', unlockMultiPurchase);
    document.getElementById('unlockMaxPurchaseButton')?.addEventListener('click', unlockMaxPurchase);
    document.getElementById('unlockAutomationCategoryButton')?.addEventListener('click', unlockAutomationCategory);

    // Automatisation
    document.getElementById('autoEleveButton')?.addEventListener('click', toggleAutoEleve);
    document.getElementById('autoImageButton')?.addEventListener('click', toggleAutoImage);
    document.getElementById('autoProfesseurButton')?.addEventListener('click', toggleAutoProfesseur);

    // Multiplicateurs d'achat
    document.getElementById('setMultiplierX1')?.addEventListener('click', () => setPurchaseMultiplier(1));
    document.getElementById('setMultiplierX10')?.addEventListener('click', () => setPurchaseMultiplier(10));
    document.getElementById('setMultiplierX100')?.addEventListener('click', () => setPurchaseMultiplier(100));
    document.getElementById('setMultiplierXMax')?.addEventListener('click', () => setPurchaseMultiplier(Infinity));

    // Réinitialisation des compétences
    document.getElementById('resetSkillsButton')?.addEventListener('click', () => {
        resetSkills(saveGame, updateUI, recalculateGameValues);
    });

    // Fermeture des modales
    document.querySelectorAll('.modal .close').forEach(button => {
        button.addEventListener('click', (e) => {
            hideModal(e.target.closest('.modal').id);
        });
    });

    // Clic en dehors des modales
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                hideModal(modal.id);
            }
        });
    });
}

// =============================================================================
// 11. Démarrage du Jeu
// =============================================================================

// Attendre que le DOM soit chargé
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGame);
} else {
    initGame();
}
