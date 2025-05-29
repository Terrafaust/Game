/**
*/
// Fiche Mémo : ui.js
// Description : Ce fichier est dédié à la gestion de l'interface utilisateur du jeu.
// Il est responsable de la mise à jour de l'affichage de toutes les ressources,
// des états des boutons, de la visibilité des sections, des notifications,
// et du rendu des menus dynamiques comme l'arbre de compétences, les quêtes et les succès.
// Il ne contient aucune logique de jeu (calculs de production, achats, réinitialisations),
// mais interagit avec les données et les fonctions définies dans d'autres modules.

// Dépendances :
// - core.js : Fournit les variables d'état du jeu (bonsPoints, images, nombreEleves, etc.),
//             les totaux de production (totalBonsPointsParSeconde), les fonctions
//             de calcul de production (elevesBpsPerItem, classesBpsPerItem),
//             les variables de déverrouillage (elevesUnlocked, ascensionUnlocked, etc.),
//             ainsi que les fonctions `formatNumber`, `applyAllSkillEffects`, `updateCachedMultipliers`,
//             `calculateTotalBPS`, `checkUnlockConditions`, `updateButtonStates`,
//             `updateAutomationButtonStates`, `updateSettingsButtonStates`, `openTab`,
//             `closeStatsModal`, `updateStatsDisplay`.
// - data.js : Contient les données statiques du jeu, y compris les définitions
//             des compétences (skillsData), des quêtes (questsData), des succès (achievementsData),
//             et des achats de prestige (prestigePurchasesData).
// - studies.js : Fournit les fonctions de calcul de coût pour les études
//                (calculateNextEleveCost, calculateNextClasseCost, calculateNextImageCost,
//                calculateNextProfessorCost).
// - automation.js : Fournit la fonction de calcul de coût pour l'automatisation
//                   (calculateAutomationCost).
// - skills.js : Fournit la fonction `buySkill` pour gérer l'achat de compétences.
// - ascension.js : Fournit les fonctions de calcul de coût pour l'ascension
//                  (calculateNextEcoleCost, calculateNextLyceeCost, calculateNextCollegeCost).
// - prestige.js : Fournit les fonctions de calcul de coût pour le prestige
//                 (calculateLicenceCost, calculateMaster1Cost, calculateMaster2Cost,
//                 calculateDoctoratCost, calculatePostDoctoratCost) et la fonction
//                 `getPrestigeBonusMultiplier`.
// - break_infinity.min.js : La bibliothèque `Decimal` est supposée être globalement disponible
//                           pour la gestion des grands nombres.

// Variables Clés (utilisées par ui.js, mais définies ailleurs et importées) :
// - bonsPoints, images, nombreEleves, nombreClasses, nombreProfesseur : Ressources principales.
// - totalBonsPointsParSeconde : Production totale de BP/s.
// - ascensionPoints, ascensionCount, totalPAEarned, ascensionBonus : Variables d'ascension.
// - prestigePoints, prestigeCount : Variables de prestige.
// - schoolCount, nombreLycees, nombreColleges, nombreLicences, nombreMaster1,
//   nombreMaster2, nombreDoctorat, nombrePostDoctorat : Quantités d'achats supérieurs.
// - totalClicks : Compteur de clics.
// - currentPurchaseMultiplier : Multiplicateur d'achat actuel (x1, x10, x100, max).
// - isDayTheme, minimizeResourcesActive, offlineProgressEnabled : États des paramètres.
// - autoEleveActive, autoClasseActive, autoImageActive, autoProfesseurActive : États d'automatisation.
// - elevesUnlocked, classesUnlocked, imagesUnlocked, ProfesseurUnlocked,
//   ascensionUnlocked, prestigeUnlocked, skillsButtonUnlocked, settingsButtonUnlocked,
//   automationCategoryUnlocked, questsUnlocked, achievementsButtonUnlocked,
//   newSettingsUnlocked, multiPurchaseOptionUnlocked, maxPurchaseOptionUnlocked,
//   statsButtonUnlocked, prestigeMenuButtonUnlocked, ascensionMenuButtonUnlocked,
//   lyceesUnlocked, collegesUnlocked, studiesSkillsUnlocked, ascensionSkillsUnlocked, prestigeSkillsUnlocked : Flags de déverrouillage des fonctionnalités/sections.
// - studiesSkillPoints, ascensionSkillPoints, prestigeSkillPoints : Points de compétence.
// - studiesSkillLevels, ascensionSkillLevels, prestigeSkillLevels : Niveaux des compétences débloquées.
// - secretSkillClicks : Compteur pour la compétence secrète.
// - unlockedAchievements : Objet des succès débloqués.
// - permanentBpsBonusFromAchievements : Bonus permanent des succès.
// - paMultiplierFromQuests : Multiplicateur de PA des quêtes.
// - skillEffects : Objet contenant les effets cumulés de toutes les compétences et succès.
// - clickBonsPoints : Bonus de bons points par clic (remplacé par skillEffects.clickBonsPointsBonus).
// - ecoleMultiplier, lyceeMultiplier, collegeMultiplier : Multiplicateurs des structures d'ascension.

// Fonctions Clés (appelées par ui.js, mais définies ailleurs et importées) :
// - formatNumber(num, decimalPlaces, exponentThreshold) : Formate un nombre pour l'affichage.
// - calculateNextEleveCost(count), calculateNextClasseCost(count), etc. : Calculent les coûts des achats.
// - calculateAutomationCost(baseCost) : Calcule le coût des automatisations.
// - calculatePAGained() : Calcule les PA gagnés à l'ascension.
// - calculatePPGained(totalPA, totalAscensions) : Calcule les PP gagnés au prestige.
// - getPrestigeBonusMultiplier(type, currentPrestigeCount, currentPrestigePoints) : Calcule les multiplicateurs de prestige.
// - calculateTotalBPS() : Recalcule la production totale de BP/s.
// - buySkill(panelType, skillId) : Fonction pour acheter une compétence.
// - checkUnlockConditions() : Vérifie et applique les déverrouillages.
// - checkAchievements() : Vérifie et débloque les succès.

// Fonctions Clés (définies et exportées par ui.js) :
// - updateDisplay() : Met à jour l'affichage de toutes les ressources et éléments UI.
// - showNotification(message, type = 'info') : Affiche une notification pop-up.
// - updateSectionVisibility() : Contrôle la visibilité des sections du jeu.
// - updateMultiplierButtons() : Met à jour l'état visuel des boutons de multiplicateur.
// - updateAutomationButtonStates() : Met à jour l'état visuel des boutons d'automatisation.
// - updateSettingsButtonStates() : Met à jour l'état visuel des boutons des paramètres.
// - renderSkillsMenu() : Orchestre le rendu complet de l'arbre de compétences.
// - renderSkillPanel(panelType, gridElement, skillLevels, skillPoints, isPanelUnlocked) : Rend un panneau de compétences spécifique.
// - handleSkillClick(panelType, skillId) : Gère la logique de clic sur une compétence.
// - renderQuests() : Rend la liste des quêtes actives et terminées.
// - renderAchievements() : Rend la grille des succès.
// - showAchievementTooltip(event, ach) : Affiche l'infobulle d'un succès.
// - hideAchievementTooltip() : Masque l'infobulle d'un succès.
// - toggleAchievementTooltip(event, ach) : Bascule l'affichage de l'infobulle d'un succès.
// - openTab(tabContainer) : Ouvre une section principale du jeu.
// - openStatsModal() : Ouvre la modale des statistiques.
// - closeStatsModal() : Ferme la modale des statistiques.
// - updateStatsDisplay() : Met à jour les valeurs affichées dans la modale des statistiques.

// Éléments DOM Clés (référencés par ID) :
// - #bonsPoints, #totalBpsInline, #imagesCount, #nombreProfesseur, etc. : Affichage des ressources.
// - #acheterEleveButton, #acheterClasseButton, etc. : Boutons d'achat.
// - #studiesTabBtn, #automationTabBtn, etc. : Boutons de navigation latérale.
// - #studiesMainContainer, #automationMainContainer, etc. : Conteneurs des sections principales.
// - #notifications-container : Conteneur des notifications.
// - #skillPanels, #studiesSkillsGrid, #ascensionSkillsGrid, #prestigeSkillsGrid : Arbre de compétences.
// - #questsList, #completedQuestsList : Listes des quêtes.
// - #achievementsGrid, #achievementTooltip : Grille et infobulle des succès.
// - #statsModal : Modale des statistiques.

// Logique Générale :
// Ce fichier est le "front-end" visuel du jeu. Il prend les données de l'état du jeu
// (gérées par `core.js` et d'autres modules de logique) et les traduit en éléments
// HTML visibles et interactifs. Il ne contient pas de logique de jeu (achats,
// calculs de production, réinitialisations, etc.), mais appelle les fonctions
// appropriées des autres modules si nécessaire pour obtenir les données à afficher.

// Notes Spécifiques :
// - Les IDs des éléments HTML sont supposés correspondre à ceux définis dans `index.html`.
// - Ce fichier ne contient pas d'écouteurs d'événements directs (addEventListener).
//   Ces derniers sont gérés dans `events.js` qui appelle les fonctions de `ui.js`.

// --- Importation des fonctions et données des autres modules ---
// Assurez-vous que ces imports correspondent aux exports des fichiers respectifs.
import {
    bonsPoints, totalBonsPointsParSeconde, images, nombreEleves, nombreClasses, nombreProfesseur,
    schoolCount, nombreLycees, nombreColleges, ascensionPoints, ascensionCount, totalPAEarned,
    ascensionBonus, prestigePoints, prestigeCount, totalClicks, currentPurchaseMultiplier,
    elevesUnlocked, classesUnlocked, imagesUnlocked, ProfesseurUnlocked, ascensionUnlocked, prestigeUnlocked,
    skillsButtonUnlocked, settingsButtonUnlocked, automationCategoryUnlocked, questsUnlocked, achievementsButtonUnlocked,
    newSettingsUnlocked, multiPurchaseOptionUnlocked, maxPurchaseOptionUnlocked, statsButtonUnlocked,
    prestigeMenuButtonUnlocked, ascensionMenuButtonUnlocked,
    autoEleveActive, autoClasseActive, autoImageActive, autoProfesseurActive,
    studiesSkillPoints, ascensionSkillPoints, prestigeSkillPoints,
    studiesSkillLevels, ascensionSkillLevels, prestigeSkillLevels, secretSkillClicks,
    isDayTheme, themeOptionUnlocked, offlineProgressEnabled, minimizeResourcesActive,
    disableAscensionWarning, firstAscensionPerformed, disablePrestigeWarning,
    nombreLicences, nombreMaster1, nombreMaster2, nombreDoctorat, nombrePostDoctorat,
    skillEffects, permanentBpsBonusFromAchievements, paMultiplierFromQuests,
    formatNumber, applyAllSkillEffects, updateCachedMultipliers, calculateTotalBPS,
    checkUnlockConditions, updateButtonStates,
    // Variables pour les multiplicateurs des structures d'ascension.
    // Assurez-vous que ces variables sont bien exportées par core.js ou ascension.js
    ecoleMultiplier, lyceeMultiplier, collegeMultiplier,
    // Variables de déverrouillage spécifiques aux lycées/collèges et compétences
    lyceesUnlocked, collegesUnlocked, studiesSkillsUnlocked, ascensionSkillsUnlocked, prestigeSkillsUnlocked
} from './core.js'; // Importe les variables d'état et fonctions principales de core.js

import { calculateNextEleveCost, calculateNextClasseCost, calculateNextImageCost, calculateNextProfessorCost,
         elevesBpsPerItem, classesBpsPerItem } from './studies.js';
import { calculateAutomationCost } from './automation.js';
import { skillsData, prestigePurchasesData, questsData, achievementsData } from './data.js';
import { calculateNextEcoleCost, calculateNextLyceeCost, calculateNextCollegeCost } from './ascension.js';
import { getPrestigeBonusMultiplier, calculateLicenceCost, calculateMaster1Cost, calculateMaster2Cost,
         calculateDoctoratCost, calculatePostDoctoratCost } from './prestige.js';
import { buySkill } from './skills.js'; // Importe la fonction buySkill

// Assumes Decimal is globally available from break_infinity.min.js

/**
 * Met à jour l'affichage de toutes les ressources principales et des boutons d'achat.
 * Cette fonction est appelée fréquemment pour refléter l'état actuel du jeu.
 */
export function updateDisplay() {
    // Mise à jour des ressources principales
    document.getElementById('bonsPoints').textContent = formatNumber(bonsPoints, 0);
    document.getElementById('totalBpsInline').textContent = formatNumber(totalBonsPointsParSeconde, 1);

    if (imagesUnlocked) {
        document.getElementById('imagesDisplay').style.display = 'block';
        document.getElementById('imagesCount').textContent = formatNumber(images, 0);
    } else {
        document.getElementById('imagesDisplay').style.display = 'none';
    }

    if (ProfesseurUnlocked) {
        document.getElementById('nombreProfesseurDisplay').style.display = 'block';
        document.getElementById('nombreProfesseur').textContent = formatNumber(nombreProfesseur, 0);
    } else {
        document.getElementById('nombreProfesseurDisplay').style.display = 'none';
    }

    // Mise à jour des ressources d'Ascension
    if (ascensionUnlocked || ascensionCount.gt(0)) {
        document.getElementById('currentAscensionPointsDisplay').style.display = 'block';
        document.getElementById('ascensionPointsCount').textContent = formatNumber(ascensionPoints, 0);
        document.getElementById('totalPAEarnedSpanInline').textContent = formatNumber(totalPAEarned, 0);

        document.getElementById('ascensionCountDisplay').style.display = 'block';
        document.getElementById('ascensionCountSpan').textContent = formatNumber(ascensionCount, 0);

        document.getElementById('ascensionBonusDisplay').style.display = 'block';
        // Assumes 'ascensionBonus' is a global variable calculated elsewhere (e.g., core.js)
        document.getElementById('ascensionBonusValue').textContent = `${formatNumber(ascensionBonus, 2)}x`;
    } else {
        document.getElementById('currentAscensionPointsDisplay').style.display = 'none';
        document.getElementById('ascensionCountDisplay').style.display = 'none';
        document.getElementById('ascensionBonusDisplay').style.display = 'none';
    }

    // Mise à jour des ressources de Prestige
    if (prestigeUnlocked || prestigeCount.gt(0)) {
        document.getElementById('prestigePointsDisplay').style.display = 'block';
        document.getElementById('prestigePointsCount').textContent = formatNumber(prestigePoints, 0);

        document.getElementById('prestigeCountDisplay').style.display = 'block';
        document.getElementById('prestigeCountSpan').textContent = formatNumber(prestigeCount, 0);
    } else {
        document.getElementById('prestigePointsDisplay').style.display = 'none';
        document.getElementById('prestigeCountDisplay').style.display = 'none';
    }

    // Mise à jour des éléments de la section "Études"
    if (elevesUnlocked) {
        document.getElementById('achatEleveSection').style.display = 'block';
        const coutEleveActuel = calculateNextEleveCost(nombreEleves);
        document.getElementById('acheterEleveButton').innerHTML = `Élève : <span class="bons-points-color">${formatNumber(coutEleveActuel, 0)} BP</span>`;
        document.getElementById('acheterEleveButton').classList.toggle('can-afford', bonsPoints.gte(coutEleveActuel));
        document.getElementById('acheterEleveButton').classList.toggle('cannot-afford', bonsPoints.lt(coutEleveActuel));
        document.getElementById('nombreEleves').textContent = formatNumber(nombreEleves, 0);
        document.getElementById('elevesBpsPerItem').textContent = formatNumber(elevesBpsPerItem, 1);
    } else {
        document.getElementById('achatEleveSection').style.display = 'none';
    }

    if (classesUnlocked) {
        document.getElementById('achatClasseSection').style.display = 'block';
        const coutClasseActuel = calculateNextClasseCost(nombreClasses);
        document.getElementById('acheterClasseButton').innerHTML = `Salle de classe : <span class="bons-points-color">${formatNumber(coutClasseActuel, 0)} BP</span>`;
        document.getElementById('acheterClasseButton').classList.toggle('can-afford', bonsPoints.gte(coutClasseActuel));
        document.getElementById('acheterClasseButton').classList.toggle('cannot-afford', bonsPoints.lt(coutClasseActuel));
        document.getElementById('nombreClasses').textContent = formatNumber(nombreClasses, 0);
        document.getElementById('classesBpsPerItem').textContent = formatNumber(classesBpsPerItem, 1);
    } else {
        document.getElementById('achatClasseSection').style.display = 'none';
    }

    if (imagesUnlocked) {
        document.getElementById('achatImageSection').style.display = 'block';
        const coutImageActuel = calculateNextImageCost(images);
        document.getElementById('acheterImageButton').innerHTML = `Image : <span class="bons-points-color">${formatNumber(coutImageActuel, 0)} BP</span>`;
        document.getElementById('acheterImageButton').classList.toggle('can-afford', bonsPoints.gte(coutImageActuel));
        document.getElementById('acheterImageButton').classList.toggle('cannot-afford', bonsPoints.lt(coutImageActuel));
    } else {
        document.getElementById('achatImageSection').style.display = 'none';
    }

    if (ProfesseurUnlocked) {
        document.getElementById('achatProfesseurSection').style.display = 'block';
        const coutProfesseurActuel = calculateNextProfessorCost(nombreProfesseur);
        document.getElementById('acheterProfesseurButton').innerHTML = `Professeur : <span class="images-color">${formatNumber(coutProfesseurActuel, 0)} I</span>`;
        document.getElementById('acheterProfesseurButton').classList.toggle('can-afford', images.gte(coutProfesseurActuel));
        document.getElementById('acheterProfesseurButton').classList.toggle('cannot-afford', images.lt(coutProfesseurActuel));
    } else {
        document.getElementById('achatProfesseurSection').style.display = 'none';
    }

    // Mise à jour du bouton de clic principal
    document.getElementById('studiesTitleButton').innerHTML = `Études (<span id="clickBonsPointsDisplay">+${formatNumber(skillEffects.clickBonsPointsBonus.add(1), bonsPoints.lt(1000) ? 1 : 0)} BP</span>)`; // Use skillEffects.clickBonsPointsBonus

    // Mise à jour des éléments de la section "Ascension"
    if (ascensionMenuButtonUnlocked) {
        document.getElementById('ascensionMenuPACount').textContent = formatNumber(ascensionPoints, 0);

        const coutEcoleActuel = calculateNextEcoleCost(schoolCount);
        document.getElementById('acheterEcoleButton').classList.toggle('can-afford', ascensionPoints.gte(coutEcoleActuel));
        document.getElementById('acheterEcoleButton').classList.toggle('cannot-afford', ascensionPoints.lt(coutEcoleActuel));
        document.getElementById('coutEcole').textContent = `${formatNumber(coutEcoleActuel, 0)} PA`;
        document.getElementById('nombreEcoles').textContent = formatNumber(schoolCount, 0);
        document.getElementById('ecoleMultiplier').textContent = `${formatNumber(ecoleMultiplier, 2)}x`;

        if (lyceesUnlocked) {
            document.getElementById('achatLyceeSection').style.display = 'block';
            const coutLyceeActuel = calculateNextLyceeCost(nombreLycees);
            document.getElementById('acheterLyceeButton').innerHTML = `Lycée : <span class="ascension-points-color">${formatNumber(coutLyceeActuel, 0)} PA</span>`;
            document.getElementById('acheterLyceeButton').classList.toggle('can-afford', ascensionPoints.gte(coutLyceeActuel));
            document.getElementById('acheterLyceeButton').classList.toggle('cannot-afford', ascensionPoints.lt(coutLyceeActuel));
            document.getElementById('nombreLyceesDisplay').textContent = formatNumber(nombreLycees, 0);
            document.getElementById('lyceeMultiplierDisplay').textContent = `${formatNumber(lyceeMultiplier, 2)}x`;
        } else {
            document.getElementById('achatLyceeSection').style.display = 'none';
        }

        if (collegesUnlocked) {
            document.getElementById('achatCollegeSection').style.display = 'block';
            const coutCollegeActuel = calculateNextCollegeCost(nombreColleges);
            document.getElementById('acheterCollegeButton').innerHTML = `Collège : <span class="ascension-points-color">${formatNumber(coutCollegeActuel, 0)} PA</span>`;
            document.getElementById('acheterCollegeButton').classList.toggle('can-afford', ascensionPoints.gte(coutCollegeActuel));
            document.getElementById('acheterCollegeButton').classList.toggle('cannot-afford', ascensionPoints.lt(coutCollegeActuel));
            document.getElementById('nombreCollegesDisplay').textContent = formatNumber(nombreColleges, 0);
            document.getElementById('collegeMultiplierDisplay').textContent = `${formatNumber(collegeMultiplier, 2)}x`;
        } else {
            document.getElementById('achatCollegeSection').style.display = 'none';
        }

        // Unlock buttons in Ascension Menu
        document.getElementById('unlockMultiPurchaseButton').style.display = multiPurchaseOptionUnlocked ? 'none' : 'block';
        if (!multiPurchaseOptionUnlocked) {
            document.getElementById('unlockMultiPurchaseButton').classList.toggle('can-afford', ascensionPoints.gte(10));
            document.getElementById('unlockMultiPurchaseButton').classList.toggle('cannot-afford', ascensionPoints.lt(10));
        }
        document.getElementById('unlockmaxPurchaseButton').style.display = maxPurchaseOptionUnlocked ? 'none' : 'block';
        if (!maxPurchaseOptionUnlocked) {
            document.getElementById('unlockmaxPurchaseButton').classList.toggle('can-afford', ascensionPoints.gte(100));
            document.getElementById('unlockmaxPurchaseButton').classList.toggle('cannot-afford', ascensionPoints.lt(100));
        }
        document.getElementById('unlockNewSettingsButton').style.display = newSettingsUnlocked ? 'none' : 'block';
        if (!newSettingsUnlocked) {
            document.getElementById('unlockNewSettingsButton').classList.toggle('can-afford', ascensionPoints.gte(10));
            document.getElementById('unlockNewSettingsButton').classList.toggle('cannot-afford', ascensionPoints.lt(10));
        }
        document.getElementById('unlockAutomationCategoryButton').style.display = automationCategoryUnlocked ? 'none' : 'block';
        if (!automationCategoryUnlocked) {
            document.getElementById('unlockAutomationCategoryButton').classList.toggle('can-afford', ascensionPoints.gte(calculateAutomationCost(1000)));
            document.getElementById('unlockAutomationCategoryButton').classList.toggle('cannot-afford', ascensionPoints.lt(calculateAutomationCost(1000)));
        }
    }

    // Mise à jour des éléments de la section "Prestige"
    if (prestigeUnlocked) {
        document.getElementById('prestigeMenuPPCount').textContent = formatNumber(prestigePoints, 0);

        const licenceData = prestigePurchasesData.find(p => p.id === 'licence');
        document.getElementById('acheterLicenceButton').innerHTML = `Licence : <span class="prestige-points-color">${formatNumber(licenceData.cost, 0)} PP</span>`;
        document.getElementById('acheterLicenceButton').classList.toggle('can-afford', prestigePoints.gte(licenceData.cost));
        document.getElementById('acheterLicenceButton').classList.toggle('cannot-afford', prestigePoints.lt(licenceData.cost));
        document.getElementById('nombreLicences').textContent = formatNumber(nombreLicences, 0);
        document.getElementById('licenceBoost').textContent = `${formatNumber(licenceData.getEffectValue().sub(1).mul(100), 2)}%`;

        const master1Data = prestigePurchasesData.find(p => p.id === 'master1');
        document.getElementById('acheterMaster1Button').innerHTML = `Master I : <span class="prestige-points-color">${formatNumber(master1Data.cost, 0)} PP</span>`;
        document.getElementById('acheterMaster1Button').classList.toggle('can-afford', prestigePoints.gte(master1Data.cost));
        document.getElementById('acheterMaster1Button').classList.toggle('cannot-afford', prestigePoints.lt(master1Data.cost));
        document.getElementById('nombreMaster1').textContent = formatNumber(nombreMaster1, 0);
        document.getElementById('master1Boost').textContent = `${formatNumber(master1Data.getEffectValue().sub(1).mul(100), 2)}%`;

        const master2Data = prestigePurchasesData.find(p => p.id === 'master2');
        document.getElementById('acheterMaster2Button').innerHTML = `Master II : <span class="prestige-points-color">${formatNumber(master2Data.cost, 0)} PP</span>`;
        document.getElementById('acheterMaster2Button').classList.toggle('can-afford', prestigePoints.gte(master2Data.cost));
        document.getElementById('acheterMaster2Button').classList.toggle('cannot-afford', prestigePoints.lt(master2Data.cost));
        document.getElementById('nombreMaster2').textContent = formatNumber(nombreMaster2, 0);
        document.getElementById('master2Boost').textContent = `${formatNumber(master2Data.getEffectValue().sub(1).mul(100), 2)}%`;

        const doctoratData = prestigePurchasesData.find(p => p.id === 'doctorat');
        document.getElementById('acheterDoctoratButton').innerHTML = `Doctorat : <span class="prestige-points-color">${formatNumber(doctoratData.cost, 0)} PP</span>`;
        document.getElementById('acheterDoctoratButton').classList.toggle('can-afford', prestigePoints.gte(doctoratData.cost) && doctoratData.prerequisites());
        document.getElementById('acheterDoctoratButton').classList.toggle('cannot-afford', prestigePoints.lt(doctoratData.cost) || !doctoratData.prerequisites());
        document.getElementById('nombreDoctorat').textContent = formatNumber(nombreDoctorat, 0);
        document.getElementById('doctoratBoost').textContent = `${formatNumber(doctoratData.getEffectValue().sub(1).mul(100), 2)}%`;
        document.getElementById('doctoratMinClasses').textContent = formatNumber(doctoratData.getMinClasses(), 0);

        const postDoctoratData = prestigePurchasesData.find(p => p.id === 'postDoctorat');
        document.getElementById('acheterPostDoctoratButton').innerHTML = `Post-Doctorat : <span class="prestige-points-color">${formatNumber(postDoctoratData.cost, 0)} PP</span>`;
        document.getElementById('acheterPostDoctoratButton').classList.toggle('can-afford', prestigePoints.gte(postDoctoratData.cost) && postDoctoratData.prerequisites());
        document.getElementById('acheterPostDoctoratButton').classList.toggle('cannot-afford', prestigePoints.lt(postDoctoratData.cost) || !postDoctoratData.prerequisites());
        document.getElementById('nombrePostDoctorat').textContent = formatNumber(nombrePostDoctorat, 0);
        document.getElementById('postDoctoratBoost').textContent = `${formatNumber(postDoctoratData.getEffectValue().sub(1).mul(100), 2)}%`;
    }

    // Mise à jour de l'affichage des ressources minimalistes
    document.getElementById('miniBonsPoints').textContent = formatNumber(bonsPoints, 0);
    document.getElementById('miniImages').textContent = formatNumber(images, 0);
    document.getElementById('miniProfesseur').textContent = formatNumber(nombreProfesseur, 0);
    document.getElementById('miniAscensionPoints').textContent = formatNumber(ascensionPoints, 0);
    document.getElementById('miniAscensionCount').textContent = formatNumber(ascensionCount, 0);
    document.getElementById('miniPrestigePoints').textContent = formatNumber(prestigePoints, 0);
    document.getElementById('miniPrestigeCount').textContent = formatNumber(prestigeCount, 0);

    // Appelle les fonctions de mise à jour des états des boutons
    updateMultiplierButtons();
    updateAutomationButtonStates();
    updateSettingsButtonStates();
}

/**
 * Affiche une notification pop-up à l'utilisateur.
 * @param {string} message Le message à afficher.
 * @param {string} [type='info'] Le type de notification ('info', 'success', 'warning', 'error').
 * @param {number} [duration=5000] La durée d'affichage en ms.
 */
export function showNotification(message, type = 'info', duration = 5000) {
    const notificationsContainer = document.getElementById('notifications-container');
    if (!notificationsContainer) {
        console.warn("Notifications container not found.");
        return;
    }
    const notification = document.createElement('div');
    notification.classList.add('notification-item');
    notification.classList.add(type); // Ajoute une classe pour le style spécifique au type
    notification.textContent = message;
    notificationsContainer.appendChild(notification);

    // Animation d'entrée
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 10); // Petit délai pour que la transition s'applique

    // Supprime la notification après un certain temps
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 500); // Attend la fin de l'animation de sortie avant de supprimer
    }, duration - 500);
}

/**
 * Contrôle la visibilité des différentes sections du jeu (onglets) et des ressources.
 */
export function updateSectionVisibility() {
    // Visibilité des boutons de navigation latérale
    document.getElementById('automationTabBtn').style.display = automationCategoryUnlocked ? 'block' : 'none';
    document.getElementById('skillsTabBtn').style.display = skillsButtonUnlocked ? 'block' : 'none';
    document.getElementById('settingsTabBtn').style.display = settingsButtonUnlocked ? 'block' : 'none';
    document.getElementById('ascensionTabBtn').style.display = ascensionMenuButtonUnlocked ? 'block' : 'none';
    document.getElementById('prestigeTabBtn').style.display = prestigeUnlocked ? 'block' : 'none';
    document.getElementById('questsTabBtn').style.display = questsUnlocked ? 'block' : 'none';
    document.getElementById('achievementsTabBtn').style.display = achievementsButtonUnlocked ? 'block' : 'none';

    // Visibilité des options d'achat multiples
    document.getElementById('purchaseMultiplierSelection').style.display = multiPurchaseOptionUnlocked ? 'flex' : 'none';
    document.getElementById('setMultiplierXmax').style.display = maxPurchaseOptionUnlocked ? 'inline-block' : 'none';

    // Visibilité des sections d'achat dans "Études"
    document.getElementById('achatEleveSection').style.display = elevesUnlocked ? 'block' : 'none';
    document.getElementById('achatClasseSection').style.display = classesUnlocked ? 'block' : 'none';
    document.getElementById('achatImageSection').style.display = imagesUnlocked ? 'block' : 'none';
    document.getElementById('achatProfesseurSection').style.display = ProfesseurUnlocked ? 'block' : 'none';

    // Visibilité des sections d'achat dans "Ascension"
    document.getElementById('achatLyceeSection').style.display = lyceesUnlocked ? 'block' : 'none';
    document.getElementById('achatCollegeSection').style.display = collegesUnlocked ? 'block' : 'none';

    // Basculement de l'affichage des ressources (normal vs. minimaliste)
    document.getElementById('mainResourcesDisplay').style.display = minimizeResourcesActive ? 'none' : 'flex';
    document.getElementById('minimalistResources').style.display = minimizeResourcesActive ? 'flex' : 'none';

    // Visibilité des options dans les paramètres
    document.getElementById('offlineProgressSetting').style.display = newSettingsUnlocked ? 'block' : 'none';
    document.getElementById('minimizeResourcesSetting').style.display = newSettingsUnlocked ? 'block' : 'none';
    document.getElementById('statsButtonSetting').style.display = statsButtonUnlocked ? 'block' : 'none';

    // Les conteneurs principaux (studiesMainContainer, automationMainContainer, etc.) sont gérés par openTab()
    // Les panneaux de compétences sont gérés par renderSkillsMenu()
}

/**
 * Met à jour l'état visuel des boutons de multiplicateur d'achat (x1, x10, x100, xMax).
 */
export function updateMultiplierButtons() {
    const multiplierButtons = document.querySelectorAll('#multiplierButtonsContainer .multiplier-button');
    multiplierButtons.forEach(button => {
        const multiplier = button.dataset.multiplier;
        if (multiplier == currentPurchaseMultiplier) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
}

/**
 * Met à jour l'état visuel des boutons d'automatisation (texte et classe 'automation-active').
 */
export function updateAutomationButtonStates() {
    const autoEleveBtn = document.getElementById('autoEleveBtn');
    const autoClasseBtn = document.getElementById('autoClasseBtn');
    const autoImageBtn = document.getElementById('autoImageBtn');
    const autoProfesseurBtn = document.getElementById('autoProfesseurBtn');

    if (autoEleveActive) {
        autoEleveBtn.textContent = "Désactiver Auto Élèves";
        autoEleveBtn.classList.add('automation-active');
    } else {
        autoEleveBtn.innerHTML = `Automatiser Élèves : <span class="ascension-points-color">${formatNumber(calculateAutomationCost(100), 0)} PA</span>`;
        autoEleveBtn.classList.remove('automation-active');
        autoEleveBtn.classList.toggle('can-afford', ascensionPoints.gte(calculateAutomationCost(100)));
        autoEleveBtn.classList.toggle('cannot-afford', ascensionPoints.lt(calculateAutomationCost(100)));
    }

    if (autoClasseActive) {
        autoClasseBtn.textContent = "Désactiver Auto Classes";
        autoClasseBtn.classList.add('automation-active');
    } else {
        autoClasseBtn.innerHTML = `Automatiser Classes : <span class="ascension-points-color">${formatNumber(calculateAutomationCost(500), 0)} PA</span>`;
        autoClasseBtn.classList.remove('automation-active');
        autoClasseBtn.classList.toggle('can-afford', ascensionPoints.gte(calculateAutomationCost(500)));
        autoClasseBtn.classList.toggle('cannot-afford', ascensionPoints.lt(calculateAutomationCost(500)));
    }

    if (autoImageActive) {
        autoImageBtn.textContent = "Désactiver Auto Images";
        autoImageBtn.classList.add('automation-active');
    } else {
        autoImageBtn.innerHTML = `Automatiser Images : <span class="ascension-points-color">${formatNumber(calculateAutomationCost(10000), 0)} PA</span>`;
        autoImageBtn.classList.remove('automation-active');
        autoImageBtn.classList.toggle('can-afford', ascensionPoints.gte(calculateAutomationCost(10000)));
        autoImageBtn.classList.toggle('cannot-afford', ascensionPoints.lt(calculateAutomationCost(10000)));
    }

    if (autoProfesseurActive) {
        autoProfesseurBtn.textContent = "Désactiver Auto Profs";
        autoProfesseurBtn.classList.add('automation-active');
    } else {
        autoProfesseurBtn.innerHTML = `Automatiser Professeur${nombreProfesseur.gt(1) ? 's' : ''} : <span class="ascension-points-color">${formatNumber(calculateAutomationCost(100000), 0)} PA</span>`;
        autoProfesseurBtn.classList.remove('automation-active');
        autoProfesseurBtn.classList.toggle('can-afford', ascensionPoints.gte(calculateAutomationCost(100000)));
        autoProfesseurBtn.classList.toggle('cannot-afford', ascensionPoints.lt(calculateAutomationCost(100000)));
    }
}

/**
 * Met à jour l'état visuel des boutons des paramètres (thème, réinitialisation, etc.).
 */
export function updateSettingsButtonStates() {
    const themeToggleButton = document.getElementById('themeToggleButton');
    const resetProgressionButton = document.getElementById('resetProgressionButton');
    const toggleMinimalistResourcesButton = document.getElementById('toggleMinimalistResources');

    if (themeOptionUnlocked) {
        themeToggleButton.textContent = isDayTheme ? "Thème Nuit" : "Thème Jour";
    } else {
        themeToggleButton.textContent = "Débloquer Thème (10 I)";
    }
    themeToggleButton.classList.toggle('can-afford', themeOptionUnlocked || images.gte(10));
    themeToggleButton.classList.toggle('cannot-afford', !themeOptionUnlocked && images.lt(10));

    resetProgressionButton.classList.toggle('can-afford', images.gte(10));
    resetProgressionButton.classList.toggle('cannot-afford', images.lt(10));

    toggleMinimalistResourcesButton.textContent = minimizeResourcesActive ? "Afficher les ressources complètes" : "Minimiser la section ressources";
}

/**
 * Orchestre le rendu complet de l'arbre de compétences, y compris la visibilité des panneaux.
 */
export function renderSkillsMenu() {
    const studiesPanel = document.getElementById('studiesPanel');
    const ascensionPanel = document.getElementById('ascensionPanel');
    const prestigePanel = document.getElementById('prestigePanel');

    // Contrôle la visibilité des panneaux de compétences
    studiesPanel.style.display = studiesSkillsUnlocked ? 'flex' : 'none';
    ascensionPanel.style.display = ascensionSkillsUnlocked ? 'flex' : 'none';
    prestigePanel.style.display = prestigeSkillsUnlocked ? 'flex' : 'none';

    // Met à jour les points de compétence disponibles
    document.getElementById('studiesSkillsPointsCount').textContent = formatNumber(studiesSkillPoints, 0);
    document.getElementById('ascensionSkillsPointsCount').textContent = formatNumber(ascensionSkillPoints, 0);
    document.getElementById('prestigeSkillsPointsCount').textContent = formatNumber(prestigeSkillPoints, 0);

    // Rend chaque panneau de compétences
    renderSkillPanel('studies', document.getElementById('studiesSkillsGrid'), studiesSkillLevels, studiesSkillPoints, studiesSkillsUnlocked);
    renderSkillPanel('ascension', document.getElementById('ascensionSkillsGrid'), ascensionSkillLevels, ascensionSkillPoints, ascensionSkillsUnlocked);
    renderSkillPanel('prestige', document.getElementById('prestigeSkillsGrid'), prestigeSkillLevels, prestigeSkillPoints, prestigeSkillsUnlocked);
}

/**
 * Rend un panneau de compétences spécifique (études, ascension ou prestige).
 * @param {string} panelType Le type de panneau ('studies', 'ascension', 'prestige').
 * @param {HTMLElement} gridElement L'élément DOM qui contient la grille des compétences.
 * @param {Object} skillLevels L'objet des niveaux de compétences actuels pour ce panneau.
 * @param {Decimal} skillPoints Les points de compétence disponibles pour ce panneau.
 * @param {boolean} isPanelUnlocked Indique si le panneau est déverrouillé.
 */
function renderSkillPanel(panelType, gridElement, skillLevels, skillPoints, isPanelUnlocked) {
    gridElement.innerHTML = ''; // Efface le contenu précédent
    if (!isPanelUnlocked) {
        return; // Ne rien rendre si le panneau n'est pas déverrouillé
    }

    const skillsInPanel = skillsData[panelType];
    const maxTier = Math.max(...skillsInPanel.map(s => s.tier));

    for (let tier = 1; tier <= maxTier; tier++) {
        const tierDiv = document.createElement('div');
        tierDiv.classList.add('skill-tier');
        tierDiv.innerHTML = `<h3>Étage ${tier}</h3>`;
        const skillBoxesWrapper = document.createElement('div');
        skillBoxesWrapper.classList.add('skill-boxes-wrapper');

        const skillsInThisTier = skillsInPanel.filter(s => s.tier === tier);
        let allPreviousTierMaxed = true;
        if (tier > 1) {
            const previousTierSkills = skillsInPanel.filter(s => s.tier === tier - 1);
            allPreviousTierMaxed = previousTierSkills.every(s => (skillLevels[s.id] || 0) >= s.maxLevel);
        }

        skillsInThisTier.forEach(skill => {
            const currentLevel = skillLevels[skill.id] || 0;
            const isMaxLevel = currentLevel >= skill.maxLevel;
            const canUnlockTier = allPreviousTierMaxed || tier === 1; // Le premier étage est toujours déverrouillable
            const isLocked = !canUnlockTier || skillPoints.lt(1) || isMaxLevel;

            const skillBox = document.createElement('div');
            skillBox.classList.add('skill-box');
            skillBox.classList.toggle('locked', isLocked);
            skillBox.classList.toggle('unlocked', !isLocked && !isMaxLevel);
            skillBox.classList.toggle('max-level', isMaxLevel);
            skillBox.dataset.skillId = skill.id;
            skillBox.dataset.panelType = panelType;

            if (skill.id === 'S5_2_Secret') {
                skillBox.classList.add('secret-skill');
            }

            skillBox.innerHTML = `
                <span class="skill-name">${skill.name}</span>
                <span class="skill-level">Niveau ${currentLevel}/${skill.maxLevel}</span>
                <div class="tooltip-text">
                    <strong>${skill.name}</strong><br>
                    ${skill.description}<br>
                    ${!isMaxLevel && skill.id !== 'S5_2_Secret' ? `<span class="skill-cost images-color">Coût: 1 point de compétence</span>` : ''}
                    ${isLocked && !canUnlockTier ? `<br><span style="color:red;">Débloquez l'étage précédent</span>` : ''}
                    ${isLocked && canUnlockTier && skillPoints.lt(1) && !isMaxLevel && skill.id !== 'S5_2_Secret' ? `<br><span style="color:red;">Pas assez de points</span>` : ''}
                    ${skill.id === 'S5_2_Secret' ? `<br>Clics: ${secretSkillClicks}/${skill.maxLevel}` : ''}
                </div>
            `;
            skillBoxesWrapper.appendChild(skillBox);
        });
        tierDiv.appendChild(skillBoxesWrapper);
        gridElement.appendChild(tierDiv);
    }
}

/**
 * Gère la logique de clic sur une compétence.
 * Cette fonction est appelée par un écouteur d'événements dans `events.js`.
 * @param {string} panelType Le type de panneau de compétences.
 * @param {string} skillId L'ID de la compétence cliquée.
 */
export function handleSkillClick(panelType, skillId) {
    // La logique d'achat et d'application des effets de compétence est dans skills.js.
    // Ce fichier UI.js ne fait que déclencher l'action.
    if (typeof buySkill === 'function') {
        buySkill(panelType, skillId);
    } else {
        console.error("buySkill function is not defined. Ensure skills.js is loaded.");
    }
}

/**
 * Rend la liste des quêtes actives et terminées.
 */
export function renderQuests() {
    if (!questsUnlocked) return; // Ne rien rendre si les quêtes ne sont pas déverrouillées

    const questsListDiv = document.getElementById('questsList');
    const completedQuestsListDiv = document.getElementById('completedQuestsList');
    questsListDiv.innerHTML = '';
    completedQuestsListDiv.innerHTML = '';

    // Convertir questsData en un tableau si ce n'est pas déjà le cas
    const questsArray = Array.isArray(questsData) ? questsData : Object.values(questsData);

    questsArray.forEach(quest => {
        const questDiv = document.createElement('div');
        questDiv.classList.add('achat-section', 'quest-item'); // Réutilise les styles existants

        let progressText = '';
        if (!quest.completed) {
            let currentVal = new Decimal(0);
            // Récupère la valeur actuelle du progrès en fonction du type de cible
            switch (quest.targetType) {
                case 'schoolCount': currentVal = schoolCount; break;
                case 'lyceeCount': currentVal = nombreLycees; break;
                case 'totalPAEarned': currentVal = totalPAEarned; break;
                case 'ascensionCount': currentVal = ascensionCount; break;
                case 'unlockedSkillsCount':
                    let totalUnlockedSkills = 0;
                    for (const pType in skillsData) {
                        for (const skill of skillsData[pType]) {
                            const levels = (pType === 'studies' ? studiesSkillLevels : (pType === 'ascension' ? ascensionSkillLevels : prestigeSkillLevels));
                            if ((levels[skill.id] || 0) > 0) {
                                totalUnlockedSkills++;
                            }
                        }
                    }
                    currentVal = new Decimal(totalUnlockedSkills);
                    break;
                case 'nombreEleves': currentVal = nombreEleves; break;
                case 'nombreClasses': currentVal = nombreClasses; break;
                case 'nombreProfesseur': currentVal = nombreProfesseur; break;
                case 'bonsPoints': currentVal = bonsPoints; break;
                case 'totalClicks': currentVal = totalClicks; break;
                case 'images': currentVal = images; break; // Added images as a target type
            }
            progressText = `<p>Progrès : <span class="info-color">${formatNumber(currentVal, 0)}/${formatNumber(quest.targetValue, 0)}</span></p>`;
        }

        questDiv.innerHTML = `
            <h4>${quest.name}</h4>
            <p>${quest.description}</p>
            ${progressText}
            ${quest.completed ? `<p class="info-color">Récompense : ${quest.rewardMessage || 'Terminée !'}</p>` : ''}
        `;

        if (quest.completed) {
            questDiv.classList.add('completed');
            completedQuestsListDiv.appendChild(questDiv);
        } else if (quest.unlocked) { // N'affiche que les quêtes déverrouillées et non terminées
            questsListDiv.appendChild(questDiv);
        }
    });
}

/**
 * Rend la grille des succès.
 */
export function renderAchievements() {
    if (!achievementsUnlocked) return; // Ne rien rendre si les succès ne sont pas déverrouillés

    const achievementsGrid = document.getElementById('achievementsGrid');
    achievementsGrid.innerHTML = ''; // Efface la grille pour le re-rendu

    achievementsData.forEach(ach => {
        const achDiv = document.createElement('div');
        achDiv.classList.add('achievement-item');
        achDiv.dataset.achId = ach.id; // Ajoute l'ID pour la délégation d'événements

        if (unlockedAchievements[ach.id]) {
            achDiv.classList.add('unlocked');
        }

        achDiv.innerHTML = `
            <h4>${ach.name}</h4>
            <p>${ach.description}</p>
            <span class="reward">Récompense : ${ach.rewardText}</span>
        `;
        achievementsGrid.appendChild(achDiv);
    });
}

let activeAchievementTooltip = null; // Pour gérer l'infobulle cliquée

/**
 * Affiche l'infobulle d'un succès.
 * @param {Event} event L'événement de la souris.
 * @param {Object} ach L'objet succès.
 */
export function showAchievementTooltip(event, ach) {
    // N'affiche que si aucune infobulle n'est actuellement cliquée et affichée
    if (activeAchievementTooltip && activeAchievementTooltip.classList.contains('clicked')) return;

    const achievementTooltip = document.getElementById('achievementTooltip');
    achievementTooltip.innerHTML = `
        <strong>${ach.name}</strong><br>
        ${ach.description}<br>
        <span class="reward">Récompense : ${ach.rewardText}</span>
    `;

    // Positionne l'infobulle près du curseur
    achievementTooltip.style.left = `${event.clientX + 10}px`;
    achievementTooltip.style.top = `${event.clientY + 10}px`;
    achievementTooltip.classList.add('visible');
    achievementTooltip.style.display = 'block';
}

/**
 * Masque l'infobulle d'un succès.
 */
export function hideAchievementTooltip() {
    const achievementTooltip = document.getElementById('achievementTooltip');
    // Ne masque que si elle n'est pas actuellement cliquée
    if (activeAchievementTooltip && activeAchievementTooltip.classList.contains('clicked')) return;

    achievementTooltip.classList.remove('visible');
    achievementTooltip.style.display = 'none';
}

/**
 * Bascule l'affichage de l'infobulle d'un succès (pour le clic).
 * @param {Event} event L'événement de clic.
 * @param {Object} ach L'objet succès.
 */
export function toggleAchievementTooltip(event, ach) {
    event.stopPropagation(); // Empêche le clic de se propager au document

    const achievementTooltip = document.getElementById('achievementTooltip');

    // Si une infobulle est déjà active et que c'est CELLE-CI, la masque
    if (activeAchievementTooltip && activeAchievementTooltip.dataset.achId === ach.id && achievementTooltip.classList.contains('clicked')) {
        hideAchievementTooltip();
        achievementTooltip.classList.remove('clicked');
        activeAchievementTooltip = null;
        return;
    }

    // Si une autre infobulle était cliquée, la masque d'abord
    if (activeAchievementTooltip && activeAchievementTooltip.classList.contains('clicked')) {
        activeAchievementTooltip.classList.remove('clicked', 'visible');
        activeAchievementTooltip.style.display = 'none';
        activeAchievementTooltip = null;
    }

    // Affiche la nouvelle infobulle et la marque comme cliquée
    achievementTooltip.innerHTML = `
        <strong>${ach.name}</strong><br>
        ${ach.description}<br>
        <span class="reward">Récompense : ${ach.rewardText}</span>
    `;
    achievementTooltip.dataset.achId = ach.id; // Stocke l'ID du succès sur l'infobulle
    achievementTooltip.style.left = `${event.clientX + 10}px`;
    achievementTooltip.style.top = `${event.clientY + 10}px`;
    achievementTooltip.classList.add('visible', 'clicked');
    achievementTooltip.style.display = 'block';
    activeAchievementTooltip = achievementTooltip;
}

/**
 * Ouvre une section principale du jeu et masque les autres.
 * Cette fonction est appelée par les écouteurs d'événements des boutons de navigation dans `events.js`.
 * @param {HTMLElement} tabContainer L'élément DOM du conteneur de la section à ouvrir.
 */
export function openTab(tabContainer) {
    // Masque tous les conteneurs de contenu principal
    const mainContentContainers = [
        document.getElementById('studiesMainContainer'),
        document.getElementById('automationMainContainer'),
        document.getElementById('skillsContainer'),
        document.getElementById('settingsContainer'),
        document.getElementById('ascensionMenuContainer'),
        document.getElementById('prestigeMenuContainer'),
        document.getElementById('questsContainer'),
        document.getElementById('achievementsContainer')
    ];
    mainContentContainers.forEach(tc => {
        if (tc) tc.style.display = 'none';
    });

    // Affiche le conteneur de l'onglet sélectionné
    if (tabContainer) tabContainer.style.display = 'flex';

    // Masque l'infobulle des succès lors du changement d'onglet
    hideAchievementTooltip();

    // Effectue une mise à jour de l'affichage spécifique à l'onglet si nécessaire
    if (tabContainer === document.getElementById('skillsContainer')) {
        renderSkillsMenu();
    } else if (tabContainer === document.getElementById('questsContainer')) {
        renderQuests();
    } else if (tabContainer === document.getElementById('achievementsContainer')) {
        renderAchievements();
    } else if (tabContainer === document.getElementById('settingsContainer')) {
        updateSettingsButtonStates();
    }
    // Appel global de updateDisplay pour s'assurer que tout est à jour
    updateDisplay();
}

/**
 * Ouvre la modale des statistiques et met à jour son contenu.
 */
export function openStatsModal() {
    updateStatsDisplay();
    document.getElementById('statsModal').style.display = 'flex';
}

/**
 * Ferme la modale des statistiques.
 */
export function closeStatsModal() {
    document.getElementById('statsModal').style.display = 'none';
}

/**
 * Met à jour les valeurs affichées dans la modale des statistiques.
 */
export function updateStatsDisplay() {
    // Production Globale
    document.getElementById('statsCurrentBPS').textContent = formatNumber(totalBonsPointsParSeconde, 2);
    document.getElementById('statsSkillBonus').textContent = formatNumber(skillEffects.totalBpsMultiplierBonus ? skillEffects.totalBpsMultiplierBonus.mul(100) : new Decimal(0), 2) + '%'; // Added check for totalBpsMultiplierBonus
    document.getElementById('statsAscensionBonus').textContent = formatNumber(ascensionBonus, 2) + 'x';
    document.getElementById('statsPrestigeBPSBonus').textContent = formatNumber(getPrestigeBonusMultiplier('bps', prestigeCount, prestigePoints), 2) + 'x';
    document.getElementById('statsAchievementBPSBonus').textContent = formatNumber(permanentBpsBonusFromAchievements.mul(100), 2) + '%';
    document.getElementById('statsAllBPSMultiplier').textContent = formatNumber(skillEffects.allBpsMultiplier, 2) + 'x';

    // Ressources et Multiplicateurs
    document.getElementById('statsBonsPoints').textContent = formatNumber(bonsPoints, 0);
    document.getElementById('statsImages').textContent = formatNumber(images, 0);
    document.getElementById('statsProfesseur').textContent = formatNumber(nombreProfesseur, 0);
    // document.getElementById('statsProfMultiplier').textContent = formatNumber(multiplicateurProfesseur, 2) + 'x'; // Commented out: 'multiplicateurProfesseur' is not defined. Use skillEffects.licenceProfMultiplier if applicable.
    document.getElementById('statsAscensionPoints').textContent = formatNumber(ascensionPoints, 0);
    document.getElementById('statsPrestigePoints').textContent = formatNumber(prestigePoints, 0);

    // Coûts et Réductions
    document.getElementById('statsEleveCostReduction').textContent = formatNumber(skillEffects.eleveCostReduction.mul(100), 2) + '%';
    document.getElementById('statsClasseCostReduction').textContent = formatNumber(skillEffects.classeCostReduction.mul(100), 2) + '%';
    document.getElementById('statsImageCostReduction').textContent = formatNumber(skillEffects.imageCostReduction.mul(100), 2) + '%';
    document.getElementById('statsProfesseurCostReduction').textContent = formatNumber(skillEffects.ProfesseurCostReduction.mul(100), 2) + '%';
    document.getElementById('statsEcoleCostReduction').textContent = formatNumber(skillEffects.ecoleCostReduction.mul(100), 2) + '%';
    document.getElementById('statsAutomationCostReduction').textContent = formatNumber(skillEffects.automationCostReduction.mul(100), 2) + '%';
    document.getElementById('statsAllCostReduction').textContent = formatNumber(skillEffects.allCostReduction.mul(100), 2) + '%';

    // Bonus Spécifiques
    document.getElementById('statsClickBPSBonus').textContent = formatNumber(skillEffects.clickBonsPointsBonus, 2);
    document.getElementById('statsPAGainMultiplier').textContent = formatNumber(paMultiplierFromQuests.add(skillEffects.paGainMultiplier).add(nombrePostDoctorat.mul(prestigePurchasesData.find(p => p.id === 'postDoctorat').effect.value)).sub(1).mul(100), 2) + '%'; // Simplified calculation assuming effect.value is a direct multiplier
    document.getElementById('statsAscensionBonusIncrease').textContent = formatNumber(skillEffects.ascensionBonusIncrease, 2) + 'x';
    document.getElementById('statsOfflineProductionIncrease').textContent = formatNumber(skillEffects.offlineProductionIncrease.mul(100), 2) + '%';
    document.getElementById('statsAllProductionMultiplier').textContent = formatNumber(skillEffects.allProductionMultiplier.mul(100), 2) + '%';

    // Progression
    document.getElementById('statsTotalClicks').textContent = formatNumber(totalClicks, 0);
    document.getElementById('statsAscensionCount').textContent = formatNumber(ascensionCount, 0);
    document.getElementById('statsTotalPAEarned').textContent = formatNumber(totalPAEarned, 0);
    document.getElementById('statsPrestigeCount').textContent = formatNumber(prestigeCount, 0);

    // Compétences
    document.getElementById('statsStudiesSkillPoints').textContent = formatNumber(studiesSkillPoints, 0);
    document.getElementById('statsAscensionSkillPoints').textContent = formatNumber(ascensionSkillPoints, 0);
    document.getElementById('statsPrestigeSkillPoints').textContent = formatNumber(prestigeSkillPoints, 0);
    document.getElementById('statsStudiesSkillsUnlockedCount').textContent = Object.keys(studiesSkillLevels).filter(id => (studiesSkillLevels[id] || 0) > 0).length;
    document.getElementById('statsAscensionSkillsUnlockedCount').textContent = Object.keys(ascensionSkillLevels).filter(id => (ascensionSkillLevels[id] || 0) > 0).length;
    document.getElementById('statsPrestigeSkillsUnlockedCount').textContent = Object.keys(prestigeSkillLevels).filter(id => (prestigeSkillLevels[id] || 0) > 0).length;

    // Bonus Prestige Spécifiques
    document.getElementById('statsLicenceBoost').textContent = formatNumber(prestigePurchasesData.find(p => p.id === 'licence').getEffectValue().sub(1).mul(100), 2) + '%';
    document.getElementById('statsMaster1Boost').textContent = formatNumber(prestigePurchasesData.find(p => p.id === 'master1').getEffectValue().sub(1).mul(100), 2) + '%';
    document.getElementById('statsMaster2Boost').textContent = formatNumber(prestigePurchasesData.find(p => p.id === 'master2').getEffectValue().sub(1).mul(100), 2) + '%';
    document.getElementById('statsDoctoratBPSBoost').textContent = formatNumber(prestigePurchasesData.find(p => p.id === 'doctorat').getEffectValue().sub(1).mul(100), 2) + '%';
    document.getElementById('statsDoctoratMinClasses').textContent = formatNumber(doctoratData.getMinClasses(), 0); // Use doctoratData.getMinClasses() directly
    document.getElementById('statsPostDoctoratBoost').textContent = formatNumber(prestigePurchasesData.find(p => p.id === 'postDoctorat').getEffectValue().sub(1).mul(100), 2) + '%';
}
