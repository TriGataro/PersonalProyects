import { showToast } from "./ui.js";
import { CONTACT_EMAIL } from "./data.js";

// Actualiza el contador de caracteres del mensaje.
function updateMessageCount(contactMessage, messageCount) {
    if (!contactMessage || !messageCount) {
        return;
    }

    messageCount.textContent = String(contactMessage.value.length);
}

// Construye un enlace mailto con los datos ingresados en el formulario.
function buildMailtoUrl({ name, email, subject, message }) {
    const body = [
        `Nombre: ${name}`,
        `Correo: ${email}`,
        "",
        message
    ].join("\n");

    return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

// Valida el formulario y prepara el correo en el cliente del usuario.
function handleContactSubmit(event, contactForm) {
    event.preventDefault();
    contactForm.classList.add("was-validated");

    if (!contactForm.checkValidity()) {
        const firstInvalidField = contactForm.querySelector(".form-control:invalid");
        firstInvalidField?.focus();
        showToast("Revisa los campos marcados antes de enviar.");
        return;
    }

    const formData = new FormData(contactForm);
    const mailtoUrl = buildMailtoUrl({
        name: String(formData.get("name") || "").trim(),
        email: String(formData.get("email") || "").trim(),
        subject: String(formData.get("subject") || "").trim(),
        message: String(formData.get("message") || "").trim()
    });

    // Abre la aplicación de correo configurada en el dispositivo.
    window.location.href = mailtoUrl;
    showToast("Se abrió tu cliente de correo con el mensaje listo para enviar.");
}

export function initContact() {
    const contactForm = document.getElementById("contactForm");
    const contactMessage = document.getElementById("contactMessage");
    const messageCount = document.getElementById("messageCount");

    contactMessage?.addEventListener("input", () => updateMessageCount(contactMessage, messageCount));
    contactForm?.addEventListener("submit", (event) => handleContactSubmit(event, contactForm));
    updateMessageCount(contactMessage, messageCount);
}
