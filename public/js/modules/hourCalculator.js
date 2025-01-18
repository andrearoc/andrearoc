import UTL from './utils.js';

console.log('HourCalculator loaded')

const HCL = {
    display: null,
    startTime: null,
    timerInterval: null,

    createInterface: () => {
        const container = document.createElement('div');
        container.className = 'timer-container';

        HCL.display = document.createElement('div');
        HCL.display.className = 'timer-display';
        HCL.display.textContent = '00:00:00';

        const startBtn = document.createElement('button');
        startBtn.textContent = 'Avvia Timer';
        startBtn.addEventListener('click', HCL.startTimer);

        const stopBtn = document.createElement('button');
        stopBtn.textContent = 'Ferma Timer';
        stopBtn.addEventListener('click', HCL.stopTimer);
        stopBtn.disabled = true;

        container.appendChild(HCL.display);
        container.appendChild(startBtn);
        container.appendChild(stopBtn);

        return container;
    },

    startTimer: (e) => {
        HCL.startTime = new Date();
        e.target.disabled = true;
        e.target.nextElementSibling.disabled = false;

        HCL.timerInterval = setInterval(() => {
            const currentTime = new Date();
            const elapsedSeconds = Math.floor((currentTime - HCL.startTime) / 1000);
            const timeObj = UTL.formatTime(elapsedSeconds);
            HCL.display.textContent = timeObj.formatted;
        }, 1000);
    },

    stopTimer: (e) => {
        clearInterval(HCL.timerInterval);
        const endTime = new Date();

        const data = {
            dataInizio: HCL.startTime.toISOString(),
            dataFine: endTime.toISOString(),
            durata: HCL.display.textContent,
            data: HCL.startTime.toLocaleDateString()
        };

        UTL.saveData('hourCalculator', data);
        e.target.disabled = true;
        e.target.previousElementSibling.disabled = false;
    },

    cleanup: () => {
        if (HCL.timerInterval) {
            clearInterval(HCL.timerInterval);
        }
    }
};

export default HCL;