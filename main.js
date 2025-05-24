/*
 * Fichier: main.js
 * Description: Logique principale du jeu incrémental.
 * Gère l'état du jeu, les calculs, l'interface utilisateur,
 * la sauvegarde et le chargement.
 */

// Importation de la bibliothèque break_infinity.js
// Assurez-vous que break_infinity.min.js est bien dans le dossier js/
// <script src="js/break_infinity.min.js"></script> doit être inclus dans index.html AVANT main.js

// =============================================================================
// 0. Initialisation de l'état du jeu (GameState)
// =============================================================================

/**
 * @typedef {Object} GameState
 * @property {Decimal} bonsPoints - Monnaie principale du jeu.
 * @property {Decimal} nombreEleves - Nombre d'élèves possédés.
 * @property {Decimal} coutEleveBase - Coût de base d'un élève.
 * @property {Decimal} coutEleveActuel - Coût actuel d'un élève.
 * @property {Decimal} bonsPointsParSecondeEleves - Production de BP/s des élèves.
 * @property {Decimal} nombreClasses - Nombre de salles de classe possédées.
 * @property {Decimal} coutClasseEnEleves - Coût d'une classe en élèves.
 * @property {Decimal} bonsPointsParSecondeClasses - Production de BP/s des classes.
 * @property {Decimal} images - Ressource secondaire.
 * @property {Decimal} coutImage - Coût d'une image en BP.
 * @property {Decimal} nombreProfesseurs - Nombre total de professeurs.
 * @property {Decimal} coutProfesseur - Coût d'un professeur en Images.
 * @property {Decimal} professorsUsedForSkills - Professeurs dépensés en compétences.
 * @property {Decimal} availableProfessors - Professeurs disponibles pour les compétences.
 * @property {Decimal} ascensionPoints - Points d'Ascension non dépensés.
 * @property {Decimal} totalPAEarned - Total des PA gagnés cumulés.
 * @property {Decimal} ascensionCount - Nombre d'ascensions effectuées.
 * @property {Decimal} ascensionBonusMultiplier - Multiplicateur de bonus d'ascension.
 * @property {Decimal} schoolCount - Nombre d'écoles.
 * @property {Decimal} coutEcoleBase - Coût de base d'une école en PA.
 * @property {Decimal} coutEcoleActuel - Coût actuel d'une école en PA.
 * @property {Decimal} schoolMultiplier - Multiplicateur de production des écoles.
 * @property {string} currentTheme - Thème actuel ('dark' ou 'light').
 * @property {boolean} disableEleveWarning - Si l'avertissement d'achat d'élève est désactivé.
 * @property {boolean} disableAscensionWarning - Si l'avertissement d'ascension est désactivé.
 * @property {boolean} themeOptionUnlocked - Si l'option de thème est débloquée.
 * @property {boolean} multiPurchaseOptionUnlocked - Si l'option d'achat multiple est débloquée.
 * @property {boolean} maxPurchaseOptionUnlocked - Si l'option d'achat max est débloquée.
 * @property {boolean} newSettingsUnlocked - Si les nouveaux réglages sont débloqués.
 * @property {boolean} automationCategoryUnlocked - Si la catégorie d'automatisation est débloquée.
 * @property {boolean} autoEleveActive - Si l'automatisation des élèves est active.
 * @property {boolean} autoImageActive - Si l'automatisation des images est active.
 * @property {boolean} autoProfesseurActive - Si l'automatisation des professeurs est active.
 * @property {Object.<string, boolean>} unlockedSkills - Compétences débloquées.
 * @property {Object} skillEffects - Effets des compétences sur le jeu.
 * @property {number} currentPurchaseMultiplier - Multiplicateur d'achat (1, 10, 100, ou Infinity pour 'max').
 * @property {number} lastTickTime - Horodatage du dernier tick pour le calcul du delta.
 */

let gameState = {}; // L'objet global qui contiendra toutes les données du jeu

/**
 * Initialise l'état du jeu avec les valeurs par défaut.
 * @returns {GameState} L'état du jeu initialisé.
 */
function getInitialGameState() {
    return {
        bonsPoints: new Decimal(0),
        nombreEleves: new Decimal(0),
        coutEleveBase: new Decimal(10),
        coutEleveActuel: new Decimal(10), // Sera recalculé
        bonsPointsParSecondeEleves: new Decimal(0),

        nombreClasses: new Decimal(0),
        coutClasseEnEleves: new Decimal(30),
        bonsPointsParSecondeClasses: new Decimal(0),

        images: new Decimal(0),
        coutImage: new Decimal(1000), // Coût initial d'une image

        nombreProfesseurs: new Decimal(0),
        coutProfesseur: new Decimal(2), // Coût initial d'un professeur en Images
        professorsUsedForSkills: new Decimal(0),
        availableProfessors: new Decimal(0), // Calculé dynamiquement

        ascensionPoints: new Decimal(0),
        totalPAEarned: new Decimal(0),
        ascensionCount: new Decimal(0),
        ascensionBonusMultiplier: new Decimal(1),

        schoolCount: new Decimal(0),
        coutEcoleBase: new Decimal(15),
        coutEcoleActuel: new Decimal(15),
        schoolMultiplier: new Decimal(1),

        currentTheme: 'dark', // Thème par défaut
        disableEleveWarning: false,
        disableAscensionWarning: false,
        themeOptionUnlocked: false,
        multiPurchaseOptionUnlocked: false,
        maxPurchaseOptionUnlocked: false,
        newSettingsUnlocked: false,
        automationCategoryUnlocked: false,
        autoEleveActive: false,
        autoImageActive: false,
        autoProfesseurActive: false,

        unlockedSkills: {}, // { skillId: true }
        skillEffects: { // Stocke les bonus appliqués par les compétences
            eleveBpsBonus: new Decimal(1),
            classeMultiplierBonus: new Decimal(1),
            eleveCostReduction: new Decimal(1),
            // Ajoutez d'autres effets de compétences ici au besoin
        },

        currentPurchaseMultiplier: 1, // 1, 10, 100, Infinity (pour max)
        lastTickTime: Date.now(), // Pour le calcul du delta time
    };
}

// =============================================================================
// 1. Fonctions utilitaires pour les grands nombres et l'affichage
// =============================================================================

/**
 * Formate un nombre Decimal en notation scientifique ou avec des suffixes.
 * @param {Decimal} number - Le nombre à formater.
 * @returns {string} Le nombre formaté.
 */
function formatNumber(number) {
    if (number.lt(1000000)) { // Moins d'un million, affichage normal
        return number.floor().toString();
    }
    // Utilise la notation scientifique de break_infinity.js
    return number.toExponential(2); // Ex: 1.23e6
}

// =============================================================================
// 2. Système de Sauvegarde et Chargement
// =============================================================================

const SAVE_KEY = 'incrementalGameSave';

/**
 * Sauvegarde l'état actuel du jeu dans le localStorage.
 */
function saveGame() {
    try {
        // Convertir les objets Decimal en chaînes pour la sauvegarde
        const saveState = {};
        for (const key in gameState) {
            if (gameState[key] instanceof Decimal) {
                saveState[key] = gameState[key].toString();
            } else if (typeof gameState[key] === 'object' && gameState[key] !== null && !Array.isArray(gameState[key])) {
                // Gérer les objets imbriqués comme skillEffects
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
 * Si aucune sauvegarde n'existe ou si elle est invalide, initialise une nouvelle partie.
 */
function loadGame() {
    try {
        const savedState = localStorage.getItem(SAVE_KEY);
        if (savedState) {
            const parsedState = JSON.parse(savedState);
            const newState = getInitialGameState(); // Commencer avec un état propre pour les nouvelles propriétés

            for (const key in newState) {
                if (parsedState.hasOwnProperty(key)) {
                    if (newState[key] instanceof Decimal) {
                        newState[key] = new Decimal(parsedState[key]);
                    } else if (typeof newState[key] === 'object' && newState[key] !== null && !Array.isArray(newState[key])) {
                        // Gérer les objets imbriqués comme skillEffects
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
            gameState = newState;
            console.log("Partie chargée avec succès !");
            showNotification('Partie chargée !', 'success');
        } else {
            console.log("Aucune sauvegarde trouvée, nouvelle partie initiée.");
            gameState = getInitialGameState();
        }
    } catch (e) {
        console.error("Erreur lors du chargement de la sauvegarde :", e);
        console.log("Sauvegarde corrompue ou inexistante, nouvelle partie initiée.");
        showNotification('Sauvegarde corrompue, nouvelle partie !', 'error');
        gameState = getInitialGameState();
    }
    // Assurer que lastTickTime est mis à jour pour éviter un gros delta au démarrage
    gameState.lastTickTime = Date.now();
    applyTheme(gameState.currentTheme); // Appliquer le thème au chargement
}

// =============================================================================
// 3. Moteur de Jeu Principal (Game Loop)
// =============================================================================

let gameLoopInterval; // Pour stocker l'ID de l'intervalle

/**
 * Met à jour l'interface utilisateur avec les valeurs actuelles de gameState.
 */
function updateUI() {
    // Ressources
    document.getElementById('bonsPoints').textContent = formatNumber(gameState.bonsPoints);
    document.getElementById('imagesCount').textContent = formatNumber(gameState.images);
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
            acheterEleveButton.classList.add('cannot-afford'); // Ajouter une classe pour le style CSS si besoin
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


    // Visibilité des sections (Phase 1)
    const achatClasseSection = document.getElementById('achatClasseSection');
    if (achatClasseSection) {
        if (gameState.nombreEleves.gte(20)) { // Exemple de déblocage pour les classes
            achatClasseSection.classList.remove('hidden');
        } else {
            achatClasseSection.classList.add('hidden');
        }
    }


    // Visibilité des sections (Phase 2)
    const imagesDisplay = document.getElementById('imagesDisplay');
    const achatImageSection = document.getElementById('achatImageSection');
    if (imagesDisplay && achatImageSection) {
        if (gameState.bonsPoints.gte(500)) { // Exemple de déblocage pour les images
            imagesDisplay.classList.remove('hidden');
            achatImageSection.classList.remove('hidden');
        } else {
            imagesDisplay.classList.add('hidden');
            achatImageSection.classList.add('hidden');
        }
    }


    const achatProfesseurSection = document.getElementById('achatProfesseurSection');
    const skillsButton = document.getElementById('skillsButton');
    if (achatProfesseurSection && skillsButton) {
        if (gameState.images.gte(1)) { // Exemple de déblocage pour les professeurs
            achatProfesseurSection.classList.remove('hidden');
            skillsButton.classList.remove('hidden');
        } else {
            achatProfesseurSection.classList.add('hidden');
            skillsButton.classList.add('hidden');
        }
    }


    // Mettre à jour les professeurs disponibles dans l'arbre de compétences (si visible)
    const skillTreeContainer = document.getElementById('skillTreeContainer');
    if (skillTreeContainer && !skillTreeContainer.classList.contains('hidden')) {
        gameState.availableProfessors = gameState.nombreProfesseurs.sub(gameState.professorsUsedForSkills);
        document.getElementById('availableProfessorsCount').textContent = formatNumber(gameState.availableProfessors);
        // Mettre à jour l'état des compétences
        updateSkillTreeUI();
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
        if (gameState.images.gte(1) || gameState.bonsPoints.gte(10000)) { // Exemple de déblocage pour les paramètres
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
        if (gameState.ascensionCount.gt(0)) { // Débloquer le bouton ascensionMenuButton après la première ascension
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
        paGainedDisplay.textContent = formatNumber(calculatePotentialPA());
    }

    // Mettre à jour les PA disponibles dans le menu d'ascension
    const ascensionMenuContainer = document.getElementById('ascensionMenuContainer');
    const ascensionMenuPACount = document.getElementById('ascensionMenuPACount');
    if (ascensionMenuContainer && ascensionMenuPACount && !ascensionMenuContainer.classList.contains('hidden')) {
        ascensionMenuPACount.textContent = formatNumber(gameState.ascensionPoints);
    }

    // Visibilité des multiplicateurs d'achat (Phase 5)
    const purchaseMultiplierSelection = document.getElementById('purchaseMultiplierSelection');
    const unlockMultiPurchaseButton = document.getElementById('unlockMultiPurchaseButton');
    if (purchaseMultiplierSelection && unlockMultiPurchaseButton) {
        if (gameState.multiPurchaseOptionUnlocked) {
            purchaseMultiplierSelection.classList.remove('hidden');
            unlockMultiPurchaseButton.classList.add('hidden'); // Cacher le bouton d'achat si débloqué
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


    // Visibilité de la section d'automatisation (Phase 6)
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

/**
 * Calcule toutes les productions et coûts affectés par les bonus.
 */
function recalculateGameValues() {
    // Coût des élèves
    gameState.coutEleveActuel = gameState.coutEleveBase.mul(Decimal.pow(1.15, gameState.nombreEleves));
    // Appliquer la réduction de coût des compétences si elle existe
    gameState.coutEleveActuel = gameState.coutEleveActuel.div(gameState.skillEffects.eleveCostReduction);

    // Production des élèves
    const baseEleveProduction = new Decimal(0.5); // 0.5 BP/s par élève
    gameState.bonsPointsParSecondeEleves = gameState.nombreEleves.mul(baseEleveProduction).mul(gameState.skillEffects.eleveBpsBonus);

    // Production des classes
    const baseClasseProduction = new Decimal(25); // 25 BP/s par classe
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
 * La boucle principale du jeu.
 * @param {DOMHighResTimeStamp} timestamp - Le temps actuel (fourni par requestAnimationFrame).
 */
function gameLoop(timestamp) {
    const deltaTime = (timestamp - gameState.lastTickTime) / 1000; // delta en secondes
    gameState.lastTickTime = timestamp;

    // Calcul de la production de Bons Points
    const totalBps = gameState.bonsPointsParSecondeEleves
        .add(gameState.bonsPointsParSecondeClasses)
        .mul(gameState.ascensionBonusMultiplier)
        .mul(gameState.schoolMultiplier);
    gameState.bonsPoints = gameState.bonsPoints.add(totalBps.mul(deltaTime));

    // Logique d'automatisation (Phase 6)
    if (gameState.automationCategoryUnlocked) {
        // Automatiser les élèves
        if (gameState.autoEleveActive) {
            // Tenter d'acheter un élève (ou le max possible) si abordable
            const currentCost = gameState.coutEleveActuel;
            if (gameState.bonsPoints.gte(currentCost)) {
                const numToBuy = (gameState.currentPurchaseMultiplier === Infinity) ?
                    gameState.bonsPoints.div(currentCost).floor() :
                    new Decimal(gameState.currentPurchaseMultiplier);
                buyEleve(numToBuy, true); // Le second paramètre indique que c'est un achat auto
            }
        }
        // Automatiser les images
        if (gameState.autoImageActive) {
            const currentCost = gameState.coutImage;
            if (gameState.bonsPoints.gte(currentCost)) {
                const numToBuy = (gameState.currentPurchaseMultiplier === Infinity) ?
                    gameState.bonsPoints.div(currentCost).floor() :
                    new Decimal(gameState.currentPurchaseMultiplier);
                buyImage(numToBuy, true);
            }
        }
        // Automatiser les professeurs
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

    recalculateGameValues(); // Recalculer les valeurs à chaque tick
    updateUI(); // Mettre à jour l'interface utilisateur

    requestAnimationFrame(gameLoop); // Demander le prochain frame
}

/**
 * Démarre la boucle de jeu.
 */
function startGameLoop() {
    // Utilisation de requestAnimationFrame pour une boucle de jeu plus fluide
    // et qui s'adapte au taux de rafraîchissement de l'écran.
    requestAnimationFrame(gameLoop);
    // Sauvegarde automatique toutes les 30 secondes
    setInterval(saveGame, 30000);
}

// =============================================================================
// 4. Fonctions d'interaction utilisateur (clics, modales)
// =============================================================================

/**
 * Affiche une notification.
 * @param {string} message - Le message à afficher.
 * @param {'success'|'error'|'info'} type - Le type de notification pour le style CSS.
 */
function showNotification(message, type = 'info') {
    const container = document.getElementById('notifications-container');
    if (!container) return; // S'assurer que le conteneur existe

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
function showModal(modalId) {
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
function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        modal.classList.add('hidden');
    }
}

/**
 * Gère le clic sur le bouton "Étudier sagement".
 */
function etudierSagement() {
    gameState.bonsPoints = gameState.bonsPoints.add(1);
    updateUI();
}

/**
 * Achète des élèves.
 * @param {Decimal} [quantity=new Decimal(1)] - La quantité d'élèves à acheter.
 * @param {boolean} [isAutomated=false] - Indique si l'achat est automatisé.
 */
function buyEleve(quantity = new Decimal(1), isAutomated = false) {
    let actualQuantity = quantity;

    if (!isAutomated) { // Si l'achat n'est pas automatisé, utiliser le multiplicateur d'achat UI
        if (gameState.currentPurchaseMultiplier !== 1 && gameState.currentPurchaseMultiplier !== Infinity) {
            actualQuantity = new Decimal(gameState.currentPurchaseMultiplier);
        }
        if (gameState.currentPurchaseMultiplier === Infinity) { // Achat max
            actualQuantity = gameState.bonsPoints.div(gameState.coutEleveActuel).floor();
        }
    }

    if (actualQuantity.lt(1)) return;

    let totalCost = new Decimal(0);
    let tempNombreEleves = gameState.nombreEleves;
    let affordableCount = new Decimal(0);

    // Calculer le coût total pour la quantité demandée ou la quantité maximale abordable
    for (let i = 0; i < actualQuantity.toNumber() + 1; i++) { // +1 pour s'assurer de couvrir le cas où actualQuantity est petit
        const costPerUnit = gameState.coutEleveBase.mul(Decimal.pow(1.15, tempNombreEleves.add(i))).div(gameState.skillEffects.eleveCostReduction);
        if (gameState.bonsPoints.gte(totalCost.add(costPerUnit))) {
            totalCost = totalCost.add(costPerUnit);
            affordableCount = affordableCount.add(1);
        } else {
            break;
        }
    }

    // Si l'achat est automatisé, on achète seulement ce qui est abordable sans avertissement
    if (isAutomated) {
        if (affordableCount.gt(0)) {
            const finalCost = calculateTotalCost(gameState.nombreEleves, affordableCount, gameState.coutEleveBase, new Decimal(1.15), gameState.skillEffects.eleveCostReduction);
            if (gameState.bonsPoints.gte(finalCost)) {
                gameState.bonsPoints = gameState.bonsPoints.sub(finalCost);
                gameState.nombreEleves = gameState.nombreEleves.add(affordableCount);
                recalculateGameValues();
                // showNotification(`Auto-acheté ${formatNumber(affordableCount)} élève(s)!`, 'info'); // Trop de notifications
            }
        }
        return;
    }

    // Logique pour les achats manuels avec avertissement
    if (actualQuantity.gt(0)) {
        const finalCost = calculateTotalCost(gameState.nombreEleves, actualQuantity, gameState.coutEleveBase, new Decimal(1.15), gameState.skillEffects.eleveCostReduction);

        if (gameState.bonsPoints.gte(finalCost)) {
            if (gameState.nombreEleves.mod(30).eq(0) && actualQuantity.gt(0) && !gameState.disableEleveWarning) {
                showModal('confirmElevePurchaseModal');
                document.getElementById('confirmElevePurchaseYes').onclick = () => {
                    hideModal('confirmElevePurchaseModal');
                    performElevePurchase(finalCost, actualQuantity);
                };
                return;
            }
            performElevePurchase(finalCost, actualQuantity);
        } else {
            showNotification("Pas assez de Bons Points pour acheter cet élève.", 'error');
        }
    }
}

/**
 * Calcule le coût total pour l'achat de N unités avec un coût exponentiel.
 * @param {Decimal} currentOwned - Nombre d'unités déjà possédées.
 * @param {Decimal} quantityToBuy - Nombre d'unités à acheter.
 * @param {Decimal} baseCost - Coût de base.
 * @param {Decimal} growthRate - Taux de croissance exponentiel.
 * @param {Decimal} costReduction - Réduction de coût (ex: skill effect).
 * @returns {Decimal} Le coût total.
 */
function calculateTotalCost(currentOwned, quantityToBuy, baseCost, growthRate, costReduction) {
    let totalCost = new Decimal(0);
    for (let i = 0; i < quantityToBuy.toNumber(); i++) {
        totalCost = totalCost.add(baseCost.mul(Decimal.pow(growthRate, currentOwned.add(i))).div(costReduction));
    }
    return totalCost;
}


/**
 * Effectue l'achat réel des élèves après confirmation.
 * @param {Decimal} cost - Le coût total des élèves.
 * @param {Decimal} quantity - La quantité d'élèves achetés.
 */
function performElevePurchase(cost, quantity) {
    if (gameState.bonsPoints.gte(cost)) {
        gameState.bonsPoints = gameState.bonsPoints.sub(cost);
        gameState.nombreEleves = gameState.nombreEleves.add(quantity);
        recalculateGameValues();
        updateUI();
        showNotification(`Acheté ${formatNumber(quantity)} élève(s)!`, 'success');
    } else {
        showNotification("Pas assez de Bons Points pour acheter cet élève.", 'error');
    }
}


/**
 * Achète des salles de classe.
 */
function buyClasse() {
    const cost = gameState.coutClasseEnEleves;
    if (gameState.nombreEleves.gte(cost)) {
        gameState.nombreEleves = gameState.nombreEleves.sub(cost); // Les élèves sont "consommés" pour les classes
        gameState.nombreClasses = gameState.nombreClasses.add(1);
        // L'achat d'une classe augmente le coût des élèves futurs (multiplicateur au coutEleveBase)
        gameState.coutEleveBase = gameState.coutEleveBase.mul(1.05); // Exemple: +5% au coût de base des élèves
        recalculateGameValues();
        updateUI();
        showNotification('Acheté une salle de classe !', 'success');
    } else {
        showNotification("Pas assez d'élèves pour acheter une salle de classe.", 'error');
    }
}

/**
 * Achète des images.
 * @param {Decimal} [quantity=new Decimal(1)] - La quantité d'images à acheter.
 * @param {boolean} [isAutomated=false] - Indique si l'achat est automatisé.
 */
function buyImage(quantity = new Decimal(1), isAutomated = false) {
    let actualQuantity = quantity;

    if (!isAutomated) {
        if (gameState.currentPurchaseMultiplier !== 1 && gameState.currentPurchaseMultiplier !== Infinity) {
            actualQuantity = new Decimal(gameState.currentPurchaseMultiplier);
        }
        if (gameState.currentPurchaseMultiplier === Infinity) { // Achat max
            actualQuantity = gameState.bonsPoints.div(gameState.coutImage).floor();
        }
    }

    if (actualQuantity.lt(1)) return;

    const costPerUnit = gameState.coutImage; // Coût fixe pour les images pour l'instant
    const totalCost = costPerUnit.mul(actualQuantity);

    if (gameState.bonsPoints.gte(totalCost)) {
        gameState.bonsPoints = gameState.bonsPoints.sub(totalCost);
        gameState.images = gameState.images.add(actualQuantity);
        updateUI();
        if (!isAutomated) {
            showNotification(`Acheté ${formatNumber(actualQuantity)} image(s) !`, 'success');
        }
    } else {
        if (!isAutomated) {
            showNotification("Pas assez de Bons Points pour acheter cette image.", 'error');
        }
    }
}

/**
 * Achète des professeurs.
 * @param {Decimal} [quantity=new Decimal(1)] - La quantité de professeurs à acheter.
 * @param {boolean} [isAutomated=false] - Indique si l'achat est automatisé.
 */
function buyProfesseur(quantity = new Decimal(1), isAutomated = false) {
    const costPerUnit = gameState.coutProfesseur;
    let actualQuantity = quantity;

    if (!isAutomated) {
        if (gameState.currentPurchaseMultiplier !== 1 && gameState.currentPurchaseMultiplier !== Infinity) {
            actualQuantity = new Decimal(gameState.currentPurchaseMultiplier);
        }
        if (gameState.currentPurchaseMultiplier === Infinity) { // Achat max
            actualQuantity = gameState.images.div(costPerUnit).floor();
        }
    }

    if (actualQuantity.lt(1)) return;

    const totalCost = costPerUnit.mul(actualQuantity);

    if (gameState.images.gte(totalCost)) {
        gameState.images = gameState.images.sub(totalCost);
        gameState.nombreProfesseurs = gameState.nombreProfesseurs.add(actualQuantity);
        recalculateGameValues();
        updateUI();
        if (!isAutomated) {
            showNotification(`Acheté ${formatNumber(actualQuantity)} professeur(s) !`, 'success');
        }
    } else {
        if (!isAutomated) {
            showNotification("Pas assez d'Images pour acheter ce professeur.", 'error');
        }
    }
}

/**
 * Calcule le nombre potentiel de Points d'Ascension à gagner.
 * @returns {Decimal} Le nombre de PA potentiels.
 */
function calculatePotentialPA() {
    // Exemple de formule : basé sur le nombre de professeurs
    // Nécessite un certain seuil de professeurs pour commencer à gagner des PA
    const professorThreshold = new Decimal(10);
    if (gameState.nombreProfesseurs.lt(professorThreshold)) {
        return new Decimal(0);
    }
    // Formule simple: (nombreProfesseurs - seuil) / 10, ajustez selon le balancing
    return gameState.nombreProfesseurs.sub(professorThreshold).div(10).floor();
}

/**
 * Gère le processus d'ascension.
 */
function ascend() {
    const paGained = calculatePotentialPA();
    if (paGained.lt(1)) {
        showNotification("Vous n'avez pas assez de professeurs pour ascensionner et gagner des PA.", 'error');
        return;
    }

    // Afficher la modale de confirmation
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
        // Mettre à jour l'état du jeu après confirmation
        gameState.ascensionPoints = gameState.ascensionPoints.add(paGained);
        gameState.totalPAEarned = gameState.totalPAEarned.add(paGained);
        gameState.ascensionCount = gameState.ascensionCount.add(1);

        // Sauvegarder les flags qui doivent persister
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
            // Les propriétés Decimal doivent être converties en string pour flagsToKeep si elles sont persistantes
            schoolCount: gameState.schoolCount.toString(),
            coutEcoleBase: gameState.coutEcoleBase.toString(),
            coutEcoleActuel: gameState.coutEcoleActuel.toString(),
            schoolMultiplier: gameState.schoolMultiplier.toString(),
        };

        // Réinitialiser l'état du jeu
        gameState = getInitialGameState();

        // Restaurer les flags et valeurs persistantes
        for (const key in flagsToKeep) {
            // Reconvertir en Decimal si nécessaire
            if (['schoolCount', 'coutEcoleBase', 'coutEcoleActuel', 'schoolMultiplier'].includes(key)) {
                gameState[key] = new Decimal(flagsToKeep[key]);
            } else {
                gameState[key] = flagsToKeep[key];
            }
        }

        recalculateGameValues(); // Recalculer les bonus d'ascension, etc.
        saveGame(); // Sauvegarder le nouvel état
        updateUI();
        showNotification(`Ascension effectuée ! Vous avez gagné ${formatNumber(paGained)} PA.`, 'success');
    };

    document.getElementById('confirmAscensionNo').onclick = () => {
        hideModal('confirmAscensionModal');
    };
}

/**
 * Achète une école avec des Points d'Ascension.
 */
function buySchool() {
    const cost = gameState.coutEcoleActuel;
    if (gameState.ascensionPoints.gte(cost)) {
        gameState.ascensionPoints = gameState.ascensionPoints.sub(cost);
        gameState.schoolCount = gameState.schoolCount.add(1);
        recalculateGameValues(); // Pour mettre à jour le coût et le multiplicateur de l'école
        updateUI();
        showNotification('École achetée !', 'success');
    } else {
        showNotification("Pas assez de Points d'Ascension pour acheter une école.", 'error');
    }
}

/**
 * Débloque l'option d'achat multiple.
 */
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

/**
 * Débloque l'option d'achat multiple Max.
 */
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

/**
 * Débloque de nouveaux réglages.
 */
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

/**
 * Débloque la catégorie d'automatisation.
 */
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

/**
 * Active/désactive l'automatisation des élèves.
 */
function toggleAutoEleve() {
    const cost = new Decimal(100);
    if (!gameState.autoEleveActive) { // Si l'automatisation est inactive, tenter de l'activer
        if (gameState.ascensionPoints.gte(cost)) {
            gameState.ascensionPoints = gameState.ascensionPoints.sub(cost);
            gameState.autoEleveActive = true;
            showNotification('Automatisation des élèves activée !', 'success');
        } else {
            showNotification("Pas assez de PA pour activer l'automatisation des élèves.", 'error');
        }
    } else { // Si l'automatisation est déjà active, la désactiver
        gameState.autoEleveActive = false;
        showNotification('Automatisation des élèves désactivée.', 'info');
        // Pas de remboursement de PA pour la désactivation
    }
    updateUI();
}

/**
 * Active/désactive l'automatisation des images.
 */
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

/**
 * Active/désactive l'automatisation des professeurs.
 */
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


/**
 * Applique le thème spécifié au corps du document.
 * @param {'dark'|'light'} theme - Le thème à appliquer.
 */
function applyTheme(theme) {
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
 */
function toggleTheme() {
    if (!gameState.themeOptionUnlocked) {
        const cost = new Decimal(10);
        if (gameState.images.gte(cost)) {
            gameState.images = gameState.images.sub(cost);
            gameState.themeOptionUnlocked = true;
            showNotification('Option de thème débloquée !', 'success');
            // Le thème bascule immédiatement après le déblocage
            applyTheme(gameState.currentTheme === 'dark' ? 'light' : 'dark');
            updateUI(); // Mettre à jour le texte du bouton
        } else {
            showNotification("Pas assez d'Images pour débloquer l'option de thème.", 'error');
        }
    } else {
        applyTheme(gameState.currentTheme === 'dark' ? 'light' : 'dark');
    }
    saveGame(); // Sauvegarder la préférence de thème
}

/**
 * Réinitialise la progression du jeu.
 */
function resetProgression() {
    const cost = new Decimal(10); // Coût en images pour réinitialiser
    if (gameState.images.gte(cost)) {
        showModal('confirmResetModal');
        document.getElementById('confirmResetYes').onclick = () => {
            hideModal('confirmResetModal');
            // Réinitialiser tout l'état du jeu à l'exception des flags persistants
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

            gameState = getInitialGameState(); // Réinitialiser tout
            gameState.images = gameState.images.sub(cost); // Déduire le coût de réinitialisation

            // Restaurer les flags persistants
            for (const key in flagsToKeep) {
                gameState[key] = flagsToKeep[key];
            }

            saveGame(); // Sauvegarder l'état réinitialisé
            location.reload(); // Recharger la page pour un reset complet de l'UI
        };
        document.getElementById('confirmResetNo').onclick = () => {
            hideModal('confirmResetModal');
        };
    } else {
        showNotification("Pas assez d'Images pour réinitialiser la progression.", 'error');
    }
}


/**
 * Gère l'affichage/masquage des conteneurs principaux.
 * @param {string} containerIdToShow - L'ID du conteneur à afficher.
 */
function showMainContainer(containerIdToShow) {
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
}

// =============================================================================
// 5. Arbre de Compétences (Phase 3)
// =============================================================================

/**
 * Définition des compétences.
 * Chaque compétence a un ID unique, un nom, une branche, un coût,
 * une description, des prérequis et un effet sur le gameState.
 */
const skillsData = [
    // Branche Pédagogie
    {
        id: 'pedagogie1',
        name: 'Pédagogie Accrue I',
        branch: 'pedagogie',
        cost: new Decimal(1),
        description: 'Augmente la production de Bons Points des élèves de 10%.',
        flavorText: 'Les bases d\'une bonne éducation.',
        prerequisites: [],
        effect: (gs) => { gs.skillEffects.eleveBpsBonus = gs.skillEffects.eleveBpsBonus.mul(1.1); }
    },
    {
        id: 'pedagogie2',
        name: 'Pédagogie Accrue II',
        branch: 'pedagogie',
        cost: new Decimal(2),
        description: 'Augmente la production de Bons Points des élèves de 25%.',
        flavorText: 'Optimisation des méthodes d\'enseignement.',
        prerequisites: ['pedagogie1'],
        effect: (gs) => { gs.skillEffects.eleveBpsBonus = gs.skillEffects.eleveBpsBonus.mul(1.25); }
    },
    // Branche Rationalisme
    {
        id: 'rationalisme1',
        name: 'Logique Rigoureuse I',
        branch: 'rationalisme',
        cost: new Decimal(1),
        description: 'Réduit le coût des élèves de 5%.',
        flavorText: 'Penser de manière plus efficace.',
        prerequisites: [],
        effect: (gs) => { gs.skillEffects.eleveCostReduction = gs.skillEffects.eleveCostReduction.mul(1.05); }
    },
    {
        id: 'rationalisme2',
        name: 'Logique Rigoureuse II',
        branch: 'rationalisme',
        cost: new Decimal(3),
        description: 'Réduit le coût des élèves de 10%.',
        flavorText: 'L\'art de la négociation académique.',
        prerequisites: ['rationalisme1'],
        effect: (gs) => { gs.skillEffects.eleveCostReduction = gs.skillEffects.eleveCostReduction.mul(1.10); }
    },
    // Branche Science
    {
        id: 'science1',
        name: 'Recherche Fondamentale I',
        branch: 'science',
        cost: new Decimal(1),
        description: 'Augmente la production de Bons Points des salles de classe de 15%.',
        flavorText: 'Les premiers pas vers l\'innovation.',
        prerequisites: [],
        effect: (gs) => { gs.skillEffects.classeMultiplierBonus = gs.skillEffects.classeMultiplierBonus.mul(1.15); }
    },
    {
        id: 'science2',
        name: 'Recherche Fondamentale II',
        branch: 'science',
        cost: new Decimal(2),
        description: 'Augmente la production de Bons Points des salles de classe de 30%.',
        flavorText: 'Découvertes majeures en didactique.',
        prerequisites: ['science1'],
        effect: (gs) => { gs.skillEffects.classeMultiplierBonus = gs.skillEffects.classeMultiplierBonus.mul(1.30); }
    },
    // Ajoutez d'autres compétences ici
];

/**
 * Génère dynamiquement l'interface de l'arbre de compétences.
 */
function generateSkillTreeUI() {
    const skillsGrid = document.getElementById('skills-grid');
    if (!skillsGrid) return;

    skillsGrid.innerHTML = ''; // Nettoyer l'arbre existant

    const branches = {};
    skillsData.forEach(skill => {
        if (!branches[skill.branch]) {
            branches[skill.branch] = document.createElement('div');
            branches[skill.branch].classList.add('skill-branch', skill.branch);
            const branchTitle = document.createElement('h3');
            branchTitle.textContent = skill.branch.charAt(0).toUpperCase() + skill.branch.slice(1); // Capitalize
            branches[skill.branch].appendChild(branchTitle);
            skillsGrid.appendChild(branches[skill.branch]);
        }

        const skillWrapper = document.createElement('div');
        skillWrapper.classList.add('skill-wrapper');
        skillWrapper.dataset.skillId = skill.id;

        const skillNode = document.createElement('div');
        skillNode.classList.add('skill-node');
        skillNode.textContent = skill.name.split(' ')[0] + ' ' + skill.name.split(' ')[1]; // Afficher nom court

        const skillCostDisplay = document.createElement('span');
        skillCostDisplay.classList.add('skill-cost');
        skillCostDisplay.textContent = `(${formatNumber(skill.cost)} P)`;
        skillNode.appendChild(skillCostDisplay);

        // Tooltip
        const tooltip = document.createElement('div');
        tooltip.classList.add('tooltip-text');
        tooltip.innerHTML = `
            <h4>${skill.name}</h4>
            <p>${skill.description}</p>
            <p><em>${skill.flavorText}</em></p>
            <p>Coût: ${formatNumber(skill.cost)} Professeurs</p>
            ${skill.prerequisites.length > 0 ? `<p>Prérequis: ${skill.prerequisites.map(p => skillsData.find(s => s.id === p)?.name || p).join(', ')}</p>` : ''}
        `;
        skillNode.appendChild(tooltip);

        skillWrapper.appendChild(skillNode);
        branches[skill.branch].appendChild(skillWrapper);

        skillNode.addEventListener('click', () => buySkill(skill.id));
    });

    updateSkillTreeUI(); // Mettre à jour les états des compétences après la génération
}

/**
 * Met à jour l'état visuel de l'arbre de compétences (verrouillé/débloqué).
 */
function updateSkillTreeUI() {
    skillsData.forEach(skill => {
        const skillWrapper = document.querySelector(`.skill-wrapper[data-skill-id="${skill.id}"]`);
        if (!skillWrapper) return;

        const skillNode = skillWrapper.querySelector('.skill-node');
        const skillCostDisplay = skillWrapper.querySelector('.skill-cost');

        // Vérifier si débloqué
        if (gameState.unlockedSkills[skill.id]) {
            skillNode.classList.add('unlocked');
            skillNode.classList.remove('locked', 'can-afford', 'cannot-afford');
            skillCostDisplay.textContent = '(Débloqué)';
            skillNode.style.cursor = 'default';
        } else {
            skillNode.classList.remove('unlocked');
            skillNode.classList.add('locked');
            skillCostDisplay.textContent = `(${formatNumber(skill.cost)} P)`;

            // Vérifier les prérequis
            const hasPrerequisites = skill.prerequisites.every(prereqId => gameState.unlockedSkills[prereqId]);

            // Vérifier si abordable
            const canAfford = gameState.availableProfessors.gte(skill.cost);

            if (hasPrerequisites && canAfford) {
                skillNode.classList.add('can-afford');
                skillNode.classList.remove('cannot-afford');
                skillNode.style.cursor = 'pointer';
            } else {
                skillNode.classList.add('cannot-afford');
                skillNode.classList.remove('can-afford');
                skillNode.style.cursor = 'not-allowed';
            }
        }
    });
}

/**
 * Achète une compétence.
 * @param {string} skillId - L'ID de la compétence à acheter.
 */
function buySkill(skillId) {
    const skill = skillsData.find(s => s.id === skillId);
    if (!skill) {
        console.error(`Compétence avec l'ID ${skillId} non trouvée.`);
        return;
    }

    if (gameState.unlockedSkills[skillId]) {
        showNotification('Cette compétence est déjà débloquée.', 'info');
        return;
    }

    // Vérifier les prérequis
    const hasPrerequisites = skill.prerequisites.every(prereqId => gameState.unlockedSkills[prereqId]);
    if (!hasPrerequisites) {
        showNotification('Prérequis non remplis pour cette compétence.', 'error');
        return;
    }

    // Vérifier le coût
    if (gameState.availableProfessors.gte(skill.cost)) {
        gameState.professorsUsedForSkills = gameState.professorsUsedForSkills.add(skill.cost);
        gameState.unlockedSkills[skillId] = true;
        skill.effect(gameState); // Appliquer l'effet de la compétence
        recalculateGameValues();
        updateUI();
        saveGame();
        showNotification(`Compétence "${skill.name}" débloquée !`, 'success');
    } else {
        showNotification("Pas assez de Professeurs disponibles pour cette compétence.", 'error');
    }
}

/**
 * Réinitialise toutes les compétences débloquées.
 */
function resetSkills() {
    const cost = new Decimal(10); // Coût en Images pour réinitialiser les compétences
    if (gameState.images.gte(cost)) {
        if (confirm(`Êtes-vous sûr de vouloir réinitialiser toutes vos compétences ? Cela coûtera ${formatNumber(cost)} Images.`)) { // Utilisation de confirm pour l'instant
            gameState.images = gameState.images.sub(cost);
            gameState.professorsUsedForSkills = new Decimal(0); // Rembourser les professeurs
            gameState.unlockedSkills = {}; // Vider les compétences débloquées
            // Réinitialiser les effets de compétences à leurs valeurs par défaut
            gameState.skillEffects = {
                eleveBpsBonus: new Decimal(1),
                classeMultiplierBonus: new Decimal(1),
                eleveCostReduction: new Decimal(1),
            };
            recalculateGameValues();
            updateUI();
            saveGame();
            showNotification('Compétences réinitialisées !', 'success');
        }
    } else {
        showNotification("Pas assez d'Images pour réinitialiser les compétences.", 'error');
    }
}


// =============================================================================
// 6. Gestion des événements (Event Listeners)
// =============================================================================

document.addEventListener('DOMContentLoaded', () => {
    // Charger la partie au démarrage
    loadGame();
    recalculateGameValues(); // Assurez-vous que toutes les valeurs sont à jour après le chargement
    updateUI(); // Mettre à jour l'UI une première fois

    // Générer l'arbre de compétences au démarrage
    generateSkillTreeUI();

    // Démarrer la boucle de jeu
    startGameLoop();

    // Boutons d'action
    document.getElementById('etudierButton')?.addEventListener('click', etudierSagement);
    document.getElementById('acheterEleveButton')?.addEventListener('click', () => buyEleve(new Decimal(1)));
    document.getElementById('acheterClasseButton')?.addEventListener('click', buyClasse);
    document.getElementById('acheterImageButton')?.addEventListener('click', () => buyImage(new Decimal(1)));
    document.getElementById('acheterProfesseurButton')?.addEventListener('click', () => buyProfesseur(new Decimal(1)));


    // Boutons de navigation des menus
    document.getElementById('skillsButton')?.addEventListener('click', () => showMainContainer('skillTreeContainer'));
    document.getElementById('settingsButton')?.addEventListener('click', () => showMainContainer('settingsContainer'));
    document.getElementById('ascensionButton')?.addEventListener('click', ascend); // Le bouton d'ascension déclenche directement le processus d'ascension
    document.getElementById('ascensionMenuButton')?.addEventListener('click', () => showMainContainer('ascensionMenuContainer'));


    // Gestion des modales (boutons de fermeture)
    document.querySelectorAll('.modal .close').forEach(button => {
        button.addEventListener('click', (event) => {
            hideModal(event.target.closest('.modal').id);
        });
    });

    // Gestion des modales (clic en dehors)
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                hideModal(modal.id);
            }
        });
    });

    // Checkbox de désactivation d'avertissement d'élève
    document.getElementById('disableEleveWarningCheckbox')?.addEventListener('change', (event) => {
        gameState.disableEleveWarning = event.target.checked;
        saveGame();
    });

    // Checkbox de désactivation d'avertissement d'ascension
    document.getElementById('disableAscensionWarningCheckbox')?.addEventListener('change', (event) => {
        gameState.disableAscensionWarning = event.target.checked;
        saveGame();
    });

    // Boutons du menu Paramètres
    document.getElementById('themeToggleButton')?.addEventListener('click', toggleTheme);
    document.getElementById('resetProgressionButton')?.addEventListener('click', resetProgression);

    // Boutons du menu Ascension
    document.getElementById('acheterEcoleButton')?.addEventListener('click', buySchool);
    document.getElementById('unlockMultiPurchaseButton')?.addEventListener('click', unlockMultiPurchase);
    document.getElementById('unlockMaxPurchaseButton')?.addEventListener('click', unlockMaxPurchase);
    document.getElementById('unlockNewSettingsButton')?.addEventListener('click', unlockNewSettings);
    document.getElementById('unlockAutomationCategoryButton')?.addEventListener('click', unlockAutomationCategory);

    // Boutons d'automatisation
    document.getElementById('autoEleveButton')?.addEventListener('click', toggleAutoEleve);
    document.getElementById('autoImageButton')?.addEventListener('click', toggleAutoImage);
    document.getElementById('autoProfesseurButton')?.addEventListener('click', toggleAutoProfesseur);

    // Boutons de multiplicateurs d'achat
    document.getElementById('setMultiplierX1')?.addEventListener('click', () => setPurchaseMultiplier(1));
    document.getElementById('setMultiplierX10')?.addEventListener('click', () => setPurchaseMultiplier(10));
    document.getElementById('setMultiplierX100')?.addEventListener('click', () => setPurchaseMultiplier(100));
    document.getElementById('setMultiplierXMax')?.addEventListener('click', () => setPurchaseMultiplier(Infinity));

    // Bouton de réinitialisation des compétences
    document.getElementById('resetSkillsButton')?.addEventListener('click', resetSkills);


    // Fonction pour définir le multiplicateur d'achat
    function setPurchaseMultiplier(multiplier) {
        gameState.currentPurchaseMultiplier = multiplier;
        // Mettre à jour les classes "active" sur les boutons
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

    // Assurez-vous que le jeu principal est visible au démarrage
    showMainContainer('main-content');
});
