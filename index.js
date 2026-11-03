/* =========================================================
   Portafolio de Trigataro - Lógica de la página
   ========================================================= */

// Clave con la que se guarda la preferencia de tema en localStorage.
const THEME_STORAGE_KEY = "trigataro-theme";

// Correo que recibe los mensajes del formulario de contacto.
const CONTACT_EMAIL = "claudio.m.ruiz.h@gmail.com";

// Colores de la barra del navegador para cada tema.
const THEME_COLORS = {
    light: "#f5f7fb",
    dark: "#0a0f1e"
};

// Referencias a los elementos principales del documento.
const themeToggle = document.getElementById("themeToggle");
const themeColor = document.getElementById("themeColor");
const shareButton = document.getElementById("shareButton");
const projectGrid = document.getElementById("projectGrid");
const projectCount = document.getElementById("projectCount");
const heroProjectCount = document.getElementById("heroProjectCount");
const emptyState = document.getElementById("emptyState");
const shareToastElement = document.getElementById("shareToast");
const shareToastMessage = document.getElementById("shareToastMessage");
const contactForm = document.getElementById("contactForm");
const contactMessage = document.getElementById("contactMessage");
const messageCount = document.getElementById("messageCount");
const copyEmailButton = document.getElementById("copyEmailButton");

// Detecta la preferencia de tema configurada en el sistema operativo.
const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");

// Información visual y descriptiva de cada proyecto según su id.
const PROJECT_META = {
    1: {
        icon: "bi-book-half",
        category: "Fe y estudio",
        description: "Consulta versículos bíblicos y explora una concordancia de forma rápida y sencilla."
    },
    2: {
        icon: "bi-shop-window",
        category: "Catálogo",
        description: "Catálogo digital de productos y ventas pensado para la gestión comercial."
    },
    3: {
        icon: "bi-grid-3x3-gap-fill",
        category: "Juego",
        description: "Pon a prueba tu lógica y concentración con este clásico juego de Sudoku."
    },
    4: {
        icon: "bi-rocket-takeoff-fill",
        category: "Juego",
        description: "Homenaje arcade inspirado en el clásico Galaga, con disparos y naves espaciales."
    }
};

// Instancia del toast de Bootstrap usada para mostrar mensajes al usuario.
const shareToast = shareToastElement && window.bootstrap
    ? window.bootstrap.Toast.getOrCreateInstance(shareToastElement, { delay: 3500 })
    : null;

/* ---------------------------------------------------------
   Tema claro y oscuro
   --------------------------------------------------------- */

// Lee el tema guardado y valida que sea un valor permitido.
function getStoredTheme() {
    try {
        const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
        return storedTheme === "light" || storedTheme === "dark" ? storedTheme : null;
    } catch (error) {
        console.warn("No fue posible leer la preferencia de tema.", error);
        return null;
    }
}

// Guarda el tema elegido en localStorage y avisa si el navegador lo impide.
function storeTheme(theme) {
    try {
        window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch (error) {
        console.warn("No fue posible guardar la preferencia de tema.", error);
        showToast("No se pudo guardar la preferencia de tema en este navegador.");
    }
}

// Aplica el tema al documento y actualiza el icono del botón.
function applyTheme(theme, persist = false) {
    const isDark = theme === "dark";

    document.documentElement.setAttribute("data-bs-theme", theme);

    if (themeColor) {
        themeColor.setAttribute("content", THEME_COLORS[theme]);
    }

    if (themeToggle) {
        const icon = themeToggle.querySelector("i");
        const label = isDark ? "Cambiar a tema claro" : "Cambiar a tema oscuro";

        if (icon) {
            icon.className = `bi ${isDark ? "bi-sun-fill" : "bi-moon-stars-fill"}`;
        }

        themeToggle.setAttribute("aria-label", label);
        themeToggle.setAttribute("title", label);
    }

    if (persist) {
        storeTheme(theme);
    }
}

/* ---------------------------------------------------------
   Mensajes de confirmación
   --------------------------------------------------------- */

// Muestra un mensaje temporal dentro del toast de Bootstrap.
function showToast(message) {
    if (!shareToast || !shareToastMessage) {
        return;
    }

    shareToastMessage.textContent = message;
    shareToast.show();
}

/* ---------------------------------------------------------
   Compartir la página
   --------------------------------------------------------- */

// Copia un texto al portapapeles y usa un método alternativo si es necesario.
async function copyText(text) {
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

/* ---------------------------------------------------------
   Formulario de contacto
   --------------------------------------------------------- */

// Actualiza el contador de caracteres del mensaje.
function updateMessageCount() {
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
function handleContactSubmit(event) {
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

/* ---------------------------------------------------------
   Presentación de los proyectos
   --------------------------------------------------------- */

// Escapa caracteres especiales antes de insertar texto en el HTML.
function escapeHtml(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Valida que el enlace del proyecto use un protocolo seguro (http o https).
function getSafeUrl(value) {
    try {
        const url = new URL(value, window.location.href);

        if (url.protocol === "http:" || url.protocol === "https:") {
            return url.href;
        }
    } catch (error) {
        console.warn("El enlace del proyecto no es válido.", value, error);
    }

    return null;
}

// Devuelve la información visual del proyecto o unos valores genéricos.
function getProjectMeta(project) {
    return PROJECT_META[project.id] || {
        icon: "bi-code-slash",
        category: "Proyecto",
        description: "Explora este proyecto web publicado por Trigataro."
    };
}

// Crea las tarjetas de los proyectos visibles definidos en data.js.
function renderProjects(projects) {
    if (!projectGrid) {
        return;
    }

    const visibleProjects = (Array.isArray(projects) ? projects : [])
        .filter((project) => project && project.visible !== false)
        .filter((project) => getSafeUrl(project.link));

    projectGrid.innerHTML = "";

    if (projectCount) {
        projectCount.textContent = String(visibleProjects.length);
    }

    if (heroProjectCount) {
        heroProjectCount.textContent = String(visibleProjects.length);
    }

    if (visibleProjects.length === 0) {
        emptyState?.classList.remove("d-none");
        return;
    }

    emptyState?.classList.add("d-none");

    const fragment = document.createDocumentFragment();

    visibleProjects.forEach((project, index) => {
        const meta = getProjectMeta(project);
        const url = getSafeUrl(project.link);
        const name = escapeHtml(project.name || "Proyecto sin nombre");
        const number = String(index + 1).padStart(2, "0");

        const column = document.createElement("div");
        column.className = "col-12 col-md-6 col-xl-3";
        column.innerHTML = `
            <article class="project-card">
                <div class="card-body d-flex flex-column p-4">
                    <div class="d-flex align-items-start justify-content-between gap-3 mb-4">
                        <span class="project-icon" aria-hidden="true">
                            <i class="bi ${meta.icon}"></i>
                        </span>
                    </div>
                    <span class="project-type mb-3">${escapeHtml(meta.category)}</span>
                    <h3 class="project-title mb-2">${name}</h3>
                    <p class="project-description flex-grow-1 mb-4">${escapeHtml(meta.description)}</p>
                    <a class="project-link stretched-link" href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer" aria-label="Abrir ${name} en una nueva pestaña">
                        Ver proyecto
                        <i class="bi bi-box-arrow-up-right" aria-hidden="true"></i>
                    </a>
                </div>
            </article>
        `;

        fragment.appendChild(column);
    });

    projectGrid.appendChild(fragment);
}

/* ---------------------------------------------------------
   Inicialización de la página
   --------------------------------------------------------- */

// Aplica el tema guardado o el que tenga configurado el sistema.
const initialTheme = getStoredTheme() || (prefersDarkScheme.matches ? "dark" : "light");
applyTheme(initialTheme);

// Cambia el tema cada vez que se pulsa el botón.
themeToggle?.addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute("data-bs-theme") === "dark"
        ? "dark"
        : "light";

    applyTheme(currentTheme === "dark" ? "light" : "dark", true);
});

// Sigue los cambios del sistema solo si el usuario no ha elegido un tema manualmente.
prefersDarkScheme.addEventListener("change", (event) => {
    if (!getStoredTheme()) {
        applyTheme(event.matches ? "dark" : "light");
    }
});

// Comparte la página desde el botón de la barra de navegación.
shareButton?.addEventListener("click", sharePage);

// Actualiza el contador del mensaje y gestiona el envío del formulario.
contactMessage?.addEventListener("input", updateMessageCount);
contactForm?.addEventListener("submit", handleContactSubmit);
updateMessageCount();

// Copia el correo de contacto para quienes prefieran escribirlo manualmente.
copyEmailButton?.addEventListener("click", async () => {
    try {
        await copyText(CONTACT_EMAIL);
        showToast("Correo copiado al portapapeles.");
    } catch (error) {
        console.error("No fue posible copiar el correo.", error);
        showToast("No se pudo copiar el correo. Selecciónalo manualmente.");
    }
});

// Genera el listado usando el arreglo definido en data.js.
renderProjects(typeof catalogProyects !== "undefined" ? catalogProyects : []);
