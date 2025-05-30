// ------------------ Fiche Mémo : ui.js ----------------------------
//
// Description : Ce fichier est dédié à la gestion complète de l'interface utilisateur (UI) du jeu.
// Son rôle principal est de traduire l'état interne du jeu (géré par `core.js` et d'autres modules
// de logique) en une représentation visuelle interactive pour le joueur. Il est responsable
// de la mise à jour de l'affichage de toutes les ressources, des états des boutons,
// de la visibilité des sections et des onglets, de l'affichage des notifications,
// et du rendu dynamique des menus complexes comme l'arbre de compétences, les quêtes et les succès.
//
// Objectif : Fournir une couche de présentation robuste et réactive, assurant que l'interface
// utilisateur reflète fidèlement l'état actuel du jeu et permet des interactions fluides,
// sans contenir de logique de jeu métier (calculs de production, achats, réinitialisations).
//
// ------------------ Dépendances (Imports) ------------------
//
// Ce module importe des variables d'état et des fonctions depuis d'autres fichiers JavaScript.
//
// - De './core.js' :
//   - Variables d'état : `bonsPoints`, `totalBonsPointsParSeconde`, `images`, `nombreEleves`,
//     `nombreClasses`, `nombreProfesseur`, `schoolCount`, `nombreLycees`, `nombreColleges`,
//     `ascensionPoints`, `ascensionCount`, `totalPAEarned`, `ascensionBonus`, `prestigePoints`,
//     `prestigeCount`, `totalClicks`, `currentPurchaseMultiplier`, `autoEleveActive`,
//     `autoClasseActive`, `autoImageActive`, `autoProfesseurActive`, `studiesSkillPoints`,
//     `ascensionSkillPoints`, `prestigeSkillPoints`, `studiesSkillLevels`, `ascensionSkillLevels`,
//     `prestigeSkillLevels`, `secretSkillClicks`, `offlineProgressEnabled`, `minimizeResourcesActive`,
//     `disableAscensionWarning`, `firstAscensionPerformed`, `disablePrestigeWarning`,
//     `nombreLicences`, `nombreMaster1`, `nombreMaster2`, `nombreDoctorat`, `nombrePostDoctorat`,
//     `skillEffects`, `permanentBpsBonusFromAchievements`, `paMultiplierFromQuests`.
//   - Flags de déverrouillage : `elevesUnlocked`, `classesUnlocked`, `imagesUnlocked`, `ProfesseurUnlocked`,
//     `ascensionUnlocked`, `prestigeUnlocked`, `skillsButtonUnlocked`, `settingsButtonUnlocked`,
//     `automationCategoryUnlocked`, `questsUnlocked`, `achievementsButtonUnlocked`, `newSettingsUnlocked`,
//     `multiPurchaseOptionUnlocked`, `maxPurchaseOptionUnlocked`, `statsButtonUnlocked`,
//     `prestigeMenuButtonUnlocked`, `ascensionMenuButtonUnlocked`, `lyceesUnlocked`, `collegesUnlocked`,
//     `studiesSkillsUnlocked`, `ascensionSkillsUnlocked`, `prestigeSkillsUnlocked`.
//   - Fonctions utilitaires/de calcul : `formatNumber` (utilisée pour l'affichage numérique),
//     `applyAllSkillEffects`, `updateCachedMultipliers`, `calculateTotalBPS`, `checkUnlockConditions`,
//     `updateButtonStates`,`themeOptionUnlocked`.
//   - Multiplicateurs de structures d'ascension : `ecoleMultiplier`, `lyceeMultiplier`, `collegeMultiplier`.
//   Impact : Fournit toutes les données dynamiques et les fonctions de base pour que l'UI puisse
//            afficher l'état actuel du jeu et réagir aux changements.
//
// - De './studies.js' :
//   - Fonctions de calcul de coût : `calculateNextEleveCost`, `calculateNextClasseCost`,
//     `calculateNextImageCost`, `calculateNextProfessorCost`.
//   - Valeurs de production de base : `elevesBpsPerItem`, `classesBpsPerItem`.
//   Impact : Permet à `ui.js` d'afficher les coûts actuels des achats d'études et leurs productions.
//
// - De './automation.js' :
//   - Fonction de calcul de coût : `calculateAutomationCost`.
//   Impact : Permet d'afficher les coûts d'activation/désactivation de l'automatisation.
//
// - De './data.js' :
//   - Données statiques : `skillsData` (définitions des compétences), `prestigePurchasesData`
//     (définitions des achats de prestige), `questsData` (définitions des quêtes),
//     `achievementsData` (définitions des succès).
//   Impact : Fournit les structures de données nécessaires pour rendre les menus dynamiques
//            (compétences, quêtes, succès, prestige).
//
// - De './ascension.js' :
//   - Fonctions de calcul de coût : `calculateNextEcoleCost`, `calculateNextLyceeCost`,
//     `calculateNextCollegeCost`.
//   Impact : Permet d'afficher les coûts des achats d'ascension.
//
// - De './prestige.js' :
//   - Fonctions de calcul de coût : `calculateLicenceCost`, `calculateMaster1Cost`,
//     `calculateMaster2Cost`, `calculateDoctoratCost`, `calculatePostDoctoratCost`.
//   - Fonction utilitaire : `getPrestigeBonusMultiplier`.
//   Impact : Permet d'afficher les coûts des achats de prestige et leurs bonus.
//
// - De './skills.js' :
//   - Fonction d'action : `buySkill`.
//   Impact : Permet à `ui.js` de déclencher l'achat d'une compétence via `handleSkillClick`.
//
// - De './settings.js' :
//   - Variables d'état : `isDayTheme`.
//   Impact : Permet à `ui.js` de mettre à jour l'affichage des contrôles de thème et de mode.
//
// - De './quests.js' : (maj 30/05 Quete)
//   - Fonctions : `renderQuests` (pour le rendu des quêtes), `updateQuestsUI` (pour la mise à jour des compteurs de quêtes). (maj 30/05 Quete)
//   Impact : Permet de gérer le rendu et la mise à jour de l'interface des quêtes. (maj 30/05 Quete)
//
// - `break_infinity.min.js` : La bibliothèque `Decimal` est supposée être globalement disponible.
//   Impact : Essentielle pour tous les calculs et affichages de nombres très grands.
//
// ------------------ Variables Clés (utilisées par ui.js, mais définies ailleurs et importées) ------------------
//
// Ce module ne définit pas de variables d'état globales, mais utilise celles importées.
//
// - `bonsPoints`, `images`, `nombreEleves`, `nombreClasses`, `nombreProfesseur` : Quantités des ressources principales.
// - `totalBonsPointsParSeconde` : Production actuelle de BP/s.
// - `ascensionPoints`, `ascensionCount`, `totalPAEarned`, `ascensionBonus` : Données liées à l'Ascension.
// - `prestigePoints`, `prestigeCount` : Données liées au Prestige.
// - `schoolCount`, `nombreLycees`, `nombreColleges` : Quantités des structures d'Ascension.
// - `nombreLicences`, `nombreMaster1`, `nombreMaster2`, `nombreDoctorat`, `nombrePostDoctorat` : Quantités des achats de Prestige.
// - `totalClicks` : Nombre total de clics.
// - `currentPurchaseMultiplier` : Multiplicateur d'achat sélectionné (x1, x10, x100, max).
// - `isDayTheme`, `minimizeResourcesActive`, `offlineProgressEnabled`, `themeOptionUnlocked` : États des paramètres du jeu.
// - `autoEleveActive`, `autoClasseActive`, `autoImageActive`, `autoProfesseurActive` : États des automatisations.
// - `elevesUnlocked`, `classesUnlocked`, `imagesUnlocked`, `ProfesseurUnlocked`, `ascensionUnlocked`,
//   `prestigeUnlocked`, `skillsButtonUnlocked`, `settingsButtonUnlocked`, `automationCategoryUnlocked`,
//   `questsUnlocked`, `achievementsButtonUnlocked`, `newSettingsUnlocked`, `multiPurchaseOptionUnlocked`,
//   `maxPurchaseOptionUnlocked`, `statsButtonUnlocked`, `prestigeMenuButtonUnlocked`, `ascensionMenuButtonUnlocked`,
//   `lyceesUnlocked`, `collegesUnlocked`, `studiesSkillsUnlocked`, `ascensionSkillsUnlocked`, `prestigeSkillsUnlocked` :
//   Flags booléens indiquant si une fonctionnalité ou section est déverrouillée et visible.
// - `studiesSkillPoints`, `ascensionSkillPoints`, `prestigeSkillPoints` : Points de compétence disponibles.
// - `studiesSkillLevels`, `ascensionSkillLevels`, `prestigeSkillLevels` : Objets contenant les niveaux actuels des compétences.
// - `secretSkillClicks` : Compteur de clics pour la compétence secrète.
// - `unlockedAchievements` : Objet des succès débloqués.
// - `permanentBpsBonusFromAchievements` : Bonus de BP/s permanent des succès.
// - `paMultiplierFromQuests` : Multiplicateur de gain de PA provenant des quêtes.
// - `skillEffects` : Objet global agrégant tous les bonus et réductions de coûts des compétences, succès et prestige.
// - `ecoleMultiplier`, `lyceeMultiplier`, `collegeMultiplier` : Multiplicateurs de production des structures d'ascension.
//
// ------------------ Fonctions Clés (définies et exportées par ui.js) ------------------
//
// - `updateDisplay()` :
//   Description : Fonction principale de rafraîchissement de l'interface.
//   Elle met à jour l'affichage de toutes les ressources (BP, Images, Professeurs, PA, PP),
//   les quantités des structures (Élèves, Classes, Écoles, Lycées, Collèges, Licences, etc.),
//   les coûts des achats, et les bonus actifs. Elle gère également la visibilité des sections
//   liées aux ressources et aux achats en fonction des déverrouillages.
//   Appelée par : `core.js` (boucle de jeu), `events.js` (après actions utilisateur),
//                 `openTab` (lors du changement d'onglet).
//   Impact : Assure que l'intégralité de l'interface est toujours synchronisée avec l'état du jeu.
//
// - `showNotification(message, type = 'info', duration = 5000)` :
//   Description : Affiche une notification pop-up temporaire en bas à droite de l'écran.
//   - `message` (string) : Le texte de la notification.
//   - `type` (string) : Le type de notification ('info', 'success', 'warning', 'error'),
//     qui applique des styles CSS spécifiques.
//   - `duration` (number) : La durée d'affichage en millisecondes.
//   Appelée par : `core.js` (sauvegarde/chargement, réinitialisations), `studies.js` (achats),
//                 `automation.js` (activation/désactivation auto), `skills.js` (achat de compétences),
//                 `ascension.js` (ascension), `prestige.js` (prestige, achats de prestige),
//                 `quests.js` (réclamation de quêtes), `achievements.js` (déverrouillage de succès).
//   Impact : Fournit un feedback visuel au joueur pour les actions importantes.
//
// - `updateSectionVisibility()` :
//   Description : Contrôle la propriété `display` des principaux conteneurs HTML
//   (onglets du menu latéral, sections d'achat, options de paramètres)
//   en fonction des flags de déverrouillage (`...Unlocked`).
//   Appelée par : `core.js` (après `checkUnlockConditions`), `initializeGame` (au démarrage),
//                 `openTab` (pour s'assurer que les sections correctes sont visibles).
//   Impact : Gère l'accès progressif aux fonctionnalités du jeu.
//
// - `updateMultiplierButtons()` :
//   Description : Met à jour l'état visuel des boutons de sélection du multiplicateur d'achat
//   (x1, x10, x100, xMax) en ajoutant/retirant la classe 'active'.
//   Appelée par : `updateDisplay`.
//   Impact : Indique clairement le multiplicateur d'achat actuellement sélectionné.
//
// - `updateAutomationButtonStates()` :
//   Description : Met à jour le texte et les classes CSS (`automation-active`, `can-afford`, `cannot-afford`)
//   des boutons d'activation/désactivation de l'automatisation.
//   Appelée par : `updateDisplay`.
//   Impact : Reflète l'état (actif/inactif) et le coût des automatisations.
//
// - `updateSettingsButtonStates()` :
//   Description : Met à jour le texte et les classes CSS des boutons et sélecteurs
//   liés aux paramètres du jeu (thème, réinitialisation, ressources minimalistes, statistiques).
//   Appelée par : `updateDisplay`, `openTab` (lors de l'ouverture de l'onglet paramètres).
//   Impact : Assure que les contrôles des paramètres sont à jour.
//
// - `updateThemeAndModeDisplay()` : (maj 30/05 - Thème & style)
//   Description : Spécifiquement dédiée à la mise à jour de l'état visuel
//   du sélecteur de thème (`#themeSelector`) et des boutons de mode Jour/Nuit
//   (`dayModeButton`, `nightModeButton`). Elle lit l'état de `isDayTheme` et
//   `themeOptionUnlocked` de `settings.js` pour appliquer les classes 'active'
//   et la valeur sélectionnée.
//   Appelée par : `updateSettingsButtonStates`.
//   Impact : Gère l'affichage correct des options de personnalisation visuelle.
//
// - `renderSkillsMenu()` :
//   Description : Orchestre le rendu complet des trois panneaux de l'arbre de compétences
//   (études, ascension, prestige). Elle contrôle la visibilité de chaque panneau
//   et met à jour les points de compétence disponibles avant d'appeler `renderSkillPanel`
//   pour chaque catégorie.
//   Appelée par : `openTab` (lors de l'ouverture de l'onglet compétences).
//   Impact : Construit et rafraîchit l'arbre de compétences.
//
// - `renderSkillPanel(panelType, gridElement, skillLevels, skillPoints, isPanelUnlocked)` :
//   Description : Rend un panneau de compétences spécifique (études, ascension ou prestige).
//   Elle efface le contenu précédent, itère sur les compétences définies dans `skillsData`
//   pour le `panelType` donné, et crée dynamiquement les éléments HTML pour chaque compétence,
//   en appliquant les classes CSS (`locked`, `unlocked`, `max-level`) et en générant les infobulles.
//   - `panelType` (string) : Le type de panneau ('studies', 'ascension', 'prestige').
//   - `gridElement` (HTMLElement) : L'élément DOM parent où les compétences seront rendues.
//   - `skillLevels` (Object) : L'objet des niveaux de compétences actuels pour ce panneau.
//   - `skillPoints` (Decimal) : Les points de compétence disponibles.
//   - `isPanelUnlocked` (boolean) : Indique si le panneau doit être rendu.
//   Appelée par : `renderSkillsMenu`.
//   Impact : Gère l'affichage détaillé de chaque compétence dans son arbre.
//
// - `handleSkillClick(panelType, skillId)` :
//   Description : Fonction de gestionnaire de clic pour les compétences.
//   Elle appelle la fonction `buySkill` du module `skills.js` pour exécuter la logique d'achat.
//   - `panelType` (string) : Le type de panneau de compétences.
//   - `skillId` (string) : L'ID de la compétence cliquée.
//   Appelée par : `events.js` (via délégation d'événements sur les grilles de compétences).
//   Impact : Point d'entrée pour l'interaction du joueur avec l'arbre de compétences.
//
// - `renderQuests()` :
//   Description : Rend la liste des quêtes actives et terminées.
//   Elle itère sur `questsData`, crée les éléments HTML pour chaque quête,
//   affiche sa description, sa progression actuelle, et sa récompense.
//   Elle ajoute la classe 'completed' si la quête est terminée.
//   Appelée par : `openTab` (lors de l'ouverture de l'onglet quêtes).
//   Impact : Affiche les objectifs et la progression du joueur.
//
// - `renderAchievements()` :
//   Description : Rend la grille des succès.
//   Elle itère sur `achievementsData`, crée les éléments HTML pour chaque succès,
//   affiche son nom, sa description et sa récompense. Elle applique la classe 'unlocked'
//   si le succès a déjà été débloqué.
//   Appelée par : `openTab` (lors de l'ouverture de l'onglet succès), `achievements.js`
//                 (après le déverrouillage d'un succès).
//   Impact : Affiche les succès débloqués et à débloquer.
//
// - `showAchievementTooltip(event, ach)` :
//   Description : Affiche une infobulle détaillée pour un succès au survol de la souris.
//   Positionne l'infobulle près du curseur.
//   - `event` (Event) : L'événement de la souris.
//   - `ach` (Object) : L'objet succès.
//   Appelée par : `events.js` (via délégation d'événements sur la grille des succès).
//   Impact : Fournit des informations contextuelles sur les succès.
//
// - `hideAchievementTooltip()` :
//   Description : Masque l'infobulle des succès.
//   Appelée par : `events.js`, `openTab` (lors du changement d'onglet).
//   Impact : Gère la visibilité de l'infobulle.
//
// - `toggleAchievementTooltip(event, ach)` :
//   Description : Bascule la visibilité de l'infobulle d'un succès au clic.
//   Permet de "figer" l'infobulle pour qu'elle reste visible après le `mouseout`.
//   - `event` (Event) : L'événement de clic.
//   - `ach` (Object) : L'objet succès.
//   Appelée par : `events.js` (via délégation d'événements sur la grille des succès).
//   Impact : Améliore l'expérience utilisateur pour l'exploration des succès.
//
// - `openTab(tabContainer)` :
//   Description : Fonction générique pour ouvrir une section principale du jeu (un onglet)
//   et masquer toutes les autres. Elle déclenche également un rafraîchissement spécifique
//   pour certains onglets (compétences, quêtes, succès, paramètres). (maj 30/05 Quete)
//   - `tabContainer` (HTMLElement) : L'élément DOM du conteneur de la section à ouvrir.
//   Appelée par : `events.js` (clics sur les boutons du menu latéral).
//   Impact : Gère la navigation entre les différentes vues du jeu.
//
// - `openStatsModal()` :
//   Description : Ouvre la modale des statistiques et appelle `updateStatsDisplay()`
//   pour s'assurer que son contenu est à jour.
//   Appelée par : `events.js` (clic sur le bouton "Statistiques").
//   Impact : Affiche une vue détaillée des statistiques du joueur.
//
// - `closeStatsModal()` :
//   Description : Ferme la modale des statistiques.
//   Appelée par : `events.js` (clic sur le bouton de fermeture de la modale).
//   Impact : Masque la modale des statistiques.
//
// - `updateStatsDisplay()` :
//   Description : Met à jour toutes les valeurs numériques et textuelles affichées
//   dans la modale des statistiques. Elle récupère les données des variables d'état
//   globales et des objets d'effets (`skillEffects`, `prestigePurchasesData`)
//   pour présenter un résumé complet de la progression et des bonus du joueur.
//   Appelée par : `openStatsModal`.
//   Impact : Fournit une vue d'ensemble chiffrée de la partie du joueur.
//
// ------------------ Éléments DOM Clés (référencés par ID) ------------------
//
// Ce module interagit directement avec de nombreux éléments HTML définis dans `index.html`.
// Les IDs listés ci-dessous sont ceux que `ui.js` manipule pour afficher des informations
// ou modifier l'apparence.
//
// - Affichage des ressources principales :
//   - `#bonsPoints`, `#totalBpsInline`, `#imagesCount`, `#nombreProfesseur`,
//     `#ascensionPointsCount`, `#totalPAEarnedSpanInline`, `#ascensionCountSpan`,
//     `#ascensionBonusValue`, `#prestigePointsCount`, `#prestigeCountSpan`.
// - Sections d'achat et leurs éléments :
//   - `#achatEleveSection`, `#acheterEleveButton`, `#nombreEleves`, `#elevesBpsPerItem`.
//   - `#achatClasseSection`, `#acheterClasseButton`, `#nombreClasses`, `#classesBpsPerItem`.
//   - `#achatImageSection`, `#acheterImageButton`.
//   - `#achatProfesseurSection`, `#acheterProfesseurButton`.
//   - `#studiesTitleButton`, `#clickBonsPointsDisplay` (pour le bonus de clic).
// - Sections d'Ascension et leurs éléments :
//   - `#ascensionMenuPACount`.
//   - `#acheterEcoleButton`, `#coutEcole`, `#nombreEcoles`, `#ecoleMultiplier`.
//   - `#achatLyceeSection`, `#acheterLyceeButton`, `#nombreLyceesDisplay`, `#lyceeMultiplierDisplay`.
//   - `#achatCollegeSection`, `#acheterCollegeButton`, `#nombreCollegesDisplay`, `#collegeMultiplierDisplay`.
//   - `#unlockMultiPurchaseButton`, `#unlockmaxPurchaseButton`, `#unlockNewSettingsButton`,
//     `#unlockAutomationCategoryButton`.
// - Sections de Prestige et leurs éléments :
//   - `#prestigeMenuPPCount`.
//   - `#acheterLicenceButton`, `#nombreLicences`, `#licenceBoost`.
//   - `#acheterMaster1Button`, `#nombreMaster1`, `#master1Boost`.
//   - `#acheterMaster2Button`, `#nombreMaster2`, `#master2Boost`.
//   - `#acheterDoctoratButton`, `#nombreDoctorat`, `#doctoratBoost`, `#doctoratMinClasses`.
//   - `#acheterPostDoctoratButton`, `#nombrePostDoctorat`, `#postDoctoratBoost`.
// - Panneau de ressources minimalistes :
//   - `#minimalistResources`, `#miniBonsPoints`, `#miniImages`, `#miniProfesseur`,
//     `#miniAscensionPoints`, `#miniAscensionCount`, `#miniPrestigePoints`, `#miniPrestigeCount`.
// - Boutons de navigation latérale :
//   - `#automationTabBtn`, `#skillsTabBtn`, `#settingsTabBtn`, `#ascensionTabBtn`,
//     `#prestigeTabBtn`, `#questsTabBtn`, `#achievementsTabBtn`, `#statsButton`.
// - Conteneurs de contenu principal (gérés par `openTab`) :
//   - `#studiesMainContainer`, `#automationMainContainer`, `#skillsContainer`,
//     `#settingsContainer`, `#ascensionMenuContainer`, `#prestigeMenuContainer`,
//     `#questsContainer`, `#achievementsContainer`.
// - Notifications :
//   - `#notifications-container`.
// - Arbre de compétences :
//   - `#studiesPanel`, `#ascensionPanel`, `#prestigePanel`.
//   - `#studiesSkillsPointsCount`, `#ascensionSkillsPointsCount`, `#prestigeSkillsPointsCount`.
//   - `#studiesSkillsGrid`, `#ascensionSkillsGrid`, `#prestigeSkillsGrid` (où les compétences sont rendues).
// - Quêtes :
//   - `#questsList`, `#completedQuestsList`.
// - Succès :
//   - `#achievementsGrid`, `#achievementTooltip`.
// - Modale des statistiques :
//   - `#statsModal` (le conteneur de la modale).
//   - `#statsCurrentBPS`, `#statsSkillBonus`, `#statsAscensionBonus`, `#statsPrestigeBPSBonus`,
//     `#statsAchievementBPSBonus`, `#statsAllBPSMultiplier`, `#statsBonsPoints`, `#statsImages`,
//     `#statsProfesseur`, `#statsProfMultiplier`, `#statsAscensionPoints`, `#statsPrestigePoints`,
//     `#statsEleveCostReduction`, `#statsClasseCostReduction`, `#statsImageCostReduction`,
//     `#statsProfesseurCostReduction`, `#statsEcoleCostReduction`, `#statsAutomationCostReduction`,
//     `#statsAllCostReduction`, `#statsClickBPSBonus`, `#statsPAGainMultiplier`,
//     `#statsAscensionBonusIncrease`, `#statsOfflineProductionIncrease`, `#statsAllProductionMultiplier`,
//     `#statsTotalClicks`, `#statsAscensionCount`, `#statsTotalPAEarned`, `#statsPrestigeCount`,
//     `#statsStudiesSkillPoints`, `#statsAscensionSkillPoints`, `#statsPrestigeSkillPoints`,
//     `#statsStudiesSkillsUnlockedCount`, `#statsAscensionSkillsUnlockedCount`, `#statsPrestigeSkillsUnlockedCount`,
//     `#statsLicenceBoost`, `#statsMaster1Boost`, `#statsMaster2Boost`, `#statsDoctoratBPSBoost`,
//     `#statsDoctoratMinClasses`, `#statsPostDoctoratBoost`.
// - Paramètres spécifiques :
//   - `#purchaseMultiplierSelection`, `#multiplierButtonsContainer`, `#setMultiplierXmax`.
//   - `#offlineProgressSetting`, `#minimizeResourcesSetting`, `#statsButtonSetting`.
//   - `#themeSelector`, `#dayModeButton`, `#nightModeButton`, `#themeSelectionSetting`, `#dayNightModeSetting`.
//   - `#resetProgressionButton`.
//
// ------------------ Logique Générale ------------------
//
// `ui.js` agit comme la couche de présentation. Il ne contient pas de logique de jeu.
// Au lieu de cela, il importe les données d'état du jeu (`core.js`) et les définitions
// statiques (`data.js`), puis les utilise pour mettre à jour les éléments HTML.
// Les interactions utilisateur (clics de boutons, changements de sélection) sont gérées
// par `events.js`, qui appelle les fonctions appropriées de `ui.js` pour rafraîchir l'affichage.
// La fonction `updateDisplay()` est le point d'entrée principal pour les mises à jour
// visuelles régulières, tandis que d'autres fonctions gèrent des aspects spécifiques
// (visibilité des sections, rendu des menus dynamiques, notifications, etc.).
//
// ------------------ Notes Spécifiques ------------------
//
// - **Robustesse DOM** : Des vérifications `if (element)` sont ajoutées avant de manipuler
//   les éléments DOM pour éviter les erreurs si un élément n'existe pas encore (par exemple,
//   s'il est déverrouillé plus tard dans le jeu).
// - **Délégation d'événements** : Ce fichier ne contient pas d'écouteurs d'événements directs
//   (`addEventListener`). Ces derniers sont gérés dans `events.js` qui appelle les fonctions de `ui.js`
//   en réponse aux interactions utilisateur.
// - **Gestion des grands nombres** : L'utilisation de la bibliothèque `Decimal` est implicite
//   pour tous les nombres affichés via `formatNumber`, garantissant la précision pour les
//   valeurs très grandes.
// - **Séparation des préoccupations** : La logique métier est strictement séparée de la logique de présentation.
//   `ui.js` ne fait que "lire" l'état et "écrire" sur l'interface.
//
// ---------------------------------------------------------------------


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
    offlineProgressEnabled, minimizeResourcesActive,
    disableAscensionWarning, firstAscensionPerformed, disablePrestigeWarning,
    nombreLicences, nombreMaster1, nombreMaster2, nombreDoctorat, nombrePostDoctorat,
    skillEffects, permanentBpsBonusFromAchievements, paMultiplierFromQuests,
    formatNumber, applyAllSkillEffects, updateCachedMultipliers, calculateTotalBPS,
    checkUnlockConditions, updateButtonStates,
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
import { isDayTheme, themeOptionUnlocked } from './settings.js'; // Importe les variables de thème (maj 30/05 - Imports)
import { renderQuests as renderQuestsFromQuestsJS, updateQuestsUI as updateQuestsUIFromQuestsJS } from './quests.js'; // (maj 30/05 Quete)

// Assumes Decimal is globally available from break_infinity.min.js

/**
 * Met à jour l'affichage de toutes les ressources principales et des boutons d'achat.
 * Cette fonction est appelée fréquemment pour refléter l'état actuel du jeu.
 */
export function updateDisplay() {
    // Mise à jour des ressources principales
    const bonsPointsElement = document.getElementById('bonsPoints');
    if (bonsPointsElement) bonsPointsElement.textContent = formatNumber(bonsPoints, 0); // (maj 30/05 - Robustesse DOM)

    const totalBpsInlineElement = document.getElementById('totalBpsInline');
    if (totalBpsInlineElement) totalBpsInlineElement.textContent = formatNumber(totalBonsPointsParSeconde, 1); // (maj 30/05 - Robustesse DOM)

    const imagesDisplayElement = document.getElementById('imagesDisplay');
    const imagesCountElement = document.getElementById('imagesCount');
    if (imagesDisplayElement && imagesCountElement) { // (maj 30/05 - Robustesse DOM)
        if (imagesUnlocked) {
            imagesDisplayElement.style.display = 'block';
            imagesCountElement.textContent = formatNumber(images, 0);
        } else {
            imagesDisplayElement.style.display = 'none';
        }
    }

    const nombreProfesseurDisplayElement = document.getElementById('nombreProfesseurDisplay');
    const nombreProfesseurElement = document.getElementById('nombreProfesseur');
    if (nombreProfesseurDisplayElement && nombreProfesseurElement) { // (maj 30/05 - Robustesse DOM)
        if (ProfesseurUnlocked) {
            nombreProfesseurDisplayElement.style.display = 'block';
            nombreProfesseurElement.textContent = formatNumber(nombreProfesseur, 0);
        } else {
            nombreProfesseurDisplayElement.style.display = 'none';
        }
    }

    // Mise à jour des ressources d'Ascension
    const currentAscensionPointsDisplayElement = document.getElementById('currentAscensionPointsDisplay');
    const ascensionPointsCountElement = document.getElementById('ascensionPointsCount');
    const totalPAEarnedSpanInlineElement = document.getElementById('totalPAEarnedSpanInline');
    const ascensionCountDisplayElement = document.getElementById('ascensionCountDisplay');
    const ascensionCountSpanElement = document.getElementById('ascensionCountSpan');
    const ascensionBonusDisplayElement = document.getElementById('ascensionBonusDisplay');
    const ascensionBonusValueElement = document.getElementById('ascensionBonusValue');

    if (currentAscensionPointsDisplayElement && ascensionPointsCountElement && totalPAEarnedSpanInlineElement &&
        ascensionCountDisplayElement && ascensionCountSpanElement && ascensionBonusDisplayElement && ascensionBonusValueElement) { // (maj 30/05 - Robustesse DOM)
        if (ascensionUnlocked || ascensionCount.gt(0)) {
            currentAscensionPointsDisplayElement.style.display = 'block';
            ascensionPointsCountElement.textContent = formatNumber(ascensionPoints, 0);
            totalPAEarnedSpanInlineElement.textContent = formatNumber(totalPAEarned, 0);

            ascensionCountDisplayElement.style.display = 'block';
            ascensionCountSpanElement.textContent = formatNumber(ascensionCount, 0);

            ascensionBonusDisplayElement.style.display = 'block';
            ascensionBonusValueElement.textContent = `${formatNumber(ascensionBonus, 2)}x`;
        } else {
            currentAscensionPointsDisplayElement.style.display = 'none';
            ascensionCountDisplayElement.style.display = 'none';
            ascensionBonusDisplayElement.style.display = 'none';
        }
    }


    // Mise à jour des ressources de Prestige
    const prestigePointsDisplayElement = document.getElementById('prestigePointsDisplay');
    const prestigePointsCountElement = document.getElementById('prestigePointsCount');
    const prestigeCountDisplayElement = document.getElementById('prestigeCountDisplay');
    const prestigeCountSpanElement = document.getElementById('prestigeCountSpan');

    if (prestigePointsDisplayElement && prestigePointsCountElement && prestigeCountDisplayElement && prestigeCountSpanElement) { // (maj 30/05 - Robustesse DOM)
        if (prestigeUnlocked || prestigeCount.gt(0)) {
            prestigePointsDisplayElement.style.display = 'block';
            prestigePointsCountElement.textContent = formatNumber(prestigePoints, 0);

            prestigeCountDisplayElement.style.display = 'block';
            prestigeCountSpanElement.textContent = formatNumber(prestigeCount, 0);
        } else {
            prestigePointsDisplayElement.style.display = 'none';
            prestigeCountDisplayElement.style.display = 'none';
        }
    }


    // Mise à jour des éléments de la section "Études"
    const achatEleveSection = document.getElementById('achatEleveSection');
    const acheterEleveButton = document.getElementById('acheterEleveButton');
    const nombreElevesElement = document.getElementById('nombreEleves');
    const elevesBpsPerItemElement = document.getElementById('elevesBpsPerItem');

    if (achatEleveSection && acheterEleveButton && nombreElevesElement && elevesBpsPerItemElement) { // (maj 30/05 - Robustesse DOM)
        if (elevesUnlocked) {
            achatEleveSection.style.display = 'block';
            const coutEleveActuel = calculateNextEleveCost(nombreEleves);
            acheterEleveButton.innerHTML = `Élève : <span class="bons-points-color">${formatNumber(coutEleveActuel, 0)} BP</span>`;
            acheterEleveButton.classList.toggle('can-afford', bonsPoints.gte(coutEleveActuel));
            acheterEleveButton.classList.toggle('cannot-afford', bonsPoints.lt(coutEleveActuel));
            nombreElevesElement.textContent = formatNumber(nombreEleves, 0);
            elevesBpsPerItemElement.textContent = formatNumber(elevesBpsPerItem, 1);
        } else {
            achatEleveSection.style.display = 'none';
        }
    }

    const achatClasseSection = document.getElementById('achatClasseSection');
    const acheterClasseButton = document.getElementById('acheterClasseButton');
    const nombreClassesElement = document.getElementById('nombreClasses');
    const classesBpsPerItemElement = document.getElementById('classesBpsPerItem');

    if (achatClasseSection && acheterClasseButton && nombreClassesElement && classesBpsPerItemElement) { // (maj 30/05 - Robustesse DOM)
        if (classesUnlocked) {
            achatClasseSection.style.display = 'block';
            const coutClasseActuel = calculateNextClasseCost(nombreClasses);
            acheterClasseButton.innerHTML = `Salle de classe : <span class="bons-points-color">${formatNumber(coutClasseActuel, 0)} BP</span>`;
            acheterClasseButton.classList.toggle('can-afford', bonsPoints.gte(coutClasseActuel));
            acheterClasseButton.classList.toggle('cannot-afford', bonsPoints.lt(coutClasseActuel));
            nombreClassesElement.textContent = formatNumber(nombreClasses, 0);
            classesBpsPerItemElement.textContent = formatNumber(classesBpsPerItem, 1);
        } else {
            achatClasseSection.style.display = 'none';
        }
    }

    const achatImageSection = document.getElementById('achatImageSection');
    const acheterImageButton = document.getElementById('acheterImageButton');
    if (achatImageSection && acheterImageButton) { // (maj 30/05 - Robustesse DOM)
        if (imagesUnlocked) {
            achatImageSection.style.display = 'block';
            const coutImageActuel = calculateNextImageCost(images);
            acheterImageButton.innerHTML = `Image : <span class="bons-points-color">${formatNumber(coutImageActuel, 0)} BP</span>`;
            acheterImageButton.classList.toggle('can-afford', bonsPoints.gte(coutImageActuel));
            acheterImageButton.classList.toggle('cannot-afford', bonsPoints.lt(coutImageActuel));
        } else {
            achatImageSection.style.display = 'none';
        }
    }

    const achatProfesseurSection = document.getElementById('achatProfesseurSection');
    const acheterProfesseurButton = document.getElementById('acheterProfesseurButton');
    if (achatProfesseurSection && acheterProfesseurButton) { // (maj 30/05 - Robustesse DOM)
        if (ProfesseurUnlocked) {
            achatProfesseurSection.style.display = 'block';
            const coutProfesseurActuel = calculateNextProfessorCost(nombreProfesseur);
            acheterProfesseurButton.innerHTML = `Professeur : <span class="images-color">${formatNumber(coutProfesseurActuel, 0)} I</span>`;
            acheterProfesseurButton.classList.toggle('can-afford', images.gte(coutProfesseurActuel));
            acheterProfesseurButton.classList.toggle('cannot-afford', images.lt(coutProfesseurActuel));
        } else {
            achatProfesseurSection.style.display = 'none';
        }
    }

    // Mise à jour du bouton de clic principal
    const studiesTitleButton = document.getElementById('studiesTitleButton');
    const clickBonsPointsDisplay = document.getElementById('clickBonsPointsDisplay');
    if (studiesTitleButton && clickBonsPointsDisplay) { // (maj 30/05 - Robustesse DOM)
        clickBonsPointsDisplay.textContent = `+${formatNumber(skillEffects.clickBonsPointsBonus.add(1), bonsPoints.lt(1000) ? 1 : 0)} BP`; // Use skillEffects.clickBonsPointsBonus
    }


    // Mise à jour des éléments de la section "Ascension"
    const ascensionMenuPACount = document.getElementById('ascensionMenuPACount');
    const acheterEcoleButton = document.getElementById('acheterEcoleButton');
    const coutEcole = document.getElementById('coutEcole');
    const nombreEcoles = document.getElementById('nombreEcoles');
    const ecoleMultiplierElement = document.getElementById('ecoleMultiplier');

    if (ascensionMenuPACount && acheterEcoleButton && coutEcole && nombreEcoles && ecoleMultiplierElement) { // (maj 30/05 - Robustesse DOM)
        if (ascensionMenuButtonUnlocked) {
            ascensionMenuPACount.textContent = formatNumber(ascensionPoints, 0);

            const coutEcoleActuel = calculateNextEcoleCost(schoolCount);
            acheterEcoleButton.classList.toggle('can-afford', ascensionPoints.gte(coutEcoleActuel));
            acheterEcoleButton.classList.toggle('cannot-afford', ascensionPoints.lt(coutEcoleActuel));
            coutEcole.textContent = `${formatNumber(coutEcoleActuel, 0)} PA`;
            nombreEcoles.textContent = formatNumber(schoolCount, 0);
            ecoleMultiplierElement.textContent = `${formatNumber(skillEffects.ecoleMultiplier, 2)}x`; // (maj 30/05 débug v2)
        }
    }


    const achatLyceeSection = document.getElementById('achatLyceeSection');
    const acheterLyceeButton = document.getElementById('acheterLyceeButton');
    const nombreLyceesDisplay = document.getElementById('nombreLyceesDisplay');
    const lyceeMultiplierDisplay = document.getElementById('lyceeMultiplierDisplay');

    if (achatLyceeSection && acheterLyceeButton && nombreLyceesDisplay && lyceeMultiplierDisplay) { // (maj 30/05 - Robustesse DOM)
        if (lyceesUnlocked) {
            achatLyceeSection.style.display = 'block';
            const coutLyceeActuel = calculateNextLyceeCost(nombreLycees);
            acheterLyceeButton.innerHTML = `Lycée : <span class="ascension-points-color">${formatNumber(coutLyceeActuel, 0)} PA</span>`;
            acheterLyceeButton.classList.toggle('can-afford', ascensionPoints.gte(coutLyceeActuel));
            acheterLyceeButton.classList.toggle('cannot-afford', ascensionPoints.lt(coutLyceeActuel));
            nombreLyceesDisplay.textContent = formatNumber(nombreLycees, 0);
            lyceeMultiplierDisplay.textContent = `${formatNumber(skillEffects.lyceeMultiplier, 2)}x`; // (maj 30/05 débug v2)
        } else {
            achatLyceeSection.style.display = 'none';
        }
    }


    const achatCollegeSection = document.getElementById('achatCollegeSection');
    const acheterCollegeButton = document.getElementById('acheterCollegeButton');
    const nombreCollegesDisplay = document.getElementById('nombreCollegesDisplay');
    const collegeMultiplierDisplay = document.getElementById('collegeMultiplierDisplay');

    if (achatCollegeSection && acheterCollegeButton && nombreCollegesDisplay && collegeMultiplierDisplay) { // (maj 30/05 - Robustesse DOM)
        if (collegesUnlocked) {
            achatCollegeSection.style.display = 'block';
            const coutCollegeActuel = calculateNextCollegeCost(nombreColleges);
            acheterCollegeButton.innerHTML = `Collège : <span class="ascension-points-color">${formatNumber(coutCollegeActuel, 0)} PA</span>`;
            acheterCollegeButton.classList.toggle('can-afford', ascensionPoints.gte(coutCollegeActuel));
            acheterCollegeButton.classList.toggle('cannot-afford', ascensionPoints.lt(coutCollegeActuel));
            nombreCollegesDisplay.textContent = formatNumber(nombreColleges, 0);
            collegeMultiplierDisplay.textContent = `${formatNumber(skillEffects.collegeMultiplier, 2)}x`; // (maj 30/05 débug v2)
        } else {
            achatCollegeSection.style.display = 'none';
        }
    }


    // Unlock buttons in Ascension Menu
    const unlockMultiPurchaseButton = document.getElementById('unlockMultiPurchaseButton');
    const unlockmaxPurchaseButton = document.getElementById('unlockmaxPurchaseButton');
    const unlockNewSettingsButton = document.getElementById('unlockNewSettingsButton');
    const unlockAutomationCategoryButton = document.getElementById('unlockAutomationCategoryButton');

    if (unlockMultiPurchaseButton) { // (maj 30/05 - Robustesse DOM)
        unlockMultiPurchaseButton.style.display = multiPurchaseOptionUnlocked ? 'none' : 'block';
        if (!multiPurchaseOptionUnlocked) {
            unlockMultiPurchaseButton.classList.toggle('can-afford', ascensionPoints.gte(10));
            unlockMultiPurchaseButton.classList.toggle('cannot-afford', ascensionPoints.lt(10));
        }
    }
    if (unlockmaxPurchaseButton) { // (maj 30/05 - Robustesse DOM)
        unlockmaxPurchaseButton.style.display = maxPurchaseOptionUnlocked ? 'none' : 'block';
        if (!maxPurchaseOptionUnlocked) {
            unlockmaxPurchaseButton.classList.toggle('can-afford', ascensionPoints.gte(100));
            unlockmaxPurchaseButton.classList.toggle('cannot-afford', ascensionPoints.lt(100));
        }
    }
    if (unlockNewSettingsButton) { // (maj 30/05 - Robustesse DOM)
        unlockNewSettingsButton.style.display = newSettingsUnlocked ? 'none' : 'block';
        if (!newSettingsUnlocked) {
            unlockNewSettingsButton.classList.toggle('can-afford', ascensionPoints.gte(10));
            unlockNewSettingsButton.classList.toggle('cannot-afford', ascensionPoints.lt(10));
        }
    }
    if (unlockAutomationCategoryButton) { // (maj 30/05 - Robustesse DOM)
        unlockAutomationCategoryButton.style.display = automationCategoryUnlocked ? 'none' : 'block';
        if (!automationCategoryUnlocked) {
            // Assuming calculateAutomationCost(1000) is the cost for unlocking automation category
            const automationUnlockCost = calculateAutomationCost(1000); // Example, adjust if needed
            unlockAutomationCategoryButton.classList.toggle('can-afford', ascensionPoints.gte(automationUnlockCost));
            unlockAutomationCategoryButton.classList.toggle('cannot-afford', ascensionPoints.lt(automationUnlockCost));
        }
    }


    // Mise à jour des éléments de la section "Prestige"
    const prestigeMenuPPCount = document.getElementById('prestigeMenuPPCount');
    if (prestigeMenuPPCount) { // (maj 30/05 - Robustesse DOM)
        if (prestigeUnlocked) {
            prestigeMenuPPCount.textContent = formatNumber(prestigePoints, 0);

            const licenceData = prestigePurchasesData.find(p => p.id === 'licence');
            const acheterLicenceButton = document.getElementById('acheterLicenceButton');
            const nombreLicencesElement = document.getElementById('nombreLicences');
            const licenceBoostElement = document.getElementById('licenceBoost');
            if (acheterLicenceButton && nombreLicencesElement && licenceBoostElement) { // (maj 30/05 - Robustesse DOM)
                acheterLicenceButton.innerHTML = `Licence : <span class="prestige-points-color">${formatNumber(licenceData.cost, 0)} PP</span>`;
                acheterLicenceButton.classList.toggle('can-afford', prestigePoints.gte(licenceData.cost));
                acheterLicenceButton.classList.toggle('cannot-afford', prestigePoints.lt(licenceData.cost));
                nombreLicencesElement.textContent = formatNumber(nombreLicences, 0);
                licenceBoostElement.textContent = `${formatNumber(licenceData.getEffectValue().sub(1).mul(100), 2)}%`;
            }


            const master1Data = prestigePurchasesData.find(p => p.id === 'master1');
            const acheterMaster1Button = document.getElementById('acheterMaster1Button');
            const nombreMaster1Element = document.getElementById('nombreMaster1');
            const master1BoostElement = document.getElementById('master1Boost');
            if (acheterMaster1Button && nombreMaster1Element && master1BoostElement) { // (maj 30/05 - Robustesse DOM)
                acheterMaster1Button.innerHTML = `Master I : <span class="prestige-points-color">${formatNumber(master1Data.cost, 0)} PP</span>`;
                acheterMaster1Button.classList.toggle('can-afford', prestigePoints.gte(master1Data.cost));
                acheterMaster1Button.classList.toggle('cannot-afford', prestigePoints.lt(master1Data.cost));
                nombreMaster1Element.textContent = formatNumber(nombreMaster1, 0);
                master1BoostElement.textContent = `${formatNumber(master1Data.getEffectValue().sub(1).mul(100), 2)}%`;
            }


            const master2Data = prestigePurchasesData.find(p => p.id === 'master2');
            const acheterMaster2Button = document.getElementById('acheterMaster2Button');
            const nombreMaster2Element = document.getElementById('nombreMaster2');
            const master2BoostElement = document.getElementById('master2Boost');
            if (acheterMaster2Button && nombreMaster2Element && master2BoostElement) { // (maj 30/05 - Robustesse DOM)
                acheterMaster2Button.innerHTML = `Master II : <span class="prestige-points-color">${formatNumber(master2Data.cost, 0)} PP</span>`;
                acheterMaster2Button.classList.toggle('can-afford', prestigePoints.gte(master2Data.cost));
                acheterMaster2Button.classList.toggle('cannot-afford', prestigePoints.lt(master2Data.cost));
                nombreMaster2Element.textContent = formatNumber(nombreMaster2, 0);
                master2BoostElement.textContent = `${formatNumber(master2Data.getEffectValue().sub(1).mul(100), 2)}%`;
            }


            const doctoratData = prestigePurchasesData.find(p => p.id === 'doctorat');
            const acheterDoctoratButton = document.getElementById('acheterDoctoratButton');
            const nombreDoctoratElement = document.getElementById('nombreDoctorat');
            const doctoratBoostElement = document.getElementById('doctoratBoost');
            const doctoratMinClassesElement = document.getElementById('doctoratMinClasses');
            if (acheterDoctoratButton && nombreDoctoratElement && doctoratBoostElement && doctoratMinClassesElement) { // (maj 30/05 - Robustesse DOM)
                acheterDoctoratButton.innerHTML = `Doctorat : <span class="prestige-points-color">${formatNumber(doctoratData.cost, 0)} PP</span>`;
                acheterDoctoratButton.classList.toggle('can-afford', prestigePoints.gte(doctoratData.cost) && doctoratData.prerequisites());
                acheterDoctoratButton.classList.toggle('cannot-afford', prestigePoints.lt(doctoratData.cost) || !doctoratData.prerequisites());
                nombreDoctoratElement.textContent = formatNumber(nombreDoctorat, 0);
                doctoratBoostElement.textContent = `${formatNumber(doctoratData.getEffectValue().sub(1).mul(100), 2)}%`;
                doctoratMinClassesElement.textContent = formatNumber(doctoratData.getMinClasses(), 0);
            }


            const postDoctoratData = prestigePurchasesData.find(p => p.id === 'postDoctorat');
            const acheterPostDoctoratButton = document.getElementById('acheterPostDoctoratButton');
            const nombrePostDoctoratElement = document.getElementById('nombrePostDoctorat');
            const postDoctoratBoostElement = document.getElementById('postDoctoratBoost');
            if (acheterPostDoctoratButton && nombrePostDoctoratElement && postDoctoratBoostElement) { // (maj 30/05 - Robustesse DOM)
                acheterPostDoctoratButton.innerHTML = `Post-Doctorat : <span class="prestige-points-color">${formatNumber(postDoctoratData.cost, 0)} PP</span>`;
                acheterPostDoctoratButton.classList.toggle('can-afford', prestigePoints.gte(postDoctoratData.cost) && postDoctoratData.prerequisites());
                acheterPostDoctoratButton.classList.toggle('cannot-afford', prestigePoints.lt(postDoctoratData.cost) || !postDoctoratData.prerequisites());
                nombrePostDoctoratElement.textContent = formatNumber(nombrePostDoctorat, 0);
                postDoctoratBoostElement.textContent = `${formatNumber(postDoctoratData.getEffectValue().sub(1).mul(100), 2)}%`;
            }
        }
    }


    // Mise à jour de l'affichage des ressources minimalistes
    const miniBonsPoints = document.getElementById('miniBonsPoints');
    const miniImages = document.getElementById('miniImages');
    const miniProfesseur = document.getElementById('miniProfesseur');
    const miniAscensionPoints = document.getElementById('miniAscensionPoints');
    const miniAscensionCount = document.getElementById('miniAscensionCount');
    const miniPrestigePoints = document.getElementById('miniPrestigePoints');
    const miniPrestigeCount = document.getElementById('miniPrestigeCount');

    if (miniBonsPoints) miniBonsPoints.textContent = formatNumber(bonsPoints, 0); // (maj 30/05 - Robustesse DOM)
    if (miniImages) miniImages.textContent = formatNumber(images, 0); // (maj 30/05 - Robustesse DOM)
    if (miniProfesseur) miniProfesseur.textContent = formatNumber(nombreProfesseur, 0); // (maj 30/05 - Robustesse DOM)
    if (miniAscensionPoints) miniAscensionPoints.textContent = formatNumber(ascensionPoints, 0); // (maj 30/05 - Robustesse DOM)
    if (miniAscensionCount) miniAscensionCount.textContent = formatNumber(ascensionCount, 0); // (maj 30/05 - Robustesse DOM)
    if (miniPrestigePoints) miniPrestigePoints.textContent = formatNumber(prestigePoints, 0); // (maj 30/05 - Robustesse DOM)
    if (miniPrestigeCount) miniPrestigeCount.textContent = formatNumber(prestigeCount, 0); // (maj 30/05 - Robustesse DOM)


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
    const automationTabBtn = document.getElementById('automationTabBtn');
    if (automationTabBtn) automationTabBtn.style.display = automationCategoryUnlocked ? 'block' : 'none'; // (maj 30/05 - Robustesse DOM)

    const skillsTabBtn = document.getElementById('skillsTabBtn');
    if (skillsTabBtn) skillsTabBtn.style.display = skillsButtonUnlocked ? 'block' : 'none'; // (maj 30/05 - Robustesse DOM)

    const settingsTabBtn = document.getElementById('settingsTabBtn');
    if (settingsTabBtn) settingsTabBtn.style.display = settingsButtonUnlocked ? 'block' : 'none'; // (maj 30/05 - Robustesse DOM)

    const ascensionTabBtn = document.getElementById('ascensionTabBtn');
    if (ascensionTabBtn) ascensionTabBtn.style.display = ascensionMenuButtonUnlocked ? 'block' : 'none'; // (maj 30/05 - Robustesse DOM)

    const prestigeTabBtn = document.getElementById('prestigeTabBtn');
    if (prestigeTabBtn) prestigeTabBtn.style.display = prestigeUnlocked ? 'block' : 'none'; // (maj 30/05 - Robustesse DOM)

    const questsTabBtn = document.getElementById('questsTabBtn');
    if (questsTabBtn) questsTabBtn.style.display = questsUnlocked ? 'block' : 'none'; // (maj 30/05 - Robustesse DOM)

    const achievementsTabBtn = document.getElementById('achievementsTabBtn');
    if (achievementsTabBtn) achievementsTabBtn.style.display = achievementsButtonUnlocked ? 'block' : 'none'; // (maj 30/05 - Robustesse DOM)

    const statsButton = document.getElementById('statsButton');
    if (statsButton) statsButton.style.display = statsButtonUnlocked ? 'block' : 'none'; // (maj 30/05 - Robustesse DOM)

    // Visibilité des options d'achat multiples
    const purchaseMultiplierSelection = document.getElementById('purchaseMultiplierSelection');
    if (purchaseMultiplierSelection) purchaseMultiplierSelection.style.display = multiPurchaseOptionUnlocked ? 'flex' : 'none'; // (maj 30/05 - Robustesse DOM)

    const setMultiplierXmax = document.getElementById('setMultiplierXmax');
    if (setMultiplierXmax) setMultiplierXmax.style.display = maxPurchaseOptionUnlocked ? 'inline-block' : 'none'; // (maj 30/05 - Robustesse DOM)


    // Visibilité des sections d'achat dans "Études"
    // Ces éléments sont déjà gérés dans updateDisplay, mais cette fonction assure la visibilité initiale des conteneurs
    const achatEleveSection = document.getElementById('achatEleveSection');
    if (achatEleveSection) achatEleveSection.style.display = elevesUnlocked ? 'block' : 'none'; // (maj 30/05 - Robustesse DOM)

    const achatClasseSection = document.getElementById('achatClasseSection');
    if (achatClasseSection) achatClasseSection.style.display = classesUnlocked ? 'block' : 'none'; // (maj 30/05 - Robustesse DOM)

    const achatImageSection = document.getElementById('achatImageSection');
    if (achatImageSection) achatImageSection.style.display = imagesUnlocked ? 'block' : 'none'; // (maj 30/05 - Robustesse DOM)

    const achatProfesseurSection = document.getElementById('achatProfesseurSection');
    if (achatProfesseurSection) achatProfesseurSection.style.display = ProfesseurUnlocked ? 'block' : 'none'; // (maj 30/05 - Robustesse DOM)

    // Visibilité des sections d'achat dans "Ascension"
    const achatLyceeSection = document.getElementById('achatLyceeSection');
    if (achatLyceeSection) achatLyceeSection.style.display = lyceesUnlocked ? 'block' : 'none'; // (maj 30/05 - Robustesse DOM)

    const achatCollegeSection = document.getElementById('achatCollegeSection');
    if (achatCollegeSection) achatCollegeSection.style.display = collegesUnlocked ? 'block' : 'none'; // (maj 30/05 - Robustesse DOM)


    // Basculement de l'affichage des ressources (normal vs. minimaliste)
    const mainResourcesDisplay = document.getElementById('mainResourcesDisplay');
    const minimalistResources = document.getElementById('minimalistResources');
    if (mainResourcesDisplay && minimalistResources) { // (maj 30/05 - Robustesse DOM)
        mainResourcesDisplay.style.display = minimizeResourcesActive ? 'none' : 'flex';
        minimalistResources.style.display = minimizeResourcesActive ? 'flex' : 'none';
    }


    // Visibilité des options dans les paramètres
    const offlineProgressSetting = document.getElementById('offlineProgressSetting');
    const minimizeResourcesSetting = document.getElementById('minimizeResourcesSetting');
    const statsButtonSetting = document.getElementById('statsButtonSetting');

    if (offlineProgressSetting) offlineProgressSetting.style.display = newSettingsUnlocked ? 'block' : 'none'; // (maj 30/05 - Robustesse DOM)
    if (minimizeResourcesSetting) minimizeResourcesSetting.style.display = newSettingsUnlocked ? 'block' : 'none'; // (maj 30/05 - Robustesse DOM)
    if (statsButtonSetting) statsButtonSetting.style.display = newSettingsUnlocked ? 'block' : 'none'; // (maj 30/05 - Robustesse DOM)
    // Note: statsButtonSetting est lié à newSettingsUnlocked, pas directement à statsButtonUnlocked pour la visibilité du conteneur.
    // La visibilité du bouton lui-même est gérée par statsButtonUnlocked dans updateSettingsButtonStates ou updateDisplay.

    // Les conteneurs principaux (studiesMainContainer, automationMainContainer, etc.) sont gérés par openTab()
    // Les panneaux de compétences sont gérés par renderSkillsMenu()
}

/**
 * Met à jour l'état visuel des boutons de multiplicateur d'achat (x1, x10, x100, xMax).
 */
export function updateMultiplierButtons() {
    const multiplierButtonsContainer = document.getElementById('multiplierButtonsContainer');
    if (!multiplierButtonsContainer) return; // (maj 30/05 - Robustesse DOM)

    const multiplierButtons = multiplierButtonsContainer.querySelectorAll('.multiplier-button');
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

    if (autoEleveBtn) { // (maj 30/05 - Robustesse DOM)
        if (autoEleveActive) {
            autoEleveBtn.textContent = "Désactiver Auto Élèves";
            autoEleveBtn.classList.add('automation-active');
            autoEleveBtn.classList.remove('can-afford', 'cannot-afford'); // (maj 30/05 - Style & thèmes)
        } else {
            autoEleveBtn.innerHTML = `Automatiser Élèves : <span class="ascension-points-color">${formatNumber(calculateAutomationCost(100), 0)} PA</span>`;
            autoEleveBtn.classList.remove('automation-active');
            autoEleveBtn.classList.toggle('can-afford', ascensionPoints.gte(calculateAutomationCost(100)));
            autoEleveBtn.classList.toggle('cannot-afford', ascensionPoints.lt(calculateAutomationCost(100)));
        }
    }

    if (autoClasseBtn) { // (maj 30/05 - Robustesse DOM)
        if (autoClasseActive) {
            autoClasseBtn.textContent = "Désactiver Auto Classes";
            autoClasseBtn.classList.add('automation-active');
            autoClasseBtn.classList.remove('can-afford', 'cannot-afford'); // (maj 30/05 - Style & thèmes)
        } else {
            autoClasseBtn.innerHTML = `Automatiser Classes : <span class="ascension-points-color">${formatNumber(calculateAutomationCost(500), 0)} PA</span>`;
            autoClasseBtn.classList.remove('automation-active');
            autoClasseBtn.classList.toggle('can-afford', ascensionPoints.gte(calculateAutomationCost(500)));
            autoClasseBtn.classList.toggle('cannot-afford', ascensionPoints.lt(calculateAutomationCost(500)));
        }
    }

    if (autoImageBtn) { // (maj 30/05 - Robustesse DOM)
        if (autoImageActive) {
            autoImageBtn.textContent = "Désactiver Auto Images";
            autoImageBtn.classList.add('automation-active');
            autoImageBtn.classList.remove('can-afford', 'cannot-afford'); // (maj 30/05 - Style & thèmes)
        } else {
            autoImageBtn.innerHTML = `Automatiser Images : <span class="ascension-points-color">${formatNumber(calculateAutomationCost(10000), 0)} PA</span>`;
            autoImageBtn.classList.remove('automation-active');
            autoImageBtn.classList.toggle('can-afford', ascensionPoints.gte(calculateAutomationCost(10000)));
            autoImageBtn.classList.toggle('cannot-afford', ascensionPoints.lt(calculateAutomationCost(10000)));
        }
    }

    if (autoProfesseurBtn) { // (maj 30/05 - Robustesse DOM)
        if (autoProfesseurActive) {
            autoProfesseurBtn.textContent = "Désactiver Auto Profs";
            autoProfesseurBtn.classList.add('automation-active');
            autoProfesseurBtn.classList.remove('can-afford', 'cannot-afford'); // (maj 30/05 - Style & thèmes)
        } else {
            autoProfesseurBtn.innerHTML = `Automatiser Professeur${nombreProfesseur.gt(1) ? 's' : ''} : <span class="ascension-points-color">${formatNumber(calculateAutomationCost(100000), 0)} PA</span>`;
            autoProfesseurBtn.classList.remove('automation-active');
            autoProfesseurBtn.classList.toggle('can-afford', ascensionPoints.gte(calculateAutomationCost(100000)));
            autoProfesseurBtn.classList.toggle('cannot-afford', ascensionPoints.lt(calculateAutomationCost(100000)));
        }
    }
}

/**
 * Met à jour l'état visuel des boutons des paramètres (thème, réinitialisation, etc.).
 * (maj 30/05 - Refactorisation)
 */
export function updateSettingsButtonStates() {
    const resetProgressionButton = document.getElementById('resetProgressionButton');
    const toggleMinimalistResourcesButton = document.getElementById('toggleMinimalistResources');
    const statsButton = document.getElementById('statsButton'); // (maj 30/05 - Robustesse DOM)

    // Mise à jour des contrôles de thème et mode Jour/Nuit (maj 30/05 - Thème & style)
    updateThemeAndModeDisplay();

    if (resetProgressionButton) { // (maj 30/05 - Robustesse DOM)
        resetProgressionButton.classList.toggle('can-afford', images.gte(10));
        resetProgressionButton.classList.toggle('cannot-afford', images.lt(10));
    }

    if (toggleMinimalistResourcesButton) { // (maj 30/05 - Robustesse DOM)
        toggleMinimalistResourcesButton.textContent = minimizeResourcesActive ? "Afficher les ressources complètes" : "Minimiser la section ressources";
    }

    if (statsButton) { // (maj 30/05 - Robustesse DOM)
        statsButton.style.display = statsButtonUnlocked ? 'block' : 'none';
    }

    // Le toggle pour la progression hors ligne est une checkbox, son état est géré directement par le `checked`
    // de l'input dans events.js, pas besoin de le styliser ici.
}

/**
 * Met à jour l'état visuel des contrôles de thème et de mode jour/nuit.
 * (maj 30/05 - Thème & style)
 */
export function updateThemeAndModeDisplay() {
    const themeSelector = document.getElementById('themeSelector');
    const dayModeButton = document.getElementById('dayModeButton');
    const nightModeButton = document.getElementById('nightModeButton');

    if (themeSelector) { // (maj 30/05 - Robustesse DOM)
        // Sélectionne l'option du thème actuel
        // La classe de thème est appliquée au body par settings.js, nous la lisons ici.
        const currentThemeClass = document.body.classList.value.split(' ').find(cls => cls.includes('-theme'));
        if (currentThemeClass) {
            themeSelector.value = currentThemeClass;
        } else {
            themeSelector.value = 'normal-theme'; // Fallback
        }
    }

    if (dayModeButton && nightModeButton) { // (maj 30/05 - Robustesse DOM)
        // Met à jour la classe 'active' pour les boutons Jour/Nuit
        if (isDayTheme) {
            dayModeButton.classList.add('active');
            nightModeButton.classList.remove('active');
        } else {
            nightModeButton.classList.add('active');
            dayModeButton.classList.remove('active');
        }
    }

    // La visibilité du sélecteur de thème est gérée par newSettingsUnlocked dans updateSectionVisibility
    const themeSelectionSetting = document.getElementById('themeSelectionSetting');
    const dayNightModeSetting = document.getElementById('dayNightModeSetting');

    if (themeSelectionSetting) themeSelectionSetting.style.display = themeOptionUnlocked ? 'block' : 'none'; // (maj 30/05 - Robustesse DOM)
    if (dayNightModeSetting) dayNightModeSetting.style.display = themeOptionUnlocked ? 'block' : 'none'; // (maj 30/05 - Robustesse DOM)
}


/**
 * Orchestre le rendu complet de l'arbre de compétences, y compris la visibilité des panneaux.
 */
export function renderSkillsMenu() {
    const studiesPanel = document.getElementById('studiesPanel');
    const ascensionPanel = document.getElementById('ascensionPanel');
    const prestigePanel = document.getElementById('prestigePanel');

    // Contrôle la visibilité des panneaux de compétences
    if (studiesPanel) studiesPanel.style.display = studiesSkillsUnlocked ? 'flex' : 'none'; // (maj 30/05 - Robustesse DOM)
    if (ascensionPanel) ascensionPanel.style.display = ascensionSkillsUnlocked ? 'flex' : 'none'; // (maj 30/05 - Robustesse DOM)
    if (prestigePanel) prestigePanel.style.display = prestigeSkillsUnlocked ? 'flex' : 'none'; // (maj 30/05 - Robustesse DOM)

    // Met à jour les points de compétence disponibles
    const studiesSkillsPointsCount = document.getElementById('studiesSkillsPointsCount');
    if (studiesSkillsPointsCount) studiesSkillsPointsCount.textContent = formatNumber(studiesSkillPoints, 0); // (maj 30/05 - Robustesse DOM)

    const ascensionSkillsPointsCount = document.getElementById('ascensionSkillsPointsCount');
    if (ascensionSkillsPointsCount) ascensionSkillsPointsCount.textContent = formatNumber(ascensionSkillPoints, 0); // (maj 30/05 - Robustesse DOM)

    const prestigeSkillsPointsCount = document.getElementById('prestigeSkillsPointsCount');
    if (prestigeSkillsPointsCount) prestigeSkillsPointsCount.textContent = formatNumber(prestigeSkillPoints, 0); // (maj 30/05 - Robustesse DOM)


    // Rend chaque panneau de compétences
    const studiesSkillsGrid = document.getElementById('studiesSkillsGrid');
    if (studiesSkillsGrid) renderSkillPanel('studies', studiesSkillsGrid, studiesSkillLevels, studiesSkillPoints, studiesSkillsUnlocked); // (maj 30/05 - Robustesse DOM)

    const ascensionSkillsGrid = document.getElementById('ascensionSkillsGrid');
    if (ascensionSkillsGrid) renderSkillPanel('ascension', ascensionSkillsGrid, ascensionSkillLevels, ascensionSkillPoints, ascensionSkillsUnlocked); // (maj 30/05 - Robustesse DOM)

    const prestigeSkillsGrid = document.getElementById('prestigeSkillsGrid');
    if (prestigeSkillsGrid) renderSkillPanel('prestige', prestigeSkillsGrid, prestigeSkillLevels, prestigeSkillPoints, prestigeSkillsUnlocked); // (maj 30/05 - Robustesse DOM)
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
    if (!skillsInPanel || skillsInPanel.length === 0) { // (maj 30/05 - Robustesse)
        console.warn(`No skills defined for panel type: ${panelType}`);
        return;
    }

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
            // Vérifie si toutes les compétences de l'étage précédent sont au niveau max
            allPreviousTierMaxed = previousTierSkills.every(s => (skillLevels[s.id] || 0) >= s.maxLevel);
        }

        skillsInThisTier.forEach(skill => {
            const currentLevel = skillLevels[skill.id] || 0;
            const isMaxLevel = currentLevel >= skill.maxLevel;
            // Une compétence est déverrouillable si son étage est déverrouillable ET ses prérequis sont remplis
            const canUnlockTier = allPreviousTierMaxed || tier === 1; // Le premier étage est toujours déverrouillable
            const prerequisitesMet = skill.prerequisites ? skill.prerequisites.every(prereqId => {
                const prereqSkill = skillsInPanel.find(s => s.id === prereqId);
                // Vérifie si le prérequis est au niveau max
                return prereqSkill && (skillLevels[prereqId] || 0) >= prereqSkill.maxLevel;
            }) : true;
            const isLocked = !canUnlockTier || !prerequisitesMet || skillPoints.lt(1) || isMaxLevel; // (maj 30/05 - Logique prérequis)

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

            let tooltipMessages = [];
            if (!isMaxLevel && skill.id !== 'S5_2_Secret') {
                tooltipMessages.push(`<span class="skill-cost images-color">Coût: 1 point de compétence</span>`);
            }
            if (!canUnlockTier) {
                tooltipMessages.push(`<span style="color:red;">Débloquez l'étage précédent</span>`);
            }
            if (!prerequisitesMet) {
                tooltipMessages.push(`<span style="color:red;">Prérequis non remplis</span>`); // (maj 30/05 - Logique prérequis)
            }
            if (canUnlockTier && prerequisitesMet && skillPoints.lt(1) && !isMaxLevel && skill.id !== 'S5_2_Secret') {
                tooltipMessages.push(`<span style="color:red;">Pas assez de points</span>`);
            }
            if (skill.id === 'S5_2_Secret') {
                tooltipMessages.push(`Clics: ${secretSkillClicks}/${skill.maxLevel}`);
            }


            skillBox.innerHTML = `
                <span class="skill-name">${skill.name}</span>
                <span class="skill-level">Niveau ${currentLevel}/${skill.maxLevel}</span>
                <div class="tooltip-text">
                    <strong>${skill.name}</strong><br>
                    ${skill.description}<br>
                    ${tooltipMessages.join('<br>')}
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
    if (!questsListDiv || !completedQuestsListDiv) return; // (maj 30/05 - Robustesse DOM)

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
                case 'images': currentVal = images; break; // (maj 30/05 - Ajout fonctionnalité)
                default:
                    console.warn(`Unknown quest targetType: ${quest.targetType}`);
                    break;
            }
            // Assurez-vous que quest.targetValue est un Decimal pour la comparaison
            const targetValueDecimal = new Decimal(quest.targetValue);
            progressText = `<p>Progrès : <span class="info-color">${formatNumber(currentVal, 0)}/${formatNumber(targetValueDecimal, 0)}</span></p>`;
        }

        questDiv.innerHTML = `
            <h4>${quest.name}</h4>
            <p>${quest.description}</p>
            ${progressText}
            ${quest.completed ? `<p class="info-color">Récompense : ${quest.rewardMessage || 'Terminée !'}</p>` : ''}
        `;

        // Ajoute un attribut data-quest-id pour faciliter la gestion des clics dans events.js
        questDiv.dataset.questId = quest.id;

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
    if (!achievementsGrid) return; // (maj 30/05 - Robustesse DOM)

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
    const achievementTooltip = document.getElementById('achievementTooltip');
    if (!achievementTooltip) return; // (maj 30/05 - Robustesse DOM)

    // N'affiche que si aucune infobulle n'est actuellement cliquée et affichée
    if (activeAchievementTooltip && activeAchievementTooltip.classList.contains('clicked')) return;

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
    if (!achievementTooltip) return; // (maj 30/05 - Robustesse DOM)

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
    if (!achievementTooltip) return; // (maj 30/05 - Robustesse DOM)

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
        // (maj 30/05 Quete)
        const domElementsForQuests = {
            questsGridContainer: document.getElementById('questsList'), // ID du conteneur principal de la liste des quêtes
            questsCompletedCountDisplay: document.getElementById('questsCompletedCount'), // ID pour le compteur de quêtes complétées
            questsTotalCountDisplay: document.getElementById('questsTotalCount') // ID pour le compteur total de quêtes
        };
        if (domElementsForQuests.questsGridContainer) {
            renderQuestsFromQuestsJS(domElementsForQuests);
        }
        if (domElementsForQuests.questsCompletedCountDisplay && domElementsForQuests.questsTotalCountDisplay) {
            updateQuestsUIFromQuestsJS(domElementsForQuests);
        }
    } else if (tabContainer === document.getElementById('achievementsContainer')) {
        renderAchievements();
    } else if (tabContainer === document.getElementById('settingsContainer')) {
        updateSettingsButtonStates(); // (maj 30/05 - Appel fonction thème)
    }
    // Appel global de updateDisplay pour s'assurer que tout est à jour
    updateDisplay();
}

/**
 * Ouvre la modale des statistiques et met à jour son contenu.
 */
export function openStatsModal() {
    updateStatsDisplay();
    const statsModal = document.getElementById('statsModal');
    if (statsModal) statsModal.style.display = 'flex'; // (maj 30/05 - Robustesse DOM)
}

/**
 * Ferme la modale des statistiques.
 */
export function closeStatsModal() {
    const statsModal = document.getElementById('statsModal');
    if (statsModal) statsModal.style.display = 'none'; // (maj 30/05 - Robustesse DOM)
}

/**
 * Met à jour les valeurs affichées dans la modale des statistiques.
 */
export function updateStatsDisplay() {
    // Production Globale
    const statsCurrentBPS = document.getElementById('statsCurrentBPS');
    if (statsCurrentBPS) statsCurrentBPS.textContent = formatNumber(totalBonsPointsParSeconde, 2); // (maj 30/05 - Robustesse DOM)

    const statsSkillBonus = document.getElementById('statsSkillBonus');
    if (statsSkillBonus) statsSkillBonus.textContent = formatNumber(skillEffects.allBpsMultiplier.sub(1).mul(100), 2) + '%'; // Utilise allBpsMultiplier pour le bonus global (maj 30/05 - Logique stats)

    const statsAscensionBonus = document.getElementById('statsAscensionBonus');
    if (statsAscensionBonus) statsAscensionBonus.textContent = formatNumber(ascensionBonus, 2) + 'x'; // (maj 30/05 - Robustesse DOM)

    const statsPrestigeBPSBonus = document.getElementById('statsPrestigeBPSBonus');
    if (statsPrestigeBPSBonus) statsPrestigeBPSBonus.textContent = formatNumber(getPrestigeBonusMultiplier('bps', prestigeCount, prestigePoints), 2) + 'x'; // (maj 30/05 - Robustesse DOM)

    const statsAchievementBPSBonus = document.getElementById('statsAchievementBPSBonus');
    if (statsAchievementBPSBonus) statsAchievementBPSBonus.textContent = formatNumber(permanentBpsBonusFromAchievements.mul(100), 2) + '%'; // (maj 30/05 - Robustesse DOM)

    const statsAllBPSMultiplier = document.getElementById('statsAllBPSMultiplier');
    if (statsAllBPSMultiplier) statsAllBPSMultiplier.textContent = formatNumber(skillEffects.allBpsMultiplier, 2) + 'x'; // (maj 30/05 - Robustesse DOM)


    // Ressources et Multiplicateurs
    const statsBonsPoints = document.getElementById('statsBonsPoints');
    if (statsBonsPoints) statsBonsPoints.textContent = formatNumber(bonsPoints, 0); // (maj 30/05 - Robustesse DOM)

    const statsImages = document.getElementById('statsImages');
    if (statsImages) statsImages.textContent = formatNumber(images, 0); // (maj 30/05 - Robustesse DOM)

    const statsProfesseur = document.getElementById('statsProfesseur');
    if (statsProfesseur) statsProfesseur.textContent = formatNumber(nombreProfesseur, 0); // (maj 30/05 - Robustesse DOM)

    const statsProfMultiplier = document.getElementById('statsProfMultiplier');
    if (statsProfMultiplier) statsProfMultiplier.textContent = formatNumber(skillEffects.licenceProfMultiplier.mul(100), 2) + '%'; // Correction: Utilise skillEffects.licenceProfMultiplier (maj 30/05 - Correction variable)

    const statsAscensionPoints = document.getElementById('statsAscensionPoints');
    if (statsAscensionPoints) statsAscensionPoints.textContent = formatNumber(ascensionPoints, 0); // (maj 30/05 - Robustesse DOM)

    const statsPrestigePoints = document.getElementById('statsPrestigePoints');
    if (statsPrestigePoints) statsPrestigePoints.textContent = formatNumber(prestigePoints, 0); // (maj 30/05 - Robustesse DOM)


    // Coûts et Réductions
    const statsEleveCostReduction = document.getElementById('statsEleveCostReduction');
    if (statsEleveCostReduction) statsEleveCostReduction.textContent = formatNumber(skillEffects.eleveCostReduction.mul(100), 2) + '%'; // (maj 30/05 - Robustesse DOM)

    const statsClasseCostReduction = document.getElementById('statsClasseCostReduction');
    if (statsClasseCostReduction) statsClasseCostReduction.textContent = formatNumber(skillEffects.classeCostReduction.mul(100), 2) + '%'; // (maj 30/05 - Robustesse DOM)

    const statsImageCostReduction = document.getElementById('statsImageCostReduction');
    if (statsImageCostReduction) statsImageCostReduction.textContent = formatNumber(skillEffects.imageCostReduction.mul(100), 2) + '%'; // (maj 30/05 - Robustesse DOM)

    const statsProfesseurCostReduction = document.getElementById('statsProfesseurCostReduction');
    if (statsProfesseurCostReduction) statsProfesseurCostReduction.textContent = formatNumber(skillEffects.ProfesseurCostReduction.mul(100), 2) + '%'; // (maj 30/05 - Robustesse DOM)

    const statsEcoleCostReduction = document.getElementById('statsEcoleCostReduction');
    if (statsEcoleCostReduction) statsEcoleCostReduction.textContent = formatNumber(skillEffects.ecoleCostReduction.mul(100), 2) + '%'; // (maj 30/05 - Robustesse DOM)

    const statsAutomationCostReduction = document.getElementById('statsAutomationCostReduction');
    if (statsAutomationCostReduction) statsAutomationCostReduction.textContent = formatNumber(skillEffects.automationCostReduction.mul(100), 2) + '%'; // (maj 30/05 - Robustesse DOM)

    const statsAllCostReduction = document.getElementById('statsAllCostReduction');
    if (statsAllCostReduction) statsAllCostReduction.textContent = formatNumber(skillEffects.allCostReduction.mul(100), 2) + '%'; // (maj 30/05 - Robustesse DOM)


    // Bonus Spécifiques
    const statsClickBPSBonus = document.getElementById('statsClickBPSBonus');
    if (statsClickBPSBonus) statsClickBPSBonus.textContent = formatNumber(skillEffects.clickBonsPointsBonus, 2); // (maj 30/05 - Robustesse DOM)

    const statsPAGainMultiplier = document.getElementById('statsPAGainMultiplier');
    if (statsPAGainMultiplier) { // (maj 30/05 - Robustesse DOM)
        // Calcul du multiplicateur total de gain de PA
        let totalPAGainMult = new Decimal(1);
        totalPAGainMult = totalPAGainMult.add(paMultiplierFromQuests); // Bonus des quêtes
        totalPAGainMult = totalPAGainMult.add(skillEffects.paGainMultiplier); // Bonus des compétences
        // Ajout du bonus du Post-Doctorat
        const postDoctoratData = prestigePurchasesData.find(p => p.id === 'postDoctorat');
        if (postDoctoratData) {
            totalPAGainMult = totalPAGainMult.add(postDoctoratData.getEffectValue().sub(1).mul(nombrePostDoctorat));
        }
        statsPAGainMultiplier.textContent = formatNumber(totalPAGainMult.sub(1).mul(100), 2) + '%'; // (maj 30/05 - Logique stats PA)
    }

    const statsAscensionBonusIncrease = document.getElementById('statsAscensionBonusIncrease');
    if (statsAscensionBonusIncrease) statsAscensionBonusIncrease.textContent = formatNumber(skillEffects.ascensionBonusIncrease, 2) + 'x'; // (maj 30/05 - Robustesse DOM)

    const statsOfflineProductionIncrease = document.getElementById('statsOfflineProductionIncrease');
    if (statsOfflineProductionIncrease) statsOfflineProductionIncrease.textContent = formatNumber(skillEffects.offlineProductionIncrease.mul(100), 2) + '%'; // (maj 30/05 - Robustesse DOM)

    const statsAllProductionMultiplier = document.getElementById('statsAllProductionMultiplier');
    if (statsAllProductionMultiplier) statsAllProductionMultiplier.textContent = formatNumber(skillEffects.allProductionMultiplier.mul(100), 2) + '%'; // (maj 30/05 - Robustesse DOM)


    // Progression
    const statsTotalClicks = document.getElementById('statsTotalClicks');
    if (statsTotalClicks) statsTotalClicks.textContent = formatNumber(totalClicks, 0); // (maj 30/05 - Robustesse DOM)

    const statsAscensionCount = document.getElementById('statsAscensionCount');
    if (statsAscensionCount) statsAscensionCount.textContent = formatNumber(ascensionCount, 0); // (maj 30/05 - Robustesse DOM)

    const statsTotalPAEarned = document.getElementById('statsTotalPAEarned');
    if (statsTotalPAEarned) statsTotalPAEarned.textContent = formatNumber(totalPAEarned, 0); // (maj 30/05 - Robustesse DOM)

    const statsPrestigeCount = document.getElementById('statsPrestigeCount');
    if (statsPrestigeCount) statsPrestigeCount.textContent = formatNumber(prestigeCount, 0); // (maj 30/05 - Robustesse DOM)


    // Compétences (ajout des éléments manquants) (maj 30/05 - Ajout stats compétences)
    const statsStudiesSkillPoints = document.getElementById('statsStudiesSkillPoints');
    if (statsStudiesSkillPoints) statsStudiesSkillPoints.textContent = formatNumber(studiesSkillPoints, 0);

    const statsAscensionSkillPoints = document.getElementById('statsAscensionSkillPoints');
    if (statsAscensionSkillPoints) statsAscensionSkillPoints.textContent = formatNumber(ascensionSkillPoints, 0);

    const statsPrestigeSkillPoints = document.getElementById('statsPrestigeSkillPoints');
    if (statsPrestigeSkillPoints) statsPrestigeSkillPoints.textContent = formatNumber(prestigeSkillPoints, 0);

    const statsStudiesSkillsUnlockedCount = document.getElementById('statsStudiesSkillsUnlockedCount');
    if (statsStudiesSkillsUnlockedCount) statsStudiesSkillsUnlockedCount.textContent = Object.keys(studiesSkillLevels).filter(id => (studiesSkillLevels[id] || 0) > 0).length;

    const statsAscensionSkillsUnlockedCount = document.getElementById('statsAscensionSkillsUnlockedCount');
    if (statsAscensionSkillsUnlockedCount) statsAscensionSkillsUnlockedCount.textContent = Object.keys(ascensionSkillLevels).filter(id => (ascensionSkillLevels[id] || 0) > 0).length;

    const statsPrestigeSkillsUnlockedCount = document.getElementById('statsPrestigeSkillsUnlockedCount');
    if (statsPrestigeSkillsUnlockedCount) statsPrestigeSkillsUnlockedCount.textContent = Object.keys(prestigeSkillLevels).filter(id => (prestigeSkillLevels[id] || 0) > 0).length;


    // Bonus Prestige Spécifiques
    const licenceData = prestigePurchasesData.find(p => p.id === 'licence');
    const statsLicenceBoost = document.getElementById('statsLicenceBoost');
    if (statsLicenceBoost && licenceData) statsLicenceBoost.textContent = formatNumber(licenceData.getEffectValue().sub(1).mul(100), 2) + '%'; // (maj 30/05 - Robustesse DOM)

    const master1Data = prestigePurchasesData.find(p => p.id === 'master1');
    const statsMaster1Boost = document.getElementById('statsMaster1Boost');
    if (statsMaster1Boost && master1Data) statsMaster1Boost.textContent = formatNumber(master1Data.getEffectValue().sub(1).mul(100), 2) + '%'; // (maj 30/05 - Robustesse DOM)

    const master2Data = prestigePurchasesData.find(p => p.id === 'master2');
    const statsMaster2Boost = document.getElementById('statsMaster2Boost');
    if (statsMaster2Boost && master2Data) statsMaster2Boost.textContent = formatNumber(master2Data.getEffectValue().sub(1).mul(100), 2) + '%'; // (maj 30/05 - Robustesse DOM)

    const doctoratData = prestigePurchasesData.find(p => p.id === 'doctorat');
    const statsDoctoratBPSBoost = document.getElementById('statsDoctoratBPSBoost');
    const statsDoctoratMinClasses = document.getElementById('statsDoctoratMinClasses');
    if (statsDoctoratBPSBoost && statsDoctoratMinClasses && doctoratData) { // (maj 30/05 - Robustesse DOM)
        statsDoctoratBPSBoost.textContent = formatNumber(doctoratData.getEffectValue().sub(1).mul(100), 2) + '%';
        statsDoctoratMinClasses.textContent = formatNumber(doctoratData.getMinClasses(), 0);
    }

    const postDoctoratData = prestigePurchasesData.find(p => p.id === 'postDoctorat');
    const statsPostDoctoratBoost = document.getElementById('statsPostDoctoratBoost');
    if (statsPostDoctoratBoost && postDoctoratData) statsPostDoctoratBoost.textContent = formatNumber(postDoctoratData.getEffectValue().sub(1).mul(100), 2) + '%'; // (maj 30/05 - Robustesse DOM)
}
