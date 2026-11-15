import { PROJECT_META } from "./data.js";

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
export function renderProjects(projects) {
    const projectGrid = document.getElementById("projectGrid");
    const projectCount = document.getElementById("projectCount");
    const heroProjectCount = document.getElementById("heroProjectCount");
    const emptyState = document.getElementById("emptyState");

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

    visibleProjects.forEach((project) => {
        const meta = getProjectMeta(project);
        const url = getSafeUrl(project.link);
        const name = escapeHtml(project.name || "Proyecto sin nombre");

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
