/*
 * Fichier: main.js
 * Description: Point d'entrée principal du jeu.
 * Initialise l'état du jeu, la boucle de jeu, et gère les interactions utilisateur.
 */

// Importe les modules nécessaires
import { getInitialGameState, gameState, resetGameState } from './gameState.js';
import {
  formatNumber,
  showNotification,
  showModal,
  hideModal,
  applyTheme,
  toggleTheme,
  showMainContainer,
  updateUI,
} from './uiManager.js';
import {
  skillsData,
  generateSkillTreeUI,
  updateSkillTreeUI,
  buySkill,
} from './skillManager.js';

// Fonction pour calculer les Points d'Ascension potentiels (à implémenter)
function calculatePotentialPA() {
  // Formule à définir (ex: Math.floor(Math.pow(nombreProfesseurs / X, Y)))
  // Pour l'instant, retourne 0
  if (gameState.nombreProfesseurs.lt(10)) {
    return new Decimal(0);
  }
  return new Decimal(Math.floor(Math.pow(gameState.nombreProfesseurs.toNumber() / 10, 0.5)));
}

// Fonction pour réinitialiser le jeu après l'ascension
function resetForAscension() {
  const initialState = getInitialGameState();

  // Conserver certaines valeurs
  initialState.ascensionPoints = gameState.ascensionPoints;
  initialState.totalPAEarned = gameState.totalPAEarned;
  initialState.ascensionCount = gameState.ascensionCount.add(1);
  initialState.disableAscensionWarning = gameState.disableAscensionWarning;
  initialState.disableEleveWarning = gameState.disableEleveWarning;
  initialState.currentTheme = gameState.currentTheme;
  initialState.themeOptionUnlocked = gameState.themeOptionUnlocked;
  initialState.multiPurchaseOptionUnlocked = gameState.multiPurchaseOptionUnlocked;
  initialState.maxPurchaseOptionUnlocked = gameState.maxPurchaseOptionUnlocked;
  initialState.newSettingsUnlocked = gameState.newSettingsUnlocked;
  initialState.automationCategoryUnlocked = gameState.automationCategoryUnlocked;
  initialState.autoEleveActive = gameState.autoEleveActive;
  initialState.autoImageActive = gameState.autoImageActive;
  initialState.autoProfesseurActive = gameState.autoProfesseurActive;

  resetGameState(initialState);
}

// Fonction principale du jeu (boucle de jeu)
function gameLoop(currentTime) {
  const deltaTime = currentTime - gameState.lastTickTime;
  gameState.lastTickTime = currentTime;

  // Calcule la production de BP
  let bpsEleves = gameState.nombreEleves.mul(0.5).mul(gameState.skillEffects.eleveBpsBonus);
  let bpsClasses = gameState.nombreClasses.mul(25).mul(gameState.skillEffects.classeMultiplierBonus);
  let totalBps = bpsEleves.add(bpsClasses).mul(gameState.ascensionBonusMultiplier).mul(gameState.schoolMultiplier);

  // Ajoute les BP gagnés
  gameState.bonsPoints = gameState.bonsPoints.add(totalBps.mul(deltaTime / 1000));

  // Automatisation
  if (gameState.automationCategoryUnlocked) {
    if (gameState.autoEleveActive) {
      buyMax(buyEleve, gameState.currentPurchaseMultiplier);
    }
    if (gameState.autoImageActive) {
      buyMax(buyImage, gameState.currentPurchaseMultiplier);
    }
    if (gameState.autoProfesseurActive) {
      buyMax(buyProfesseur, gameState.currentPurchaseMultiplier);
    }
  }


  // Met à jour l'UI
  updateUI();
  saveGame(); // Sauvegarde le jeu à chaque tick (peut être optimisé)

  requestAnimationFrame(gameLoop);
}

// Achète un nombre multiple d'élèves
function buyEleve(number = 1) {
  const costPerEleve = gameState.coutEleveBase.mul(Decimal.pow(1.15, gameState.nombreEleves)).div(gameState.skillEffects.eleveCostReduction);
  const totalCost = costPerEleve.mul(number);

  if (gameState.bonsPoints.gte(totalCost)) {
    gameState.bonsPoints = gameState.bonsPoints.sub(totalCost);
    gameState.nombreEleves = gameState.nombreEleves.add(number);
    gameState.coutEleveActuel = gameState.coutEleveBase.mul(
      Decimal.pow(1.15, gameState.nombreEleves)
    ).div(gameState.skillEffects.eleveCostReduction);
    gameState.bonsPointsParSecondeEleves = gameState.nombreEleves.mul(0.5).mul(gameState.skillEffects.eleveBpsBonus);

    // Logique de la modale
    if (
      gameState.nombreEleves.mod(30).eq(0) &&
      !gameState.disableEleveWarning
    ) {
      showModal('confirmElevePurchaseModal');
    }
    return true; // Achat réussi
  }
  return false; // Achat échoué
}

// Achète une salle de classe
function buyClasse() {
  if (gameState.nombreEleves.gte(gameState.coutClasseEnEleves)) {
    gameState.nombreEleves = gameState.nombreEleves.sub(gameState.coutClasseEnEleves);
    gameState.nombreClasses = gameState.nombreClasses.add(1);
    // L'achat d'une classe augmente le coût des élèves futurs
    gameState.coutEleveBase = gameState.coutEleveBase.mul(1.15);
    gameState.coutEleveActuel = gameState.coutEleveBase.mul(
      Decimal.pow(1.15, gameState.nombreEleves)
    ).div(gameState.skillEffects.eleveCostReduction);
    gameState.bonsPointsParSecondeClasses = gameState.nombreClasses.mul(25).mul(gameState.skillEffects.classeMultiplierBonus);
    return true;
  }
  return false;
}

// Achète une image
function buyImage() {
  if (gameState.bonsPoints.gte(gameState.coutImage)) {
    gameState.bonsPoints = gameState.bonsPoints.sub(gameState.coutImage);
    gameState.images = gameState.images.add(1);
    // Le coût des images peut augmenter avec chaque achat, si désiré
    // gameState.coutImage = gameState.coutImage.mul(1.1);
    return true;
  }
  return false;
}

// Achète un professeur
function buyProfesseur() {
  if (gameState.images.gte(gameState.coutProfesseur)) {
    gameState.images = gameState.images.sub(gameState.coutProfesseur);
    gameState.nombreProfesseurs = gameState.nombreProfesseurs.add(1);
    gameState.availableProfessors = gameState.nombreProfesseurs.sub(
      gameState.professorsUsedForSkills
    );
    // Le coût des professeurs peut augmenter avec chaque achat, si désiré
    // gameState.coutProfesseur = gameState.coutProfesseur.mul(1.2);
    return true;
  }
  return false;
}

// Achète le maximum possible d'une ressource
function buyMax(buyFunction, multiplier) {
  if (multiplier === Infinity) { // 'Max' option
    let boughtThisTick = true;
    while (boughtThisTick) {
      boughtThisTick = buyFunction(1);
    }
  } else { // x1, x10, x100 options
    for (let i = 0; i < multiplier; i++) {
      if (!buyFunction(1)) {
        break;
      }
    }
  }
}


// Fonction d'ascension
function ascension() {
  const paGained = calculatePotentialPA();
  if (paGained.eq(0)) {
    showNotification("Vous n'avez pas encore assez de Professeurs pour gagner des Points d'Ascension.", 'error');
    return;
  }

  document.getElementById('paGainedDisplay').textContent = formatNumber(paGained);

  const firstAscensionWarning = document.getElementById('firstAscensionWarning');
  const subsequentAscensionWarning = document.getElementById('subsequentAscensionWarning');

  if (gameState.ascensionCount.eq(0) && !gameState.disableAscensionWarning) {
    firstAscensionWarning.classList.remove('hidden');
    subsequentAscensionWarning.classList.add('hidden');
  } else {
    firstAscensionWarning.classList.add('hidden');
    subsequentAscensionWarning.classList.remove('hidden');
  }

  showModal('confirmAscensionModal');
}

function confirmAscension() {
  const paGained = calculatePotentialPA();
  gameState.ascensionPoints = gameState.ascensionPoints.add(paGained);
  gameState.totalPAEarned = gameState.totalPAEarned.add(paGained);

  resetForAscension();
  gameState.ascensionBonusMultiplier = new Decimal(1).add(
    gameState.ascensionCount.mul(gameState.totalPAEarned).mul(0.05)
  );

  hideModal('confirmAscensionModal');
  showMainContainer('main-content');
  showNotification(`Ascension réussie ! Vous avez gagné ${formatNumber(paGained)} Points d'Ascension.`, 'success');
}

// Fonction pour acheter une école
function buyEcole() {
  if (gameState.ascensionPoints.gte(gameState.coutEcoleActuel)) {
    gameState.ascensionPoints = gameState.ascensionPoints.sub(
      gameState.coutEcoleActuel
    );
    gameState.schoolCount = gameState.schoolCount.add(1);
    gameState.coutEcoleActuel = gameState.coutEcoleBase.mul(
      Decimal.pow(1.5, gameState.schoolCount)
    );
    gameState.schoolMultiplier = new Decimal(1).add(
      gameState.schoolCount.mul(0.1)
    );
    showNotification(`Vous avez acheté une École ! Multiplicateur de production de BP augmenté à ${formatNumber(gameState.schoolMultiplier.sub(1).mul(100))}%`, 'success');
    return true;
  } else {
    showNotification("Pas assez de Points d'Ascension pour acheter une École.", 'error');
    return false;
  }
}

// Fonction pour réinitialiser la progression
function resetProgression() {
  if (gameState.images.gte(10)) {
    showModal('confirmResetModal');
  } else {
    showNotification("Pas assez d'Images pour réinitialiser la progression (coût: 10 Images).", 'error');
  }
}

function confirmReset() {
  // Déduire le coût avant de réinitialiser l'état
  gameState.images = gameState.images.sub(10);
  resetGameState(getInitialGameState());
  hideModal('confirmResetModal');
  showMainContainer('main-content');
  showNotification('Progression réinitialisée avec succès !', 'info');
}

// Fonction pour réinitialiser les compétences
function resetSkills() {
  const cost = new Decimal(10); // Coût en Images pour réinitialiser les compétences
  if (gameState.images.gte(cost)) {
    showModal('confirmResetSkillsModal');
  } else {
    showNotification(`Pas assez d'Images pour réinitialiser les compétences (coût: ${formatNumber(cost)} Images).`, 'error');
  }
}

function confirmResetSkills() {
  const cost = new Decimal(10);
  if (gameState.images.gte(cost)) {
    gameState.images = gameState.images.sub(cost);
    gameState.availableProfessors = gameState.availableProfessors.add(gameState.professorsUsedForSkills);
    gameState.professorsUsedForSkills = new Decimal(0);
    gameState.unlockedSkills = {};
    // Réinitialiser les effets des compétences
    gameState.skillEffects = {
      eleveBpsBonus: new Decimal(1),
      classeMultiplierBonus: new Decimal(1),
      eleveCostReduction: new Decimal(1),
    };
    hideModal('confirmResetSkillsModal');
    updateUI();
    showNotification('Compétences réinitialisées !', 'success');
  } else {
    showNotification("Erreur: Coût non couvert lors de la réinitialisation des compétences.", 'error');
  }
}

// Fonctions de sauvegarde et de chargement
function saveGame() {
  try {
    // Convertir les objets Decimal en chaînes pour la sauvegarde
    const stateToSave = {};
    for (const key in gameState) {
      if (gameState[key] instanceof Decimal) {
        stateToSave[key] = gameState[key].toString();
      } else if (typeof gameState[key] === 'object' && gameState[key] !== null && !Array.isArray(gameState[key])) {
        // Gérer les objets imbriqués comme skillEffects
        const nestedObject = {};
        for (const nestedKey in gameState[key]) {
          if (gameState[key][nestedKey] instanceof Decimal) {
            nestedObject[nestedKey] = gameState[key][nestedKey].toString();
          } else {
            nestedObject[nestedKey] = gameState[key][nestedKey];
          }
        }
        stateToSave[key] = nestedObject;
      }
      else {
        stateToSave[key] = gameState[key];
      }
    }
    localStorage.setItem('incrementalGameState', JSON.stringify(stateToSave));
  } catch (e) {
    console.error('Erreur lors de la sauvegarde:', e);
    showNotification('Erreur lors de la sauvegarde du jeu.', 'error');
  }
}

function loadGame() {
  try {
    const savedState = localStorage.getItem('incrementalGameState');
    if (savedState) {
      const parsedState = JSON.parse(savedState);
      const loadedState = {};
      for (const key in parsedState) {
        if (typeof parsedState[key] === 'string' && !isNaN(parsedState[key])) {
          loadedState[key] = new Decimal(parsedState[key]);
        } else if (typeof parsedState[key] === 'object' && parsedState[key] !== null && !Array.isArray(parsedState[key])) {
          // Gérer les objets imbriqués comme skillEffects
          const nestedObject = {};
          for (const nestedKey in parsedState[key]) {
            if (typeof parsedState[key][nestedKey] === 'string' && !isNaN(parsedState[key][nestedKey])) {
              nestedObject[nestedKey] = new Decimal(parsedState[key][nestedKey]);
            } else {
              nestedObject[nestedKey] = parsedState[key][nestedKey];
            }
          }
          loadedState[key] = nestedObject;
        }
        else {
          loadedState[key] = parsedState[key];
        }
      }
      resetGameState(loadedState);
      showNotification('Jeu chargé !', 'info');
    } else {
      showNotification('Aucune sauvegarde trouvée. Nouvelle partie commencée.', 'info');
    }
  } catch (e) {
    console.error('Erreur lors du chargement de la sauvegarde:', e);
    showNotification('Erreur lors du chargement de la sauvegarde. Nouvelle partie commencée.', 'error');
    resetGameState(getInitialGameState()); // S'assurer que l'état est propre en cas d'erreur
  }
}


// Initialisation
window.onload = function () {
  loadGame(); // Charge le jeu au démarrage
  applyTheme(gameState.currentTheme); // Applique le thème sauvegardé
  generateSkillTreeUI(); // Génère l'arbre de compétences
  updateUI(); // Met à jour l'UI initiale

  // Attache les gestionnaires d'événements aux éléments de l'interface utilisateur
  document
    .getElementById('etudierButton')
    .addEventListener('click', () => {
      gameState.bonsPoints = gameState.bonsPoints.add(1);
      updateUI();
    });
  document.getElementById('acheterEleveButton').addEventListener('click', () => {
    buyEleve(gameState.currentPurchaseMultiplier);
    updateUI();
  });
  document.getElementById('acheterClasseButton').addEventListener('click', () => {
    buyClasse();
    updateUI();
  });
  document.getElementById('acheterImageButton').addEventListener('click', () => {
    buyImage();
    updateUI();
  });
  document
    .getElementById('acheterProfesseurButton')
    .addEventListener('click', () => {
      buyProfesseur();
      updateUI();
    });
  document.getElementById('skillsButton').addEventListener('click', () => {
    showMainContainer('skillTreeContainer');
  });
  document.getElementById('settingsButton').addEventListener('click', () => {
    showMainContainer('settingsContainer');
  });
  document.getElementById('ascensionMenuButton').addEventListener('click', () => {
    showMainContainer('ascensionMenuContainer');
  });
  document.getElementById('ascensionButton').addEventListener('click', ascension);
  document
    .getElementById('confirmAscensionYes')
    .addEventListener('click', confirmAscension);
  document
    .getElementById('confirmAscensionNo')
    .addEventListener('click', () => hideModal('confirmAscensionModal'));
  document
    .getElementById('disableAscensionWarningCheckbox')
    .addEventListener('change', (event) => {
      gameState.disableAscensionWarning = event.target.checked;
    });
  document
    .getElementById('disableEleveWarningCheckbox')
    .addEventListener('change', (event) => {
      gameState.disableEleveWarning = event.target.checked;
    });
  document.getElementById('themeToggleButton').addEventListener('click', () => {
    toggleTheme(saveGame); // Passe saveGame comme callback
  });
  document
    .getElementById('resetProgressionButton')
    .addEventListener('click', resetProgression);
  document
    .getElementById('confirmResetYes')
    .addEventListener('click', confirmReset);
  document
    .getElementById('confirmResetNo')
    .addEventListener('click', () => hideModal('confirmResetModal'));

  document.getElementById('resetSkillsButton').addEventListener('click', resetSkills);
  document.getElementById('confirmResetSkillsYes').addEventListener('click', confirmResetSkills);
  document.getElementById('confirmResetSkillsNo').addEventListener('click', () => hideModal('confirmResetSkillsModal'));


  document
    .getElementById('unlockMultiPurchaseButton')
    .addEventListener('click', () => {
      if (gameState.ascensionPoints.gte(10)) {
        gameState.ascensionPoints = gameState.ascensionPoints.sub(10);
        gameState.multiPurchaseOptionUnlocked = true;
        showNotification('Option d\'achat multiple débloquée !', 'success');
        updateUI();
      } else {
        showNotification("Pas assez de Points d'Ascension (coût: 10 PA).", 'error');
      }
    });
  document.getElementById('unlockMaxPurchaseButton').addEventListener('click', () => {
    if (gameState.ascensionPoints.gte(100)) {
      gameState.ascensionPoints = gameState.ascensionPoints.sub(100);
      gameState.maxPurchaseOptionUnlocked = true;
      showNotification('Option d\'achat "Max" débloquée !', 'success');
      updateUI();
    } else {
      showNotification("Pas assez de Points d'Ascension (coût: 100 PA).", 'error');
    }
  });
  document
    .getElementById('unlockNewSettingsButton')
    .addEventListener('click', () => {
      if (gameState.ascensionPoints.gte(10)) {
        gameState.ascensionPoints = gameState.ascensionPoints.sub(10);
        gameState.newSettingsUnlocked = true;
        showNotification('Nouveaux réglages débloqués !', 'success');
        updateUI();
      } else {
        showNotification("Pas assez de Points d'Ascension (coût: 10 PA).", 'error');
      }
    });
  document
    .getElementById('unlockAutomationCategoryButton')
    .addEventListener('click', () => {
      if (gameState.ascensionPoints.gte(1000)) {
        gameState.ascensionPoints = gameState.ascensionPoints.sub(1000);
        gameState.automationCategoryUnlocked = true;
        showNotification('Catégorie Automatisation débloquée !', 'success');
        updateUI();
      } else {
        showNotification("Pas assez de Points d'Ascension (coût: 1000 PA).", 'error');
      }
    });
  document.getElementById('autoEleveButton').addEventListener('click', () => {
    if (!gameState.autoEleveActive) {
      if (gameState.ascensionPoints.gte(100)) {
        gameState.ascensionPoints = gameState.ascensionPoints.sub(100);
        gameState.autoEleveActive = true;
        showNotification('Automatisation des Élèves activée !', 'success');
      } else {
        showNotification("Pas assez de Points d'Ascension (coût: 100 PA).", 'error');
      }
    } else {
      gameState.autoEleveActive = false;
      showNotification('Automatisation des Élèves désactivée.', 'info');
    }
    updateUI();
  });
  document.getElementById('autoImageButton').addEventListener('click', () => {
    if (!gameState.autoImageActive) {
      if (gameState.ascensionPoints.gte(10000)) {
        gameState.ascensionPoints = gameState.ascensionPoints.sub(10000);
        gameState.autoImageActive = true;
        showNotification('Automatisation des Images activée !', 'success');
      } else {
        showNotification("Pas assez de Points d'Ascension (coût: 10000 PA).", 'error');
      }
    } else {
      gameState.autoImageActive = false;
      showNotification('Automatisation des Images désactivée.', 'info');
    }
    updateUI();
  });
  document.getElementById('autoProfesseurButton').addEventListener('click', () => {
    if (!gameState.autoProfesseurActive) {
      if (gameState.ascensionPoints.gte(100000)) {
        gameState.ascensionPoints = gameState.ascensionPoints.sub(100000);
        gameState.autoProfesseurActive = true;
        showNotification('Automatisation des Professeurs activée !', 'success');
      } else {
        showNotification("Pas assez de Points d'Ascension (coût: 100000 PA).", 'error');
      }
    } else {
      gameState.autoProfesseurActive = false;
      showNotification('Automatisation des Professeurs désactivée.', 'info');
    }
    updateUI();
  });

  document.getElementById('acheterEcoleButton').addEventListener('click', () => {
    buyEcole();
    updateUI();
  });
  document.getElementById('setMultiplierX1').addEventListener('click', () => {
    gameState.currentPurchaseMultiplier = 1;
    showNotification('Multiplicateur d\'achat réglé sur x1', 'info');
    updateUI();
  });
  document.getElementById('setMultiplierX10').addEventListener('click', () => {
    gameState.currentPurchaseMultiplier = 10;
    showNotification('Multiplicateur d\'achat réglé sur x10', 'info');
    updateUI();
  });
  document.getElementById('setMultiplierX100').addEventListener('click', () => {
    gameState.currentPurchaseMultiplier = 100;
    showNotification('Multiplicateur d\'achat réglé sur x100', 'info');
    updateUI();
  });
  document.getElementById('setMultiplierXMax').addEventListener('click', () => {
    gameState.currentPurchaseMultiplier = Infinity;
    showNotification('Multiplicateur d\'achat réglé sur Max', 'info');
    updateUI();
  });

  // Démarrer la boucle de jeu
  requestAnimationFrame(gameLoop);
};
