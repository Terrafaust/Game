// quests.js
// La gestion des quêtes.

// Import des variables et fonctions nécessaires
// (Note : Dans un environnement navigateur, ces "imports" sont implicites)
// import { eleves, classes, professeurs, bonsPoints } from './core.js';
// import { updateDisplay } from './ui.js';
// import { questData } from './data.js';

let quests = questData.map(data => ({ ...data })); // Crée une copie pour l'état du jeu

function updateQuestProgress() {
    quests.forEach(quest => {
        switch (quest.id) {
            case "first-quest":
                quest.progress = eleves;
                break;
            case "second-quest":
                quest.progress = classes;
                break;
            case "third-quest":
                quest.progress = professeurs;
                break;
            // ... (Autres cas pour chaque quête)
        }
    });
}

function claimQuestReward(questId) {
    const quest = quests.find(q => q.id === questId);
    if (quest && quest.progress >= quest.goal) {
        bonsPoints = bonsPoints.plus(quest.reward);
        quest.claimed = true; // Empêche de réclamer plusieurs fois
        updateDisplay();
        renderQuests(); // Mettre à jour l'affichage des quêtes
    }
}

function renderQuests() {
    const container = document.getElementById('questsContainer');
    if (!container) return;

    container.innerHTML = ''; // Efface le contenu précédent

    quests.forEach(quest => {
        const questElement = document.createElement('div');
        questElement.classList.add('quest');

        let buttonHTML = '';
        if (quest.progress >= quest.goal && !quest.claimed) {
            buttonHTML = `<button onclick="claimQuestReward('${quest.id}')">Réclamer (${quest.reward} points)</button>`;
        } else if (quest.claimed) {
            buttonHTML = 'Réclamée';
        } else {
            buttonHTML = `Progression: ${quest.progress}/${quest.goal}`;
        }

        questElement.innerHTML = `
            <h3>${quest.description}</h3>
            <p>${buttonHTML}</p>
        `;
        container.appendChild(questElement);
    });
}
