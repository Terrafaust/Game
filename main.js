/*
 * Fichier: main.js
 * Description: Point d'entrée principal du jeu incrémental.
 * Coordonne les différents modules et gère la boucle de jeu principale.
 */

import { gameState, resetGameState, getInitialGameState } from './gameState.js';
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
    generateSkillTreeUI, 
    updateSkillTreeUI, 
    buySkill, 
    resetSkills 
} from './skillManager.js';

// =============================================================================
// 1. Système de Sauvegarde et Chargement
// =============================================================================

const SAVE_KEY = 'incrementalGameSave';
const AUTOSAVE_INTERVAL = 30000; // 30 secondes

/**
 * Sauvegarde l'état actuel du jeu dans le localStorage.
 */
function saveGame() {
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
// 2. Calculs et Logique du Jeu
// =============================================================================

/**
 * Recalcule toutes les productions et coûts affectés par les bonus.
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

    // Coût des écoles
    gameState.coutEcoleActuel = gameState.coutEcoleBase.mul(Decimal.pow(1.5, gameState.schoolCount));
    
    // Multiplicateur des écoles
    gameState.schoolMultiplier = new Decimal(1).add(gameState.schoolCount.mul(0.1));
}

/**
 * Calcule le coût total pour l'achat de N unités avec un coût exponentiel.
 */
function calculateTotalCost(currentOwned, quantityToBuy, baseCost, growthRate, costReduction = new Decimal(1)) {
    let totalCost = new Decimal(0);
    for (let i = 0; i < quantityToBuy.toNumber(); i++) {
        totalCost = totalCost.add(baseCost.mul(Decimal.pow(growthRate, currentOwned.add(i))).div(costReduction));
    }
    return totalCost;
}

/**
 * Calcule le nombre potentiel de Points d'Ascension à gagner.
 */
function calculatePotentialPA() {
    const professorThreshold = new Decimal(10);
    if (gameState.nombreProfesseurs.lt(professorThreshold)) {
        return new Decimal(0);
    }
    return gameState.nombreProfesseurs.sub(professorThreshold).div(10).floor();
}

// =============================================================================
// 3. Actions du Joueur
// =============================================================================

/**
 * Gère le clic sur le bouton "Étudier sagement".
 */
function etudierSagement() {
    gameState.bonsPoints = gameState.bonsPoints.add(1);
    updateUI();
}

/**
 * Achète des élèves.
 */
function buyEleve(quantity = new Decimal(1), isAutomated = false) {
    let actualQuantity = quantity;

    if (!isAutomated) {
        if (gameState.currentPurchaseMultiplier !== 1 && gameState.currentPurchaseMultiplier !== Infinity) {
            actualQuantity = new Decimal(gameState.currentPurchaseMultiplier);
        }
        if (gameState.currentPurchaseMultiplier === Infinity) {
            actualQuantity = gameState.bonsPoints.div(gameState.coutEleveActuel).floor();
        }
    }

    if (actualQuantity.lt(1)) return;

    const finalCost = calculateTotalCost(
        gameState.nombreEleves, 
        actualQuantity, 
        gameState.coutEleveBase, 
        new Decimal(1.15), 
        gameState.skillEffects.eleveCostReduction
    );

    if (gameState.bonsPoints.gte(finalCost)) {
        if (!isAutomated && gameState.nombreEleves.mod(30).eq(0) && actualQuantity.gt(0) && !gameState.disableEleveWarning) {
            showModal('confirmElevePurchaseModal');
            document.getElementById('confirmElevePurchaseYes').onclick = () => {
                hideModal('confirmElevePurchaseModal');
                performElevePurchase(finalCost, actualQuantity);
            };
            return;
        }
        performElevePurchase(finalCost, actualQuantity);
    } else if (!isAutomated) {
        showNotification("Pas assez de Bons Points pour acheter cet élève.", 'error');
    }
}

function performElevePurchase(cost, quantity) {
    gameState.bonsPoints = gameState.bonsPoints.sub(cost);
    gameState.nombreEleves = gameState.nombreEleves.add(quantity);
    recalculateGameValues();
    updateUI();
    showNotification(`Acheté ${formatNumber(quantity)} élève(s)!`, 'success');
}

/**
 * Achète des salles de classe.
 */
function buyClasse() {
    const cost = gameState.coutClasseEnEleves;
    if (gameState.nombreEleves.gte(cost)) {
        gameState.nombreEleves = gameState.nombreEleves.sub(cost);
        gameState.nombreClasses = gameState.nombreClasses.add(1);
        gameState.coutEleveBase = gameState.coutEleveBase.mul(1.05);
        recalculateGameValues();
        updateUI();
        showNotification('Acheté une salle de classe !', 'success');
    } else {
        showNotification("Pas assez d'élèves pour acheter une salle de classe.", 'error');
    }
}

/**
 * Achète des images.
 */
function buyImage(quantity = new Decimal(1), isAutomated = false) {
    let actualQuantity = quantity;

    if (!isAutomated) {
        if (gameState.currentPurchaseMultiplier !== 1 && gameState.currentPurchaseMultiplier !== Infinity) {
            actualQuantity = new Decimal(gameState.currentPurchaseMultiplier);
        }
        if (gameState.currentPurchaseMultiplier === Infinity) {
            actualQuantity = gameState.bonsPoints.div(gameState.coutImage).floor();
        }
    }

    if (actualQuantity.lt(1)) return;

    const totalCost = gameState.coutImage.mul(actualQuantity);

    if (gameState.bonsPoints.gte(totalCost)) {
        gameState.bonsPoints = gameState.bonsPoints.sub(totalCost);
        gameState.images = gameState.images.add(actualQuantity);
        updateUI();
        if (!isAutomated) {
            showNotification(`Acheté ${formatNumber(actualQuantity)} image(s) !`, 'success');
        }
    } else if (!isAutomated) {
        showNotification("Pas assez de Bons Points pour acheter cette image.", 'error');
    }
}

/**
 * Achète des professeurs.
 */
function buyProfesseur(quantity = new Decimal(1), isAutomated = false) {
    let actualQuantity = quantity;

    if (!isAutomated) {
        if (gameState.currentPurchaseMultiplier !== 1 && gameState.currentPurchaseMultiplier !== Infinity) {
            actualQuantity = new Decimal(gameState.currentPurchaseMultiplier);
        }
        if (gameState.currentPurchaseMultiplier === Infinity) {
            actualQuantity = gameState.images.div(gameState.coutProfesseur).floor();
        }
    }

    if (actualQuantity.lt(1)) return;

    const totalCost = gameState.coutProfesseur.mul(actualQuantity);

    if (gameState.images.gte(totalCost)) {
        gameState.images = gameState.images.sub(totalCost);
        gameState.nombreProfesseurs = gameState.nombreProfesseurs.add(actualQuantity);
        recalculateGameValues();
        updateUI();
        if (!isAutomated) {
            showNotification(`Acheté ${formatNumber(actualQuantity)} professeur(s) !`, 'success');
        }
    } else if (!isAutomated) {
        showNotification("Pas assez d'Images pour acheter ce professeur.", 'error');
    }
}

// =============================================================================
// 4. Mécanique d'Ascension
// =============================================================================

/**
 * Gère le processus d'ascension.
 */
function ascend() {
    const paGained = calculatePotentialPA();
    if (paGained.lt(1)) {
        showNotification("Vous n'avez pas assez de professeurs pour ascensionner et gagner des PA.", 'error');
        return;
    }

    showModal('confirmAscensionModal');
    document.getElementById('paGainedDisplay').textContent = formatNumber(paGained);

    const firstAscensionWarning = document.getElementById('firstAscensionWarning');
    const subsequentAscensionWarning = document.getElementById('subsequentAscensionWarning');

    if (firstAscensionWarning && subsequentAscensionWarning) {
        if (gameState.ascensionCount.eq(0) && !gameState.disableAscensionWarning) {
            firstAscensionWarning.classList.remove('hidden');
            subsequentAscensionWarning.classList.add('hidden');
        } else {
            firstAscensionWarning.classList.add('hidden');
            subsequentAscensionWarning.classList.remove('hidden');
        }
    }

    document.getElementById('confirmAscensionYes').onclick = () => {
        hideModal('confirmAscensionModal');
        performAscension(paGained);
    };

    document.getElementById('confirmAscensionNo').onclick = () => {
        hideModal('confirmAscensionModal');
    };
}

function performAscension(paGained) {
    gameState.ascensionPoints = gameState.ascensionPoints.add(paGained);
    gameState.totalPAEarned = gameState.totalPAEarned.add(paGained);
    gameState.ascensionCount = gameState.ascensionCount.add(1);

    // Sauvegarder les flags qui doivent persister
    const persistentData = {
        ascensionPoints: gameState.ascensionPoints,
        totalPAEarned: gameState.totalPAEarned,
        ascensionCount: gameState.ascensionCount,
        disableEleveWarning: gameState.disableEleveWarning,
        disableAscensionWarning: gameState.disableAscensionWarning,
        themeOptionUnlocked: gameState.themeOptionUnlocked,
        currentTheme: gameState.currentTheme,
        multiPurchaseOptionUnlocked: gameState.multiPurchaseOptionUnlocked,
        maxPurchaseOptionUnlocked: gameState.maxPurchaseOptionUnlocked,
        newSettingsUnlocked: gameState.newSettingsUnlocked,
        automationCategoryUnlocked: gameState.automationCategoryUnlocked,
        autoEleveActive: gameState.autoEleveActive,
        autoImageActive: gameState.autoImageActive,
        autoProfesseurActive: gameState.autoProfesseurActive,
        schoolCount: gameState.schoolCount,
        coutEcoleBase: gameState.coutEcoleBase,
        coutEcoleActuel: gameState.coutEcoleActuel,
        schoolMultiplier: gameState.schoolMultiplier,
    };

    // Réinitialiser l'état du jeu
    const newState = getInitialGameState();
    
    // Restaurer les données persistantes
    for (const key in persistentData) {
        newState[key] = persistentData[key];
    }

    resetGameState(newState);
    recalculateGameValues();
    saveGame();
    updateUI();
    showNotification(`Ascension effectuée ! Vous avez gagné ${formatNumber(paGained)} PA.`, 'success');
}

/**
 * Achète une école avec des Points d'Ascension.
 */
function buySchool() {
    const cost = gameState.coutEcoleActuel;
    if (gameState.ascensionPoints.gte(cost)) {
        gameState.ascensionPoints = gameState.ascensionPoints.sub(cost);
        gameState.schoolCount = gameState.schoolCount.add(1);
        recalculateGameValues();
        updateUI();
        showNotification('École achetée !', 'success');
    } else {
        showNotification("Pas assez de Points d'Ascension pour acheter une école.", 'error');
    }
}

// =============================================================================
// 5. Améliorations d'Ascension
// =============================================================================

function unlockMultiPurchase() {
    const cost = new Decimal(10);
    if (gameState.ascensionPoints.gte(cost)) {
        gameState.ascensionPoints = gameState.ascensionPoints.sub(cost);
        gameState.multiPurchaseOptionUnlocked = true;
        updateUI();
        showNotification('Achat multiple débloqué !', 'success');
    } else {
        showNotification("Pas assez de PA pour débloquer l'achat multiple.", 'error');
    }
}

function unlockMaxPurchase() {
    const cost = new Decimal(100);
    if (gameState.ascensionPoints.gte(cost)) {
        gameState.ascensionPoints = gameState.ascensionPoints.sub(cost);
        gameState.maxPurchaseOptionUnlocked = true;
        updateUI();
        showNotification('Achat Max débloqué !', 'success');
    } else {
        showNotification("Pas assez de PA pour débloquer l'achat Max.", 'error');
    }
}

function unlockNewSettings() {
    const cost = new Decimal(10);
    if (gameState.ascensionPoints.gte(cost)) {
        gameState.ascensionPoints = gameState.ascensionPoints.sub(cost);
        gameState.newSettingsUnlocked = true;
        updateUI();
        showNotification('Nouveaux réglages débloqués !', 'success');
    } else {
        showNotification("Pas assez de PA pour débloquer de nouveaux réglages.", 'error');
    }
}

function unlockAutomationCategory() {
    const cost = new Decimal(1000);
    if (gameState.ascensionPoints.gte(cost)) {
        gameState.ascensionPoints = gameState.ascensionPoints.sub(cost);
        gameState.automationCategoryUnlocked = true;
        updateUI();
        showNotification("Catégorie d'automatisation débloquée !", 'success');
    } else {
        showNotification("Pas assez de PA pour débloquer l'automatisation.", 'error');
    }
}

// =============================================================================
// 6. Automatisation
// =============================================================================

function toggleAutoEleve() {
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
    updateUI();
}

function toggleAutoImage() {
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
    updateUI();
}

function toggleAutoProfesseur() {
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
    updateUI();
}

// =============================================================================
// 7. Paramètres
// =============================================================================

function resetProgression() {
    const cost = new Decimal(10);
    if (gameState.images.gte(cost)) {
        showModal('confirmResetModal');
        document.getElementById('confirmResetYes').onclick = () => {
            hideModal('confirmResetModal');
            
            const flagsToKeep = {
                disableEleveWarning: gameState.disableEleveWarning,
                disableAscensionWarning: gameState.disableAscensionWarning,
                themeOptionUnlocked: gameState.themeOptionUnlocked,
                currentTheme: gameState.currentTheme,
                multiPurchaseOptionUnlocked: gameState.multiPurchaseOptionUnlocked,
                maxPurchaseOptionUnlocked: gameState.maxPurchaseOptionUnlocked,
                newSettingsUnlocked: gameState.newSettingsUnlocked,
                automationCategoryUnlocked: gameState.automationCategoryUnlocked,
                autoEleveActive: gameState.autoEleveActive,
                autoImageActive: gameState.autoImageActive,
                autoProfesseurActive: gameState.autoProfesseurActive,
            };

            const newState = getInitialGameState();
            newState.images = newState.images.sub(cost);

            for (const key in flagsToKeep) {
                newState[key] = flagsToKeep[key];
            }

            resetGameState(newState);
            saveGame();
            location.reload();
        };
        document.getElementById('confirmResetNo').onclick = () => {
            hideModal('confirmResetModal');
        };
    } else {
        showNotification("Pas assez d'Images pour réinitialiser la progression.", 'error');
    }
}

function setPurchaseMultiplier(multiplier) {
    gameState.currentPurchaseMultiplier = multiplier;
    
    document.querySelectorAll('#purchaseMultiplierSelection button').forEach(btn => {
        btn.classList.remove('active');
    });
    
    if (multiplier === Infinity) {
        document.getElementById('setMultiplierXMax')?.classList.add('active');
    } else {
        document.getElementById(`setMultiplierX${multiplier}`)?.classList.add('active');
    }
    
    updateUI();
}

// =============================================================================
// 8. Boucle de Jeu
// =============================================================================

function gameLoop(timestamp) {
    const deltaTime = (timestamp - gameState.lastTickTime) / 1000;
    gameState.lastTickTime = timestamp;

    // Calcul de la production de Bons Points
    const totalBps = gameState.bonsPointsParSecondeEleves
        .add(gameState.bonsPointsParSecondeClasses)
        .mul(gameState.ascensionBonusMultiplier)
        .mul(gameState.schoolMultiplier);
    gameState.bonsPoints = gameState.bonsPoints.add(totalBps.mul(deltaTime));

    // Logique d'automatisation
    if (gameState.automationCategoryUnlocked) {
        if (gameState.autoEleveActive) {
            const currentCost = gameState.coutEleveActuel;
            if (gameState.bonsPoints.gte(currentCost)) {
                const numToBuy = (gameState.currentPurchaseMultiplier === Infinity) ?
                    gameState.bonsPoints.div(currentCost).floor() :
                    new Decimal(gameState.currentPurchaseMultiplier);
                buyEleve(numToBuy, true);
            }
        }
        
        if (gameState.autoImageActive) {
            const currentCost = gameState.coutImage;
            if (gameState.bonsPoints.gte(currentCost)) {
                const numToBuy = (gameState.currentPurchaseMultiplier === Infinity) ?
                    gameState.bonsPoints.div(currentCost).floor() :
                    new Decimal(gameState.currentPurchaseMultiplier);
                buyImage(numToBuy, true);
            }
        }
        
        if (gameState.autoProfesseurActive) {
            const currentCost = gameState.coutProfesseur;
            if (gameState.images.gte(currentCost)) {
                const numToBuy = (gameState.currentPurchaseMultiplier === Infinity) ?
                    gameState.images.div(currentCost).floor() :
                    new Decimal(gameState.currentPurchaseMultiplier);
                buyProfesseur(numToBuy, true);
            }
        }
    }

    recalculateGameValues();
    updateUI();
    requestAnimationFrame(gameLoop);
}

function startGameLoop() {
    requestAnimationFrame(gameLoop);
    setInterval(saveGame, AUTOSAVE_INTERVAL);
}

// =============================================================================
// 9. Gestion des Événements
// =============================================================================

function setupEventListeners() {
    // Boutons d'action
    document.getElementById('etudierButton')?.addEventListener('click', etudierSagement);
    document.getElementById('acheterEleveButton')?.addEventListener('click', () => buyEleve(new Decimal(1)));
    document.getElementById('acheterClasseButton')?.addEventListener('click', buyClasse);
    document.getElementById('acheterImageButton')?.addEventListener('click', () => buyImage(new Decimal(1)));
    document.getElementById('acheterProfesseurButton')?.addEventListener('click', () => buyProfesseur(new Decimal(1)));

    // Boutons de navigation
    document.getElementById('skillsButton')?.addEventListener('click', () => showMainContainer('skillTreeContainer'));
    document.getElementById('settingsButton')?.addEventListener('click', () => showMainContainer('settingsContainer'));
    document.getElementById('ascensionButton')?.addEventListener('click', ascend);
    document.getElementById('ascensionMenuButton')?.addEventListener('click', () => showMainContainer('ascensionMenuContainer'));

    // Boutons de retour
    document.querySelectorAll('.back-button').forEach(button => {
        button.addEventListener('click', () => showMainContainer('main-content'));
    });

    // Gestion des modales
    document.querySelectorAll('.modal .close').forEach(button => {
        button.addEventListener('click', (event) => {
            hideModal(event.target.closest('.modal').id);
        });
    });

    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                hideModal(modal.id);
            }
        });
    });

    // Checkboxes
    document.getElementById('disableEleveWarningCheckbox')?.addEventListener('change', (event) => {
        gameState.disableEleveWarning = event.target.checked;
        saveGame();
    });

    document.getElementById('disableAscensionWarningCheckbox')?.addEventListener('change', (event) => {
        gameState.disableAscensionWarning = event.target.checked;
        saveGame();
    });

    // Paramètres
    document.getElementById('themeToggleButton')?.addEventListener('click', () => toggleTheme(saveGame));
    document.getElementById('resetProgressionButton')?.addEventListener('click', resetProgression);

    // Menu Ascension
    document.getElementById('acheterEcoleButton')?.addEventListener('click', buySchool);
    document.getElementById('unlockMultiPurchaseButton')?.addEventListener('click', unlockMultiPurchase);
    document.getElementById('unlockMaxPurchaseButton')?.addEventListener('click', unlockMaxPurchase);
    document.getElementById('unlockNewSettingsButton')?.addEventListener('click', unlockNewSettings);
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

    // Compétences
    document.getElementById('resetSkillsButton')?.addEventListener('click', () => 
        resetSkills(saveGame, updateUI, recalculateGameValues)
    );
}

// =============================================================================
// 10. Initialisation
// =============================================================================

document.addEventListener('DOMContentLoaded', () => {
    // Charger la partie
    loadGame();
    recalculateGameValues();
    updateUI();

    // Générer l'arbre de compétences
    generateSkillTreeUI();

    // Configurer les événements
    setupEventListeners();

    // Démarrer la boucle de jeu
    startGameLoop();

    // Afficher le conteneur principal
    showMainContainer('main-content');
});
