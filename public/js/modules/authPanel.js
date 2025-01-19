const AUTH_PANEL = (() => {
  const allowedEmails = ["andrearoci91@gmail.com", "mariacarla.altana@gmail.com"];

  // Funzione per creare il pannello di autenticazione
  const createPanel = (onSuccess) => {
    const panel = document.createElement("div");
    panel.id = "auth-panel";
    panel.style.position = "fixed";
    panel.style.top = 0;
    panel.style.left = 0;
    panel.style.width = "100%";
    panel.style.height = "100%";
    panel.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
    panel.style.display = "flex";
    panel.style.justifyContent = "center";
    panel.style.alignItems = "center";
    panel.style.zIndex = 1000;

    panel.innerHTML = `
      <div style="background: white; padding: 20px; border-radius: 10px; text-align: center;">
        <h2>Autenticazione Richiesta</h2>
        <p>Premi il pulsante per autenticarti.</p>
        <button id="biometric-auth-btn" style="padding: 10px 20px;">Autenticati</button>
      </div>
    `;
    document.body.appendChild(panel);

    // Event listener per il pulsante di autenticazione
    document.getElementById("biometric-auth-btn").addEventListener("click", async () => {
      try {
        if (!window.PublicKeyCredential) {
          alert("Il tuo dispositivo non supporta l'autenticazione biometrica.");
          return;
        }

        const assertion = await navigator.credentials.get({
          publicKey: {
            challenge: new Uint8Array(32), // Simula una challenge generata dal server
            allowCredentials: [], // Nessuna credenziale pre-registrata richiesta
            timeout: 60000,
            userVerification: "preferred",
          },
        });

        // Simula il recupero dell'email (normalmente lato server)
        const email = "andrearoci91@gmail.com"; // Simula un'email verificata

        if (allowedEmails.includes(email)) {
          panel.remove();
          onSuccess();
        } else {
          alert("Accesso negato. Utente non riconosciuto.");
        }
      } catch (error) {
        console.error(error);
        alert("Autenticazione fallita. Riprova.");
      }
    });
  };

  return { createPanel };
})();

export default AUTH_PANEL;
