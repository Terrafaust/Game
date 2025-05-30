/*
 * ------------------ Fiche Mémo : events.js -----------------------------
 *
 * Description : Ce fichier est le point central de l'interactivité utilisateur dans le jeu "MonJeuIncremental".
 * Il est exclusivement dédié à la gestion de tous les écouteurs d'événements (clics de souris, changements
 * d'état de cases à cocher, etc.) sur les éléments de l'interface utilisateur (DOM). Son rôle principal
 * est d'attacher des gestionnaires d'événements aux éléments HTML et de déléguer les actions aux fonctions
 * de logique de jeu appropriées, définies dans d'autres modules (comme `core.js`, `studies.js`, `automation.js`,
 * `skills.js`, `ascension.js`, `prestige.js`, `settings.js`, `quests.js`, `achievements.js`, et `ui.js`).
 *
 * Objectif : Assurer une réactivité fluide de l'interface utilisateur aux interactions du joueur.
 * Il sert de "colle" entre la présentation (UI) et la logique métier (backend), en s'assurant
 * que chaque action utilisateur déclenche la fonction de jeu correcte, sans contenir de logique
 * de jeu complexe elle-même. Cela garantit une séparation claire des préoccupations et facilite
 * la maintenance et l'évolution du code.
 *
 * ------------------ Dépendances (Imports) ------------------
 *
 * Ce module importe explicitement toutes les variables d'état et fonctions nécessaires depuis les modules "propriétaires".
 *
 * - De './core.js' :
 * - Variables d'état (lecture et parfois modification directe pour les compteurs simples) :
 * `bonsPoints`, `totalClicks`, `ascensionPoints`, `ascensionCount`, `totalPAEarned`,
 * `prestigePoints`, `prestigeCount`, `studiesSkillPoints`, `ascensionSkillPoints`, `prestigeSkillPoints`,
 * `studiesSkillLevels`, `ascensionSkillLevels`, `prestigeSkillLevels`, `secretSkillClicks`,
 * `currentPurchaseMultiplier`, `ascensionUnlocked`, `prestigeUnlocked`,
 * `disableAscensionWarning`, `firstAscensionPerformed`, `disablePrestigeWarning`,
 * `multiPurchaseOptionUnlocked`, `maxPurchaseOptionUnlocked`, `automationCategoryUnlocked`,
 * `autoEleveActive`, `autoClasseActive`, `autoImageActive`, `autoProfesseurActive`,
 * `elevesUnlocked`, `classesUnlocked`, `imagesUnlocked`, `ProfesseurUnlocked`, `skillsButtonUnlocked`,
 * `settingsButtonUnlocked`, `ascensionMenuButtonUnlocked`, `prestigeMenuButtonUnlocked`,
 * `questsUnlocked`, `achievementsButtonUnlocked`, `nombreProfesseur`, `totalBonsPointsParSeconde`,
 * `skillEffects`, `newSettingsUnlocked`, `statsButtonUnlocked`.
 * - Fonctions de logique de jeu (appelées en réponse aux événements) :
 * `saveGameState`, `checkUnlockConditions`, `applyAllSkillEffects`, `calculateTotalBPS`,
 * `hardResetGame`, `performPurchase`, `formatNumber`.
 * Impact : Fournit l'accès à l'état global du jeu et aux fonctions fondamentales pour modifier cet état.
 *
 * - De './automation.js' :
 * - Fonctions : `calculateAutomationCost`.
 * Impact : Permet de calculer le coût des automatisations pour les affichages ou les vérifications.
 *
 * - De './skills.js' :
 * - Fonctions : `handleSkillClick` (pour la logique d'achat de compétences).
 * Impact : Délègue la gestion des clics sur les compétences à ce module spécialisé.
 *
 * - De './ascension.js' :
 * - Fonctions : `calculatePAGained` (pour l'affichage des PA potentiels), `performAscension` (pour exécuter l'Ascension).
 * Impact : Permet de déclencher les actions et calculs liés à l'Ascension.
 *
 * - De './prestige.js' :
 * - Fonctions : `calculatePPGained` (pour l'affichage des PP potentiels), `performPrestige` (pour exécuter le Prestige),
 * `getPrestigeBonusMultiplier` (pour afficher les bonus de Prestige).
 * Impact : Permet de déclencher les actions et calculs liés au Prestige.
 *
 * - De './settings.js' :
 * - Fonctions : `toggleTheme`, `toggleOfflineProgress`, `toggleMinimizeResources`.
 * Impact : Gère les changements de paramètres du jeu.
 *
 * - De './quests.js' :
 * - Fonctions : `updateQuestProgress` (appelée par `core.js`, mais listée ici pour exhaustivité),
 * `claimQuestReward` (pour la logique de réclamation de quêtes).
 * Impact : Permet de déclencher la réclamation des récompenses de quêtes.
 *
 * - De './achievements.js' :
 * - Fonctions : `checkAchievements` (appelée par `core.js`), `showAchievementTooltip`,
 * `hideAchievementTooltip`, `toggleAchievementTooltip`.
 * - Variables : `unlockedAchievements`, `activeAchievementTooltip`.
 * Impact : Gère l'affichage et l'interaction avec les infobulles des succès.
 *
 * - De './ui.js' :
 * - Fonctions : `updateDisplay`, `showNotification`, `updateButtonStates`, `updateSectionVisibility`,
 * `updateAutomationButtonStates`, `updateSettingsButtonStates`, `renderSkillsMenu`,
 * `renderQuests`, `renderAchievements`, `openTab`, `closeStatsModal`, `updateStatsDisplay`,
 * `updateMultiplierButtons`, `openStatsModal`.
 * Impact : Gère toutes les mises à jour visuelles de l'interface utilisateur et la navigation entre les onglets/modales.
 *
 * - De './data.js' :
 * - Données statiques : `skillsData`, `achievementsData`, `prestigePurchasesData`.
 * Impact : Fournit les définitions nécessaires pour les boucles d'événements (ex: itérer sur les succès).
 *
 * ------------------ Fonctions Clés Définies et Exportées ------------------
 *
 * - `export function initEventListeners()` :
 * Description : Fonction principale d'initialisation des écouteurs d'événements.
 * Elle est appelée une seule fois après que le DOM est entièrement chargé et que l'état
 * initial du jeu est établi. Elle récupère les références à tous les éléments DOM
 * interactifs et attache les gestionnaires d'événements appropriés (clics, changements, etc.).
 * Utilise la délégation d'événements pour les éléments générés dynamiquement (compétences, quêtes, succès).
 * Appelée par : `core.js` (généralement dans `window.onload` ou `initializeGame`).
 * Impact : Rend le jeu interactif en connectant l'interface utilisateur à la logique du jeu.
 *
 * ------------------ Éléments DOM Clés (référencés par ID) ------------------
 *
 * Ce module récupère directement les références aux éléments DOM via `document.getElementById`
 * pour attacher les écouteurs d'événements.
 *
 * - Boutons d'action principaux :
 * - `studiesTitleButton` : Bouton principal pour "Étudier sagement" (clic pour gagner des BP).
 * - `acheterEleveButton`, `acheterClasseButton`, `acheterImageButton`, `acheterProfesseurButton` : Boutons d'achat d'unités d'études.
 * - `acheterEcoleButton`, `acheterLyceeButton`, `acheterCollegeButton` : Boutons d'achat de structures d'Ascension.
 * - `acheterLicenceButton`, `acheterMaster1Button`, `acheterMaster2Button`, `acheterDoctoratButton`, `acheterPostDoctoratButton` : Boutons d'achat de prestige.
 *
 * - Boutons de navigation/onglets :
 * - `studiesTabBtn`, `automationTabBtn`, `skillsTabBtn`, `settingsTabBtn`, `ascensionTabBtn`, `prestigeTabBtn`, `questsTabBtn`, `achievementsTabBtn` : Boutons du menu latéral pour changer d'onglet.
 * - `statsButton` : Bouton pour ouvrir la modale des statistiques.
 *
 * - Boutons de paramètres/options :
 * - `themeToggleButton` : Bouton pour basculer le thème (jour/nuit).
 * - `resetProgressionButton` : Bouton pour réinitialiser complètement le jeu.
 * - `offlineProgressToggle` : Case à cocher pour activer/désactiver la progression hors ligne.
 * - `toggleMinimalistResourcesButton` : Bouton pour basculer l'affichage des ressources en mode minimaliste.
 *
 * - Boutons/éléments des modales de confirmation :
 * - `ascensionTitleButton`, `confirmAscensionYesBtn`, `confirmAscensionNoBtn`, `disableAscensionWarningCheckboxAscension` : Éléments liés à la modale de confirmation d'Ascension.
 * - `prestigeTitleButton`, `confirmPrestigeYesBtn`, `confirmPrestigeNoBtn`, `disablePrestigeWarningCheckbox` : Éléments liés à la modale de confirmation de Prestige.
 * - `resetSkillsButton`, `buyAllSkillsButton` : Boutons de réinitialisation/achat de toutes les compétences.
 *
 * - Conteneurs pour délégation d'événements (éléments dynamiques) :
 * - `multiplierButtonsContainer` : Conteneur des boutons de multiplicateur d'achat (x1, x10, etc.).
 * - `studiesSkillsGrid`, `ascensionSkillsGrid`, `prestigeSkillsGrid` : Grilles des compétences pour chaque catégorie.
 * - `achievementsGrid` : Grille d'affichage des succès.
 * - `questsListContainer` : Conteneur principal de la liste des quêtes.
 *
 * - Autres éléments d'affichage interagis :
 * - `statsModal` : Conteneur de la modale des statistiques (pour fermer au clic extérieur).
 * - `achievementTooltip` : Infobulle des succès.
 * - `paGainedDisplay`, `prestigePointsGainedDisplay` : Affichage des gains potentiels lors des resets.
 * - `clickBonsPointsDisplay`, `bonsPointsSpan`, `miniBonsPoints` : Affichages des Bons Points et bonus de clic.
 *
 * ------------------ Logique Générale et Flux de Données ------------------
 *
 * 1.  **Initialisation** : La fonction `initEventListeners()` est appelée une fois au démarrage du jeu.
 * Elle récupère toutes les références DOM nécessaires et configure les écouteurs d'événements.
 * 2.  **Délégation d'Événements** : Pour les éléments générés dynamiquement (compétences, quêtes, succès, multiplicateurs),
 * des écouteurs sont attachés à un conteneur parent statique. Lorsque l'événement se produit,
 * le gestionnaire vérifie si l'élément cliqué (ou survolé) correspond à un sous-élément d'intérêt
 * (`event.target.closest()`, `classList.contains()`).
 * 3.  **Appel des Fonctions de Logique** : Une fois l'élément d'intérêt identifié, `events.js` appelle
 * la fonction appropriée du module de logique concerné (ex: `performPurchase` de `core.js`,
 * `handleSkillClick` de `skills.js`, `claimQuestReward` de `quests.js`).
 * 4.  **Mise à Jour de l'UI** : Après l'exécution de la logique, `events.js` (ou la fonction de logique appelée)
 * déclenche des mises à jour de l'interface via des fonctions de `ui.js` (`updateDisplay`, `showNotification`,
 * `openTab`, etc.) pour refléter les changements d'état du jeu.
 * 5.  **Gestion des Modales** : Pour les confirmations (Ascension, Prestige, Reset), `events.js` gère
 * l'affichage de modales personnalisées (au lieu des `confirm()` natifs du navigateur) et les actions
 * associées aux boutons "Oui"/"Non" de ces modales.
 *
 * ------------------ Notes Spécifiques ------------------
 *
 * - **Séparation des préoccupations** : `events.js` est un exemple clé de la séparation des préoccupations.
 * Il ne contient aucune logique de jeu complexe, mais agit comme un "routeur" d'événements,
 * redirigeant les interactions utilisateur vers les modules qui gèrent la logique métier.
 * - **Robustesse** : Des vérifications `if (element)` sont utilisées lors de la récupération des éléments DOM
 * pour éviter les erreurs si un élément n'est pas encore présent dans le DOM au moment de l'initialisation
 * des écouteurs.
 * - **Pas d'`alert()` ni `confirm()`** : Le jeu utilise des modales HTML/CSS/JS personnalisées pour les
 * confirmations et notifications, car les fonctions natives du navigateur (`alert()`, `confirm()`)
 * peuvent bloquer l'interface et ne sont pas stylisables.
 * - **Gestion de la compétence secrète** : Un écouteur spécifique est mis en place pour une compétence
 * secrète, démontrant la capacité à gérer des interactions uniques.
 *
 * ---------------------------------------------------------------------
 */

// Importations des variables d'état et fonctions globales depuis core.js (modif 30/05)
import {
    bonsPoints, totalClicks, ascensionPoints, ascensionCount, totalPAEarned,
    prestigePoints, prestigeCount, studiesSkillPoints, ascensionSkillPoints, prestigeSkillPoints,
    studiesSkillLevels, ascensionSkillLevels, prestigeSkillLevels, secretSkillClicks,
    currentPurchaseMultiplier, ascensionUnlocked, prestigeUnlocked,
    disableAscensionWarning, firstAscensionPerformed, disablePrestigeWarning,
    multiPurchaseOptionUnlocked, maxPurchaseOptionUnlocked, automationCategoryUnlocked,
    autoEleveActive, autoClasseActive, autoImageActive, autoProfesseurActive,
    elevesUnlocked, classesUnlocked, imagesUnlocked, ProfesseurUnlocked, skillsButtonUnlocked,
    settingsButtonUnlocked, ascensionMenuButtonUnlocked, prestigeMenuButtonUnlocked,
    questsUnlocked, achievementsButtonUnlocked, nombreProfesseur, totalBonsPointsParSeconde, skillEffects,
    saveGameState, checkUnlockConditions, applyAllSkillEffects, calculateTotalBPS, hardResetGame, performPurchase, formatNumber
} from './core.js';

// Importations des fonctions d'automatisation (modif 30/05)
import { calculateAutomationCost } from './automation.js';

// Importations des fonctions de compétences (modif 30/05)
import { handleSkillClick } from './skills.js';

// Importations des fonctions d'ascension (modif 30/05)
import { calculatePAGained, performAscension } from './ascension.js';

// Importations des fonctions de prestige (modif 30/05)
import { calculatePPGained, performPrestige, getPrestigeBonusMultiplier } from './prestige.js';

// Importations des fonctions de paramètres (modif 30/05)
import { toggleTheme, toggleOfflineProgress, toggleMinimizeResources } from './settings.js';

// Importations des fonctions de quêtes (modif 30/05)
import { updateQuestProgress, claimQuestReward } from './quests.js'; // (maj 30/05 Quete)

// Importations des fonctions de succès (modif 30/05)
import { checkAchievements, showAchievementTooltip, hideAchievementTooltip, toggleAchievementTooltip, unlockedAchievements, activeAchievementTooltip } from './achievements.js'; // activeAchievementTooltip est exporté par achievements.js

// Importations des fonctions d'UI (modif 30/05)
import {
    updateDisplay, showNotification, updateButtonStates, updateSectionVisibility, updateAutomationButtonStates,
    updateSettingsButtonStates, renderSkillsMenu, renderQuests, renderAchievements,
    openTab, closeStatsModal, updateStatsDisplay, updateMultiplierButtons, openStatsModal // openStats est maintenant openStatsModal de ui.js
} from './ui.js';

// Importations des données (modif 30/05)
import { skillsData, achievementsData, prestigePurchasesData } from './data.js';


/**
 * Initialise tous les écouteurs d'événements pour le jeu.
 * Cette fonction doit être appelée une fois que le DOM est complètement chargé
 * et que toutes les variables globales nécessaires sont initialisées.
 */
export function initEventListeners() {
    // --- Récupération des éléments DOM (modif 30/05) ---
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
    const statsModal = document.getElementById('statsModal');

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

    const multiplierButtonsContainer = document.getElementById('multiplierButtonsContainer');
    const studiesSkillsGrid = document.getElementById('studiesSkillsGrid');
    const ascensionSkillsGrid = document.getElementById('ascensionSkillsGrid');
    const prestigeSkillsGrid = document.getElementById('prestigeSkillsGrid');

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
    const prestigePointsGainedDisplay = document.getElementById('prestigePointsGainedDisplay');

    const clickBonsPointsDisplay = document.getElementById('clickBonsPointsDisplay');
    const bonsPointsSpan = document.getElementById('bonsPointsSpan');
    const miniBonsPoints = document.getElementById('miniBonsPoints');

    const questsListContainer = document.getElementById('questsList'); // (maj 30/05 Quete)


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

    statsButton.addEventListener('click', () => openStatsModal()); // (modif 30/05)

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

        const currentAscensionMultiplier = new Decimal(1).add(ascensionCount.mul(totalPAEarned).mul(0.01)).add(skillEffects.ascensionBonusIncrease.mul(ascensionCount));
        const newAscensionMultiplier = new Decimal(1).add(ascensionCount.add(1).mul(totalPAEarned.add(paGained)).mul(0.01)).add(skillEffects.ascensionBonusIncrease.mul(ascensionCount.add(1))); // (modif 30/05)

        if (ascensionCount.eq(0) || !disableAscensionWarning) { // Afficher l'avertissement complet pour la première ascension ou si non désactivé
            ascensionModalTitle.textContent = "Ascensionner ?";
            firstAscensionWarningDiv.style.display = 'block';
            subsequentAscensionWarningDiv.style.display = 'none';
            disableAscensionWarningCheckboxAscension.checked = disableAscensionWarning;

            // Mettre à jour le texte dynamique dans la modale
            const paGainText = document.querySelector('#firstAscensionWarning li:nth-child(3) span');
            if (paGainText) paGainText.innerHTML = `${formatNumber(paGained, 0)} PA`;

            const bonusCalcText = document.querySelector('#firstAscensionWarning li:nth-child(4) span');
            if (bonusCalcText) bonusCalcText.innerHTML = `Bonus d'Ascension</span> permanent qui augmentera votre production totale de Bons Points par seconde. Ce bonus est calculé comme suit :<br><span style="font-weight: bold;">1 + (Nombre total d'ascensions) x (PA totaux gagnés) x 0.01</span>. Ancien bonus: ${formatNumber(currentAscensionMultiplier, 2)}x à Nouveau bonus: ${formatNumber(newAscensionMultiplier, 2)}x.`; // (modif 30/05)

        } else { // Afficher l'avertissement simplifié
            ascensionModalTitle.textContent = "Ascensionner ?";
            firstAscensionWarningDiv.style.display = 'none';
            subsequentAscensionWarningDiv.style.display = 'block';
            subsequentAscensionWarningDiv.innerHTML = `
                Vous êtes sur le point d'Ascensionner !<br>
                Cela vous rapportera <span class="ascension-points-color">${formatNumber(paGained, 0)} PA</span>.<br>
                Le bonus d'Ascension passera de <span class="ascension-points-color">${formatNumber(currentAscensionMultiplier, 2)}x</span> à <span class="ascension-points-color">${formatNumber(newAscensionMultiplier, 2)}x</span>.
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
        const currentPrestigeBonusBPS = getPrestigeBonusMultiplier('bps', prestigeCount); // (modif 30/05)
        const newPrestigeBonusBPS = getPrestigeBonusMultiplier('bps', prestigeCount.add(1)); // (modif 30/05)

        const currentPrestigeBonusPA = getPrestigeBonusMultiplier('pa', prestigeCount); // (modif 30/05)
        const newPrestigeBonusPA = getPrestigeBonusMultiplier('pa', prestigeCount.add(1)); // (modif 30/05)

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

    // --- Écouteurs d'événements pour les quêtes (délégation) --- (maj 30/05 Quete)
    if (questsListContainer) {
        questsListContainer.addEventListener('click', function(event) {
            if (event.target && event.target.classList.contains('claim-quest-button')) {
                const questId = event.target.dataset.questId;
                if (questId) {
                    claimQuestReward(questId);
                }
            }
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
