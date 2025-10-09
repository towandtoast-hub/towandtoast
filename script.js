// Footer year
const y = document.getElementById('year');
if (y) y.textContent = new Date().getFullYear();

// Persistent active tab: auto-detect current page and mark nav link
(function setActiveNav(){
  const links = document.querySelectorAll('.nav a');
  if (!links.length) return;

  // Determine current file ("index.html" if trailing slash)
  let file = window.location.pathname.split('/').pop();
  if (!file || !file.includes('.')) file = 'index.html';

  links.forEach(a => {
    const target = (a.getAttribute('href') || '').split('/').pop();
    if (target === file) {
      a.classList.add('active');
      a.setAttribute('aria-current','page');
    }
  });
})();

// Lightbox for gallery
const lightbox = document.createElement('div');
lightbox.className = 'lightbox';
lightbox.innerHTML = '<img alt="">';
document.body.appendChild(lightbox);
lightbox.addEventListener('click', () => lightbox.classList.remove('show'));

function renderGallery(data){
  const root = document.getElementById('gallery');
  if (!root) return;
  root.innerHTML = '';
  Object.keys(data).sort().forEach(year => {
    const wrap = document.createElement('section');
    wrap.className = 'gallery-year';
    const h2 = document.createElement('h2');
    h2.textContent = year;
    wrap.appendChild(h2);
    const grid = document.createElement('div');
    grid.className = 'gallery-grid';
    data[year].forEach(src => {
      const img = document.createElement('img');
      img.src = src;
      img.alt = 'Event photo';
      img.addEventListener('click', () => {
        lightbox.querySelector('img').src = src;
        lightbox.classList.add('show');
      });
      grid.appendChild(img);
    });
    wrap.appendChild(grid);
    root.appendChild(wrap);
  });
}

// Load gallery.json (if gallery exists)
fetch('gallery.json')
 .then(r => r.ok ? r.json() : Promise.reject())
 .then(renderGallery)
 .catch(() => {
   // fallback placeholders
   renderGallery && renderGallery({
     "2025":["assets/gallery/2025/placeholder.png"],
     "2024":["assets/gallery/2024/placeholder.png"]
   });
 });

/* ===== TextType (framework-free) =====
   Features: multi-text typing/deleting, loop, variable speed, start on visible,
   custom cursor, hide cursor while typing, per-phrase colors, reverse mode.
   Usage: add an element with class="text-type" and initialize with TextType.init(...)
*/

(function () {
  function nextRand(min, max) {
    return Math.random() * (max - min) + min;
  }

  function TextType(el, opts = {}) {
    if (!el) return;

    const defaults = {
      text: "Tow & Toast",               // string or array of strings
      typingSpeed: 50,                   // ms per char
      deletingSpeed: 30,                 // ms per char
      initialDelay: 0,                   // ms before first character
      pauseDuration: 2000,               // ms after a phrase finishes
      loop: true,
      showCursor: true,
      hideCursorWhileTyping: false,
      cursorCharacter: "|",
      cursorBlinkDuration: 0.5,          // seconds
      textColors: [],                    // e.g. ["#ECA0A5", "#111214"]
      variableSpeed: null,               // {min: 30, max: 90}
      startOnVisible: false,
      reverseMode: false,
      onSentenceComplete: null           // function(phrase, index)
    };

    const o = Object.assign({}, defaults, opts);
    const textArray = Array.isArray(o.text) ? o.text.slice() : [o.text];

    // Build DOM structure
    el.classList.add("text-type");
    const content = document.createElement("span");
    content.className = "text-type__content";
    const cursor = document.createElement("span");
    cursor.className = "text-type__cursor";
    cursor.textContent = o.cursorCharacter;

    el.innerHTML = "";
    el.appendChild(content);
    if (o.showCursor) el.appendChild(cursor);

    // Apply cursor blink duration
    cursor.style.setProperty("--cursor-blink-duration", o.cursorBlinkDuration + "s");

    let displayedText = "";
    let currentCharIndex = 0;
    let isDeleting = false;
    let currentTextIndex = 0;
    let started = !o.startOnVisible;
    let timer = null;

    const getSpeed = () => {
      if (o.variableSpeed && typeof o.variableSpeed.min === "number" && typeof o.variableSpeed.max === "number") {
        return nextRand(o.variableSpeed.min, o.variableSpeed.max);
      }
      return isDeleting ? o.deletingSpeed : o.typingSpeed;
    };

    const currentColor = () => {
      if (!o.textColors || !o.textColors.length) return null;
      return o.textColors[currentTextIndex % o.textColors.length];
    };

    function setColor() {
      const col = currentColor();
      if (col) content.style.color = col;
    }

    function step() {
      const raw = textArray[currentTextIndex] || "";
      const target = o.reverseMode ? raw.split("").reverse().join("") : raw;

      if (o.hideCursorWhileTyping && o.showCursor) {
        const typingInProgress = (!isDeleting && currentCharIndex < target.length) || isDeleting;
        cursor.classList.toggle("text-type__cursor--hidden", typingInProgress);
      }

      if (isDeleting) {
        if (displayedText.length === 0) {
          isDeleting = false;
          currentCharIndex = 0;

          // phrase complete (after deletion)
          if (typeof o.onSentenceComplete === "function") {
            o.onSentenceComplete(textArray[currentTextIndex], currentTextIndex);
          }

          // next phrase or stop if no loop
          if (currentTextIndex === textArray.length - 1 && !o.loop) {
            clearTimeout(timer);
            return;
          }
          currentTextIndex = (currentTextIndex + 1) % textArray.length;
          setColor();
          timer = setTimeout(tick, o.pauseDuration);
          return;
        } else {
          displayedText = displayedText.slice(0, -1);
          content.textContent = displayedText;
          timer = setTimeout(tick, getSpeed());
          return;
        }
      }

      // Typing forward
      if (currentCharIndex < target.length) {
        displayedText += target.charAt(currentCharIndex++);
        content.textContent = displayedText;
        timer = setTimeout(tick, getSpeed());
      } else {
        // Finished a phrase
        if (textArray.length > 1) {
          timer = setTimeout(() => {
            isDeleting = true;
            tick();
          }, o.pauseDuration);
        } else {
          // Single phrase: optional loop by deleting
          if (o.loop) {
            timer = setTimeout(() => {
              isDeleting = true;
              tick();
            }, o.pauseDuration);
          } else {
            // Done (keep cursor blinking)
            clearTimeout(timer);
          }
        }
      }
    }

    function tick() {
      step();
    }

    function start() {
      if (started) return;
      started = true;
      setColor();
      if (o.initialDelay > 0) {
        timer = setTimeout(tick, o.initialDelay);
      } else {
        tick();
      }
    }

    // Start immediately or wait for visibility
    if (o.startOnVisible && "IntersectionObserver" in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            start();
            io.disconnect();
          }
        });
      }, { threshold: 0.1 });
      io.observe(el);
    } else {
      start();
    }

    // Public API (optional)
    return {
      destroy() { clearTimeout(timer); },
      restart() {
        clearTimeout(timer);
        displayedText = ""; currentCharIndex = 0;
        isDeleting = false; currentTextIndex = 0;
        content.textContent = "";
        setColor();
        started = true;
        tick();
      }
    };
  }

  // Helper: data-attribute autoinit
  function autoInit() {
    document.querySelectorAll("[data-text-type]").forEach((el) => {
      try {
        const data = el.dataset;
        const text = data.textType?.split("|").map(s => s.trim()).filter(Boolean) || ["Tow & Toast"];
        const textColors = (data.textColors || "").split("|").map(s => s.trim()).filter(Boolean);
        const typingSpeed = parseInt(data.typingSpeed || "50", 10);
        const deletingSpeed = parseInt(data.deletingSpeed || "30", 10);
        const initialDelay = parseInt(data.initialDelay || "0", 10);
        const pauseDuration = parseInt(data.pauseDuration || "2000", 10);
        const loop = (data.loop || "true") !== "false";
        const showCursor = (data.showCursor || "true") !== "false";
        const hideCursorWhileTyping = (data.hideCursorWhileTyping || "false") === "true";
        const cursorCharacter = (data.cursorCharacter || "|");
        const cursorBlinkDuration = parseFloat(data.cursorBlinkDuration || "0.5");
        const startOnVisible = (data.startOnVisible || "false") === "true";
        const reverseMode = (data.reverseMode || "false") === "true";
        const variableSpeed = (data.variableSpeed || "")
          ? (() => {
              const [min, max] = data.variableSpeed.split(",").map(n => parseFloat(n.trim()));
              if (isNaN(min) || isNaN(max)) return null;
              return { min, max };
            })()
          : null;

        TextType(el, {
          text, typingSpeed, deletingSpeed, initialDelay, pauseDuration,
          loop, showCursor, hideCursorWhileTyping, cursorCharacter,
          cursorBlinkDuration, textColors, startOnVisible, reverseMode, variableSpeed
        });
      } catch (e) {
        console.warn("TextType auto-init failed:", e);
      }
    });
  }

  // Expose + auto-init
  window.TextType = TextType;
  document.addEventListener("DOMContentLoaded", autoInit);
})();

