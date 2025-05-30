MonJeuIncremental

Bienvenue dans le README de "MonJeuIncremental" ! Ce document a pour but de vous fournir une vue d'ensemble complète du jeu, de son architecture technique, de ses mécaniques de jeu et de la manière dont les différents composants interagissent.

A propos du Jeu

"MonJeuIncremental" est un jeu incrémental (Idle Game) où le joueur progresse en accumulant des "Bons Points" (BP) et d'autres ressources. Le jeu se déroule autour d'un thème éducatif, avec des unités comme les Eleves, les Classes, les Images et les Professeurs qui generent des ressources. La progression est ponctuee par des systemes de reinitialisation douce (Ascension) et profonde (Prestige), des arbres de competences, de l'automatisation, des quetes et des succes, offrant une profondeur strategique croissante.

Objectif du Jeu

L'objectif principal est de generer autant de Bons Points que possible, de debloquer de nouvelles mecaniques et d'optimiser sa production a travers les differentes couches de progression.

Mecaniques Cles

    Production de Bons Points (BP):

        Clic: Le bouton "Etudier sagement" genere des BP instantanement, avec un bonus base sur la production de BP/s.

        Unites d'Etudes: Eleves, Classes, Images, Professeurs generent des BP ou des multiplicateurs de production au fil du temps.

    Ressources et Achats:

        Bons Points (BP): Monnaie principale pour la plupart des achats.

        Images: Ressource secondaire pour acheter des Professeurs.

        Points d'Ascension (PA): Monnaie obtenue via l'Ascension, utilisee pour des ameliorations permanentes.

        Points de Prestige (PP): Monnaie obtenue via le Prestige, utilisee pour des ameliorations encore plus puissantes et permanentes.

        Points de Competence (PC): Utilises pour debloquer des competences dans les arbres d'Etudes, d'Ascension et de Prestige.

    Progression et Reinitialisations:

        Ascension: Un "soft reset" qui reinitialise la plupart des ressources et unites (sauf les PA et leurs bonus) en echange de Points d'Ascension. Debloquee apres avoir acquis 5 Professeurs.

        Prestige: Un "hard reset" qui reinitialise presque tout (y compris les PA et leurs bonus, mais pas les PP et leurs achats) en echange de Points de Prestige. Debloquee apres avoir gagne un certain nombre de PA.

    Arbres de Competences:

        Trois arbres distincts (Etudes, Ascension, Prestige) offrant des bonus permanents ou semi-permanents. Les competences sont achetees avec des Points de Competence specifiques a chaque arbre.

    Automatisation:

        Permet d'acheter automatiquement des unites d'etudes (Eleves, Classes, Images, Professeurs) en continu, moyennant un cout en Points d'Ascension.

    Quetes:

        Des objectifs specifiques a accomplir pour gagner des recompenses (points de competence, multiplicateurs).

    Succes:

        Des jalons a atteindre pour des recompenses permanentes (bonus de BP/s).

    Parametres:

        Options pour personnaliser l'experience de jeu (theme jour/nuit, progression hors ligne, affichage minimaliste des ressources).

Architecture du Projet

Le jeu est structure en plusieurs fichiers JavaScript modulaires, chacun ayant une responsabilite specifique.

MonJeuIncremental/
├── index.html              # Structure HTML de base
├── style.css               # Styles CSS
├── break_infinity.min.js   # Bibliotheque pour les grands nombres
├── core.js                 # Fonctions principales, boucle de jeu, etat global
├── data.js                 # Donnees du jeu (couts, definitions, etc.)
├── ui.js                   # Gestion de l'interface utilisateur
├── events.js               # Gestion des evenements DOM
├── studies.js              # Logique des etudes (Eleves, Classes, Images, Professeurs)
├── automation.js           # Logique de l'automatisation
├── skills.js               # Logique des competences
├── ascension.js            # Logique de l'ascension
├── prestige.js             # Logique du prestige
├── settings.js             # Parametres du jeu
├── quests.js               # Logique des quetes
├── achievements.js         # Logique des succes
├── README.md               # Ce document
└── assets/                 # (Optionnel) Dossier pour les images, sons, etc.

Description Detaillee des Fichiers

index.html

    Description: Le point d'entree principal de l'application web. Il definit la structure HTML globale du jeu, inclut les feuilles de style CSS, les bibliotheques externes (break_infinity.min.js), et charge tous les fichiers JavaScript modulaires qui contiennent la logique du jeu. Il ne contient aucune logique JavaScript active, seulement les balises  pour charger les autres fichiers.

    Dependances:

        style.css: Fournit les styles visuels.

        break_infinity.min.js: Bibliotheque pour la gestion des grands nombres (doit etre charge en premier).

        core.js, data.js, ui.js, events.js, studies.js, automation.js, skills.js, ascension.js, prestige.js, settings.js, quests.js, achievements.js: Tous les modules JavaScript du jeu.

    Elements DOM Cles: Contient les conteneurs pour le menu lateral (#side-menu), le contenu principal (#main-content), l'affichage des ressources, les sections specifiques (#studiesMainContainer, #automationMainContainer, etc.), les notifications (#notifications-container) et les modales.

style.css

    Description: Le coeur de la presentation visuelle du jeu. Il definit l'apparence de tous les elements HTML, y compris la mise en page generale, les couleurs, la typographie, les transitions, et les styles specifiques pour les differents composants de l'interface utilisateur. Il inclut egalement des styles pour le theme jour/nuit et assure la reactivite de l'interface.

    Dependances: Charge par index.html. Applique des styles aux elements DOM definis dans index.html et manipules par les scripts JavaScript.

    Logique Generale: Utilise des selecteurs CSS pour cibler des elements HTML et leur appliquer des styles. Le theme nuit est gere par la classe dark-theme ajoutee dynamiquement au body via JavaScript.

break_infinity.min.js

    Description: Une bibliotheque JavaScript essentielle pour la gestion des tres grands nombres. Dans un jeu incremental, les valeurs peuvent rapidement depasser les limites de la precision des nombres flottants standards de JavaScript. Cette bibliotheque permet de manipuler des nombres arbitrairement grands avec precision.

    Dependances: Aucune dependance directe. Elle est chargee globalement par index.html et rend la classe Decimal disponible pour tous les autres modules JavaScript qui en ont besoin.

core.js

    Description: Le coeur de la logique du jeu. Il gere l'etat global du jeu (ressources, compteurs, deverrouillages), les fonctions essentielles de sauvegarde/chargement, les calculs de production, la gestion des achats, l'application des effets de competences/bonus, et la boucle de jeu principale.

    Dependances: Importe des fonctions et donnees de studies.js, automation.js, data.js, ascension.js, prestige.js, quests.js, achievements.js, ui.js.

    Variables Cles Exportees: bonsPoints, totalBonsPointsParSeconde, images, nombreEleves, nombreClasses, nombreProfesseur, ascensionPoints, prestigePoints, skillEffects, et de nombreux drapeaux de deverrouillage (elevesUnlocked, ascensionUnlocked, etc.).

    Fonctions Cles Exportees: formatNumber, performPurchase, saveGameState, loadGameState, resetGameVariables, hardResetGame, softResetGame, superSoftResetGame, updateCosts, calculateTotalBPS, checkUnlockConditions, applyAllSkillEffects, calculateOfflineProgress, initializeGame.

    Constantes: gameTickInterval, displayUpdateInterval, saveCheckInterval.

data.js

    Description: Le depot central de toutes les donnees statiques et de configuration du jeu. Il contient les valeurs de base pour les couts, les productions, les definitions completes des arbres de competences, les details des achats de Prestige, les definitions des quetes et des succes, et d'autres constantes ou seuils importants.

    Dependances: Depend de break_infinity.min.js pour la classe Decimal.

    Variables Cles Exportees: initialCosts (couts de base), baseProductions (productions de base), skillsData (definitions des competences), prestigePurchasesData (definitions des achats de prestige), questsData (definitions des quetes), bonusPointThresholds (seuils de BP pour les points de competence), prime_PA, ASCENSION_POINT_THRESHOLD.

    Origine des Constantes: Toutes les valeurs numeriques de base (couts initiaux, productions) sont definies ici. Les multiplicateurs et reductions dynamiques sont ensuite appliques a ces bases dans les modules de logique (ex: studies.js, core.js) en fonction des competences, ascensions, etc.

ui.js

    Description: Dedie a la gestion de l'interface utilisateur. Il est responsable de la mise a jour de l'affichage de toutes les ressources, des etats des boutons, de la visibilite des sections, des notifications, et du rendu des menus dynamiques (competences, quetes, succes).

    Dependances: Importe des variables d'etat et fonctions de core.js, data.js, studies.js, automation.js, skills.js, ascension.js, prestige.js.

    Fonctions Cles Exportees: updateDisplay, showNotification, updateSectionVisibility, updateMultiplierButtons, updateAutomationButtonStates, updateSettingsButtonStates, renderSkillsMenu, renderQuests, renderAchievements, showAchievementTooltip, hideAchievementTooltip, toggleAchievementTooltip, openTab, openStatsModal, closeStatsModal, updateStatsDisplay.

events.js

    Description: Gere tous les ecouteurs d'evenements (clics, changements) de l'interface utilisateur. Son role est d'attacher des gestionnaires d'evenements aux elements DOM et d'appeler les fonctions de logique de jeu appropriees definies dans d'autres modules. Il sert de "colle" entre l'interface et le backend.

    Dependances: Depend de la disponibilite globale des variables et fonctions de core.js, data.js, ui.js, studies.js, automation.js, skills.js, ascension.js, prestige.js, settings.js, quests.js, achievements.js.

    Logique Generale: Initialise tous les ecouteurs d'evenements une fois que le DOM est completement charge.

studies.js

    Description: Encapsule toute la logique specifique aux achats et a la production lies aux etudes (Eleves, Classes, Images, Professeurs). Il gere les calculs de production de Bons Points, la logique d'achat pour ces unites, ainsi que la gestion du clic principal "Etudier sagement".

    Dependances: Importe des variables d'etat et fonctions de core.js, data.js, ui.js.

    Fonctions Cles Exportees: calculateNextEleveCost, calculateNextClasseCost, calculateNextImageCost, calculateNextProfessorCost, elevesBpsPerItem, classesBpsPerItem, calculateStudiesBPS, handleStudyClick, performStudyPurchase, updateStudiesButtonStates, updateStudiesSectionVisibility.

automation.js

    Description: Gere toute la logique et les fonctionnalites liees a l'automatisation des achats. Il permet d'activer/desactiver l'automatisation pour les unites d'etudes, de calculer les couts associes, et de declencher les achats automatiques a chaque tick de jeu.

    Dependances: Importe des variables d'etat et fonctions de core.js, ui.js.

    Fonctions Cles Exportees: calculateAutomationCost, runAutomation, toggleAutomation.

skills.js

    Description: Gere toute la logique et les fonctionnalites liees aux competences (Skills). Il permet l'achat de competences dans differentes categories (Etudes, Ascension, Prestige), gere les points de competence requis, applique les effets des competences, et met a jour l'interface utilisateur du menu des competences.

    Dependances: Importe des variables d'etat et fonctions de core.js, data.js, ui.js.

    Fonctions Cles Exportees: purchaseSkill, updateSkillsUI, renderSkillsMenu.

ascension.js

    Description: Gere toute la logique et les fonctionnalites liees au mecanisme d'Ascension. L'Ascension est un "soft reset" qui reinitialise une partie de la progression en echange de Points d'Ascension (PA).

    Dependances: Importe des variables d'etat et fonctions de core.js, data.js, ui.js.

    Fonctions Cles Exportees: calculatePotentialAscensionPoints, performAscension, updateAscensionUI, updateAscensionButtonStates.

prestige.js

    Description: Gere toute la logique et les fonctionnalites liees au mecanisme de Prestige. Le Prestige est la reinitialisation la plus profonde, permettant de gagner des Points de Prestige (PP) en echange d'une reinitialisation de la plupart des progres, y compris les Points d'Ascension. Les PP sont utilises pour des ameliorations permanentes.

    Dependances: Importe des variables d'etat et fonctions de core.js, data.js, ui.js.

    Fonctions Cles Exportees: calculatePotentialPrestigePoints, performPrestige, performPrestigePurchase, updatePrestigeUI, updatePrestigeButtonStates, renderPrestigePurchases.

settings.js

    Description: Gere la logique des differentes options de parametres du jeu (theme, progression hors ligne, affichage minimaliste des ressources, ouverture de la modale des statistiques).

    Dependances: Importe des variables d'etat et fonctions de core.js, ui.js.

    Fonctions Cles Exportees: toggleTheme, toggleOfflineProgress, toggleMinimizeResources, openStats.

quests.js

    Description: Gere toute la logique et les fonctionnalites liees aux quetes. Il permet de definir les quetes, de verifier leurs conditions de completion, de distribuer les recompenses et de mettre a jour l'interface utilisateur du journal des quetes.

    Dependances: Importe des variables d'etat et fonctions de core.js, data.js, ui.js.

    Fonctions Cles Exportees: checkQuests, claimQuestReward, updateQuestsUI, renderQuests.

achievements.js

    Description: Gere toute la logique liee aux succes du jeu, y compris leur definition, la verification des conditions de deverrouillage, l'application des recompenses, le rendu de l'interface des succes et la gestion des infobulles.

    Dependances: Depend de la disponibilite globale des variables et fonctions de core.js, ui.js, data.js.

    Variables Cles Exportees: achievementsData, unlockedAchievements, permanentBpsBonusFromAchievements, activeAchievementTooltip.

    Fonctions Cles Exportees: renderAchievements, checkAchievements, showAchievementTooltip, hideAchievementTooltip, toggleAchievementTooltip.

Feuille de Route / Ameliorations Futures (Exemples)

    Nouvelles Couches de Contenu: Ajouter de nouvelles mecaniques de jeu apres le Prestige (ex: "Reincarnation", "Dimension").

    Evenements Temporaires: Implementer des evenements en jeu avec des bonus et des recompenses uniques.

    Arbres de Competences Etendus: Ajouter de nouvelles competences et tiers aux arbres existants.

    Personnalisation Visuelle: Plus d'options de theme ou de personnalisation de l'interface.

    Statistiques Avancees: Des graphiques et des statistiques plus detaillees pour suivre la progression.

    Multijoueur (experimental): Une fonctionnalite de classement ou de cooperation legere.

    Optimisation des Performances: Ameliorer la fluidite du jeu pour les tres grands nombres et les longues parties.

Ce README fournit une base solide pour comprendre et contribuer a "MonJeuIncremental". N'hesitez pas a explorer le code et a proposer des ameliorations !