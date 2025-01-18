// Import modules
import UTL from './modules/utils.js';

// DOM Elements
const home = document.getElementById('home');
const toolContainer = document.getElementById('tool-container');
const toolContent = document.getElementById('tool-content');
const closeTool = document.getElementById('close-tool');

// Tool registry
const tools = {
    timeTracker: {
        init: () => {
            const startTime = document.createElement('button');
            startTime.textContent = 'Start Timer';

            const stopTime = document.createElement('button');
            stopTime.textContent = 'Stop Timer';
            stopTime.disabled = true;

            const log = document.createElement('div');

            let start = null;

            startTime.addEventListener('click', () => {
                start = new Date();
                startTime.disabled = true;
                stopTime.disabled = false;
                log.textContent = `Start time: ${start.toLocaleTimeString()}`;
            });

            stopTime.addEventListener('click', () => {
                const end = new Date();
                const duration = ((end - start) / 1000).toFixed(2);

                const data = {
                    start: start.toISOString(),
                    end: end.toISOString(),
                    duration,
                    date: start.toLocaleDateString()
                };

                UTL.saveData('timeTracker', data);

                log.textContent += `\nEnd time: ${end.toLocaleTimeString()}\nDuration: ${duration} seconds`;
                startTime.disabled = false;
                stopTime.disabled = true;
            });

            toolContent.appendChild(startTime);
            toolContent.appendChild(stopTime);
            toolContent.appendChild(log);
        }
    }
};

// Event Listeners
home.addEventListener('click', (event) => {
    const button = event.target.closest('.tool-button');
    if (button) {
        const tool = button.dataset.tool;
        if (tools[tool]) {
            home.style.display = 'none';
            toolContainer.classList.remove('hidden');
            toolContent.innerHTML = '';
            tools[tool].init();
        }
    }
});

closeTool.addEventListener('click', () => {
    toolContainer.classList.add('hidden');
    home.style.display = '';
    toolContent.innerHTML = '';
});
