document.getElementById('year').textContent = new Date().getFullYear();

// Lightbox for gallery
const lightbox = document.createElement('div');
lightbox.className = 'lightbox';
lightbox.innerHTML = '<img alt="">';
document.body.appendChild(lightbox);
lightbox.addEventListener('click', () => lightbox.classList.remove('show'));

function renderGallery(data){
  const root = document.getElementById('gallery');
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

// Load gallery.json
fetch('gallery.json')
 .then(r => r.json())
 .then(renderGallery)
 .catch(() => {
   // fallback: show placeholders
   renderGallery({
     "2025":["assets/gallery/2025/placeholder.png"],
     "2024":["assets/gallery/2024/placeholder.png"]
   });
 });
