import { storageManager } from './storage-manager.js';

export const EXPENSE_CATEGORIES = {
    CASA: 'casa',
    ALIMENTARI: 'alimentari',
    TRASPORTI: 'trasporti',
    SALUTE: 'salute',
    SVAGO: 'svago',
    ALTRO: 'altro'
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
        return [...this.expenses]
            .sort((a, b) => b.amount - a.amount)
            .slice(0, limit);
    }

    // Esportazione dati
    generateMonthlyReport(month, year) {
        const expenses = this.getExpensesByCategory(month, year);
        const totalExpenses = this.calculateMonthlyExpenses(month, year);
        const savings = this.estimateSavings(month, year);

        return {
            month,
            year,
            income: this.monthlyIncome,
            expenses,
            totalExpenses,
            savings,
            wishlist: this.wishlist.sort((a, b) => b.priority - a.priority)
        };
    }

    // Backup e ripristino
    exportData() {
        return storageManager.exportData();
    }

    async importData(file) {
        return await storageManager.importData(file);
    }
}

export const expenseManager = new ExpenseManager();