/**
 * prestige.js
 *
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
 * prestigePoints, nombreLicences, nombreMaster1, nombreMaster2, nombreDoctorat,
 * nombrePostDoctorat, saveGameState, checkUnlockConditions, resetGameVariables, applyAllSkillEffects, prestigeUnlocked).
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

// Importations des variables d'état et fonctions globales depuis core.js
import {
    totalPAEarned,
    prestigeCount,
    prestigePoints,
    nombreLicences,
    nombreMaster1,
    nombreMaster2,
    nombreDoctorat,
    nombrePostDoctorat,
    checkUnlockConditions,
    resetGameVariables, // Fonction de réinitialisation du jeu
    applyAllSkillEffects,
    saveGameState,
    formatNumber, // viens de core.js, pas ui.js 
    prestigeUnlocked // Flag de déverrouillage du menu de Prestige
} from './core.js'; // Assurez-vous que le chemin est correct

// Importations des fonctions de calcul de coût/bonus et des données de prestige depuis data.js
import {
    PRESTIGE_POINT_THRESHOLD, // Seuil de PA total pour gagner 1 PP
    prestigePurchasesData // Données des achats de prestige
} from './data.js'; // Assurez-vous que le chemin est correct

// Importations des fonctions d'UI depuis ui.js
import {
    showNotification,
    updateDisplay
} from './ui.js'; // Assurez-vous que le chemin est correct

/**
 * Calcule le nombre de Points de Prestige que le joueur gagnerait s'il effectuait un Prestige maintenant.
 * Basé sur le total cumulé de Points d'Ascension gagnés (totalPAEarned).
 * @returns {Decimal} Le nombre de Points de Prestige potentiels.
 */
export function calculatePotentialPrestigePoints() {
    // Le nombre de PP gagnés est basé sur totalPAEarned divisé par un seuil.
    // Chaque tranche du seuil donne 1 PP.
    if (totalPAEarned.lt(PRESTIGE_POINT_THRESHOLD)) {
        return new Decimal(0);
    }
    return totalPAEarned.div(PRESTIGE_POINT_THRESHOLD).floor();
}

/**
 * Exécute le processus de Prestige.
 * Réinitialise le jeu (plus profondément que l'Ascension), ajoute les PP gagnés et déclenche les mises à jour nécessaires.
 * Cette fonction est appelée par events.js.
 */
export function performPrestige() {
    const potentialPP = calculatePotentialPrestigePoints();

    if (potentialPP.lt(1)) {
        showNotification("Pas assez de Points d'Ascension cumulés pour Prestiger !");
        return;
    }

    // Confirmation du Prestige (utilisation d'une notification personnalisée au lieu d'alert/confirm)
    showNotification(`Prestige en cours ! Vous gagnez ${formatNumber(potentialPP, 0)} Points de Prestige.`);

    // Incrémenter le compteur de Prestige
    prestigeCount.add(1); // Utilisation de .add() pour Decimal

    // Ajouter les Points de Prestige gagnés
    prestigePoints.add(potentialPP); // Utilisation de .add() pour Decimal

    // Réinitialiser l'état du jeu (réinitialisation complète sauf les bonus permanents et les PP)
    resetGameVariables(false); // Passer 'false' pour indiquer une réinitialisation de Prestige (plus profonde)

    // Appliquer tous les effets de compétences (y compris les bonus permanents de Prestige)
    applyAllSkillEffects();

    // Mettre à jour l'interface utilisateur
    updatePrestigeUI();
    updatePrestigeButtonStates();
    updateDisplay(); // Rafraîchit l'affichage global

    // Sauvegarder l'état du jeu
    saveGameState();

    showNotification("Prestige terminé ! La connaissance est infinie.");
}

/**
 * Gère la logique d'achat pour les améliorations de prestige (Licence, Master, Doctorat, Post-Doctorat).
 * @param {string} purchaseId - L'ID unique de l'achat de prestige (ex: 'licence', 'master1').
 */
export function performPrestigePurchase(purchaseId) {
    const purchase = prestigePurchasesData[purchaseId];

    if (!purchase) {
        console.error(`Achat de prestige non trouvé : ${purchaseId}`);
        return;
    }

    let currentCounter;
    switch (purchaseId) {
        case 'licence': currentCounter = nombreLicences; break;
        case 'master1': currentCounter = nombreMaster1; break;
        case 'master2': currentCounter = nombreMaster2; break;
        case 'doctorat': currentCounter = nombreDoctorat; break;
        case 'postDoctorat': currentCounter = nombrePostDoctorat; break;
        default:
            console.error(`Compteur d'achat de prestige inconnu pour : ${purchaseId}`);
            return;
    }

    const cost = new Decimal(purchase.baseCost).mul(Decimal.pow(purchase.costMultiplier, currentCounter));

    if (prestigePoints.gte(cost)) {
        prestigePoints.sub(cost); // Utilisation de .sub() pour Decimal
        currentCounter.add(1); // Incrémente le compteur de l'achat

        // Mettre à jour la variable globale correspondante (nécessite une mutation directe ou une fonction de mise à jour dans core.js)
        // Pour l'exemple, nous allons muter directement, mais une fonction setNombreLicences() etc. serait préférable
        switch (purchaseId) {
            case 'licence': nombreLicences.add(1); break;
            case 'master1': nombreMaster1.add(1); break;
            case 'master2': nombreMaster2.add(1); break;
            case 'doctorat': nombreDoctorat.add(1); break;
            case 'postDoctorat': nombrePostDoctorat.add(1); break;
        }

        applyAllSkillEffects(); // Réapplique tous les effets (pour les bonus de production)
        showNotification(`Acheté "${purchase.name}" !`);
    } else {
        showNotification(`Pas assez de Points de Prestige pour acheter "${purchase.name}" ! (Coût: ${formatNumber(cost, 0)} PP)`);
        return;
    }

    checkUnlockConditions(); // Vérifie si de nouvelles choses sont débloquées
    updatePrestigeUI(); // Met à jour l'interface de prestige
    renderPrestigePurchases(); // Rafraîchit les boutons d'achats de prestige
    updateDisplay(); // Rafraîchit l'affichage global
    saveGameState(); // Sauvegarde l'état du jeu
}

/**
 * Met à jour l'affichage des informations de Prestige dans l'interface utilisateur.
 * Cette fonction est appelée par ui.js.
 * @param {object} domElements - Un objet contenant les références aux éléments DOM nécessaires.
 * Ex: { prestigePointsDisplay, prestigeCountDisplay, prestigeMenuContainer }
 */
export function updatePrestigeUI(domElements) {
    const { prestigePointsDisplay, prestigeCountDisplay, prestigeMenuContainer } = domElements;

    if (prestigePointsDisplay) prestigePointsDisplay.textContent = formatNumber(prestigePoints, 0);
    if (prestigeCountDisplay) prestigeCountDisplay.textContent = formatNumber(prestigeCount, 0);

    // Contrôler la visibilité du menu de Prestige
    if (prestigeMenuContainer) {
        prestigeMenuContainer.style.display = prestigeUnlocked ? 'block' : 'none';
    }
}

/**
 * Met à jour l'état (texte, classes CSS) du bouton de Prestige.
 * Cette fonction est appelée par ui.js.
 * @param {object} domElements - Un objet contenant les références aux éléments DOM nécessaires.
 * Ex: { prestigeButton }
 */
export function updatePrestigeButtonStates(domElements) {
    const { prestigeButton } = domElements;
    const potentialPP = calculatePotentialPrestigePoints();

    if (!prestigeButton) return;

    if (potentialPP.gte(1)) {
        prestigeButton.innerHTML = `Prestiger ! Gagner ${formatNumber(potentialPP, 0)} PP`;
        prestigeButton.classList.add('can-prestige');
        prestigeButton.classList.remove('cannot-prestige');
    } else {
        prestigeButton.innerHTML = `Pas assez de PA pour Prestiger (besoin de ${formatNumber(PRESTIGE_POINT_THRESHOLD, 0)} PA)`;
        prestigeButton.classList.add('cannot-prestige');
        prestigeButton.classList.remove('can-prestige');
    }
}

/**
 * Construit ou met à jour dynamiquement la structure HTML des achats de prestige.
 * Cette fonction est appelée par ui.js.
 * @param {object} domElements - Un objet contenant les références aux éléments DOM nécessaires.
 * Ex: { prestigePurchasesGrid }
 */
export function renderPrestigePurchases(domElements) {
    const { prestigePurchasesGrid } = domElements;

    if (!prestigePurchasesGrid) return;

    prestigePurchasesGrid.innerHTML = ''; // Nettoyer la grille avant de la reconstruire

    for (const purchaseId in prestigePurchasesData) {
        const purchase = prestigePurchasesData[purchaseId];

        let currentCounter;
        switch (purchaseId) {
            case 'licence': currentCounter = nombreLicences; break;
            case 'master1': currentCounter = nombreMaster1; break;
            case 'master2': currentCounter = nombreMaster2; break;
            case 'doctorat': currentCounter = nombreDoctorat; break;
            case 'postDoctorat': currentCounter = nombrePostDoctorat; break;
            default: continue; // Skip if unknown
        }

        const cost = new Decimal(purchase.baseCost).mul(Decimal.pow(purchase.costMultiplier, currentCounter));

        const purchaseDiv = document.createElement('div');
        purchaseDiv.classList.add('prestige-purchase-item');
        purchaseDiv.dataset.purchaseId = purchaseId;

        const canAfford = prestigePoints.gte(cost);

        if (canAfford) {
            purchaseDiv.classList.add('can-afford');
        } else {
            purchaseDiv.classList.add('cannot-afford');
        }

        purchaseDiv.innerHTML = `
            <h3>${purchase.name} (Niv. ${formatNumber(currentCounter, 0)})</h3>
            <p>${purchase.description}</p>
            <p class="prestige-cost">Coût: ${formatNumber(cost, 0)} PP</p>
            <p class="prestige-effect">Effet: ${purchase.effectDescription}</p>
        `;

        purchaseDiv.addEventListener('click', () => performPrestigePurchase(purchaseId));

        prestigePurchasesGrid.appendChild(purchaseDiv);
    }
}
