# pawmodoro-dub

Chrome extension source (Vite, React, TypeScript). Overview, setup, and usage are in the [root README](../README.md).

```bash
npm install
cp .env.example .env.local   # set VITE_GEMINI_API_KEY
npm run build                # writes dist/
```

Load `dist/` from `chrome://extensions` (Developer mode, then Load unpacked). Rebuild and click reload on the extension card after code changes.

`index.html?view=popup` is the toolbar popup. `index.html?view=sidepanel` is the side panel. Files in `public/` are copied into the build.
