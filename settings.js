// ------------------ Fiche Mémo : settings.js ----------------------------
//
// Description : Ce fichier gère la logique des différentes options de paramètres du jeu,
// permettant au joueur de personnaliser son expérience. Il est responsable de la
// modification de l'état du jeu concernant le thème visuel (jour/nuit), l'activation
// ou la désactivation de la progression hors ligne, et la bascule de l'affichage
// minimaliste des ressources. Il inclut également la fonction pour ouvrir la modale
// des statistiques.
//
// Objectif : Fournir un contrôle centralisé sur les préférences du joueur, en traduisant
// les interactions de l'interface utilisateur en modifications de l'état du jeu et en
// assurant la persistance de ces paramètres.
//
// ------------------ Dépendances (Imports) ------------------
//
// - De './core.js' :
//   - Variables d'état (lecture et modification) : `isDayTheme`, `offlineProgressEnabled`,
//     `minimizeResourcesActive`, `themeOptionUnlocked`, `images`, `newSettingsUnlocked`,
//     `statsButtonUnlocked`.
//   - Fonctions : `saveGameState`.
//   Impact : Accès et modification des préférences du joueur et gestion de la sauvegarde.
//
// - De './ui.js' :
//   - Fonctions : `openStatsModal`, `closeStatsModal`, `updateSectionVisibility`,
//     `updateSettingsButtonStates`, `showNotification`, `updateDisplay`.
//   Impact : Permet de rafraîchir l'interface utilisateur en réponse aux changements de paramètres,
//            d'afficher des notifications et de gérer la modale des statistiques.
//
// ------------------ Variables Clés (utilisées par settings.js, mais définies ailleurs et importées) ------------------
//
// - `isDayTheme` (boolean) : Indique si le thème de jour est actif. (maj 30/05 theme & style)
// - `offlineProgressEnabled` (boolean) : Indique si la progression hors ligne est activée.
// - `minimizeResourcesActive` (boolean) : Indique si l'affichage minimaliste des ressources est activé.
// - `themeOptionUnlocked` (boolean) : Indique si l'option de changement de thème a été débloquée. (maj 30/05 theme & style)
// - `images` (Decimal) : Ressource "Images" utilisée comme coût pour débloquer le thème. (maj 30/05 theme & style)
// - `newSettingsUnlocked` (boolean) : Flag pour débloquer de nouveaux paramètres.
// - `statsButtonUnlocked` (boolean) : Flag pour débloquer le bouton des statistiques.
//
// ------------------ Fonctions Clés Définies et Exportées ------------------
//
// - `toggleTheme()` : (maj 30/05 theme & style)
//   Description : Bascule l'état du thème visuel entre le mode jour et le mode nuit.
//   Si l'option de thème n'est pas encore débloquée (`themeOptionUnlocked` est false),
//   elle vérifie si le joueur possède suffisamment d'`images` (coût : 10 Images) pour la débloquer.
//   Une fois débloquée ou si elle l'était déjà, elle inverse la valeur de `isDayTheme`
//   et applique la classe CSS correspondante (`dark-theme` ou non) à l'élément `<body>`.
//   Elle déclenche ensuite une mise à jour de l'interface et une sauvegarde du jeu.
//   Appelée par : `events.js` (via le clic sur le bouton de thème ou le sélecteur).
//   Impacts : Modifie l'apparence globale du jeu via `style.css`.
//
// - `toggleOfflineProgress(isChecked)` :
//   Description : Active ou désactive la fonctionnalité de progression hors ligne.
//   Met à jour la variable d'état `offlineProgressEnabled` en fonction de la valeur
//   `isChecked` (provenant d'une case à cocher). Affiche une notification et sauvegarde le jeu.
//   Appelée par : `events.js` (via le changement d'état de la case à cocher).
//   Impacts : Affecte les calculs de progression du jeu lorsque le joueur est absent.
//
// - `toggleMinimizeResources()` :
//   Description : Bascule l'affichage entre le mode normal des ressources et un mode minimaliste.
//   Inverse la valeur de `minimizeResourcesActive`. Appelle `updateSectionVisibility()`
//   pour gérer l'affichage/masquage du panneau minimaliste et `updateDisplay()` pour rafraîchir
//   les valeurs. Sauvegarde l'état du jeu.
//   Appelée par : `events.js` (via le clic sur le bouton "Minimalist Resources").
//   Impacts : Modifie la disposition et la quantité d'informations affichées sur les ressources.
//
// - `openStats()` :
//   Description : Ouvre la modale des statistiques du jeu. Appelle la fonction
//   `openStatsModal()` de `ui.js` pour gérer l'affichage de la modale.
//   Appelée par : `events.js` (via le clic sur le bouton "Statistiques").
//   Impacts : Affiche un résumé détaillé des progrès du joueur.
//
// ------------------ Éléments DOM Clés (Interagis par settings.js) ------------------
//
// Ce module interagit directement avec l'élément `<body>` pour appliquer les classes de thème.
// Il ne récupère pas directement d'autres éléments DOM par `document.getElementById` ;
// les interactions avec les contrôles de l'interface utilisateur (sélecteur de thème,
// cases à cocher, boutons) sont gérées par `events.js` qui appelle les fonctions de ce module.
//
// - `document.body` : L'élément `<body>` de `index.html`. Les classes `dark-theme`
//   (ou l'absence de celle-ci) sont appliquées ici pour changer l'apparence globale. (maj 30/05 theme & style)
//
// ------------------ Logique Générale ------------------
//
// `settings.js` est une couche de contrôle pour les préférences du joueur. Il ne contient
// pas de logique de jeu complexe (calculs de production, achats d'unités). Au lieu de cela,
// il modifie des variables d'état globales (`core.js`) et interagit avec la couche UI
// (`ui.js`) pour refléter ces changements visuellement. Les appels à `saveGameState()`
// sont cruciaux pour que les préférences du joueur soient persistantes entre les sessions.
//
// ---------------------------------------------------------------------

// --- Imports des modules nécessaires ---
import {
    isDayTheme, images, themeOptionUnlocked, offlineProgressEnabled,
    minimizeResourcesActive, newSettingsUnlocked, statsButtonUnlocked, saveGameState
} from './core.js';

import { openStatsModal, closeStatsModal, updateSectionVisibility, updateSettingsButtonStates, showNotification, updateDisplay, } from './ui.js';

/**
 * Bascule entre le thème jour et nuit.
 * Gère également le coût de déverrouillage de l'option de thème si elle n'est pas déjà débloquée.
 * (maj 30/05 theme & style)
 */
export function toggleTheme() {
    if (!themeOptionUnlocked) {
        if (images.gte(10)) { // (maj 30/05 theme & style)
            images.sub(10); // Déduire le coût (maj 30/05 theme & style)
            themeOptionUnlocked = true; // Débloquer l'option (maj 30/05 theme & style)
            showNotification("Option Thème débloquée ! (maj 30/05 theme & style)");
            // Appliquer le thème après déverrouillage (maj 30/05 theme & style)
            isDayTheme = !isDayTheme; // (maj 30/05 theme & style)
            document.body.classList.toggle('dark-theme', !isDayTheme); // (maj 30/05 theme & style)
        } else {
            showNotification("Pas assez d'images (coût : 10 I) ! (maj 30/05 theme & style)");
            return;
        }
    } else {
        // L'option est déjà débloquée, il suffit de basculer le thème (maj 30/05 theme & style)
        isDayTheme = !isDayTheme; // (maj 30/05 theme & style)
        document.body.classList.toggle('dark-theme', !isDayTheme); // (maj 30/05 theme & style)
        showNotification(`Thème : ${isDayTheme ? 'Jour' : 'Nuit'}. (maj 30/05 theme & style)`);
    }

    // Mettre à jour l'affichage et sauvegarder l'état
    updateSettingsButtonStates(); // Met à jour l'état du bouton de thème (maj 30/05 theme & style)
    updateDisplay(); // Rafraîchit l'affichage général (maj 30/05 theme & style)
    saveGameState(); // Sauvegarde la nouvelle préférence de thème (maj 30/05 theme & style)
}

/**
 * Active ou désactive la progression hors ligne.
 * @param {boolean} isChecked L'état de la case à cocher (true pour activé, false pour désactivé).
 */
export function toggleOfflineProgress(isChecked) {
    offlineProgressEnabled = isChecked;
    showNotification(`Progression hors ligne ${offlineProgressEnabled ? 'activée' : 'désactivée'}.`);
    saveGameState();
}

/**
 * Active ou désactive l'affichage minimaliste des ressources.
 */
export function toggleMinimizeResources() {
    minimizeResourcesActive = !minimizeResourcesActive;
    updateSectionVisibility(); // Cette fonction de ui.js gérera l'affichage/masquage
    updateDisplay(); // Mettre à jour les valeurs dans le nouvel affichage
    saveGameState();
}

/**
 * Ouvre la modale des statistiques.
 */
export function openStats() {
    openStatsModal(); // Appelle la fonction d'ouverture de la modale définie dans ui.js
}

// Note : La logique de réinitialisation complète (hard reset) est gérée
// directement dans events.js qui appelle hardResetGame() de core.js
// après confirmation via une modale personnalisée.
