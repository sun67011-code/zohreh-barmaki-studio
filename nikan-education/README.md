# Nikan Hospital — Education Department (prototype)

| File | What it is |
|---|---|
| `index.html` | Bilingual (فارسی / English) landing page — library, courses, learning path, FAQ, detail pages |
| `admin.html` | Admin panel: add / edit / reorder / delete courses and health guides; export/import JSON |
| `assets/data.js` | Default content (courses + guides). Replace with the JSON exported from the admin panel |
| `assets/nikan-mark.png`, `icon-192/512.png` | Logo mark (transparent) and app icons |
| `manifest.webmanifest`, `sw.js` | Installable app (PWA) + offline cache — works when served over HTTPS |
| `instagram/` | Post, carousel, story and highlight-cover templates (PNG 1080px) + editable `templates.html` |

Run locally: `python3 -m http.server` in this folder, then open http://localhost:8000
All dates, capacities and clinical text are samples and must be approved by the clinical committee.
