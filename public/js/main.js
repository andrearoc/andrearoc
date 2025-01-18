import HCL from './modules/hourCalculator.js';
import MDL from './modules/modal.js';

console.log('Main loaded')
// Inizializza il sistema modal
MDL.init();

// Tool registry
const tools = {
    timeTracker: {
        title: 'Time Tracker',
        init: () => {
            const content = HCL.createInterface();
            MDL.open('Time Tracker', content);
        },
        cleanup: () => {
            HCL.cleanup();
        }
    }
};

// Event Listeners
document.addEventListener('click', (event) => {
    const button = event.target.closest('.tool-button');
    if (button) {
        const tool = button.dataset.tool;
        if (tools[tool]) {
            tools[tool].init();
        }
    }
});