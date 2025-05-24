/*
 * Fichier: skillManager.js
 * Description: Gère la définition, la génération, l'achat et la réinitialisation
 * des compétences dans l'arbre de compétences du jeu.
 * Importe l'état du jeu et les fonctions d'UI nécessaires.
 */

import { gameState } from './gameState.js';
import { formatNumber, showNotification, showModal, hideModal } from './uiManager.js';

/**
 * Définition des compétences.
 * Chaque compétence a un ID unique, un nom, une branche, un coût,
 * une description, des prérequis et un effet sur le gameState.
 */
export const skillsData = [
    // Branche Pédagogie
    {
        id: 'pedagogie1',
        name: 'Pédagogie Accrue I',
        branch: 'pedagogie',
        cost: new Decimal(1),
        description: 'Augmente la production de Bons Points des élèves de 10%.',
        flavorText: 'Les bases d\'une bonne éducation.',
        prerequisites: [],
        effect: (gs) => { gs.skillEffects.eleveBpsBonus = gs.skillEffects.eleveBpsBonus.mul(1.1); }
    },
    {
        id: 'pedagogie2',
        name: 'Pédagogie Accrue II',
        branch: 'pedagogie',
        cost: new Decimal(2),
        description: 'Augmente la production de Bons Points des élèves de 25%.',
        flavorText: 'Optimisation des méthodes d\'enseignement.',
        prerequisites: ['pedagogie1'],
        effect: (gs) => { gs.skillEffects.eleveBpsBonus = gs.skillEffects.eleveBpsBonus.mul(1.25); }
    },
    // Branche Rationalisme
    {
        id: 'rationalisme1',
        name: 'Logique Rigoureuse I',
        branch: 'rationalisme',
        cost: new Decimal(1),
        description: 'Réduit le coût des élèves de 5%.',
        flavorText: 'Penser de manière plus efficace.',
        prerequisites: [],
        effect: (gs) => { gs.skillEffects.eleveCostReduction = gs.skillEffects.eleveCostReduction.mul(1.05); }
    },
    {
        id: 'rationalisme2',
        name: 'Logique Rigoureuse II',
        branch: 'rationalisme',
        cost: new Decimal(3),
        description: 'Réduit le coût des élèves de 10%.',
        flavorText: 'L\'art de la négociation académique.',
        prerequisites: ['rationalisme1'],
        effect: (gs) => { gs.skillEffects.eleveCostReduction = gs.skillEffects.eleveCostReduction.mul(1.10); }
    },
    // Branche Science
    {
        id: 'science1',
        name: 'Recherche Fondamentale I',
        branch: 'science',
        cost: new Decimal(1),
        description: 'Augmente la production de Bons Points des salles de classe de 15%.',
        flavorText: 'Les premiers pas vers l\'innovation.',
        prerequisites: [],
        effect: (gs) => { gs.skillEffects.classeMultiplierBonus = gs.skillEffects.classeMultiplierBonus.mul(1.15); }
    },
    {
        id: 'science2',
        name: 'Recherche Fondamentale II',
        branch: 'science',
        cost: new Decimal(2),
        description: 'Augmente la production de Bons Points des salles de classe de 30%.',
        flavorText: 'Découvertes majeures en didactique.',
        prerequisites: ['science1'],
        effect: (gs) => { gs.skillEffects.classeMultiplierBonus = gs.skillEffects.classeMultiplierBonus.mul(1.30); }
    },
    // Ajoutez d'autres compétences ici
];

/**
 * Génère dynamiquement l'interface de l'arbre de compétences.
 * Cette fonction est appelée une seule fois au chargement du jeu.
 */
export function generateSkillTreeUI() {
    const skillsGrid = document.getElementById('skills-grid');
    if (!skillsGrid) return;

    skillsGrid.innerHTML = ''; // Nettoyer l'arbre existant

    const branches = {};
    skillsData.forEach(skill => {
        if (!branches[skill.branch]) {
            branches[skill.branch] = document.createElement('div');
            branches[skill.branch].classList.add('skill-branch', skill.branch);
            const branchTitle = document.createElement('h3');
            branchTitle.textContent = skill.branch.charAt(0).toUpperCase() + skill.branch.slice(1); // Capitalize
            branches[skill.branch].appendChild(branchTitle);
            skillsGrid.appendChild(branches[skill.branch]);
        }

        const skillWrapper = document.createElement('div');
        skillWrapper.classList.add('skill-wrapper');
        skillWrapper.dataset.skillId = skill.id;

        const skillNode = document.createElement('div');
        skillNode.classList.add('skill-node');
        skillNode.textContent = skill.name.split(' ')[0] + ' ' + skill.name.split(' ')[1]; // Afficher nom court

        const skillCostDisplay = document.createElement('span');
        skillCostDisplay.classList.add('skill-cost');
        skillCostDisplay.textContent = `(${formatNumber(skill.cost)} P)`;
        skillNode.appendChild(skillCostDisplay);

        // Tooltip
        const tooltip = document.createElement('div');
        tooltip.classList.add('tooltip-text');
        tooltip.innerHTML = `
            <h4>${skill.name}</h4>
            <p>${skill.description}</p>
            <p><em>${skill.flavorText}</em></p>
            <p>Coût: ${formatNumber(skill.cost)} Professeurs</p>
            ${skill.prerequisites.length > 0 ? `<p>Prérequis: ${skill.prerequisites.map(p => skillsData.find(s => s.id === p)?.name || p).join(', ')}</p>` : ''}
        `;
        skillNode.appendChild(tooltip);

        skillWrapper.appendChild(skillNode);
        branches[skill.branch].appendChild(skillWrapper);

        skillNode.addEventListener('click', () => buySkill(skill.id));
    });

    updateSkillTreeUI(); // Mettre à jour les états des compétences après la génération
}

/**
 * Met à jour l'état visuel de l'arbre de compétences (verrouillé/débloqué/abordable).
 * Cette fonction est appelée régulièrement par updateUI dans uiManager.js.
 */
export function updateSkillTreeUI() {
    skillsData.forEach(skill => {
        const skillWrapper = document.querySelector(`.skill-wrapper[data-skill-id="${skill.id}"]`);
        if (!skillWrapper) return;

        const skillNode = skillWrapper.querySelector('.skill-node');
        const skillCostDisplay = skillWrapper.querySelector('.skill-cost');

        // Vérifier si débloqué
        if (gameState.unlockedSkills[skill.id]) {
            skillNode.classList.add('unlocked');
            skillNode.classList.remove('locked', 'can-afford', 'cannot-afford');
            skillCostDisplay.textContent = '(Débloqué)';
            skillNode.style.cursor = 'default';
        } else {
            skillNode.classList.remove('unlocked');
            skillNode.classList.add('locked');
            skillCostDisplay.textContent = `(${formatNumber(skill.cost)} P)`;

            // Vérifier les prérequis
            const hasPrerequisites = skill.prerequisites.every(prereqId => gameState.unlockedSkills[prereqId]);

            // Vérifier si abordable
            const canAfford = gameState.availableProfessors.gte(skill.cost);

            if (hasPrerequisites && canAfford) {
                skillNode.classList.add('can-afford');
                skillNode.classList.remove('cannot-afford');
                skillNode.style.cursor = 'pointer';
            } else {
                skillNode.classList.add('cannot-afford');
                skillNode.classList.remove('can-afford');
                skillNode.style.cursor = 'not-allowed';
            }
        }
    });
}

/**
 * Achète une compétence.
 * @param {string} skillId - L'ID de la compétence à acheter.
 */
export function buySkill(skillId) {
    const skill = skillsData.find(s => s.id === skillId);
    if (!skill) {
        console.error(`Compétence avec l'ID ${skillId} non trouvée.`);
        return;
    }

    if (gameState.unlockedSkills[skillId]) {
        showNotification('Cette compétence est déjà débloquée.', 'info');
        return;
    }

    // Vérifier les prérequis
    const hasPrerequisites = skill.prerequisites.every(prereqId => gameState.unlockedSkills[prereqId]);
    if (!hasPrerequisites) {
        showNotification('Prérequis non remplis pour cette compétence.', 'error');
        return;
    }

    // Vérifier le coût
    if (gameState.availableProfessors.gte(skill.cost)) {
        gameState.professorsUsedForSkills = gameState.professorsUsedForSkills.add(skill.cost);
        gameState.unlockedSkills[skillId] = true;
        skill.effect(gameState); // Appliquer l'effet de la compétence
        // Pas besoin de recalculateGameValues ici, la gameLoop le fera
        // Pas besoin de updateUI ici, la gameLoop le fera
        // La sauvegarde est gérée dans main.js
        showNotification(`Compétence "${skill.name}" débloquée !`, 'success');
    } else {
        showNotification("Pas assez de Professeurs disponibles pour cette compétence.", 'error');
    }
}

/**
 * Réinitialise toutes les compétences débloquées.
 * @param {Function} saveGameCallback - Fonction de rappel pour sauvegarder le jeu.
 * @param {Function} updateUICallback - Fonction de rappel pour mettre à jour l'UI.
 * @param {Function} recalculateGameValuesCallback - Fonction de rappel pour recalculer les valeurs du jeu.
 */
export function resetSkills(saveGameCallback, updateUICallback, recalculateGameValuesCallback) {
    const cost = new Decimal(10); // Coût en Images pour réinitialiser les compétences
    if (gameState.images.gte(cost)) {
        // Pour l'instant, nous utilisons un confirm() simple. Dans un futur index.html,
        // nous pourrions utiliser une modale personnalisée comme pour l'ascension.
        if (confirm(`Êtes-vous sûr de vouloir réinitialiser toutes vos compétences ? Cela coûtera ${formatNumber(cost)} Images.`)) {
            gameState.images = gameState.images.sub(cost);
            gameState.professorsUsedForSkills = new Decimal(0); // Rembourser les professeurs
            gameState.unlockedSkills = {}; // Vider les compétences débloquées
            // Réinitialiser les effets de compétences à leurs valeurs par défaut
            gameState.skillEffects = {
                eleveBpsBonus: new Decimal(1),
                classeMultiplierBonus: new Decimal(1),
                eleveCostReduction: new Decimal(1),
            };
            recalculateGameValuesCallback(); // Recalculer les valeurs du jeu
            updateUICallback(); // Mettre à jour l'UI
            saveGameCallback(); // Sauvegarder le jeu
            showNotification('Compétences réinitialisées !', 'success');
        }
    } else {
        showNotification("Pas assez d'Images pour réinitialiser les compétences.", 'error');
    }
}
