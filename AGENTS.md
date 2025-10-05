# AGENTS.md

This project is a boutique short-term rental marketing website built with Next.js 15, featuring static property listings, third-party booking integration (Hospitable), and premium UI components.

## Architecture Overview

Single deployable frontend application:
- **Frontend**: Next.js 15 App Router with React 19, Shadcn UI, and Hospitable booking widget
- **Data Layer**: Static TypeScript data models (no backend API)
- **Deployment Target**: Vercel (planned)

## Development Environment

### Quick Start Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

### Testing

```bash
# No test suite currently configured
# Planned: Playwright for e2e critical flows (per PLANNING.md)
```

## Core Technologies

- **Framework**: Next.js 15.2.4 with App Router
- **UI Library**: Radix UI (25+ primitives) + Shadcn UI pattern
- **Styling**: Tailwind CSS with custom theme + tailwindcss-animate
- **Special Effects**: Magic UI components (shimmer, border beams, confetti)
- **Animation**: Framer Motion 12
- **Forms**: React Hook Form + Zod validation
- **Icons**: Lucide React
- **Booking**: Hospitable widget (third-party CDN script)
- **Database**: None (static data)

## Code Style

- **TypeScript**: Strict mode disabled (next.config.mjs), interfaces over types
- **React**: Functional components with hooks, `"use client"` for interactivity
- **File size**: ≤ 500 LOC per file (per PLANNING.md)
- **Styling**: Tailwind utility-first, extract UI primitives for reuse
- **Line length**: No strict limit (use Prettier when configured)
- **Comments**: Minimal unless necessary for business logic

## Environment Configuration

Create `.env.local` for local development (see TASK.md for `.env.example` creation):
```bash
NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_ANALYTICS_ID=
# Future: HOSPITABLE_API_KEY, HOSPITABLE_ACCOUNT_ID (Phase 2)
```

## Key Integration Points

- **Hospitable Widget**: Loaded via CDN script in `app/layout.tsx`, embedded in room detail pages
- **Static Data → Components**: Direct imports from `app/data/units.ts` and `app/data/categories.ts`
- **Routing**: File-based App Router (`/rooms/[slug]/page.tsx` for dynamic routes)
- **UI Components**: Shadcn UI pattern (copy to `/components/ui` for customization)

## Security

- Never commit secrets (`.env*` files ignored via `.gitignore`)
- Use environment variables for API keys
- Validate forms with Zod schemas
- Hospitable widget loaded from trusted CDN only

## Documentation

Project planning and task tracking:
- **TASK.md**: Active work and backlog
- **PLANNING.md**: Architecture vision, conventions, roadmap
- **CLAUDE.md**: References Archon rules and agents template
- **.claude/archon_rules.md**: Task management workflow (Archon MCP, no TodoWrite)

## Common Issues

- **Build errors ignored**: `next.config.mjs` has `ignoreBuildErrors: true` for TypeScript/ESLint
- **Image optimization disabled**: `images.unoptimized: true` in `next.config.mjs`
- **Hospitable widget z-index**: Global override (`z-index: 2147483647`) in `globals.css`
- **Missing images**: Some units have empty `images: []` arrays (placeholders)
- **Port conflicts**: Default Next.js dev server on port 3000

## Project-Specific Patterns

### Adding a New Room/Unit
1. Add entry to `UNITS` array in `app/data/units.ts`
2. Include: slug, title, category, pricing, specs, hospitable_id, images
3. Dynamic route `/rooms/[slug]` will auto-generate the page

### Adding a New UI Component
1. For Shadcn UI primitives: Copy to `/components/ui/[component-name].tsx`
2. For business components: Create in `/app/components/[ComponentName].tsx`
3. Use `"use client"` directive if component needs interactivity

### Styling Guidelines
- Use Tailwind utilities first
- Custom colors: `tan` (#D2B48C), `primary` (#1a1a1a)
- Custom animations: `fade-in`, `fade-in-delay`, `fade-in-delay-2`
- Magic UI effects: `ShimmerButton`, `BorderBeam`, `MagicCard`, `NumberTicker`

### Data Management
- No API calls or state management library
- All data in `/app/data/*.ts` files
- Import directly: `import { UNITS } from "@/app/data/units"`
- Client state via `useState`/`useEffect` in `"use client"` components

## Current Phase

**Phase 1**: Marketing site polish (per PLANNING.md)
- ✅ Frontend built (v0 export migrated)
- 🔄 Active tasks in TASK.md (git setup, data migration, SEO, contact form)
- 📋 Planned: Vercel deployment, analytics, image optimization

**Phase 2** (Future): Read-only availability, deep links to Hospitable

**Phase 3** (Future): Lead capture, simple CMS integration
