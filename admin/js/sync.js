export class GoogleSheetsService {
	constructor() {
			this.CLIENT_ID = '924064302127-affamosl3er20djc33fhv069vml464jp.apps.googleusercontent.com';
			this.API_KEY = 'AIzaSyBM0UmKL8TxpfzRPlEbiyvv9adFFbFollo';
			this.SCOPES = "https://www.googleapis.com/auth/spreadsheets";
	}

	// Carica le librerie Google
	async loadGoogleLibraries() {
			return new Promise((resolve, reject) => {
					// Carica librerie Google
					const scripts = [
							'https://apis.google.com/js/api.js',
							'https://accounts.google.com/gsi/client'
					];

					const loadScripts = scripts.map(src => {
							return new Promise((scriptResolve, scriptReject) => {
									const script = document.createElement('script');
									script.src = src;
									script.async = true;
									script.defer = true;
									script.onload = () => scriptResolve();
									script.onerror = scriptReject;
									document.head.appendChild(script);
							});
					});

					Promise.all(loadScripts)
							.then(() => {
									console.log('✅ Librerie Google caricate');
									resolve();
							})
							.catch(reject);
			});
	}

	// Inizializza il client Google
	async initClient() {
			try {
					await this.loadGoogleLibraries();

					// Inizializza il client sheets
					await new Promise((resolve, reject) => {
							window.gapi.load('client', () => {
									window.gapi.client.init({
											apiKey: this.API_KEY,
											discoveryDocs: ["https://sheets.googleapis.com/$discovery/rest?version=v4"]
									}).then(resolve).catch(reject);
							});
					});

					console.log('✅ Client Google inizializzato');
					return true;
			} catch (error) {
					console.error('❌ Errore inizializzazione client:', error);
					return false;
			}
	}

	// Autenticazione
	async authenticate() {
    try {
        // Inizializza il client
        const initialized = await this.initClient();
        if (!initialized) {
            console.error('❌ Inizializzazione fallita');
            return false;
        }

        // Controlla se esiste un token salvato
        const savedToken = localStorage.getItem('google_oauth_token');

        const tokenClient = window.google.accounts.oauth2.initTokenClient({
            client_id: this.CLIENT_ID,
            scope: this.SCOPES,
            callback: (tokenResponse) => {
                console.log('✅ Token ottenuto:', tokenResponse);
                // Salva il token
                localStorage.setItem('google_oauth_token', JSON.stringify({
                    ...tokenResponse,
                    obtained_at: Date.now()
                }));
            }
        });

        if (savedToken) {
            const parsedToken = JSON.parse(savedToken);
            // Controlla se il token è valido (scade dopo 1 ora)
            if (Date.now() - parsedToken.obtained_at < 3600000) {
                return true;
            }
        }

        // Richiedi nuovo token
        return new Promise((resolve) => {
            tokenClient.requestAccessToken({
                prompt: 'consent' // Assicura che l'utente dia tutti i permessi
            });
            resolve(true);
        });
    } catch (error) {
        console.error('❌ Errore di autenticazione:', error);
        return false;
    }
	}

	// Legge i valori da un foglio
	async readSheet(spreadsheetId, range) {
			try {
					const response = await window.gapi.client.sheets.spreadsheets.values.get({
							spreadsheetId: spreadsheetId,
							range: range
					});

					console.log(`✅ Lettura foglio ${spreadsheetId} - Range ${range}`);
					return response.result.values;
			} catch (error) {
					console.error(`❌ Errore lettura foglio ${spreadsheetId}:`, error);
					return null;
			}
	}

	// Scrive valori in un foglio
	async writeSheet(spreadsheetId, range, values) {
			try {
					const response = await window.gapi.client.sheets.spreadsheets.values.update({
							spreadsheetId: spreadsheetId,
							range: range,
							valueInputOption: 'RAW',
							values: values
					});

					console.log(`✅ Scrittura foglio ${spreadsheetId} - Range ${range}`);
					return response;
			} catch (error) {
					console.error(`❌ Errore scrittura foglio ${spreadsheetId}:`, error);
					return null;
			}
	}
}

export const googleSheetsService = new GoogleSheetsService();