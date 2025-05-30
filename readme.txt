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



---------------------------- Fiche Mémo : style.css --------------------------------

// Description : Ce fichier CSS est le cœur de la présentation visuelle du jeu.
// Il définit l'apparence de tous les éléments HTML, y compris la mise en page générale,
// les couleurs, la typographie, les transitions, et les styles spécifiques pour les
// différents composants de l'interface utilisateur (menus, boutons, modales, sections de jeu, etc.).
// Il inclut également des styles pour le thème jour/nuit et assure la réactivité de l'interface.

// Dépendances :
// - index.html : Ce fichier est chargé par index.html via la balise <link>.
// Il ne dépend pas directement de fichiers JavaScript pour son fonctionnement,
// mais ses règles CSS sont appliquées aux éléments DOM définis dans index.html
// et manipulés par les scripts JavaScript.

// Variables Clés :
// Le CSS ne contient pas de "variables" au sens de JavaScript, mais il utilise des sélecteurs
// (IDs et classes) pour cibler et styliser des éléments spécifiques.
// Les couleurs et autres propriétés sont définies directement dans les règles.

// Fonctions Clés :
// Le CSS n'a pas de "fonctions" au sens de la programmation.
// Son rôle est d'appliquer des règles de style déclaratives aux éléments HTML.

// Éléments DOM Clés (référencés par ID/Classe) :
// - body: Styles de base pour l'ensemble de la page (police, arrière-plan, couleur de texte, transitions pour le thème).
// - .main-game-wrapper: Conteneur principal pour la mise en page flexible du jeu.
// - #side-menu: Menu de navigation latéral.
// - .container: Conteneur principal pour l'affichage des ressources et le bouton de clic.
// - button: Styles généraux pour tous les boutons interactifs.
// - button.can-afford, button.cannot-afford: Styles conditionnels pour les boutons en fonction de l'accessibilité des achats.
// - button.automation-active: Style pour les boutons d'automatisation actifs.
// - .ressources, .resource-group, .production-inline: Styles pour l'affichage des ressources principales.
// - #notifications-container, .notification-item: Conteneur et styles des notifications pop-up.
// - .bons-points-color, .images-color, .eleves-color, .Professeur-color, .ascension-points-color, .prestige-points-color, .warning-color, .info-color: Classes pour les couleurs spécifiques aux ressources et messages.
// - #confirmResetModal, #confirmAscensionModal, #confirmSkillResetModal, #achievementDetailModal, #confirmPrestigeModal, #statsModal: Styles pour les modales (fenêtres pop-up).
// - .modal-content, .modal-buttons, .modal-checkbox: Styles des éléments internes des modales.
// - #skillsContainer, #settingsContainer, #ascensionMenuContainer, #automationMainContainer, #studiesMainContainer, #questsContainer, #achievementsContainer, #prestigeMenuContainer: Conteneurs des différentes sections du jeu.
// - .skill-panel, .skill-tier, .skill-boxes-wrapper, .skill-box, .skill-box.locked, .skill-box.unlocked, .skill-box.max-level, .skill-box.secret-skill: Styles pour l'arbre de compétences.
// - .skill-box .tooltip-text: Styles pour les infobulles des compétences.
// - #purchaseMultiplierSelection, .multiplier-button, .multiplier-button.active: Styles pour les boutons de sélection de multiplicateur d'achat.
// - #achievementsGrid, .achievement-item, .achievement-item.unlocked, .achievement-tooltip: Styles pour la grille des succès et leurs infobulles.
// - #page-footer: Pied de page du jeu.
// - .quest-item, .quest-item.completed: Styles pour les éléments de quête.
// - #minimalistResources: Panneau d'affichage minimaliste des ressources.
// - #statsModal .stats-category: Catégories de statistiques dans la modale des statistiques.
// - body.dark-theme: Sélecteur clé pour appliquer les styles du thème nuit à l'ensemble de l'application.

// Logique Générale :
// Ce fichier fournit la couche de présentation du jeu.
// Il utilise des sélecteurs CSS pour cibler des éléments HTML spécifiques et leur appliquer des styles visuels.
// Les styles sont conçus pour être cohérents et réactifs, s'adaptant à différentes tailles d'écran.
// Le thème nuit est géré par une classe dark-theme ajoutée dynamiquement au body via JavaScript,
// permettant une transition visuelle fluide.

// Notes Spécifiques :
// - Thème Nuit : La classe dark-theme est ajoutée ou retirée du body par le JavaScript
// (`settings.js` et `core.js`) pour basculer entre les thèmes.
// - Réactivité : L'utilisation de flexbox (display: flex, flex-wrap) et de pourcentages
// (width: 100%, flex: 1 1 calc(50% - 10px)) permet au jeu de s'adapter aux différentes tailles d'écran.
// - Animations/Transitions : Des transitions CSS sont utilisées pour des effets visuels doux,
// notamment pour les boutons (transition: background-color, transform, border-color) et les notifications
// (animation: fadeInOutSmooth).
// - Infobulles : Les infobulles pour les compétences et les succès sont stylisées pour apparaître
// au survol ou au clic, offrant des informations supplémentaires sans encombrer l'interface.





// ------------------ Fiche Mémo : core.js ----------------------------
//
// Description : Ce fichier est le cœur de la logique du jeu incrémental.
// Il gère l'état global du jeu, les variables principales (ressources, compteurs, déverrouillages),
// les fonctions essentielles de sauvegarde/chargement, les calculs de production,
// la gestion des achats, l'application des effets de compétences/bonus,
// et la boucle de jeu principale.
//
// Objectif : Centraliser l'état du jeu et les fonctions critiques pour assurer
// la cohérence des données et la bonne exécution de la logique.
//
// ------------------ Variables Globales (état du jeu) ------------------
//
// export let bonsPoints;                     // Monnaie principale du jeu.
// export let totalBonsPointsParSeconde;      // Production totale de Bons Points par seconde (BP/s).
// export let bonsPointsTotal;                // Total cumulé de Bons Points gagnés (pour les succès/stats).
// export let images;                         // Ressource "Images".
// export let nombreEleves;                   // Nombre d'unités "Élèves".
// export let nombreClasses;                  // Nombre d'unités "Classes".
// export let nombreProfesseur;               // Nombre d'unités "Professeur".
// export let schoolCount;                    // Nombre d'unités "Écoles".
// export let nombreLycees;                   // Nombre d'unités "Lycées".
// export let nombreColleges;                 // Nombre d'unités "Collèges".
// export let ascensionPoints;                // Monnaie d'Ascension (PA).
// export let ascensionCount;                 // Nombre d'Ascensions effectuées.
// export let totalPAEarned;                  // Total cumulé de PA gagnés (pour le prestige).
// export let ascensionBonus;                 // Multiplicateur de bonus d'Ascension.
// export let prestigePoints;                 // Monnaie de Prestige (PP).
// export let prestigeCount;                  // Nombre de Prestiges effectués.
// export let totalClicks;                    // Total des clics sur le bouton "Étudier".
// export let currentPurchaseMultiplier;      // Multiplicateur d'achat actuel (x1, x10, x100, max).
//
// ------------------ Variables de Déverrouillage des Fonctionnalités ------------------
//
// export let elevesUnlocked;                 // Vrai si les Élèves sont débloqués.
// export let classesUnlocked;                // Vrai si les Classes sont débloquées.
// export let imagesUnlocked;                 // Vrai si les Images sont débloquées.
// export let ProfesseurUnlocked;             // Vrai si les Professeurs sont débloqués.
// export let ascensionUnlocked;              // Vrai si l'Ascension est débloquée (peut être effectuée).
// export let prestigeUnlocked;               // Vrai si le Prestige est débloqué (peut être effectuée).
// export let skillsButtonUnlocked;           // Vrai si le bouton "Compétences" est débloqué.
// export let settingsButtonUnlocked;         // Vrai si le bouton "Paramètres" est débloqué.
// export let automationCategoryUnlocked;     // Vrai si la catégorie "Automatisation" est débloquée.
// export let questsUnlocked;                 // Vrai si les "Quêtes" sont débloquées.
// export let achievementsButtonUnlocked;     // Vrai si le bouton "Succès" est débloqué.
// export let newSettingsUnlocked;            // Vrai si de nouveaux paramètres sont débloqués.
// export let multiPurchaseOptionUnlocked;    // Vrai si les options d'achat multiple (x10, x100) sont débloquées.
// export let maxPurchaseOptionUnlocked;      // Vrai si l'option d'achat "max" est débloquée.
// export let statsButtonUnlocked;            // Vrai si le bouton "Statistiques" est débloqué.
// export let prestigeMenuButtonUnlocked;     // Vrai si le bouton de menu "Prestige" est débloqué.
// export let ascensionMenuButtonUnlocked;    // Vrai si le bouton de menu "Ascension" est débloqué.
//
// ------------------ Variables d'Automatisation ------------------
//
// export let autoEleveActive;                // Vrai si l'automatisation des Élèves est active.
// export let autoClasseActive;               // Vrai si l'automatisation des Classes est active.
// export let autoImageActive;                // Vrai si l'automatisation des Images est active.
// export let autoProfesseurActive;           // Vrai si l'automatisation des Professeurs est active.
//
// ------------------ Variables de Compétences ------------------
//
// export let studiesSkillPoints;             // Points de compétence d'Études.
// export let ascensionSkillPoints;           // Points de compétence d'Ascension.
// export let prestigeSkillPoints;            // Points de compétence de Prestige.
// export let studiesSkillLevels;             // Objet { skillId: level, ... } pour les niveaux de compétences d'études.
// export let ascensionSkillLevels;           // Objet { skillId: level, ... } pour les niveaux de compétences d'ascension.
// export let prestigeSkillLevels;            // Objet { skillId: level, ... } pour les niveaux de compétences de prestige.
// export let secretSkillClicks;              // Compteur pour la compétence secrète (clics).
//
// ------------------ Variables de Paramètres ------------------
//
// export let isDayTheme;                     // Vrai si le thème actuel est le thème de jour.
// export let themeOptionUnlocked;            // Vrai si l'option de changement de thème est débloquée.
// export let offlineProgressEnabled;         // Vrai si le progrès hors ligne est activé.
// export let minimizeResourcesActive;        // Vrai si l'affichage des ressources est minimisé.
// export let disableAscensionWarning;        // Vrai pour désactiver l'avertissement de première ascension.
// export let firstAscensionPerformed;        // Vrai si la première ascension a été effectuée.
// export let disablePrestigeWarning;         // Vrai pour désactiver l'avertissement de prestige.
//
// ------------------ Variables de Prestige (quantités d'achats de prestige) ------------------
//
// export let nombreLicences;                 // Nombre de Licences achetées.
// export let nombreMaster1;                  // Nombre de Master 1 achetés.
// export let nombreMaster2;                  // Nombre de Master 2 achetés.
// export let nombreDoctorat;                 // Nombre de Doctorats achetés.
// export let nombrePostDoctorat;             // Nombre de Post-Doctorats achetés.
//
// ------------------ Objets de Bonus Cumulés (skillEffects) ------------------
// Cet objet agrège tous les multiplicateurs et réductions de coût provenant
// des compétences, succès et achats de prestige. Il est mis à jour par `applyAllSkillEffects`.
//
// export let skillEffects = {
//     clickBonsPointsBonus: new Decimal(0),       // Bonus additif aux BP gagnés par clic.
//     eleveBpsMultiplier: new Decimal(1),         // Multiplicateur de production des Élèves.
//     classeBpsMultiplier: new Decimal(1),        // Multiplicateur de production des Classes.
//     imageBpsMultiplier: new Decimal(1),         // Multiplicateur de production des Images.
//     ProfesseurBpsMultiplier: new Decimal(1),    // Multiplicateur de production des Professeurs.
//     eleveCostReduction: new Decimal(0),         // Pourcentage de réduction du coût des Élèves (0 à 1).
//     classeCostReduction: new Decimal(0),        // Pourcentage de réduction du coût des Classes.
//     imageCostReduction: new Decimal(0),         // Pourcentage de réduction du coût des Images.
//     ProfesseurCostReduction: new Decimal(0),    // Pourcentage de réduction du coût des Professeurs.
//     ecoleCostReduction: new Decimal(0),         // Pourcentage de réduction du coût des Écoles.
//     automationCostReduction: new Decimal(0),    // Pourcentage de réduction du coût d'automatisation.
//     allCostReduction: new Decimal(0),           // Réduction de coût globale.
//     allBpsMultiplier: new Decimal(1),           // Multiplicateur de production globale de BP/s.
//     paGainMultiplier: new Decimal(1),           // Multiplicateur de gain de Points d'Ascension.
//     ascensionBonusIncrease: new Decimal(0),     // Augmentation additive du bonus d'Ascension.
//     offlineProductionIncrease: new Decimal(0),  // Augmentation du progrès hors ligne.
//     allProductionMultiplier: new Decimal(1),    // Multiplicateur de production de toutes les structures.
//     licenceProfMultiplier: new Decimal(0),      // Pourcentage de boost du multiplicateur Professeur par Licence.
//     master1ClassProduction: new Decimal(0),     // Pourcentage de boost de la production des Classes par Master I.
//     master2ClassProduction: new Decimal(0),     // Pourcentage de boost de la production des Classes par Master II.
//     doctoratBPSBonus: new Decimal(0),           // Pourcentage de boost BP/s du Doctorat.
//     doctoratMinClasses: 0,                      // Nombre minimum de classes après Ascension par Doctorat.
//     postDoctoratPAGain: new Decimal(0),         // Pourcentage de boost de gain de PA par Ascension par Post-Doctorat.
// };
//
// ------------------ Variables pour les Coûts Actuels ------------------
// Ces variables stockent les coûts actuels des achats pour l'affichage dans ui.js.
//
// export let coutEleveActuel;                // Coût actuel d'un Élève.
// export let coutClasseActuel;               // Coût actuel d'une Classe.
// export let coutImageActuel;                // Coût actuel d'une Image.
// export let coutProfesseurActuel;           // Coût actuel d'un Professeur.
// export let coutEcoleActuel;                // Coût actuel d'une École.
// export let coutLyceeActuel;                // Coût actuel d'un Lycée.
// export let coutCollegeActuel;              // Coût actuel d'un Collège.
// export let coutLicenceActuel;              // Coût actuel d'une Licence.
// export let coutMaster1Actuel;              // Coût actuel d'un Master 1.
// export let coutMaster2Actuel;              // Coût actuel d'un Master 2.
// export let coutDoctoratActuel;             // Coût actuel d'un Doctorat.
// export let coutPostDoctoratActuel;         // Coût actuel d'un Post-Doctorat.
//
// ------------------ Variables de Temps pour la Boucle de Jeu ------------------
//
// export const gameTickInterval = 50;        // Intervalle de mise à jour de la logique du jeu en ms.
// export const displayUpdateInterval = 100;  // Intervalle de mise à jour de l'affichage en ms.
// export const saveCheckInterval = 5000;     // Intervalle de sauvegarde en ms.
//
// export let lastUpdate = Date.now();        // Dernier timestamp de mise à jour pour le progrès hors ligne.
// export let lastDisplayUpdateTime = 0;      // Dernier timestamp de mise à jour de l'affichage.
// export let lastSaveCheckTime = 0;          // Dernier timestamp de vérification de sauvegarde.
//
// ------------------ Fonctions Utilitaires ------------------
//
// export function formatNumber(num, decimalPlaces = 2, exponentThreshold = 6)
//   // Formate un nombre (Decimal ou number) en notation scientifique ou standard
//   // (ex: 1.23K, 4.56M, 7.89e+9).
//   // - num: Le nombre à formater.
//   // - decimalPlaces: Nombre de décimales à afficher.
//   // - exponentThreshold: Seuil d'exposant pour passer en notation scientifique.
//
// export function performPurchase(itemType, quantityRequested, isAutomated = false)
//   // Gère l'achat d'un élément du jeu (Élève, Classe, Image, Professeur, École, Lycée, Collège,
//   // Licences, Masters, Doctorats, Post-Doctorats).
//   // Calcule le coût, déduit les ressources, incrémente le compteur d'éléments,
//   // met à jour les quêtes, applique les effets de compétences et sauvegarde le jeu.
//   // - itemType: Le type d'élément à acheter (chaîne de caractères).
//   // - quantityRequested: La quantité à acheter (Decimal, '1', '10', '100', 'max').
//   // - isAutomated: Vrai si l'achat est effectué par l'automatisation (désactive les notifications).
//
// ------------------ Fonctions de Sauvegarde et Chargement ------------------
//
// export function saveGameState()
//   // Sauvegarde l'état actuel de toutes les variables du jeu dans le localStorage.
//   // Convertit les objets Decimal en chaînes de caractères pour la sauvegarde.
//
// export function loadGameState()
//   // Charge l'état du jeu depuis le localStorage.
//   // Si aucune sauvegarde n'est trouvée, initialise le jeu à son état par défaut.
//   // Convertit les chaînes de caractères chargées en objets Decimal.
//   // Applique le thème, calcule le progrès hors ligne et affiche une notification.
//
// export function resetGameVariables()
//   // Réinitialise toutes les variables du jeu à leur état initial par défaut.
//   // Utilisée lors d'un nouveau jeu ou d'un hard reset.
//
// function resetSkillEffects()
//   // Réinitialise l'objet `skillEffects` à ses valeurs par défaut.
//   // Appelée avant d'appliquer les effets des compétences/bonus pour éviter les cumuls incorrects.
//
// export function hardResetGame()
//   // Effectue une réinitialisation complète du jeu (hard reset).
//   // Supprime la sauvegarde du localStorage et réinitialise toutes les variables.
//
// export function softResetGame()
//   // Effectue une réinitialisation douce du jeu (soft reset), utilisée après une Ascension.
//   // Réinitialise certaines variables (BP, images, élèves, classes, professeurs, clics, compétences d'études)
//   // tout en conservant les déverrouillages majeurs et les progrès d'Ascension/Prestige.
//
// export function superSoftResetGame()
//   // Effectue une réinitialisation super douce du jeu (super soft reset), utilisée après un Prestige.
//   // Réinitialise la plupart des variables comme un soft reset, mais conserve les points de prestige
//   // et les achats de prestige, et réinitialise les compétences d'Ascension.
//
// ------------------ Fonctions de Calcul et de Mise à Jour ------------------
//
// export function updateCosts()
//   // Met à jour les coûts actuels de tous les éléments achetables (Élèves, Classes, Écoles, etc.)
//   // en appelant les fonctions de calcul de coût respectives des autres modules.
//
// export function calculateTotalBPS()
//   // Calcule la production totale de Bons Points par seconde (BP/s).
//   // Prend en compte la production de base des unités et applique tous les multiplicateurs
//   // provenant des compétences, de l'Ascension, du Prestige et des Succès.
//
// export function checkUnlockConditions()
//   // Vérifie les conditions de déverrouillage de toutes les fonctionnalités du jeu
//   // (nouvelles unités, menus, options) et les débloque si les conditions sont remplies.
//   // Met à jour la visibilité des sections de l'interface utilisateur.
//
// export function applyAllSkillEffects()
//   // Applique tous les effets cumulés des compétences (études, ascension, prestige),
//   // des succès permanents et des bonus des achats de prestige.
//   // Réinitialise `skillEffects` puis le reconstruit avec les bonus actifs.
//
// export function updateCachedMultipliers()
//   // Met à jour les multiplicateurs mis en cache, en s'assurant que `calculateTotalBPS`
//   // est appelée pour refléter les derniers effets.
//
// export function calculateOfflineProgress()
//   // Calcule les Bons Points gagnés pendant que le joueur était hors ligne,
//   // en fonction du temps écoulé et de la production hors ligne.
//   // N'applique le progrès que si le temps écoulé dépasse un certain seuil.
//
// ------------------ Fonction d'Initialisation du Jeu ------------------
//
// export function initializeGame()
//   // Fonction principale d'initialisation du jeu, appelée au chargement de la page.
//   // Charge l'état du jeu, met à jour tous les éléments d'interface,
//   // vérifie les déverrouillages initiaux et démarre la boucle de jeu principale.
//   // La boucle de jeu met à jour la logique et l'affichage à intervalles réguliers.
//
// ------------------ Dépendances (Imports) ------------------
//
// Importations depuis './studies.js':
//   - calculateNextEleveCost, calculateNextClasseCost, calculateNextImageCost, calculateNextProfessorCost
//   - elevesBpsPerItem, classesBpsPerItem, imagesBpsPerItem, ProfesseurBpsPerItem
// Importations depuis './automation.js':
//   - calculateAutomationCost, runAutomation
// Importations depuis './data.js':
//   - skillsData, prime_PA, prestigePurchasesData
// Importations depuis './ascension.js':
//   - calculatePAGained, performAscension, calculateNextEcoleCost, calculateNextLyceeCost, calculateNextCollegeCost
// Importations depuis './prestige.js':
//   - calculatePPGained, performPrestige, getPrestigeBonusMultiplier, calculateLicenceCost, calculateMaster1Cost, calculateMaster2Cost, calculateDoctoratCost, calculatePostDoctoratCost
// Importations depuis './quests.js':
//   - checkQuests, updateQuestProgress, questsData, completedQuests, paMultiplierFromQuests
// Importations depuis './achievements.js':
//   - checkAchievements, achievementsData, unlockedAchievements, permanentBpsBonusFromAchievements
// Importations depuis './ui.js':
//   - updateDisplay, updateButtonStates, updateSectionVisibility, updateAutomationButtonStates,
//     updateSettingsButtonStates, renderSkillsMenu, renderQuests, renderAchievements,
//     openTab, closeStatsModal, updateStatsDisplay, showAchievementTooltip,
//     hideAchievementTooltip, toggleAchievementTooltip, showNotification
//
// Remarque: La bibliothèque break_infinity.min.js est supposée être chargée
// globalement avant ce script pour la gestion des grands nombres.
//
// ---------------------------------------------------------------------








// ------------------ Fiche Mémo : data.js -----------------------------
//
// Description : Ce fichier est le dépôt central de toutes les données statiques et de configuration du jeu.
// Il contient les valeurs de base pour les coûts des améliorations, les productions des unités,
// les définitions complètes des arbres de compétences (Études, Ascension, Prestige),
// les détails des achats de Prestige, les définitions des quêtes,
// et d'autres constantes ou seuils importants pour la progression du jeu.
//
// Objectif : Fournir une source unique et fiable pour toutes les données numériques et structurelles
// du jeu qui ne changent pas dynamiquement pendant une partie.
// Ce fichier ne contient aucune logique de jeu active (calculs, modifications d'état) ;
// il est purement déclaratif.
//
// ------------------ Dépendances ------------------
//
// // break_infinity.min.js : La bibliothèque Decimal est importée pour gérer les très grands nombres.
// //                         Toutes les valeurs numériques importantes sont converties en objets Decimal
// //                         dès leur définition ici pour assurer une précision illimitée.
//
// ------------------ Variables Clés Définies et Exportées ------------------
//
// // export const initialCosts : Objet JavaScript contenant les coûts de base initiaux pour chaque type d'achat.
// //   Chaque propriété de cet objet représente un type d'unité ou d'amélioration.
// //   La valeur associée est un objet Decimal représentant le coût de base de la première unité de ce type.
// //   Ces coûts servent de point de départ pour les calculs de prix dynamiques effectués dans les modules de logique
// //   tels que studies.js et ascension.js, où ils sont ajustés par des multiplicateurs et des réductions.
// //   Propriétés :
// //     - eleve (Decimal) : Coût de base pour acquérir un Élève.
// //     - classe (Decimal) : Coût de base pour acquérir une Classe.
// //     - image (Decimal) : Coût de base pour acquérir une Image.
// //     - Professeur (Decimal) : Coût de base pour acquérir un Professeur, exprimé en Images.
// //     - ecole (Decimal) : Coût de base pour acquérir une École, exprimé en Points d'Ascension (PA).
// //     - lycee (Decimal) : Coût de base pour acquérir un Lycée, exprimé en Points d'Ascension (PA).
// //     - college (Decimal) : Coût de base pour acquérir un Collège, exprimé en Points d'Ascension (PA).
// //     - licence (Decimal) : Coût de base pour acquérir une Licence, exprimé en Points de Prestige (PP).
// //     - master1 (Decimal) : Coût de base pour acquérir un Master I, exprimé en Points de Prestige (PP).
// //     - master2 (Decimal) : Coût de base pour acquérir un Master II, exprimé en Points de Prestige (PP).
// //     - doctorat (Decimal) : Coût de base pour acquérir un Doctorat, exprimé en Points de Prestige (PP).
// //     - postDoctorat (Decimal) : Coût de base pour acquérir un Post-Doctorat, exprimé en Points de Prestige (PP).
//
// // export const baseProductions : Objet JavaScript définissant la production de base de chaque unité.
// //   Ces valeurs représentent la quantité de Bons Points par seconde (BP/s) ou le multiplicateur
// //   de production de base fourni par une seule unité de chaque type.
// //   Ces productions de base sont ensuite augmentées par des multiplicateurs provenant des compétences,
// //   de l'Ascension et du Prestige dans le module core.js.
// //   Propriétés :
// //     - eleveBps (Decimal) : Production de BP/s générée par un Élève.
// //     - classeBps (Decimal) : Production de BP/s générée par une Classe.
// //     - imageBpsMultiplier (Decimal) : Multiplicateur appliqué à la production totale de BP/s par Image.
// //     - ProfesseurClassMultiplier (Decimal) : Multiplicateur appliqué à la production des Classes par Professeur.
//
// // export const skillsData : Objet complexe contenant les définitions structurées de tous les arbres de compétences du jeu.
// //   Il est organisé par catégories principales : 'studies' (Études), 'ascension' (Ascension), et 'prestige' (Prestige).
// //   Chaque catégorie est un tableau de compétences.
// //   Chaque compétence est un objet avec les propriétés suivantes :
// //     - id (string) : L'identifiant unique de la compétence, utilisé pour le suivi de son niveau et de ses prérequis.
// //     - name (string) : Le nom affiché de la compétence dans l'interface utilisateur.
// //     - description (string) : Une brève explication de l'effet de la compétence.
// //     - cost (number) : Le coût en points de compétence de la catégorie correspondante pour débloquer cette compétence.
// //     - maxLevel (number) : Le niveau maximal que cette compétence peut atteindre.
// //     - tier (number) : Le niveau ou la "rangée" de la compétence dans son arbre, influençant son positionnement visuel.
// //     - prerequisites (array of strings) : Une liste des id de compétences qui doivent être entièrement débloquées
// //                                         (atteindre leur maxLevel) avant que cette compétence ne puisse être achetée.
// //     - effect (function) : Une fonction de rappel qui est exécutée lorsque la compétence est achetée ou que son niveau change.
// //                           Elle prend deux arguments : level (le niveau actuel de la compétence) et skillEffects
// //                           (l'objet global des effets cumulés défini dans core.js).
// //                           Cette fonction modifie directement les propriétés de skillEffects pour appliquer les bonus de la compétence.
//
// // export const prestigePurchasesData : Tableau d'objets définissant toutes les améliorations permanentes
// //                                    qui peuvent être achetées avec la monnaie de Prestige (Points de Prestige - PP).
// //   Chaque achat de prestige est un objet avec les propriétés suivantes :
// //     - id (string) : L'identifiant unique de l'achat de prestige.
// //     - name (string) : Le nom affiché de l'amélioration de prestige.
// //     - baseCost (Decimal) : Le coût de base de la première unité de cette amélioration, exprimé en PP.
// //     - costMultiplier (Decimal) : Le multiplicateur appliqué au coût pour chaque achat successif de cette amélioration.
// //     - getEffectValue (function) : Une fonction qui calcule la valeur numérique de l'effet de l'amélioration
// //                                   en fonction de son level actuel. Utilisée pour l'affichage de l'effet.
// //     - effect (function) : Une fonction de rappel qui prend le niveau actuel de l'amélioration et l'objet skillEffects.
// //                           Elle modifie directement les propriétés de skillEffects pour appliquer le bonus permanent de l'amélioration.
// //     - getMinClasses (function, spécifique à 'doctorat') : Une fonction utilitaire pour le Doctorat,
// //                                                           calculant le nombre minimum de classes après Ascension
// //                                                           en fonction du niveau de Doctorat.
// //     - prerequisites (function) : Une fonction qui retourne true si les conditions préalables à l'achat
// //                                  de cette amélioration sont remplies, false sinon.
// //   Achats de prestige définis : 'licence', 'master1', 'master2', 'doctorat', 'postDoctorat'.
//
// // export const questsData : Tableau d'objets définissant toutes les quêtes disponibles dans le jeu.
// //   Chaque quête est un objectif que le joueur peut accomplir pour obtenir des récompenses.
// //   Chaque quête est un objet avec les propriétés suivantes :
// //     - id (string) : L'identifiant unique de la quête.
// //     - name (string) : Le nom affiché de la quête.
// //     - description (string) : Le texte décrivant l'objectif à atteindre pour compléter la quête.
// //     - condition (function) : Une fonction qui prend en arguments les variables d'état du jeu pertinentes
// //                              (ex: totalClicks, nombreEleves, ascensionCount, totalPAEarned, prestigeCount)
// //                              et retourne true si l'objectif de la quête est atteint.
// //     - reward (object) : Un objet décrivant la récompense de la quête. Il a les propriétés :
// //       - type (string) : Le type de récompense (ex: 'studiesSkillPoints', 'ascensionSkillPoints', 'prestigeSkillPoints', 'paMultiplier', 'ppMultiplier').
// //       - amount (Decimal) : La quantité de la récompense.
// //     - rewardText (string) : Une chaîne de caractères décrivant la récompense pour l'affichage dans l'interface.
// //     - current (number) : Un champ optionnel pour suivre la progression actuelle de la quête (non sauvegardé par défaut, géré par quests.js).
// //     - unlocked (boolean) : Un champ optionnel indiquant si la quête est débloquée ou visible (non sauvegardé par défaut, géré par quests.js).
// //     - permanent (boolean) : Un indicateur si la quête persiste à travers les réinitialisations (Ascension/Prestige) ou si elle est réinitialisée.
//
// // export const bonusPointThresholds : Tableau d'objets Decimal définissant les seuils de Bons Points (BP)
// //                                   que le joueur doit atteindre pour gagner des Points de Compétence d'Études supplémentaires.
// //                                   Chaque valeur dans le tableau représente un seuil successif, et le joueur gagne
// //                                   un point de compétence à chaque fois qu'un nouveau seuil est dépassé.
//
// // export const prime_PA : Constante Decimal représentant la valeur de base utilisée dans le calcul
// //                       des Points d'Ascension (PA) gagnés lors d'une Ascension.
// //                       Elle sert de multiplicateur ou de base pour la formule de gain de PA.
//
// // export const ASCENSION_POINT_THRESHOLD : Constante Decimal qui définit le seuil de Bons Points Total
// //                                        requis pour gagner 1 Point d'Ascension (PA) lors d'une Ascension.
// //                                        Cette valeur est fondamentale pour déterminer la quantité de PA
// //                                        obtenue par le joueur en fonction de sa progression cumulée.
//
// ------------------ Fonctions de Calcul de Coût (RETIREES DE CE FICHIER) ------------------
//
// // Note Importante : Les fonctions de calcul de coût telles que calculateNextImageCost et calculateAutomationCost
// //                  ont été retirées de data.js. Ce fichier est strictement destiné aux données statiques.
// //                  Les fonctions de calcul de coût doivent être définies dans les modules de logique
// //                  qui les utilisent (par exemple, studies.js pour calculateNextImageCost
// //                  et automation.js pour calculateAutomationCost).
// //                  Cela assure une meilleure séparation des préoccupations et une architecture plus propre.
//
// ---------------------------------------------------------------------







-------------------------- // Fiche Mémo : ui.js -----------------------
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





// ------------------ Fiche Mémo : studies.js ----------------------------
//
// Description : Ce fichier encapsule toute la logique spécifique aux achats et à la production
// liés aux études dans le jeu. Il gère les calculs de production de Bons Points
// par les Élèves et les Classes, la logique d'achat pour les Élèves, Classes,
// Images et Professeurs, ainsi que la gestion du clic principal "Étudier sagement".
// Il interagit avec les données du jeu, l'état global et les fonctions d'interface
// définies dans d'autres modules.
//
// Objectif : Centraliser les mécanismes de progression liés aux études, en assurant
// les calculs de production, la gestion des coûts, et l'interaction avec l'interface
// utilisateur et l'état global du jeu.
//
// ------------------ Dépendances (Imports) ------------------
//
// Importations des variables d'état et fonctions globales depuis core.js:
//   - bonsPoints: La monnaie principale du jeu.
//   - images: La ressource "Images" utilisée pour acheter des Professeurs.
//   - nombreEleves: Le nombre actuel d'Élèves possédés.
//   - nombreClasses: Le nombre actuel de Classes possédées.
//   - nombreProfesseur: Le nombre actuel de Professeurs possédés.
//   - totalBonsPointsParSeconde: La production totale de BP/s, utilisée pour le bonus de clic.
//   - totalClicks: Le compteur total des clics sur le bouton "Étudier".
//   - skillEffects: L'objet contenant tous les multiplicateurs et bonus des compétences.
//   - currentPurchaseMultiplier: Le multiplicateur d'achat sélectionné (x1, x10, x100, max).
//   - checkUnlockConditions: Fonction pour vérifier les conditions de déverrouillage.
//   - saveGameState: Fonction pour sauvegarder l'état du jeu.
//   - applyAllSkillEffects: Fonction pour réappliquer tous les effets de compétences et bonus.
//   - calculateTotalBPS: Fonction pour recalculer la production totale de BP/s.
//   - studiesSkillPoints: Points de compétence d'études.
//   - ascensionSkillPoints: Points de compétence d'ascension (mis à jour lors de l'achat de Professeur).
//   - nombreLicences, nombreMaster1, nombreMaster2, nombreDoctorat: Quantités des achats de prestige affectant la production d'études.
//   - prestigeCount, prestigePoints: Compteurs et monnaie de prestige affectant la production.
//   - elevesUnlocked, classesUnlocked, imagesUnlocked, ProfesseurUnlocked: Flags de déverrouillage des options d'achat d'études.
//   - formatNumber: Fonction utilitaire pour formater les nombres.
//
// Importations des données de prestige depuis data.js:
//   - prestigePurchasesData: Données des achats de prestige (pour les prérequis).
//
// Importations des fonctions d'UI depuis ui.js:
//   - updateDisplay: Fonction pour rafraîchir l'affichage global de l'interface.
//   - showNotification: Fonction pour afficher des notifications à l'utilisateur.
//
// ------------------ Variables Clés Définies et Exportées ------------------
//
// export let bonsPointsParSecondeEleves;    // Production de BP/s générée spécifiquement par les Élèves.
// export let bonsPointsParSecondeClasses;   // Production de BP/s générée spécifiquement par les Classes.
//
// ------------------ Fonctions Clés Définies et Exportées ------------------
//
// export function calculateNextEleveCost(count)
//   // Calcule le coût du prochain Élève.
//
// export function calculateNextClasseCost(count)
//   // Calcule le coût de la prochaine Classe.
//
// export function calculateNextImageCost(count)
//   // Calcule le coût de la prochaine Image.
//
// export function calculateNextProfessorCost(count)
//   // Calcule le coût du prochain Professeur.
//
// export function elevesBpsPerItem
//   // Valeur de base de BP/s par Élève.
//
// export function classesBpsPerItem
//   // Valeur de base de BP/s par Classe.
//
// export function calculateStudiesBPS()
//   // Calcule la production de Bons Points par seconde générée spécifiquement par les élèves et les classes.
//   // Prend en compte les multiplicateurs des Professeurs (Licences, compétences) et les boosts de classe
//   // (Master I, Master II, compétences).
//   // Les résultats sont stockés dans `bonsPointsParSecondeEleves` et `bonsPointsParSecondeClasses`.
//
// export function handleStudyClick()
//   // Gère la logique du clic sur le bouton "Étudier sagement".
//   // Incrémente le compteur de clics (`totalClicks`).
//   // Calcule un bonus de BP basé sur la production totale (`totalBonsPointsParSeconde`) et les `skillEffects`.
//   // Ajoute les BP gagnés à `bonsPoints`.
//   // Vérifie les déverrouillages, met à jour les états des boutons d'études et sauvegarde le jeu.
//
// export function performStudyPurchase(itemType, quantityRequested, isAutomated = false)
//   // Exécute la logique d'achat pour les Élèves, Classes, Images et Professeurs.
//   // - itemType: Le type d'objet à acheter ('eleve', 'classe', 'image', 'Professeur').
//   // - quantityRequested: La quantité à acheter (Decimal, nombre, ou 'max').
//   // - isAutomated: Booléen indiquant si l'achat est automatisé (affecte les notifications).
//   // Détermine la ressource nécessaire, calcule le coût total en fonction de la quantité demandée
//   // (y compris l'achat "max").
//   // Si l'achat est possible, déduit la ressource, incrémente le compteur d'objets,
//   // met à jour les points de compétence d'Ascension (pour les Professeurs),
//   // applique les effets de compétences, met à jour l'interface et sauvegarde le jeu.
//   // Affiche une notification si l'achat n'est pas automatisé.
//
// export function updateStudiesButtonStates(domElements)
//   // Met à jour l'état visuel (texte, classes CSS 'can-afford'/'cannot-afford')
//   // des boutons d'achat liés aux études (Élève, Classe, Image, Professeur).
//   // Met également à jour l'affichage du bonus de BP par clic.
//   // - domElements: Un objet contenant les références aux éléments DOM nécessaires
//   //   (ex: { acheterEleveButton, acheterClasseButton, ... }).
//
// export function updateStudiesSectionVisibility(domElements)
//   // Contrôle la visibilité des sections d'achat spécifiques aux études
//   // en fonction des flags de déverrouillage (`elevesUnlocked`, `classesUnlocked`, etc.).
//   // - domElements: Un objet contenant les références aux éléments DOM nécessaires
//   //   (ex: { achatEleveSection, achatClasseSection, ... }).
//
// ---------------------------------------------------------------------




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
 * autoClasseActive, autoImageActive, autoProfesseurActive), à la fonction d'achat générique (performPurchase),
 * et à la fonction de formatage des nombres (formatNumber).
 * - ui.js : Fournit les fonctions de notification (showNotification) et de mise à jour
 * de l'interface utilisateur spécifique à l'automatisation (updateAutomationButtonStates), aux fonctions de sauvegarde (saveGameState),
 * de mise à jour de l'affichage global (updateDisplay)
 *
 * Variables Clés (utilisées par automation.js, mais définies et gérées ailleurs) :
 * - ascensionPoints : Monnaie utilisée pour acheter les automatisations.
 * - autoEleveActive, autoClasseActive, autoImageActive, autoProfesseurActive : Flags booléens
 * indiquant si une automatisation spécifique est active.
 * - skillEffects : Objet contenant les effets cumulés des compétences, notamment les réductions de coût.
 *
 * Fonctions Clés Définies et Exportées :
 * - calculateAutomationCost(baseCost) : Calcule le coût d'une automatisation en tenant compte des réductions de coût.
 * - runAutomation() : Exécute les achats pour toutes les automatisations actives.
 * - toggleAutomation(itemType, baseCost) : Active ou désactive une automatisation spécifique,
 * gère le coût en Points d'Ascension et les notifications.
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



 /**
 * ascension.js
 *
 * ------------------ Fiche Mémo : ascension.js -----------------------------
 * Description : Ce fichier gère toute la logique et les fonctionnalités liées au mécanisme
 * d'Ascension dans le jeu. L'Ascension est un "soft reset" qui réinitialise une partie de la
 * progression du joueur (ressources, bâtiments, etc.) en échange de Points d'Ascension (PA).
 * L'Ascension se débloque après avoir acquis au moins 5 Professeurs. Le nombre de PA gagnés
 * dépend du total des Bons Points (BP) accumulés au cours de la partie actuelle. Le coût
 * de l'Ascension n'augmente pas.
 *
 * Dépendances :
 * - core.js : Fournit l'accès aux variables d'état globales (bonsPointsTotal, ascensionCount,
 * ascensionPoints, totalPAEarned, saveGameState,
 * checkUnlockConditions, softResetGame, applyAllSkillEffects, ascensionUnlocked, nombreProfesseur),
 * et la fonction de formatage des nombres (formatNumber).
 * - data.js : Contient les définitions des seuils pour gagner des PA (ASCENSION_POINT_THRESHOLD).
 * - ui.js : Fournit la fonction de notification (showNotification) et (updateDisplay) et est responsable
 * d'appeler les fonctions de mise à jour de l'interface utilisateur spécifiques à l'Ascension
 * (updateAscensionUI, updateAscensionButtonStates) en leur passant les éléments DOM.
 *
 * Variables Clés (utilisées par ascension.js, mais définies et gérées ailleurs) :
 * - bonsPointsTotal : Total cumulé de Bons Points gagnés sur la partie actuelle, utilisé pour calculer les PA.
 * - ascensionCount : Nombre de fois que le joueur a effectué une Ascension.
 * - ascensionPoints : Monnaie d'Ascension actuelle du joueur.
 * - totalPAEarned : Total cumulé de Points d'Ascension gagnés sur toutes les Ascensions.
 * - ascensionUnlocked : Flag booléen indiquant si le menu d'Ascension est débloqué.
 * - nombreProfesseur : Le nombre actuel de Professeurs possédés.
 *
 * Fonctions Clés Définies et Exportées :
 * - calculatePotentialAscensionPoints() : Calcule le nombre de Points d'Ascension que le joueur
 * gagnerait s'il effectuait une Ascension maintenant, basé sur bonsPointsTotal.
 * - performAscension() : Exécute le processus d'Ascension, réinitialise le jeu (sauf les PA et bonus),
 * ajoute les PA gagnés et déclenche les mises à jour nécessaires. L'Ascension nécessite au moins 5 Professeurs.
 * - updateAscensionUI(domElements) : Met à jour l'affichage des informations d'Ascension
 * dans l'interface utilisateur.
 * - updateAscensionButtonStates(domElements) : Met à jour l'état (texte, classes CSS)
 * du bouton d'Ascension en fonction de la possibilité d'ascender (au moins 5 Professeurs et PA potentiels > 0).
 *
 * Éléments DOM Clés (référencés par ID, définis dans index.html et gérés via ui.js) :
 * Ce module n'accède pas directement aux éléments DOM via `document.getElementById`.
 * Il s'attend à ce que les fonctions d'UI qui le consomment (comme `updateAscensionUI` et
 * `updateAscensionButtonStates`) reçoivent les références DOM nécessaires ou que les éléments
 * soient globalement accessibles (par exemple, si `ui.js` les expose globalement après les avoir récupérés).
 *
 * Logique Générale :
 * Ce module gère le mécanisme de "soft reset" via l'Ascension. Il calcule les récompenses en PA
 * en fonction de la progression, vérifie la condition du nombre de Professeurs, réinitialise l'état
 * du jeu et met à jour l'interface utilisateur pour refléter les changements.
 */



 * ------------------ Fiche Mémo : prestige.js -----------------------------
 * Description : Ce fichier gère toute la logique et les fonctionnalités liées au mécanisme
 * de Prestige dans le jeu. Le Prestige est la réinitialisation la plus profonde du jeu,
 * permettant de gagner des Points de Prestige (PP) en échange d'une réinitialisation
 * de la plupart des progrès, y compris les Points d'Ascension. Les PP peuvent être
 * utilisés pour acheter des améliorations permanentes et des bonus qui affectent
 * les couches de jeu précédentes.
 *
 * Dépendances :
 * - core.js : Fournit l'accès aux variables d'état globales (totalPAEarned, prestigeCount,
 * prestigePoints, nombreLicences, nombreMaster1, nombreMaster2, nombreDoctorat, formatNumber
 * nombrePostDoctorat, saveGameState, checkUnlockConditions, resetGameState, applyAllSkillEffects, prestigeUnlocked).
 * - data.js : Contient les définitions des seuils pour gagner des PP (PRESTIGE_POINT_THRESHOLD)
 * et les données des achats de prestige (prestigePurchasesData), incluant leurs coûts et effets.
 * - ui.js : Pour les fonctions : showNotification,  updateDisplay, et la mise à jour
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