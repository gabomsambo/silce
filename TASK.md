# TASK.md — Active Work & Backlog

**Today:** 2025-08-12

## Active
- [ ] Initialize git repo, commit v0 export
- [ ] Install deps and run locally (`npm i && npm run dev`)
- [ ] Create `/data/properties` and migrate property JSON
- [ ] Add SEO baseline (title/description per page, sitemap, robots)
- [ ] Replace hardcoded copy with config in `/data/site.ts`
- [ ] Add contact form (static → email service like Formspree) 
- [ ] Configure analytics (Plausible/GA4 env var controlled)
- [ ] Set up Vercel project
- [ ] Review environment secrets handling and add `.env.example`

## Discovered During Work
- [ ] Image optimization pass (Next/Image + srcset)
- [ ] Component extraction: `PropertyCard`, `Gallery`, `AmenitiesList`
- [ ] Accessibility review (aria labels, keyboard nav)
- [ ] Basic tests for critical routes

## Backlog
- [ ] Availability widget (read‑only) pulling from Hospitable
- [ ] Saved favorites (localStorage)
- [ ] Blog/Guides for SEO
- [ ] Admin content workflow

## Done
- [x] Add ethical `.gitignore` for Next.js/Node on macOS
  - Ignore: `.next`, `node_modules`, build outputs, logs, caches, editor/OS cruft
  - Protect secrets: ignore `.env*` but keep `!.env.example` for onboarding
  - Do not ignore user content like `public/` images to preserve assets in repo
- [ ] (placeholder)
