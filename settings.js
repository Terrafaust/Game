// Fiche Mémo : settings.js
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
import {
    isDayTheme, images, themeOptionUnlocked, offlineProgressEnabled,
    minimizeResourcesActive, newSettingsUnlocked, statsButtonUnlocked,
    showNotification, saveGameState, updateDisplay, updateSectionVisibility,
    updateSettingsButtonStates
} from './core.js';

import { openStatsModal, closeStatsModal } from './ui.js'; // closeStatsModal est exporté mais géré par events.js

/**
 * Bascule entre le thème jour et nuit.
 * Gère également le coût de déverrouillage de l'option de thème si elle n'est pas déjà débloquée.
 */
export function toggleTheme() {
    // Accéder aux variables globales via window si elles ne sont pas importées directement
    // ou si elles sont définies comme des variables globales dans core.js sans 'export let'.
    // Pour cet exemple, nous supposons qu'elles sont importées comme des 'let' modifiables.

    if (!themeOptionUnlocked) {
        if (images.gte(10)) {
            images.sub(10); // Déduire le coût
            themeOptionUnlocked = true; // Débloquer l'option
            showNotification("Option Thème débloquée !");
            // Appliquer le thème après déverrouillage
            isDayTheme = !isDayTheme;
            document.body.classList.toggle('dark-theme', !isDayTheme);
        } else {
            showNotification("Pas assez d'images (coût : 10 I) !");
            return;
        }
    } else {
        // L'option est déjà débloquée, il suffit de basculer le thème
        isDayTheme = !isDayTheme;
        document.body.classList.toggle('dark-theme', !isDayTheme);
        showNotification(`Thème : ${isDayTheme ? 'Jour' : 'Nuit'}.`);
    }

    // Mettre à jour l'affichage et sauvegarder l'état
    updateSettingsButtonStates(); // Met à jour l'état du bouton de thème
    updateDisplay(); // Rafraîchit l'affichage général
    saveGameState(); // Sauvegarde la nouvelle préférence de thème
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
