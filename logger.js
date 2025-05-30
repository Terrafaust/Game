// ------------------ Fiche Mémo : logger.js ----------------------------
//
// Description : Ce fichier gère le système de journalisation (logging) du jeu.
// Il permet d'enregistrer différents types de messages (erreurs, informations, avertissements)
// dans le localStorage du navigateur, facilitant ainsi le débogage et le suivi des événements.
//
// Objectif : Fournir une interface simple et centralisée pour la journalisation,
// permettant de capturer des informations importantes sur le comportement du jeu
// sans interrompre l'expérience utilisateur avec des alertes.
//
// ------------------ Fonctions Exportées ------------------
//
// export function initLogger()
//   // Initialise le logger, s'assurant que l'espace de stockage pour les logs existe.
//
// export function logError(message, errorObject = null)
//   // Enregistre un message d'erreur.
//   // - message: Le message d'erreur (string).
//   // - errorObject: L'objet d'erreur JavaScript (Error) si disponible.
//
// export function logWarning(message)
//   // Enregistre un message d'avertissement.
//   // - message: Le message d'avertissement (string).
//
// export function logInfo(message)
//   // Enregistre un message d'information.
//   // - message: Le message d'information (string).
//
// export function getLogs()
//   // Récupère tous les logs enregistrés.
//   // Retourne un tableau d'objets log.
//
// export function clearLogs()
//   // Efface tous les logs enregistrés.
//
// ---------------------------------------------------------------------

const LOG_STORAGE_KEY = 'gameLogs';
const MAX_LOG_ENTRIES = 100; // Limite le nombre d'entrées de log pour éviter de saturer le localStorage

/**
 * Initialise le logger, s'assurant que l'espace de stockage pour les logs existe.
 * Devrait être appelée une fois au démarrage du jeu.
 */
export function initLogger() {
    // Vérifie si la clé de stockage existe, sinon initialise un tableau vide.
    try { // (maj 31/05 debug + log) Ajout de try-catch pour la robustesse du localStorage
        if (!localStorage.getItem(LOG_STORAGE_KEY)) {
            localStorage.setItem(LOG_STORAGE_KEY, JSON.stringify([]));
        }
    } catch (e) {
        console.error("Erreur lors de l'initialisation du logger dans le localStorage:", e);
    }
}

/**
 * Enregistre un message de log. C'est une fonction interne utilisée par les fonctions publiques (logError, etc.).
 * @param {string} level Le niveau de log (e.g., 'INFO', 'WARNING', 'ERROR').
 * @param {string} message Le message à enregistrer.
 * @param {object} [details={}] Des détails supplémentaires à inclure dans le log.
 */
function writeLog(level, message, details = {}) {
    try {
        const logs = JSON.parse(localStorage.getItem(LOG_STORAGE_KEY) || '[]');
        const timestamp = new Date().toISOString();

        const logEntry = {
            timestamp,
            level,
            message,
            ...details
        };

        logs.push(logEntry);

        // Limiter le nombre d'entrées de log
        if (logs.length > MAX_LOG_ENTRIES) {
            logs.shift(); // Supprime l'entrée la plus ancienne
        }

        localStorage.setItem(LOG_STORAGE_KEY, JSON.stringify(logs));
    } catch (e) {
        console.error("Erreur lors de l'écriture du log dans le localStorage:", e);
        // Fallback: si le localStorage est plein ou corrompu, au moins afficher dans la console
        console.error(`[${level}] ${new Date().toISOString()} - ${message}`, details);
    }
}

/**
 * Enregistre un message d'erreur.
 * @param {string} message Le message d'erreur.
 * @param {Error|null} errorObject L'objet d'erreur JavaScript (Error) si disponible.
 */
export function logError(message, errorObject = null) {
    const details = {};
    if (errorObject) {
        details.name = errorObject.name;
        details.stack = errorObject.stack;
        details.error_message = errorObject.message;
    }
    writeLog('ERROR', message, details);
    console.error(`[ERROR] ${message}`, errorObject); // Toujours loguer dans la console pour le débogage immédiat
}

/**
 * Enregistre un message d'avertissement.
 * @param {string} message Le message d'avertissement.
 */
export function logWarning(message) {
    writeLog('WARNING', message);
    console.warn(`[WARNING] ${message}`);
}

/**
 * Enregistre un message d'information.
 * @param {string} message Le message d'information.
 */
export function logInfo(message) {
    writeLog('INFO', message);
    console.info(`[INFO] ${message}`);
}

/**
 * Récupère tous les logs enregistrés.
 * @returns {Array<object>} Un tableau d'objets log.
 */
export function getLogs() {
    try {
        return JSON.parse(localStorage.getItem(LOG_STORAGE_KEY) || '[]');
    } catch (e) {
        console.error("Erreur lors de la lecture des logs depuis le localStorage:", e);
        return [];
    }
}

/**
 * Efface tous les logs enregistrés.
 */
export function clearLogs() {
    try { // (maj 31/05 debug + log) Ajout de try-catch pour la robustesse du localStorage
        localStorage.removeItem(LOG_STORAGE_KEY);
        initLogger(); // Réinitialise le tableau vide après effacement
        console.info("Logs effacés.");
    } catch (e) {
        console.error("Erreur lors de l'effacement des logs dans le localStorage:", e);
    }
}
