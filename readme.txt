MonJeuIncremental : Documentation Détaillée du Projet

Bienvenue dans la documentation de MonJeuIncremental ! Ce document est conçu pour fournir une vue d'ensemble complète et synthétique de l'architecture du jeu, des interactions entre les modules, des variables clés, des fonctions principales et des mécaniques de jeu. Que vous soyez un développeur expérimenté, un ami curieux, ou une IA, ce guide vous aidera à naviguer dans le code et à comprendre le fonctionnement interne du jeu sans risquer de perturber les autres documents.
Table des Matières

    Structure du Projet

    Vue d'Ensemble de l'Architecture

    Description Détaillée des Modules

        index.html

        style.css

        break_infinity.min.js

        core.js

        data.js

        ui.js

        events.js

        studies.js

        automation.js

        skills.js

        ascension.js

        prestige.js

        settings.js

        quests.js

        achievements.js

    Flux de Données et Interactions Clés

    Mécaniques de Jeu Principales

        Progression Standard (Études)

        Automatisation

        Arbre de Compétences

        Ascension

        Prestige

        Quêtes

        Succès

        Paramètres

    Bonnes Pratiques de Développement

1. Structure du Projet

Le jeu est organisé en plusieurs fichiers JavaScript modulaires, chacun ayant une responsabilité spécifique.

MonJeuIncremental/
├── index.html              # Structure HTML de base
├── style.css               # Styles CSS
├── break_infinity.min.js   # Bibliothèque pour les grands nombres
├── core.js                 # Fonctions principales, boucle de jeu, état global
├── data.js                 # Données du jeu (coûts, définitions, etc.)
├── ui.js                   # Gestion de l'interface utilisateur
├── events.js               # Gestion des événements DOM
├── studies.js              # Logique des études (production, achats)
├── automation.js           # Logique de l'automatisation
├── skills.js               # Logique des compétences
├── ascension.js            # Logique de l'ascension
├── prestige.js             # Logique du prestige
├── settings.js             # Paramètres du jeu
├── quests.js               # Logique des quêtes
├── achievements.js         # Logique des succès
├── README.md               # Ce document
└── assets/                 # (Optionnel) Dossier pour les images, sons, etc.

2. Vue d'Ensemble de l'Architecture

Le jeu suit une architecture modulaire pour séparer les préoccupations et faciliter la maintenance.

    index.html : Le squelette de l'application. Il charge tous les autres fichiers et définit la structure visuelle de l'interface.

    style.css : Gère l'apparence visuelle du jeu, y compris les thèmes et la réactivité.

    break_infinity.min.js : Une bibliothèque fondamentale pour gérer les nombres extrêmement grands, essentielle pour les jeux incrémentaux.

    core.js : Le cerveau du jeu. Il contient l'état global, la boucle de jeu, les fonctions de sauvegarde/chargement, et coordonne les interactions entre les modules de logique.

    data.js : Le dépôt de toutes les données statiques et de configuration du jeu (coûts, définitions de compétences, quêtes, succès, etc.). C'est une source de vérité pour les valeurs non dynamiques.

    ui.js : La couche de présentation. Elle est responsable de la mise à jour de tous les éléments visuels de l'interface utilisateur en fonction de l'état du jeu. Elle ne contient aucune logique métier.

    events.js : Le gestionnaire d'interactions. Il attache les écouteurs d'événements DOM et délègue les actions aux modules de logique ou d'UI appropriés.

    Modules de Logique Spécifiques (studies.js, automation.js, skills.js, ascension.js, prestige.js, settings.js, quests.js, achievements.js) : Chacun de ces modules gère une mécanique de jeu spécifique. Ils lisent l'état global (core.js), utilisent les données de data.js, et appellent ui.js pour les mises à jour visuelles.

3. Description Détaillée des Modules

Chaque fichier JavaScript est conçu comme un module, important et exportant des variables et des fonctions pour interagir avec les autres parties du jeu.
index.html

    Description : Point d'entrée principal de l'application web. Il définit la structure HTML globale, inclut les feuilles de style CSS, les bibliothèques externes (break_infinity.min.js), et charge tous les fichiers JavaScript modulaires.

    Objectif : Structurer l'interface utilisateur et orchestrer le chargement de tous les composants nécessaires.

    Dépendances (Inclusions) : style.css, break_infinity.min.js, core.js, data.js, ui.js, events.js, studies.js, automation.js, skills.js, ascension.js, prestige.js, settings.js, quests.js, achievements.js. L'ordre est crucial, notamment break_infinity.min.js en premier.

    Variables Clés : Aucune variable JavaScript clé n'est définie directement ici.

    Fonctions Clés : Aucune fonction JavaScript n'est définie directement, à l'exception de l'appel à initializeGame() de core.js via window.onload.

    Éléments DOM Clés (par ID) :

        <body> : L'élément racine, reçoit les classes de thème/mode (normal-theme, day-mode, etc.) de settings.js et core.js.

        #side-menu : Menu de navigation latéral.

        #main-content : Conteneur principal pour le contenu dynamique des sections.

        .container : Conteneur de base pour les ressources principales.

        #studiesMainContainer, #automationMainContainer, #skillsContainer, #settingsContainer, #ascensionMenuContainer, #prestigeMenuContainer, #questsContainer, #achievementsContainer : Conteneurs pour chaque section du jeu.

        Modales de confirmation (#confirmResetModal, #confirmAscensionModal, etc.) et de statistiques (#statsModal).

    Interactions :

        style.css : Applique les styles visuels à tous les éléments.

        core.js : Appelle initializeGame() au chargement.

        ui.js : Manipule la visibilité et le contenu des éléments DOM.

        settings.js : Applique les classes de thème au <body>.

        events.js : Attache les gestionnaires d'événements aux éléments interactifs.

style.css

    Description : Le cœur de la présentation visuelle du jeu, définissant l'apparence de tous les éléments HTML, y compris la mise en page, les couleurs, la typographie, les transitions, et les styles spécifiques pour les thèmes et la réactivité.

    Objectif : Fournir une couche de présentation cohérente et réactive.

    Variables CSS Clés : Utilise des variables CSS (--main-bg-color, --text-color, --button-bg-color, --bons-points-color, etc.) définies au niveau de :root ou sur le body avec des classes spécifiques pour les thèmes (.normal-theme, .neon-sci-fi-theme, .rgb-theme) et les modes (.day-mode, .night-mode).

    Classes/Sélecteurs Clés : body, .main-game-wrapper, #side-menu, .achat-section, .button.can-afford, .automation-active, .skill-box.locked, .achievement-item.unlocked, etc.

    Interactions :

        index.html : Est directement lié via <link>.

        core.js et settings.js : Ajoutent/suppriment des classes au <body> pour basculer les thèmes/modes.

        ui.js : Manipule le DOM pour appliquer les classes CSS qui sont stylisées ici (ex: .unlocked, .completed, .active).

        Les modules de logique (ex: studies.js, achievements.js) : Créent et mettent à jour les éléments DOM qui sont ensuite stylisés par style.css.

break_infinity.min.js

    Description : Version minifiée de la bibliothèque "Break Infinity", offrant une implémentation de nombres à virgule flottante de très haute précision pour gérer des valeurs astronomiques.

    Objectif : Prévenir les erreurs d'arrondi et les "Infinity" prématurés, essentiels pour les jeux incrémentaux.

    Concepts Clés :

        Objet Decimal : Classe globale exposée. Tous les nombres susceptibles de devenir très grands doivent être des instances de Decimal.

        Opérations Arithmétiques : Toutes les opérations (add, sub, mul, div, pow, etc.) doivent utiliser les méthodes de l'objet Decimal (ex: nombre.add(autreNombre)).

    Dépendances : Aucune (bibliothèque autonome).

    Impact sur d'autres Modules :

        core.js : Toutes les variables d'état numériques (ressources, productions, coûts) DOIVENT être des instances de Decimal.

        data.js : Toutes les valeurs numériques initiales ou constantes importantes DOIVENT être des objets Decimal.

        Tous les modules de logique (studies.js, ascension.js, prestige.js, etc.) : Doivent utiliser les méthodes de l'objet Decimal pour tous les calculs et comparaisons.

        ui.js : Doit utiliser les méthodes de formatage de Decimal (ou formatNumber de core.js) pour l'affichage.

    Notes Spécifiques : Chargé globalement dans index.html AVANT tous les autres scripts.

core.js

    Description : Le cœur de la logique du jeu. Gère l'état global, les variables principales, les fonctions de sauvegarde/chargement, les calculs de production, et la boucle de jeu principale.

    Objectif : Centraliser l'état du jeu et les fonctions critiques.

    Variables Globales (état du jeu, exportées) :

        Ressources : bonsPoints, totalBonsPointsParSeconde, images, nombreEleves, nombreClasses, nombreProfesseur, ascensionPoints, prestigePoints, etc. (toutes des Decimal).

        Compteurs : totalClicks, ascensionCount, prestigeCount, totalPAEarned, bonsPointsTotal.

        Déverrouillages : elevesUnlocked, ascensionUnlocked, skillsButtonUnlocked, automationCategoryUnlocked, questsUnlocked, achievementsButtonUnlocked, etc. (booléens).

        Automatisation : autoEleveActive, autoClasseActive, etc. (booléens).

        Compétences : studiesSkillPoints, ascensionSkillPoints, prestigeSkillPoints, studiesSkillLevels, ascensionSkillLevels, prestigeSkillLevels.

        Paramètres : isDayTheme, offlineProgressEnabled, minimizeResourcesActive, disableAscensionWarning, firstAscensionPerformed, disablePrestigeWarning.

        Achats de Prestige : nombreLicences, nombreMaster1, etc.

        skillEffects : Objet agrégant tous les multiplicateurs et réductions de coût (compétences, succès, prestige, quêtes).

        Coûts Actuels : coutEleveActuel, coutClasseActuel, etc.

    Fonctions Clés (exportées) :

        formatNumber(num, decimalPlaces, exponentThreshold) : Formate les nombres.

        performPurchase(itemType, quantityRequested, isAutomated) : Gère un achat générique.

        saveGameState(), loadGameState(), resetGameVariables(), hardResetGame(), softResetGame(), superSoftResetGame() : Fonctions de persistance et de réinitialisation.

        updateCosts() : Met à jour les coûts actuels.

        calculateTotalBPS() : Calcule la production totale de BP/s.

        checkUnlockConditions() : Vérifie et débloque les fonctionnalités.

        applyAllSkillEffects() : Applique tous les bonus cumulés.

        calculateOfflineProgress() : Calcule le progrès hors ligne.

        initializeGame() : Fonction d'initialisation principale et de démarrage de la boucle de jeu.

    Dépendances (Imports) :

        De ./studies.js : Fonctions de calcul de coût et valeurs de production de base.

        De ./automation.js : calculateAutomationCost, runAutomation.

        De ./data.js : skillsData, prime_PA, prestigePurchasesData.

        De ./ascension.js : calculatePAGained, performAscension, fonctions de coût des structures d'ascension.

        De ./prestige.js : calculatePPGained, performPrestige, getPrestigeBonusMultiplier, fonctions de coût des achats de prestige.

        De ./quests.js : updateQuestProgress, questsData, completedQuests, paMultiplierFromQuests.

        De ./achievements.js : checkAchievements, achievementsData, unlockedAchievements, permanentBpsBonusFromAchievements.

        De ./ui.js : Fonctions de mise à jour de l'affichage, de notifications, de rendu des menus.

    Interactions : Le module central qui orchestre presque toutes les interactions. La boucle de jeu appelle régulièrement calculateTotalBPS, checkUnlockConditions, updateQuestProgress, checkAchievements, runAutomation, updateDisplay, et saveGameState.

data.js

    Description : Dépôt central de toutes les données statiques et de configuration du jeu.

    Objectif : Fournir une source unique et fiable pour toutes les données numériques et structurelles constantes.

    Dépendances : break_infinity.min.js (pour les objets Decimal).

    Variables Clés Définies et Exportées :

        initialCosts : Coûts de base initiaux pour chaque type d'achat (toutes des Decimal).

        baseProductions : Production de base de chaque unité (toutes des Decimal).

        skillsData : Définitions structurées de tous les arbres de compétences (Études, Ascension, Prestige), incluant id, name, description, cost, maxLevel, tier, prerequisites, effect (fonction qui modifie skillEffects de core.js).

        prestigePurchasesData : Définitions des améliorations permanentes achetables avec les PP, incluant id, name, baseCost, costMultiplier, getEffectValue, effect (fonction qui modifie skillEffects de core.js), getMinClasses (spécifique à Doctorat), prerequisites.

        questsData : Définitions de toutes les quêtes, incluant id, name, description, condition (fonction), reward (objet), rewardText, permanent.

        bonusPointThresholds : Seuils de BP pour gagner des points de compétence d'études.

        prime_PA, ASCENSION_POINT_THRESHOLD, PRESTIGE_POINT_THRESHOLD : Constantes pour les calculs de PA et PP.

    Logique Générale : Purement déclaratif. Ne contient aucune logique de jeu active, seulement des définitions de données. Les fonctions effect et condition définies ici sont des callbacks exécutées par d'autres modules.

    Interactions : Importé par core.js, studies.js, ascension.js, prestige.js, skills.js, quests.js, achievements.js pour accéder aux données de configuration.

ui.js

    Description : Gère la totalité de l'interface utilisateur. Traduit l'état interne du jeu en représentation visuelle interactive.

    Objectif : Fournir une couche de présentation robuste et réactive, sans logique métier.

    Dépendances (Imports) :

        De ./core.js : Toutes les variables d'état globales (bonsPoints, totalBonsPointsParSeconde, skillEffects, tous les flags ...Unlocked, etc.) et fonctions utilitaires (formatNumber, applyAllSkillEffects, etc.).

        De ./studies.js, ./automation.js, ./ascension.js, ./prestige.js : Fonctions de calcul de coût spécifiques pour afficher les coûts des achats.

        De ./data.js : skillsData, prestigePurchasesData, questsData, achievementsData pour le rendu dynamique des menus.

        De ./skills.js : buySkill (pour handleSkillClick).

        De ./settings.js : isDayTheme, themeOptionUnlocked (pour l'affichage des paramètres).

        break_infinity.min.js : Implicite pour l'utilisation de Decimal via formatNumber.

    Fonctions Clés (exportées) :

        updateDisplay() : Fonction principale de rafraîchissement de l'interface (ressources, quantités, coûts, bonus).

        showNotification(message, type, duration) : Affiche une notification pop-up.

        updateSectionVisibility() : Contrôle la visibilité des conteneurs HTML principaux (onglets).

        updateMultiplierButtons(), updateAutomationButtonStates(), updateSettingsButtonStates(), updateThemeAndModeDisplay() : Mises à jour spécifiques des états des boutons et sélecteurs.

        renderSkillsMenu(), renderSkillPanel(...), handleSkillClick(...) : Rendu et gestion des clics sur l'arbre de compétences.

        renderQuests() : Rendu de la liste des quêtes.

        renderAchievements(), showAchievementTooltip(...), hideAchievementTooltip(), toggleAchievementTooltip(...) : Rendu et gestion des infobulles des succès.

        openTab(tabContainer) : Fonction générique pour ouvrir une section principale.

        openStatsModal(), closeStatsModal(), updateStatsDisplay() : Gestion de la modale des statistiques.

    Éléments DOM Clés (référencés par ID) : Presque tous les éléments HTML interactifs ou d'affichage définis dans index.html sont manipulés par ui.js.

    Logique Générale : Lit l'état du jeu et les données de configuration pour "écrire" sur l'interface. Ne contient pas de logique d'achat, de calcul de production, ou de réinitialisation.

events.js

    Description : Gère tous les écouteurs d'événements (clics, changements, etc.) de l'interface utilisateur.

    Objectif : Attacher des gestionnaires d'événements aux éléments DOM et déléguer les actions aux fonctions de logique ou d'UI appropriées.

    Dépendances (Imports) :

        De ./core.js : Variables d'état (lecture pour conditions, ex: ascensionUnlocked) et fonctions d'action (saveGameState, hardResetGame, softResetGame, superSoftResetGame, performPurchase).

        De ./studies.js : performStudyPurchase.

        De ./automation.js : toggleAutomation.

        De ./skills.js : purchaseSkill.

        De ./ascension.js : performAscension.

        De ./prestige.js : performPrestige, performPrestigePurchase.

        De ./settings.js : toggleTheme, toggleOfflineProgress, toggleMinimizeResources, openStats.

        De ./quests.js : claimQuestReward.

        De ./achievements.js : showAchievementTooltip, hideAchievementTooltip, toggleAchievementTooltip.

        De ./ui.js : updateDisplay, showNotification, openTab, closeStatsModal, updateStatsDisplay.

    Éléments DOM Clés (référencés par ID) : Récupère directement les références aux boutons, sélecteurs, et conteneurs cliquables de index.html.

    Logique Générale : Initialise les écouteurs d'événements une fois le DOM chargé. Agit comme une "colle" entre l'interface et le backend, sans logique métier complexe.

studies.js

    Description : Encapsule la logique spécifique aux achats et à la production liés aux études (Élèves, Classes, Images, Professeurs).

    Objectif : Centraliser les mécanismes de progression liés aux études.

    Dépendances (Imports) :

        De ./core.js : Variables d'état (bonsPoints, images, nombreEleves, nombreClasses, nombreProfesseur, totalClicks, skillEffects, currentPurchaseMultiplier, ascensionSkillPoints, nombreLicences, etc.) et fonctions (checkUnlockConditions, saveGameState, applyAllSkillEffects, calculateTotalBPS, formatNumber).

        De ./data.js : initialCosts, baseProductions, prestigePurchasesData.

        De ./ui.js : updateDisplay, showNotification.

    Variables Clés (exportées) : bonsPointsParSecondeEleves, bonsPointsParSecondeClasses.

    Fonctions Clés (exportées) :

        calculateNextEleveCost(count), calculateNextClasseCost(count), calculateNextImageCost(count), calculateNextProfessorCost(count) : Calculent les coûts des prochains achats.

        elevesBpsPerItem, classesBpsPerItem : Valeurs de production de base.

        calculateStudiesBPS() : Calcule la production BP/s des élèves et classes.

        handleStudyClick() : Gère le clic sur le bouton "Étudier sagement".

        performStudyPurchase(itemType, quantityRequested, isAutomated) : Exécute la logique d'achat pour les unités d'études.

        updateStudiesButtonStates(domElements), updateStudiesSectionVisibility(domElements) : Mises à jour de l'UI spécifiques aux études.

    Interactions : Appelé par events.js pour les clics d'achat et par core.js pour les calculs de production.

automation.js

    Description : Gère la logique et les fonctionnalités liées à l'automatisation des achats.

    Objectif : Activer/désactiver l'automatisation et déclencher les achats automatiques.

    Dépendances (Imports) :

        De ./core.js : ascensionPoints, autoEleveActive, performPurchase, formatNumber, saveGameState, skillEffects.

        De ./ui.js : showNotification, updateAutomationButtonStates, updateDisplay.

    Variables Clés : Utilise les variables d'état d'automatisation de core.js.

    Fonctions Clés (exportées) :

        calculateAutomationCost(baseCost) : Calcule le coût d'activation d'une automatisation.

        runAutomation() : Exécute les achats pour toutes les automatisations actives.

        toggleAutomation(itemType, baseCost) : Active ou désactive une automatisation.

    Interactions : Appelé par events.js pour les interactions utilisateur et par la boucle de jeu de core.js pour l'exécution périodique.

skills.js

    Description : Gère la logique et les fonctionnalités liées aux compétences (Skills).

    Objectif : Permettre l'achat de compétences, gérer les points de compétence, appliquer les effets et mettre à jour l'interface.

    Dépendances (Imports) :

        De ./core.js : studiesSkillPoints, ascensionSkillPoints, prestigeSkillPoints, skillEffects, studiesSkillLevels, ascensionSkillLevels, prestigeSkillLevels, saveGameState, checkUnlockConditions, applyAllSkillEffects, formatNumber, totalClicks, nombreProfesseur, prestigeCount.

        De ./data.js : skillsData.

        De ./ui.js : updateDisplay, showNotification.

    Variables Clés : Utilise les variables de points et niveaux de compétences de core.js.

    Fonctions Clés (exportées) :

        purchaseSkill(skillId, skillType) : Gère l'achat d'une compétence.

        updateSkillsUI(domElements) : Met à jour l'état de l'UI des compétences.

        renderSkillsMenu(domElements) : Construit ou met à jour dynamiquement le menu des compétences.

    Interactions : Appelé par events.js pour les interactions utilisateur et par core.js pour les mises à jour visuelles.

ascension.js

    Description : Gère la logique et les fonctionnalités liées au mécanisme d'Ascension (soft reset).

    Objectif : Réinitialiser une partie de la progression en échange de Points d'Ascension (PA).

    Dépendances (Imports) :

        De ./core.js : bonsPointsTotal, ascensionCount, ascensionPoints, totalPAEarned, saveGameState, checkUnlockConditions, softResetGame, applyAllSkillEffects, ascensionUnlocked, nombreProfesseur, formatNumber.

        De ./data.js : ASCENSION_POINT_THRESHOLD, initialCosts.

        De ./ui.js : showNotification, updateDisplay.

    Variables Clés : Utilise les variables d'Ascension de core.js.

    Fonctions Clés (exportées) :

        calculatePAGained() : Calcule les PA gagnés.

        performAscension() : Exécute le processus d'Ascension.

        calculateNextEcoleCost(count), calculateNextLyceeCost(count), calculateNextCollegeCost(count) : Calculent les coûts des structures d'Ascension.

        updateAscensionUI(domElements), updateAscensionButtonStates(domElements) : Mises à jour de l'UI spécifiques à l'Ascension.

    Interactions : Appelé par events.js pour l'interaction utilisateur et par core.js pour les calculs et réinitialisations.

prestige.js

    Description : Gère la logique et les fonctionnalités liées au mécanisme de Prestige (réinitialisation la plus profonde).

    Objectif : Gagner des Points de Prestige (PP) pour acheter des améliorations permanentes.

    Dépendances (Imports) :

        De ./core.js : totalPAEarned, prestigeCount, prestigePoints, nombreLicences, nombreMaster1, nombreMaster2, nombreDoctorat, nombrePostDoctorat, saveGameState, checkUnlockConditions, superSoftResetGame, applyAllSkillEffects, prestigeUnlocked, formatNumber.

        De ./data.js : PRESTIGE_POINT_THRESHOLD, prestigePurchasesData, initialCosts.

        De ./ui.js : showNotification, updateDisplay.

    Variables Clés : Utilise les variables de Prestige de core.js.

    Fonctions Clés (exportées) :

        calculatePPGained() : Calcule les PP gagnés.

        getPrestigeBonusMultiplier(type, currentPrestigeCount, currentPrestigePoints) : Calcule les multiplicateurs de prestige.

        calculateLicenceCost(count), calculateMaster1Cost(count), calculateMaster2Cost(count), calculateDoctoratCost(count), calculatePostDoctoratCost(count) : Calculent les coûts des achats de prestige.

        performPrestige() : Exécute le processus de Prestige.

        performPrestigePurchase(purchaseId) : Gère l'achat d'améliorations de prestige.

        updatePrestigeUI(domElements), updatePrestigeButtonStates(domElements), renderPrestigePurchases(domElements) : Mises à jour de l'UI spécifiques au Prestige.

    Interactions : Appelé par events.js pour l'interaction utilisateur et par core.js pour les calculs et réinitialisations.

settings.js

    Description : Gère la logique des différentes options de paramètres du jeu.

    Objectif : Permettre au joueur de personnaliser son expérience (thème, progression hors ligne, affichage des ressources, statistiques).

    Dépendances (Imports) :

        De ./core.js : isDayTheme, offlineProgressEnabled, minimizeResourcesActive, themeOptionUnlocked, images, newSettingsUnlocked, statsButtonUnlocked, saveGameState.

        De ./ui.js : openStatsModal, closeStatsModal, updateSectionVisibility, updateSettingsButtonStates, showNotification, updateDisplay.

    Variables Clés : Utilise les variables de paramètres de core.js.

    Fonctions Clés (exportées) :

        toggleTheme() : Bascule entre le mode jour et nuit, gère le déverrouillage du thème.

        toggleOfflineProgress(isChecked) : Active/désactive la progression hors ligne.

        toggleMinimizeResources() : Bascule l'affichage des ressources.

        openStats() : Ouvre la modale des statistiques.

    Interactions : Appelé par events.js pour les interactions utilisateur. Modifie les variables d'état dans core.js et appelle ui.js pour les mises à jour visuelles et les notifications.

quests.js

    Description : Gère toute la logique et les fonctionnalités liées aux quêtes.

    Objectif : Définir les quêtes, vérifier leurs conditions, distribuer les récompenses et mettre à jour l'interface.

    Dépendances (Imports) :

        De ./core.js : bonsPoints, images, nombreEleves, nombreClasses, nombreProfesseur, totalClicks, totalPAEarned, prestigeCount, saveGameState, applyAllSkillEffects, completedQuests, formatNumber.

        De ./data.js : questsData.

        De ./ui.js : updateDisplay, showNotification.

    Variables Clés (exportées) : paMultiplierFromQuests.

    Fonctions Clés (exportées) :

        updateQuestProgress() : Vérifie les conditions de toutes les quêtes non complétées.

        claimQuestReward(questId) : Gère la réclamation d'une récompense de quête.

        updateQuestsUI(domElements), renderQuests(domElements) : Mises à jour de l'UI spécifiques aux quêtes.

    Interactions : Appelé par la boucle de jeu de core.js pour la vérification périodique et par events.js pour la réclamation de récompenses.

achievements.js

    Description : Gère le système de succès (Achievements).

    Objectif : Définir les succès, leurs conditions, les récompenses associées, et gérer l'affichage de la grille des succès et des infobulles.

    Variables Clés (exportées) :

        achievementsData : Tableau de définition de tous les succès (chaque succès a id, name, description, condition (fonction), rewardText, rewardFn (fonction)).

        unlockedAchievements : Objet pour suivre les succès débloqués.

        permanentBpsBonusFromAchievements : Bonus cumulé à la production de BP/s provenant des succès permanents.

        activeAchievementTooltip : Référence à l'infobulle "cliquée".

    Fonctions Clés (exportées) :

        renderAchievements() : Met à jour l'affichage de la grille des succès.

        checkAchievements() : Vérifie les conditions de déverrouillage des succès.

        showAchievementTooltip(event, ach), hideAchievementTooltip(), toggleAchievementTooltip(event, ach) : Gèrent l'affichage des infobulles.

    Dépendances (Imports) :

        De ./core.js : Variables d'état (lecture pour conditions et modification pour récompenses additives comme ascensionPoints), skillEffects (pour récompenses permanentes), saveGameState, applyAllSkillEffects, checkUnlockConditions, formatNumber.

        De ./ui.js : showNotification, updateDisplay.

        De ./quests.js : questsData (pour certaines conditions de succès).

    Flux de Données : checkAchievements() est appelée régulièrement par core.js. Elle évalue les conditions, marque les succès débloqués, exécute la rewardFn (qui peut modifier les variables de core.js ou skillEffects), et déclenche les mises à jour de l'UI.

    Interactions : Appelé par core.js pour la vérification périodique et par events.js pour la gestion des infobulles.

4. Flux de Données et Interactions Clés

Le jeu fonctionne sur une boucle principale (gameLoop dans core.js) qui coordonne les mises à jour de la logique et de l'interface.

    Initialisation (index.html -> core.js) :

        index.html charge tous les scripts.

        window.onload appelle core.js::initializeGame().

        initializeGame() charge la sauvegarde (loadGameState()), applique les effets de compétences (applyAllSkillEffects()), vérifie les déverrouillages (checkUnlockConditions()), met à jour l'affichage (ui.js::updateDisplay()), et démarre la boucle de jeu.

    Boucle de Jeu (core.js) :

        S'exécute à un intervalle régulier (gameTickInterval).

        Calcule la production de ressources (calculateTotalBPS()).

        Met à jour les coûts (updateCosts()).

        Exécute les automatisations actives (automation.js::runAutomation()).

        Vérifie les conditions de déverrouillage (checkUnlockConditions()).

        Met à jour la progression des quêtes (quests.js::updateQuestProgress()).

        Vérifie les succès (achievements.js::checkAchievements()).

        Applique tous les effets de compétences/bonus (applyAllSkillEffects()).

        Met à jour l'affichage (ui.js::updateDisplay()) à un intervalle plus lent (displayUpdateInterval).

        Sauvegarde le jeu (saveGameState()) à un intervalle régulier (saveCheckInterval).

    Interactions Utilisateur (events.js -> Logique/UI) :

        events.js écoute les clics sur les boutons (ex: #acheterEleveButton, #ascensionTitleButton, #studiesTabBtn).

        Lors d'un clic, events.js délègue l'action à la fonction appropriée :

            Achats : studies.js::performStudyPurchase(), ascension.js::performAscension(), prestige.js::performPrestige(), prestige.js::performPrestigePurchase(), automation.js::toggleAutomation(), skills.js::purchaseSkill().

            Navigation : ui.js::openTab().

            Paramètres : settings.js::toggleTheme(), settings.js::toggleOfflineProgress(), settings.js::toggleMinimizeResources(), settings.js::openStats().

            Réinitialisations : core.js::hardResetGame().

            Quêtes/Succès : quests.js::claimQuestReward(), achievements.js::toggleAchievementTooltip().

        Ces fonctions de logique mettent à jour l'état dans core.js, puis appellent ui.js::updateDisplay() ou des fonctions d'UI spécifiques pour rafraîchir l'interface.

    Mises à Jour d'Affichage (ui.js) :

        ui.js::updateDisplay() est le point central pour rafraîchir l'interface.

        Elle lit toutes les variables d'état de core.js et les données de data.js.

        Elle manipule les éléments DOM de index.html pour afficher les quantités, les coûts, les bonus, et la visibilité des sections.

        Elle appelle des fonctions de rendu spécifiques (renderSkillsMenu(), renderQuests(), renderAchievements()) pour les menus dynamiques.

        Elle utilise style.css via l'application de classes CSS pour styliser les éléments.

    Persistance des Données (core.js) :

        saveGameState() sérialise l'état du jeu (y compris les objets Decimal convertis en chaînes) dans le localStorage.

        loadGameState() désérialise les données du localStorage et initialise les variables d'état, gérant la rétrocompatibilité.

5. Mécaniques de Jeu Principales
Progression Standard (Études)

    Ressource Principale : bonsPoints (BP).

    Unités de Production : eleves (Élèves), classes (Classes), images (Images), Professeur (Professeurs).

    Définition : data.js (initialCosts, baseProductions).

    Logique d'Achat/Production : studies.js.

    Interaction : Clic sur le bouton "Étudier sagement" (studies.js::handleStudyClick()), achats d'unités (studies.js::performStudyPurchase()).

Automatisation

    Coût : ascensionPoints (PA).

    Unités Automatisables : Élèves, Classes, Images, Professeurs.

    Définition : Coûts de base dans automation.js.

    Logique : automation.js (toggleAutomation(), runAutomation()).

    Interaction : Clic sur les boutons d'automatisation dans la section "Automatisation".

Arbre de Compétences

    Monnaie : studiesSkillPoints, ascensionSkillPoints, prestigeSkillPoints.

    Catégories : Études, Ascension, Prestige.

    Définition : data.js (skillsData). Chaque compétence a un cost, maxLevel, prerequisites et un effect (fonction qui modifie core.js::skillEffects).

    Logique d'Achat/Effets : skills.js (purchaseSkill()).

    Rendu UI : ui.js (renderSkillsMenu(), renderSkillPanel()).

    Interaction : Clic sur les compétences dans le menu "Compétences".

Ascension

    Type : Soft Reset.

    Réinitialise : bonsPoints, images, eleves, classes, professeur, totalClicks, studiesSkillLevels, studiesSkillPoints, quêtes non permanentes.

    Conserve : ascensionPoints, ascensionCount, totalPAEarned, déverrouillages majeurs, progrès de Prestige.

    Gain : ascensionPoints (PA) basé sur bonsPointsTotal.

    Condition de Déblocage : Atteindre un certain nombre de Professeurs (5 par défaut).

    Définition : data.js (ASCENSION_POINT_THRESHOLD, initialCosts pour les structures d'ascension).

    Logique : ascension.js (calculatePAGained(), performAscension(), fonctions de coût des structures d'ascension).

    Structures d'Ascension : Écoles, Lycées, Collèges (achétés avec PA, définis dans data.js, logiques dans ascension.js).

    Interaction : Clic sur le bouton "Ascension" dans le menu "Ascension".

Prestige

    Type : Super Soft Reset (plus profond que l'Ascension).

    Réinitialise : Presque tout comme l'Ascension, plus les ascensionPoints, ascensionCount, ascensionSkillLevels, ascensionSkillPoints, quêtes non permanentes.

    Conserve : prestigePoints, prestigeCount, totalPAEarned (pour le calcul des PP), achats de Prestige.

    Gain : prestigePoints (PP) basé sur totalPAEarned.

    Condition de Déblocage : Atteindre un certain seuil de totalPAEarned.

    Définition : data.js (PRESTIGE_POINT_THRESHOLD, prestigePurchasesData).

    Logique : prestige.js (calculatePPGained(), performPrestige(), performPrestigePurchase(), fonctions de coût des achats de prestige).

    Achats de Prestige : Licences, Master 1, Master 2, Doctorat, Post-Doctorat (achétés avec PP, définis dans data.js, logiques dans prestige.js). Ces achats fournissent des bonus permanents (effect modifie core.js::skillEffects).

    Interaction : Clic sur le bouton "Prestige" dans le menu "Prestige".

Quêtes

    Objectif : Fournir des objectifs à court et moyen terme.

    Définition : data.js (questsData). Chaque quête a une condition (fonction qui lit l'état du jeu) et une reward (type et montant).

    Logique : quests.js (updateQuestProgress(), claimQuestReward()).

    Rendu UI : ui.js (renderQuests()).

    Récompenses : Peuvent inclure des multiplicateurs de gain de PA (paMultiplierFromQuests dans core.js).

    Interaction : Section "Quêtes", clic sur les quêtes terminées pour réclamer les récompenses.

Succès

    Objectif : Encourager la progression et offrir des bonus permanents.

    Définition : achievements.js (achievementsData). Chaque succès a une condition (fonction) et une rewardFn (fonction qui modifie core.js::skillEffects ou des variables de ressources).

    Logique : achievements.js (checkAchievements()).

    Rendu UI : ui.js (renderAchievements()), achievements.js (gestion des infobulles).

    Récompenses : Peuvent inclure des bonus permanents aux BP/s (permanentBpsBonusFromAchievements dans core.js).

    Interaction : Section "Succès", survol/clic pour voir les détails via infobulles.

Paramètres

    Options : Thème visuel (jour/nuit), progression hors ligne, affichage minimaliste des ressources, statistiques.

    Définition : Variables de paramètres dans core.js.

    Logique : settings.js (toggleTheme(), toggleOfflineProgress(), toggleMinimizeResources(), openStats()).

    Rendu UI : ui.js (updateSettingsButtonStates(), updateThemeAndModeDisplay(), openStatsModal()).

    Interaction : Section "Paramètres", interaction avec les contrôles (sélecteur, cases à cocher, boutons).

6. Bonnes Pratiques de Développement

    Modularité : Chaque fichier a une responsabilité claire. Évitez d'ajouter de la logique métier dans ui.js ou des manipulations DOM directes dans les modules de logique.

    Decimal pour les Nombres : Toujours utiliser la bibliothèque Decimal pour toutes les quantités, coûts, productions et multiplicateurs qui peuvent devenir très grands. N'utilisez jamais les opérateurs arithmétiques natifs de JavaScript sur ces variables.

    Séparation des Préoccupations :

        data.js est pour les constantes.

        core.js est pour l'état global et la logique centrale.

        Les modules spécifiques sont pour la logique d'une mécanique donnée.

        ui.js est pour l'affichage.

        events.js est pour les écouteurs d'événements.

    Communication entre Modules : Utilisez les imports/exports (export let, import { ... } from './module.js') pour partager les variables et fonctions. Évitez les variables globales implicites (sauf pour Decimal qui est globalement chargé).

    Gestion du DOM : Centralisez les manipulations DOM dans ui.js. Les autres modules devraient appeler des fonctions de ui.js pour demander des mises à jour d'affichage.

    Persistance : Assurez-vous que toutes les variables d'état importantes sont incluses dans saveGameState() et loadGameState() dans core.js.

    Rétrocompatibilité : Lors de l'ajout de nouvelles variables d'état, assurez-vous que loadGameState() peut gérer les anciennes sauvegardes qui ne contiennent pas encore ces variables (en leur assignant des valeurs par défaut).

    Commentaires : Maintenez les commentaires à jour, en particulier pour les variables d'état, les fonctions complexes et les interactions entre modules.

En suivant cette documentation, vous devriez être en mesure de comprendre le fonctionnement de MonJeuIncremental et d'apporter des modifications ciblées sans introduire d'effets de bord inattendus. Bonne chance !