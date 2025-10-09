// === Tow and Toast Script ===

// Auto Year
document.addEventListener("DOMContentLoaded", () => {
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
});

// Highlight Active Nav
document.addEventListener("DOMContentLoaded", () => {
  const current = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav a").forEach(link => {
    if (link.getAttribute("href") === current) link.classList.add("active");
  });
});

// Banner Text Typing Effect
document.addEventListener("DOMContentLoaded", () => {
  const banner = document.getElementById("banner-text");
  if (!banner) return;

  const phrases = [
    "Tow And Toast",
    "A Woman Owned Pittsburgh Mobile Bar",
    "Book Today"
  ];

  let i = 0;
  function cycleText() {
    banner.textContent = phrases[i];
    i = (i + 1) % phrases.length;
  }

  cycleText(); // initial text
  setInterval(cycleText, 6000); // every 6s matches typing animation
});
