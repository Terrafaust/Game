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

// Importations des variables d'état et fonctions globales depuis core.js
import {
    bonsPoints,
    images,
    nombreEleves,
    nombreClasses,
    nombreProfesseur,
    totalBonsPointsParSeconde, // Pour le calcul du bonus de clic
    totalClicks,
    skillEffects,
    currentPurchaseMultiplier,
    checkUnlockConditions,
    saveGameState,
    applyAllSkillEffects,
    calculateTotalBPS,
    studiesSkillPoints,
    ascensionSkillPoints,
    nombreLicences,
    nombreMaster1,
    nombreMaster2,
    nombreDoctorat,
    prestigeCount,
    prestigePoints,
    elevesUnlocked,
    classesUnlocked,
    imagesUnlocked,
    ProfesseurUnlocked,
    formatNumber // Import formatNumber from core.js
} from './core.js';

// Importations des données de prestige depuis data.js
import {
    prestigePurchasesData
} from './data.js';

// Importations des fonctions d'UI depuis ui.js
import {
    updateDisplay, // Pour rafraîchir l'affichage global après une action
    showNotification // Importation corrigée de showNotification depuis ui.js
} from './ui.js';

// --- Fonctions de calcul de coût (Définies et exportées par studies.js) ---
export const elevesBpsPerItem = new Decimal(0.5);
export const classesBpsPerItem = new Decimal(25);

/**
 * Calcule le coût du prochain Élève.
 * @param {Decimal} count - Le nombre actuel d'Élèves.
 * @returns {Decimal} Le coût du prochain Élève.
 */
export function calculateNextEleveCost(count) {
    let baseCost = new Decimal(10);
    let multiplier = new Decimal(1.15);
    let cost = baseCost.mul(multiplier.pow(count));
    // Appliquer les réductions de coût des compétences
    cost = cost.mul(new Decimal(1).sub(skillEffects.eleveCostReduction)).mul(new Decimal(1).sub(skillEffects.allCostReduction));
    return cost.floor();
}

/**
 * Calcule le coût de la prochaine Classe.
 * @param {Decimal} count - Le nombre actuel de Classes.
 * @returns {Decimal} Le coût de la prochaine Classe.
 */
export function calculateNextClasseCost(count) {
    let baseCost = new Decimal(100);
    let multiplier = new Decimal(1.2);
    let cost = baseCost.mul(multiplier.pow(count));
    // Appliquer les réductions de coût des compétences
    cost = cost.mul(new Decimal(1).sub(skillEffects.classeCostReduction)).mul(new Decimal(1).sub(skillEffects.allCostReduction));
    return cost.floor();
}

/**
 * Calcule le coût de la prochaine Image.
 * @param {Decimal} count - Le nombre actuel d'Images.
 * @returns {Decimal} Le coût de la prochaine Image.
 */
export function calculateNextImageCost(count) {
    let baseCost = new Decimal(1000);
    let multiplier = new Decimal(1.25);
    let cost = baseCost.mul(multiplier.pow(count));
    // Appliquer les réductions de coût des compétences
    cost = cost.mul(new Decimal(1).sub(skillEffects.imageCostReduction)).mul(new Decimal(1).sub(skillEffects.allCostReduction));
    return cost.floor();
}

/**
 * Calcule le coût du prochain Professeur.
 * @param {Decimal} count - Le nombre actuel de Professeurs.
 * @returns {Decimal} Le coût du prochain Professeur.
 */
export function calculateNextProfessorCost(count) {
    let baseCost = new Decimal(10); // Coût en images
    let multiplier = new Decimal(1.3);
    let cost = baseCost.mul(multiplier.pow(count));
    // Appliquer les réductions de coût des compétences
    cost = cost.mul(new Decimal(1).sub(skillEffects.ProfesseurCostReduction)).mul(new Decimal(1).sub(skillEffects.allCostReduction));
    return cost.floor();
}


// Variables pour les productions par item (calculées ici et utilisées globalement)
export let bonsPointsParSecondeEleves = new Decimal(0);
export let bonsPointsParSecondeClasses = new Decimal(0);

/**
 * Calcule la production de Bons Points par seconde générée par les élèves et les classes.
 * Les résultats sont stockés dans les variables exportées `bonsPointsParSecondeEleves`
 * et `bonsPointsParSecondeClasses`.
 */
export function calculateStudiesBPS() {
    // Calcul du multiplicateur des Professeurs
    // Inclut le bonus des Licences (Prestige) et des compétences
    let ProfMultiplierFromPrestige = nombreLicences.mul(0.01).mul(prestigeCount).add(skillEffects.licenceProfMultiplier);
    let multiplicateurProfesseur = new Decimal(1).add(new Decimal(0.25).mul(nombreProfesseur)).add(ProfMultiplierFromPrestige);

    // Calcul des boosts de classe des Master I et Master II (Prestige) et des compétences
    let master1ClassBoost = nombreMaster1.mul(0.005).mul(nombreProfesseur).add(skillEffects.master1ClassProduction);
    let master2ClassBoost = nombreMaster2.mul(0.0001).mul(prestigePoints).add(skillEffects.master2ClassProduction);
    let totalClassBoost = new Decimal(1).add(master1ClassBoost).add(master2ClassBoost);

    // Production des élèves
    bonsPointsParSecondeEleves = nombreEleves.mul(new Decimal(0.5).add(skillEffects.eleveBpsBonus))
                                         .mul(new Decimal(1).add(skillEffects.allProductionMultiplier));

    // Production des classes
    bonsPointsParSecondeClasses = nombreClasses.mul(new Decimal(25).add(skillEffects.classeBpsBonus))
                                               .mul(multiplicateurProfesseur)
                                               .mul(new Decimal(1).add(skillEffects.allProductionMultiplier))
                                               .mul(totalClassBoost);
}

/**
 * Gère la logique du clic sur le bouton "Étudier sagement".
 * Incrémente le compteur de clics et ajoute des Bons Points.
 * Cette fonction est appelée par events.js.
 */
export function handleStudyClick() {
    window.totalClicks = totalClicks.add(1); // Incrémente le nombre total de clics

    calculateTotalBPS(); // Recalcule la production totale de BP par seconde (incluant les études)
    const dynamicBonus = totalBonsPointsParSeconde.mul(0.1); // Calcule le bonus dynamique basé sur le total BPS
    const clickValue = skillEffects.clickBonsPointsBonus.add(dynamicBonus);

    if (clickValue.gt(0)) {
        window.bonsPoints = bonsPoints.plus(clickValue); // Correction: Réaffecter le résultat de plus()
    } else {
        // Si clickValue est zéro ou négatif, assurez-vous qu'au moins 1 BP est gagné
        if (clickValue.eq(0)) {
            window.bonsPoints = bonsPoints.plus(1); // Correction: Réaffecter le résultat de plus()
        } else {
            console.warn("[Clic Étudier] clickValue est négatif. BP non augmentés par ce clic spécifique.", clickValue.toString());
        }
    }

    // Le rafraîchissement de l'affichage (clickBonsPointsDisplay, bonsPointsSpan)
    // sera géré par updateDisplay() dans ui.js, appelé par la boucle de jeu principale.

    checkUnlockConditions(); // Vérifie les déverrouillages suite au clic
    updateStudiesButtonStates(getStudiesDOMElements()); // Met à jour l'état des boutons d'études
    saveGameState(); // Sauvegarde l'état du jeu
}

/**
 * Exécute la logique d'achat pour les Élèves, Classes, Images et Professeurs.
 * Décrémente les ressources et incrémente les quantités d'objets achetés.
 * Cette fonction est appelée par events.js.
 * @param {string} itemType - Le type d'objet à acheter ('eleve', 'classe', 'image', 'Professeur').
 * @param {Decimal|number|string} quantityRequested - La quantité à acheter (Decimal, nombre, ou 'max').
 * @param {boolean} isAutomated - Indique si l'achat est automatisé.
 */
export function performStudyPurchase(itemType, quantityRequested, isAutomated = false) {
    let currentResource;
    let costFunction;
    let itemCounter;
    let resourceToDecrement;

    switch (itemType) {
        case 'eleve':
            currentResource = bonsPoints;
            costFunction = calculateNextEleveCost;
            itemCounter = nombreEleves;
            resourceToDecrement = 'bonsPoints';
            break;
        case 'classe':
            currentResource = bonsPoints;
            costFunction = calculateNextClasseCost;
            itemCounter = nombreClasses;
            resourceToDecrement = 'bonsPoints';
            break;
        case 'image':
            currentResource = bonsPoints;
            costFunction = calculateNextImageCost;
            itemCounter = images;
            resourceToDecrement = 'bonsPoints';
            break;
        case 'Professeur':
            currentResource = images;
            costFunction = calculateNextProfessorCost;
            itemCounter = nombreProfesseur;
            resourceToDecrement = 'images';
            break;
        default:
            console.error(`Type d'achat d'étude inconnu : ${itemType}`);
            return;
    }

    let quantityToBuy = new Decimal(0);
    let totalCost = new Decimal(0);

    if (quantityRequested === 'max') {
        let tempItemCounter = new Decimal(itemCounter);
        let tempResource = new Decimal(currentResource);
        const maxIterations = 100000; // Limite de sécurité pour éviter les boucles infinies
        let iterations = 0;

        while (iterations < maxIterations) {
            let costPerItem = costFunction(tempItemCounter);
            if (tempResource.gte(costPerItem)) {
                tempResource = tempResource.sub(costPerItem);
                tempItemCounter = tempItemCounter.add(1);
                quantityToBuy = quantityToBuy.add(1);
                totalCost = totalCost.add(costPerItem);
                iterations++;
            } else {
                break;
            }
        }
    } else {
        // Pour x1, x10, x100
        let numToBuy = new Decimal(quantityRequested);
        let tempItemCounter = new Decimal(itemCounter);
        let tempResource = new Decimal(currentResource);

        for (let i = 0; i < numToBuy.toNumber(); i++) {
            let costPerItem = costFunction(tempItemCounter);
            if (tempResource.gte(costPerItem)) {
                tempResource = tempResource.sub(costPerItem);
                tempItemCounter = tempItemCounter.add(1);
                totalCost = totalCost.add(costPerItem);
                quantityToBuy = quantityToBuy.add(1);
            } else {
                break; // Pas assez de ressources pour acheter tous les objets demandés
            }
        }
    }

    if (quantityToBuy.gt(0)) {
        // Décrémenter la ressource
        if (resourceToDecrement === 'bonsPoints') {
            window.bonsPoints = bonsPoints.sub(totalCost);
        } else if (resourceToDecrement === 'images') {
            window.images = images.sub(totalCost);
        }

        // Incrémenter le compteur de l'objet
        switch (itemType) {
            case 'eleve': window.nombreEleves = nombreEleves.add(quantityToBuy); break;
            case 'classe': window.nombreClasses = nombreClasses.add(quantityToBuy); break;
            case 'image': window.images = images.add(quantityToBuy); break;
            case 'Professeur':
                window.nombreProfesseur = nombreProfesseur.add(quantityToBuy);
                const oldAscensionSkillPoints = new Decimal(ascensionSkillPoints); // Stocke l'ancienne valeur
                window.ascensionSkillPoints = ascensionSkillPoints.add(quantityToBuy); // Ajoute des points de compétence d'Ascension
                showNotification(`+${formatNumber(quantityToBuy,0)} Point(s) de Compétence d'Ascension !`);
                // Le déverrouillage du panneau de compétences d'Ascension est géré par checkUnlockConditions dans core.js
                break;
        }

        applyAllSkillEffects(); // Réapplique les effets des compétences après l'achat
        if (!isAutomated) {
            showNotification(`Acheté ${formatNumber(quantityToBuy, 0)} ${itemType}(s) !`);
        }
    } else if (!isAutomated) {
        showNotification(`Pas assez de ressources pour acheter ${itemType} !`);
    }

    checkUnlockConditions(); // Vérifie les déverrouillages
    updateStudiesButtonStates(getStudiesDOMElements()); // Met à jour l'état des boutons d'études
    updateStudiesSectionVisibility(getStudiesDOMElements()); // Met à jour la visibilité des sections d'études
    updateDisplay(); // Rafraîchit l'affichage global
    saveGameState(); // Sauvegarde l'état du jeu
}

/**
 * Fonction utilitaire pour obtenir les éléments DOM nécessaires aux études.
 * Ceci est une approche pour éviter de passer document.getElementById partout,
 * en supposant que ces IDs sont stables.
 * Idéalement, ces éléments seraient passés directement ou gérés par un module UI dédié.
 * @returns {object} Un objet contenant les références aux éléments DOM.
 */
function getStudiesDOMElements() {
    return {
        acheterEleveButton: document.getElementById('acheterEleve'),
        acheterClasseButton: document.getElementById('acheterClasse'),
        acheterImageButton: document.getElementById('acheterImage'),
        acheterProfesseurButton: document.getElementById('acheterProfesseur'),
        studiesTitleButton: document.getElementById('studiesTitleButton'), // Assuming this exists for click bonus display
        clickBonsPointsDisplay: document.getElementById('clickBonsPointsDisplay'), // Assuming this exists
        achatEleveSection: document.getElementById('achatEleveSection'),
        achatClasseSection: document.getElementById('achatClasseSection'),
        achatImageSection: document.getElementById('achatImageSection'),
        achatProfesseurSection: document.getElementById('achatProfesseurSection')
    };
}


/**
 * Met à jour l'état (texte, classes can-afford/cannot-afford) des boutons d'achat liés aux études.
 * Cette fonction est appelée par ui.js ou par d'autres fonctions de studies.js.
 * @param {object} domElements - Un objet contenant les références aux éléments DOM nécessaires.
 * Ex: { acheterEleveButton, acheterClasseButton, acheterImageButton, acheterProfesseurButton,
 * studiesTitleButton, clickBonsPointsDisplay }
 */
export function updateStudiesButtonStates(domElements) {
    const { acheterEleveButton, acheterClasseButton, acheterImageButton, acheterProfesseurButton,
             clickBonsPointsDisplay } = domElements;

    // Élève
    let coutEleveActuel = calculateNextEleveCost(nombreEleves);
    if (acheterEleveButton) {
        acheterEleveButton.innerHTML = `Élève : <span class="bons-points-color">${formatNumber(coutEleveActuel, 0)} BP</span>`;
        acheterEleveButton.classList.toggle('can-afford', bonsPoints.gte(coutEleveActuel));
        acheterEleveButton.classList.toggle('cannot-afford', bonsPoints.lt(coutEleveActuel));
    }


    // Classe
    let coutClasseActuel = calculateNextClasseCost(nombreClasses);
    if (acheterClasseButton) {
        acheterClasseButton.innerHTML = `Salle de classe : <span class="bons-points-color">${formatNumber(coutClasseActuel, 0)} BP</span>`;
        acheterClasseButton.classList.toggle('can-afford', bonsPoints.gte(coutClasseActuel));
        acheterClasseButton.classList.toggle('cannot-afford', bonsPoints.lt(coutClasseActuel));
    }


    // Image
    let imageCost = calculateNextImageCost(images);
    if (acheterImageButton) {
        acheterImageButton.innerHTML = `Image : <span class="bons-points-color">${formatNumber(imageCost, 0)} BP</span>`;
        acheterImageButton.classList.toggle('can-afford', bonsPoints.gte(imageCost));
        acheterImageButton.classList.toggle('cannot-afford', bonsPoints.lt(imageCost));
    }


    // Professeur
    let coutProfesseurActuel = calculateNextProfessorCost(nombreProfesseur)
    if (acheterProfesseurButton) {
        acheterProfesseurButton.innerHTML = `Professeur : <span class="images-color">${formatNumber(coutProfesseurActuel, 0)} I</span>`;
        acheterProfesseurButton.classList.toggle('can-afford', images.gte(coutProfesseurActuel));
        acheterProfesseurButton.classList.toggle('cannot-afford', images.lt(coutProfesseurActuel));
    }


    // Mise à jour du bonus de clic dans le titre
    if (clickBonsPointsDisplay) {
        const dynamicBonusForDisplay = totalBonsPointsParSeconde.mul(0.1);
        const currentClickValueForDisplay = skillEffects.clickBonsPointsBonus.add(dynamicBonusForDisplay);
        clickBonsPointsDisplay.textContent = `+${formatNumber(currentClickValueForDisplay, bonsPoints.lt(1000) ? 1 : 0)} BP`;
    }
}

/**
 * Contrôle la visibilité des sections d'achat spécifiques aux études.
 * Cette fonction est appelée par ui.js ou par d'autres fonctions de studies.js.
 * @param {object} domElements - Un objet contenant les références aux éléments DOM nécessaires.
 * Ex: { achatEleveSection, achatClasseSection, achatImageSection, achatProfesseurSection }
 */
export function updateStudiesSectionVisibility(domElements) {
    const { achatEleveSection, achatClasseSection, achatImageSection, achatProfesseurSection } = domElements;

    if (achatEleveSection) {
        achatEleveSection.style.display = elevesUnlocked ? 'block' : 'none';
    }
    if (achatClasseSection) {
        achatClasseSection.style.display = classesUnlocked ? 'block' : 'none';
    }
    if (achatImageSection) {
        achatImageSection.style.display = imagesUnlocked ? 'block' : 'none';
    }
    if (achatProfesseurSection) {
        achatProfesseurSection.style.display = ProfesseurUnlocked ? 'block' : 'none';
    }
}
