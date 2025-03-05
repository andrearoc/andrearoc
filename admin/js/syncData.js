import { googleSheetsService } from './sync.js';
import { expenseManager } from '../../public/js/modules/expenseEstimator.js';
import { PRIORITY_LEVELS } from '../../public/js/modules/expenseEstimator.js';

export async function syncDataToSheets() {
    try {
        // Autentica con Google
        const authenticated = await googleSheetsService.authenticate();
        if (!authenticated) {
            console.error('Autenticazione fallita');
            return false;
        }

        // ID del tuo foglio Google Sheets (da sostituire con il tuo)
        const SPREADSHEET_ID = '1kYOr9X0TTIyF-QuXz8-kTs9FckYvxiPnCftNAr_WH4Y';

        // Sincronizza note
        if (expenseManager.notes && expenseManager.notes.length > 0) {
            const noteValues = expenseManager.notes.map(note => [
                note.id,
                note.title,
                note.content,
                note.category,
                new Date(note.date).toLocaleDateString()
            ]);
            await googleSheetsService.writeSheet(SPREADSHEET_ID, 'Note!A2:E', noteValues);
        }

        // Sincronizza spese
        if (expenseManager.expenses && expenseManager.expenses.length > 0) {
            const expenseValues = expenseManager.expenses.map(expense => [
                expense.id,
                expense.amount,
                expense.category,
                expense.description,
                new Date(expense.date).toLocaleDateString()
            ]);
            await googleSheetsService.writeSheet(SPREADSHEET_ID, 'Spese!A2:E', expenseValues);
        }

        // Sincronizza wishlist
        if (expenseManager.wishlist && expenseManager.wishlist.length > 0) {
            const wishlistValues = expenseManager.wishlist.map(item => [
                item.id,
                item.name,
                item.estimatedPrice,
                Object.entries(PRIORITY_LEVELS).find(([_, value]) => value === item.priority)?.[0] || 'Bassa',
                item.notes || ''
            ]);
            await googleSheetsService.writeSheet(SPREADSHEET_ID, 'Wishlist!A2:E', wishlistValues);
        }

        console.log('✅ Sincronizzazione completata');
        return true;
    } catch (error) {
        console.error('❌ Errore durante la sincronizzazione:', error);
        return false;
    }
}