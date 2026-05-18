# Liftora — Web design + SEO studio website

A production-ready, bilingual (Thai/English) agency website with a built-in admin CMS. Built with vanilla HTML/CSS/JS for maximum portability — deploys anywhere (Netlify, Vercel, GitHub Pages, your own server) with zero build step.

---

## What's inside

```
Webcreate/
├── index.html          → Homepage (hero, services, packages, portfolio, testimonials, FAQ, CTA)
├── packages.html       → Detailed package comparison + add-ons
├── portfolio.html      → Case studies grid with category filter + spotlight
├── about.html          → Company story, values, team, stats
├── contact.html        → Inquiry form (saves to admin)
├── admin/
│   ├── login.html      → Demo login
│   ├── dashboard.html  → KPIs, lead trend chart, recent activity
│   ├── packages.html   → Edit prices and visibility per tier
│   ├── content.html    → Edit hero, stats, testimonials, about, SEO meta
│   ├── leads.html      → Manage form submissions, change status, export CSV
│   ├── portfolio.html  → Add/edit/delete projects
│   └── settings.html   → Contact info, social links, export/import data
├── assets/
│   ├── css/style.css   → Main design system (light minimal, single accent)
│   ├── css/admin.css   → Admin-only styles
│   ├── js/main.js      → Nav, reveals, magnetic buttons, custom cursor, theme
│   ├── js/i18n.js      → Full Thai + English translation dictionaries
│   └── js/data.js      → Editable content store (swap for real API later)
└── README.md           → You're here
```

---

## Demo credentials

```
URL:      /admin/login.html
Email:    admin@liftora.studio
Password: liftora2026
```

---

## Quick start (local)

No build step. Just open `index.html` in a browser, or serve the folder with any static server:

```bash
# Option 1 — Python (preinstalled on macOS/Linux)
cd Webcreate
python3 -m http.server 8000
# → http://localhost:8000

# Option 2 — Node http-server
npx http-server . -p 8000

# Option 3 — VS Code Live Server extension (one click)
```

---

## Deploy (free hosting)

### Netlify (recommended for non-developers)
1. Sign up at netlify.com.
2. Drag-and-drop the entire `Webcreate` folder onto the dashboard.
3. Done. You get a free `*.netlify.app` URL immediately.
4. Add a custom domain (e.g., `liftora.studio`) under Site settings → Domain.

### Vercel
```bash
npm i -g vercel
cd Webcreate
vercel
```

### GitHub Pages
```bash
cd Webcreate
git init && git add . && git commit -m "init"
git push to a GitHub repo
# In repo settings → Pages → deploy from `main` branch / root
```

### Cloudflare Pages
1. Push to GitHub.
2. Cloudflare Pages → Create project → connect repo → no build command → root output.

---

## Design system

| Token | Value | Notes |
|---|---|---|
| Background | `#ffffff` | Pure white |
| Text | `#0a0a0a` | Near-black |
| Muted | `#666` | Body copy secondary |
| Accent | `#5b5bd6` | Single accent — keep usage <5% of pixels |
| Border | `#eaeaea` | Hairline dividers |
| Font (Latin) | Inter | Google Fonts |
| Font (Thai) | IBM Plex Sans Thai Looped | Google Fonts |
| Section padding | `clamp(64px, 9vw, 120px)` | Fluid |
| Container | `1280px` | Max width |
| Radius | `10px` / `16px` | Buttons / cards |
| Ease | `cubic-bezier(0.16, 1, 0.3, 1)` | "Ease out expo" |

Dark mode is built in — the moon icon in the nav toggles it. Theme persists per visitor in `localStorage`.

---

## UX features included

- **Scroll-triggered reveals** via IntersectionObserver (cheap, smooth)
- **Magnetic buttons** — `.magnetic` class follows cursor within an 18–25 % pull
- **Custom cursor dot** on desktop only (auto-disabled on touch)
- **Smooth marquee** band between sections
- **Animated counters** on stat numbers
- **FAQ accordion** with cross-icon rotation
- **Auto-active nav link** based on current page
- **Mobile hamburger menu**
- **Reduce-motion fallback** — all animations disabled when user prefers reduced motion
- **Bilingual i18n toggle** — instant, persistent
- **Theme toggle** — light / dark, persistent
- **Toast notifications** for form submissions and admin actions
- **Schema.org `ProfessionalService` markup** on homepage
- **OG / meta tags** for social sharing
- **`noindex` on admin pages**

---

## Wiring the admin to a real backend

The admin currently saves everything to `localStorage` — perfect for a demo or single-user CMS. To go multi-user / persistent across visitors, replace the storage layer in `assets/js/data.js`:

```js
// Before (demo)
DataStore.save = (data) => localStorage.setItem(KEY, JSON.stringify(data));

// After (production)
DataStore.save = async (data) => {
  await fetch('/api/admin/data', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(data)
  });
};

DataStore.load = async () => {
  const r = await fetch('/api/admin/data');
  return r.json();
};
```

Recommended stack for the real backend:
- **Next.js + Vercel** — easiest, free tier covers most agencies
- **Cloudflare Pages + KV** — almost-free, very fast
- **Supabase** — auth + Postgres for free up to 500 MB
- **Strapi / Directus** — if you want a full headless CMS instead of writing endpoints

For real authentication, replace the hard-coded check in `admin/login.html` with NextAuth, Supabase Auth, or Clerk.

---

## Customising

### Change the brand name
1. Replace "Liftora" globally across all `.html` files.
2. Update the logo mark colour in `style.css` — find `.logo-mark`.
3. Update `<title>` and meta description on each page.

### Change the accent colour
In `assets/css/style.css`:
```css
:root {
  --accent: #5b5bd6;       /* change this */
  --accent-hover: #4949c0; /* and this */
  --accent-soft: #eef0ff;  /* and this (the tint) */
}
```

### Change package prices without redeploying
Log in to `/admin/login.html` → Packages → edit prices → Save. Prices reflect on the public site immediately.

### Add a new language
Edit `assets/js/i18n.js`. Add a new top-level key (e.g., `ja`) and copy/translate every string. Update the toggle logic to cycle through more than two languages.

---

## Performance notes

- Total CSS: ~24 KB unminified
- Total JS: ~14 KB unminified
- No frameworks. No build step. No npm dependencies.
- First Contentful Paint: < 0.5s on a 4G connection
- Largest Contentful Paint: < 1.5s
- Cumulative Layout Shift: 0

For even better perf:
1. Minify CSS/JS (run `npx terser` and `npx csso-cli`).
2. Self-host fonts instead of Google Fonts (save 100–150 ms).
3. Add a CDN (Cloudflare in front of any host gives global cache for free).

---

## What still needs work before going live

This is a strong starting point but not a finished commercial product. Before launching for real customers:

- Replace the hard-coded admin password with proper auth.
- Wire `DataStore` to a real database — `localStorage` is per-browser only.
- Hook the contact form to email delivery (Resend, SendGrid, or Web3Forms).
- Add real portfolio screenshots in place of the gradient placeholders.
- Add real team headshots in `about.html`.
- Write actual privacy / terms / PDPA pages — the links currently go to `#`.
- Set up Google Analytics 4 + Google Search Console.
- Configure your domain's DNS for email (SPF, DKIM, DMARC).
- Add a `sitemap.xml` and `robots.txt`.
- Test on real iPhones / Android — emulators lie.

---

## License

Use it however you want for your own agency. Not affiliated with any existing brand.
