// ========== Tow and Toast Website Script ==========

// --- Auto Year in Footer ---
document.addEventListener("DOMContentLoaded", () => {
  const yearSpan = document.getElementById("year");
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();
});

// --- Navbar Active Highlight ---
document.addEventListener("DOMContentLoaded", () => {
  const currentPath = window.location.pathname.split("/").pop();
  document.querySelectorAll(".nav a").forEach(link => {
    const linkPath = link.getAttribute("href");
    if (linkPath === currentPath) {
      link.classList.add("active");
    }
  });
});

// --- Typing Animation (Framework-Free Version) ---
(function () {
  function nextRand(min, max) {
    return Math.random() * (max - min) + min;
  }

  function TextType(el, opts = {}) {
    if (!el) return;

    // Default config
    const defaults = {
      text: ["Tow and Toast", "Mobile Bar", "Pittsburgh", "Craft Cocktails Anywhere the Party Goes"],
      typingSpeed: 65,
      deletingSpeed: 40,
      pauseDuration: 1500,
      loop: true,
      showCursor: true,
      variableSpeed: { min: 40, max: 90 },
      textColors: ["#ECA0A5", "#111214", "#ECA0A5", "#111214"],
    };

    const o = Object.assign({}, defaults, opts);
    const textArray = Array.isArray(o.text) ? o.text : [o.text];

    // Build DOM structure
    el.classList.add("text-type");
    const content = document.createElement("span");
    content.className = "text-type__content";
    const cursor = document.createElement("span");
    cursor.className = "text-type__cursor";
    cursor.textContent = "|";
    el.innerHTML = "";
    el.appendChild(content);
    if (o.showCursor) el.appendChild(cursor);

    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let displayedText = "";
    let timer;

    function setColor() {
      const col = o.textColors[textIndex % o.textColors.length];
      content.style.color = col;
      cursor.style.color = col;
    }

    function type() {
      const fullText = textArray[textIndex];
      setColor();

      if (isDeleting) {
        displayedText = fullText.substring(0, charIndex--);
      } else {
        displayedText = fullText.substring(0, charIndex++);
      }

      content.textContent = displayedText;

      let delay = o.variableSpeed
        ? nextRand(o.variableSpeed.min, o.variableSpeed.max)
        : o.typingSpeed;

      if (!isDeleting && charIndex === fullText.length + 1) {
        delay = o.pauseDuration;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % textArray.length;
        delay = o.pauseDuration / 2;
      }

      clearTimeout(timer);
      timer = setTimeout(type, delay);
    }

    type();
  }

  // Auto-init typing animation for elements with [data-text-type]
  document.addEventListener("DOMContentLoaded", () => {
    const el = document.querySelector("[data-text-type]");
    if (el) {
      const phrases = el.dataset.textType
        ? el.dataset.textType.split("|").map(s => s.trim())
        : undefined;
      const textColors = el.dataset.textColors
        ? el.dataset.textColors.split("|").map(s => s.trim())
        : undefined;

      TextType(el, {
        text: phrases,
        textColors: textColors,
        typingSpeed: parseInt(el.dataset.typingSpeed || "65"),
        deletingSpeed: parseInt(el.dataset.deletingSpeed || "40"),
        pauseDuration: parseInt(el.dataset.pauseDuration || "1500"),
        loop: el.dataset.loop !== "false"
      });
    }
  });
})();
