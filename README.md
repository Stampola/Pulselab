# Pulselab — Web design + SEO studio

A production-ready, bilingual (Thai/English) agency site with a built-in admin CMS.
Vanilla HTML/CSS/JS — deploys anywhere (Cloudflare Pages, Netlify, any static host) with no build step.

---

## What's inside

```
WEB-Create/
├── index.html               → Home (hero, services, packages, portfolio, testimonials, FAQ)
├── packages.html            → Detailed packages + comparison table
├── portfolio.html           → Case-study grid + spotlight
├── about.html               → Story, values, team, stats
├── contact.html             → Inquiry form (Web3Forms + DataStore + thank-you redirect)
├── privacy.html             → PDPA-compliant privacy policy (TH/EN)
├── terms.html               → Terms of service (TH/EN)
├── pdpa.html                → PDPA data-subject rights notice (TH/EN)
├── thank-you.html           → Post-submit confirmation
├── 404.html                 → Custom error page (bilingual)
├── admin/
│   ├── login.html           → Demo auth (replace before production)
│   ├── dashboard.html       → KPI charts + recent activity
│   ├── packages.html        → Edit prices / visibility
│   ├── content.html         → Edit hero, stats, testimonials, SEO meta
│   ├── leads.html           → Manage contact submissions + CSV export
│   ├── portfolio.html       → Add / edit / delete projects
│   └── settings.html        → Contact info, social links, data export
├── assets/
│   ├── css/style.css        → Design system + futuristic neon dark theme
│   ├── css/admin.css        → Admin-only styles
│   ├── js/main.js           → Nav, theme, reveals, contact form, cookie banner
│   ├── js/i18n.js           → Full Thai + English dictionaries + I18nManager
│   ├── js/data.js           → Editable content store (localStorage backed)
│   └── img/favicon.svg, og-image.svg
├── _redirects               → Catch-all 404 (Netlify / Cloudflare Pages)
├── _headers                 → Security + cache headers
├── netlify.toml             → Netlify config mirror
├── robots.txt               → Block /admin, block AI training crawlers
├── sitemap.xml              → Sitemap for indexable pages
└── DEPLOY.md                → Deploy instructions (Cloudflare + Netlify)
```

---

## Quick start (local)

No build step. Open `index.html` or serve the folder:

```bash
python3 -m http.server 8000
# or
npx http-server . -p 8000
```

---

## Design tokens

| Token | Light mode | Dark mode (default) |
|---|---|---|
| Background | `#ffffff` | `#050714` (deep navy) |
| Surface | `#fafafa` | `#0D1224` |
| Text | `#0a0a0a` | `#E4ECFF` |
| Accent | `#378ADD` (electric blue) | `#3DA9FF` |
| Cyan highlight | — | `#00E5FF` |
| Violet glow | — | `#8B5CF6` |
| Font (Latin) | Inter | Inter + Space Grotesk (futuristic accent) |
| Font (Thai) | IBM Plex Sans Thai Looped | same |

Dark mode is default and includes neon glow effects, animated grid background, gradient orbs, and glass-morphism cards. Toggle to light via the moon icon.

---

## Features included

- Bilingual TH/EN (toggle persists per visitor; URL `?lang=en` supported)
- Light + Dark themes (`data-theme` attribute, persists)
- PDPA cookie consent banner (bilingual, i18n-aware)
- Privacy / Terms / PDPA pages (PDPA Thailand law-compliant)
- Custom admin dashboard (CRUD packages, content, portfolio, leads)
- 24-hour admin session timeout (auto-logout)
- Web3Forms contact form integration (free, 250/month) with DataStore backup
- Honeypot anti-spam field on contact form
- Scroll-triggered reveals via IntersectionObserver
- Magnetic buttons + custom cursor (desktop, respects `prefers-reduced-motion`)
- FAQ accordion with `aria-expanded`
- Smooth marquee + animated counters
- Schema.org `ProfessionalService` markup
- Open Graph + Twitter cards + canonical + hreflang
- Custom 404 page (bilingual)
- Security headers (`X-Frame-Options`, HSTS, CSP-friendly, etc.)
- Skip-to-content link (keyboard accessibility)
- Sitemap.xml + robots.txt + AI crawler blocking

---

## Before going live — checklist

1. **Web3Forms key:** edit `assets/js/main.js` line ~222, replace `YOUR_WEB3FORMS_ACCESS_KEY` with your real key (get one free at https://web3forms.com)
2. **Admin credentials:** edit `admin/login.html` `DEMO_CREDENTIALS` block — or replace with real auth (Supabase / Clerk / NextAuth)
3. **Company info:** swap placeholder address / phone / VAT in `privacy.html`, `terms.html`, `pdpa.html`
4. **Social URLs:** replace `facebook.com/pulselab`, `instagram.com/pulselab`, etc. with real handles (search "pulselab" in any HTML to find them)
5. **Portfolio images:** swap gradient placeholders in `assets/js/data.js`
6. **Team headshots:** update `about.html` team section
7. **Analytics:** add Google Analytics 4 script tag to `<head>` of every HTML file

See `DEPLOY.md` for hosting instructions.

---

## License

Use it however you want for your own agency.
