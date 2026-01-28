document.addEventListener("DOMContentLoaded", () => {
  // ===============================
  // Affichage de la date actuelle
  // ===============================
  const currentDateElem = document.getElementById("currentDate");
  if (currentDateElem) {
    const date = new Date().toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour:'numeric',
      minute:'numeric'
    });
    currentDateElem.textContent =date;
  }

  // ===================================
  // Gestion de l'ouverture du menu
  // ===================================
  const verticalMenu = document.querySelector(".vertical-menu");
  const openBtn = document.querySelector(".open-vertical-menu");
  const closeMenuBtn = document.querySelector(".closed-vertical-menu");

  if (openBtn && closeMenuBtn && verticalMenu) {
    openBtn.addEventListener("click", () => {
      verticalMenu.classList.remove("closed");
      document.body.classList.remove("menu-closed");
      openBtn.style.display = "none";
    });

    closeMenuBtn.addEventListener("click", () => {
      verticalMenu.classList.add("closed");
      document.body.classList.add("menu-closed");
      openBtn.style.display = "block";
    });

    document.addEventListener("click", (e) => {
      if (!verticalMenu.contains(e.target) && !openBtn.contains(e.target)) {
        verticalMenu.classList.add("closed");
        document.body.classList.add("menu-closed");
        openBtn.style.display = "block";
      }
    });
  }

  // ===================================
  // Gestion des onglets à partir du hash
  // ===================================
  function activateTabFromHash(hash) {
    const tabTrigger = document.querySelector(`button[data-bs-target="${hash}"]`);
    if (tabTrigger) {
      const tab = new bootstrap.Tab(tabTrigger);
      tab.show();
    }
  }

  // ===================================
  // Activation des liens de navigation
  // ===================================
  function activateNavLink(hash) {
    const navLinks = {
      '#sea': 'etablissementNavLink',
      '#ibam': 'etablissementNavLink',
      '#igeed': 'etablissementNavLink',
      '#lac': 'etablissementNavLink',
      '#issp': 'etablissementNavLink',
      '#svt': 'etablissementNavLink',
      '#sh': 'etablissementNavLink',
      '#issdh': 'etablissementNavLink',
      '#sds': 'etablissementNavLink',
      '#autres': 'etablissementNavLink',
      '#licence1': 'programmeNavLink',
      '#licence2': 'programmeNavLink',
      '#licence3': 'programmeNavLink',
      '#master': 'formationNavLink',
      '#licence': 'formationNavLink',
      '#debouches': 'formationNavLink',
      '#ujkz': 'historiqueNavLink',
      '#ifoad': 'historiqueNavLink',
      '#sia': 'historiqueNavLink',
      '#doc-licence': 'documentationNavLink',
      '#doc-master': 'documentationNavLink'
    };

    document.querySelectorAll('.navbar .nav-link').forEach(link => link.classList.remove('active'));

    const targetId = navLinks[hash];
    const targetLink = document.getElementById(targetId);
    if (targetLink) targetLink.classList.add('active');
  }

  // Appliquer l’onglet et le lien actif à partir de l’URL
  if (window.location.hash) {
    activateTabFromHash(window.location.hash);
    activateNavLink(window.location.hash);
  }

  // Gérer les changements de hash
  window.addEventListener('hashchange', () => {
    activateTabFromHash(window.location.hash);
    activateNavLink(window.location.hash);
  });

  // ===================================
  // Gestion des clics sur les liens
  // ===================================
  document.body.addEventListener("click", (e) => {
    const link = e.target.closest(".nav-link, .dropdown-item, .page-link");
    if (link && link.tagName === "A") {
      const href = link.getAttribute("href");
      if (href && !href.startsWith("#")) {
        localStorage.setItem("activeLink", href);
        verticalMenu?.classList.add("closed");
        openBtn && (openBtn.style.display = "block");
        document.body.classList.add("menu-closed");
      }
    }
  });

  // Rétablir le lien actif mémorisé
  const activeHref = localStorage.getItem("activeLink");
  if (activeHref) {
    document.querySelectorAll(".nav-link, .dropdown-item").forEach(el => el.classList.remove("active"));
    document.querySelector(`.nav-link[href="${activeHref}"], .dropdown-item[href="${activeHref}"]`)?.classList.add("active");
  }

  // Initialiser la page des calculs
  initTraitementPage();
});

// ================================
// Fonction de bascule du menu
// ================================
function toggleVerticalMenu() {
  const menu = document.getElementById('menu_vertical');
  menu?.classList.toggle('closed');
}

// ================================
// Traitement du formulaire math
// ================================
function initTraitementPage() {
  const form = document.getElementById("mathForm");
  const select = document.getElementById("fonction");
  if (!form || !select) return;

  // Créateur de champ input
  const input = (id, label, required = true) => `
    <label for="${id}" class="form-label">${label} :</label>
    <input type="text" id="${id}" class="form-control mb-2" ${required ? "required" : ""}>
  `;

  // Affiche les champs selon la fonction
  const afficherChamps = () => {
    const fonction = select.value;
    const paramsDiv = document.getElementById("parametres");
    paramsDiv.innerHTML = "";

    const fonctionsX = ["factorielle", "racine", "cos", "sin", "tan", "exp", "abs", "ln", "floor", "ceil"];
    const fonctionsXY = ["puissance", "mod", "max", "min"];

    if (fonctionsX.includes(fonction)) {
      paramsDiv.innerHTML = input("x", "x");
    } else if (fonctionsXY.includes(fonction)) {
      paramsDiv.innerHTML = input("x", "x") + input("y", "y");
    } else if (fonction === "logarithme") {
      paramsDiv.innerHTML = input("x", "x (valeur)") + input("base", "Base (ex: 10, 2)", false);
    } else if (fonction === "limite") {
      paramsDiv.innerHTML = input("x", "Expression") + input("val", "Valeur limite");
    }
  };

  // Factorielle récursive
  const factorielle = (n) => {
    if (n < 0 || !Number.isInteger(n)) throw "Entrez un entier positif.";
    return n <= 1 ? 1 : n * factorielle(n - 1);
  };

  // Soumission du formulaire
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const fct = select.value;
    const x = document.getElementById("x")?.value;
    const y = document.getElementById("y")?.value;
    const base = document.getElementById("base")?.value;
    const val = document.getElementById("val")?.value;
    let result = "";

    try {
      const px = parseFloat(x);
      const py = parseFloat(y);

      switch (fct) {
        case "factorielle": result = `Résultat : ${factorielle(parseInt(x))}`; break;
        case "puissance": result = `Résultat : ${Math.pow(px, py)}`; break;
        case "racine": result = `Résultat : ${Math.sqrt(px)}`; break;
        case "logarithme":
          if (px <= 0) throw "x doit être > 0.";
          if (!base || base === "e") {
            result = `Logarithme népérien (ln) : ${Math.log(px).toFixed(4)}`;
          } else {
            const pbase = parseFloat(base);
            if (pbase <= 0 || pbase === 1) throw "Base invalide (doit être > 0 et ≠ 1).";
            result = `Logarithme base ${pbase} : ${(Math.log(px) / Math.log(pbase)).toFixed(4)}`;
          }
          break;
        case "ln": if (px <= 0) throw "x doit être > 0."; result = `Résultat : ${Math.log(px).toFixed(4)}`; break;
        case "cos": result = `Résultat : ${Math.cos(px).toFixed(4)}`; break;
        case "sin": result = `Résultat : ${Math.sin(px).toFixed(4)}`; break;
        case "tan": result = `Résultat : ${Math.tan(px).toFixed(4)}`; break;
        case "exp": result = `Résultat : ${Math.exp(px).toFixed(4)}`; break;
        case "abs": result = `Résultat : ${Math.abs(px)}`; break;
        case "mod": result = `Résultat : ${px % py}`; break;
        case "max": result = `Résultat : ${Math.max(px, py)}`; break;
        case "min": result = `Résultat : ${Math.min(px, py)}`; break;
        case "floor": result = `Résultat : ${Math.floor(px)}`; break;
        case "ceil": result = `Résultat : ${Math.ceil(px)}`; break;
        case "limite":
          if (!x || !val) throw "Expression et valeur limite requises.";
          const limite = math.parse(x);
          result = `Limite en ${val} : ${limite.evaluate({ x: parseFloat(val) })}`;
          break;
        default: result = "Fonction inconnue.";
      }
    } catch (err) {
      result = `Erreur : ${err}`;
    }

    const resDiv = document.getElementById("resultat");
    resDiv.textContent = result;
    resDiv.classList.remove("d-none");
  });

  select.addEventListener("change", afficherChamps);
  afficherChamps();
}
