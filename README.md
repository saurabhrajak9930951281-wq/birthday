# A Little World of Magic for Rebecca ♡  (plain HTML + CSS + JS)
No build step, no installs. Files: index.html, style.css, script.js, config.js.

- **Run:** double-click `index.html` (or use VS Code "Live Server").
- **Edit text, wishes, captions, photo paths:** `config.js`. Photos go in `photos/` (e.g. `src: 'photos/rebecca.jpg'`).
- **Music:** put your song at `audio/song.mp3` (or change `music` in config.js). It never autoplays; the ♫ button also turns on soft sound effects.
- **Deploy:** Netlify → drag this whole folder into app.netlify.com/drop. Vercel → `vercel` in this folder, or import the repo (framework "Other", no build command).

## Photos (GitHub-safe)
Photos are in `photos/` with lowercase names, no spaces, and **relative** paths (`photos/name.jpg`, no leading `/`), so they work on GitHub Pages, Netlify and Vercel. Commit the whole `photos/` folder with the rest of the project. File names are case-sensitive on GitHub, so keep them exactly as written in `config.js`.

## Music
The song is at `audio/song.mp3` (128 kbps MP3, lowercase name, relative path) and is already linked in `config.js`. Commit the `audio/` folder with the project. It starts only when the visitor taps the ♫ button.
