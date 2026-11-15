import { catalogProyects } from "./data.js";
import { initContact } from "./contact.js";
import { renderProjects } from "./projects.js";
import { initSharing } from "./sharing.js";
import { initTheme } from "./theme.js";

initTheme();
initSharing();
initContact();
renderProjects(catalogProyects);
