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
    "Pittsburgh Mobile Bar",
    "Craft Cocktails",
    "Book Today"
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

