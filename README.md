# Tow And Toast – Static Website for GitHub Pages

This is a simple, fast, static site built for GitHub Pages. It follows your planning sheet:

- Tabs: Home, About, Packages, Calendar, Trailer Tour, Gallery, Bookings / Contact
- Color scheme main: `#ECA0A5` (pink)
- Contact email + Google Form link
- Calendar (Google Calendar embed)
- Trailer Tour (YouTube embed)
- Gallery (images organized by year)

## How to Use

1. **Create a new repo** named `tow-and-toast` (or any name) on GitHub.
2. Upload this project (or push via git).
3. Enable GitHub Pages in **Settings → Pages** (use `main` branch, `/root`).
4. Add your **custom domain** in **Settings → Pages** → Custom domain (optional).

## Customize

- **Calendar**: open `calendar.html` and replace the `src` of the iframe with your public calendar’s embed URL.  
- **YouTube**: open `trailer.html` and replace `VIDEO_ID` with your video’s ID.  
- **Gallery**: add images into `assets/gallery/2024` or `assets/gallery/2025` (or new folders), then list them in `gallery.json`.  
- **Colors/Fonts**: edit `styles.css`.  
- **Content**: update text in each page as needed.

## Booking Form

The contact page embeds your Google Form. If the form’s embed URL changes, update it in `contact.html`.

---

Deployed with ❤️ via GitHub Pages.
