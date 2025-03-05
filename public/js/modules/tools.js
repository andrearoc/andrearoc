import { initializeCalendar } from './calendar.js';
import { createInterface } from './qrGenerator.js';
import { convertUnit } from './unitConverter.js';
import { generatePassword } from './passwordGenerator.js';
import { expenseManager, EXPENSE_CATEGORIES, PRIORITY_LEVELS } from './expenseEstimator.js';
import HCL from './hourCalculator.js';
import { DOC } from './documents.js';
import NOTES from './notes.js';

import MDL from './modal.js';

const CATEGORY_ICONS = {
	'casa': { icon: 'fa-house', color: '#4CAF50' },
	'alimentari': { icon: 'fa-cart-shopping', color: '#2196F3' },
	'trasporti': { icon: 'fa-car', color: '#FF9800' },
	'salute': { icon: 'fa-pills', color: '#E91E63' },
	'svago': { icon: 'fa-gamepad', color: '#9C27B0' },
	'pizza': { icon: 'fa-pizza-slice', color: '#F44336' },
	'sushi': { icon: 'fa-fish', color: '#00BCD4' },
	'benzina': { icon: 'fa-gas-pump', color: '#795548' },
	'ristorante': { icon: 'fa-utensils', color: '#607D8B' },
	'viaggi': { icon: 'fa-plane', color: '#3F51B5' },
	'altro': { icon: 'fa-thumbtack', color: '#9E9E9E' }
};

export const initializeTools = {
	notes: () => {
		const content = NOTES.createInterface();
		MDL.open('Gestione Note', content);
	},

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

    documents: () => {
			const content = DOC.createInterface();
			MDL.open('Gestione Documenti', content);
    },

    unitConverter: () => {
			const content = document.createElement('div');
			content.classList.add('converter');
			content.innerHTML = `
				<h4><i class="fa-solid fa-ruler-horizontal"></i></h4>
				<div class="unit-converter">
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
					<div class="row-flex">
						<span>Converti</span><i id="convert-unit" class="fa-solid fa-rotate"></i>
					</div>
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
					<div class="tabs">
						<button id="tab-overview" class="tab active"><i class="fa-solid fa-house"></i></button>
						<button id="tab-expenses" class="tab"><i class="fa-solid fa-euro-sign"></i></button>
						<button id="tab-wishlist" class="tab"><i class="fa-solid fa-heart"></i></button>
					</div>

					<div id="overview-panel" class="panel">
						<div class="input-group">
							<input type="number" id="monthly-income" placeholder="Reddito Mensile">
							<button id="save-income"><i class="fa-solid fa-floppy-disk"></i></button>
						</div>
						<div id="monthly-summary">
							<h3>Riepilogo Mensile</h3>
							<div id="summary-content"></div>
						</div>
						<!-- Aggiungi qui i controlli di backup -->
						<div class="backup-controls">
							<div class="row-flex">
								<span>Esporta Dati</span><i id="export-data" class="fa-solid fa-file-export"></i>
								<input type="file" id="import-data" accept=".json" style="display: none">
							</div>
							<div class="import-options mb-2">
								<select id="import-mode" class="w-full">
									<option value="replace">Sostituisci dati esistenti</option>
									<option value="merge">Unisci con dati esistenti</option>
									<option value="append">Aggiungi in coda</option>
								</select>
							</div>
							<div class="row-flex">
								<span>Importa Dati</span><i id="import-trigger" class="fa-solid fa-file-import"></i>
							</div>
						</div>
					</div>

					<div id="expenses-panel" class="panel" style="display: none">
						<form id="expense-form">
							<input type="number" id="expense-amount" placeholder="Importo" required>
							<div class="custom-select-wrapper">
								<div class="custom-select" id="custom-category-select">
									<i class="fa-solid fa-chevron-down"></i>
									<span>Seleziona categoria</span>
								</div>
								<div class="custom-select-options">
								${Object.entries(EXPENSE_CATEGORIES).map(([key, value]) => {
									const categoryKey = value.split(' ')[0].toLowerCase(); // Prendiamo solo la parte testuale, non l'emoji
									const iconData = CATEGORY_ICONS[categoryKey] || CATEGORY_ICONS['altro'];

									return `
										<div class="custom-select-option" data-value="${value}" data-key="${key}">
											<i class="fa-solid ${iconData.icon} category-icon" style="color: ${iconData.color}"></i>
											<span>${key}</span>
										</div>
									`;
								}).join('')}
							</div>
							<input type="hidden" id="expense-category" required>
							</div>
								<input type="text" id="expense-description" placeholder="Descrizione">
								<input type="date" id="expense-date" required>
								<button type="submit">Aggiungi Spesa</button>
						</form>
					<div id="expenses-list"></div>
				</div>

				<div id="wishlist-panel" class="panel" style="display: none">
					<form id="wishlist-form">
						<input type="text" id="wish-name" placeholder="Nome Articolo" required>
						<input type="number" id="wish-price" placeholder="Prezzo Stimato" required>
						<select id="wish-priority" required>
							${Object.entries(PRIORITY_LEVELS).map(([key, value]) =>
								`<option value="${value}">${key}</option>`
							).join('')}
						</select>
						<textarea id="wish-notes" placeholder="Note"></textarea>
						<button type="submit">Aggiungi alla Wishlist</button>
					</form>
					<div id="wishlist-items"></div>
				</div>
			`;

			MDL.open('Gestione Spese e Budget', content);


        // Gestione del custom select
        const customSelect = document.getElementById('custom-category-select');
        const optionsContainer = customSelect.nextElementSibling;
        const hiddenInput = document.getElementById('expense-category');

        customSelect.addEventListener('click', () => {
					optionsContainer.style.display = optionsContainer.style.display === 'none' ? 'block' : 'none';
        });

        document.addEventListener('click', (e) => {
            if (!customSelect.contains(e.target)) {
							optionsContainer.style.display = 'none';
            }
        });

        optionsContainer.querySelectorAll('.custom-select-option').forEach(option => {
            option.addEventListener('click', () => {
							const value = option.dataset.value;
							const key = option.dataset.key;
							hiddenInput.value = value;
							customSelect.innerHTML = `
								<i class="fa-solid ${CATEGORY_ICONS[key].icon} category-icon" style="color: ${CATEGORY_ICONS[key].color}"></i>
								<span>${key}</span>
								<i class="fa-solid fa-chevron-down"></i>
							`;
							optionsContainer.style.display = 'none';
            });
        });

        // Gestione tab
        document.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const clickedTab = e.target.closest('.tab'); // Usa closest per gestire il click sull'icona
                if (!clickedTab) return;

                document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.panel').forEach(p => p.style.display = 'none');

                clickedTab.classList.add('active');
                const panelId = clickedTab.id.replace('tab-', '') + '-panel';
                const panel = document.getElementById(panelId);

                if (panel) {
                    panel.style.display = 'block';
                    if (panelId === 'overview-panel') {
                        updateSummary();
                    }
                }
            });
        });

        // Gestione reddito mensile
        document.getElementById('save-income').addEventListener('click', () => {
            const income = parseFloat(document.getElementById('monthly-income').value);
            if (!isNaN(income)) {
                expenseManager.monthlyIncome = income;
                updateSummary();
            }
        });

        // Gestione form spese
        document.getElementById('expense-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const expense = expenseManager.addExpense(
                parseFloat(document.getElementById('expense-amount').value),
                document.getElementById('expense-category').value,
                document.getElementById('expense-description').value,
                document.getElementById('expense-date').value
            );
            updateExpensesList();
            updateSummary();
            e.target.reset();
        });

        // Gestione form wishlist
        document.getElementById('wishlist-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const item = expenseManager.addWishlistItem(
                document.getElementById('wish-name').value,
                parseFloat(document.getElementById('wish-price').value),
                parseInt(document.getElementById('wish-priority').value),
                document.getElementById('wish-notes').value
            );
            updateWishlist();
            e.target.reset();
        });

        document.getElementById('export-data').addEventListener('click', () => {
            expenseManager.exportData();
        });

        document.getElementById('import-trigger').addEventListener('click', () => {
            document.getElementById('import-data').click();
        });

        document.getElementById('import-data').addEventListener('change', async (e) => {
            if (e.target.files.length > 0) {
                const mode = document.getElementById('import-mode').value;
                const success = await expenseManager.importData(e.target.files[0], mode);
                if (success) {
                    updateExpensesList();
                    updateWishlist();
                    updateSummary();
                    alert('Importazione completata con successo!');
                } else {
                    alert('Errore durante l\'importazione dei dati');
                }
            }
        });

        function updateSummary() {
            const currentDate = new Date();
            const monthlyData = expenseManager.generateMonthlyReport(
                currentDate.getMonth(),
                currentDate.getFullYear()
            );

            const summaryContent = document.getElementById('summary-content');

            // Calcola la percentuale di stipendio già spesa
            const spentPercentage = (monthlyData.totalExpenses / monthlyData.income * 100).toFixed(1);

            // Filtra gli elementi della wishlist che potresti permetterti con i risparmi attuali
            const affordableItems = monthlyData.wishlist
                .filter(item => item.estimatedPrice <= monthlyData.savings)
                .sort((a, b) => a.estimatedPrice - b.estimatedPrice);

            // Prepara la parte delle spese per categoria
            const categoryExpenses = Object.entries(monthlyData.expenses)
                .filter(([_, amount]) => amount > 0)
                .map(([category, amount]) => {
                    const categoryKey = category.split(' ')[0].toLowerCase();
                    const iconData = CATEGORY_ICONS[categoryKey] || CATEGORY_ICONS['altro'];
                    const percentage = (amount/monthlyData.totalExpenses*100).toFixed(1);

                    return `
                        <div class="category-item">
                            <span>
                                <i class="fa-solid ${iconData.icon} category-icon" style="color: ${iconData.color}"></i>
                                ${category}
                            </span>
                            <span>${amount.toFixed(2)}€</span>
                            <span class="percentage">(${percentage}%)</span>
                        </div>
                    `;
                }).join('');

            summaryContent.innerHTML = `
                <div class="summary-item">
                    <strong>Reddito Mensile:</strong> ${monthlyData.income.toFixed(2)}€
                </div>
                <div class="summary-item">
                    <strong>Spese Totali:</strong> ${monthlyData.totalExpenses.toFixed(2)}€
                    <span class="percentage">(${spentPercentage}% del reddito)</span>
                </div>
                <div class="summary-item">
                    <strong>Risparmi:</strong> ${monthlyData.savings.toFixed(2)}€
                </div>

                <h4>Spese per Categoria:</h4>
                <div class="category-expenses">
                    ${categoryExpenses}
                </div>

                ${monthlyData.savings > 0 ? `
                    <h4 class="mt-4">Elementi Wishlist Acquistabili:</h4>
                    ${affordableItems.length > 0 ?
                        affordableItems.map(item => `
                            <div class="wishlist-available">
                                <span>${item.name}:</span> ${item.estimatedPrice.toFixed(2)}€
                                <span class="percentage">(${(item.estimatedPrice/monthlyData.savings*100).toFixed(1)}% dei risparmi)</span>
                            </div>
                        `).join('')
                        : '<div class="no-items">Nessun elemento della wishlist acquistabile con i risparmi attuali</div>'
                    }`
                    : ''
                }
            `;
        }

        function updateExpensesList() {
            const container = document.getElementById('expenses-list');
            if (expenseManager.expenses.length === 0) {
                container.innerHTML = '<div class="empty-state">Nessuna spesa registrata</div>';
                return;
            }

            container.innerHTML = expenseManager.expenses
                .sort((a, b) => b.date - a.date)
                .map(exp => {
                    const categoryKey = exp.category.split(' ')[0].toLowerCase();
                    const iconData = CATEGORY_ICONS[categoryKey] || CATEGORY_ICONS['altro'];

                    return `
                        <div class="expense-item" data-id="${exp.id}">
                            <span class="amount">${exp.amount.toFixed(2)}€</span>
                            <span class="category">
                                <i class="fa-solid ${iconData.icon} category-icon" style="color: ${iconData.color}"></i>
                                ${exp.category}
                            </span>
                            <span class="description">${exp.description}</span>
                            <span class="date">${new Date(exp.date).toLocaleDateString()}</span>
                            <button class="delete-expense">
                                <i class="fa-solid fa-trash"></i>
                            </button>
                        </div>
                    `;
                }).join('');

            // Gestione eliminazione spese
            container.querySelectorAll('.delete-expense').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const id = parseInt(e.target.closest('.expense-item').dataset.id);
                    expenseManager.removeExpense(id);
                    updateExpensesList();
                    updateSummary();
                });
            });
        }

				function updateWishlist() {
					const container = document.getElementById('wishlist-items');
					if (!expenseManager.wishlist || expenseManager.wishlist.length === 0) {
							container.innerHTML = '<div class="empty-state">La wishlist è vuota</div>';
							return;
					}

					container.innerHTML = expenseManager.wishlist
							.sort((a, b) => b.priority - a.priority)
							.map(item => `
									<div class="wishlist-item" data-id="${item.id}">
											<span class="name">${item.name}</span>
											<span class="price">${item.estimatedPrice.toFixed(2)}€</span>
											<span class="priority">Priorità: ${
													Object.entries(PRIORITY_LEVELS)
															.find(([_, value]) => value === item.priority)?.[0] || 'Bassa'
											}</span>
											<p class="notes">${item.notes || ''}</p>
											<button class="delete-wish">❌</button>
									</div>
							`).join('');

					// Gestione eliminazione wishlist
					container.querySelectorAll('.delete-wish').forEach(btn => {
							btn.addEventListener('click', (e) => {
									const id = parseInt(e.target.closest('.wishlist-item').dataset.id);
									expenseManager.removeWishlistItem(id);
									updateWishlist();
							});
					});
				}

        // Inizializzazione
        updateExpensesList();
        updateWishlist();
        updateSummary();
    }
};