// automation.js
// La logique de l'automatisation des achats.

// Import des variables et fonctions nécessaires
// (Note : Dans un environnement navigateur, ces "imports" sont implicites)
// import { bonsPoints, eleves, classes, professeurs, images } from './core.js';
// import { acheterEleve, acheterClasse, acheterProfesseur, acheterImage } from './studies.js';
// import { updateDisplay } from './ui.js';
// import { eleveBaseCost, classeBaseCost, professeurBaseCost, imageBaseCost,
//          classeMultiplier, professeurMultiplier, imageMultiplier } from './data.js';

let autoEleve = false;
let autoClasse = false;
let autoProfesseur = false;
let autoImage = false;

function runAutomation() {
    if (autoEleve) {
        acheterEleve();
    }
    if (autoClasse) {
        acheterClasse();
    }
    if (autoProfesseur) {
        acheterProfesseur();
    }
    if (autoImage) {
        acheterImage();
    }
}

function updateAutomationButtonStates() {
    document.getElementById('autoEleveButton').classList.toggle('active', autoEleve);
    document.getElementById('autoClasseButton').classList.toggle('active', autoClasse);
    document.getElementById('autoProfesseurButton').classList.toggle('active', autoProfesseur);
    document.getElementById('autoImageButton').classList.toggle('active', autoImage);
}

// Event listeners pour les boutons d'automatisation
document.getElementById('autoEleveButton').addEventListener('click', () => {
    autoEleve = !autoEleve;
    updateAutomationButtonStates();
});

document.getElementById('autoClasseButton').addEventListener('click', () => {
    autoClasse = !autoClasse;
    updateAutomationButtonStates();
});

document.getElementById('autoProfesseurButton').addEventListener('click', () => {
    autoProfesseur = !autoProfesseur;
    updateAutomationButtonStates();
});

document.getElementById('autoImageButton').addEventListener('click', () => {
    autoImage = !autoImage;
    updateAutomationButtonStates();
});
