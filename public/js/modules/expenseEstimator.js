import { storageManager } from './storage-manager.js';

export const EXPENSE_CATEGORIES = {
    CASA: 'casa',
    ALIMENTARI: 'alimentari',
    TRASPORTI: 'trasporti',
    SALUTE: 'salute',
    SVAGO: 'svago',
    PIZZA:'pizza',
    SUSHI:'sushi',
    BENZINA:'benzina',
    RISTORANTE:'ristorante',
    VIAGGI:'viaggi',
    ALTRO:'altro'
};

export const PRIORITY_LEVELS = {
    BASSA: 1,
    MEDIA: 2,
    ALTA: 3
};

class ExpenseManager {
    constructor() {
        this.expenses = [];
        this.wishlist = [];
				this.notes = [];
        this.monthlyIncome = 0;
        this.monthlyBudget = 0;
        storageManager.loadState(this);
    }

    // Gestione spese
    addExpense(amount, category, description, date = new Date()) {
        const expense = {
            id: Date.now(),
            amount,
            category,
            description,
            date: new Date(date)
        };
        this.expenses.push(expense);
        storageManager.saveState(this);
        return expense;
    }

    removeExpense(expenseId) {
        this.expenses = this.expenses.filter(exp => exp.id !== expenseId);
        storageManager.saveState(this);
    }

    // Gestione wishlist
		addWishlistItem(name, estimatedPrice, priority, notes = '') {
			// Controlla se un elemento con lo stesso nome esiste già
			const existingItem = this.wishlist.find(item =>
					item.name === name &&
					item.estimatedPrice === estimatedPrice
			);

			if (existingItem) {
					// Se esiste già, potresti voler aggiornare l'item esistente o semplicemente non aggiungerlo
					return existingItem;
			}

			const item = {
					id: Date.now(),
					name,
					estimatedPrice,
					priority,
					notes,
					dateAdded: new Date()
			};
			this.wishlist.push(item);
			storageManager.saveState(this);
			return item;
	}

    removeWishlistItem(itemId) {
        this.wishlist = this.wishlist.filter(item => item.id !== itemId);
        storageManager.saveState(this);
    }

    // Gestione reddito
    setMonthlyIncome(amount) {
        this.monthlyIncome = amount;
        storageManager.saveState(this);
    }

    setMonthlyBudget(amount) {
        this.monthlyBudget = amount;
        storageManager.saveState(this);
    }

    // Analisi e report
    calculateMonthlyExpenses(month, year) {
        return this.expenses
            .filter(exp => {
                const expDate = new Date(exp.date);
                return expDate.getMonth() === month && expDate.getFullYear() === year;
            })
            .reduce((total, exp) => total + exp.amount, 0);
    }

    getExpensesByCategory(month, year) {
        const categories = {};
        Object.values(EXPENSE_CATEGORIES).forEach(cat => categories[cat] = 0);

        this.expenses
            .filter(exp => {
                const expDate = new Date(exp.date);
                return expDate.getMonth() === month && expDate.getFullYear() === year;
            })
            .forEach(exp => {
                categories[exp.category] += exp.amount;
            });

        return categories;
    }

    estimateSavings(month, year) {
        const monthlyExpenses = this.calculateMonthlyExpenses(month, year);
        return this.monthlyIncome - monthlyExpenses;
    }

		// Metodo per aggiungere una nota
		addNote(title, content, category, date = new Date()) {
			const note = {
					id: Date.now(),
					title,
					content,
					category,
					date: new Date(date)
			};
			this.notes.push(note);
			storageManager.saveState(this);
			return note;
		}

		// Metodo per rimuovere una nota
		removeNote(noteId) {
			this.notes = this.notes.filter(note => note.id !== noteId);
			storageManager.saveState(this);
		}

    // Funzioni di utility per l'analisi dei trend
    getMonthlyTrend(months = 6) {
        const trend = [];
        const today = new Date();

        for (let i = 0; i < months; i++) {
            const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
            trend.unshift({
                month: date.toLocaleString('it-IT', { month: 'short' }),
                year: date.getFullYear(),
                expenses: this.calculateMonthlyExpenses(date.getMonth(), date.getFullYear()),
                savings: this.estimateSavings(date.getMonth(), date.getFullYear())
            });
        }

        return trend;
    }

		getTopExpenses(limit = 5) {
			if (!this.expenses || this.expenses.length === 0) {
					return [];
			}
			return [...this.expenses]
					.sort((a, b) => b.amount - a.amount)
					.slice(0, limit);
		}

	// Also update the generateMonthlyReport method
		generateMonthlyReport(month, year) {
			const expenses = this.getExpensesByCategory(month, year);
			const totalExpenses = this.calculateMonthlyExpenses(month, year);
			const savings = this.estimateSavings(month, year);

			return {
					month,
					year,
					income: this.monthlyIncome || 0,
					expenses,
					totalExpenses,
					savings,
					wishlist: this.wishlist && this.wishlist.length > 0
							? this.wishlist.sort((a, b) => b.priority - a.priority)
							: []
			};
		}

    // Backup e ripristino
    exportData() {
        return storageManager.exportData();
    }

    async importData(file, mode = 'replace') {
        try {
            const text = await file.text();
            const importedData = JSON.parse(text);

            switch(mode) {
           case 'merge':
                // Combina la wishlist, evitando duplicati basati su nome e prezzo stimato
                const mergedWishlist = [...this.wishlist];
                importedData.wishlist.forEach(newItem => {
                    const isDuplicate = mergedWishlist.some(
                        item => item.name === newItem.name &&
                                item.estimatedPrice === newItem.estimatedPrice
                    );

                    if (!isDuplicate) {
                        mergedWishlist.push(newItem);
                    }
                });
                this.wishlist = mergedWishlist;
                break;

                case 'append':
                    // Aggiunge semplicemente i nuovi dati in coda
                    this.expenses = [...this.expenses, ...importedData.expenses];
                    this.wishlist = [...this.wishlist, ...importedData.wishlist];
                    break;

                case 'replace':
                default:
                    // Sostituzione totale
                    this.expenses = importedData.expenses;
                    this.wishlist = importedData.wishlist;
                    this.monthlyIncome = importedData.monthlyIncome;
                    this.monthlyBudget = importedData.monthlyBudget;
            }

            storageManager.saveState(this);
            return true;
        } catch (error) {
            console.error(`Errore nell'importazione dei dati: ${error.message}`);
            return false;
        }
    }
}

export const expenseManager = new ExpenseManager();