import { expenseManager } from './expenseEstimator.js';
import { syncDataToSheets } from '../../../admin/js/syncData.js';  // Importa dal nuovo modulo

const NOTES = {
    createInterface: () => {
        const content = document.createElement('div');
        content.innerHTML = `
            <div class="notes-container">
                <form id="note-form">
                    <input type="text" id="note-title" placeholder="Titolo Nota" required>
                    <select id="note-category" required>
                        <option value="">Seleziona Categoria</option>
                        <option value="personale">Personale</option>
                        <option value="lavoro">Lavoro</option>
                        <option value="spese">Spese</option>
                        <option value="promemoria">Promemoria</option>
                        <option value="altro">Altro</option>
                    </select>
                    <textarea id="note-content" placeholder="Contenuto Nota" required></textarea>
                    <input type="date" id="note-date" value="${new Date().toISOString().split('T')[0]}" required>
                    <button type="submit">Aggiungi Nota</button>
                </form>

                <div id="notes-list" class="mt-4">
                    <!-- Le note verranno inserite qui dinamicamente -->
                </div>
            </div>
        `;

        // Funzione per aggiornare la lista delle note
        function updateNotesList() {
            const container = document.getElementById('notes-list');
						if (!container) {
                console.error('Elemento #notes-list non trovato.');
                return;
            }
            const notes = expenseManager.notes || [];

            if (notes.length === 0) {
                container.innerHTML = '<div class="empty-state">Nessuna nota presente</div>';
                return;
            }

            // Ordina le note per data (più recenti prima)
            const sortedNotes = notes.sort((a, b) => new Date(b.date) - new Date(a.date));

            container.innerHTML = sortedNotes.map(note => `
                <div class="note-item" data-id="${note.id}">
                    <div class="note-header">
                        <span class="note-title">${note.title}</span>
                        <span class="note-category badge">${note.category}</span>
                        <span class="note-date">${new Date(note.date).toLocaleDateString()}</span>
                    </div>
                    <div class="note-content">${note.content}</div>
                    <button class="delete-note">❌</button>
                </div>
            `).join('');

            // Aggiungi gestori per l'eliminazione delle note
            container.querySelectorAll('.delete-note').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const noteId = parseInt(e.target.closest('.note-item').dataset.id);
                    expenseManager.removeNote(noteId);
                    updateNotesList();
                });
            });
        }

        // Gestore del form per l'aggiunta di note
        content.querySelector('#note-form').addEventListener('submit', async (e) => {
					e.preventDefault();

					const title = content.querySelector('#note-title').value;
					const category = content.querySelector('#note-category').value;
					const content_text = content.querySelector('#note-content').value;
					const date = content.querySelector('#note-date').value;

					// Aggiungi la nota
					expenseManager.addNote(title, content_text, category, date);

					// Aggiorna la lista delle note
					updateNotesList();

					// Sincronizza con Google Sheets
					await syncDataToSheets();

					// Resetta il form
					e.target.reset();
					content.querySelector('#note-date').value = new Date().toISOString().split('T')[0];
				});

        // Inizializza la lista delle note al primo caricamento
        updateNotesList();

				setTimeout(() => {
					updateNotesList();
				}, 1000);

        return content;
    }
};

export default NOTES;