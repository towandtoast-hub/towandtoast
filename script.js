// === Tow and Toast Script ===

// Footer year
document.addEventListener("DOMContentLoaded", () => {
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
});

// Nav active highlight
document.addEventListener("DOMContentLoaded", () => {
  const file = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav a").forEach(a => {
    const href = (a.getAttribute("href") || "").split("/").pop();
    if (href === file) {
      a.classList.add("active");
      a.setAttribute("aria-current","page");
    }
  });
});

// ---- Banner typing animation (between logo and nav) ----
document.addEventListener("DOMContentLoaded", () => {
  const el = document.getElementById("banner-text");
  const cursor = document.querySelector(".banner-cursor");
  if (!el || !cursor) return;

  // Your phrases:
  const phrases = [
    "Tow And Toast",
    "Pittsburgh's Mobile Bar",
    "Custom Craft Cocktails Made Personal For Your Event",
    "We Tow the Bar, You Raise the Glass",
    "Book Us Today!"
  ];

  // Tunable timings (ms)
  const SPEED = {
    TYPE: 55,      // per character while typing
    DELETE: 35,    // per character while deleting
    HOLD: 1200,    // after a phrase is fully typed
    GAP: 400       // small pause before next phrase starts
  };

  // Internal state
  let p = 0;         // phrase index
  let i = 0;         // character index
  let deleting = false;
  let timer = null;
  let running = false; // re-entrancy guard

  // Ensure only ONE typing loop runs
  function clearExisting() {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  }

  function setText(text) {
    el.textContent = text;
  }

  function step() {
    running = true;
    const full = phrases[p];

    if (!deleting) {
      // TYPE FORWARD
      setText(full.slice(0, i));
      if (i < full.length) {
        i++;
        timer = setTimeout(step, SPEED.TYPE);
      } else {
        // Hold, then start deleting
        timer = setTimeout(() => { deleting = true; step(); }, SPEED.HOLD);
      }
    } else {
      // DELETE BACKWARD
      if (i > 0) {
        i--;
        setText(full.slice(0, i));
        timer = setTimeout(step, SPEED.DELETE);
      } else {
        // Move to next phrase
        deleting = false;
        p = (p + 1) % phrases.length;
        timer = setTimeout(step, SPEED.GAP);
      }
    }
  }

  // Reset any previous loops and start fresh
  clearExisting();
  if (!running) step();
});
/* ========= Packages Panel Data ========= */
const PACKAGES = {
  "bartending-services": {
    title: "Bartending Services",
    about:
      "Professional, polished bartenders to keep your event running smoothly. Includes setup, breakdown, bar tools, and guidance on shopping lists and quantities.",
    hero: "assets/packages/bartending/hero.png",
    photo1: "assets/packages/bartending/p1.jpg",
    photo2: "assets/packages/bartending/p2.jpg"
  },
  "pop-up-tabletop-bar": {
    title: "Pop-Up Tabletop Bar",
    about:
      "A compact, elegant bar solution for intimate or indoor events. Styled to your theme with minimal footprint and maximum charm.",
    hero: "assets/packages/tabletop/herotable.jpg",
    photo1: "assets/packages/tabletop/p1.jpg",
    photo2: "assets/packages/tabletop/p2.jpg"
  },
  "bar-trailer": {
    title: "Bar Trailer",
    about:
      "Our signature mobile bar trailer is a show-stopping centerpiece with full-service capability. Perfect for weddings, showers, and large celebrations.",
    hero: "assets/packages/trailer/herotrailer.jpg",
    photo1: "assets/packages/trailer/p1.jpg",
    photo2: "assets/packages/trailer/p2.jpg"
  },
  "custom-cocktail-menu": {
    title: "Custom Cocktail Menu",
    about:
      "We’ll collaborate on a bespoke cocktail list that fits your story and theme—plus matching printed signage for a cohesive guest experience.",
    hero: "assets/packages/menu/heromenu.jpg",
    photo1: "assets/packages/menu/p1.jpg",
    photo2: "assets/packages/menu/p2.jpg"
  },
  "custom-decorations": {
    title: "Custom Decorations",
    about:
      "From florals to lighting, we curate the finishing touches for your bar area so it photographs beautifully and feels personal.",
    hero: "assets/packages/decor/herodecor.jpg",
    photo1: "assets/packages/decor/p1.jpg",
    photo2: "assets/packages/decor/p2.jpg"
  },
  "consultation": {
    title: "Consultation",
    about:
      "A complimentary planning session to map out logistics, timelines, and your must-have details. We’ll help you choose the right package and add-ons.",
    hero: "assets/packages/consult/heroconsult.jpg",
    photo1: "assets/packages/consult/p1.jpg",
    photo2: "assets/packages/consult/p2.jpg"
  }
};

/* ========= Panel Elements ========= */
const panel = document.getElementById("package-panel");
const overlay = document.getElementById("panel-overlay");
const closeBtn = panel?.querySelector(".panel-close");
const heroImg = document.getElementById("panel-hero-img");
const pTitle = document.getElementById("panel-title");
const pAbout = document.getElementById("panel-about");
const pPhoto1 = document.getElementById("panel-photo-1");
const pPhoto2 = document.getElementById("panel-photo-2");
const faqForm = document.getElementById("faq-form");
const faqStatus = document.getElementById("faq-status");
const faqPkg = document.getElementById("faq-package");

/* ========= Open / Close helpers ========= */
function openPanel(pkgKey) {
  const data = PACKAGES[pkgKey];
  if (!data) return;

  // Populate content
  heroImg.src = data.hero;
  heroImg.alt = `${data.title} banner`;
  pTitle.textContent = data.title;
  pAbout.textContent = data.about;
  pPhoto1.src = data.photo1;
  pPhoto1.alt = `${data.title} photo 1`;
  pPhoto2.src = data.photo2;
  pPhoto2.alt = `${data.title} photo 2`;
  faqPkg.value = data.title;

  // Show
  overlay.hidden = false;
  panel.classList.add("open");
  panel.setAttribute("aria-hidden", "false");
  panel.focus();
}

function closePanel() {
  panel.classList.remove("open");
  panel.setAttribute("aria-hidden", "true");
  overlay.hidden = true;
}

document.querySelectorAll(".pkg-btn").forEach(btn => {
  btn.addEventListener("click", () => openPanel(btn.dataset.pkg));
});

overlay?.addEventListener("click", closePanel);
closeBtn?.addEventListener("click", closePanel);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && panel.classList.contains("open")) closePanel();
});

/* ========= FAQ -> Google Sheets =========
   1) Deploy a Google Apps Script Web App (see below).
   2) Paste your URL in GOOGLE_SCRIPT_URL.
*/
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbynF6-hizSwdgFNNuZ1wjUe4_Vsh5foqhZwnWaLWGbz9YZHWDcsHXeutIdhG1vYVwZd/exec"; // <-- paste URL

faqForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
  faqStatus.textContent = "";

  const name = document.getElementById("faq-name").value.trim();
  const email = document.getElementById("faq-email").value.trim();
  const question = document.getElementById("faq-question").value.trim();
  const pkg = faqPkg.value;

  if (!name || !email || !question) {
    faqStatus.textContent = "Please complete all required fields.";
    return;
  }
  if (!GOOGLE_SCRIPT_URL || GOOGLE_SCRIPT_URL.includes("YOUR_GOOGLE")) {
    faqStatus.textContent = "Form not yet connected. Ask the site owner to configure Google Sheets.";
    return;
  }

  const payload = {
    package: pkg,
    name,
    email,
    question,
    submittedAt: new Date().toISOString()
  };

  try {
    faqStatus.textContent = "Sending...";
    const res = await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      mode: "no-cors", // GAS will still receive it
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    // no-cors returns opaque; assume success if no error thrown
    faqStatus.textContent = "Thanks! Your question was sent. We’ll get back to you by email shortly.";
    faqForm.reset();
  } catch (err) {
    console.error(err);
    faqStatus.textContent = "Sorry—there was a problem sending your question. Please try again.";
  }
});


