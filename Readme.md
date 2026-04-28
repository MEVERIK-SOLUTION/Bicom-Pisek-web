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

## Cloudflare setup (pripraveno)
- `wrangler.toml` je pripraven pro Cloudflare Pages projekt.
- Endpointy v `functions/api/book.js` a `functions/api/chat.js` uz bezi ve formatu Cloudflare Pages Functions.
- Lokalni preview celeho projektu (vcetne Functions):
  - `npm run cf:dev`
- Manualni deploy pres CLI:
  - `npm run cf:deploy`

## Automaticke buildy a deploye
- V repozitari je workflow `.github/workflows/cloudflare-pages.yml`.
- Na `push` do `main` probehne automaticky:
   - `npm ci`
   - `npm run build`
   - `wrangler pages deploy`
- Na Pull Request se dela preview deploy na branch `pr-<cislo_pr>`.

Pro GitHub Actions nastav v repozitari tyto secrets:
- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

### Doporucene nastaveni v Cloudflare Pages (UI)
1. Connect to Git:
   - repo: `MEVERIK-SOLUTION/Bicom-Pisek-web`
   - production branch: `main`
2. Build settings:
   - Build command: `npm run build`
   - Build output directory: `public`
3. Functions:
   - automaticky se vezmou ze slozky `functions/`
4. Environment variables:
   - pridat API klice a bindingy (viz AI asistent nize)

## AI asistent (GitHub Models)
- Frontend widget je v `public/index.html`.
- Backend endpoint je v `functions/api/chat.js`.
- Endpoint vola GitHub Models Inference API.

Nutne environment variables v Cloudflare Pages projektu:
- `GITHUB_MODELS_API_KEY`
- `GITHUB_MODEL` (doporuceny default: `azureml/Phi-4-mini-instruct`)
- `GITHUB_MODELS_ENDPOINT` (default: `https://models.github.ai/inference`)

### Doporuceny model z GitHub Marketplace
Pro tento web doporucuji `azureml/Phi-4-mini-instruct`.

Proc:
- je to lehky a rychly model vhodny pro kratke FAQ/konzultacni odpovedi
- je cenove velmi rozumny a vhodny pro provoz v ramci bezneho predplatneho
- dobre funguje pro ceske texty v beznych dialogovych scenarich

Alternativa s vyssi kvalitou (za vyssi cenu):
- `azure-openai/gpt-4o-mini`

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
- `npm run cf:dev` - lokalni beh Cloudflare Pages + Functions
- `npm run cf:deploy` - deploy staticke casti pres wrangler CLI

## TODO do produkce
- Nahradit placeholder obrazky realnymi fotkami
- Schvalit finalni cenik a casy terapii
- Implementovat API endpointy (`book`, `chat`) na Cloudflare Workers
- Dodat GDPR podstranky
- Pripojit repozitar na Cloudflare Pages + Workers pipeline
