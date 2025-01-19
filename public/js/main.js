// Import dei moduli
import TEMA from './modules/theme.js'
import MDL from './modules/modal.js';
import AUTH_PANEL from './modules/authPanel.js';
import { initializeTools } from './modules/tools.js';

console.log('Main loaded');

// Inizializza l'applicazione
const initializeApp = () => {
    // Inizializza il pannello di autenticazione
    AUTH_PANEL.createPanel(onAuthenticationSuccess);

    // Inizializza il sistema modal
    MDL.init();

    // Inizializza gli event listeners
    setupEventListeners();

    // Inizializza il tem
    TEMA.init();
};

// Callback per l'autenticazione riuscita
const onAuthenticationSuccess = () => {
    document.getElementById('home').style.display = 'block';
};

// Setup degli event listeners
const setupEventListeners = () => {
    document.addEventListener('click', handleToolClick);
};

// Gestore dei click sui tool
const handleToolClick = (event) => {
    const button = event.target.closest('.tool-button');
    if (button) {
        const toolName = button.dataset.tool;
        initializeTools[toolName]?.();
    }
};

// Avvia l'applicazione
initializeApp();