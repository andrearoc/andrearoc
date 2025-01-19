import { initializeCalendar } from './calendar.js';
import { createInterface } from './qrGenerator.js';
import { convertUnit } from './unitConverter.js';
import { generatePassword } from './passwordGenerator.js';
import { estimateBudget } from './expenseEstimator.js';
import MDL from './modal.js';
import HCL from './hourCalculator.js';

export const initializeTools = {
    timeTracker: () => {
        const content = HCL.createInterface();
        MDL.open('Time Tracker', content);
    },

    calendar: () => {
        const content = document.createElement('div');
        content.innerHTML = `<div id="calendar"></div>`;
        MDL.open('Calendario', content);
        initializeCalendar();
    },

    qrGenerator: () => {
        const content = createInterface();
        MDL.open('Generatore di Codici QR', content);
    },

    unitConverter: () => {
        const content = document.createElement('div');
        content.innerHTML = `
            <div class="mb-4">
                <input type="number" id="unit-input" placeholder="Valore" class="w-full mb-2">
                <select id="unit-from" class="w-full mb-2">
                    <optgroup label="Lunghezza">
                        <option value="meters">Metri</option>
                        <option value="centimeters">Centimetri</option>
                        <option value="kilometers">Chilometri</option>
                        <option value="miles">Miglia</option>
                    </optgroup>
                    <optgroup label="Volume">
                        <option value="liters">Litri</option>
                        <option value="milliliters">Millilitri</option>
                        <option value="centiliters">Centilitri</option>
                        <option value="deciliters">Decilitri</option>
                        <option value="hectoliters">Ettolitri</option>
                    </optgroup>
                </select>
                <select id="unit-to" class="w-full mb-2">
                    <optgroup label="Lunghezza">
                        <option value="centimeters">Centimetri</option>
                        <option value="meters">Metri</option>
                        <option value="kilometers">Chilometri</option>
                        <option value="miles">Miglia</option>
                    </optgroup>
                    <optgroup label="Volume">
                        <option value="milliliters">Millilitri</option>
                        <option value="liters">Litri</option>
                        <option value="centiliters">Centilitri</option>
                        <option value="deciliters">Decilitri</option>
                        <option value="hectoliters">Ettolitri</option>
                    </optgroup>
                </select>
                <button id="convert-unit" class="w-full">Converti</button>
            </div>
            <div id="unit-output" class="mt-4"></div>
        `;
        MDL.open('Convertitore di Unità', content);

        document.getElementById('convert-unit').addEventListener('click', () => {
            try {
                const value = parseFloat(document.getElementById('unit-input').value);
                const fromUnit = document.getElementById('unit-from').value;
                const toUnit = document.getElementById('unit-to').value;

                if (isNaN(value)) {
                    throw new Error('Inserire un valore numerico valido');
                }

                const result = convertUnit(value, fromUnit, toUnit);
                document.getElementById('unit-output').innerHTML =
                    `<div class="success">Risultato: ${result.toFixed(2)} ${toUnit}</div>`;
            } catch (error) {
                document.getElementById('unit-output').innerHTML =
                    `<div class="error">Errore: ${error.message}</div>`;
            }
        });
    },

    passwordGenerator: () => {
        const content = document.createElement('div');
        content.innerHTML = `
            <h4>Inserisci il numero di caratteri desiderato</h4>
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

    expenseEstimator: () => {
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
    }
};