// Import dei moduli
import TEMA from './modules/theme.js'
import MDL from './modules/modal.js';
import { initializeTools } from './modules/tools.js';
import { googleSheetsService } from '../../admin/js/sync.js';
import { expenseManager } from './modules/expenseEstimator.js';

console.log('Main loaded');

// Configurazione Google Sheets
const SPREADSHEET_ID = '1kYOr9X0TTIyF-QuXz8-kTs9FckYvxiPnCftNAr_WH4Y';
const SHEETS = {
	EXPENSES: 'SpeseCasa!A1:E', // Definisci i range dei tuoi fogli
	WISHLIST: 'ListaSpesa!A1:E',
	NOTES: 'Note!A1:E'
};

// Inizializza l'applicazione
const initializeApp = () => {
	// Rimuovi AUTH_PANEL.createPanel(onAuthenticationSuccess);

	// Inizializza il sistema modal
	MDL.init();

	// Inizializza gli event listeners
	setupEventListeners();

	// Inizializza il tema
	TEMA.init();

	// Aggiungi il bottone di sincronizzazione
	setupSyncButton();
};

// Sincronizzazione dei dati da Google Sheets
async function syncDataFromSheets() {
	try {
		// Autentica
		await googleSheetsService.authenticate();
		console.log('✅ Autenticazione riuscita');

		// Leggi spese
		const expensesData = await googleSheetsService.readSheet(
			SPREADSHEET_ID,
			SHEETS.EXPENSES
		);

		if (expensesData && expensesData.length > 1) {
			// Converti i dati del foglio in spese
			const expenses = expensesData.slice(1).map(row => ({
				id: Date.now(), // Genera un nuovo ID
				amount: parseFloat(row[1] || 0),
				category: row[2] || 'altro',
				description: row[3] || '',
				date: new Date(row[4] || Date.now())
			}));

			// Aggiorna ExpenseManager
			expenseManager.expenses = expenses;
			console.log('✅ Spese sincronizzate:', expenses);
		}

		// Leggi wishlist (stesso pattern)
		const wishlistData = await googleSheetsService.readSheet(
			SPREADSHEET_ID,
			SHEETS.WISHLIST
		);

		if (wishlistData && wishlistData.length > 1) {
			const wishlist = wishlistData.slice(1).map(row => ({
				id: parseInt(row[0]) || Date.now(), // Usa l'ID dal foglio o genera un nuovo ID
				name: row[1] || '',
				estimatedPrice: parseFloat(row[2] || 0),
				priority: parseInt(row[3] || 1),
				notes: row[4] || '',
				dateAdded: new Date(row[4] || Date.now())
			}));

			expenseManager.wishlist = wishlist;
			console.log('✅ Wishlist sincronizzata:', wishlist);
		}

		const notesData = await googleSheetsService.readSheet(
		SPREADSHEET_ID,
		SHEETS.NOTES
	);

		// Processa i dati delle note
		if (notesData && notesData.length > 1) {
			const notes = notesData.slice(1).map(row => ({
				id: parseInt(row[0]) || Date.now(),
				title: row[1] || '',
				content: row[2] || '',
				category: row[3] || '',
				date: new Date(row[4] || Date.now())
			}));

			// Aggiorna le note nel gestore
			expenseManager.notes = notes;
			console.log('✅ Note sincronizzate:', notes);
		}
	} catch (error) {
		console.error('❌ Errore durante la sincronizzazione:', error);
	}
}

// Sincronizzazione dei dati verso Google Sheets
async function syncDataToSheets() {
	try {
		// Autentica
		await googleSheetsService.authenticate();

		// Prepara dati spese
		const expensesData = [
			['ID', 'Importo', 'Categoria', 'Descrizione', 'Data'],
			...expenseManager.expenses.map(exp => [
				exp.id,
				exp.amount,
				exp.category,
				exp.description,
				exp.date.toISOString()
			])
		];

		// Scrivi spese
		await googleSheetsService.writeSheet(
			SPREADSHEET_ID,
			SHEETS.EXPENSES,
			expensesData
		);

		// Prepara dati wishlist
		const wishlistData = [
			['ID', 'Nome', 'Prezzo', 'Priorità', 'Note'],
			...expenseManager.wishlist.map(item => [
				item.id,
				item.name,
				item.estimatedPrice,
				item.priority,
				item.notes
			])
		];

		// Scrivi wishlist
		await googleSheetsService.writeSheet(
			SPREADSHEET_ID,
			SHEETS.WISHLIST,
			wishlistData
		);

		// Aggiungi sezione per le note
		const notesData = [
			['ID', 'Titolo', 'Contenuto', 'Categoria', 'Data'],
			...(expenseManager.notes || []).map(note => [
				note.id,
				note.title,
				note.content,
				note.category,
				note.date.toISOString()
			])
		];

		// Scrivi note
		await googleSheetsService.writeSheet(
			SPREADSHEET_ID,
			SHEETS.NOTES,
			notesData
		);

		console.log('✅ Dati sincronizzati su Google Sheets');
	} catch (error) {
		console.error('❌ Errore durante la sincronizzazione:', error);
	}
}

function setupSyncButton() {
	const syncButton = document.getElementById('sync-button');

	if (!syncButton) {
		console.error('Il bottone di sincronizzazione non è stato trovato.');
		return;
	}

	syncButton.addEventListener('click', async () => {
		try {
			await syncDataToSheets();
			await syncDataFromSheets();
			alert('Sincronizzazione completata con successo!');
		} catch (error) {
			console.error('Errore durante la sincronizzazione:', error);
			alert('Errore durante la sincronizzazione.');
		}
	});
}

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

// Imposta sincronizzazione periodica
const setupPeriodicSync = () => {
	// Opzionale: riduci la frequenza o rimuovi del tutto
	setInterval(() => {
		console.log('🔄 Sincronizzazione periodica');
		syncDataToSheets();
		syncDataFromSheets();
	}, 5 * 60 * 1000); // Ogni 5 minuti invece di ogni minuto
};

// Avvia l'applicazione
initializeApp();
setupPeriodicSync();

// Esporta le funzioni per un eventuale uso esterno
export { syncDataFromSheets, syncDataToSheets };