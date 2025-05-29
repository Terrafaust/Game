/**
 * studies.js
 *
 * ------------------ Fiche Mémo : studies.js -----------------------------
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
    showNotification,
    checkUnlockConditions,
    saveGameState,
    applyAllSkillEffects,
    calculateTotalBPS,
    studiesSkillPoints,
    ascensionSkillPoints,
    ascensionSkillsUnlocked, // Pour débloquer le panneau de compétences d'Ascension
    nombreLicences,
    nombreMaster1,
    nombreMaster2,
    nombreDoctorat,
    prestigeCount,
    prestigePoints,
    elevesUnlocked,
    classesUnlocked,
    imagesUnlocked,
    ProfesseurUnlocked
} from './core.js'; // Assurez-vous que le chemin est correct

// Importations des fonctions de calcul de coût et des données de prestige depuis data.js
import {
    calculateNextEleveCost,
    calculateNextClasseCost,
    calculateNextImageCost,
    calculateNextProfessorCost,
    prestigePurchasesData
} from './data.js'; // Assurez-vous que le chemin est correct

// Importations des fonctions d'UI depuis ui.js
import {
    formatNumber,
    updateDisplay // Pour rafraîchir l'affichage global après une action
} from './ui.js'; // Assurez-vous que le chemin est correct

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
    totalClicks = totalClicks.add(1); // Incrémente le nombre total de clics

    calculateTotalBPS(); // Recalcule la production totale de BP par seconde (incluant les études)
    const dynamicBonus = totalBonsPointsParSeconde.mul(0.1); // Calcule le bonus dynamique basé sur le total BPS
    const clickValue = skillEffects.clickBonsPointsBonus.add(dynamicBonus);

    if (clickValue.gt(0)) {
        bonsPoints.plus(clickValue); // Utilisation de .plus() pour Decimal
    } else {
        // Si clickValue est zéro ou négatif, assurez-vous qu'au moins 1 BP est gagné
        if (clickValue.eq(0)) {
            bonsPoints.plus(1); // Utilisation de .plus() pour Decimal
        } else {
            console.warn("[Clic Étudier] clickValue est négatif. BP non augmentés par ce clic spécifique.", clickValue.toString());
        }
    }

    // Le rafraîchissement de l'affichage (clickBonsPointsDisplay, bonsPointsSpan)
    // sera géré par updateDisplay() dans ui.js, appelé par la boucle de jeu principale.

    checkUnlockConditions(); // Vérifie les déverrouillages suite au clic
    updateStudiesButtonStates(); // Met à jour l'état des boutons d'études
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
            bonsPoints.sub(totalCost); // Utilisation de .sub() pour Decimal
        } else if (resourceToDecrement === 'images') {
            images.sub(totalCost); // Utilisation de .sub() pour Decimal
        }

        // Incrémenter le compteur de l'objet
        switch (itemType) {
            case 'eleve': nombreEleves.add(quantityToBuy); break;
            case 'classe': nombreClasses.add(quantityToBuy); break;
            case 'image': images.add(quantityToBuy); break;
            case 'Professeur':
                nombreProfesseur.add(quantityToBuy);
                const oldAscensionSkillPoints = new Decimal(ascensionSkillPoints); // Stocke l'ancienne valeur
                ascensionSkillPoints.add(quantityToBuy); // Ajoute des points de compétence d'Ascension
                showNotification(`+${formatNumber(quantityToBuy,0)} Point(s) de Compétence d'Ascension !`);

                // Débloque le panneau de compétences d'Ascension si ce n'est pas déjà fait
                if (!ascensionSkillsUnlocked && ascensionSkillPoints.gt(oldAscensionSkillPoints)) {
                    ascensionSkillsUnlocked.true;
                    showNotification("Panneau Compétences d'Ascension débloqué !");
                }
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
    updateStudiesButtonStates(); // Met à jour l'état des boutons d'études
    updateStudiesSectionVisibility(); // Met à jour la visibilité des sections d'études
    updateDisplay(); // Rafraîchit l'affichage global
    saveGameState(); // Sauvegarde l'état du jeu
}

/**
 * Met à jour l'état (texte, classes can-afford/cannot-afford) des boutons d'achat liés aux études.
 * Cette fonction est appelée par ui.js.
 * @param {object} domElements - Un objet contenant les références aux éléments DOM nécessaires.
 * Ex: { acheterEleveButton, acheterClasseButton, acheterImageButton, acheterProfesseurButton,
 * studiesTitleButton, clickBonsPointsDisplay }
 */
export function updateStudiesButtonStates(domElements) {
    const { acheterEleveButton, acheterClasseButton, acheterImageButton, acheterProfesseurButton,
            studiesTitleButton, clickBonsPointsDisplay } = domElements;

    // Élève
    let coutEleveActuel = calculateNextEleveCost(nombreEleves);
    acheterEleveButton.innerHTML = `Élève : <span class="bons-points-color">${formatNumber(coutEleveActuel, 0)} BP</span>`;
    acheterEleveButton.classList.toggle('can-afford', bonsPoints.gte(coutEleveActuel));
    acheterEleveButton.classList.toggle('cannot-afford', bonsPoints.lt(coutEleveActuel));

    // Classe
    let coutClasseActuel = calculateNextClasseCost(nombreClasses);
    acheterClasseButton.innerHTML = `Salle de classe : <span class="bons-points-color">${formatNumber(coutClasseActuel, 0)} BP</span>`;
    acheterClasseButton.classList.toggle('can-afford', bonsPoints.gte(coutClasseActuel));
    acheterClasseButton.classList.toggle('cannot-afford', bonsPoints.lt(coutClasseActuel));

    // Image
    let imageCost = calculateNextImageCost(images);
    acheterImageButton.innerHTML = `Image : <span class="bons-points-color">${formatNumber(imageCost, 0)} BP</span>`;
    acheterImageButton.classList.toggle('can-afford', bonsPoints.gte(imageCost));
    acheterImageButton.classList.toggle('cannot-afford', bonsPoints.lt(imageCost));

    // Professeur
    let coutProfesseurActuel = calculateNextProfessorCost(nombreProfesseur)
    acheterProfesseurButton.innerHTML = `Professeur : <span class="images-color">${formatNumber(coutProfesseurActuel, 0)} I</span>`;
    acheterProfesseurButton.classList.toggle('can-afford', images.gte(coutProfesseurActuel));
    acheterProfesseurButton.classList.toggle('cannot-afford', images.lt(coutProfesseurActuel));

    // Mise à jour du bonus de clic dans le titre
    const dynamicBonusForDisplay = totalBonsPointsParSeconde.mul(0.1);
    const currentClickValueForDisplay = skillEffects.clickBonsPointsBonus.add(dynamicBonusForDisplay);
    clickBonsPointsDisplay.textContent = `+${formatNumber(currentClickValueForDisplay, bonsPoints.lt(1000) ? 1 : 0)} BP`;
}

/**
 * Contrôle la visibilité des sections d'achat spécifiques aux études.
 * Cette fonction est appelée par ui.js.
 * @param {object} domElements - Un objet contenant les références aux éléments DOM nécessaires.
 * Ex: { achatEleveSection, achatClasseSection, achatImageSection, achatProfesseurSection }
 */
export function updateStudiesSectionVisibility(domElements) {
    const { achatEleveSection, achatClasseSection, achatImageSection, achatProfesseurSection } = domElements;

    achatEleveSection.style.display = elevesUnlocked ? 'block' : 'none';
    achatClasseSection.style.display = classesUnlocked ? 'block' : 'none';
    achatImageSection.style.display = imagesUnlocked ? 'block' : 'none';
    achatProfesseurSection.style.display = ProfesseurUnlocked ? 'block' : 'none';
}
