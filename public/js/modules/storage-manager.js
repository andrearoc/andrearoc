class StorageManager {
	constructor(storageKey) {
		this.storageKey = storageKey;
		this.cache = null;
	}

	// Salvataggio dati con gestione errori e compressione
	save(data) {
		try {
			const serializedData = JSON.stringify(data);
			localStorage.setItem(this.storageKey, serializedData);
			this.cache = data;
			return true;
		} catch (error) {
			console.error(`Errore nel salvataggio dei dati: ${error.message}`);
			return false;
		}
	}

	// Caricamento dati con cache
	load() {
		if (this.cache) return this.cache;

		try {
			const data = localStorage.getItem(this.storageKey);
			this.cache = data ? JSON.parse(data) : null;
			return this.cache;
		} catch (error) {
			console.error(`Errore nel caricamento dei dati: ${error.message}`);
			return null;
		}
	}

	// Aggiornamento parziale dei dati
	update(updateFn) {
		const currentData = this.load();
		if (currentData) {
			const updatedData = updateFn(currentData);
			return this.save(updatedData);
		}
		return false;
	}

	// Cancellazione dati
	clear() {
		try {
			localStorage.removeItem(this.storageKey);
			this.cache = null;
			return true;
		} catch (error) {
			console.error(`Errore nella cancellazione dei dati: ${error.message}`);
			return false;
		}
	}

	// Verifica spazio disponibile
	checkStorageSpace() {
		let totalSpace = 0;
		try {
			for (let key in localStorage) {
				if (localStorage.hasOwnProperty(key)) {
					totalSpace += localStorage[key].length;
				}
			}
			return {
				used: totalSpace,
				remaining: 5242880 - totalSpace, // 5MB è il limite tipico
				full: totalSpace > 5242880
			};
		} catch (error) {
			console.error(`Errore nel controllo dello spazio: ${error.message}`);
			return null;
		}
	}
}

// Estensione specifica per ExpenseManager
class ExpenseStorageManager extends StorageManager {
	constructor() {
		super('expense_manager_data');
	}

	// Salva l'intero stato del expense manager
	saveState(expenseManager) {
    return this.save({
			expenses: expenseManager.expenses,
			wishlist: expenseManager.wishlist,
			notes: expenseManager.notes, // Aggiungi note
			monthlyIncome: expenseManager.monthlyIncome,
			monthlyBudget: expenseManager.monthlyBudget,
			lastUpdate: new Date().toISOString()
    });
	}

	loadState(expenseManager) {
		const data = this.load();
		if (data) {
			expenseManager.expenses = data.expenses;
			expenseManager.wishlist = data.wishlist;
			expenseManager.notes = data.notes || []; // Aggiungi caricamento note
			expenseManager.monthlyIncome = data.monthlyIncome;
			expenseManager.monthlyBudget = data.monthlyBudget;
			return true;
		}
		return false;
	}

	// Backup dei dati in formato JSON
	exportData() {
		const data = this.load();
		if (data) {
			const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
			const url = URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = `expense_manager_backup_${new Date().toISOString().slice(0,10)}.json`;
			a.click();
			URL.revokeObjectURL(url);
		}
	}

	// Importa dati da un file JSON
	async importData(file) {
		try {
			const text = await file.text();
			const data = JSON.parse(text);
			return this.save(data);
		} catch (error) {
			console.error(`Errore nell'importazione dei dati: ${error.message}`);
			return false;
		}
	}
}

export const storageManager = new ExpenseStorageManager();