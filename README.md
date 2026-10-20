# Pawmodoro

**A Chrome extension that pairs a Pomodoro timer and a to-do list with a pixel-art pet that stays happy on the sites you meant to study on.**

Built at [DubHacks 2025](https://dubhacks25.devpost.com/) in October 2025. This repository is the hackathon prototype: build it locally and load the unpacked extension in Chrome.

**Links:** [Devpost](https://devpost.com/software/pawmodoro-178q6z) · [Demo video](https://www.youtube.com/watch?v=KWkfedqEbig)

[![Pawmodoro demo video](https://img.youtube.com/vi/KWkfedqEbig/maxresdefault.jpg)](https://www.youtube.com/watch?v=KWkfedqEbig)

## What it does

You describe an animal. Pawmodoro asks Google's Imagen model, through the Gemini API, for four pixel-art sprites: happy, mad, being petted, and celebrating. A canvas pass then clears white and light-grey pixels that Imagen draws in place of real transparency, and the sprites stay in `chrome.storage.local`.

While a study view is open, a 25-minute timer counts down. A background service worker compares the active tab's hostname to a list of allowed sites. On a match the pet is happy. On any other `http` or `https` page it is mad. Click the pet and it meows (`sounds/meow2.wav`) and shows the petted sprite for one second. Checking off a task shows the celebrating sprite for three seconds.

The Devpost page describes a wider design, including extra moods, focus streaks, and an end-of-session summary. Those pieces are not in this codebase. This repository implements the timer, the to-do list, the allowed-site check, and the four sprites.

## Features

- **Custom pet.** Enter an animal ("fox", "dragon", ...) and generate four sprites in parallel. The pet's display name is the animal with a capital first letter.
- **Pomodoro timer.** 25:00 study and 5:00 break, with Start/Pause, Reset, and Break/Study. Switching phases resets the timer you leave. A Study or Break banner tracks the phase. Time left, running or paused, and a timestamp are saved, so reopening the popup or side panel subtracts the time that passed.
- **On-task check.** Allowed hostnames must match exactly (`www.notion.so` and `notion.so` are different). The service worker updates `onTaskStatus` when the active tab changes or finishes loading.
- **To-do list.** Add a task with the button or Enter. Click a task to toggle it done. Completing a task sets `celebrating` so the pet can react.
- **Two surfaces.**
  - **Toolbar popup:** timer, phase banner, and pet, on the cabin background.
  - **Side panel:** pet creation on first run, then the timer, the pet, and a toggle between the to-do list and **Manage Allowed Websites**, on the bedroom background.
- **Local only.** Pet, tasks, allowed sites, and timer state live in `chrome.storage.local`. There is no account and no backend. Image prompts are the only thing sent to Gemini. Tab URLs stay on the machine.

The side-panel background is `pawmodoro-dub/public/images/bedroom.png`, the popup background is `pawmodoro-dub/public/images/cabin.png`, and the toolbar icon is `pawmodoro-dub/public/images/noodle.png`. Chrome shows the extension as **Pawmadoro: Study Pet** (manifest version 1.0.0).

## Tech stack

| Area | Tools |
|---|---|
| Extension | Chrome Manifest V3: action popup, side panel, background service worker |
| UI | React 19, TypeScript 5.9 |
| Styling | Tailwind CSS v4 (`@tailwindcss/vite`), plus `phase.css` and `popup.css` |
| Build | Vite 7, ESLint 9 (typescript-eslint, react-hooks, react-refresh) |
| Pet art | Gemini API endpoint for `imagen-3.0-generate-002` |
| Storage | `chrome.storage.local` |

## Architecture

One Vite app serves both Chrome surfaces. `index.html?view=popup` and `index.html?view=sidepanel` land in `src/App.tsx`, which picks the layout. `public/` is copied into `dist/` as-is, including `manifest.json` and `background.js`.

```
popup / side panel (React)
        |  read + write chrome.storage.local
        |     pet, savedTasks, allowedSites, timer state, celebrating
        v
background.js
        |  active tab hostname vs allowedSites
        v
   onTaskStatus  --->  PetDisplay (happy or mad)

PetCreator  --prompts only-->  Gemini Imagen API  -->  canvas cleanup  -->  pet
```

`PetDisplay` chooses a sprite in this order: celebrating, then being petted, then happy or mad.

## Project structure

```
Pawmodoro/
├── README.md
└── pawmodoro-dub/                  # Vite + React extension
    ├── index.html                  # ?view=popup or ?view=sidepanel
    ├── vite.config.ts
    ├── package.json
    ├── .env.example                # VITE_GEMINI_API_KEY
    ├── public/
    │   ├── manifest.json
    │   ├── background.js           # allowed-site check
    │   ├── phase.css, popup.css
    │   ├── images/
    │   └── sounds/
    └── src/
        ├── main.tsx
        ├── App.tsx                 # popup vs side panel
        └── components/
            ├── PetCreaterPage.tsx  # first-run wrapper
            ├── PetCreator.tsx      # Imagen request + background cleanup
            ├── PetDisplay.tsx
            ├── twentyfive-timer.tsx
            ├── five-timer.tsx
            ├── phase.tsx
            ├── switchButton.tsx    # to-do list vs allowed sites
            ├── todo_list.tsx
            └── WebsiteManager.tsx
```

## Getting started

### Prerequisites

- Node.js `^20.19.0` or `>=22.12.0` (the range Vite 7 declares) and npm
- Google Chrome, or another Chromium browser with the Side Panel API
- A Gemini API key if you want to create a pet. See [Limits](#limits).

### Install

```bash
git clone https://github.com/allyytc/Pawmodoro.git
cd Pawmodoro/pawmodoro-dub
npm install
```

`package-lock.json` is in the repo, so `npm ci` works too.

### API key

Required environment variable: `VITE_GEMINI_API_KEY`

```bash
cp .env.example .env.local
```

`.env.example` sets that variable to `your_gemini_api_key_here`. Git ignores `.env`, `.env.local`, and other `.env.*` files except `.env.example`.

Vite inlines `VITE_*` values into the built JavaScript. Anyone with the `dist/` folder can read the key. Use a personal key and do not publish that build.

### Build and load

```bash
npm run build    # tsc -b && vite build
```

The unpacked extension is `pawmodoro-dub/dist/`.

1. Open `chrome://extensions`.
2. Turn on **Developer mode**.
3. Click **Load unpacked** and choose `pawmodoro-dub/dist`.
4. Pin **Pawmadoro: Study Pet**.

After a code change, run `npm run build` again and click reload on the extension card.

### Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Vite dev server. `chrome.*` calls only work fully when the page is loaded as an extension. |
| `npm run build` | Type-check and write `dist/` |
| `npm run lint` | ESLint |
| `npm run preview` | Serve the production build with Vite |

## Usage

1. Open the side panel and choose Pawmodoro. The first run shows **Create Your Study Buddy!** Enter an animal, click **Create Pet**, then **SAVE**.
2. Click **Next -->** to open **Manage Allowed Websites** and add hostnames (for example `docs.google.com`).
3. Press **Start** on the 25:00 timer. **Break** switches to 5:00. **Study** switches back.
4. Click **<-- Back** for the to-do list. Add a task, then click it to complete it. The pet celebrates.
5. Click the toolbar icon for the compact timer and pet.

### Keys in `chrome.storage.local`

`pet` (name and four sprite data URLs), `allowedSites`, `onTaskStatus`, `savedTasks`, `celebrating`, `twentyFiveTimerState`, `fiveTimerState`.

### Permissions

| Permission | Why it is in the manifest |
|---|---|
| `storage` | Pet, tasks, allowed sites, timer state |
| `tabs` | Read the active tab URL for the on-task check |
| `sidePanel` | Side panel UI |
| `scripting`, `http://*/*`, `https://*/*` | Declared. The current code does not call `chrome.scripting`. |

## Limits

- **New pets fail.** `PetCreator.tsx` calls `imagen-3.0-generate-002`. Google shut that model down on November 10, 2025 ([Gemini API release notes](https://ai.google.dev/gemini-api/docs/changelog)). The timer, to-do list, site check, and a pet already saved in storage still run.
- **The clock runs only while a Pawmodoro view is open.** It catches up from the saved timestamp on the next open. Nothing notifies you at 0:00, and the phase does not advance on its own.
- Study and break lengths are fixed at 25 and 5 minutes. Switching phases resets the timer you leave.
- The popup and the side panel are separate pages. They share stored timer state when they load. They do not tick in lockstep.
- An empty allowed-sites list makes every `http(s)` page off-task. `chrome://` and other non-web URLs count as on-task.
- New tasks are written to `savedTasks`. Marking a task done or not done updates the list on screen and can start the celebration, and that completed flag is not written back. Tasks cannot be deleted.

## Still open

These items are still open on the GitHub tracker, and they are not implemented:

- A background timer that keeps running with the popup closed, plus badges and notifications ([#4](https://github.com/allyytc/Pawmodoro/issues/4))
- More pet states (bored, sleepy, sick) tied to focus streaks ([#3](https://github.com/allyytc/Pawmodoro/issues/3))
- A notes field next to the task list ([#5](https://github.com/allyytc/Pawmodoro/issues/5))

The Devpost "What's next" section describes further ideas (more personalities, a distraction overlay, shared sessions). Those are plans on the project page, not code in this repo.

## Team

DubHacks 2025. Every role is a **draft** inferred from commit history and needs confirmation.

| Name | Draft role |
|---|---|
| Ally Chen ([@allyytc](https://github.com/allyytc)) | Draft: extension scaffold, popup and side panel, study and break phases, documentation |
| Alan Nguyen ([@alnnguyen](https://github.com/alnnguyen)) | Draft: timer behavior, to-do list, allowed websites, manifest permissions, interface styling |
| Alex Nguyen ([@alwxngn](https://github.com/alwxngn)) | Draft: Imagen pet generation, pet display and petting, on-task tab checks, icons and sounds |

Git commits for Alan are authored as `ahlawnh` and `Alan Nguyen`. Git commits for Alex use the handle `alwxngn`. The Devpost page lists [mehulmuna](https://github.com/mehulmuna) (Munankarmi). That account has no commits in this repository, so no role is inferred here.

This repository has no license file.
