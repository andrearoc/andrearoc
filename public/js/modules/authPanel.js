const AUTH_PANEL = (() => {
  const allowedEmails = ["andrearoci91@gmail.com", "mariacarla.altana@gmail.com"];
  const allowedPassword = "Chausset2023";

  // Funzione per creare il pannello di autenticazione
  const createPanel = (onSuccess) => {
    const panel = document.createElement("div");
    panel.id = "auth-panel";

    panel.innerHTML = `
      <div>
        <img src="./image/logo-192x192.png" alt="Logo">
        <h2>Autenticazione Richiesta</h2>
        <p>Inserisci le tue credenziali per accedere.</p>
        <input type="email" id="auth-email" placeholder="Email"/>
        <input type="password" id="auth-password" placeholder="Password"/>
        <button id="auth-submit-btn"><i class="fa-solid fa-right-to-bracket"></i></button>
      </div>
    `;
    document.body.appendChild(panel);

    // Event listener per il pulsante di autenticazione
    document.getElementById("auth-submit-btn").addEventListener("click", () => {
      const email = document.getElementById("auth-email").value;
      const password = document.getElementById("auth-password").value;

      if (allowedEmails.includes(email) && password === allowedPassword) {
        panel.remove();
        onSuccess();
      } else {
        alert("Credenziali non valide. Riprova.");
      }
    });
  };

  return { createPanel };
})();

export default AUTH_PANEL;
