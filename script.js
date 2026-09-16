/* =========================================================
   CLAUDIA & CARLOS — Invitación de boda
   Toda la información editable vive en CONFIG.
   Reemplaza los valores marcados como pendientes cuando
   Claudia y Carlos los confirmen; el resto de la página
   se actualiza sola.
   ========================================================= */

const CONFIG = {

  // Fecha y hora exactas de la boda (usadas por la cuenta regresiva)
  weddingDateISO: "2026-10-10T15:00:00",

  // Frase / versículo de la sección 02 (reemplazable en cualquier momento)
  quote: {
    text: "Por tanto, lo que Dios ha unido, que no lo separe el hombre.",
    reference: "Mateo 19:6"
  },

  ceremony: {
    place: "Capilla de Nuestra Señora de la Merced de Sarco",
    time: "3:00 PM",
    mapUrl: "https://maps.app.goo.gl/JPCuo4UhsWira1m37"
  },

  reception: {
    place: "Pandora Salón de Eventos",
    time: "5:00 PM",
    mapUrl: "https://maps.app.goo.gl/ESr2KrNuiAXTYRMK6"
  },

  // PENDIENTE: confirmar código de vestimenta definitivo
  dressCode: {
    title: "Formal · Elegante",
    text: "Una noche especial merece un atuendo especial."
  },

  itinerary: [
    { label: "Ceremonia religiosa", time: "3:00 PM" },
    { label: "Recepción social", time: "5:00 PM" },
    { label: "Cena", time: "7:00 PM" },
    { label: "Comienza la fiesta", time: "8:00 PM" }
  ],

  // Álbum de Google Drive para que los invitados compartan sus fotos
  photos: {
    url: "https://drive.google.com/drive/folders/1SwS5P0qENC5H__CaTe4WwVkNs2jOPcHi?usp=sharing"
  },

  // Confirmación de asistencia únicamente por WhatsApp
  rsvp: {
    whatsappNumber: "59170302369" // +591 70302369, solo dígitos con código de país
  }
};

// =========================================================
// Utilidades
// =========================================================

function setLinkOrDisable(el, url, disabledMessage) {
  if (!el) return;
  if (url) {
    el.href = url;
  } else {
    el.href = "#";
    el.classList.add("is-pending");
    el.addEventListener("click", (e) => {
      e.preventDefault();
      alert(disabledMessage);
    });
  }
}

// =========================================================
// 02 — Frase
// =========================================================

function renderQuote() {
  document.getElementById("quoteText").textContent = CONFIG.quote.text;
  document.getElementById("quoteRef").textContent = CONFIG.quote.reference;
}

// =========================================================
// 04/05 — Ceremonia y recepción
// =========================================================

function renderEvents() {
  document.getElementById("ceremoniaLugar").textContent = CONFIG.ceremony.place;
  document.getElementById("ceremoniaHora").textContent = CONFIG.ceremony.time;
  document.getElementById("ceremoniaMapa").href = CONFIG.ceremony.mapUrl;

  document.getElementById("recepcionLugar").textContent = CONFIG.reception.place;
  document.getElementById("recepcionHora").textContent = CONFIG.reception.time;
  document.getElementById("recepcionMapa").href = CONFIG.reception.mapUrl;
}

// =========================================================
// 06 — Código de vestimenta
// =========================================================

function renderDressCode() {
  document.getElementById("dressCodeTitle").textContent = CONFIG.dressCode.title;
  document.getElementById("dressCodeText").textContent = CONFIG.dressCode.text;
}

// =========================================================
// 07 — Itinerario
// =========================================================

function renderItinerary() {
  const list = document.getElementById("timelineList");
  list.innerHTML = "";
  CONFIG.itinerary.forEach((item) => {
    const li = document.createElement("li");
    li.innerHTML = `<span class="t-label">${item.label}</span><span class="t-time">${item.time}</span>`;
    list.appendChild(li);
  });
}

// =========================================================
// 09 — Fotos / 10 — RSVP (enlaces)
// =========================================================

function renderLinks() {
  setLinkOrDisable(
    document.getElementById("fotosBtn"),
    CONFIG.photos.url,
    "Aún no se ha configurado el álbum para compartir fotos. Agrégalo en CONFIG.photos.url dentro de script.js."
  );

  const whatsappUrl = CONFIG.rsvp.whatsappNumber
    ? `https://wa.me/${CONFIG.rsvp.whatsappNumber}?text=${encodeURIComponent("¡Hola! Confirmo mi asistencia a la boda de Claudia y Carlos 💛")}`
    : "";

  setLinkOrDisable(
    document.getElementById("rsvpWhatsappBtn"),
    whatsappUrl,
    "Aún no se ha configurado el número de WhatsApp. Agrégalo en CONFIG.rsvp.whatsappNumber dentro de script.js."
  );
}

// =========================================================
// 08 — Cuenta regresiva
// =========================================================

function startCountdown() {
  const target = new Date(CONFIG.weddingDateISO).getTime();

  const dEl = document.getElementById("cdDays");
  const hEl = document.getElementById("cdHours");
  const mEl = document.getElementById("cdMinutes");
  const sEl = document.getElementById("cdSeconds");

  function pad(n) { return String(n).padStart(2, "0"); }

  function tick() {
    const now = Date.now();
    let diff = target - now;

    if (diff <= 0) {
      dEl.textContent = "00";
      hEl.textContent = "00";
      mEl.textContent = "00";
      sEl.textContent = "00";
      clearInterval(timer);
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    diff -= days * (1000 * 60 * 60 * 24);
    const hours = Math.floor(diff / (1000 * 60 * 60));
    diff -= hours * (1000 * 60 * 60);
    const minutes = Math.floor(diff / (1000 * 60));
    diff -= minutes * (1000 * 60);
    const seconds = Math.floor(diff / 1000);

    dEl.textContent = pad(days);
    hEl.textContent = pad(hours);
    mEl.textContent = pad(minutes);
    sEl.textContent = pad(seconds);
  }

  tick();
  const timer = setInterval(tick, 1000);
}

// =========================================================
// Fotografías opcionales (carpeta assets/)
// Si el archivo no existe todavía, cada sección conserva su
// fondo de diseño actual (degradado o color liso). Nada se
// rompe mientras las fotos definitivas no estén listas.
// =========================================================

// Portada y cuenta regresiva: la foto se antepone al degradado ya existente
function tryLoadBlendedPhoto(selector, path) {
  const el = document.querySelector(selector);
  if (!el) return;
  const img = new Image();
  img.onload = () => {
    el.style.backgroundImage = `url('${path}'), ${getComputedStyle(el).backgroundImage}`;
  };
  img.onerror = () => {};
  img.src = path;
}

// Ceremonia y recepción: la foto reemplaza el fondo claro y activa texto blanco
function tryLoadSectionPhoto(sectionSelector, bgSelector, path) {
  const section = document.querySelector(sectionSelector);
  const bg = document.querySelector(bgSelector);
  if (!section || !bg) return;
  const img = new Image();
  img.onload = () => {
    bg.style.backgroundImage = `url('${path}')`;
    section.classList.add("has-photo");
  };
  img.onerror = () => {};
  img.src = path;
}

// Frase y dress code: pequeño retrato decorativo, oculto si no existe
function tryLoadAccentPhoto(selector, path) {
  const el = document.querySelector(selector);
  if (!el) return;
  const img = new Image();
  img.onload = () => {
    el.style.backgroundImage = `url('${path}')`;
    el.style.display = "block";
    requestAnimationFrame(() => el.classList.add("is-visible-photo"));
  };
  img.onerror = () => {};
  img.src = path;
}

function loadOptionalPhotos() {
  tryLoadBlendedPhoto(".portada__bg", "assets/portada.jpg");
  tryLoadBlendedPhoto(".countdown", "assets/countdown.jpg");
  tryLoadSectionPhoto("#ceremonia", "#ceremonia .evento__bg", "assets/ceremonia.jpg");
  tryLoadSectionPhoto("#recepcion", "#recepcion .evento__bg", "assets/recepcion.jpg");
  tryLoadSectionPhoto("#itinerario", "#itinerario .itinerario__bg", "assets/itinerario.jpg");
  tryLoadAccentPhoto(".frase__photo", "assets/frase.jpg");
  tryLoadAccentPhoto(".dresscode__photo", "assets/vestimenta.jpg");
}

// =========================================================
// Música de fondo (botón flotante, requiere clic del invitado)
// =========================================================

function initMusic() {
  const audio = document.getElementById("bgMusic");
  const btn = document.getElementById("musicToggle");
  if (!audio || !btn) return;

  audio.addEventListener("error", () => {
    btn.style.display = "none";
  });
  audio.src = "assets/musica.mp3";

  btn.addEventListener("click", () => {
    if (audio.paused) {
      audio.play().catch(() => {});
      btn.classList.add("is-playing");
    } else {
      audio.pause();
      btn.classList.remove("is-playing");
    }
  });
}

// =========================================================
// Animaciones de aparición al hacer scroll
// =========================================================

function initReveal() {
  const items = document.querySelectorAll(".reveal");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );
  items.forEach((item) => observer.observe(item));
}

// =========================================================
// Barra de progreso de scroll
// =========================================================

function initProgressBar() {
  const bar = document.getElementById("progressBar");
  window.addEventListener("scroll", () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = pct + "%";
  });
}

// =========================================================
// Inicialización
// =========================================================

document.addEventListener("DOMContentLoaded", () => {
  renderQuote();
  renderEvents();
  renderDressCode();
  renderItinerary();
  renderLinks();
  startCountdown();
  loadOptionalPhotos();
  initMusic();
  initReveal();
  initProgressBar();
});
