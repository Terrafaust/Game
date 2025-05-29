MonJeuIncremental/ 
├── index.html # Structure HTML de base 
├── style.css # Styles CSS 
├── break_infinity.min.js # Bibliothèque pour les grands nombres 
├── core.js # Fonctions principales, boucle de jeu 
├── data.js # Données du jeu (coûts, etc.) 
├── ui.js # Gestion de l'interface utilisateur 
├── events.js # Gestion des événements 
├── studies.js # Logique des études 
├── automation.js # Logique de l'automatisation 
├── skills.js # Logique des compétences 
├── ascension.js # Logique de l'ascension 
├── prestige.js # Logique du prestige 
├── settings.js # Paramètres du jeu 
├── quests.js # Logique des quêtes 
├── achievements.js # Logique des succès 
├── README.md # (Optionnel) Documentation du projet 
└── assets/ # (Optionnel) Dossier pour les images, sons, etc.




------------------ Fiche Mémo : index.html -----------------------------
Description : Ce fichier est le point d'entrée principal de l'application web.
Il définit la structure HTML globale du jeu, inclut les feuilles de style CSS,
les bibliothèques externes (comme break_infinity.min.js), et charge tous
les fichiers JavaScript modulaires qui contiennent la logique du jeu.
Il ne contient aucune logique JavaScript active, seulement les balises <script>
pour charger les autres fichiers.

Dépendances :
- style.css : Fournit les styles visuels pour l'interface du jeu.
- break_infinity.min.js : Bibliothèque JavaScript pour la gestion des grands nombres (doit être chargé en premier).
- core.js : Fonctions principales du jeu, gestion de l'état global, sauvegarde/chargement, et la boucle de jeu.
- data.js : Données statiques du jeu (coûts, multiplicateurs, définitions des compétences, quêtes, succès, etc.).
- ui.js : Gestion de l'interface utilisateur, mise à jour de l'affichage des ressources, états des boutons, visibilité des sections.
- studies.js : Logique spécifique aux achats et à la production liés aux études (Élèves, Classes, Images, Professeurs).
- automation.js : Logique de l'automatisation des achats.
- skills.js : Logique de l'arbre de compétences (achat, réinitialisation, application des effets).
- ascension.js : Logique du mécanisme d'ascension (calcul des PA, achats d'Ascension, réinitialisation douce).
- prestige.js : Logique du mécanisme de prestige (calcul des PP, achats de Prestige, réinitialisation super douce).
- settings.js : Logique des paramètres du jeu (thème, progression hors ligne, minimisation des ressources).
- quests.js : Logique du système de quêtes (définition, suivi de progression, récompenses).
- achievements.js : Logique du système de succès (définition, vérification des conditions, récompenses, infobulles).
- events.js : Gestion centralisée de tous les écouteurs d'événements DOM (clics sur les boutons, changements d'état, etc.).

Variables Clés : Aucune variable JavaScript clé globale n'est définie
ou gérée directement dans ce fichier. Il sert uniquement de conteneur
pour les éléments DOM et les inclusions de scripts.

Fonctions Clés : Aucune fonction JavaScript n'est définie ou exécutée
directement dans ce fichier, à l'exception du chargement des scripts externes.

Éléments DOM Clés :
- <div id="side-menu"> : Contient les boutons de navigation entre les différentes sections du jeu.
- <div id="main-content"> : Conteneur principal pour le contenu dynamique des différentes sections (études, automatisation, etc.).
- <div class="container"> : Affiche les ressources principales et le bouton de clic.
- <div id="studiesMainContainer"> : Section dédiée aux achats et à la production des études.
- <div id="automationMainContainer"> : Section pour les options d'automatisation.
- <div id="skillsContainer"> : Section pour l'arbre de compétences.
- <div id="ascensionMenuContainer"> : Section pour le mécanisme d'ascension.
- <div id="prestigeMenuContainer"> : Section pour le mécanisme de prestige.
- <div id="questsContainer"> : Section pour les quêtes.
- <div id="achievementsContainer"> : Section pour les succès.
- <div id="settingsContainer"> : Section pour les paramètres du jeu.
- <div id="notifications-container"> : Conteneur pour les notifications pop-up.
- <div id="minimalistResources"> : Affichage compact des ressources (optionnel).
- Modales (#confirmResetModal, #confirmAscensionModal, #confirmPrestigeModal, #statsModal) :
  Fenêtres pop-up pour les confirmations ou l'affichage de statistiques.

Événements Gérés : Ce fichier ne gère pas directement les événements.
Il fournit les éléments DOM auxquels les gestionnaires d'événements
(définis principalement dans events.js et d'autres modules) s'attachent.

Logique Générale : Le rôle principal de index.html est de structurer
l'interface utilisateur et d'orchestrer le chargement de tous les composants
JavaScript et CSS nécessaires au fonctionnement du jeu. Il sert de fondation
sur laquelle la logique du jeu est construite par les fichiers JavaScript modulaires.

Notes Spécifiques :
- L'ordre d'inclusion des scripts JavaScript est important en raison des dépendances
  entre les modules. `break_infinity.min.js` doit être chargé en premier car il expose une variable globale.
  Ensuite, les modules doivent être chargés dans un ordre qui respecte leurs dépendances (e.g., `core.js` avant `ui.js`, `data.js` avant tout module qui utilise ses données, etc.).
  Les modules `type="module"` gèrent leurs dépendances via les instructions `import`.
- Les styles `display: none;` sur certains conteneurs sont gérés dynamiquement par les fonctions
  JavaScript (principalement `updateSectionVisibility` dans `ui.js`) pour afficher ou masquer les sections du jeu.
-->




------------------  Fiche Mémo : core.js -----------------------------
// Description : Ce fichier est le cœur de la logique du jeu. Il gère l'état global du jeu,
// les ressources principales, les compteurs, les fonctions de production,
// la sauvegarde et le chargement de la progression, les réinitialisations (soft, super soft, hard),
// le système de notifications, et la boucle de jeu principale.
// Il centralise également l'application de tous les effets de compétences, de prestiges et de succès.

// Dépendances :
// - break_infinity.min.js : La bibliothèque `Decimal` est supposée être globalement disponible
//                           pour la gestion des grands nombres.
// - data.js : Contient les données statiques du jeu (coûts de base, productions de base, définitions des compétences, etc.).
// - ui.js : Pour les fonctions de mise à jour de l'interface utilisateur (e.g., updateDisplay, updateButtonStates,
//           updateSectionVisibility, updateAutomationButtonStates, updateSettingsButtonStates,
//           renderSkillsMenu, renderQuests, renderAchievements, openTab, closeStatsModal,
//           showAchievementTooltip, hideAchievementTooltip, toggleAchievementTooltip, updateStatsDisplay).
//           Bien que core.js ne les appelle pas toutes directement, il les utilise pour rafraîchir l'UI.
// - studies.js : Pour les fonctions de calcul de coût et de production spécifiques aux études
//                (e.g., calculateNextEleveCost, elevesBpsPerItem, classesBpsPerItem, imagesBpsPerItem,
//                ProfesseurBpsPerItem).
// - automation.js : Pour la fonction d'exécution de l'automatisation (e.g., runAutomation) et le calcul de coût.
// - skills.js : Pour la logique d'application des effets de compétences (e.g., skillEffects, studiesSkillLevels,
//               ascensionSkillLevels, prestigeSkillLevels).
// - ascension.js : Pour les fonctions liées à l'ascension (e.g., calculatePAGained, performAscension).
// - prestige.js : Pour les fonctions liées au prestige (e.g., calculatePPGained, performPrestige,
//                getPrestigeBonusMultiplier).
// - quests.js : Pour la gestion des quêtes (e.g., checkQuests, updateQuestProgress, questsData, completedQuests).
// - achievements.js : Pour la gestion des succès (e.g., checkAchievements, achievementsData, unlockedAchievements,
//                    permanentBpsBonusFromAchievements).

// Variables Globales (état du jeu) - Exportées pour être accessibles par d'autres modules



------------------------ Fiche Mémo : data.js ---------------------------------------
// Description : Ce fichier centralise toutes les données statiques et de configuration du jeu.
// Cela inclut les coûts de base des améliorations, les productions de base,
// les définitions complètes des compétences (études, ascension, prestige),
// les définitions des achats de prestige, les définitions des quêtes,
// et d'autres seuils ou valeurs constantes.
// Ce fichier n'effectue aucune logique de jeu ni de modification d'état,
// il fournit simplement les données brutes que d'autres modules (comme core.js, studies.js, skills.js)
// utiliseront pour leurs calculs et leur logique.

// Dépendances :
// - break_infinity.min.js : La bibliothèque `Decimal` est supposée être globalement disponible
//                           pour la gestion des grands nombres.
//                           Les valeurs numériques sont converties en objets Decimal ici.

// Variables Clés Définies et Exportées :
// - initialCosts : Coûts de base des éléments achetables.
// - baseProductions : Productions de base par élément.
// - skillsData : Définitions complètes de tous les arbres de compétences.
// - prestigePurchasesData : Définitions des améliorations de prestige.
// - questsData : Définitions de toutes les quêtes.
// - bonusPointThresholds : Seuils de Bons Points pour gagner des points de compétence d'études.
// - prime_PA : Valeur de base pour le calcul des Points d'Ascension.

// --- Coûts Initiaux de Base ---




------------------------------------  Fiche Mémo : ui.js -------------------------------------
// Assumes global variables from core.js, data.js, etc., are available in the global scope.
// Examples: bonsPoints, totalBonsPointsParSeconde, images, nombreProfesseur, etc.
// Assumes functions like calculateNextEleveCost, calculatePAGained, etc., are available.
// Assumes data structures like skillsData, questsData, achievementsData, prestigePurchasesData are available.
// Assumes skillEffects object is available and updated by applyAllSkillEffects.


// Description : Ce fichier est dédié à la gestion de l&#39;interface utilisateur du jeu.
// Il est responsable de la mise à jour de l&#39;affichage de toutes les ressources,
// des états des boutons, de la visibilité des sections, des notifications,
// et du rendu des menus dynamiques comme l&#39;arbre de compétences, les quêtes et les succès.
// Il ne contient aucune logique de jeu (calculs de production, achats, réinitialisations),
// mais interagit avec les données et les fonctions définies dans d&#39;autres modules.

// Dépendances :
// - core.js : Fournit les variables d'état du jeu (bonsPoints, images, nombreEleves, etc.),
//             les totaux de production (totalBonsPointsParSeconde), les fonctions
//             de calcul de production (elevesBpsPerItem, classesBpsPerItem),
//             et les variables de déverrouillage (elevesUnlocked, ascensionUnlocked, etc.).
// - data.js : Contient les données statiques du jeu, y compris les définitions
//             des compétences (skillsData), des quêtes (questsData), des succès (achievementsData),
//             et des achats de prestige (prestigePurchasesData).
// - studies.js : Fournit les fonctions de calcul de coût pour les études
//                (calculateNextEleveCost, calculateNextClasseCost, calculateNextImageCost,
//                calculateNextProfessorCost).
// - automation.js : Fournit la fonction de calcul de coût pour l'automatisation
//                   (calculateAutomationCost).
// - skills.js : Fournit la fonction `buySkill` pour gérer l'achat de compétences,
//               et l'objet `skillEffects` qui contient les bonus actifs des compétences.
// - ascension.js : Fournit les fonctions de calcul de coût pour l'ascension
//                  (calculateNextEcoleCost, calculateNextLyceeCost, calculateNextCollegeCost)
//                  ainsi que les variables liées à l'ascension (ascensionPoints, ascensionCount,
//                  totalPAEarned, ascensionBonus, ecoleMultiplier, lyceeMultiplier, collegeMultiplier).
// - prestige.js : Fournit les fonctions de calcul de coût pour le prestige
//                 (calculateLicenceCost, calculateMaster1Cost, calculateMaster2Cost,
//                 calculateDoctoratCost, calculatePostDoctoratCost) et les variables
//                 liées au prestige (prestigePoints, prestigeCount, multiplicateurProfesseur,
//                 paMultiplierFromQuests, getPrestigeBonusMultiplier).
// - settings.js : Fournit les variables liées aux paramètres (isDayTheme, themeOptionUnlocked,
//                 minimizeResourcesActive, statsButtonUnlocked).
// - quests.js : Gère la logique des quêtes et leur état.
// - achievements.js : Gère la logique des succès et leur état (unlockedAchievements,
//                     permanentBpsBonusFromAchievements).
// - events.js : Attache les écouteurs d'événements aux éléments DOM et appelle les
//               fonctions appropriées définies dans ui.js et d'autres modules.
// - break\_infinity.min.js : La bibliothèque `Decimal` est supposée être globalement disponible
//                           pour la gestion des grands nombres.

// Variables Clés (utilisées par ui.js, mais définies ailleurs) :
// - bonsPoints, images, nombreEleves, nombreClasses, nombreProfesseur : Ressources principales.
// - totalBonsPointsParSeconde, elevesBpsPerItem, classesBpsPerItem : Productions.
// - ascensionPoints, ascensionCount, totalPAEarned, ascensionBonus : Variables d'ascension.
// - prestigePoints, prestigeCount : Variables de prestige.
// - schoolCount, nombreLycees, nombreColleges, nombreLicences, nombreMaster1,
//   nombreMaster2, nombreDoctorat, nombrePostDoctorat : Quantités d'achats supérieurs.
// - totalClicks : Compteur de clics.
// - clickBonsPoints : Bonus de bons points par clic.
// - currentPurchaseMultiplier : Multiplicateur d'achat actuel (x1, x10, x100, max).
// - isDayTheme, minimizeResourcesActive : États des paramètres.
// - autoEleveActive, autoClasseActive, autoImageActive, autoProfesseurActive : États d'automatisation.
// - elevesUnlocked, classesUnlocked, imagesUnlocked, ProfesseurUnlocked,
//   ascensionUnlocked, prestigeUnlocked, skillsButtonUnlocked, settingsButtonUnlocked,
//   automationCategoryUnlocked, questsUnlocked, achievementsButtonUnlocked,
//   newSettingsUnlocked, multiPurchaseOptionUnlocked, maxPurchaseOptionUnlocked,
//   statsButtonUnlocked : Flags de déverrouillage des fonctionnalités/sections.
// - studiesSkillPoints, ascensionSkillPoints, prestigeSkillPoints : Points de compétence.
// - studiesSkillLevels, ascensionSkillLevels, prestigeSkillLevels : Niveaux des compétences débloquées.
// - secretSkillClicks : Compteur pour la compétence secrète.
// - unlockedAchievements : Objet des succès débloqués.
// - permanentBpsBonusFromAchievements : Bonus permanent des succès.
// - paMultiplierFromQuests : Multiplicateur de PA des quêtes.
// - skillEffects : Objet contenant les effets cumulés de toutes les compétences et succès.

// Fonctions Clés (appelées par ui.js, mais définies ailleurs) :
// - formatNumber(num, decimalPlaces, exponentThreshold) : Formate un nombre pour l'affichage.
// - calculateNextEleveCost(count), calculateNextClasseCost(count), etc. : Calculent les coûts des achats.
// - calculateAutomationCost(baseCost) : Calcule le coût des automatisations.
// - calculatePAGained() : Calcule les PA gagnés à l'ascension.
// - calculatePPGained(totalPA, totalAscensions) : Calcule les PP gagnés au prestige.
// - getPrestigeBonusMultiplier(type, currentPrestigeCount, currentPrestigePoints) : Calcule les multiplicateurs de prestige.
// - calculateTotalBPS(), calculateItemBPS() : Recalculent les productions.
// - buySkill(panelType, skillId) : Fonction pour acheter une compétence.
// - checkUnlockConditions() : Vérifie et applique les déverrouillages.
// - checkAchievements() : Vérifie et débloque les succès.

// Éléments DOM Clés (référencés par ID) :
// - \#bonsPoints, \#totalBpsInline, \#imagesCount, \#nombreProfesseur, etc. : Affichage des ressources.
// - \#acheterEleveButton, \#acheterClasseButton, etc. : Boutons d'achat.
// - \#studiesTabBtn, \#automationTabBtn, etc. : Boutons de navigation latérale.
// - \#studiesMainContainer, \#automationMainContainer, etc. : Conteneurs des sections principales.
// - \#notifications-container : Conteneur des notifications.
// - \#skillPanels, \#studiesSkillsGrid, \#ascensionSkillsGrid, \#prestigeSkillsGrid : Arbre de compétences.
// - \#questsList, \#completedQuestsList : Listes des quêtes.
// - \#achievementsGrid, \#achievementTooltip : Grille et infobulle des succès.
// - \#statsModal : Modale des statistiques.

// Logique Générale :
// Ce fichier est le "front-end" visuel du jeu. Il prend les données de l'état du jeu
// (gérées par `core.js` et d'autres modules de logique) et les traduit en éléments
// HTML visibles et interactifs. Il ne contient pas de logique de jeu (achats,
// calculs de production, réinitialisations, etc.), mais appelle les fonctions
// appropriées des autres modules si nécessaire pour obtenir les données à afficher.

// Notes Spécifiques :
// - Les IDs des éléments HTML sont supposés correspondre à ceux définis dans `index.html`.
// - La fonction `formatNumber` est incluse ici pour la commodité, mais pourrait être déplacée
//   dans un fichier `utils.js` si l'architecture le permet.
// - Ce fichier ne contient pas d'écouteurs d'événements directs (addEventListener).
//   Ces derniers sont gérés dans `events.js` qui appelle les fonctions de `ui.js`.




---------------------------- Fiche Mémo : events.js -----------------------------------
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


 --- ------------------ Fiche Mémo : studies.js -----------------------------
 * Description : Ce fichier encapsule toute la logique spécifique aux achats et à la production
 * liés aux études dans le jeu. Il gère les calculs de production de Bons Points
 * par les Élèves et les Classes, la logique d'achat pour les Élèves, Classes,
 * Images et Professeurs, ainsi que la gestion du clic principal "Étudier sagement".
 * Il interagit avec les données du jeu, l'état global et les fonctions d'interface
 * définies dans d'autres modules.
 *
 * Dépendances :
 * - core.js : Fournit l'accès aux variables d'état globales (bonsPoints, images, nombreEleves,
 * nombreClasses, nombreProfesseur, totalClicks, skillEffects, currentPurchaseMultiplier,
 * studiesSkillPoints, ascensionSkillPoints, nombreLicences, nombreMaster1, nombreMaster2,
 * nombreDoctorat, prestigeCount, prestigePoints, elevesUnlocked, classesUnlocked,
 * imagesUnlocked, ProfesseurUnlocked), aux fonctions de notification (showNotification),
 * de sauvegarde (saveGameState), de vérification de déverrouillage (checkUnlockConditions),
 * et de recalcul global (applyAllSkillEffects, calculateTotalBPS).
 * - data.js : Contient les fonctions de calcul des coûts d'achat (calculateNextEleveCost,
 * calculateNextClasseCost, calculateNextImageCost, calculateNextProfessorCost)
 * et les définitions des achats de prestige (prestigePurchasesData) nécessaires
 * pour les calculs de production (ex: Professeur, Doctorat, Master).
 * - ui.js : Pour les fonctions de mise à jour de l'interface utilisateur spécifiques aux études
 * (updateStudiesButtonStates, updateStudiesSectionVisibility) et le formatage des nombres (formatNumber).
 *
 * Variables Clés (utilisées par studies.js, mais définies et gérées ailleurs) :
 * - bonsPoints, images, nombreEleves, nombreClasses, nombreProfesseur : Ressources principales.
 * - totalClicks : Compteur de clics.
 * - skillEffects : Objet contenant les effets cumulés de toutes les compétences.
 * - currentPurchaseMultiplier : Multiplicateur d'achat actuel (x1, x10, x100, max).
 * - elevesUnlocked, classesUnlocked, imagesUnlocked, ProfesseurUnlocked : Flags de déverrouillage
 * des options d'achat d'études.
 * - totalBonsPointsParSeconde : Production totale de BP/s (calculée dans core.js).
 * - studiesSkillPoints, ascensionSkillPoints : Points de compétence (mis à jour lors de l'achat de Professeur).
 * - nombreLicences, nombreMaster1, nombreMaster2, nombreDoctorat, prestigeCount, prestigePoints :
 * Variables d'achats de prestige affectant la production d'études.
 *
 * Fonctions Clés Définies et Exportées :
 * - calculateStudiesBPS() : Calcule et retourne la production de Bons Points par seconde
 * générée spécifiquement par les élèves et les classes.
 * - handleStudyClick() : Gère la logique du clic sur le bouton "Étudier sagement",
 * incluant l'incrémentation des Bons Points et du compteur de clics.
 * - performStudyPurchase(itemType, quantityRequested, isAutomated) : Exécute la logique
 * d'achat pour les Élèves, Classes, Images et Professeurs, décrémente les ressources
 * et incrémente les quantités d'objets achetés.
 * - updateStudiesButtonStates() : Met à jour l'état (texte, classes can-afford/cannot-afford)
 * des boutons d'achat liés aux études.
 * - updateStudiesSectionVisibility() : Contrôle la visibilité des sections d'achat
 * spécifiques aux études.
 *
 * Éléments DOM Clés (référencés par ID, définis dans index.html et gérés via ui.js) :
 * Ce module n'accède pas directement aux éléments DOM via `document.getElementById`.
 * Il s'attend à ce que les fonctions d'UI qui le consomment (comme `updateStudiesButtonStates`)
 * reçoivent les références DOM nécessaires ou que les éléments soient globalement accessibles
 * (par exemple, si `ui.js` les expose globalement après les avoir récupérés).
 *
 * Logique Générale :
 * Ce module se concentre sur les interactions directes et les calculs de production
 * liés à la progression initiale du jeu. Il ne contient pas d'écouteurs d'événements
 * directs, mais expose des fonctions qui sont appelées par `events.js` en réponse
 * aux interactions de l'utilisateur.
 */




------------------ Fiche Mémo : automation.js -----------------------------
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





------------------ Fiche Mémo : skills.js -----------------------------
 * Description : Ce fichier gère toute la logique et les fonctionnalités liées aux compétences
 * (Skills) du jeu. Il permet l'achat de compétences dans différentes catégories (Études, Ascension, Prestige),
 * gère les points de compétence requis, applique les effets des compétences, et met à jour
 * l'interface utilisateur du menu des compétences.
 *
 * Dépendances :
 * - core.js : Fournit l'accès aux variables d'état globales (studiesSkillPoints, ascensionSkillPoints,
 * prestigeSkillPoints, skillEffects, purchasedSkills, showNotification, saveGameState,
 * updateDisplay, checkUnlockConditions, applyAllSkillEffects, totalClicks, nombreProfesseur,
 * prestigeCount).
 * - data.js : Contient les définitions des compétences (skillsData) incluant leurs coûts,
 * effets, et conditions de déverrouillage.
 * - ui.js : Pour les fonctions de formatage des nombres (formatNumber) et la mise à jour
 * de l'interface utilisateur spécifique aux compétences (updateSkillsUI, renderSkillsMenu).
 *
 * Variables Clés (utilisées par skills.js, mais définies et gérées ailleurs) :
 * - studiesSkillPoints, ascensionSkillPoints, prestigeSkillPoints : Monnaies utilisées pour acheter les compétences.
 * - skillEffects : Objet accumulant tous les bonus actifs des compétences achetées.
 * - purchasedSkills : Objet pour suivre les compétences déjà achetées.
 * - totalClicks, nombreProfesseur, prestigeCount : Utilisés pour vérifier les conditions de déverrouillage des compétences.
 *
 * Fonctions Clés Définies et Exportées :
 * - purchaseSkill(skillId, skillType) : Gère la logique d'achat d'une compétence,
 * vérifie les coûts, déduit les points, marque la compétence comme achetée et applique ses effets.
 * - updateSkillsUI(domElements) : Met à jour l'état (texte, classes CSS, visibilité)
 * des éléments de l'interface utilisateur du menu des compétences.
 * - renderSkillsMenu(domElements) : Construit ou met à jour dynamiquement la structure HTML
 * du menu des compétences en fonction des compétences débloquées et achetées.
 *
 * Éléments DOM Clés (référencés par ID, définis dans index.html et gérés via ui.js) :
 * Ce module n'accède pas directement aux éléments DOM via `document.getElementById`.
 * Il s'attend à ce que les fonctions d'UI qui le consomment (comme `updateSkillsUI` et `renderSkillsMenu`)
 * reçoivent les références DOM nécessaires ou que les éléments soient globalement accessibles
 * (par exemple, si `ui.js` les expose globalement après les avoir récupérés).
 *
 * Logique Générale :
 * Ce module est le centre de la progression par compétences. Il interagit avec les données
 * du jeu pour déterminer la disponibilité des compétences et avec l'état global pour
 * appliquer leurs bonus. Il est appelé par `events.js` pour les interactions utilisateur
 * et par la boucle de jeu principale pour les mises à jour visuelles.
 */



       ------------------ Fiche Mémo : ascension.js -----------------------------
 * Description : Ce fichier gère toute la logique et les fonctionnalités liées au mécanisme
 * d'Ascension dans le jeu. L'Ascension permet au joueur de réinitialiser une partie de sa progression
 * en échange de Points d'Ascension (PA), qui peuvent ensuite être utilisés pour débloquer
 * des bonus permanents ou des automatisations. Ce module calcule les PA gagnés,
 * déclenche la réinitialisation du jeu et met à jour les éléments d'interface utilisateur
 * liés à l'Ascension.
 *
 * Dépendances :
 * - core.js : Fournit l'accès aux variables d'état globales (bonsPointsTotal, ascensionCount,
 * ascensionPoints, totalPAEarned, showNotification, saveGameState, updateDisplay,
 * checkUnlockConditions, resetGameState, applyAllSkillEffects), et aux flags de déverrouillage
 * du menu d'Ascension.
 * - data.js : Contient les définitions des coûts et bonus liés à l'Ascension,
 * ainsi que les seuils pour gagner des PA.
 * - ui.js : Pour les fonctions de formatage des nombres (formatNumber) et la mise à jour
 * de l'interface utilisateur spécifique à l'Ascension (updateAscensionUI, updateAscensionButtonStates).
 *
 * Variables Clés (utilisées par ascension.js, mais définies et gérées ailleurs) :
 * - bonsPointsTotal : Total cumulé de Bons Points gagnés sur toutes les parties, utilisé pour calculer les PA.
 * - ascensionCount : Nombre de fois que le joueur a effectué une Ascension.
 * - ascensionPoints : Monnaie d'Ascension actuelle du joueur.
 * - totalPAEarned : Total cumulé de Points d'Ascension gagnés sur toutes les Ascensions.
 * - ascensionUnlocked : Flag booléen indiquant si le menu d'Ascension est débloqué.
 *
 * Fonctions Clés Définies et Exportées :
 * - calculatePotentialAscensionPoints() : Calcule le nombre de Points d'Ascension que le joueur
 * gagnerait s'il effectuait une Ascension maintenant, basé sur bonsPointsTotal.
 * - performAscension() : Exécute le processus d'Ascension, réinitialise le jeu,
 * ajoute les PA gagnés et déclenche les mises à jour nécessaires.
 * - updateAscensionUI(domElements) : Met à jour l'affichage des informations d'Ascension
 * dans l'interface utilisateur.
 * - updateAscensionButtonStates(domElements) : Met à jour l'état (texte, classes CSS)
 * du bouton d'Ascension en fonction de la possibilité d'ascender.
 *
 * Éléments DOM Clés (référencés par ID, définis dans index.html et gérés via ui.js) :
 * Ce module n'accède pas directement aux éléments DOM via `document.getElementById`.
 * Il s'attend à ce que les fonctions d'UI qui le consomment (comme `updateAscensionUI` et
 * `updateAscensionButtonStates`) reçoivent les références DOM nécessaires ou que les éléments
 * soient globalement accessibles (par exemple, si `ui.js` les expose globalement après les avoir récupérés).
 *
 * Logique Générale :
 * Ce module est le cœur de la progression "soft reset". Il assure que l'Ascension est
 * un processus clair et impactant, récompensant le joueur pour sa progression globale
 * et lui permettant de débloquer de nouvelles couches de jeu. Il est appelé par `events.js`
 * pour l'interaction utilisateur et par la boucle de jeu pour les mises à jour visuelles.
 */




 ------------------ Fiche Mémo : prestige.js -----------------------------
 * Description : Ce fichier gère toute la logique et les fonctionnalités liées au mécanisme
 * de Prestige dans le jeu. Le Prestige est la réinitialisation la plus profonde du jeu,
 * permettant de gagner des Points de Prestige (PP) en échange d'une réinitialisation
 * de la plupart des progrès, y compris les Points d'Ascension. Les PP peuvent être
 * utilisés pour acheter des améliorations permanentes et des bonus qui affectent
 * les couches de jeu précédentes.
 *
 * Dépendances :
 * - core.js : Fournit l'accès aux variables d'état globales (totalPAEarned, prestigeCount,
 * prestigePoints, nombreLicences, nombreMaster1, nombreMaster2, nombreDoctorat,
 * nombrePostDoctorat, showNotification, saveGameState, updateDisplay,
 * checkUnlockConditions, resetGameState, applyAllSkillEffects, prestigeUnlocked).
 * - data.js : Contient les définitions des seuils pour gagner des PP (PRESTIGE_POINT_THRESHOLD)
 * et les données des achats de prestige (prestigePurchasesData), incluant leurs coûts et effets.
 * - ui.js : Pour les fonctions de formatage des nombres (formatNumber) et la mise à jour
 * de l'interface utilisateur spécifique au Prestige (updatePrestigeUI, updatePrestigeButtonStates,
 * renderPrestigePurchases).
 *
 * Variables Clés (utilisées par prestige.js, mais définies et gérées ailleurs) :
 * - totalPAEarned : Total cumulé de Points d'Ascension gagnés, utilisé pour calculer les PP.
 * - prestigeCount : Nombre de fois que le joueur a effectué un Prestige.
 * - prestigePoints : Monnaie de Prestige actuelle du joueur.
 * - nombreLicences, nombreMaster1, nombreMaster2, nombreDoctorat, nombrePostDoctorat :
 * Compteurs des achats de prestige.
 * - prestigeUnlocked : Flag booléen indiquant si le menu de Prestige est débloqué.
 *
 * Fonctions Clés Définies et Exportées :
 * - calculatePotentialPrestigePoints() : Calcule le nombre de Points de Prestige que le joueur
 * gagnerait s'il effectuait un Prestige maintenant, basé sur totalPAEarned.
 * - performPrestige() : Exécute le processus de Prestige, réinitialise le jeu (plus profondément
 * que l'Ascension), ajoute les PP gagnés et déclenche les mises à jour nécessaires.
 * - performPrestigePurchase(purchaseId) : Gère la logique d'achat pour les améliorations de prestige,
 * vérifie les coûts, déduit les points et met à jour les compteurs d'achats.
 * - updatePrestigeUI(domElements) : Met à jour l'affichage des informations de Prestige
 * dans l'interface utilisateur.
 * - updatePrestigeButtonStates(domElements) : Met à jour l'état (texte, classes CSS)
 * du bouton de Prestige en fonction de la possibilité de prestiger.
 * - renderPrestigePurchases(domElements) : Construit ou met à jour dynamiquement la structure HTML
 * des achats de prestige dans le menu.
 *
 * Éléments DOM Clés (référencés par ID, définis dans index.html et gérés via ui.js) :
 * Ce module n'accède pas directement aux éléments DOM via `document.getElementById`.
 * Il s'attend à ce que les fonctions d'UI qui le consomment (comme `updatePrestigeUI`,
 * `updatePrestigeButtonStates`, et `renderPrestigePurchases`) reçoivent les références DOM nécessaires
 * ou que les éléments soient globalement accessibles (par exemple, si `ui.js` les expose globalement
 * après les avoir récupérés).
 *
 * Logique Générale :
 * Ce module est la couche de progression la plus élevée. Il assure que le Prestige est
 * un jalon significatif, offrant des récompenses permanentes qui facilitent la progression
 * dans les boucles de jeu précédentes. Il est appelé par `events.js` pour l'interaction
 * utilisateur et par la boucle de jeu pour les mises à jour visuelles.
 */




 ----------------  Fiche Mémo : settings.js -----------------------------
// Description : Ce fichier gère la logique des différentes options de paramètres du jeu.
// Il est responsable de la modification de l'état du jeu concernant le thème,
// la progression hors ligne, l'affichage minimaliste des ressources, et l'ouverture
// de la modale des statistiques.
// Les écouteurs d'événements pour ces actions sont définis dans events.js,
// qui appellera les fonctions exportées de ce module.

// Dépendances :
// - core.js : Pour accéder et modifier les variables d'état du jeu (isDayTheme,
//             offlineProgressEnabled, minimizeResourcesActive, themeOptionUnlocked,
//             images), pour appeler showNotification, saveGameState, updateDisplay,
//             updateSectionVisibility, updateSettingsButtonStates.
// - ui.js : Pour appeler openStatsModal et closeStatsModal (bien que closeStatsModal
//          soit gérée par l'événement de clic sur la modale elle-même dans events.js).

// Fonctions Clés Définies et Exportées :
// - toggleTheme() : Bascule entre le thème jour et nuit, gère le déverrouillage de l'option.
// - toggleOfflineProgress(isChecked) : Active ou désactive la progression hors ligne.
// - toggleMinimizeResources() : Active ou désactive l'affichage minimaliste des ressources.
// - openStats() : Ouvre la modale des statistiques.

// --- Imports des modules nécessaires ---






* ------------------ Fiche Mémo : quests.js -----------------------------
 * Description : Ce fichier gère toute la logique et les fonctionnalités liées aux quêtes
 * (Quests) du jeu. Il permet de définir les quêtes, de vérifier leurs conditions de complétion,
 * de distribuer les récompenses une fois les quêtes terminées, et de mettre à jour
 * l'interface utilisateur du journal des quêtes.
 *
 * Dépendances :
 * - core.js : Fournit l'accès aux variables d'état globales (bonsPoints, images, nombreEleves,
 * nombreClasses, nombreProfesseur, totalClicks, totalPAEarned, prestigeCount,
 * showNotification, saveGameState, updateDisplay, applyAllSkillEffects),
 * ainsi que l'objet `completedQuests` pour suivre les quêtes terminées.
 * - data.js : Contient les définitions des quêtes (questsData) incluant leurs conditions
 * de complétion et leurs récompenses.
 * - ui.js : Pour les fonctions de formatage des nombres (formatNumber) et la mise à jour
 * de l'interface utilisateur spécifique aux quêtes (updateQuestsUI, renderQuests).
 *
 * Variables Clés (utilisées par quests.js, mais définies et gérées ailleurs) :
 * - bonsPoints, images, nombreEleves, nombreClasses, nombreProfesseur, totalClicks,
 * totalPAEarned, prestigeCount : Variables d'état du jeu utilisées pour vérifier les conditions des quêtes.
 * - completedQuests : Objet pour suivre les quêtes déjà complétées par leur ID.
 *
 * Fonctions Clés Définies et Exportées :
 * - checkQuests() : Vérifie les conditions de toutes les quêtes non complétées et
 * marque celles qui sont terminées comme "complétées" ou "réclamables".
 * - claimQuestReward(questId) : Gère la logique de réclamation d'une récompense de quête,
 * ajoute les récompenses au joueur et marque la quête comme réclamée.
 * - updateQuestsUI(domElements) : Met à jour l'affichage des informations générales des quêtes
 * dans l'interface utilisateur.
 * - renderQuests(domElements) : Construit ou met à jour dynamiquement la structure HTML
 * du journal des quêtes en fonction de leur état (non commencée, en cours, complétée, réclamée).
 *
 * Éléments DOM Clés (référencés par ID, définis dans index.html et gérés via ui.js) :
 * Ce module n'accède pas directement aux éléments DOM via `document.getElementById`.
 * Il s'attend à ce que les fonctions d'UI qui le consomment (comme `updateQuestsUI` et `renderQuests`)
 * reçoivent les références DOM nécessaires ou que les éléments soient globalement accessibles
 * (par exemple, si `ui.js` les expose globalement après les avoir récupérés).
 *
 * Logique Générale :
 * Ce module est essentiel pour guider la progression du joueur et offrir des objectifs
 * à court et moyen terme. Il interagit avec les données du jeu pour déterminer la
 * complétion des quêtes et avec l'état global pour appliquer les récompenses.
 * Il est appelé par la boucle de jeu principale (`core.js`) pour la vérification périodique
 * et par `events.js` pour les interactions utilisateur (réclamation de récompenses).
 */






----------------------- Fiche Mémo : achievements.js ----------------------------
// Description : Ce fichier gère toute la logique liée aux succès du jeu, y compris leur définition,
// la vérification des conditions de déverrouillage, l'application des récompenses,
// le rendu de l'interface des succès et la gestion des infobulles.
// Il interagit avec l'état global du jeu pour déterminer l'état des succès.

// Dépendances :
// Ce fichier dépend de la disponibilité globale des variables et fonctions définies dans :
// - core.js : Pour les fonctions de base du jeu (e.g., showNotification, saveGameState,
//             updateDisplay, applyAllSkillEffects, checkUnlockConditions).
// - ui.js : Pour les fonctions d'affichage (e.g., formatNumber).
// - data.js : Pour les données statiques du jeu (e.g., skillsData, prestigePurchasesData).
//
// Variables Globales Accédées (définies dans d'autres modules, principalement core.js et ui.js) :
// - bonsPoints, images, nombreEleves, nombreClasses, nombreProfesseur, schoolCount,
//   nombreLycees, nombreColleges, ascensionCount, totalClicks, autoEleveActive,
//   autoClasseActive, autoImageActive, autoProfesseurActive, totalPAEarned,
//   nombreLicences, nombreMaster1, nombreMaster2, nombreDoctorat, nombrePostDoctorat,
//   prestigeCount, prestigePoints, skillEffects, studiesSkillLevels, ascensionSkillLevels,
//   prestigeSkillLevels.
//
// Variables Clés Définies et Exportées :
// - achievementsData : Tableau des définitions de tous les succès.
// - unlockedAchievements : Objet pour suivre les succès débloqués par leur ID.
// - permanentBpsBonusFromAchievements : Bonus permanent cumulé des succès sur la production de BP/s.
// - activeAchievementTooltip : Gère l'état de l'infobulle de succès actuellement affichée.
//
// Fonctions Clés Définies et Exportées :
// - renderAchievements() : Met à jour l'affichage de la grille des succès.
// - checkAchievements() : Vérifie les conditions de tous les succès et débloque ceux qui sont remplis.
// - showAchievementTooltip(event, ach) : Affiche l'infobulle d'un succès.
// - hideAchievementTooltip() : Cache l'infobulle d'un succès.
// - toggleAchievementTooltip(event, ach) : Bascule la visibilité de l'infobulle d'un succès.
//
// Éléments DOM Clés (référencés par ID, définis dans index.html et ui.js) :
// - #achievementsGrid : La grille où les succès sont affichés.
// - #achievementTooltip : L'élément HTML de l'infobulle.