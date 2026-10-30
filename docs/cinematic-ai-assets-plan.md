# Cinematic AI Assets — Audit, Shot List & Integration Plan

Status: **PLANNING ONLY — nothing generated, no site code changed, nothing deployed.**
Branch: `claude/cinematic-website-ai-assets-t245j5` (not `main`; GitHub Pages serves `main`).

---

## 1. Project audit

### 1.1 Which repository
| Repo | What it holds | Can it take website video work? |
|---|---|---|
| `zohreh-barmaki-studio` | Full static site, live at `zohrehbarmaki.site` (GitHub Pages, `CNAME`) | **Yes — target repo** |
| `layeghmusic-site` | README, deploy docs and 2 workflows only. The `site/` folder the README mentions is not committed | No — frontend source missing |
| `tehranep-development` | WordPress staging plugin, MCP and automation tooling | No — not the public frontend |

### 1.2 Stack (zohreh-barmaki-studio)
- Static HTML + vanilla JS + custom CSS. No build step, no framework, no database for the public site.
- Active styles: `assets/portfolio-v2.css` (all pages) + `assets/service-pages.css` (service pages). Active scripts: `assets/theme.js`, `assets/portfolio-v2.js`.
- `assets/site.css` / `assets/site.js` are **orphaned**: no HTML page loads them. They contain an older mobile "reel" scroll-snap system. Leave them untouched.
- Persistent light/dark theme (`localStorage: zb-theme`), with a `prefers-reduced-motion` reset already in place.
- Breakpoints: 1080 / 860 / 560 px.
- Media today: three WebP portraits (13–21 KB). **No video or raster artwork anywhere.** Every visual "art" panel is drawn in CSS.

### 1.3 Approved content, navigation and structure to preserve (frozen)
- **Pages:** `index`, `profile`, `platform`, `privacy`, `404`, and 9 `services/*.html` pages.
- **Primary nav:** Solutions · Expertise · Selected work · Profile · Contact. The mobile menu adds Creative practice, Consultant profile and Client platform.
- **Home section order:** hero → statement → solutions (sector tabs) → capabilities → selected work (4 cards) → creative practice (3 cards) → about → method → contact (local brief form) → footer.
- **All copy, headings, CTAs, links, JSON-LD, sitemap and robots stay as they are.** Video only goes into existing visual slots; it does not change the layout.

### 1.4 ⚠ Horizontal scrolling — needs your confirmation
Not one stylesheet the live pages load has horizontal scrolling (`overflow-x:auto`, `scroll-snap-type:x` or a horizontal track). The live pages use vertical layouts with responsive grids, and `overflow-x:hidden` is set on `body`. The only scroll-snap code is the **vertical** mobile snap in the orphaned `site.css`.
→ Please tell me which horizontal-scroll behaviour you mean: another repo, an unmerged design, or the sector tabs or creative cards on mobile. I will treat it as a frozen requirement either way.

### 1.5 Media slots available (no layout change)
| ID | Location | Current | Box |
|---|---|---|---|
| S1 | `index` creative card "Video & Motion" `.motion-art` | CSS gradient + ▶ | 270 px tall, full card width (~16:9–4:3, `object-fit:cover`) |
| S2 | `index` creative card "Storyboards" `.story-art` | CSS sheets | same |
| S3 | `index` creative card "Painting" `.painting-art` | CSS stroke | same; becomes full-height at 860–1080 px |
| S4–S7 | `index` selected-work `.project-visual` (art / clinical / system / portal) | CSS gradient + monogram | ~410 px tall, 72vw on mobile |
| S8 | `services/video-production.html` hero visual | ▶ placeholder | service hero frame |
| S9–S10 | `services/storyboard-illustration.html`, `services/painting-art-practice.html` hero visuals | CSS | service hero frame |

Hero portrait (`zohreh-portrait-final.webp`) stays a real photograph. **No AI likeness of Zohreh** unless you approve it explicitly.

---

## 2. Creative direction

**Look:** "quiet gallery cinema". Warm paper whites (#f4f2ed) and near-black graphite (#111214), with a single muted oxblood/plum accent taken from the existing `.motion-art` gradient. Slow dolly and push-in moves, shallow depth of field, soft 35 mm grain, no people's faces, no logos, no text in frame (typography stays in HTML).
**Rules:**
- **Truthfulness:** the site separates live work from concepts. AI clips must stay abstract and atmospheric. No fake hospitals, patients, UI screenshots or client footage.
- **Loop-first:** web clips are 5 s, seamless or ping-pong loops, muted, and carry no message that depends on sound.
- **Both themes:** every clip must read on light and dark backgrounds, so keep mid-key exposure and no pure-white frames.

---

## 3. Shot list

Format key: **W** = website 16:9, **YT** = YouTube 16:9, **R** = Instagram Reel 9:16.

| # | Slot | Shot | Camera / motion | Formats | Priority |
|---|---|---|---|---|---|
| 01 | S1, S8 | Film strip and light leak drifting across a dark editing desk; a timeline glows softly | Slow lateral dolly L→R, 50 mm, f/2 | W, R | **P1** |
| 02 | S2, S9 | Graphite storyboard panels on warm paper; pencil shading appears across frames | Overhead slow push-in | W, R | **P1** |
| 03 | S3, S10 | Macro oil paint: thick plum and ochre strokes folding together under raking light | Macro slider, very slow | W, R | **P1** |
| 04 | S4 | Dim exhibition room, sound waves rendered as thin light ribbons over a dark stage | Slow forward dolly | W | P2 |
| 05 | S5 | Abstract cardiac rhythm as a fine luminous line on frosted glass (no medical devices, no patients) | Locked-off, rack focus | W | P2 |
| 06 | S6 | Paper reports turning into structured layers of light (no readable text) | Slow orbit 15° | W | P3 |
| 07 | S7 | Two softly lit translucent panels connecting with a thread of light (patient ↔ physician) | Gentle crane down | W | P3 |
| 08 | YT | **"Studio Teaser" 20–30 s**: cut from 01 → 02 → 03 → 04, title cards made in HTML/NLE, not AI | Edit only | YT 16:9 | P2 |
| 09 | IG | **3 Reels**, one per creative discipline (01/02/03 generated natively at 9:16) + text overlays in editing | Native 9:16 | R | **P1** |

## 4. Visual prompts (model-agnostic; tune syntax per model)

Shared suffix: `cinematic, 35mm film grain, shallow depth of field, soft warm practical light, muted palette of warm paper white, graphite black and deep plum, no people, no faces, no text, no logos, seamless loop, slow subtle motion`
Shared negative: `text, watermark, logo, faces, hands close-up distortion, UI screenshot, hospital equipment, blood, oversaturated, fast motion, flicker`

- **01 Motion:** `A dark editing desk at night, a loose strip of 35mm film catches a drifting amber light leak, out-of-focus monitor timeline glowing behind, slow lateral dolly left to right` + suffix
- **02 Storyboard:** `Overhead view of hand-drawn graphite storyboard panels on warm textured paper, soft pencil shading gradually appearing across the frames, slow push-in` + suffix
- **03 Painting:** `Extreme macro of thick oil paint, deep plum and ochre strokes slowly folding into each other under raking side light, glossy impasto texture, slow slider move` + suffix
- **04 Exhibition:** `An empty dim gallery room with a small dark stage, thin ribbons of light moving like sound waves through the air, slow forward dolly` + suffix
- **05 Rhythm:** `A single fine luminous line pulsing in a calm heartbeat rhythm behind frosted glass, minimal and clinical-elegant, rack focus` + suffix
- **06 Structure:** `Sheets of blank paper lifting and reorganising into clean translucent layers of light, slow 15 degree orbit` + suffix
- **07 Connection:** `Two softly lit translucent glass panels in darkness joined by a slowly forming thread of warm light, gentle crane down` + suffix
- **9:16 variants (01–03):** same prompt plus `vertical composition, subject centred in the middle third, headroom for captions at top and bottom 15%`

---

## 5. Higgsfield: access, cost and model recommendation

### 5.1 Access check — **could not be completed from here**
- There is no Higgsfield connector or MCP tool in this session, and no API key in the environment.
- This container's network policy blocks `higgsfield.ai` and `platform.higgsfield.ai` (proxy `connect_rejected`).
- So I **cannot see your Starter balance or the models your account unlocks.** Please open *Higgsfield → Pricing/Account* and send me: (a) your remaining credits, (b) which video and image models show as available (not locked) on Starter, and (c) the credit cost each one shows for 5 s at 720p.

### 5.2 Public pricing (third-party, unverified, Oct 2026)
- Starter is reported at **$15/mo for 200 credits** (older Higgsfield figure) or **$19/mo for 270 credits** (most 2026 sources). Credits do not roll over.
- Starter reportedly includes the faster/lighter models (e.g. *Seedance Fast/Mini*). Premium models (Seedance 2.x, some Veo/Sora tiers, 1080p) may be Plus/Ultra only.
- Reported per-clip costs: Seedance 2.0 5 s **720p ≈ 30 credits / 1080p ≈ 60 credits**. Other listings show ~10 credits (Sora 2, 720p) and ~29 credits (Veo 3.1). These vary and change often.

### 5.3 Estimate (assumes about 1.5 takes per approved clip)
| Package | Clips | Generations | @10 cr | @30 cr |
|---|---|---|---|---|
| **P1 (recommended start):** 01–03 at 16:9 + 01–03 at 9:16 | 6 | ~9 | ~90 | ~270 |
| + P2: 04, 05 (16:9) | 2 | ~3 | ~30 | ~90 |
| + P3: 06, 07 (16:9) | 2 | ~3 | ~30 | ~90 |
| **Total** | 10 | ~15 | **~150** | **~450** |
Plus keyframe stills if done image-first (cheap; confirm the per-image cost in your dashboard). The YouTube teaser (08) costs **0 credits** because it is edited from the P1/P2 clips.

### 5.4 Recommendation
1. **Image-first:** generate 1–2 stills per shot on the cheapest Starter image model, approve them, then animate **only approved frames** (image-to-video). This keeps most of the cost on cheap iterations.
2. **Video model:** use the cheapest Starter-unlocked image-to-video model (likely a *Seedance Fast/Lite-class* model) at **720p, 5 s**. The web slots are ≤ 410 px tall, so 1080p wastes credits. If needed, upscale the 16:9 YouTube teaser in post.
3. **Stretch length for free:** ping-pong or crossfade loops in ffmpeg rather than generating 10 s clips.
4. **Generate 9:16 natively** only for the 3 Reels. Do not crop 16:9 to 9:16, because it loses about 68% of the frame.
5. Start with **P1 only (~90–270 credits)**. On a 200–270-credit Starter plan that may use the whole month, so we re-assess before P2/P3.

---

## 6. Technical integration plan (after approval, on this branch)

**Files and encoding**
- `assets/media/<shot>-w.mp4` (H.264, 1280×720, CRF ~26, no audio, target ≤ 1.2 MB / 5 s), `<shot>-w.webm` (VP9/AV1), and `<shot>-poster.webp` (first frame, ≤ 40 KB).
- Repo budget: about 10 clips × 2 codecs ≈ 25 MB. That is fine for GitHub Pages (1 GB soft limit). Reels and the YouTube master are **not committed**; they are delivered separately.

**Markup** (inside existing slots, keeping the CSS art as the fallback):
```html
<div class="creative-art motion-art" aria-hidden="true">
  <video class="slot-video" muted loop playsinline preload="none"
         poster="assets/media/01-poster.webp" data-src-mp4="assets/media/01-w.mp4" data-src-webm="assets/media/01-w.webm"></video>
  <span class="motion-play">▶</span><span class="art-label">MOTION / 01</span>
</div>
```

**CSS** (append to `portfolio-v2.css`; no existing rules change):
`.slot-video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0;transition:opacity .6s}` `.slot-video.ready{opacity:1}`. Labels stay above via `z-index`.

**JS** (small addition to `portfolio-v2.js`):
- An IntersectionObserver injects `<source>`s and calls `play()` only while a clip is in view, and pauses it when off-screen.
- Skips video entirely when `prefers-reduced-motion: reduce` or `navigator.connection.saveData` is set, so the poster or CSS art shows instead.
- If anything fails, the page looks exactly as it does today.

**Guardrails and QA**
- Preserve nav, section order, copy, breakpoints and theme toggle. Verify both themes at 1440 / 1080 / 860 / 560 / 375 px with Playwright screenshots before and after.
- Lighthouse: hero LCP unchanged (videos are below the fold and `preload="none"`), CLS = 0.
- Accessibility: decorative videos stay inside `aria-hidden` containers, with no autoplay sound.
- Workflow: work on this branch → preview locally → you review → **you approve the merge to `main`** (that merge is the production deploy).

---

## 7. Approval gates
1. ☐ Confirm the target repo (`zohreh-barmaki-studio`) and the meaning of "horizontal scrolling" (§1.4).
2. ☐ Send your Higgsfield Starter balance, unlocked models and the per-clip costs shown (§5.1).
3. ☐ Approve the shot list and prompts (edit freely).
4. ☐ Approve the credit spend for P1 (I will re-quote using your real numbers first).
5. ☐ Approve code integration on this branch.
6. ☐ Approve the merge to `main` / production.
