// Import dei moduli
import HCL from './modules/hourCalculator.js';
import MDL from './modules/modal.js';
import { initializeCalendar, toggleCalendar } from './modules/calendar.js';
import { generateQRCode, toggleQRCode } from './modules/qrGenerator.js';
import { convertUnit } from './modules/unitConverter.js';
import { generatePassword, togglePasswordGenerator } from './modules/passwordGenerator.js';
import { estimateBudget, toggleExpenseEstimator } from './modules/expenseEstimator.js';
import AUTH_PANEL from './modules/authPanel.js'; // Importa authPanel

console.log('Main loaded');

// Inizializza il pannello di autenticazione
AUTH_PANEL.createPanel(() => {
    // Callback per abilitare la visualizzazione del contenuto dopo l'autenticazione
    document.getElementById('home').style.display = 'block';
});

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
    },
    calendar: {
        title: 'Calendario',
        init: () => {
            const content = document.createElement('div');
            content.innerHTML = `<div id="calendar"></div>`;
            MDL.open('Calendario', content);
            initializeCalendar();
        },
        cleanup: () => {
            // Cleanup per il calendario se necessario
        }
    },
    qrGenerator: {
        title: 'Generatore di Codici QR',
        init: () => {
            const content = document.createElement('div');
            content.innerHTML = `
                <input type="text" id="qr-input" placeholder="Inserisci testo per QR">
                <button id="generate-qr">Genera QR</button>
                <div id="qr-output"></div>
            `;
            MDL.open('Generatore di Codici QR', content);
            document.getElementById('generate-qr').addEventListener('click', () => {
                const inputText = document.getElementById('qr-input').value;
                generateQRCode(inputText);
            });
        },
        cleanup: () => {
            // Cleanup per il QR generator se necessario
        }
    },
    unitConverter: {
        title: 'Converitore di Unità',
        init: () => {
            const content = document.createElement('div');
            content.innerHTML = `
                <input type="number" id="unit-input" placeholder="Valore">
                <select id="unit-from">
                    <option value="meters">Metri</option>
                    <option value="centimeters">Centimetri</option>
                    <option value="kilometers">Chilometri</option>
                </select>
                <select id="unit-to">
                    <option value="centimeters">Centimetri</option>
                    <option value="meters">Metri</option>
                    <option value="kilometers">Chilometri</option>
                </select>
                <button id="convert-unit">Converti</button>
                <div id="unit-output"></div>
            `;
            MDL.open('Converitore di Unità', content);
            document.getElementById('convert-unit').addEventListener('click', () => {
                const value = parseFloat(document.getElementById('unit-input').value);
                const fromUnit = document.getElementById('unit-from').value;
                const toUnit = document.getElementById('unit-to').value;
                const result = convertUnit(value, fromUnit, toUnit);
                document.getElementById('unit-output').innerText = `Risultato: ${result}`;
            });
        },
        cleanup: () => {
            // Cleanup per il unit converter se necessario
        }
    },
    passwordGenerator: {
        title: 'Generatore di Password Sicure',
        init: () => {
            const content = document.createElement('div');
            content.innerHTML = `
                <input type="number" id="password-length" placeholder="Lunghezza della password" value="12">
                <button id="generate-password">Genera Password</button>
                <div id="password-output"></div>
            `;
            MDL.open('Generatore di Password Sicure', content);
            document.getElementById('generate-password').addEventListener('click', () => {
                const length = parseInt(document.getElementById('password-length').value);
                const password = generatePassword(length);
                document.getElementById('password-output').innerText = `Password Generata: ${password}`;
            });
        },
        cleanup: () => {
            // Cleanup per il password generator se necessario
        }
    },
    expenseEstimator: {
        title: 'Stime di Spesa e Budget',
        init: () => {
            const content = document.createElement('div');
            content.innerHTML = `
                <input type="number" id="income" placeholder="Reddito Mensile">
                <input type="number" id="expenses" placeholder="Spese Mensili">
                <button id="estimate-budget">Calcola Budget</button>
                <div id="budget-output"></div>
            `;
            MDL.open('Stime di Spesa e Budget', content);
            document.getElementById('estimate-budget').addEventListener('click', () => {
                const income = parseFloat(document.getElementById('income').value);
                const expenses = parseFloat(document.getElementById('expenses').value);
                const budget = estimateBudget(income, expenses);
                document.getElementById('budget-output').innerText = `Budget disponibile: ${budget}`;
            });
        },
        cleanup: () => {
            // Cleanup per il expense estimator se necessario
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
