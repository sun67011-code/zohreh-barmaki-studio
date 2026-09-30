# Zohreh Barmaki — Digital Systems & Product Studio

Public portfolio, proposal and consultant website for an independent digital product and technology practice.

**Live site:** https://sun67011-code.github.io/zohreh-barmaki-studio/

## Positioning

The site presents a cross-functional consulting practice spanning:

- Product strategy and technical architecture
- Web and application engineering
- AI and workflow automation
- HealthTech and clinical-system thinking
- Technical SEO and performance
- Creative / editorial digital experiences
- Project delivery, embedded freelance and advisory engagements

## Selected work represented

- **Layegh Music** — live digital-exhibition / creative platform
- **Tehran Arrhythmia Center** — live multilingual specialist medical platform
- **Clinical Intelligence & Reporting System** — healthcare product architecture concept
- **AI & Automation Systems** — workflow and integration systems

Live work is explicitly distinguished from product concepts. No fabricated performance metrics are used.

## Stack

This production version is intentionally static-first:

- Semantic HTML
- Custom responsive CSS
- Vanilla JavaScript
- GitHub source control
- GitHub Pages deployment
- No framework runtime
- No database required for the public experience

The interactive project brief is generated locally in the browser and is not transmitted or stored.

## Structure

```
/
├─ index.html
├─ profile.html
├─ privacy.html
├─ 404.html
├─ site.webmanifest
├─ robots.txt
├─ sitemap.xml
├─ .nojekyll
└─ assets/
   ├─ site.css
   ├─ site.js
   └─ icon.svg
```

## Planned secure backend

The next infrastructure layer is designed for Supabase:

- `project_enquiries` — structured consultation requests
- Supabase Auth — optional client access
- Storage — proposal / project documents
- Edge Functions — notifications and controlled server-side integrations
- Row Level Security — client and admin data boundaries

Service-role credentials must never be shipped to browser code.

## Deployment

GitHub Pages deploys from:

```
main / (root)
```

The site uses relative asset paths so it works correctly from the repository Pages subpath and can later be moved to a custom domain without a framework migration.

## Local preview

```bash
python -m http.server 8080
```

Then open `http://localhost:8080`.

## Privacy

The current site does not store project brief inputs. See `privacy.html` for the public privacy statement.
