/**
 * quests.js
 *
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

// Importations des variables d'état et fonctions globales depuis core.js
import {
    bonsPoints,
    images,
    nombreEleves,
    nombreClasses,
    nombreProfesseur,
    totalClicks,
    totalPAEarned,
    prestigeCount,
    showNotification,
    saveGameState,
    updateDisplay,
    applyAllSkillEffects,
    completedQuests // Assurez-vous que cette variable est définie et exportée dans core.js
} from './core.js'; // Assurez-vous que le chemin est correct

// Importations des définitions de quêtes depuis data.js
import {
    questsData // Assurez-vous que cette variable est définie et exportée dans data.js
} from './data.js'; // Assurez-vous que le chemin est correct

// Importations des fonctions d'UI depuis ui.js
import {
    formatNumber
} from './ui.js'; // Assurez-vous que le chemin est correct

/**
 * Vérifie les conditions de toutes les quêtes non complétées et
 * marque celles qui sont terminées comme "complétées" ou "réclamables".
 * Cette fonction est appelée par la boucle de jeu principale.
 */
export function checkQuests() {
    for (const questId in questsData) {
        const quest = questsData[questId];

        // Si la quête est déjà complétée et réclamée, on ne la vérifie plus
        if (completedQuests[questId] && completedQuests[questId].claimed) {
            continue;
        }

        // Si la quête est déjà complétée mais pas encore réclamée, on ne la vérifie plus, elle attend d'être réclamée
        if (completedQuests[questId] && completedQuests[questId].completed && !completedQuests[questId].claimed) {
            continue;
        }

        let isCompleted = true;

        // Vérification des conditions de la quête
        if (quest.conditions.bonsPoints && bonsPoints.lt(quest.conditions.bonsPoints)) {
            isCompleted = false;
        }
        if (quest.conditions.totalClicks && totalClicks.lt(quest.conditions.totalClicks)) {
            isCompleted = false;
        }
        if (quest.conditions.nombreEleves && nombreEleves.lt(quest.conditions.nombreEleves)) {
            isCompleted = false;
        }
        if (quest.conditions.nombreClasses && nombreClasses.lt(quest.conditions.nombreClasses)) {
            isCompleted = false;
        }
        if (quest.conditions.images && images.lt(quest.conditions.images)) {
            isCompleted = false;
        }
        if (quest.conditions.nombreProfesseur && nombreProfesseur.lt(quest.conditions.nombreProfesseur)) {
            isCompleted = false;
        }
        if (quest.conditions.totalPAEarned && totalPAEarned.lt(quest.conditions.totalPAEarned)) {
            isCompleted = false;
        }
        if (quest.conditions.prestigeCount && prestigeCount.lt(quest.conditions.prestigeCount)) {
            isCompleted = false;
        }
        // Ajouter d'autres conditions ici si nécessaire

        if (isCompleted && !completedQuests[questId]) {
            // La quête vient d'être complétée
            completedQuests[questId] = { completed: true, claimed: false };
            showNotification(`Quête terminée : "${quest.name}" !`);
            updateQuestsUI(); // Met à jour l'UI pour montrer la quête comme réclamable
            renderQuests(); // Re-rend le menu des quêtes
            saveGameState(); // Sauvegarde l'état du jeu
        }
    }
}

/**
 * Gère la logique de réclamation d'une récompense de quête.
 * @param {string} questId - L'ID unique de la quête dont la récompense est réclamée.
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

    // Ajouter les récompenses
    if (quest.rewards.bonsPoints) {
        bonsPoints.add(new Decimal(quest.rewards.bonsPoints));
    }
    if (quest.rewards.images) {
        images.add(new Decimal(quest.rewards.images));
    }
    if (quest.rewards.studiesSkillPoints) {
        studiesSkillPoints.add(new Decimal(quest.rewards.studiesSkillPoints));
    }
    if (quest.rewards.ascensionPoints) {
        ascensionPoints.add(new Decimal(quest.rewards.ascensionPoints));
    }
    if (quest.rewards.prestigePoints) {
        prestigePoints.add(new Decimal(quest.rewards.prestigePoints));
    }
    // Ajouter d'autres types de récompenses ici (ex: bonus permanents, déverrouillages)

    completedQuests[questId].claimed = true; // Marque la quête comme réclamée

    applyAllSkillEffects(); // Réapplique tous les effets si des bonus permanents ont été ajoutés
    showNotification(`Récompense de "${quest.name}" réclamée !`);

    updateQuestsUI(); // Met à jour l'interface des quêtes
    renderQuests(); // Re-rend le menu des quêtes
    updateDisplay(); // Rafraîchit l'affichage global
    saveGameState(); // Sauvegarde l'état du jeu
}

/**
 * Met à jour l'affichage des informations générales des quêtes dans l'interface utilisateur.
 * Cette fonction est appelée par ui.js.
 * @param {object} domElements - Un objet contenant les références aux éléments DOM nécessaires.
 * Ex: { questsCompletedCountDisplay, questsTotalCountDisplay }
 */
export function updateQuestsUI(domElements) {
    const { questsCompletedCountDisplay, questsTotalCountDisplay } = domElements;

    const totalQuests = Object.keys(questsData).length;
    const completedAndClaimedQuests = Object.values(completedQuests).filter(q => q.completed && q.claimed).length;

    if (questsCompletedCountDisplay) questsCompletedCountDisplay.textContent = formatNumber(completedAndClaimedQuests, 0);
    if (questsTotalCountDisplay) questsTotalCountDisplay.textContent = formatNumber(totalQuests, 0);
}

/**
 * Construit ou met à jour dynamiquement la structure HTML du journal des quêtes.
 * Cette fonction est appelée par ui.js.
 * @param {object} domElements - Un objet contenant les références aux éléments DOM nécessaires.
 * Ex: { questsGridContainer }
 */
export function renderQuests(domElements) {
    const { questsGridContainer } = domElements;

    if (!questsGridContainer) return;

    questsGridContainer.innerHTML = ''; // Nettoyer la grille avant de la reconstruire

    for (const questId in questsData) {
        const quest = questsData[questId];
        const questState = completedQuests[questId];

        const questDiv = document.createElement('div');
        questDiv.classList.add('quest-item');
        questDiv.dataset.questId = questId;

        let statusText = "En cours";
        let buttonHtml = "";

        if (questState && questState.completed) {
            if (questState.claimed) {
                statusText = "Terminée et Réclamée";
                questDiv.classList.add('claimed');
            } else {
                statusText = "Terminée ! (Réclamer)";
                questDiv.classList.add('completed');
                buttonHtml = `<button class="claim-quest-button" data-quest-id="${questId}">Réclamer</button>`;
            }
        } else {
            questDiv.classList.add('in-progress');
        }

        questDiv.innerHTML = `
            <h3>${quest.name}</h3>
            <p>${quest.description}</p>
            <div class="quest-rewards">
                <h4>Récompenses :</h4>
                <ul>
                    ${quest.rewards.bonsPoints ? `<li>${formatNumber(quest.rewards.bonsPoints, 0)} Bons Points</li>` : ''}
                    ${quest.rewards.images ? `<li>${formatNumber(quest.rewards.images, 0)} Images</li>` : ''}
                    ${quest.rewards.studiesSkillPoints ? `<li>${formatNumber(quest.rewards.studiesSkillPoints, 0)} Points d'Étude</li>` : ''}
                    ${quest.rewards.ascensionPoints ? `<li>${formatNumber(quest.rewards.ascensionPoints, 0)} Points d'Ascension</li>` : ''}
                    ${quest.rewards.prestigePoints ? `<li>${formatNumber(quest.rewards.prestigePoints, 0)} Points de Prestige</li>` : ''}
                    ${quest.rewards.unlocks ? `<li>Déverrouille : ${quest.rewards.unlocks.join(', ')}</li>` : ''}
                </ul>
            </div>
            <p class="quest-status">Statut : ${statusText}</p>
            ${buttonHtml}
        `;

        // Ajouter l'écouteur d'événement au bouton de réclamation si présent
        if (buttonHtml) {
            const claimButton = questDiv.querySelector('.claim-quest-button');
            if (claimButton) {
                claimButton.addEventListener('click', () => claimQuestReward(questId));
            }
        }

        questsGridContainer.appendChild(questDiv);
    }
}
