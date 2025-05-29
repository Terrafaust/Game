// Fiche Mémo : events.js
// Description : Ce fichier est dédié à la gestion de tous les écouteurs d'événements (clicks, changes, etc.)
// de l'interface utilisateur du jeu. Son rôle principal est d'attacher des gestionnaires d'événements
// aux éléments DOM et d'appeler les fonctions de logique de jeu appropriées définies dans d'autres modules
// (comme core.js, studies.js, automation.js, skills.js, settings.js, etc.).
// Il ne contient aucune logique de jeu complexe, seulement la "colle" entre l'interface et le backend.

// Dépendances :
// Ce fichier dépend de la disponibilité globale des variables et fonctions définies dans :
// - core.js : Pour les fonctions principales du jeu (e.g., checkUnlockConditions, saveGameState,
//   updateDisplay, applyAllSkillEffects, calculateTotalBPS, calculateItemBPS,
//   softResetGame, superSoftResetGame, hardResetGame, showNotification, images, formatNumber).
// - data.js : Pour les structures de données comme `skillsData`, `prestigePurchasesData`, `questsData`,
//   `achievementsData`, `bonusPointThresholds`, `prime_PA`.
// - ui.js : Pour les fonctions de mise à jour de l'affichage (e.g., updateButtonStates,
//   updateAutomationButtonStates, updateSettingsButtonStates, renderQuests,
//   renderAchievements, renderSkillsMenu, updateSectionVisibility, updateStatsDisplay,
//   openTab, closeStatsModal, showAchievementTooltip, hideAchievementTooltip,
//   toggleAchievementTooltip).
// - studies.js : Pour les fonctions d'achat spécifiques aux études (e.g., performPurchase).
// - automation.js : Pour les fonctions d'automatisation (e.g., runAutomation, calculateAutomationCost).
// - skills.js : Pour la logique d'achat et de réinitialisation des compétences (e.g., handleSkillClick).
// - ascension.js : Pour la logique d'ascension (e.g., calculatePAGained, performAscension).
// - prestige.js : Pour la logique de prestige (e.g., calculatePPGained, getPrestigeBonusMultiplier,
//   performPrestige, calculateLicenceCost, calculateMaster1Cost, calculateMaster2Cost,
//   calculateDoctoratCost, calculatePostDoctoratCost).
// - settings.js : Pour la logique des paramètres (e.g., toggleTheme, toggleOfflineProgress,
//   toggleMinimizeResources, openStats).
// - quests.js : Pour la logique des quêtes.
// - achievements.js : Pour la logique des succès (e.g., checkAchievements).
//
// Variables Globales Accédées (définies dans d'autres modules, principalement core.js et ui.js) :
// - bonsPoints, totalClicks, ascensionPoints, ascensionCount, totalPAEarned,
//   prestigePoints, prestigeCount, studiesSkillPoints, ascensionSkillPoints, prestigeSkillPoints,
//   studiesSkillLevels, ascensionSkillLevels, prestigeSkillLevels, secretSkillClicks,
//   currentPurchaseMultiplier, ascensionUnlocked, prestigeUnlocked,
//   disableAscensionWarning, firstAscensionPerformed, disablePrestigeWarning,
//   multiPurchaseOptionUnlocked, maxPurchaseOptionUnlocked, automationCategoryUnlocked,
//   autoEleveActive, autoClasseActive, autoImageActive, autoProfesseurActive,
//   elevesUnlocked, classesUnlocked, imagesUnlocked, ProfesseurUnlocked, skillsButtonUnlocked,
//   settingsButtonUnlocked, ascensionMenuButtonUnlocked, prestigeMenuButtonUnlocked,
//   questsUnlocked, achievementsButtonUnlocked, unlockedAchievements, permanentBpsBonusFromAchievements,
//   paMultiplierFromQuests, nombreLicences, nombreMaster1, nombreMaster2, nombreDoctorat, nombrePostDoctorat.
// - Decimal (assumé global pour les calculs de nombres arbitraires)
// - skillEffects (assumé global, probablement de core.js ou data.js)
// - totalBonsPointsParSeconde (assumé global, probablement de core.js)
// - clickBonsPointsDisplay, bonsPointsSpan, miniBonsPoints (assumés globaux, probablement de ui.js)
// - activeAchievementTooltip (assumé global, probablement de ui.js)
//
// Éléments DOM Clés (référencés par ID, définis dans index.html) :
// - Tous les éléments avec des IDs qui sont utilisés dans les addEventListener.
//   Exemples : studiesTitleButton, acheterEleveButton, studiesTabBtn, confirmResetYesBtn, etc.
//   Ces références sont supposées être déjà récupérées et disponibles globalement (e.g., via ui.js).

// Logique Générale :
// Ce fichier initialise tous les écouteurs d'événements une fois que le DOM est complètement chargé
// et que toutes les variables globales nécessaires sont initialisées.

// --- Récupération des éléments DOM (Assumés globaux ou passés) ---
// Ces variables sont supposées être déjà définies et accessibles globalement,
// par exemple via le fichier ui.js qui les récupère avec document.getElementById.
// Pour la clarté, certaines sont listées ici à titre indicatif.
/*
const studiesTitleButton = document.getElementById('studiesTitleButton');
const acheterEleveButton = document.getElementById('acheterEleveButton');
const acheterClasseButton = document.getElementById('acheterClasseButton');
const acheterImageButton = document.getElementById('acheterImageButton');
const acheterProfesseurButton = document.getElementById('acheterProfesseurButton');
const acheterEcoleButton = document.getElementById('acheterEcoleButton');
const acheterLyceeButton = document.getElementById('acheterLyceeButton');
const acheterCollegeButton = document.getElementById('acheterCollegeButton');
const acheterLicenceButton = document.getElementById('acheterLicenceButton');
const acheterMaster1Button = document.getElementById('acheterMaster1Button');
const acheterMaster2Button = document.getElementById('acheterMaster2Button');
const acheterDoctoratButton = document.getElementById('acheterDoctoratButton');
const acheterPostDoctoratButton = document.getElementById('acheterPostDoctoratButton');

const themeToggleButton = document.getElementById('themeToggleButton');
const resetProgressionButton = document.getElementById('resetProgressionButton');
const offlineProgressToggle = document.getElementById('offlineProgressToggle');
const toggleMinimalistResourcesButton = document.getElementById('toggleMinimalistResources');
const statsButton = document.getElementById('statsButton');
const statsModal = document.getElementById('statsModal'); // The modal container itself

const ascensionTitleButton = document.getElementById('ascensionTitleButton');
const confirmAscensionYesBtn = document.getElementById('confirmAscensionYes');
const confirmAscensionNoBtn = document.getElementById('confirmAscensionNo');

const prestigeTitleButton = document.getElementById('prestigeTitleButton');
const confirmPrestigeYesBtn = document.getElementById('confirmPrestigeYes');
const confirmPrestigeNoBtn = document.getElementById('confirmPrestigeNo');
const disablePrestigeWarningCheckbox = document.getElementById('disablePrestigeWarningCheckbox');

const unlockMultiPurchaseButton = document.getElementById('unlockMultiPurchaseButton');
const unlockmaxPurchaseButton = document.getElementById('unlockmaxPurchaseButton');
const unlockNewSettingsButton = document.getElementById('unlockNewSettingsButton');
const unlockAutomationCategoryButton = document.getElementById('unlockAutomationCategoryButton');

const autoEleveBtn = document.getElementById('autoEleveBtn');
const autoClasseBtn = document.getElementById('autoClasseBtn');
const autoImageBtn = document.getElementById('autoImageBtn');
const autoProfesseurBtn = document.getElementById('autoProfesseurBtn');

const multiplierButtonsContainer = document.getElementById('multiplierButtonsContainer'); // Parent for delegation
const studiesSkillsGrid = document.getElementById('studiesSkillsGrid'); // Parent for delegation
const ascensionSkillsGrid = document.getElementById('ascensionSkillsGrid'); // Parent for delegation
const prestigeSkillsGrid = document.getElementById('prestigeSkillsGrid'); // Parent for delegation

const resetSkillsButton = document.getElementById('resetSkillsButton');
const buyAllSkillsButton = document.getElementById('buyAllSkillsButton');

const studiesTabBtn = document.getElementById('studiesTabBtn');
const automationTabBtn = document.getElementById('automationTabBtn');
const skillsTabBtn = document.getElementById('skillsTabBtn');
const settingsTabBtn = document.getElementById('settingsTabBtn');
const ascensionTabBtn = document.getElementById('ascensionTabBtn');
const prestigeTabBtn = document.getElementById('prestigeTabBtn');
const questsTabBtn = document.getElementById('questsTabBtn');
const achievementsTabBtn = document.getElementById('achievementsTabBtn');

const studiesMainContainer = document.getElementById('studiesMainContainer');
const automationMainContainer = document.getElementById('automationMainContainer');
const skillsContainer = document.getElementById('skillsContainer');
const settingsContainer = document.getElementById('settingsContainer');
const ascensionMenuContainer = document.getElementById('ascensionMenuContainer');
const prestigeMenuContainer = document.getElementById('prestigeMenuContainer');
const questsContainer = document.getElementById('questsContainer');
const achievementsContainer = document.getElementById('achievementsContainer');

const achievementTooltip = document.getElementById('achievementTooltip');
const achievementsGrid = document.getElementById('achievementsGrid');

const paGainedDisplay = document.getElementById('paGainedDisplay');
const ascensionModalTitle = document.getElementById('ascensionModalTitle');
const firstAscensionWarningDiv = document.getElementById('firstAscensionWarning');
const subsequentAscensionWarningDiv = document.getElementById('subsequentAscensionWarning');
const disableAscensionWarningCheckboxAscension = document.getElementById('disableAscensionWarningCheckbox');
const confirmAscensionModal = document.getElementById('confirmAscensionModal');
const confirmPrestigeModal = document.getElementById('confirmPrestigeModal');
const prestigeWarningText = document.getElementById('prestigeWarningText');
const prestigePointsGainedDisplay = document.getElementById('prestigePointsGainedDisplay'); // Assumed new element for prestige points display

// Assumed global from core.js / data.js
// let bonsPoints;
// let totalClicks;
// let images;
// let ascensionPoints;
// let ascensionCount;
// let totalPAEarned;
// let prestigePoints;
// let prestigeCount;
// let studiesSkillPoints, ascensionSkillPoints, prestigeSkillPoints;
// let studiesSkillLevels, ascensionSkillLevels, prestigeSkillLevels;
// let secretSkillClicks;
// let currentPurchaseMultiplier;
// let ascensionUnlocked, prestigeUnlocked, multiPurchaseOptionUnlocked, maxPurchaseOptionUnlocked, automationCategoryUnlocked;
// let autoEleveActive, autoClasseActive, autoImageActive, autoProfesseurActive;
// let elevesUnlocked, classesUnlocked, imagesUnlocked, ProfesseurUnlocked;
// let skillsButtonUnlocked, settingsButtonUnlocked, ascensionMenuButtonUnlocked, prestigeMenuButtonUnlocked;
// let questsUnlocked, achievementsButtonUnlocked;
// let unlockedAchievements;
// let nombreLicences, nombreMaster1, nombreMaster2, nombreDoctorat, nombrePostDoctorat;
// let skillEffects; // From core.js/data.js
// let totalBonsPointsParSeconde; // From core.js
// let nombreProfesseur; // From core.js
// let questsData; // From data.js
// let achievementsData; // From data.js
// let prestigePurchasesData; // From data.js
// let prime_PA; // From data.js
// let newSettingsUnlocked; // Assumed global for the new settings unlock state
// let activeAchievementTooltip; // Assumed global for achievement tooltip state
*/

/**
 * Initialise tous les écouteurs d'événements pour le jeu.
 * Cette fonction doit être appelée une fois que le DOM est complètement chargé
 * et que toutes les variables globales nécessaires sont initialisées.
 */
import { toggleTheme, toggleOfflineProgress, toggleMinimizeResources, openStats } from './settings.js';
import { hardResetGame, images, showNotification, saveGameState, updateDisplay, updateSettingsButtonStates, updateSectionVisibility, openStatsModal, closeStatsModal, checkUnlockConditions, formatNumber, calculateTotalBPS, applyAllSkillEffects, updateButtonStates } from './core.js';
import { performPurchase } from './studies.js';
import { handleSkillClick } from './skills.js';
import { calculatePAGained, performAscension } from './ascension.js';
import { calculatePPGained, getPrestigeBonusMultiplier, performPrestige } from './prestige.js'; // Import functions from prestige.js
import { calculateAutomationCost } from './automation.js'; // Import calculateAutomationCost from automation.js
import { openTab, updateMultiplierButtons, renderSkillsMenu, renderQuests, renderAchievements, showAchievementTooltip, hideAchievementTooltip, toggleAchievementTooltip } from './ui.js'; // Import all necessary UI functions
import { skillsData, achievementsData } from './data.js'; // Import data needed for skills and achievements

export function initEventListeners() {
    // --- Écouteurs d'événements pour les achats ---
    studiesTitleButton.addEventListener('click', () => {
        totalClicks = totalClicks.add(1); // Incrémenter le total des clics

        calculateTotalBPS(); // S'assurer que totalBonsPointsParSeconde est à jour
        const dynamicBonus = totalBonsPointsParSeconde.mul(0.1); // Calculer le bonus dynamique ici
        const clickValue = skillEffects.clickBonsPointsBonus.add(dynamicBonus);

        if (clickValue.gt(0)) {
            bonsPoints = bonsPoints.add(clickValue);
        } else {
            // Si clickValue est zéro ou négatif, s'assurer qu'au moins 1 BP est gagné
            if (clickValue.eq(0)) {
                bonsPoints = bonsPoints.add(1);
            } else {
                console.warn("[Clic Étudier] clickValue est négatif. BP non augmentés par ce clic spécifique.", clickValue.toString());
            }
        }

        // Mettre à jour l'affichage du bonus de clic
        clickBonsPointsDisplay.textContent = `+${formatNumber(clickValue, bonsPoints.lt(1000) ? 1 : 0)} BP`;

        bonsPointsSpan.textContent = formatNumber(bonsPoints, 0); // Mettre à jour directement l'affichage des BP
        if (minimizeResourcesActive) {
            miniBonsPoints.textContent = formatNumber(bonsPoints, 0);
        }

        checkUnlockConditions();
        updateButtonStates();
        saveGameState();
    });

    acheterEleveButton.addEventListener('click', () => performPurchase('eleve', currentPurchaseMultiplier));
    acheterClasseButton.addEventListener('click', () => performPurchase('classe', currentPurchaseMultiplier));
    acheterImageButton.addEventListener('click', () => performPurchase('image', currentPurchaseMultiplier));
    acheterProfesseurButton.addEventListener('click', () => performPurchase('Professeur', currentPurchaseMultiplier));
    acheterEcoleButton.addEventListener('click', () => performPurchase('ecole', currentPurchaseMultiplier));
    acheterLyceeButton.addEventListener('click', () => performPurchase('lycee', currentPurchaseMultiplier));
    acheterCollegeButton.addEventListener('click', () => performPurchase('college', currentPurchaseMultiplier));

    // NOUVEAU : Écouteurs d'événements pour les achats de Prestige
    acheterLicenceButton.addEventListener('click', () => performPurchase('licence', 1));
    acheterMaster1Button.addEventListener('click', () => performPurchase('master1', 1));
    acheterMaster2Button.addEventListener('click', () => performPurchase('master2', 1));
    acheterDoctoratButton.addEventListener('click', () => performPurchase('doctorat', 1));
    acheterPostDoctoratButton.addEventListener('click', () => performPurchase('postDoctorat', 1));

    // --- Écouteurs d'événements pour les boutons de multiplicateur (Délégation d'événements) ---
    multiplierButtonsContainer.addEventListener('click', (event) => {
        const button = event.target.closest('.multiplier-button');
        if (button) {
            currentPurchaseMultiplier = button.dataset.multiplier;
            updateMultiplierButtons();
            saveGameState();
        }
    });

    // --- Écouteurs d'événements pour les onglets du menu latéral ---
    studiesTabBtn.addEventListener('click', () => { openTab(studiesMainContainer); updateDisplay(); });
    automationTabBtn.addEventListener('click', () => { openTab(automationMainContainer); updateDisplay(); });
    skillsTabBtn.addEventListener('click', () => { openTab(skillsContainer); renderSkillsMenu(); });
    settingsTabBtn.addEventListener('click', () => { openTab(settingsContainer); updateSettingsButtonStates(); });
    ascensionTabBtn.addEventListener('click', () => { openTab(ascensionMenuContainer); updateDisplay(); });
    prestigeTabBtn.addEventListener('click', () => { openTab(prestigeMenuContainer); updateDisplay(); });
    questsTabBtn.addEventListener('click', () => { openTab(questsContainer); renderQuests(); });
    achievementsTabBtn.addEventListener('click', () => { openTab(achievementsContainer); renderAchievements(); });


    // --- Écouteurs d'événements pour le menu Compétences ---
    // Délégation d'événements pour les grilles de compétences
    studiesSkillsGrid.addEventListener('click', (event) => {
        const skillBox = event.target.closest('.skill-box');
        if (skillBox) {
            const skillId = skillBox.dataset.skillId;
            const panelType = skillBox.dataset.panelType;
            handleSkillClick(panelType, skillId);
        }
    });

    ascensionSkillsGrid.addEventListener('click', (event) => {
        const skillBox = event.target.closest('.skill-box');
        if (skillBox) {
            const skillId = skillBox.dataset.skillId;
            const panelType = skillBox.dataset.panelType;
            handleSkillClick(panelType, skillId);
        }
    });

    prestigeSkillsGrid.addEventListener('click', (event) => {
        const skillBox = event.target.closest('.skill-box');
        if (skillBox) {
            const skillId = skillBox.dataset.skillId;
            const panelType = skillBox.dataset.panelType;
            handleSkillClick(panelType, skillId);
        }
    });

    resetSkillsButton.addEventListener('click', () => {
        const customConfirmModal = document.createElement('div');
        customConfirmModal.id = 'confirmSkillResetModal';
        customConfirmModal.style.position = 'fixed';
        customConfirmModal.style.top = '0';
        customConfirmModal.style.left = '0';
        customConfirmModal.style.width = '100%';
        customConfirmModal.style.height = '100%';
        customConfirmModal.style.backgroundColor = 'rgba(0,0,0,0.5)';
        customConfirmModal.style.display = 'flex';
        customConfirmModal.style.justifyContent = 'center';
        customConfirmModal.style.alignItems = 'center';
        customConfirmModal.style.zIndex = '2001';

        customConfirmModal.innerHTML = `
            <div class="modal-content">
                <h3 class="warning-color">Réinitialiser les compétences ?</h3>
                <p>Êtes-vous sûr ? Vous récupérerez les points de compétence.</p>
                <div class="modal-buttons">
                    <button id="customConfirmYesSkills" class="can-afford">Oui</button>
                    <button id="customConfirmNoSkills" class="cannot-afford">Non</button>
                </div>
            </div>
        `;
        document.body.appendChild(customConfirmModal);

        document.getElementById('customConfirmYesSkills').addEventListener('click', () => {
            // Réinitialiser les compétences d'études
            studiesSkillPoints = studiesSkillPoints.add(Object.values(studiesSkillLevels).reduce((sum, level) => sum + level, 0));
            studiesSkillLevels = {};

            // Réinitialiser les compétences d'ascension
            ascensionSkillPoints = ascensionSkillPoints.add(Object.values(ascensionSkillLevels).reduce((sum, level) => sum + level, 0));
            ascensionSkillLevels = {};

            // Réinitialiser les compétences de prestige
            prestigeSkillPoints = prestigeSkillPoints.add(Object.values(prestigeSkillLevels).reduce((sum, level) => sum + level, 0));
            prestigeSkillLevels = {};

            // Réinitialiser le compteur de clics de compétence secrète
            secretSkillClicks = 0;

            applyAllSkillEffects();
            renderSkillsMenu();
            updateDisplay();
            saveGameState();
            showNotification("Compétences réinitialisées ! Points récupérés.");
            customConfirmModal.remove();
        });
        document.getElementById('customConfirmNoSkills').addEventListener('click', () => {
            customConfirmModal.remove();
        });
    });

    buyAllSkillsButton.addEventListener('click', () => {
        let panelType;
        // Déterminer quel panneau de compétences est actuellement visible
        if (skillsContainer.style.display === 'flex') {
            if (document.getElementById('studiesPanel').style.display === 'flex') panelType = 'studies';
            else if (document.getElementById('ascensionPanel').style.display === 'flex') panelType = 'ascension';
            else if (document.getElementById('prestigePanel').style.display === 'flex') panelType = 'prestige';
        }

        if (!panelType) {
            showNotification("Aucun arbre de compétences actif.");
            return;
        }

        let currentSkillLevels = {};
        let currentSkillPoints = new Decimal(0);

        if (panelType === 'studies') {
            currentSkillLevels = studiesSkillLevels;
            currentSkillPoints = studiesSkillPoints;
        } else if (panelType === 'ascension') {
            currentSkillLevels = ascensionSkillLevels;
            currentSkillPoints = ascensionSkillPoints;
        } else if (panelType === 'prestige') {
            currentSkillLevels = prestigeSkillLevels;
            currentSkillPoints = prestigeSkillPoints;
        }

        let skillsBought = 0;
        let pointsSpent = new Decimal(0);

        // Récupérer toutes les compétences du panneau triées par niveau
        const skillsInPanel = skillsData[panelType].sort((a, b) => a.tier - b.tier);

        for (const skill of skillsInPanel) {
            const currentLevel = currentSkillLevels[skill.id] || 0;
            if (currentLevel >= skill.maxLevel || skill.id === 'S5_2_Secret') continue; // Ignorer les compétences maxées et la compétence secrète

            // Vérifier les prérequis (niveau précédent maxé)
            let allPreviousTierMaxed = true;
            if (skill.tier > 1) {
                const previousTierSkills = skillsData[panelType].filter(s => s.tier === skill.tier - 1);
                allPreviousTierMaxed = previousTierSkills.every(s => (currentSkillLevels[s.id] || 0) >= s.maxLevel);
            }
            if (!allPreviousTierMaxed) continue; // Ne peut pas acheter si le niveau précédent n'est pas maxé

            // Tenter d'acheter des niveaux jusqu'au maximum ou jusqu'à épuisement des points
            for (let i = currentLevel; i < skill.maxLevel; i++) {
                if (currentSkillPoints.gte(1)) {
                    currentSkillLevels[skill.id] = (currentSkillLevels[skill.id] || 0) + 1;
                    currentSkillPoints = currentSkillPoints.sub(1);
                    pointsSpent = pointsSpent.add(1);
                    skillsBought++;
                } else {
                    break; // Plus de points
                }
            }
        }

        if (skillsBought > 0) {
            // Mettre à jour les points de compétence globaux après l'achat
            if (panelType === 'studies') studiesSkillPoints = currentSkillPoints;
            else if (panelType === 'ascension') ascensionSkillPoints = currentSkillPoints;
            else if (panelType === 'prestige') prestigeSkillPoints = currentSkillPoints;

            showNotification(`Acheté ${skillsBought} niveaux de compétences pour ${formatNumber(pointsSpent, 0)} points !`);
            applyAllSkillEffects();
            renderSkillsMenu();
            updateDisplay();
            saveGameState();
        } else {
            showNotification("Aucune compétence à acheter ou pas assez de points.");
        }
    });

    // --- Écouteurs d'événements pour le menu Paramètres (Simplifiés) ---
    themeToggleButton.addEventListener('click', () => toggleTheme());

    resetProgressionButton.addEventListener('click', () => {
        if (images.gte(10)) {
            // Utiliser une modale personnalisée pour la confirmation au lieu de confirm() du navigateur
            const customConfirmModal = document.createElement('div');
            customConfirmModal.id = 'confirmResetModal';
            customConfirmModal.style.position = 'fixed';
            customConfirmModal.style.top = '0';
            customConfirmModal.style.left = '0';
            customConfirmModal.style.width = '100%';
            customConfirmModal.style.height = '100%';
            customConfirmModal.style.backgroundColor = 'rgba(0,0,0,0.5)';
            customConfirmModal.style.display = 'flex';
            customConfirmModal.style.justifyContent = 'center';
            customConfirmModal.style.alignItems = 'center';
            customConfirmModal.style.zIndex = '2001';

            customConfirmModal.innerHTML = `
                <div class="modal-content">
                    <h3 class="warning-color">Réinitialiser la progression ?</h3>
                    <p>Cela réinitialisera tout votre jeu et coûtera 10 images. Êtes-vous sûr ?</p>
                    <div class="modal-buttons">
                        <button id="customConfirmYesReset" class="can-afford">Oui</button>
                        <button id="customConfirmNoReset" class="cannot-afford">Non</button>
                    </div>
                </div>
            `;
            document.body.appendChild(customConfirmModal);

            document.getElementById('customConfirmYesReset').addEventListener('click', () => {
                images = images.sub(10);
                hardResetGame(); // Ceci réinitialisera tout, y compris le prestige
                showNotification("Progression réinitialisée !");
                customConfirmModal.remove(); // Fermer la modale
            });
            document.getElementById('customConfirmNoReset').addEventListener('click', () => {
                customConfirmModal.remove(); // Fermer la modale
            });
        } else {
            showNotification("Pas assez d'images pour réinitialiser (coût : 10 I) !");
        }
    });

    offlineProgressToggle.addEventListener('change', (event) => toggleOfflineProgress(event.target.checked));

    toggleMinimalistResourcesButton.addEventListener('click', () => toggleMinimizeResources());

    statsButton.addEventListener('click', () => openStats());

    // Fermer la modale des statistiques en cliquant à l'extérieur
    statsModal.addEventListener('click', (event) => {
        if (event.target === statsModal) {
            closeStatsModal();
        }
    });

    // --- Écouteurs d'événements pour le menu Ascension ---
    ascensionTitleButton.addEventListener('click', () => {
        if (nombreProfesseur.lt(1)) {
            showNotification("Il faut au moins 1 Professeur pour Ascensionner.");
            return;
        }
        const paGained = calculatePAGained();
        paGainedDisplay.textContent = `${formatNumber(paGained, 0)} PA`;

        const currentAscensionBonus = new Decimal(1).add(ascensionCount.mul(totalPAEarned).mul(0.01)).add(skillEffects.ascensionBonusIncrease.mul(ascensionCount));
        const newAscensionBonus = new Decimal(1).add(ascensionCount.add(1).mul(totalPAEarned.add(paGained)).mul(0.01)).add(skillEffects.ascensionBonusIncrease.mul(ascensionCount.add(1)));

        if (ascensionCount.eq(0) || !disableAscensionWarning) { // Afficher l'avertissement complet pour la première ascension ou si non désactivé
            ascensionModalTitle.textContent = "Ascensionner ?";
            firstAscensionWarningDiv.style.display = 'block';
            subsequentAscensionWarningDiv.style.display = 'none';
            disableAscensionWarningCheckboxAscension.checked = disableAscensionWarning;

            // Mettre à jour le texte dynamique dans la modale
            const paGainText = document.querySelector('#firstAscensionWarning li:nth-child(3) span');
            if (paGainText) paGainText.innerHTML = `${formatNumber(paGained, 0)} PA`;

            const bonusCalcText = document.querySelector('#firstAscensionWarning li:nth-child(4) span');
            if (bonusCalcText) bonusCalcText.innerHTML = `Bonus d'Ascension</span> permanent qui augmentera votre production totale de Bons Points par seconde. Ce bonus est calculé comme suit :<br><span style="font-weight: bold;">1 + (Nombre total d'ascensions) x (PA totaux gagnés) x 0.01</span>. Ancien bonus: ${formatNumber(currentAscensionBonus, 2)}x à Nouveau bonus: ${formatNumber(newAscensionBonus, 2)}x.`;

        } else { // Afficher l'avertissement simplifié
            ascensionModalTitle.textContent = "Ascensionner ?";
            firstAscensionWarningDiv.style.display = 'none';
            subsequentAscensionWarningDiv.style.display = 'block';
            subsequentAscensionWarningDiv.innerHTML = `
                Vous êtes sur le point d'Ascensionner !<br>
                Cela vous rapportera <span class="ascension-points-color">${formatNumber(paGained, 0)} PA</span>.<br>
                Le bonus d'Ascension passera de <span class="ascension-points-color">${formatNumber(currentAscensionBonus, 2)}x</span> à <span class="ascension-points-color">${formatNumber(newAscensionBonus, 2)}x</span>.
            `;
        }
        confirmAscensionModal.style.display = 'flex';
    });

    confirmAscensionYesBtn.addEventListener('click', () => {
        if (ascensionCount.eq(0)) {
            disableAscensionWarning = disableAscensionWarningCheckboxAscension.checked;
        }
        performAscension();
        confirmAscensionModal.style.display = 'none';
    });
    confirmAscensionNoBtn.addEventListener('click', () => {
        confirmAscensionModal.style.display = 'none';
        showNotification("Ascension annulée.");
    });

    // --- Écouteurs d'événements pour les déblocages d'options (Ascension) ---
    unlockMultiPurchaseButton.addEventListener('click', () => {
        if (ascensionPoints.gte(10) && !multiPurchaseOptionUnlocked) {
            ascensionPoints = ascensionPoints.sub(10);
            multiPurchaseOptionUnlocked = true;
            showNotification("Achat multiple (x1, x10, x100) débloqué !");
            updateDisplay(); updateButtonStates(); saveGameState();
        } else if (multiPurchaseOptionUnlocked) {
            showNotification("Déjà débloqué !");
        } else {
            showNotification("Pas assez de PA (coût : 10 PA) !");
        }
    });

    unlockmaxPurchaseButton.addEventListener('click', () => {
        if (ascensionPoints.gte(100) && !maxPurchaseOptionUnlocked) {
            ascensionPoints = ascensionPoints.sub(100);
            maxPurchaseOptionUnlocked = true;
            showNotification("Achat multiple Max débloqué !");
            updateDisplay(); updateButtonStates(); saveGameState();
        } else if (maxPurchaseOptionUnlocked) {
            showNotification("Déjà débloqué !");
        } else {
            showNotification("Pas assez de PA (coût : 100 PA) !");
        }
    });

    unlockNewSettingsButton.addEventListener('click', () => {
        // newSettingsUnlocked est une variable globale qui devrait être définie dans core.js ou data.js
        // et gérée par le système de sauvegarde/chargement.
        if (ascensionPoints.gte(10) && !newSettingsUnlocked) {
            ascensionPoints = ascensionPoints.sub(10);
            newSettingsUnlocked = true;
            statsButtonUnlocked = true; // Débloquer le bouton des statistiques
            showNotification("Nouveaux réglages débloqués ! (Option progression hors ligne, minimisation des ressources et Statistiques)");
            updateDisplay(); updateButtonStates(); saveGameState();
        } else if (newSettingsUnlocked) {
            showNotification("Déjà débloqué !");
        } else {
            showNotification("Pas assez de PA (coût : 10 PA) !");
        }
    });

    unlockAutomationCategoryButton.addEventListener('click', () => {
        const cost = calculateAutomationCost(1000); // Utilise la fonction calculateAutomationCost
        if (ascensionPoints.gte(cost) && !automationCategoryUnlocked) {
            ascensionPoints = ascensionPoints.sub(cost);
            automationCategoryUnlocked = true;
            showNotification("Catégorie Automatisation débloquée !");
            updateDisplay(); updateButtonStates(); saveGameState();
        } else if (automationCategoryUnlocked) {
            showNotification("Déjà débloqué !");
        } else {
            showNotification(`Pas assez de PA (coût : ${formatNumber(cost, 0)} PA) !`);
        }
    });

    // --- Écouteurs d'événements pour le menu Prestige ---
    prestigeTitleButton.addEventListener('click', () => {
        if (nombreDoctorat.lt(1)) {
            showNotification("Il faut au moins 1 Doctorat pour Prestiger.");
            return;
        }

        const currentTotalPAEarned = totalPAEarned;
        const currentAscensionCount = ascensionCount;

        const ppGained = calculatePPGained(currentTotalPAEarned, currentAscensionCount);
        // getPrestigeBonusMultiplier doit prendre en compte le type de bonus ('bps' ou 'pa')
        const currentPrestigeBonusBPS = getPrestigeBonusMultiplier('bps');
        const newPrestigeBonusBPS = getPrestigeBonusMultiplier('bps', prestigeCount.add(1), prestigePoints.add(ppGained));

        const currentPrestigeBonusPA = getPrestigeBonusMultiplier('pa');
        const newPrestigeBonusPA = getPrestigeBonusMultiplier('pa', prestigeCount.add(1), prestigePoints.add(ppGained));

        prestigePointsGainedDisplay.textContent = `${formatNumber(ppGained, 0)} PP`; // Mise à jour de l'affichage

        if (!disablePrestigeWarning) {
            prestigeWarningText.innerHTML = `
                Êtes-vous sûr de vouloir effectuer un Prestige ?<br>
                Cela réinitialisera TOUTE votre progression actuelle (Bons Points, Images, Élèves, Classes, Professeur, PA, Ascensions) !<br>
                Vous gagnerez <span class="prestige-points-color">${formatNumber(ppGained, 0)} PP</span> (Points de Prestige) basés sur vos PA totaux et Ascensions totales.<br>
                Vous gagnerez également <span class="prestige-points-color">1 point de compétence de Prestige</span>.<br>
                Le bonus de production BP/s passera de <span class="prestige-points-color">${formatNumber(currentPrestigeBonusBPS, 2)}x</span> à <span class="prestige-points-color">${formatNumber(newPrestigeBonusBPS, 2)}x</span>.<br>
                Le bonus de gain de PA passera de <span class="prestige-points-color">${formatNumber(currentPrestigeBonusPA, 2)}x</span> à <span class="prestige-points-color">${formatNumber(newPrestigeBonusPA, 2)}x</span>.<br>
                <label><input type="checkbox" id="disablePrestigeWarningCheckbox"> Ne plus afficher cet avertissement</label>
            `;
            confirmPrestigeModal.style.display = 'flex';
        } else {
            // Si l'avertissement est désactivé, on effectue le prestige directement
            performPrestige();
        }
        // La checkbox doit refléter l'état actuel de disablePrestigeWarning même si la modale n'est pas affichée
        // (utile si l'utilisateur change d'avis avant de fermer la modale)
        disablePrestigeWarningCheckbox.checked = disablePrestigeWarning;
    });

    confirmPrestigeYesBtn.addEventListener('click', () => {
        disablePrestigeWarning = disablePrestigeWarningCheckbox.checked; // Enregistrer la préférence de l'utilisateur
        performPrestige();
        confirmPrestigeModal.style.display = 'none';
    });

    confirmPrestigeNoBtn.addEventListener('click', () => {
        confirmPrestigeModal.style.display = 'none';
        showNotification("Prestige annulé.");
    });

    // --- Écouteurs d'événements pour l'automatisation ---
    autoEleveBtn.addEventListener('click', () => {
        const cost = calculateAutomationCost(100);
        if (autoEleveActive) { autoEleveActive = false; showNotification("Auto Élèves désactivée."); }
        else if (ascensionPoints.gte(cost)) { ascensionPoints = ascensionPoints.sub(cost); autoEleveActive = true; showNotification("Auto Élèves activée !"); }
        else { showNotification(`Pas assez de PA (${formatNumber(cost, 0)} PA) !`); }
        updateDisplay(); updateAutomationButtonStates(); saveGameState();
    });
    autoClasseBtn.addEventListener('click', () => {
        const cost = calculateAutomationCost(500);
        if (autoClasseActive) { autoClasseActive = false; showNotification("Auto Classes désactivée."); }
        else if (ascensionPoints.gte(cost)) { ascensionPoints = ascensionPoints.sub(cost); autoClasseActive = true; showNotification("Auto Classes activée !"); }
        else { showNotification(`Pas assez de PA (${formatNumber(cost, 0)} PA) !`); }
        updateDisplay(); updateAutomationButtonStates(); saveGameState();
    });
    autoImageBtn.addEventListener('click', () => {
        const cost = calculateAutomationCost(10000);
        if (autoImageActive) { autoImageActive = false; showNotification("Auto Images désactivée."); }
        else if (ascensionPoints.gte(cost)) { ascensionPoints = ascensionPoints.sub(cost); autoImageActive = true; showNotification("Auto Images activée !"); }
        else { showNotification(`Pas assez de PA (${formatNumber(cost, 0)} PA) !`); }
        updateDisplay(); updateAutomationButtonStates(); saveGameState();
    });
    autoProfesseurBtn.addEventListener('click', () => {
        const cost = calculateAutomationCost(100000);
        if (autoProfesseurActive) { autoProfesseurActive = false; showNotification("Auto Profs désactivée."); }
        else if (ascensionPoints.gte(cost)) { ascensionPoints = ascensionPoints.sub(cost); autoProfesseurActive = true; showNotification("Auto Profs activée !"); }
        else { showNotification(`Pas assez de PA (${formatNumber(cost, 0)} PA) !`); }
        updateDisplay(); updateAutomationButtonStates(); saveGameState();
    });

    // --- Écouteurs d'événements pour les succès (tooltips) ---
    achievementsGrid.addEventListener('mouseover', (event) => {
        const achievementItem = event.target.closest('.achievement-item');
        if (achievementItem && !achievementTooltip.classList.contains('clicked')) {
            const achId = achievementItem.dataset.achId;
            const ach = achievementsData.find(a => a.id === achId);
            if (ach) {
                showAchievementTooltip(event, ach);
            }
        }
    });

    achievementsGrid.addEventListener('mouseout', (event) => {
        const achievementItem = event.target.closest('.achievement-item');
        if (achievementItem && !achievementTooltip.classList.contains('clicked')) {
            hideAchievementTooltip();
        }
    });

    achievementsGrid.addEventListener('click', (event) => {
        const achievementItem = event.target.closest('.achievement-item');
        if (achievementItem) {
            const achId = achievementItem.dataset.achId;
            const ach = achievementsData.find(a => a.id === achId);
            if (ach) {
                toggleAchievementTooltip(event, ach);
            }
        }
    });

    // Cacher l'infobulle si l'on clique n'importe où ailleurs sur le document
    document.addEventListener('click', (e) => {
        // activeAchievementTooltip est une variable globale qui devrait être définie dans ui.js
        // et gérée par les fonctions show/hide/toggleAchievementTooltip.
        if (activeAchievementTooltip && activeAchievementTooltip.classList.contains('clicked') && !achievementTooltip.contains(e.target)) {
            hideAchievementTooltip();
            achievementTooltip.classList.remove('clicked');
            activeAchievementTooltip = null;
        }
    });

    // Écouteur pour la compétence secrète (si elle existe)
    // Assurez-vous que 'secretSkillButton' est l'ID du bouton de compétence secrète
    const secretSkillButton = document.getElementById('S5_2_Secret');
    if (secretSkillButton) {
        secretSkillButton.addEventListener('click', () => {
            secretSkillClicks++;
            // Vous pouvez ajouter ici une logique pour un effet temporaire ou une notification
            showNotification(`Clic secret ! ${secretSkillClicks} clics sur la compétence secrète.`);
            saveGameState();
        });
    }
}

// Assurez-vous que cette fonction est appelée une fois que le DOM est prêt.
// Dans votre `index.html`, vous devrez importer ce module et appeler `initEventListeners`.
// Par exemple, dans votre `core.js` ou directement dans un script après le chargement du DOM:
/*
import { initEventListeners } from './events.js';

window.onload = function() {
    // ... votre logique de chargement de jeu et d'initialisation des variables ...
    loadGameState(); // Charge l'état du jeu et initialise les variables globales
    // ... autres initialisations ...

    initEventListeners(); // Appelle la fonction pour attacher les écouteurs d'événements

    // ... votre boucle de jeu setInterval ...
};
*/
