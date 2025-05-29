// skills.js
// La gestion de l'arbre de compétences, y compris les données des compétences,
// les niveaux, les effets, et l'affichage.

// Import des variables et fonctions nécessaires
// (Note : Dans un environnement navigateur, ces "imports" sont implicites)
// import { bonsPoints, totalBonsPointsParSeconde } from './core.js';
// import { updateDisplay } from './ui.js';

const skillsData = {
    "click-bonus": {
        name: "Clic Puissant",
        description: "Augmente les points gagnés par clic.",
        cost: 10,
        level: 0,
        maxLevel: 10,
        effect: (level) => level * 1, // +1 par niveau
        unlocked: true // Débloqué au départ
    },
    "bps-bonus": {
        name: "Productivité Accrue",
        description: "Augmente les points gagnés par seconde.",
        cost: 100,
        level: 0,
        maxLevel: 10,
        effect: (level) => level * 0.1, // +10% par niveau
        unlocked: false
    },
    // ... (Autres compétences)
};

function canAffordSkill(skillId) {
    return bonsPoints.gte(skillsData[skillId].cost);
}

function buySkill(skillId) {
    if (canAffordSkill(skillId) && skillsData[skillId].level < skillsData[skillId].maxLevel) {
        bonsPoints = bonsPoints.minus(skillsData[skillId].cost);
        skillsData[skillId].level++;
        updateTotalBPS(); // Recalculer la production
        updateDisplay();
        renderSkillsMenu(); // Re-render the menu to update button states
    }
}

function getSkillEffect(skillId) {
    return skillsData[skillId].effect(skillsData[skillId].level);
}

function checkUnlockConditions() {
    if (totalBonsPointsParSeconde.gte(10)) {
        skillsData["bps-bonus"].unlocked = true;
    }
    // ... (Autres conditions de déblocage)
}

function renderSkillsMenu() {
    const container = document.getElementById('skillsContainer');
    if (!container) return; // Exit if container doesn't exist

    container.innerHTML = ''; // Clear previous content

    for (const skillId in skillsData) {
        const skill = skillsData[skillId];
        if (!skill.unlocked) continue; // Skip if not unlocked

        const skillElement = document.createElement('div');
        skillElement.classList.add('skill');

        skillElement.innerHTML = `
            <h3>${skill.name} (Niveau ${skill.level}/${skill.maxLevel})</h3>
            <p>${skill.description}</p>
            <p>Effet: ${getSkillEffect(skillId)}</p>
            <button onclick="buySkill('${skillId}')" ${canAffordSkill(skillId) ? '' : 'disabled'}>
                Acheter (${skill.cost} points)
            </button>
        `;
        container.appendChild(skillElement);
    }
}
