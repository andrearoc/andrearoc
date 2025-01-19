const AUTH_PANEL = (() => {
  const allowedEmails = ["andrearoci91@gmail.com", "mariacarla.altana@gmail.com"];
  const allowedPassword = "Chausset2023";

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
        <p>Inserisci le tue credenziali per accedere.</p>
        <input type="email" id="auth-email" placeholder="Email" style="display: block; margin: 10px auto; padding: 10px; width: 80%;" />
        <input type="password" id="auth-password" placeholder="Password" style="display: block; margin: 10px auto; padding: 10px; width: 80%;" />
        <button id="auth-submit-btn" style="padding: 10px 20px;">Accedi</button>
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
