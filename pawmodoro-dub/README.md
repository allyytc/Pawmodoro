# pawmodoro-dub (extension source)

See the [root README](../README.md) for the overview, setup, and usage.

Quick dev loop: `npm install` → copy `.env.example` to `.env.local` and set `VITE_GEMINI_API_KEY` → `npm run build` → load `dist/` at chrome://extensions → click reload after each build.

Entry: `index.html?view=popup|sidepanel` → `src/App.tsx`. Static extension files live in `public/`.
