/* ==========================================================================
   ORBIT · Genera las tecnologías que giran alrededor del logo
   --------------------------------------------------------------------------
   Para agregar, quitar o reordenar una tecnología, edita solo TECHS.
   El HTML solo necesita:  <div class="orbit" data-orbit> ... </div>
   ========================================================================== */
(() => {
  "use strict";

  /** Lista de tecnologías. `icon` es una clase de Bootstrap Icons. */
  const TECHS = [
    { name: "HTML5",      icon: "bi-filetype-html", color: "#e34f26" },
    { name: "JavaScript", icon: "bi-filetype-js",   color: "#f0b400" },
    { name: "Python",     icon: "bi-filetype-py",   color: "#3776ab" },
    { name: "C#",         icon: "bi-filetype-cs",   color: "#9b4f96" },
    { name: "Go",         icon: "bi-code-slash",    color: "#00a7c7" },
    { name: "SQL",        icon: "bi-filetype-sql",  color: "#e48e00" },
    { name: "Git",        icon: "bi-git",           color: "#f05032" },
    { name: "IA",         icon: "bi-cpu-fill",      color: "#8b5cf6" },
    { name: "CI/CD",      icon: "bi-arrow-repeat",  color: "#0c576a" }
  ];

  /** Crea el <li> de una tecnología. */
  function createItem(tech, index) {
    const item = document.createElement("li");
    item.className = "orbit__item";
    item.style.setProperty("--i", index);

    const chip = document.createElement("span");
    chip.className = "orbit__chip";
    chip.style.setProperty("--chip-color", tech.color);
    chip.tabIndex = 0;
    chip.title = tech.name;

    const icon = document.createElement("i");
    icon.className = `orbit__icon bi ${tech.icon}`;
    icon.setAttribute("aria-hidden", "true");

    const label = document.createElement("span");
    label.className = "orbit__label";
    label.textContent = tech.name;

    chip.append(icon, label);
    item.append(chip);
    return item;
  }

  /** Pausa la animación cuando la órbita no está visible (ahorra CPU). */
  function pauseWhenOffscreen(root) {
    if (!("IntersectionObserver" in window)) return;
    new IntersectionObserver(([entry]) => {
      root.classList.toggle("is-offscreen", !entry.isIntersecting);
    }).observe(root);
  }

  /** Construye una órbita dentro del contenedor indicado. */
  function initOrbit(root) {
    const ring = root.querySelector(".orbit__ring");
    if (!ring) return;

    root.style.setProperty("--count", TECHS.length);
    ring.replaceChildren(...TECHS.map(createItem));
    pauseWhenOffscreen(root);
  }

  document.querySelectorAll("[data-orbit]").forEach(initOrbit);
})();
