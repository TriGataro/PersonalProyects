import { showToast } from "./ui.js";

// Clave con la que se guarda la preferencia de tema en localStorage.
const THEME_STORAGE_KEY = "trigataro-theme";

// Colores de la barra del navegador para cada tema.
const THEME_COLORS = {
    light: "#f5f7fb",
    dark: "#0a0f1e"
};

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
function applyTheme(theme, themeToggle, themeColor, persist = false) {
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

export function initTheme() {
    const themeToggle = document.getElementById("themeToggle");
    const themeColor = document.getElementById("themeColor");
    const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");

    const initialTheme = getStoredTheme() || (prefersDarkScheme.matches ? "dark" : "light");
    applyTheme(initialTheme, themeToggle, themeColor);

    themeToggle?.addEventListener("click", () => {
        const currentTheme = document.documentElement.getAttribute("data-bs-theme") === "dark"
            ? "dark"
            : "light";

        applyTheme(currentTheme === "dark" ? "light" : "dark", themeToggle, themeColor, true);
    });

    prefersDarkScheme.addEventListener("change", (event) => {
        if (!getStoredTheme()) {
            applyTheme(event.matches ? "dark" : "light", themeToggle, themeColor);
        }
    });
}
