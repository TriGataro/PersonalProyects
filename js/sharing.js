import { showToast } from "./ui.js";
import { CONTACT_EMAIL } from "./data.js";

// Copia un texto al portapapeles y usa un método alternativo si es necesario.
export async function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
        try {
            await navigator.clipboard.writeText(text);
            return;
        } catch (error) {
            console.warn("La API del portapapeles no está disponible. Se usará el método alternativo.", error);
        }
    }

    // Alternativa para navegadores sin acceso a la API del portapapeles.
    const helper = document.createElement("textarea");
    helper.value = text;
    helper.setAttribute("readonly", "");
    helper.className = "copy-helper";
    document.body.appendChild(helper);
    helper.select();

    const copied = document.execCommand("copy");
    document.body.removeChild(helper);

    if (!copied) {
        throw new Error("El navegador no permitió copiar el enlace.");
    }
}

// Abre la hoja nativa de compartir o copia el enlace como respaldo.
async function sharePage() {
    const pageUrl = window.location.href;
    const shareData = {
        title: document.title,
        text: "Explora los proyectos web publicados por Trigataro.",
        url: pageUrl
    };

    if (navigator.share) {
        try {
            await navigator.share(shareData);
            return;
        } catch (error) {
            // Si el usuario cancela, no se muestra ningún mensaje adicional.
            if (error && error.name === "AbortError") {
                return;
            }

            console.warn("La hoja nativa de compartir no está disponible. Se copiará el enlace.", error);
        }
    }

    try {
        await copyText(pageUrl);
        showToast("Enlace copiado al portapapeles. ¡Ya puedes compartirlo!");
    } catch (error) {
        console.error("No fue posible compartir la página.", error);
        showToast("No se pudo compartir automáticamente. Copia el enlace desde la barra del navegador.");
    }
}

export function initSharing() {
    const shareButton = document.getElementById("shareButton");
    const copyEmailButton = document.getElementById("copyEmailButton");

    shareButton?.addEventListener("click", sharePage);
    copyEmailButton?.addEventListener("click", async () => {
        try {
            await copyText(CONTACT_EMAIL);
            showToast("Correo copiado al portapapeles.");
        } catch (error) {
            console.error("No fue posible copiar el correo.", error);
            showToast("No se pudo copiar el correo. Selecciónalo manualmente.");
        }
    });
}
