// ------------------ Fiche Mémo : quests.js (Mise à jour 30/05) -----------------------------
//
// Description :
// Ce fichier gère l'intégralité de la logique et des fonctionnalités liées au système de quêtes
// du jeu "MonJeuIncremental". Il est responsable de :
//   - La vérification des conditions de complétion des quêtes définies dans `data.js`.
//   - L'attribution des récompenses lorsque les quêtes sont complétées et réclamées par le joueur.
//   - La mise à jour de l'interface utilisateur du journal des quêtes, ce qui inclut :
//     - L'affichage des quêtes groupées par catégories.
//     - L'indication de la progression individuelle pour chaque quête en cours.
//     - La gestion de l'état visuel des quêtes (en cours, complétée, réclamée).
//
// Objectif :
// L'objectif principal de ce module est de guider la progression du joueur en lui offrant
// des objectifs clairs à court et moyen terme. Il vise également à récompenser les accomplissements
// du joueur, à enrichir l'expérience de jeu et à fournir une interface utilisateur claire et
// informative pour le suivi des quêtes.
//
// ------------------ Dépendances (Imports) ------------------
//
// - De './core.js' :
//   - Variables d'état globales : `bonsPoints`, `images`, `nombreEleves`, `nombreClasses`,
//     `nombreProfesseur`, `totalClicks`, `totalPAEarned`, `prestigeCount`, `ascensionCount`,
//     `totalBonsPointsParSeconde`, `schoolCount`, `nombreLycees`, `nombreColleges`,
//     `nombreLicences`, `nombreMaster1`, `nombreMaster2`, `nombreDoctorat`, `nombrePostDoctorat`,
//     `automationCategoryUnlocked`, `elevesUnlocked`, `classesUnlocked`, `imagesUnlocked`,
//     `ProfesseurUnlocked`, `skillEffects` (pour certaines conditions de quêtes),
//     `completedQuests` (objet stockant l'état de complétion/réclamation des quêtes),
//     `ascensionPoints`, `prestigePoints`.
//     Impact : Essentiel pour vérifier les conditions des quêtes et afficher leur progression.
//              `completedQuests` est modifié par ce module.
//   - Fonctions :
//     - `saveGameState`: Pour sauvegarder l'état du jeu après complétion ou réclamation d'une quête.
//     - `applyAllSkillEffects`: Pour recalculer les bonus globaux si une quête affecte
//       des multiplicateurs (ex: `paMultiplierFromQuests`).
//     Impact : Permet la persistance des données et l'intégration des récompenses de quêtes
//              dans la logique globale du jeu.
//
// - De './data.js' :
//   - `questsData` (Array d'objets) : Contient les définitions statiques de toutes les quêtes,
//     incluant leur `id`, `name`, `description`, `conditions` (objet), `rewards` (objet),
//     `rewardText` (string), `permanent` (boolean), et `category` (string).
//     Impact : Source principale des informations sur les quêtes (objectifs, récompenses, organisation).
//
// - De './ui.js' :
//   - Fonctions :
//     - `formatNumber`: Utilisée pour afficher les nombres (ressources, progression) de manière lisible.
//     - `showNotification`: Pour informer le joueur de la complétion ou de la réclamation d'une quête.
//     - `updateDisplay`: Pour rafraîchir l'affichage global du jeu après une réclamation de quête.
//     Impact : Assure le retour visuel au joueur et la mise à jour de l'interface.
//
// ------------------ Variables Clés (utilisées par quests.js, mais définies et gérées ailleurs) ------------------
//
// - `completedQuests` (Object, de `core.js`) : Structure de données clé qui stocke l'état de chaque quête
//   (ex: `{ Q_ID1: { completed: true, claimed: false }, ... }`). Modifié par `updateQuestProgress` et `claimQuestReward`.
// - `questsData` (Array, de `data.js`) : Source de toutes les définitions de quêtes.
// - Toutes les variables d'état importées de `core.js` (ex: `bonsPoints`, `nombreEleves`, etc.) :
//   Utilisées pour évaluer les `conditions` des quêtes et afficher la progression dans `renderQuests`.
//
// ------------------ Variables Clés Définies et Exportées ------------------
//
// - `export let paMultiplierFromQuests = new Decimal(1);`
//   Description : Un multiplicateur `Decimal` qui accumule les bonus de gain de Points d'Ascension (PA)
//                 provenant des récompenses de quêtes.
//   Impact : Modifié par `claimQuestReward` si une quête offre un `paMultiplier`.
//            Doit être importé et utilisé par `core.js` (probablement dans `applyAllSkillEffects`
//            ou lors du calcul du gain de PA) pour que le bonus soit effectif.
//
// ------------------ Fonctions Clés Définies et Exportées ------------------
//
// - `export function updateQuestProgress()`
//   Description : Parcourt toutes les quêtes définies dans `questsData`. Pour chaque quête non encore
//                 réclamée et non encore complétée, elle vérifie si toutes ses `conditions` sont remplies
//                 en comparant avec les variables d'état actuelles de `core.js`.
//                 Si une quête est nouvellement complétée :
//                   - Met à jour son état dans l'objet `completedQuests`.
//                   - Affiche une notification descriptive au joueur (via `showNotification`).
//                   - Déclenche `saveGameState`.
//   Appelée par : La boucle de jeu principale dans `core.js` (généralement à chaque tick ou à intervalle régulier).
//
// - `export function claimQuestReward(questId)`
//   Description : Gère la logique lorsqu'un joueur réclame la récompense d'une quête complétée.
//                 - Vérifie que la quête existe, est complétée et n'a pas déjà été réclamée.
//                 - Applique les `rewards` définies dans `questsData` (ex: ajout de `bonsPoints`, `images`,
//                   `ascensionPoints`, `prestigePoints` aux variables globales `window.variable`, ou mise à jour
//                   de `paMultiplierFromQuests`).
//                   *Note : La modification directe de `window.variable` est une pratique héritée
//                    et pourrait être améliorée par des fonctions setter dans `core.js`.*
//                 - Marque la quête comme réclamée dans `completedQuests`.
//                 - Appelle `applyAllSkillEffects` pour s'assurer que les bonus globaux sont à jour.
//                 - Affiche une notification descriptive de la récompense.
//                 - Si l'onglet des quêtes est visible, appelle `renderQuests` et `updateQuestsUI` pour un
//                   rafraîchissement immédiat.
//                 - Appelle `updateDisplay` pour un rafraîchissement global et `saveGameState`.
//   Appelée par : `events.js` en réponse à un clic du joueur sur un bouton "Réclamer".
//
// - `export function updateQuestsUI(domElements = {})`
//   Description : Met à jour les éléments d'affichage généraux de la section des quêtes,
//                 typiquement les compteurs (nombre de quêtes complétées / nombre total de quêtes).
//   - `domElements` (Object) : Un objet contenant des références aux éléments DOM à mettre à jour
//     (ex: `{ questsCompletedCountDisplay, questsTotalCountDisplay }`).
//   Appelée par : `ui.js` lors de l'ouverture de l'onglet des quêtes, et par `claimQuestReward` si l'onglet est actif.
//
// - `export function renderQuests(domElements = {})`
//   Description : Construit ou met à jour dynamiquement la structure HTML du journal des quêtes.
//                 - Regroupe les quêtes par la propriété `category` définie dans `questsData`.
//                 - Pour chaque quête, affiche son nom, sa description, sa progression actuelle
//                   (ex: "Élèves: 750/1000" ou "Auto: Débloqué"), le texte de sa récompense,
//                   son statut (En cours, Terminée !, Terminée et Réclamée), et un bouton "Réclamer" si applicable.
//                 - Applique des classes CSS pour styliser les quêtes selon leur état.
//   - `domElements` (Object) : Un objet contenant une référence au conteneur principal des quêtes
//     (ex: `{ questsGridContainer }`).
//   Appelée par : `ui.js` lors de l'ouverture de l'onglet des quêtes, et par `claimQuestReward` si l'onglet est actif.
//
// ------------------ Éléments DOM Clés (gérés via domElements passés par ui.js) ------------------
//
// Ce module ne sélectionne pas directement les éléments DOM. Il s'attend à ce que les fonctions
// `updateQuestsUI` et `renderQuests` reçoivent des objets `domElements` contenant les références
// aux conteneurs HTML appropriés définis dans `index.html`.
//
// - `questsGridContainer` (ex: `document.getElementById('questsList')`) :
//   Le conteneur principal où `renderQuests` injecte la liste structurée des quêtes (par catégorie).
// - `questsCompletedCountDisplay` (ex: `document.getElementById('questsCompletedCount')`) :
//   Élément pour afficher le nombre de quêtes complétées et réclamées.
// - `questsTotalCountDisplay` (ex: `document.getElementById('questsTotalCount')`) :
//   Élément pour afficher le nombre total de quêtes.
//
// Les éléments individuels pour chaque quête (titre, description, bouton de réclamation, etc.)
// sont créés dynamiquement par `renderQuests`.
//
// ------------------ Logique Générale et Flux de Données ------------------
//
// 1.  **Initialisation** : Les quêtes sont définies dans `data.js`. L'état des quêtes (`completedQuests`)
//     est chargé ou initialisé par `core.js`.
// 2.  **Mise à Jour de la Progression** : `core.js` appelle `updateQuestProgress()` régulièrement (boucle de jeu).
//     Cette fonction vérifie les conditions de toutes les quêtes et met à jour `completedQuests`.
// 3.  **Affichage** : Lorsque le joueur ouvre l'onglet des quêtes, `ui.js` appelle `renderQuests()` et
//     `updateQuestsUI()` (qui sont exportées par ce module) pour afficher l'état actuel.
// 4.  **Interaction Joueur** : Si le joueur clique sur "Réclamer" pour une quête complétée, `events.js`
//     capture cet événement et appelle `claimQuestReward(questId)` de ce module.
// 5.  **Réclamation et Effets** : `claimQuestReward` applique les récompenses, met à jour `completedQuests`,
//     sauvegarde le jeu, et rafraîchit l'interface.
//
// ------------------ Notes Spécifiques (Mise à jour 30/05) ------------------
//
// - La gestion des récompenses dans `claimQuestReward` (ex: `window.bonsPoints = ...`) est un point
//   qui pourrait être refactorisé pour une meilleure encapsulation en utilisant des fonctions "setter"
//   dans `core.js` afin d'éviter la manipulation directe de variables globales ou de `window`.
//   Le code actuel suit un pattern préexistant dans le projet.
// - L'affichage des quêtes est dynamique et inclut le regroupement par catégories et l'affichage
//   de la progression détaillée pour chaque quête.
// - Les notifications sont désormais plus descriptives, indiquant la quête et sa récompense.
// - La correction de la double déclaration d'import pour `updateQuestsUI` et `renderQuests`
//   a été effectuée (ces fonctions sont maintenant locales et exportées par `quests.js`).
// - Les commentaires `(30/05 Quetes update)` marquent les modifications récentes.
//
// -------------------------------------------------------------------------------------------

// Importations des variables d'état et fonctions globales depuis core.js
// (30/05 Quetes update: Ajout de plus de variables pour les conditions et la progression)
import {
    bonsPoints,
    images,
    nombreEleves,
    nombreClasses,
    nombreProfesseur,
    totalClicks,
    totalPAEarned,
    prestigeCount,
    ascensionCount,
    totalBonsPointsParSeconde, // (30/05 Quetes update)
    schoolCount, // (30/05 Quetes update) - Assurez-vous que cette variable est exportée par core.js
    nombreLycees, // (30/05 Quetes update) - Assurez-vous que cette variable est exportée par core.js
    nombreColleges, // (30/05 Quetes update) - Assurez-vous que cette variable est exportée par core.js
    nombreLicences, // (30/05 Quetes update)
    nombreMaster1, // (30/05 Quetes update)
    nombreMaster2, // (30/05 Quetes update)
    nombreDoctorat, // (30/05 Quetes update)
    nombrePostDoctorat, // (30/05 Quetes update)
    automationCategoryUnlocked, // (30/05 Quetes update)
    elevesUnlocked, // (30/05 Quetes update)
    classesUnlocked, // (30/05 Quetes update)
    imagesUnlocked, // (30/05 Quetes update)
    ProfesseurUnlocked, // (30/05 Quetes update)
    skillEffects, // (30/05 Quetes update) - Pour des conditions basées sur les effets, ex: clickBonsPointsBonus
    saveGameState,
    applyAllSkillEffects,
    completedQuests,
    ascensionPoints,
    prestigePoints
    // Note: studiesSkillPoints n'est plus utilisé pour les récompenses de quêtes (30/05 Quetes update)
} from './core.js';

// Importations des définitions de quêtes depuis data.js
import {
    questsData
} from './data.js';

// Importations des fonctions d'UI depuis ui.js
// (30/05 Quetes update: Suppression de updateQuestsUI et renderQuests des imports)
import {
    formatNumber,
    showNotification,
    updateDisplay
} from './ui.js';

// Variable pour le multiplicateur de PA des quêtes
export let paMultiplierFromQuests = new Decimal(1);

/**
 * Construit le texte de la récompense pour une notification.
 * @param {object} rewards - L'objet de récompenses de la quête.
 * @returns {string} - Un texte descriptif des récompenses.
 */
function getRewardNotificationText(rewards) { // (30/05 Quetes update)
    const rewardTexts = [];
    if (rewards.bonsPoints) rewardTexts.push(`${formatNumber(rewards.bonsPoints, 0)} BP`);
    if (rewards.images) rewardTexts.push(`${formatNumber(rewards.images, 0)} Images`);
    if (rewards.ascensionPoints) rewardTexts.push(`${formatNumber(rewards.ascensionPoints, 0)} PA`);
    if (rewards.prestigePoints) rewardTexts.push(`${formatNumber(rewards.prestigePoints, 0)} PP`);
    if (rewards.paMultiplier) rewardTexts.push(`Gain PA x${formatNumber(rewards.paMultiplier, 2)}`);
    // Ajoutez d'autres types de récompenses ici si nécessaire

    if (rewardTexts.length === 0) return "Récompense spéciale !";
    return rewardTexts.join(', ');
}

/**
 * Met à jour la progression des quêtes.
 */
export function updateQuestProgress() {
    let questsUINeedsUpdate = false; // (30/05 Quetes update)
    for (const questId in questsData) {
        const quest = questsData[questId];

        if (!completedQuests[questId]) {
            completedQuests[questId] = { completed: false, claimed: false };
        }

        if (completedQuests[questId].claimed) {
            continue;
        }
        if (completedQuests[questId].completed && !completedQuests[questId].claimed) {
            continue;
        }

        let allConditionsMet = true;
        if (quest.conditions) { // (30/05 Quetes update: S'assurer que conditions existe)
            for (const conditionKey in quest.conditions) {
                let currentValue;
                // (30/05 Quetes update: Accès aux variables de core.js pour les conditions)
                switch (conditionKey) {
                    case 'bonsPoints': currentValue = bonsPoints; break;
                    case 'totalClicks': currentValue = totalClicks; break;
                    case 'nombreEleves': currentValue = nombreEleves; break;
                    case 'nombreClasses': currentValue = nombreClasses; break;
                    case 'images': currentValue = images; break;
                    case 'nombreProfesseur': currentValue = nombreProfesseur; break;
                    case 'totalPAEarned': currentValue = totalPAEarned; break;
                    case 'prestigeCount': currentValue = prestigeCount; break;
                    case 'ascensionCount': currentValue = ascensionCount; break;
                    case 'totalBonsPointsParSeconde': currentValue = totalBonsPointsParSeconde; break;
                    case 'schoolCount': currentValue = schoolCount; break;
                    case 'nombreLicences': currentValue = nombreLicences; break;
                    case 'automationCategoryUnlocked': currentValue = automationCategoryUnlocked; break;
                    case 'elevesUnlocked': currentValue = elevesUnlocked; break;
                    case 'classesUnlocked': currentValue = classesUnlocked; break;
                    case 'imagesUnlocked': currentValue = imagesUnlocked; break;
                    case 'ProfesseurUnlocked': currentValue = ProfesseurUnlocked; break;
                    // (30/05 Quetes update) Pourrait nécessiter d'accéder à skillEffects pour certaines conditions
                    case 'clickBonsPointsBonusFromSkills': currentValue = skillEffects ? skillEffects.clickBonsPointsBonus : new Decimal(0); break;
                    default:
                        console.warn(`Condition de quête non reconnue: ${conditionKey} pour la quête ${questId}`);
                        currentValue = new Decimal(0); // Valeur par défaut pour éviter les erreurs
                }

                if (typeof quest.conditions[conditionKey] === 'boolean') {
                    if (currentValue !== quest.conditions[conditionKey]) {
                        allConditionsMet = false;
                        break;
                    }
                } else if (currentValue === undefined || currentValue.lt(new Decimal(quest.conditions[conditionKey]))) {
                    allConditionsMet = false;
                    break;
                }
            }
        } else if (quest.conditionsFunction) { // Pour des conditions plus complexes si implémenté plus tard
            // Placeholder pour une logique de conditionsFunction plus avancée
            // const gameState = { bonsPoints, totalClicks, ... }; // Regrouper l'état du jeu
            // if (!quest.conditionsFunction(gameState)) {
            //     allConditionsMet = false;
            // }
            console.warn(`conditionsFunction n'est pas encore pleinement supportée pour la quête ${questId}.`);
            allConditionsMet = false;
        }


        if (allConditionsMet && !completedQuests[questId].completed) {
            completedQuests[questId].completed = true;
            // (30/05 Quetes update: Notification plus descriptive)
            const rewardText = getRewardNotificationText(quest.rewards);
            showNotification(`Quête terminée : "${quest.name}" ! Récompense : ${rewardText}`);
            questsUINeedsUpdate = true; // (30/05 Quetes update)
        }
    }

    if (questsUINeedsUpdate) {
        // Appeler renderQuests si l'onglet des quêtes est actif, ou marquer pour mise à jour
        // Pour l'instant, on se contente de sauvegarder. L'UI sera mise à jour à l'ouverture de l'onglet.
        // Si vous voulez un rafraîchissement dynamique même si l'onglet n'est pas ouvert,
        // il faudrait une logique plus complexe ici pour appeler renderQuests conditionnellement.
        saveGameState();
        // Il n'est pas nécessaire d'appeler updateQuestsUI et renderQuests ici à chaque tick,
        // cela sera fait lorsque l'utilisateur ouvrira l'onglet des quêtes.
    }
}

/**
 * Gère la logique de réclamation d'une récompense de quête.
 * @param {string} questId - L'ID unique de la quête.
 */
export function claimQuestReward(questId) {
    const quest = questsData[questId];

    if (!quest) {
        console.error(`Quête non trouvée: ${questId}`);
        return;
    }

    if (!completedQuests[questId] || !completedQuests[questId].completed) {
        showNotification(`La quête "${quest.name}" n'est pas encore terminée !`);
        return;
    }

    if (completedQuests[questId].claimed) {
        showNotification(`La récompense de la quête "${quest.name}" a déjà été réclamée !`);
        return;
    }

    // (30/05 Quetes update: Ajustement des récompenses, plus de points de compétence)
    if (quest.rewards.bonsPoints) {
        if (typeof window.bonsPoints !== 'undefined' && typeof window.bonsPoints.add === 'function') {
            window.bonsPoints = window.bonsPoints.add(new Decimal(quest.rewards.bonsPoints));
        } else {
            console.error("window.bonsPoints n'est pas défini ou n'est pas un Decimal dans claimQuestReward.");
        }
    }
    if (quest.rewards.images) {
        if (typeof window.images !== 'undefined' && typeof window.images.add === 'function') {
            window.images = window.images.add(new Decimal(quest.rewards.images));
        } else {
            console.error("window.images n'est pas défini ou n'est pas un Decimal.");
        }
    }
    if (quest.rewards.ascensionPoints) {
        if (typeof window.ascensionPoints !== 'undefined' && typeof window.ascensionPoints.add === 'function') {
            window.ascensionPoints = window.ascensionPoints.add(new Decimal(quest.rewards.ascensionPoints));
        } else {
            console.error("window.ascensionPoints n'est pas défini ou n'est pas un Decimal.");
        }
    }
    if (quest.rewards.prestigePoints) {
         if (typeof window.prestigePoints !== 'undefined' && typeof window.prestigePoints.add === 'function') {
            window.prestigePoints = window.prestigePoints.add(new Decimal(quest.rewards.prestigePoints));
        } else {
            console.error("window.prestigePoints n'est pas défini ou n'est pas un Decimal.");
        }
    }
    if (quest.rewards.paMultiplier) {
        paMultiplierFromQuests = paMultiplierFromQuests.mul(new Decimal(quest.rewards.paMultiplier));
    }

    completedQuests[questId].claimed = true;

    applyAllSkillEffects(); // Important si paMultiplierFromQuests a changé

    // (30/05 Quetes update: Notification plus descriptive)
    const rewardText = getRewardNotificationText(quest.rewards);
    showNotification(`Récompense de "${quest.name}" réclamée : ${rewardText} !`);

    // (30/05 Quetes update: Appel explicite à updateQuestsUI et renderQuests après réclamation)
    const questsContainerElement = document.getElementById('questsContainer');
    if (questsContainerElement && questsContainerElement.style.display !== 'none') {
        const domElementsForRender = {
             questsGridContainer: document.getElementById('questsList'),
             questsCompletedCountDisplay: document.getElementById('questsCompletedCount'),
             questsTotalCountDisplay: document.getElementById('questsTotalCount')
        };
        if (domElementsForRender.questsGridContainer) {
            renderQuests(domElementsForRender);
        }
        if (domElementsForRender.questsCompletedCountDisplay && domElementsForRender.questsTotalCountDisplay) {
            updateQuestsUI(domElementsForRender);
        }
    }

    updateDisplay();
    saveGameState();
}

/**
 * Met à jour l'affichage des informations générales des quêtes dans l'interface utilisateur.
 * @param {object} domElements - Un objet contenant les références aux éléments DOM.
 * Ex: { questsCompletedCountDisplay, questsTotalCountDisplay }
 */
export function updateQuestsUI(domElements = {}) { // (30/05 Quetes update: domElements par défaut)
    const { questsCompletedCountDisplay, questsTotalCountDisplay } = domElements;

    const totalQuests = Object.keys(questsData).length;
    const completedAndClaimedQuests = Object.values(completedQuests).filter(q => q.completed && q.claimed).length;

    if (questsCompletedCountDisplay) questsCompletedCountDisplay.textContent = formatNumber(completedAndClaimedQuests, 0);
    if (questsTotalCountDisplay) questsTotalCountDisplay.textContent = formatNumber(totalQuests, 0);
}


/**
 * Construit ou met à jour dynamiquement la structure HTML du journal des quêtes.
 * Affiche les quêtes groupées par catégorie et avec leur progression.
 * @param {object} domElements - Un objet contenant les références aux éléments DOM.
 * Ex: { questsGridContainer }
 */
export function renderQuests(domElements = {}) { // (30/05 Quetes update: gestion des catégories et progression)
    const { questsGridContainer } = domElements;

    if (!questsGridContainer) {
        // console.warn("questsGridContainer non fourni à renderQuests. L'affichage des quêtes ne sera pas mis à jour.");
        return;
    }

    questsGridContainer.innerHTML = ''; // Nettoyer

    const questsByCategory = {};
    for (const questId in questsData) {
        const quest = questsData[questId];
        const category = quest.category || "Autres"; // Catégorie par défaut
        if (!questsByCategory[category]) {
            questsByCategory[category] = [];
        }
        questsByCategory[category].push({ ...quest, id: questId });
    }

    // Ordre souhaité des catégories (peut être défini ailleurs si besoin de plus de flexibilité)
    const categoryOrder = ["Fondations", "Expansion Économique", "Maîtrise de l'Ascension", "Secrets du Prestige", "Défis & Exploration", "Autres"];

    for (const categoryName of categoryOrder) {
        if (questsByCategory[categoryName]) {
            const categoryQuests = questsByCategory[categoryName];

            const categoryContainer = document.createElement('div');
            categoryContainer.classList.add('quest-category');

            const categoryTitle = document.createElement('h2');
            categoryTitle.classList.add('quest-category-title');
            categoryTitle.textContent = categoryName;
            categoryContainer.appendChild(categoryTitle);

            const categoryGrid = document.createElement('div');
            categoryGrid.classList.add('quest-category-grid'); // Pour styler la grille de quêtes par catégorie

            for (const quest of categoryQuests) {
                const questState = completedQuests[quest.id] || { completed: false, claimed: false };

                const questDiv = document.createElement('div');
                questDiv.classList.add('quest-item');
                if (questState.claimed) questDiv.classList.add('claimed');
                else if (questState.completed) questDiv.classList.add('completed');
                else questDiv.classList.add('in-progress');
                questDiv.dataset.questId = quest.id;

                let statusText = "En cours";
                let buttonHtml = "";
                let progressHtml = ""; // (30/05 Quetes update: Pour la progression)

                // Affichage de la progression (30/05 Quetes update)
                if (!questState.completed && quest.conditions) {
                    const progressParts = [];
                    for (const conditionKey in quest.conditions) {
                        const targetValue = new Decimal(quest.conditions[conditionKey]);
                        let currentValue;
                         switch (conditionKey) {
                            case 'bonsPoints': currentValue = bonsPoints; progressParts.push(`BP: ${formatNumber(currentValue)}/${formatNumber(targetValue)}`); break;
                            case 'totalClicks': currentValue = totalClicks; progressParts.push(`Clics: ${formatNumber(currentValue)}/${formatNumber(targetValue)}`); break;
                            case 'nombreEleves': currentValue = nombreEleves; progressParts.push(`Élèves: ${formatNumber(currentValue)}/${formatNumber(targetValue)}`); break;
                            case 'nombreClasses': currentValue = nombreClasses; progressParts.push(`Classes: ${formatNumber(currentValue)}/${formatNumber(targetValue)}`); break;
                            case 'images': currentValue = images; progressParts.push(`Images: ${formatNumber(currentValue)}/${formatNumber(targetValue)}`); break;
                            case 'nombreProfesseur': currentValue = nombreProfesseur; progressParts.push(`Profs: ${formatNumber(currentValue)}/${formatNumber(targetValue)}`); break;
                            case 'totalPAEarned': currentValue = totalPAEarned; progressParts.push(`Total PA: ${formatNumber(currentValue)}/${formatNumber(targetValue)}`); break;
                            case 'prestigeCount': currentValue = prestigeCount; progressParts.push(`Prestiges: ${formatNumber(currentValue)}/${formatNumber(targetValue)}`); break;
                            case 'ascensionCount': currentValue = ascensionCount; progressParts.push(`Ascensions: ${formatNumber(currentValue)}/${formatNumber(targetValue)}`); break;
                            case 'totalBonsPointsParSeconde': currentValue = totalBonsPointsParSeconde; progressParts.push(`BP/s: ${formatNumber(currentValue)}/${formatNumber(targetValue)}`); break;
                            case 'schoolCount': currentValue = schoolCount; progressParts.push(`Écoles: ${formatNumber(currentValue)}/${formatNumber(targetValue)}`); break;
                            case 'nombreLicences': currentValue = nombreLicences; progressParts.push(`Licences: ${formatNumber(currentValue)}/${formatNumber(targetValue)}`); break;
                            // Pour les booléens, la progression n'a pas de sens direct "X/Y"
                            case 'automationCategoryUnlocked': if (!automationCategoryUnlocked) progressParts.push(`Auto: Non débloqué`); else progressParts.push(`Auto: Débloqué`); break;
                            case 'elevesUnlocked': if (!elevesUnlocked) progressParts.push(`Élèves: Non débloqué`); else progressParts.push(`Élèves: Débloqué`); break;
                            case 'classesUnlocked': if (!classesUnlocked) progressParts.push(`Classes: Non débloqué`); else progressParts.push(`Classes: Débloqué`); break;
                            case 'imagesUnlocked': if (!imagesUnlocked) progressParts.push(`Images: Non débloqué`); else progressParts.push(`Images: Débloqué`); break;
                            case 'ProfesseurUnlocked': if (!ProfesseurUnlocked) progressParts.push(`Profs: Non débloqué`); else progressParts.push(`Profs: Débloqué`); break;
                            case 'clickBonsPointsBonusFromSkills': currentValue = skillEffects ? skillEffects.clickBonsPointsBonus : new Decimal(0); progressParts.push(`Bonus Clic: ${formatNumber(currentValue)}/${formatNumber(targetValue)}`); break;
                            // ... autres conditions numériques ou booléennes
                        }
                    }
                    if (progressParts.length > 0) {
                        progressHtml = `<p class="quest-progress">Progression : ${progressParts.join(' <span class="quest-progress-separator">|</span> ')}</p>`; // (30/05 Quetes update: Séparateur)
                    }
                }


                if (questState.completed) {
                    if (questState.claimed) {
                        statusText = "Terminée et Réclamée";
                    } else {
                        statusText = "Terminée !";
                        buttonHtml = `<button class="claim-quest-button button" data-quest-id="${quest.id}">Réclamer</button>`; // (30/05 Quetes update: ajout class "button")
                    }
                }

                const rewardText = quest.rewardText || getRewardNotificationText(quest.rewards); // (30/05 Quetes update)

                questDiv.innerHTML = `
                    <h3>${quest.name}</h3>
                    <p class="quest-description">${quest.description}</p>
                    ${progressHtml}
                    <div class="quest-rewards">
                        <h4>Récompense :</h4>
                        <p>${rewardText}</p>
                    </div>
                    <p class="quest-status">Statut : ${statusText}</p>
                    ${buttonHtml}
                `;

                if (buttonHtml) {
                    const claimButton = questDiv.querySelector('.claim-quest-button');
                    if (claimButton) {
                        claimButton.addEventListener('click', (event) => {
                            event.stopPropagation(); // Évite la propagation si les quêtes sont cliquables
                            claimQuestReward(quest.id);
                        });
                    }
                }
                categoryGrid.appendChild(questDiv);
            }
            categoryContainer.appendChild(categoryGrid);
            questsGridContainer.appendChild(categoryContainer);
        }
    }
     // S'assurer que les catégories non listées explicitement mais présentes dans les données sont aussi affichées
    for (const categoryName in questsByCategory) {
        if (!categoryOrder.includes(categoryName)) {
            const categoryQuests = questsByCategory[categoryName];
            const categoryContainer = document.createElement('div');
            categoryContainer.classList.add('quest-category');
            const categoryTitle = document.createElement('h2');
            categoryTitle.classList.add('quest-category-title');
            categoryTitle.textContent = categoryName;
            categoryContainer.appendChild(categoryTitle);
            const categoryGrid = document.createElement('div');
            categoryGrid.classList.add('quest-category-grid');

             for (const quest of categoryQuests) {
                const questState = completedQuests[quest.id] || { completed: false, claimed: false };
                const questDiv = document.createElement('div');
                questDiv.classList.add('quest-item');
                if (questState.claimed) questDiv.classList.add('claimed');
                else if (questState.completed) questDiv.classList.add('completed');
                else questDiv.classList.add('in-progress');
                questDiv.dataset.questId = quest.id;
                let statusText = "En cours";
                let buttonHtml = "";
                let progressHtml = "";
                 if (!questState.completed && quest.conditions) {
                    const progressParts = [];
                    for (const conditionKey in quest.conditions) {
                        const targetValue = new Decimal(quest.conditions[conditionKey]);
                        let currentValue;
                         switch (conditionKey) {
                            case 'bonsPoints': currentValue = bonsPoints; progressParts.push(`BP: ${formatNumber(currentValue)}/${formatNumber(targetValue)}`); break;
                            case 'totalClicks': currentValue = totalClicks; progressParts.push(`Clics: ${formatNumber(currentValue)}/${formatNumber(targetValue)}`); break;
                            // ... autres conditions pour la catégorie "Autres" si nécessaire
                            default: // (30/05 Quetes update) Ajout d'un default pour éviter les erreurs si une condition n'est pas listée
                                if (typeof quest.conditions[conditionKey] !== 'boolean') { // N'affiche que pour les numériques non listés
                                   // currentValue = window[conditionKey]; // Accès global risqué, à éviter
                                   // Pour l'instant, on ne l'affiche pas si non explicitement géré
                                }
                                break;
                        }
                    }
                    if (progressParts.length > 0) progressHtml = `<p class="quest-progress">Progression : ${progressParts.join(' <span class="quest-progress-separator">|</span> ')}</p>`;
                }
                if (questState.completed) {
                    if (questState.claimed) statusText = "Terminée et Réclamée";
                    else { statusText = "Terminée !"; buttonHtml = `<button class="claim-quest-button button" data-quest-id="${quest.id}">Réclamer</button>`;}
                }
                const rewardTextDisplay = quest.rewardText || getRewardNotificationText(quest.rewards);
                questDiv.innerHTML = `<h3>${quest.name}</h3><p class="quest-description">${quest.description}</p>${progressHtml}<div class="quest-rewards"><h4>Récompense :</h4><p>${rewardTextDisplay}</p></div><p class="quest-status">Statut : ${statusText}</p>${buttonHtml}`;
                if (buttonHtml) {
                    const claimButton = questDiv.querySelector('.claim-quest-button');
                    if (claimButton) claimButton.addEventListener('click', (event) => { event.stopPropagation(); claimQuestReward(quest.id); });
                }
                categoryGrid.appendChild(questDiv);
            }
            categoryContainer.appendChild(categoryGrid);
            questsGridContainer.appendChild(categoryContainer);
        }
    }
}
