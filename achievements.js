// Fiche Mémo : achievements.js
// Description : Ce fichier gère toute la logique liée aux succès du jeu, y compris leur définition,
// la vérification des conditions de déverrouillage, l'application des récompenses,
// le rendu de l'interface des succès et la gestion des infobulles.
// Il interagit avec l'état global du jeu pour déterminer l'état des succès.

// Dépendances :
// Ce fichier dépend de la disponibilité globale des variables et fonctions définies dans :
// - core.js : Pour les fonctions de base du jeu (e.g., showNotification, saveGameState,
//             updateDisplay, applyAllSkillEffects, checkUnlockConditions).
// - ui.js : Pour les fonctions d'affichage (e.g., formatNumber).
// - data.js : Pour les données statiques du jeu (e.g., skillsData, prestigePurchasesData).
//
// Variables Globales Accédées (définies dans d'autres modules, principalement core.js et ui.js) :
// - bonsPoints, images, nombreEleves, nombreClasses, nombreProfesseur, schoolCount,
//   nombreLycees, nombreColleges, ascensionCount, totalClicks, autoEleveActive,
//   autoClasseActive, autoImageActive, autoProfesseurActive, totalPAEarned,
//   nombreLicences, nombreMaster1, nombreMaster2, nombreDoctorat, nombrePostDoctorat,
//   prestigeCount, prestigePoints, skillEffects, studiesSkillLevels, ascensionSkillLevels,
//   prestigeSkillLevels.
//
// Variables Clés Définies et Exportées :
// - achievementsData : Tableau des définitions de tous les succès.
// - unlockedAchievements : Objet pour suivre les succès débloqués par leur ID.
// - permanentBpsBonusFromAchievements : Bonus permanent cumulé des succès sur la production de BP/s.
// - activeAchievementTooltip : Gère l'état de l'infobulle de succès actuellement affichée.
//
// Fonctions Clés Définies et Exportées :
// - renderAchievements() : Met à jour l'affichage de la grille des succès.
// - checkAchievements() : Vérifie les conditions de tous les succès et débloque ceux qui sont remplis.
// - showAchievementTooltip(event, ach) : Affiche l'infobulle d'un succès.
// - hideAchievementTooltip() : Cache l'infobulle d'un succès.
// - toggleAchievementTooltip(event, ach) : Bascule la visibilité de l'infobulle d'un succès.
//
// Éléments DOM Clés (référencés par ID, définis dans index.html et ui.js) :
// - #achievementsGrid : La grille où les succès sont affichés.
// - #achievementTooltip : L'élément HTML de l'infobulle.

// --- Données des Succès ---
export const achievementsData = [
    // Bons Points Achievements
    { id: 'ACH_BP_1', name: 'Le Premier Pas', description: 'Atteindre 1 Bon Point.', condition: () => bonsPoints.gte(1), rewardText: '+0.1% BP/s', rewardFn: () => { permanentBpsBonusFromAchievements = permanentBpsBonusFromAchievements.add(0.001); }, unlocked: false, type: 'percentage' },
    { id: 'ACH_BP_1K', name: 'Mille Points', description: 'Atteindre 1 000 Bons Points.', condition: () => bonsPoints.gte('1e3'), rewardText: '+1% BP/s', rewardFn: () => { permanentBpsBonusFromAchievements = permanentBpsBonusFromAchievements.add(0.01); }, unlocked: false, type: 'percentage' },
    { id: 'ACH_BP_1M', name: 'Millionnaire en BP', description: 'Atteindre 1 Million de Bons Points.', condition: () => bonsPoints.gte('1e6'), rewardText: '+2% BP/s', rewardFn: () => { permanentBpsBonusFromAchievements = permanentBpsBonusFromAchievements.add(0.02); }, unlocked: false, type: 'percentage' },
    { id: 'ACH_BP_1T', name: 'Trillionnaire en BP', description: 'Atteindre 1 Trillion de Bons Points.', condition: () => bonsPoints.gte('1e12'), rewardText: '+5% BP/s', rewardFn: () => { permanentBpsBonusFromAchievements = permanentBpsBonusFromAchievements.add(0.05); }, unlocked: false, type: 'percentage' },
    { id: 'ACH_BP_1Qa', name: 'Quadrillionnaire en BP', description: 'Atteindre 1 Quadrillion de Bons Points.', condition: () => bonsPoints.gte('1e15'), rewardText: '+10% BP/s', rewardFn: () => { permanentBpsBonusFromAchievements = permanentBpsBonusFromAchievements.add(0.10); }, unlocked: false, type: 'percentage' },
    { id: 'ACH_BP_1Sx', name: 'Sextillionnaire en BP', description: 'Atteindre 1 Sextillion de Bons Points.', condition: () => bonsPoints.gte('1e21'), rewardText: '+20% BP/s', rewardFn: () => { permanentBpsBonusFromAchievements = permanentBpsBonusFromAchievements.add(0.20); }, unlocked: false, type: 'percentage' },
    { id: 'ACH_BP_1Oc', name: 'Octillionnaire en BP', description: 'Atteindre 1 Octillion de Bons Points.', condition: () => bonsPoints.gte('1e50'), rewardText: '+50% BP/s', rewardFn: () => { permanentBpsBonusFromAchievements = permanentBpsBonusFromAchievements.add(0.50); }, unlocked: false, type: 'percentage' },
    { id: 'ACH_BP_1Googol', name: 'Googol de BP', description: 'Atteindre 1e100 Bons Points.', condition: () => bonsPoints.gte('1e100'), rewardText: '+100% BP/s', rewardFn: () => { permanentBpsBonusFromAchievements = permanentBpsBonusFromAchievements.add(1); }, unlocked: false, type: 'percentage' },

    // Eleves Achievements
    { id: 'ACH_ELEVES_1', name: 'L\'Apprenti', description: 'Avoir 1 Élève.', condition: () => nombreEleves.gte(1), rewardText: 'Coût des élèves -0.1%', rewardFn: () => { skillEffects.eleveCostReduction = skillEffects.eleveCostReduction.add(0.001); }, unlocked: false, type: 'percentage' },
    { id: 'ACH_ELEVES_100', name: 'Centurie d\'Élèves', description: 'Avoir 100 Élèves.', condition: () => nombreEleves.gte(100), rewardText: 'Coût des élèves -1%', rewardFn: () => { skillEffects.eleveCostReduction = skillEffects.eleveCostReduction.add(0.01); }, unlocked: false, type: 'percentage' },
    { id: 'ACH_ELEVES_1K', name: 'Mille Élèves', description: 'Avoir 1 000 Élèves.', condition: () => nombreEleves.gte(1000), rewardText: 'Coût des élèves -2%', rewardFn: () => { skillEffects.eleveCostReduction = skillEffects.eleveCostReduction.add(0.02); }, unlocked: false, type: 'percentage' },
    { id: 'ACH_ELEVES_1M', name: 'Million d\'Élèves', description: 'Avoir 1 Million d\'Élèves.', condition: () => nombreEleves.gte('1e6'), rewardText: 'Coût des élèves -5%', rewardFn: () => { skillEffects.eleveCostReduction = skillEffects.eleveCostReduction.add(0.05); }, unlocked: false, type: 'percentage' },
    { id: 'ACH_ELEVES_1T', name: 'Trillion d\'Élèves', description: 'Avoir 1 Trillion d\'Élèves.', condition: () => nombreEleves.gte('1e12'), rewardText: 'Coût des élèves -10%', rewardFn: () => { skillEffects.eleveCostReduction = skillEffects.eleveCostReduction.add(0.10); }, unlocked: false, type: 'percentage' },

    // Images Achievements
    { id: 'ACH_IMAGES_1', name: 'Première Image', description: 'Posséder 1 Image.', condition: () => images.gte(1), rewardText: 'Coût des images -0.1%', rewardFn: () => { skillEffects.imageCostReduction = skillEffects.imageCostReduction.add(0.001); }, unlocked: false, type: 'percentage' },
    { id: 'ACH_IMAGES_10', name: 'Collectionneur d\'Images', description: 'Posséder 10 Images.', condition: () => images.gte(10), rewardText: 'Coût des images -1%', rewardFn: () => { skillEffects.imageCostReduction = skillEffects.imageCostReduction.add(0.01); }, unlocked: false, type: 'percentage' },
    { id: 'ACH_IMAGES_1K', name: 'Galerie d\'Images', description: 'Posséder 1 000 Images.', condition: () => images.gte(1000), rewardText: 'Coût des images -2%', rewardFn: () => { skillEffects.imageCostReduction = skillEffects.imageCostReduction.add(0.02); }, unlocked: false, type: 'percentage' },
    { id: 'ACH_IMAGES_1M', name: 'Musée d\'Images', description: 'Posséder 1 Million d\'Images.', condition: () => images.gte('1e6'), rewardText: 'Coût des images -5%', rewardFn: () => { skillEffects.imageCostReduction = skillEffects.imageCostReduction.add(0.05); }, unlocked: false, type: 'percentage' },

    // Classes Achievements
    { id: 'ACH_CLASSES_1', name: 'Première Salle', description: 'Avoir 1 Salle de classe.', condition: () => nombreClasses.gte(1), rewardText: 'Coût des classes -0.1%', rewardFn: () => { skillEffects.classeCostReduction = skillEffects.classeCostReduction.add(0.001); }, unlocked: false, type: 'percentage' },
    { id: 'ACH_CLASSES_10', name: 'Petit Campus', description: 'Avoir 10 Salles de classe.', condition: () => nombreClasses.gte(10), rewardText: 'Coût des classes -1%', rewardFn: () => { skillEffects.classeCostReduction = skillEffects.classeCostReduction.add(0.01); }, unlocked: false, type: 'percentage' },
    { id: 'ACH_CLASSES_100', name: 'Grand Campus', description: 'Avoir 100 Salles de classe.', condition: () => nombreClasses.gte(100), rewardText: 'Coût des classes -2%', rewardFn: () => { skillEffects.classeCostReduction = skillEffects.classeCostReduction.add(0.02); }, unlocked: false, type: 'percentage' },
    { id: 'ACH_CLASSES_1K', name: 'Université', description: 'Avoir 1 000 Salles de classe.', condition: () => nombreClasses.gte(1000), rewardText: 'Coût des classes -5%', rewardFn: () => { skillEffects.classeCostReduction = skillEffects.classeCostReduction.add(0.05); }, unlocked: false, type: 'percentage' },

    // Professeur Achievements
    { id: 'ACH_PROFS_1', name: 'Premier Professeur', description: 'Avoir 1 Professeur.', condition: () => nombreProfesseur.gte(1), rewardText: 'Coût des Professeurs -0.1%', rewardFn: () => { skillEffects.ProfesseurCostReduction = skillEffects.ProfesseurCostReduction.add(0.001); }, unlocked: false, type: 'percentage' },
    { id: 'ACH_PROFS_5', name: 'Conseil Pédagogique', description: 'Avoir 5 Professeurs.', condition: () => nombreProfesseur.gte(5), rewardText: 'Coût des Professeurs -1%', rewardFn: () => { skillEffects.ProfesseurCostReduction = skillEffects.ProfesseurCostReduction.add(0.01); }, unlocked: false, type: 'percentage' },
    { id: 'ACH_PROFS_10', name: 'Corps Enseignant', description: 'Avoir 10 Professeurs.', condition: () => nombreProfesseur.gte(10), rewardText: 'Coût des Professeurs -2%', rewardFn: () => { skillEffects.ProfesseurCostReduction = skillEffects.ProfesseurCostReduction.add(0.02); }, unlocked: false, type: 'percentage' },
    { id: 'ACH_PROFS_20', name: 'Académie', description: 'Avoir 20 Professeurs.', condition: () => nombreProfesseur.gte(20), rewardText: 'Coût des Professeurs -5%', rewardFn: () => { skillEffects.ProfesseurCostReduction = skillEffects.ProfesseurCostReduction.add(0.05); }, unlocked: false, type: 'percentage' },

    // Ecole Achievements
    { id: 'ACH_ECOLE_1', name: 'Première École', description: 'Acheter 1 École.', condition: () => schoolCount.gte(1), rewardText: '+0.1% PA/s', rewardFn: () => { permanentBpsBonusFromAchievements = permanentBpsBonusFromAchievements.add(0.001); }, unlocked: false, type: 'percentage' },
    { id: 'ACH_ECOLE_5', name: 'Réseau Scolaire', description: 'Acheter 5 Écoles.', condition: () => schoolCount.gte(5), rewardText: '+1% PA/s', rewardFn: () => { permanentBpsBonusFromAchievements = permanentBpsBonusFromAchievements.add(0.01); }, unlocked: false, type: 'percentage' },
    { id: 'ACH_ECOLE_10', name: 'District Éducatif', description: 'Acheter 10 Écoles.', condition: () => schoolCount.gte(10), rewardText: '+2% PA/s', rewardFn: () => { permanentBpsBonusFromAchievements = permanentBpsBonusFromAchievements.add(0.02); }, unlocked: false, type: 'percentage' },

    // Lycee Achievements
    { id: 'ACH_LYCEE_1', name: 'Premier Lycée', description: 'Acheter 1 Lycée.', condition: () => nombreLycees.gte(1), rewardText: '+0.1% PA/s', rewardFn: () => { permanentBpsBonusFromAchievements = permanentBpsBonusFromAchievements.add(0.001); }, unlocked: false, type: 'percentage' },
    { id: 'ACH_LYCEE_3', name: 'Chaîne de Lycées', description: 'Acheter 3 Lycées.', condition: () => nombreLycees.gte(3), rewardText: '+1% PA/s', rewardFn: () => { permanentBpsBonusFromAchievements = permanentBpsBonusFromAchievements.add(0.01); }, unlocked: false, type: 'percentage' },

    // College Achievements
    { id: 'ACH_COLLEGE_1', name: 'Premier Collège', description: 'Acheter 1 Collège.', condition: () => nombreColleges.gte(1), rewardText: '+0.5% PA/s', rewardFn: () => { permanentBpsBonusFromAchievements = permanentBpsBonusFromAchievements.add(0.005); }, unlocked: false, type: 'percentage' },
    { id: 'ACH_COLLEGE_2', name: 'Réseau de Collèges', description: 'Acheter 2 Collèges.', condition: () => nombreColleges.gte(2), rewardText: '+1% PA/s', rewardFn: () => { permanentBpsBonusFromAchievements = permanentBpsBonusFromAchievements.add(0.01); }, unlocked: false, type: 'percentage' },

    // Ascension Achievements (Additive)
    { id: 'ACH_ASCEND_1', name: 'Première Ascension', description: 'Effectuer votre première Ascension.', condition: () => ascensionCount.gte(1), rewardText: '+5 PA uniques', rewardFn: () => { ascensionPoints = ascensionPoints.add(5); }, unlocked: false, type: 'additive' },
    { id: 'ACH_ASCEND_2', name: 'Deuxième Ascension', description: 'Effectuer 2 Ascensions.', condition: () => ascensionCount.gte(2), rewardText: '+10 PA uniques', rewardFn: () => { ascensionPoints = ascensionPoints.add(10); }, unlocked: false, type: 'additive' },
    { id: 'ACH_ASCEND_5', name: 'Ascension Maître', description: 'Effectuer 5 Ascensions.', condition: () => ascensionCount.gte(5), rewardText: '+25 PA uniques', rewardFn: () => { ascensionPoints = ascensionPoints.add(25); }, unlocked: false, type: 'additive' },
    { id: 'ACH_ASCEND_10', name: 'Ascension Légende', description: 'Effectuer 10 Ascensions.', condition: () => ascensionCount.gte(10), rewardText: '+50 PA uniques', rewardFn: () => { ascensionPoints = ascensionPoints.add(50); }, unlocked: false, type: 'additive' },
    { id: 'ACH_ASCEND_25', name: 'Ascension Divine', description: 'Effectuer 25 Ascensions.', condition: () => ascensionCount.gte(25), rewardText: '+100 PA uniques', rewardFn: () => { ascensionPoints = ascensionPoints.add(100); }, unlocked: false, type: 'additive' },
    { id: 'ACH_ASCEND_50', name: 'Ascension Ultime', description: 'Effectuer 50 Ascensions.', condition: () => ascensionCount.gte(50), rewardText: '+250 PA uniques', rewardFn: () => { ascensionPoints = ascensionPoints.add(250); }, unlocked: false, type: 'additive' },

    // Automation Achievements (Percentage)
    { id: 'ACH_AUTO_ELEVE', name: 'Auto-Élève', description: 'Débloquer l\'automatisation des Élèves.', condition: () => autoEleveActive, rewardText: 'Coût des élèves -0.5%', rewardFn: () => { skillEffects.eleveCostReduction = skillEffects.eleveCostReduction.add(0.005); }, unlocked: false, type: 'percentage' },
    { id: 'ACH_AUTO_CLASSE', name: 'Auto-Classe', description: 'Débloquer l\'automatisation des Classes.', condition: () => autoClasseActive, rewardText: 'Coût des classes -0.5%', rewardFn: () => { skillEffects.classeCostReduction = skillEffects.classeCostReduction.add(0.005); }, unlocked: false, type: 'percentage' },
    { id: 'ACH_AUTO_IMAGE', name: 'Auto-Image', description: 'Débloquer l\'automatisation des Images.', condition: () => autoImageActive, rewardText: 'Coût des images -0.5%', rewardFn: () => { skillEffects.imageCostReduction = skillEffects.imageCostReduction.add(0.005); }, unlocked: false, type: 'percentage' },
    { id: 'ACH_AUTO_PROF', name: 'Auto-Professeur', description: 'Débloquer l\'automatisation des Professeurs.', condition: () => autoProfesseurActive, rewardText: 'Coût des Professeurs -0.5%', rewardFn: () => { skillEffects.ProfesseurCostReduction = skillEffects.ProfesseurCostReduction.add(0.005); }, unlocked: false, type: 'percentage' },

    // Click Achievements (Additive)
    { id: 'ACH_CLICK_1', name: 'Premier Clic', description: 'Cliquez 1 fois sur "Étudier sagement".', condition: () => totalClicks.gte(1), rewardText: '+0.1 BP par clic', rewardFn: () => { skillEffects.clickBonsPointsBonus = skillEffects.clickBonsPointsBonus.add(0.1); }, unlocked: false, type: 'additive' },
    { id: 'ACH_CLICK_10', name: 'Dix Clics', description: 'Cliquez 10 fois sur "Étudier sagement".', condition: () => totalClicks.gte(10), rewardText: '+0.5 BP par clic', rewardFn: () => { skillEffects.clickBonsPointsBonus = skillEffects.clickBonsPointsBonus.add(0.5); }, unlocked: false, type: 'additive' },
    { id: 'ACH_CLICK_100', name: 'Cent Clics', description: 'Cliquez 100 fois sur "Étudier sagement".', condition: () => totalClicks.gte(100), rewardText: '+1 BP par clic', rewardFn: () => { skillEffects.clickBonsPointsBonus = skillEffects.clickBonsPointsBonus.add(1); }, unlocked: false, type: 'additive' },
    { id: 'ACH_CLICK_200', name: 'Deux Cents Clics', description: 'Cliquez 200 fois sur "Étudier sagement".', condition: () => totalClicks.gte(200), rewardText: '+2 BP par clic', rewardFn: () => { skillEffects.clickBonsPointsBonus = skillEffects.clickBonsPointsBonus.add(2); }, unlocked: false, type: 'additive' },
    { id: 'ACH_CLICK_500', name: 'Cinq Cents Clics', description: 'Cliquez 500 fois sur "Étudier sagement".', condition: () => totalClicks.gte(500), rewardText: '+5 BP par clic', rewardFn: () => { skillEffects.clickBonsPointsBonus = skillEffects.clickBonsPointsBonus.add(5); }, unlocked: false, type: 'additive' },
    { id: 'ACH_CLICK_1K', name: 'Mille Clics', description: 'Cliquez 1 000 fois sur "Étudier sagement".', condition: () => totalClicks.gte(1000), rewardText: '+10 BP par clic', rewardFn: () => { skillEffects.clickBonsPointsBonus = skillEffects.clickBonsPointsBonus.add(10); }, unlocked: false, type: 'additive' },

    // Prestige Purchase Achievements (NEW)
    { id: 'ACH_LICENCE_1', name: 'Licencié', description: 'Acheter 1 Licence.', condition: () => nombreLicences.gte(1), rewardText: '+0.1% Prof Multiplier', rewardFn: () => { skillEffects.licenceProfMultiplier = skillEffects.licenceProfMultiplier.add(0.001); }, unlocked: false, type: 'additive' },
    { id: 'ACH_MASTER1_1', name: 'Maître I', description: 'Acheter 1 Master I.', condition: () => nombreMaster1.gte(1), rewardText: '+0.1% Classe Production', rewardFn: () => { skillEffects.master1ClassProduction = skillEffects.master1ClassProduction.add(0.001); }, unlocked: false, type: 'additive' },
    { id: 'ACH_MASTER2_1', name: 'Maître II', description: 'Acheter 1 Master II.', condition: () => nombreMaster2.gte(1), rewardText: '+0.1% Classe Production', rewardFn: () => { skillEffects.master2ClassProduction = skillEffects.master2ClassProduction.add(0.001); }, unlocked: false, type: 'additive' },
    { id: 'ACH_DOCTORAT_1', name: 'Docteur', description: 'Acheter 1 Doctorat.', condition: () => nombreDoctorat.gte(1), rewardText: '+0.1% BP/s', rewardFn: () => { skillEffects.doctoratBPSBonus = skillEffects.doctoratBPSBonus.add(0.001); }, unlocked: false, type: 'additive' },
    { id: 'ACH_POSTDOCTORAT_1', name: 'Post-Docteur', description: 'Acheter 1 Post-Doctorat.', condition: () => nombrePostDoctorat.gte(1), rewardText: '+0.1% PA Gain', rewardFn: () => { skillEffects.postDoctoratPAGain = skillEffects.postDoctoratPAGain.add(0.001); }, unlocked: false, type: 'additive' },
];

// --- Variables d'état des Succès ---
export let unlockedAchievements = {}; // Suivre les succès débloqués { achievementId: true }
export let permanentBpsBonusFromAchievements = new Decimal(0); // Bonus cumulé des succès sur la production de BP/s
export let activeAchievementTooltip = null; // Pour gérer l'infobulle de succès cliquée

// --- Fonctions de Gestion des Succès ---

/**
 * Met à jour l'affichage de la grille des succès.
 * Doit être appelée lorsque les succès sont débloqués ou que l'onglet est ouvert.
 */
export function renderAchievements() {
    // Assumed global from ui.js
    const achievementsGrid = document.getElementById('achievementsGrid');
    const achievementsButtonUnlocked = typeof window.achievementsButtonUnlocked !== 'undefined' ? window.achievementsButtonUnlocked : false;

    if (!achievementsButtonUnlocked) return;
    achievementsGrid.innerHTML = ''; // Effacer la grille pour le re-rendu

    achievementsData.forEach(ach => {
        const achDiv = document.createElement('div');
        achDiv.classList.add('achievement-item');
        achDiv.dataset.achId = ach.id; // Ajouter un attribut de données pour la délégation

        // Assumed global from unlockedAchievements variable in core.js or loaded state
        const isUnlocked = unlockedAchievements[ach.id];
        if (isUnlocked) {
            achDiv.classList.add('unlocked');
        }

        achDiv.innerHTML = `
            <h4>${ach.name}</h4>
            <p>${ach.description}</p>
            <span class="reward">Récompense : ${ach.rewardText}</span>
        `;
        achievementsGrid.appendChild(achDiv);
    });
}

/**
 * Vérifie les conditions de tous les succès et débloque ceux qui sont remplis.
 * Applique les récompenses additives une seule fois lors du déverrouillage.
 * Les récompenses basées sur des pourcentages sont cumulées via `permanentBpsBonusFromAchievements`.
 */
export function checkAchievements() {
    let newAchievementUnlocked = false;

    achievementsData.forEach(ach => {
        const isUnlocked = unlockedAchievements[ach.id];
        const canUnlock = ach.condition();

        if (!isUnlocked && canUnlock) {
            unlockedAchievements[ach.id] = true;
            // Appliquer les récompenses additives uniquement une fois lors du déverrouillage
            if (ach.rewardFn && ach.type === 'additive') {
                ach.rewardFn(); // Assumed global from core.js
            }
            // showNotification is assumed global from core.js
            showNotification(`Succès débloqué : ${ach.name} ! (${ach.rewardText})`);
            newAchievementUnlocked = true;
        }
        // Les récompenses basées sur des pourcentages sont gérées par `permanentBpsBonusFromAchievements`,
        // qui est accumulé dans sa `rewardFn` et ensuite utilisé dans `updateCachedMultipliers` (dans core.js).
        // Il n'est pas nécessaire d'appeler `rewardFn` ici pour les types de pourcentage.
    });

    if (newAchievementUnlocked) {
        // applyAllSkillEffects is assumed global from core.js
        applyAllSkillEffects();
        // renderAchievements is defined in this file, but also called from ui.js/events.js
        renderAchievements();
        // updateDisplay and saveGameState are assumed global from core.js
        updateDisplay();
        saveGameState();
    }
}

/**
 * Affiche l'infobulle d'un succès.
 * @param {Event} event L'événement souris.
 * @param {Object} ach L'objet succès.
 */
export function showAchievementTooltip(event, ach) {
    // achievementTooltip is assumed global from ui.js
    if (activeAchievementTooltip && activeAchievementTooltip.classList.contains('clicked')) return;

    achievementTooltip.innerHTML = `
        <strong>${ach.name}</strong><br>
        ${ach.description}<br>
        <span class="reward">Récompense : ${ach.rewardText}</span>
    `;

    // Positionner l'infobulle par rapport au curseur de la souris
    achievementTooltip.style.left = `${event.clientX + 10}px`;
    achievementTooltip.style.top = `${event.clientY + 10}px`;
    achievementTooltip.classList.add('visible');
    achievementTooltip.style.display = 'block'; // S'assurer qu'il est visible
}

/**
 * Cache l'infobulle d'un succès.
 */
export function hideAchievementTooltip() {
    // achievementTooltip is assumed global from ui.js
    if (activeAchievementTooltip && activeAchievementTooltip.classList.contains('clicked')) return;

    achievementTooltip.classList.remove('visible');
    achievementTooltip.style.display = 'none';
}

/**
 * Bascule la visibilité de l'infobulle d'un succès au clic.
 * @param {Event} event L'événement clic.
 * @param {Object} ach L'objet succès.
 */
export function toggleAchievementTooltip(event, ach) {
    event.stopPropagation(); // Empêcher le clic de se propager au document

    // achievementTooltip is assumed global from ui.js
    // Si une infobulle est déjà active et que c'est CELLE-CI, la cacher
    if (activeAchievementTooltip && activeAchievementTooltip.dataset.achId === ach.id && achievementTooltip.classList.contains('clicked')) {
        hideAchievementTooltip();
        achievementTooltip.classList.remove('clicked');
        activeAchievementTooltip = null;
        return;
    }

    // Si une autre infobulle était cliquée, la cacher d'abord
    if (activeAchievementTooltip && activeAchievementTooltip.classList.contains('clicked')) {
        activeAchievementTooltip.classList.remove('clicked', 'visible');
        activeAchievementTooltip.style.display = 'none';
        activeAchievementTooltip = null;
    }

    // Afficher la nouvelle infobulle et la marquer comme cliquée
    achievementTooltip.innerHTML = `
        <strong>${ach.name}</strong><br>
        ${ach.description}<br>
        <span class="reward">Récompense : ${ach.rewardText}</span>
    `;
    achievementTooltip.dataset.achId = ach.id; // Stocker l'ID du succès sur l'infobulle
    achievementTooltip.style.left = `${event.clientX + 10}px`;
    achievementTooltip.style.top = `${event.clientY + 10}px`;
    achievementTooltip.classList.add('visible', 'clicked');
    achievementTooltip.style.display = 'block';
    activeAchievementTooltip = achievementTooltip;
}
