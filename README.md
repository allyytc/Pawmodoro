# 🐾 Pawmodoro: Your Pomodoro Study Pet

**A Chrome extension that pairs a Pomodoro timer and to-do list with an AI-generated pixel-art pet that reacts to whether you're staying on task.**

> Built at **DubHacks 2025** (October 2025).

**Links:** [Devpost (DubHacks 2025)](https://devpost.com/software/pawmodoro-178q6z) · [Demo video (YouTube)](https://www.youtube.com/watch?v=KWkfedqEbig)

---

## Why we built it

Pomodoro timers help you focus, but they can feel dry. Pawmodoro gives you a small companion to keep you company while you work. You describe an animal, the extension generates a custom pixel-art pet, and the pet's mood follows your browsing. It's happy on the sites you've marked as allowed, gets grumpy when you drift off, and celebrates when you finish a task.

## Features

- **AI-generated pet.** Type any animal ("fox", "dragon", ...) and Pawmodoro asks Google's Imagen model (through the Gemini API) for four pixel-art sprites: *happy*, *mad*, *being petted*, and *celebrating*. A canvas pass then turns white and light-grey "fake transparency" pixels transparent, and the sprites are saved locally.
- **Pomodoro timer.** A 25-minute study timer and a 5-minute break timer with Start/Pause, Reset, and Break/Study switching. A "Study" / "Break" banner shows the current phase. The timer state (time left, running or paused, timestamp) is saved, so when you reopen the popup or side panel it catches up on the time that passed.
- **On-task tracking.** You keep a list of allowed websites. A background service worker checks the active tab's hostname each time you switch or load a tab. On an allowed site the pet is happy. On any other `http(s)` site it gets mad.
- **Interactive pet.** Click the pet to play a meow sound and show the "petted" sprite for a second.
- **To-do list.** Add tasks (button or Enter) and click one to mark it done. Finishing a task sets off a 3-second celebration animation for the pet.
- **Two views:**
  - **Toolbar popup:** a compact view with the timer, phase banner, and pet.
  - **Chrome side panel:** the full experience, with pet creation (first run), the timer, the pet, and a toggle between the to-do list and the allowed-websites manager.
- **Local-first storage.** Everything is kept in `chrome.storage.local` on your machine. There are no accounts and no backend.

## Tech stack

| Area | Tools |
|---|---|
| Extension platform | Chrome Extensions **Manifest V3** (action popup, side panel, background service worker) |
| UI | **React 19** + **TypeScript 5.9** |
| Styling | **Tailwind CSS v4** (`@tailwindcss/vite`) plus a few plain CSS files |
| Build tooling | **Vite 7**, ESLint 9 (typescript-eslint, react-hooks) |
| AI | Google **Gemini API / Imagen** (`imagen-3.0-generate-002`) for sprite generation |
| Storage | `chrome.storage.local` |

## Demo

[![Pawmodoro demo video](https://img.youtube.com/vi/KWkfedqEbig/maxresdefault.jpg)](https://www.youtube.com/watch?v=KWkfedqEbig)

The repo already contains the art the UI uses: the side-panel background `pawmodoro-dub/public/images/bedroom.png`, the popup background `pawmodoro-dub/public/images/cabin.png`, and the extension icon `pawmodoro-dub/public/images/noodle.png`.

## Project structure

```
Pawmodoro/
├── README.md
└── pawmodoro-dub/                 # The extension (Vite + React project)
    ├── index.html                 # Single entry page; ?view=popup or ?view=sidepanel picks the UI
    ├── vite.config.ts             # React + Tailwind plugins; builds index.html to dist/
    ├── package.json
    ├── public/                    # Copied as-is into dist/
    │   ├── manifest.json          # MV3 manifest (popup, side panel, service worker, permissions)
    │   ├── background.js          # Service worker: checks the active tab against allowed sites
    │   ├── phase.css, popup.css   # Phase banner and popup background styles
    │   ├── images/                # Backgrounds and extension icon
    │   └── sounds/                # Meow sound effects
    └── src/
        ├── main.tsx               # React entry point
        ├── App.tsx                # Picks the popup or side-panel layout
        ├── index.css              # Tailwind import + base font
        └── components/
            ├── PetCreaterPage.tsx # First-run wrapper around PetCreator
            ├── PetCreator.tsx     # Gemini/Imagen sprite generation + background cleanup
            ├── PetDisplay.tsx     # Pet mood, petting, and celebration states
            ├── twentyfive-timer.tsx  # 25-min study timer (switches to the break timer)
            ├── five-timer.tsx        # 5-min break timer
            ├── phase.tsx          # "Study" / "Break" banners
            ├── switchButton.tsx   # Toggles between the to-do list and website manager
            ├── todo_list.tsx      # Tasks + celebration trigger
            └── WebsiteManager.tsx # Allowed-sites list
```

## Getting started

### Prerequisites

- **Node.js 20.19+ or 22.12+** (Vite 7 needs this) and npm
- **Google Chrome** (or another Chromium browser that supports the Side Panel API)
- A **Gemini API key** with image-generation access, for creating your pet. See [Known limitations](#known-limitations).

### 1. Install

```bash
git clone https://github.com/allyytc/Pawmodoro.git
cd Pawmodoro/pawmodoro-dub
npm install        # or: npm ci
```

### 2. Configure your API key

Copy `.env.example` to `.env.local` and replace the placeholder with your Gemini API key:

```bash
cp .env.example .env.local
```

`.env.example` contains `VITE_GEMINI_API_KEY=your_gemini_api_key_here`. Git ignores `.env`, `.env.local`, and other `.env.*` files. `.env.example` is the only env file that stays in the repo.

> ⚠️ Vite inlines `VITE_*` variables into the built JavaScript, so anyone with your `dist/` folder can read the key. Use a personal, restricted key and don't publish a build that contains it.

### 3. Build

```bash
npm run build      # runs: tsc -b && vite build
```

This writes the unpacked extension to **`pawmodoro-dub/dist/`**. Vite copies `manifest.json`, `background.js`, the CSS files, images, and sounds from `public/` into it.

### 4. Load it in Chrome

1. Open `chrome://extensions`.
2. Turn on **Developer mode** (top right).
3. Click **Load unpacked** and select the `pawmodoro-dub/dist` folder.
4. Pin **"Pawmadoro: Study Pet"** (manifest v1.0.0) from the puzzle-piece menu.

After any code change, run `npm run build` again and click the reload icon on the extension's card.

### Other scripts

| Command | What it does |
|---|---|
| `npm run dev` | Starts the Vite dev server. The UI calls `chrome.*` APIs, so it only works fully when loaded as an extension. |
| `npm run build` | Type-checks and builds the extension into `dist/` |
| `npm run lint` | Runs ESLint |
| `npm run preview` | Serves the production build with Vite |

## Usage

1. **Open the side panel.** Click Chrome's side panel button and pick Pawmodoro. On first run you'll see **Create Your Study Buddy!** Enter an animal and click **Create Pet**, then **SAVE**.
2. **Add allowed sites.** In the side panel, click **Next -->** to open **Manage Allowed Websites** and add the hostnames you study on (for example `docs.google.com`). Hostnames must match exactly, so `www.notion.so` and `notion.so` count as different sites.
3. **Start a session.** Press **Start** on the 25:00 timer. Press **Break** to switch to the 5:00 break timer and **Study** to come back.
4. **Track tasks.** Click **<-- Back** to return to the to-do list. Add tasks and click one to complete it, and your pet celebrates.
5. **Use the popup.** Click the toolbar icon for a quick view of the timer and your pet.

### Data stored locally

All data lives in `chrome.storage.local` under these keys: `pet` (name + four sprite data URLs), `allowedSites`, `onTaskStatus`, `savedTasks`, `celebrating`, `twentyFiveTimerState`, and `fiveTimerState`.

### Permissions

| Permission | Why |
|---|---|
| `storage` | Saves the pet, tasks, allowed sites, and timer state |
| `tabs` | Reads the active tab's URL so the pet can react to on-task or off-task browsing |
| `sidePanel` | Provides the full side-panel UI |
| `scripting`, host permissions `http://*/*` and `https://*/*` | Declared in the manifest. The current code doesn't call `chrome.scripting`. |

## Known limitations

- **Pet creation currently fails.** `PetCreator.tsx` calls `imagen-3.0-generate-002`, and Google shut that model down on Nov 10, 2025. Until the request moves to a current image model, new pets can't be generated. Everything else (timer, to-do list, site tracking, a pet you already saved) still works.
- **The timer only ticks while a Pawmodoro view is open.** It counts down inside the popup or side panel and catches up from a saved timestamp when you reopen it. Nothing notifies you when a session ends, and it doesn't switch phases on its own.
- The study and break lengths are fixed at 25 and 5 minutes.
- The popup and side panel each run their own copy of the timer. They share saved state when they load, not live.
- If your allowed-sites list is empty, every website counts as off-task. Non-web pages such as `chrome://` count as on-task.
- Tasks can be marked done or not done, but you can't delete them.

## Future work

These ideas come from the open issues in the GitHub tracker:

- A background timer engine that keeps running with the popup closed
- More pet states (bored, sleepy, sick) driven by focus streaks
- A notes section next to the task list

## Team

Built at DubHacks 2025 by:

- **Ally Chen**: [@allyytc](https://github.com/allyytc)
- **Alan Nguyen**: [@alnnguyen](https://github.com/alnnguyen)
- **Alex Nguyen**: [@alwxngn](https://github.com/alwxngn)

<!-- Add a License section once a LICENSE file is chosen. -->
