async function loadLanguage(lang) {
  try {
    const response = await fetch(`lang/${lang}.json`);
    if (!response.ok) throw new Error(`Impossible de charger lang/${lang}.json (${response.status})`);
    const data = await response.json();

    // Menu
    document.getElementById("title").textContent = data.title || "";
    document.getElementById("house-specials-title").textContent = data.houseSpecials.title || "";
    fillMenu("house-specials", data.houseSpecials.items || []);
    document.getElementById("meat-dishes-title").textContent = data.meatDishes.title || "";
    fillMenu("meat-dishes", data.meatDishes.items || []);
    document.getElementById("vegetarian-dishes-title").textContent = data.vegetarianDishes.title || "";
    fillMenu("vegetarian-dishes", data.vegetarianDishes.items || []);
    document.getElementById("staples-title").textContent = data.staples.title || "";
    fillMenu("staples", data.staples.items || []);
  } catch (err) {
    console.error("loadLanguage error:", err);
  }
}

function fillMenu(id, items) {
  const ul = document.getElementById(id);
  if (!ul) return;
  ul.innerHTML = "";
  items.forEach(item => {
    const li = document.createElement("li");
    li.innerHTML = `${item.name} <span class="price">${item.price}</span>`;
    ul.appendChild(li);
  });
}

function showHeroLang(lang) {
  // affiche le .lang correspondant dans la section hero et masque les autres
  document.querySelectorAll('.hero .lang').forEach(el => {
    if (el.classList.contains(lang)) {
      el.style.display = 'block';
    } else {
      el.style.display = 'none';
    }
  });
}

function updateLangButton(flagSrc, text) {
  const btn = document.getElementById('lang-btn');
  if (!btn) return;
  btn.innerHTML = `${flagSrc ? `<img src="${flagSrc}" alt="${text}"> ` : ''}${text}`;
}

function initLangSelector(defaultLang = 'en') {
  const btn = document.getElementById("lang-btn");
  const options = document.getElementById("lang-options");

  if (!btn || !options) {
    console.warn("lang selector elements missing");
    return;
  }

  // toggle dropdown
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    options.classList.toggle("show");
  });

  // close when click outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.lang-select')) {
      options.classList.remove('show');
    }
  });

  // each option: update button, show hero text, load menu json
  options.querySelectorAll("li").forEach(li => {
    li.addEventListener("click", (e) => {
      const lang = li.dataset.lang;
      const img = li.querySelector("img");
      const flag = img ? img.getAttribute('src') : '';
      const text = li.textContent.trim();

      updateLangButton(flag, text);
      showHeroLang(lang);
      loadLanguage(lang);

      options.classList.remove("show");
    });
  });

  // initial state (button text + load)
  const initial = options.querySelector(`li[data-lang="${defaultLang}"]`) || options.querySelector("li");
  if (initial) {
    const img = initial.querySelector("img");
    const flag = img ? img.getAttribute('src') : '';
    const text = initial.textContent.trim();
    updateLangButton(flag, text);
  }

  showHeroLang(defaultLang);
  loadLanguage(defaultLang);
}

// démarrage quand DOM prêt
document.addEventListener('DOMContentLoaded', () => {
  initLangSelector('en'); // change 'en' si tu veux un autre défaut
});

const menuToggle = document.createElement('div');
menuToggle.classList.add('menu-toggle');
menuToggle.innerHTML = '<span></span><span></span><span></span>';
document.querySelector('header').appendChild(menuToggle);

const navLinks = document.querySelector('.nav-links');

menuToggle.addEventListener('click', () => {
  navLinks.classList.toggle('active');
});