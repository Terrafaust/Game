// settings.js
// Les paramètres du jeu, les options de thème, de réinitialisation, etc.

let isDarkMode = false;

function toggleTheme() {
    isDarkMode = !isDarkMode;
    document.body.classList.toggle('dark-theme', isDarkMode);
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    updateSettingsButtonStates();
}

function resetGame() {
    if (confirm("Êtes-vous sûr de vouloir réinitialiser votre progression ?")) {
        localStorage.removeItem('gameState');
        location.reload(); // Simple reload
    }
}

function updateSettingsButtonStates() {
    document.getElementById('themeButton').textContent = isDarkMode ? "Thème Clair" : "Thème Sombre";
}

// Load theme preference on load
window.onload = () => {
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme) {
        isDarkMode = JSON.parse(savedTheme);
        document.body.classList.toggle('dark-theme', isDarkMode);
    }
    updateSettingsButtonStates();
};
