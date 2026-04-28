# Bicom Pisek - Rezervacni web a ekosystem

Tento repozitar obsahuje frontend prototyp a pripravenou strukturu pro rust do full-stack reseni na Cloudflare.

## Technicka architektura
- Frontend: HTML5 + Tailwind CSS (kompilovany build)
- Hosting: Cloudflare Pages
- Backend API (plan): Cloudflare Workers
- Databaze (plan): Cloudflare D1
- AI asistent (plan): Workers AI
- Uloziste (plan): Cloudflare R2

## Aktualni struktura repozitare
```text
/
|- public/
|  |- index.html
|  |- assets/
|  `- css/
|- src/
|  `- input.css
|- functions/
|  `- api/
|     |- book.js
|     `- chat.js
|- package.json
|- tailwind.config.js
|- .gitignore
`- Readme.md
```

## Build trasa (aktualni doporuceny flow)
1. **Vyvoj HTML/JS**
   - Upravuj `public/index.html`.
2. **Tailwind watch**
   - Spust `npm run watch:css` a nech bezet pri vyvoji.
3. **Produkci build CSS**
   - Pred commit/publish spust `npm run build`.
4. **Frontend deploy**
   - Cloudflare Pages nasad z vetve `main` (build command: `npm run build`, output dir: `public`).
5. **Backend evoluce**
   - Dodelat `functions/api/book.js` a `functions/api/chat.js` + napojeni na D1.

## Lokalni vyvoj
```bash
git clone <repo-url>
cd Bicom-Pisek-web
npm install
npm run build
```

Pro prubezny vyvoj CSS:
```bash
npm run watch:css
```

Stranku otevri lokalne z `public/index.html` (napr. pres VS Code Live Server).

## NPM skripty
- `npm run build:css` - jednorazovy build Tailwind CSS
- `npm run watch:css` - watch mod pro vyvoj
- `npm run build` - alias na produkcni CSS build

## TODO do produkce
- Nahradit placeholder obrazky realnymi fotkami
- Schvalit finalni cenik a casy terapii
- Implementovat API endpointy (`book`, `chat`) na Cloudflare Workers
- Dodat GDPR podstranky
- Pripojit repozitar na Cloudflare Pages + Workers pipeline
