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
├─ platform.html
├─ 404.html
├─ site.webmanifest
├─ robots.txt
├─ sitemap.xml
├─ .nojekyll
└─ assets/
   ├─ site.css
   ├─ site.js
   ├─ platform.css
   ├─ platform.js
   └─ icon.svg
```

## Supabase consulting platform

The Supabase backend is now live and includes:

- `project_enquiries` lead intake
- secure Edge Function validation and rate limiting
- authenticated `platform.html` workspace
- staff dashboard and lead qualification
- lead → client/project conversion
- clients, projects and memberships
- milestones and project health
- project updates with client/internal visibility
- proposal records
- project document/link register
- project messaging
- activity logging
- explicit RLS denial policies for direct browser table access

The browser never receives a service-role credential. See `docs/business-platform.md` for the architecture.

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
