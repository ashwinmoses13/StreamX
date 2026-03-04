# Netflix-style Landing Page (React)

A Netflix-inspired landing page UI (hero banner + horizontal rows + modal) that **fetches real movie data from OMDb**.

> Note: your prompt mentioned TMDB, but the API key provided was an **OMDb** key (example URL with `apikey=...`). This project is wired to OMDb so it works immediately.

## Setup

The app reads the key from `VITE_OMDB_API_KEY`.

- The repo already includes a working `.env` for local dev.
- To change it, edit `.env`:

```bash
VITE_OMDB_API_KEY=your_key_here
```

## Run

```bash
cd netflix-landing
npm install
npm run dev
```

Then open the URL printed in the terminal (usually `http://localhost:5173/`).

## Production build / preview

```bash
npm run build
npm run preview
```

Preview usually runs at `http://localhost:4173/`.
