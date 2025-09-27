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
