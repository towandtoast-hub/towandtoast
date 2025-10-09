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

  const phrases = [
    "Tow And Toast",
    "Pittsburgh Mobile Bar",
    "Craft Cocktails",
    "Book Today"
  ];

  const speed = {
    type: 55,     // ms per char
    del: 35,      // ms per char (delete)
    pause: 1200,  // pause at end of phrase
    next: 400     // pause before next phrase starts
  };

  let p = 0;      // phrase index
  let i = 0;      // char index
  let deleting = false;
  let timer = null;

  function tick() {
    const full = phrases[p];

    if (!deleting) {
      // typing forward
      el.textContent = full.slice(0, i);
      i++;
      if (i <= full.length) {
        timer = setTimeout(tick, speed.type);
      } else {
        // reached end; pause then delete
        timer = setTimeout(() => { deleting = true; tick(); }, speed.pause);
      }
    } else {
      // deleting backward
      i--;
      el.textContent = full.slice(0, i);
      if (i > 0) {
        timer = setTimeout(tick, speed.del);
      } else {
        // move to next phrase
        deleting = false;
        p = (p + 1) % phrases.length;
        timer = setTimeout(tick, speed.next);
      }
    }
  }

  tick();
});
