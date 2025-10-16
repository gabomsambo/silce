name: "Coastal Gradient Backgrounds Implementation"
description: |
  Implement soft coastal gradients (Ocean Sunrise + Coastal Mist aesthetics) across all pages to replace monotonous white backgrounds with beachy Airbnb-inspired visual depth.

---

## Goal

Transform the Silver STR website from all-white backgrounds to sophisticated coastal gradients that evoke beach vacation vibes using ocean blues, teals, sandy ambers, and soft mist tones.

### Feature Goal
Replace 99% of white/gray backgrounds with carefully crafted coastal gradient combinations that maintain readability, enhance visual hierarchy, and create a premium beachy aesthetic similar to high-end Airbnb vacation rentals.

### Deliverable
- 8 main pages updated with coastal gradient backgrounds
- 35+ components updated with coastal-tinted sections and cards
- Custom Tailwind color palette with 5 coastal colors
- Systematic gradient patterns: Ocean Sunrise (hero sections), Coastal Mist (content sections), Tropical Waters (rooms page), Sunset Beach (CTAs)
- Maintained WCAG AA contrast ratios (4.5:1 minimum for text)

### Success Criteria
- [x] Visual transformation: Immediate "beachy" aesthetic without overwhelming content
- [x] Readability maintained: All text meets WCAG contrast requirements
- [x] Performance: No paint time degradation on mobile devices
- [x] Consistency: All pages use harmonious gradient palette
- [x] Working booking widget: Hospitable widget z-index and overlays unaffected
- [x] MagicCard compatibility: Gold hover effects work with coastal backgrounds

---

## Why

### Business Value
- **Brand differentiation**: Stand out from generic white STR websites
- **Emotional connection**: Coastal gradients trigger beach vacation associations → higher booking intent
- **Premium positioning**: Sophisticated gradients signal boutique quality vs. budget listings
- **Visual hierarchy**: Gradients guide eye flow from hero → rooms → CTA

### User Impact
- Guests immediately feel "vacation mode" when landing on site
- Reduced visual fatigue from harsh white backgrounds
- Better content separation with gradient-defined sections
- More engaging browsing experience → longer time on site

### Integration with Existing Features
- Enhances MagicCard hover effects (warm gold on cool coastal creates contrast)
- Complements existing tan (#D2B48C) brand color (sandy beach connection)
- Works with dark footer transition (coastal → deeper ocean blue → primary black)
- Maintains Hospitable widget visibility and z-index hierarchy

### Problems This Solves
- **Current issue**: 99% white backgrounds feel sterile, generic, uninspired
- **User feedback**: "Needs more life and personality" (per user request)
- **Competitive gap**: High-end Airbnb listings use subtle coastal tones
- **Brand misalignment**: Website doesn't visually communicate "10 min to beach" location benefit

---

## What

### User-Visible Behavior

**Before**: All pages have pure white backgrounds with occasional gray-50 sections. Feels like a generic business site.

**After**: Pages feature soft coastal gradients:
- **Homepage**: Ocean sunrise (sky blue → teal → sand) top-to-bottom gradient
- **Rooms Page**: Tropical waters (cyan → teal → emerald) for energy
- **About Page**: Coastal mist (blue-gray → white → tan) for sophistication
- **Room Detail Pages**: Light sand-to-white fade (doesn't compete with property photos)
- **CTA/Newsletter Sections**: Sunset beach (peachy orange → amber → tan)

**Visual Experience**:
- Hero sections: Radial gradients with top focal point (draws eye to headline)
- Content sections: Subtle linear gradients (5-15% opacity for professionalism)
- Cards: White/cream with increased shadows to "pop" from gradient backgrounds
- Navbar: Very subtle coastal tint with backdrop-blur (maintains readability)

### Technical Requirements

1. **Tailwind Config Extension** (`tailwind.config.ts`):
   - Add 5 coastal colors to theme
   - Create custom gradient utilities for reusable patterns

2. **Global CSS Updates** (`app/globals.css`):
   - Define CSS variables for coastal palette
   - Add gradient utility classes for common patterns
   - Optional: Update HSL values for `--background` and `--muted`

3. **Page File Updates** (8 files):
   - Replace `bg-white` on `<main>` wrappers with coastal gradients
   - Different gradient per page type (homepage ≠ rooms ≠ about)

4. **Component Updates** (35+ files):
   - Section backgrounds: Linear gradients with low opacity
   - Hero sections: Enhanced radial gradients
   - Cards: Coastal tints with increased shadows
   - Forms: Glassmorphism (backdrop-blur + coastal tint)

5. **Accessibility Compliance**:
   - Maintain 4.5:1 contrast for <18pt text
   - Maintain 3:1 contrast for ≥18pt text
   - Test with WebAIM Contrast Checker

### Success Criteria (Measurable)

- [ ] All 8 pages have distinct coastal gradients (no more `bg-white` on page wrappers)
- [ ] All text passes WCAG AA contrast checks (test with Chrome DevTools)
- [ ] Hospitable booking widget calendar pops over all gradients (z-index verified)
- [ ] Mobile performance: Lighthouse score ≥ 90 (no regression from gradients)
- [ ] Screenshot comparison: Visual difference between before/after is immediate and positive
- [ ] MagicCard hover effects still visible on coastal backgrounds
- [ ] No console errors or styling conflicts
- [ ] Print styles: Gradients removed for print media (no ink waste)

---

## All Needed Context

### Documentation & References

```yaml
# MUST READ - Core Research Documents

- docfile: PRPs/ai_docs/coastal-gradients-research.md
  why: |
    Complete coastal color palettes with hex codes, Tailwind implementations,
    accessibility guidelines (WCAG), color psychology for vacation rentals,
    SVG wave patterns. Read sections 1-3 fully.
  critical: |
    - Section 1.1: Beach Gradient palette (Han Blue → Pearl Aqua → Bone)
    - Section 2.4: Glassmorphism patterns for cards
    - Section 3: Next.js performance best practices (use CSS gradients, not images)
    - Section 4: WCAG contrast requirements (4.5:1 minimum)

- docfile: PRPs/ai_docs/tailwind-gradient-reference.md
  why: |
    Complete Tailwind CSS gradient syntax, opacity modifiers, backdrop-blur combinations,
    responsive gradients, dark mode patterns, browser compatibility.
  critical: |
    - Section 1: Linear gradient directions (bg-gradient-to-b, bg-gradient-to-br)
    - Section 2: Radial gradients with custom positioning
    - Section 5: Opacity scale recommendations (/10 through /50 for subtlety)
    - Section 6: backdrop-blur-sm + gradient combinations

- docfile: PRPs/planning/coastal-gradient-backgrounds-analysis.md
  why: |
    Complete file inventory (57+ files), current styling patterns, specific line numbers
    for every background class, existing gradient patterns to reference, component hierarchy.
  critical: |
    - Section 1: Complete file inventory with line numbers
    - Section 2.D: Existing gradient patterns (DiscoverLocationSection line 50 is PRIMARY REFERENCE)
    - Section 6: Component tier hierarchy (implementation order)
    - Section 7: 10 potential challenges with solutions
    - Section 8: Recommended implementation patterns with before/after code

# Core Codebase Files

- file: app/components/DiscoverLocationSection.tsx
  line: 50
  why: |
    PRIMARY REFERENCE - Only major gradient in codebase: bg-gradient-to-b from-muted/30 to-white
    This pattern works well and should be adapted with coastal colors.
  pattern: "Section wrapper with vertical gradient, low opacity top color"

- file: app/components/BoutiqueNewsletterSignup.tsx
  lines: 86, 90, 114
  why: |
    Shows diagonal gradient pattern (bg-gradient-to-br) and glassmorphism (bg-white/95 backdrop-blur-sm).
    Use as reference for newsletter section coastal updates.
  pattern: "Diagonal gradient + backdrop-blur on floating cards"

- file: app/components/Navbar.tsx
  line: 31
  why: |
    Conditional backdrop-blur based on scroll state. Critical for navbar coastal tint update.
    Must maintain readability while adding very subtle coastal tint (2-5% opacity max).
  gotcha: "Scrolled navbar is bg-white shadow-lg. Not-scrolled is bg-white/95 backdrop-blur-sm"

- file: tailwind.config.ts
  lines: 47-49
  why: |
    Current brand colors (primary #1a1a1a, tan #D2B48C, muted #F5F5F5).
    Need to ADD coastal colors here, not replace existing ones.
  pattern: "Extend colors object, don't override HSL-based system colors"

- file: app/globals.css
  lines: 5-13, 15-27
  why: |
    Global base styles and custom utilities. Add coastal CSS variables and gradient utilities here.
  pattern: "@layer base for variables, @layer utilities for gradient classes"

# External Resources

- url: https://tailwindcss.com/docs/gradient-color-stops
  section: "Using custom values"
  why: "Syntax for arbitrary gradient colors with hex values: from-[#3E68BD]"

- url: https://tailwindcss.com/docs/backdrop-blur
  why: "backdrop-blur-sm syntax for glassmorphism effects on cards and navbar"

- url: https://webaim.org/resources/contrastchecker/
  why: "Test text contrast ratios on gradient backgrounds. Must pass WCAG AA (4.5:1)"

- url: https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html
  why: "WCAG 2.1 Level AA contrast requirements (4.5:1 for small text, 3:1 for large)"
```

### Current Codebase Tree (Key Files)

```
silce/
├── app/
│   ├── page.tsx                    # Homepage - P0 (line 12: bg-white)
│   ├── layout.tsx                  # Root layout (Hospitable script)
│   ├── globals.css                 # Global styles, add coastal CSS here
│   ├── rooms/
│   │   ├── page.tsx                # Rooms listing - P0 (line 19: bg-white)
│   │   └── [slug]/page.tsx         # Room detail - P1 (line 44: bg-white)
│   ├── about/page.tsx              # About - P0 (line 36: bg-white)
│   ├── reviews/page.tsx            # Reviews - P0 (line 9: bg-white, line 13: gradient)
│   ├── components/
│   │   ├── Hero.tsx                # Homepage hero (image gradient overlay)
│   │   ├── DiscoverLocationSection.tsx  # PRIMARY GRADIENT REFERENCE (line 50)
│   │   ├── BoutiqueNewsletterSignup.tsx # Diagonal gradient + glassmorphism
│   │   ├── EnhancedGuestExperiences.tsx # Inverted gradient (line 127)
│   │   ├── Navbar.tsx              # Backdrop-blur navbar (line 31)
│   │   ├── Introduction.tsx        # White section (line 3)
│   │   ├── RoomsHeroSection.tsx    # Gray-to-white gradient (line 3)
│   │   ├── AboutHeroSection.tsx    # Gray-to-white gradient (line 3)
│   │   ├── PhilosophySection.tsx   # White section (line 32)
│   │   ├── FounderSection.tsx      # Gray-50 section (line 5)
│   │   ├── LocationSection.tsx     # Gray-50 with white cards (line 5, 28, 34, 40, 46)
│   │   ├── AmenityGrid.tsx         # Gray-50 with white cards (line 16, 27)
│   │   ├── Testimonials.tsx        # White section with muted card (line 43, 51)
│   │   ├── RoomCard.tsx            # No explicit bg (inherits from parent)
│   │   ├── FeaturedRoomCard.tsx    # White card (line 26)
│   │   ├── ReviewCard.tsx          # White card with border (line 17)
│   │   └── Footer.tsx              # Dark bg-primary (DO NOT CHANGE)
│   └── data/
│       ├── units.ts                # Room data (no styling)
│       └── categories.ts           # Category metadata (no styling)
├── components/ui/                  # Shadcn components (low priority, inherit CSS vars)
├── tailwind.config.ts              # ADD coastal colors here (lines 47-49 area)
└── public/                         # Images (no changes)
```

### Desired Changes - Coastal Color System

```typescript
// tailwind.config.ts - ADD to colors object

colors: {
  // EXISTING - DO NOT REMOVE
  primary: "#1a1a1a",
  tan: "#D2B48C",
  muted: "#F5F5F5",
  // ... HSL-based system colors (background, foreground, card, etc.)

  // NEW - Coastal Palette
  "coastal-blue": "#0EA5E9",      // Ocean blue (sky-500)
  "coastal-teal": "#14B8A6",      // Coastal teal (teal-500)
  "coastal-aqua": "#22D3EE",      // Bright aqua (cyan-400)
  "coastal-sand": "#FCD34D",      // Sandy yellow (amber-300)
  "coastal-mist": "#F0F9FF",      // Soft blue-gray (sky-50)
  "coastal-sunrise": "#FB923C",   // Peachy sunrise (orange-400)
  "coastal-foam": "#A5F3FC",      // Seafoam (cyan-200)
  "coastal-dune": "#FDE68A",      // Light sand (amber-200)
}
```

```css
/* app/globals.css - ADD after existing animations */

@layer utilities {
  /* Ocean Sunrise - Homepage gradient */
  .bg-ocean-sunrise {
    background: linear-gradient(
      to bottom,
      hsl(199, 89%, 95%),      /* sky-100 */
      hsl(192, 82%, 90%) 50%,   /* cyan-100 */
      hsl(43, 96%, 90%)         /* amber-100 */
    );
  }

  /* Coastal Mist - Content sections */
  .bg-coastal-mist {
    background: linear-gradient(
      to bottom right,
      hsl(200, 100%, 97%) 0%,   /* sky-50 */
      hsl(0, 0%, 100%) 60%,     /* white */
      hsl(39, 67%, 88%)         /* tan/10 */
    );
  }

  /* Tropical Waters - Rooms page */
  .bg-tropical-waters {
    background: linear-gradient(
      to bottom right,
      hsl(188, 94%, 85%) 0%,    /* cyan-200 */
      hsl(173, 58%, 78%) 50%,   /* teal-300 */
      hsl(158, 64%, 82%)        /* emerald-200 */
    );
  }

  /* Sunset Beach - CTAs */
  .bg-sunset-beach {
    background: linear-gradient(
      to right,
      hsl(27, 96%, 85%) 0%,     /* orange-200 */
      hsl(38, 92%, 75%),        /* amber-300 */
      hsl(39, 67%, 75%)         /* tan light */
    );
  }

  /* Sand to White - Room detail pages */
  .bg-sand-fade {
    background: linear-gradient(
      to bottom,
      hsl(0, 0%, 100%) 0%,      /* white */
      hsl(188, 94%, 97%)        /* cyan-50 */
    );
  }

  /* Radial Sunrise - Hero focal point */
  .bg-radial-sunrise {
    background: radial-gradient(
      circle at top,
      hsl(199, 89%, 92%),       /* sky-200 */
      hsl(192, 82%, 85%),       /* cyan-200 */
      transparent
    );
  }
}
```

### Known Gotchas of Codebase & Library Quirks

```typescript
// CRITICAL: Next.js 15 Image component
// Images use unoptimized: true in next.config.mjs
// Gradient backgrounds won't conflict with Next Image backgrounds
// Pattern: Apply gradient to wrapper <div>, not directly on Image parent

// CRITICAL: Hospitable Widget Z-Index
// Global CSS (lines 40-86) forces z-index: 2147483647 !important on all hospitable elements
// Gradients applied to <main> or <section> won't interfere
// NEVER apply backdrop-filter to containers holding hospitable widget

// CRITICAL: MagicCard Component
// Uses gold/tan radial gradient for hover effects (--tw-gradient-stops)
// Coastal backgrounds ENHANCE this effect (warm/cool contrast)
// DO NOT change MagicCard gradientColor prop - keep default gold

// CRITICAL: Tailwind HSL Color System
// Codebase uses HSL-based colors (--background, --foreground, --muted)
// DO NOT override these in @layer base - Shadcn components depend on them
// ADD coastal colors separately, don't replace system colors

// CRITICAL: Backdrop-blur Browser Support
// backdrop-blur not supported in IE11 or older Safari (<12.1)
// Next.js default browserslist is modern, so safe to use
// Fallback: backdrop-blur degrades gracefully (just no blur effect)

// CRITICAL: Text Contrast
// Current gray-600 text may fail WCAG on some gradients
// Test every gradient + text combo with WebAIM checker
// Solution: Darken to gray-700 or add semi-transparent white overlay

// CRITICAL: Print Styles
// Gradient backgrounds will waste ink if printed
// Add @media print { .bg-ocean-sunrise { background: white !important; } }
// Or use Tailwind: print:bg-white on all page wrappers

// LIBRARY QUIRK: Tailwind gradient-to-b
// In Tailwind v3.x: bg-gradient-to-b (current)
// In Tailwind v4.x: bg-linear-to-b (renamed)
// Codebase uses v3.4.17 - use bg-gradient-to-b syntax

// LIBRARY QUIRK: Radial Gradients
// Radial gradients require arbitrary values in Tailwind:
// bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-sky-200 to-cyan-400
// Note underscore separators and commas in arbitrary value
```

---

## Implementation Blueprint

### Phase 0: Foundation Setup (No Visual Changes Yet)

**Objective**: Set up coastal color system and utilities without breaking existing styles.

#### Task 0.1: Extend Tailwind Config with Coastal Colors

**File**: `tailwind.config.ts`
**Lines to modify**: 47-49 (colors object)

```typescript
// FIND: (around line 47-49)
colors: {
  // ... existing Shadcn HSL colors ...
  primary: "#1a1a1a",
  tan: "#D2B48C",
  muted: "#F5F5F5",
},

// INJECT AFTER tan, muted (before closing brace):
  // Coastal Palette - Beach vacation aesthetic
  "coastal-blue": "#0EA5E9",      // Ocean blue (Tailwind sky-500)
  "coastal-teal": "#14B8A6",      // Coastal teal (Tailwind teal-500)
  "coastal-aqua": "#22D3EE",      // Bright aqua (Tailwind cyan-400)
  "coastal-sand": "#FCD34D",      // Sandy yellow (Tailwind amber-300)
  "coastal-mist": "#F0F9FF",      // Soft blue-gray (Tailwind sky-50)
  "coastal-sunrise": "#FB923C",   // Peachy sunrise (Tailwind orange-400)
  "coastal-foam": "#A5F3FC",      // Seafoam (Tailwind cyan-200)
  "coastal-dune": "#FDE68A",      // Light sand (Tailwind amber-200)
```

**Validation**: Run `npm run build` - should complete without errors.

#### Task 0.2: Add Coastal Gradient Utilities to Global CSS

**File**: `app/globals.css`
**Lines to modify**: After line 27 (after existing @layer utilities)

```css
// INJECT AFTER @layer utilities fadeIn animations (after line 27):

@layer utilities {
  /* === COASTAL GRADIENT UTILITIES === */

  /* Ocean Sunrise - Homepage hero and main sections */
  .bg-ocean-sunrise {
    background: linear-gradient(
      to bottom,
      hsl(199, 89%, 95%),      /* Light sky blue */
      hsl(192, 82%, 90%) 50%,   /* Soft cyan */
      hsl(43, 96%, 90%)         /* Pale amber */
    );
  }

  /* Coastal Mist - Subtle content sections */
  .bg-coastal-mist {
    background: linear-gradient(
      to bottom right,
      hsl(200, 100%, 97%) 0%,   /* sky-50 */
      hsl(0, 0%, 100%) 60%,     /* white center */
      hsl(39, 67%, 94%)         /* Very pale tan */
    );
  }

  /* Tropical Waters - Energetic rooms page */
  .bg-tropical-waters {
    background: linear-gradient(
      to bottom right,
      hsl(188, 94%, 85%) 0%,    /* Cyan-200 */
      hsl(173, 58%, 78%) 50%,   /* Teal-300 */
      hsl(158, 64%, 82%)        /* Emerald-200 */
    );
  }

  /* Sunset Beach - Warm CTA sections */
  .bg-sunset-beach {
    background: linear-gradient(
      to right,
      hsl(27, 96%, 85%) 0%,     /* Orange-200 */
      hsl(38, 92%, 75%),        /* Amber-300 */
      hsl(39, 67%, 75%)         /* Tan blend */
    );
  }

  /* Sand Fade - Subtle room detail pages */
  .bg-sand-fade {
    background: linear-gradient(
      to bottom,
      hsl(0, 0%, 100%) 0%,      /* White top */
      hsl(188, 94%, 97%) 70%    /* Cyan-50 bottom */
    );
  }

  /* Radial Sunrise - Hero focal point */
  .bg-radial-sunrise {
    background: radial-gradient(
      circle at top,
      hsl(199, 89%, 92%),       /* Sky-200 */
      hsl(192, 82%, 85%),       /* Cyan-200 */
      transparent 60%
    );
  }

  /* Print-friendly override */
  @media print {
    .bg-ocean-sunrise,
    .bg-coastal-mist,
    .bg-tropical-waters,
    .bg-sunset-beach,
    .bg-sand-fade,
    .bg-radial-sunrise {
      background: white !important;
    }
  }
}
```

**Validation**:
1. Run `npm run build` - should complete
2. Inspect in DevTools: New utility classes should exist
3. No visual changes yet (utilities not applied)

---

### Phase 1: Homepage Transformation (Immediate Visual Impact)

**Objective**: Update homepage (`app/page.tsx`) with Ocean Sunrise aesthetic. This is the proof-of-concept.

#### Task 1.1: Update Homepage Main Wrapper

**File**: `app/page.tsx`
**Line**: 12

```tsx
// FIND:
<main className="min-h-screen bg-white">

// REPLACE WITH:
<main className="min-h-screen bg-ocean-sunrise">
```

**Expected Result**: Homepage now has soft blue-to-cyan-to-amber gradient top-to-bottom.

#### Task 1.2: Update DiscoverLocationSection (Primary Reference)

**File**: `app/components/DiscoverLocationSection.tsx`
**Line**: 50

```tsx
// FIND:
<section className="py-24 px-4 bg-gradient-to-b from-muted/30 to-white">

// REPLACE WITH:
<section className="py-24 px-4 bg-gradient-to-b from-coastal-mist/40 via-white via-60% to-coastal-dune/20">
```

**Pattern**: Three-stop gradient - light blue-gray → white center → pale sand.

#### Task 1.3: Update Introduction Section

**File**: `app/components/Introduction.tsx`
**Line**: 3

```tsx
// FIND:
<section className="py-20 px-4 bg-white">

// REPLACE WITH:
<section className="py-20 px-4 bg-transparent">
```

**Why**: Let page-level gradient show through. Section doesn't need its own background.

#### Task 1.4: Update EnhancedGuestExperiences Section

**File**: `app/components/EnhancedGuestExperiences.tsx`
**Line**: 127

```tsx
// FIND:
<section className="py-24 px-4 bg-gradient-to-b from-white to-muted/30">

// REPLACE WITH:
<section className="py-24 px-4 bg-gradient-to-b from-coastal-foam/20 to-coastal-mist/30">
```

**Pattern**: Inverted coastal gradient - seafoam top → mist bottom.

#### Task 1.5: Update BoutiqueNewsletterSignup Gradient

**File**: `app/components/BoutiqueNewsletterSignup.tsx`
**Lines**: 86, 114

```tsx
// FIND (line 86 and 114):
className="bg-gradient-to-br from-tan/5 to-primary/5"

// REPLACE WITH:
className="bg-gradient-to-br from-coastal-sunrise/10 to-coastal-teal/5"
```

**Pattern**: Diagonal sunset gradient - peachy orange → teal.

**Also update glassmorphism card (line 90)**:

```tsx
// FIND (line 90):
<MagicCard className="relative p-8 bg-white/95 backdrop-blur-sm">

// REPLACE WITH:
<MagicCard className="relative p-8 bg-white/90 backdrop-blur-md">
```

**Why**: Slightly more transparent (95 → 90) and stronger blur (sm → md) for coastal bg visibility.

**Validation for Phase 1**:
1. Start dev server: `npm run dev`
2. Open http://localhost:3000
3. Visual check: Homepage should have visible blue → cyan → amber gradient
4. Sections should blend smoothly
5. Text should remain readable (check gray-600 on gradients)
6. MagicCard hover effects should still work
7. Hospitable widget (bottom of hero) should still overlay correctly

---

### Phase 2: Rooms Page (Tropical Waters Aesthetic)

**Objective**: Update rooms listing page with energetic cyan-teal-emerald gradient.

#### Task 2.1: Update Rooms Page Main Wrapper

**File**: `app/rooms/page.tsx`
**Line**: 19

```tsx
// FIND:
<main className="min-h-screen bg-white">

// REPLACE WITH:
<main className="min-h-screen bg-tropical-waters">
```

#### Task 2.2: Update RoomsHeroSection

**File**: `app/components/RoomsHeroSection.tsx`
**Line**: 3

```tsx
// FIND:
className="py-20 px-4 text-center bg-gradient-to-b from-gray-50 to-white"

// REPLACE WITH:
className="py-20 px-4 text-center bg-gradient-to-b from-coastal-aqua/15 to-transparent"
```

**Pattern**: Bright aqua fade → transparent (lets page gradient show).

#### Task 2.3: Update RoomsIntroduction Section

**File**: `app/components/RoomsIntroduction.tsx`
**Line**: 3

```tsx
// FIND:
<section className="py-12 px-4 text-center bg-white">

// REPLACE WITH:
<section className="py-12 px-4 text-center bg-transparent">
```

#### Task 2.4: Update AmenityGrid Section

**File**: `app/components/AmenityGrid.tsx`
**Line**: 16

```tsx
// FIND:
<section className="py-20 px-4 bg-gray-50">

// REPLACE WITH:
<section className="py-20 px-4 bg-gradient-to-b from-coastal-teal/10 to-coastal-foam/15">
```

**Also update amenity cards (line 27)**:

```tsx
// FIND:
className="bg-white rounded-2xl p-6 shadow-md text-center
  hover:shadow-xl transition-all duration-300 hover:scale-105"

// REPLACE WITH:
className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg text-center
  hover:shadow-xl transition-all duration-300 hover:scale-105"
```

**Why**: Cards now float with glassmorphism on tropical gradient.

**Validation for Phase 2**:
1. Navigate to /rooms
2. Visual check: Cyan-teal-emerald gradient visible
3. Room cards should have good contrast (white cards on gradient)
4. Category badges should pop
5. Amenity cards should have subtle glassmorphism

---

### Phase 3: About Page (Coastal Mist Aesthetic)

**Objective**: About page gets most sophisticated gradient - blue-gray mist.

#### Task 3.1: Update About Page Main Wrapper

**File**: `app/about/page.tsx`
**Line**: 36

```tsx
// FIND:
<main className="min-h-screen bg-white">

// REPLACE WITH:
<main className="min-h-screen bg-coastal-mist">
```

#### Task 3.2: Update AboutHeroSection

**File**: `app/components/AboutHeroSection.tsx`
**Line**: 3

```tsx
// FIND:
className="py-20 px-4 text-center bg-gradient-to-b from-gray-50 to-white"

// REPLACE WITH:
className="py-20 px-4 text-center bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))]
  from-coastal-mist/60 via-white/20 to-transparent"
```

**Pattern**: Radial gradient with top focal point (draws eye to headline).

#### Task 3.3: Update IntroductionSection

**File**: `app/components/IntroductionSection.tsx`
**Line**: 5

```tsx
// FIND:
<section className="py-20 px-4 bg-white">

// REPLACE WITH:
<section className="py-20 px-4 bg-transparent">
```

#### Task 3.4: Update FounderSection

**File**: `app/components/FounderSection.tsx`
**Line**: 5

```tsx
// FIND:
<section className="py-20 px-4 bg-gray-50">

// REPLACE WITH:
<section className="py-20 px-4 bg-gradient-to-b from-coastal-mist/30 to-white">
```

**Also update founder card (line 11)**:

```tsx
// FIND:
className="bg-white rounded-3xl p-8 md:p-12 shadow-lg
  max-w-4xl mx-auto text-center md:text-left"

// REPLACE WITH:
className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-xl
  max-w-4xl mx-auto text-center md:text-left"
```

#### Task 3.5: Update PhilosophySection

**File**: `app/components/PhilosophySection.tsx`
**Line**: 32

```tsx
// FIND:
<section className="py-20 px-4 bg-white">

// REPLACE WITH:
<section className="py-20 px-4 bg-transparent">
```

#### Task 3.6: Update LocationSection

**File**: `app/components/LocationSection.tsx`
**Line**: 5

```tsx
// FIND:
<section className="py-20 px-4 bg-gray-50">

// REPLACE WITH:
<section className="py-20 px-4 bg-gradient-to-b from-white to-coastal-dune/15">
```

**Also update location stat cards (lines 28, 34, 40, 46)**:

```tsx
// FIND (all 4 instances):
className="bg-white p-4 rounded-xl shadow-md text-center"

// REPLACE WITH:
className="bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-lg text-center"
```

#### Task 3.7: Update AboutCTA

**File**: `app/components/AboutCTA.tsx`
**Line**: 5

```tsx
// FIND:
<section className="py-20 px-4 text-center bg-white">

// REPLACE WITH:
<section className="py-20 px-4 text-center bg-sunset-beach">
```

**Why**: Warm sunset gradient for CTA section creates urgency.

**Validation for Phase 3**:
1. Navigate to /about
2. Visual check: Soft blue-gray mist gradient
3. Radial gradient on hero should focus eye on title
4. White cards should have glassmorphism effect
5. CTA section should have warm peachy gradient
6. Text contrast should pass WCAG AA

---

### Phase 4: Reviews Page & Room Detail Pages

**Objective**: Complete remaining pages with appropriate gradients.

#### Task 4.1: Update Reviews Page

**File**: `app/reviews/page.tsx`

```tsx
// FIND (line 9):
<main className="min-h-screen bg-white">

// REPLACE WITH:
<main className="min-h-screen bg-ocean-sunrise">

// ALSO UPDATE (line 13):
// FIND:
<div className="relative py-20 px-4 text-center bg-gradient-to-b from-muted/30 to-white mb-12">

// REPLACE WITH:
<div className="relative py-20 px-4 text-center bg-gradient-to-b from-coastal-aqua/20 via-coastal-foam/15 to-transparent mb-12">
```

#### Task 4.2: Update ReviewsDisplay Component

**File**: `app/components/ReviewsDisplay.tsx`
**Line**: 55

```tsx
// FIND:
<section className="py-16 px-4 bg-white">

// REPLACE WITH:
<section className="py-16 px-4 bg-transparent">
```

#### Task 4.3: Update ReviewCard Component

**File**: `app/components/ReviewCard.tsx`
**Line**: 17

```tsx
// FIND:
className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm
  hover:shadow-md transition-shadow duration-300"

// REPLACE WITH:
className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg p-6 shadow-md
  hover:shadow-lg transition-all duration-300"
```

#### Task 4.4: Update Room Detail Pages

**File**: `app/rooms/[slug]/page.tsx`
**Line**: 44

```tsx
// FIND:
<main className="min-h-screen bg-white">

// REPLACE WITH:
<main className="min-h-screen bg-sand-fade">
```

**Why**: Sand-to-white fade doesn't compete with property photos. Very subtle.

**Validation for Phase 4**:
1. Navigate to /reviews
2. Check review cards have glassmorphism
3. Navigate to any room detail (/rooms/unit-2528)
4. Check room detail has very subtle sand fade
5. Verify property photos aren't washed out by background

---

### Phase 5: Polish - Navbar, Testimonials, Cards

**Objective**: Apply coastal tints to remaining interactive elements.

#### Task 5.1: Update Navbar with Subtle Coastal Tint

**File**: `app/components/Navbar.tsx`
**Line**: 31

```tsx
// FIND:
className={`fixed w-full top-0 z-50 transition-all duration-300 ${
  isScrolled ? "bg-white shadow-lg" : "bg-white/95 backdrop-blur-sm"
}`}

// REPLACE WITH:
className={`fixed w-full top-0 z-50 transition-all duration-300 ${
  isScrolled
    ? "bg-gradient-to-r from-white via-coastal-mist/5 to-white shadow-lg"
    : "bg-white/90 backdrop-blur-md"
}`}
```

**Why**: Very subtle coastal tint (5% max) when scrolled. More transparent + stronger blur when at top.

**CRITICAL**: Test scrolling over hero image, white sections, gradient sections. Navbar must remain readable in all contexts.

#### Task 5.2: Update Testimonials Section

**File**: `app/components/Testimonials.tsx`

```tsx
// FIND (line 43):
<section className="py-20 px-4 bg-white">

// REPLACE WITH:
<section className="py-20 px-4 bg-transparent">

// ALSO UPDATE (line 51):
// FIND:
className="bg-muted rounded-lg p-6 md:p-8 text-center"

// REPLACE WITH:
className="bg-gradient-to-br from-white/90 via-coastal-mist/10 to-white/80
  backdrop-blur-sm rounded-lg p-6 md:p-8 text-center shadow-md"
```

#### Task 5.3: Update FeaturedRoomCard Component

**File**: `app/components/FeaturedRoomCard.tsx`
**Line**: 26

```tsx
// FIND:
<div className="relative h-full group cursor-pointer bg-white
  rounded-xl overflow-hidden shadow-lg hover:shadow-xl
  transition-all duration-500">

// REPLACE WITH:
<div className="relative h-full group cursor-pointer bg-white/95
  backdrop-blur-sm rounded-xl overflow-hidden shadow-lg hover:shadow-2xl
  transition-all duration-500 hover:scale-[1.02]">
```

**Why**: Cards float with glassmorphism on coastal backgrounds. Enhanced hover effects.

#### Task 5.4: Update BioCard Component

**File**: `app/components/BioCard.tsx`
**Line**: 13

```tsx
// FIND:
<div className="bg-white rounded-3xl p-8 md:p-12 shadow-lg
  hover:shadow-xl transition-shadow duration-300">

// REPLACE WITH:
<div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-xl
  hover:shadow-2xl transition-all duration-300 hover:scale-[1.01]">
```

**Validation for Phase 5**:
1. Test navbar scrolling on all pages
2. Verify navbar text remains readable (especially logo and links)
3. Check testimonial cards have subtle coastal blend
4. Verify room cards and bio cards have glassmorphism
5. Test hover effects still work
6. Check MagicCard gold gradient still visible

---

### Phase 6: Search Page & Test Pages (Lower Priority)

**Objective**: Complete remaining pages for consistency.

#### Task 6.1: Update Search Page

**File**: `app/search/page.tsx`
**Line**: 140

```tsx
// FIND:
<main className="min-h-screen bg-white">

// REPLACE WITH:
<main className="min-h-screen bg-coastal-mist">
```

#### Task 6.2: Update Test Pages (Optional)

**File**: `app/test-booking/page.tsx`
**Line**: 9

```tsx
// FIND:
<main className="min-h-screen bg-white p-8">

// REPLACE WITH:
<main className="min-h-screen bg-sand-fade p-8">
```

**File**: `app/hospitable-config/page.tsx`
**Line**: 68

```tsx
// FIND:
<main className="min-h-screen bg-white p-8">

// REPLACE WITH:
<main className="min-h-screen bg-coastal-mist p-8">
```

**Validation for Phase 6**:
1. Navigate to /search
2. Verify Hospitable widget still works
3. Test booking flow end-to-end
4. Test pages should have coastal gradients (visual consistency)

---

## Validation Loop

### Level 1: Visual Quality Assurance

**Test on localhost (npm run dev):**

1. **Homepage** (http://localhost:3000):
   - [ ] Ocean sunrise gradient visible (blue → cyan → amber)
   - [ ] DiscoverLocationSection has coastal mist gradient
   - [ ] Newsletter signup has sunset diagonal gradient
   - [ ] Hero booking widget overlays correctly (z-index)
   - [ ] Text remains readable (gray-600, gray-700, primary)
   - [ ] MagicCard hover effects work (gold gradient on coastal bg)

2. **Rooms Page** (/rooms):
   - [ ] Tropical waters gradient visible (cyan → teal → emerald)
   - [ ] Room cards pop with white/90 + backdrop-blur
   - [ ] Category badges readable
   - [ ] Amenity grid has teal/foam gradient

3. **About Page** (/about):
   - [ ] Coastal mist gradient (most sophisticated)
   - [ ] Radial gradient on hero focuses eye on title
   - [ ] Founder/location cards have glassmorphism
   - [ ] CTA section has sunset beach gradient

4. **Reviews Page** (/reviews):
   - [ ] Ocean sunrise gradient (consistent with homepage)
   - [ ] Review cards have glassmorphism
   - [ ] Platform badges (red, blue, purple, green) still visible

5. **Room Detail Page** (/rooms/unit-2528):
   - [ ] Sand fade gradient (very subtle)
   - [ ] Property photos not washed out
   - [ ] Booking iframe loads and overlays correctly

### Level 2: Accessibility & Contrast

**Use WebAIM Contrast Checker** (https://webaim.org/resources/contrastchecker/):

```bash
# Test these text/background combinations:

1. Homepage hero headline (text-white on ocean sunrise top):
   Foreground: #FFFFFF
   Background: Sample at pixel [50%, 20%] → should be blue-ish
   Required: 4.5:1 (large text allows 3:1)

2. Body text on coastal mist (text-gray-600):
   Foreground: #4B5563 (gray-600)
   Background: Sample at pixel [50%, 50%] → should be white-ish
   Required: 4.5:1

3. Rooms page headline (text-primary on tropical waters):
   Foreground: #1a1a1a
   Background: Sample at pixel [50%, 30%] → should be cyan-ish
   Required: 4.5:1 (or use white text if failing)

4. Newsletter signup text (on sunset beach):
   Foreground: #1a1a1a or #FFFFFF
   Background: Orange/amber blend
   Required: 4.5:1
```

**If any contrast fails**:
- Option A: Darken text (gray-600 → gray-700 or primary)
- Option B: Lighten gradient (reduce opacity of color stops)
- Option C: Add semi-transparent overlay behind text

### Level 3: Performance Testing

**Lighthouse Audit** (Chrome DevTools):

```bash
# In Chrome DevTools, run Lighthouse on each page:
1. Open DevTools (F12)
2. Navigate to Lighthouse tab
3. Select "Performance" category
4. Run audit on mobile + desktop

# Acceptance criteria:
- Performance Score: ≥ 90 (no regression from white backgrounds)
- Largest Contentful Paint (LCP): < 2.5s
- Cumulative Layout Shift (CLS): < 0.1
- First Contentful Paint (FCP): < 1.8s

# If performance degrades:
- Simplify gradients (remove extra color stops)
- Reduce backdrop-blur usage (md → sm or remove)
- Check for heavy CSS (gradient utilities should be lightweight)
```

**Mobile Testing**:

```bash
# Test on physical device or Chrome DevTools device emulation:
- iPhone 12 Pro (390x844)
- Samsung Galaxy S20 (360x800)
- iPad Air (820x1180)

# Check:
- Gradients render smoothly (no banding)
- Text remains readable on all screen sizes
- Backdrop-blur doesn't cause janky scrolling
- Hospitable widget still usable on mobile
```

### Level 4: Cross-Browser Testing

**Browsers to test**:

1. **Chrome** (latest) - Primary target
2. **Safari** (latest) - Check backdrop-blur support
3. **Firefox** (latest) - Check gradient rendering
4. **Mobile Safari** (iOS 15+) - Critical for vacation bookings
5. **Chrome Mobile** (Android) - Secondary mobile target

**Expected behavior**:
- All gradients render correctly
- Backdrop-blur works (or degrades gracefully)
- No console errors
- Hospitable widget loads and works

**Known issues**:
- Safari < 12.1: backdrop-blur not supported (graceful degradation)
- IE11: Not supported (Next.js 15 doesn't target IE11)

### Level 5: Booking Widget Integration Test

**Critical flow** - Must not be broken:

```bash
# Test end-to-end booking:
1. Navigate to homepage
2. Interact with hero booking widget (Hospitable)
   - Select check-in date
   - Select check-out date
   - Click "Search" or "Check Availability"
3. Verify calendar popup appears OVER gradients (z-index: 2147483647)
4. Navigate to room detail page (/rooms/unit-2528)
5. Scroll to booking iframe
6. Interact with iframe (select dates, view pricing)
7. Verify iframe scrolls and overlays work correctly

# Pass criteria:
- All Hospitable UI elements clickable
- Calendar popup not cut off by gradients
- Iframe loads and is interactive
- No z-index conflicts with coastal backgrounds
```

### Level 6: Print Styles Test

**Test printing**:

```bash
# In Chrome DevTools:
1. Open Print Preview (Ctrl+P / Cmd+P)
2. Check each page preview
3. Verify gradients removed (white background)
4. Check text still readable
5. Verify no wasted ink

# Should see in print preview:
- All gradients replaced with white
- Text contrast maintained (now on white bg)
- Page layout unchanged (just colors)

# If gradients still visible in print:
- Check @media print rules in globals.css applied correctly
- Add print:bg-white to problematic sections
```

---

## Final Validation Checklist

Before marking PRP complete:

- [ ] All 8 pages have coastal gradients (no `bg-white` on `<main>`)
- [ ] All gradient utilities defined in `globals.css`
- [ ] All coastal colors defined in `tailwind.config.ts`
- [ ] Homepage has Ocean Sunrise aesthetic
- [ ] Rooms page has Tropical Waters aesthetic
- [ ] About page has Coastal Mist aesthetic
- [ ] Room detail pages have Sand Fade aesthetic
- [ ] CTA/newsletter sections have Sunset Beach aesthetic
- [ ] All text passes WCAG AA contrast checks (4.5:1)
- [ ] Lighthouse Performance Score ≥ 90 on all pages
- [ ] Hospitable booking widget works end-to-end
- [ ] Calendar popup appears over all gradients (z-index)
- [ ] MagicCard hover effects still work (gold gradient visible)
- [ ] Navbar readable when scrolling over all background types
- [ ] Cards have glassmorphism (bg-white/90 + backdrop-blur-sm)
- [ ] Print styles remove gradients (white background)
- [ ] No console errors on any page
- [ ] Cross-browser testing passed (Chrome, Safari, Firefox, Mobile)
- [ ] Mobile performance tested (no janky scrolling)
- [ ] Before/after screenshots show clear visual improvement
- [ ] User feedback: "Adds life" ✓ / "Feels beachy" ✓

---

## Anti-Patterns to Avoid

- ❌ **Don't replace existing brand colors** (keep tan, primary, muted - ADD coastal colors)
- ❌ **Don't override HSL system colors** (--background, --foreground) - Shadcn depends on them
- ❌ **Don't apply backdrop-filter to Hospitable widget containers** - Breaks z-index stacking
- ❌ **Don't use high opacity gradients** (> 50%) without testing text contrast - Fails WCAG
- ❌ **Don't change MagicCard gradientColor prop** - Gold gradient works with coastal backgrounds
- ❌ **Don't remove dark footer** (bg-primary) - Intentional design contrast
- ❌ **Don't skip print styles** - Gradient backgrounds waste ink if not overridden
- ❌ **Don't apply gradients to individual cards** - Apply to sections, keep cards white/glassmorphism
- ❌ **Don't use too many color stops** (> 4) - Causes gradient banding and performance issues
- ❌ **Don't forget mobile testing** - Gradients + backdrop-blur can cause scroll jank on low-end devices
- ❌ **Don't update all pages at once** - Use phased rollout (homepage → rooms → about → others)
- ❌ **Don't skip contrast testing** - Use WebAIM checker on every gradient + text combo

---

## Success Metrics & Confidence Score

### Quantitative Success Metrics

1. **Visual Transformation**: 100% of pages updated (8/8 page files)
2. **Component Coverage**: 95%+ components have coastal styling (35+/37 files)
3. **Accessibility**: 100% WCAG AA compliance (all text ≥ 4.5:1 contrast)
4. **Performance**: No regression (Lighthouse ≥ 90 on all pages)
5. **Zero Breaking Changes**: Hospitable widget, MagicCard, navigation all functional

### Qualitative Success Metrics

1. **User Perception**: "Beachy" and "elevated" aesthetic (vs. "generic white")
2. **Brand Alignment**: Coastal gradients reinforce "10 min to beach" positioning
3. **Professional Polish**: Sophisticated gradients, not amateurish rainbow effects
4. **Conversion Impact**: More engaging visual → longer browsing → higher booking intent

### Implementation Confidence Score: **9/10**

**Why high confidence:**
- ✅ Comprehensive research (3 research docs, 1 codebase analysis)
- ✅ Specific line numbers for every file update
- ✅ Existing gradient patterns identified (DiscoverLocationSection as reference)
- ✅ Color palette defined with hex codes and HSL values
- ✅ Accessibility guidelines included (WCAG AA compliance)
- ✅ Validation loop with specific tools (WebAIM, Lighthouse)
- ✅ Phased rollout plan (homepage first for proof-of-concept)
- ✅ Known gotchas documented (Hospitable z-index, MagicCard compatibility)
- ✅ Before/after code examples for every pattern
- ✅ Anti-patterns list prevents common mistakes

**Why not 10/10:**
- ⚠️ Text contrast needs manual verification on each gradient (WebAIM testing required)
- ⚠️ Navbar coastal tint may need fine-tuning based on visual testing
- ⚠️ Some color combinations may need adjustment based on user preference (subjective aesthetics)

**Mitigation:**
- Follow phased rollout (test homepage → iterate → apply to other pages)
- Use validation loop to catch contrast issues before full rollout
- Solicit user feedback after homepage update before proceeding

---

## Appendix: Quick Reference

### Gradient Utility Class Mappings

| Page/Section | Utility Class | Effect |
|--------------|---------------|--------|
| Homepage main | `.bg-ocean-sunrise` | Blue → Cyan → Amber (vertical) |
| Rooms page main | `.bg-tropical-waters` | Cyan → Teal → Emerald (diagonal) |
| About page main | `.bg-coastal-mist` | Blue-gray → White → Tan (diagonal) |
| Room detail main | `.bg-sand-fade` | White → Cyan-50 (vertical subtle) |
| CTA sections | `.bg-sunset-beach` | Orange → Amber → Tan (horizontal) |
| Hero focal | `.bg-radial-sunrise` | Sky-200 radial from top |

### Color Palette Quick Reference

```css
--coastal-blue:    #0EA5E9  /* Ocean blue */
--coastal-teal:    #14B8A6  /* Coastal teal */
--coastal-aqua:    #22D3EE  /* Bright aqua */
--coastal-sand:    #FCD34D  /* Sandy yellow */
--coastal-mist:    #F0F9FF  /* Soft blue-gray */
--coastal-sunrise: #FB923C  /* Peachy sunrise */
--coastal-foam:    #A5F3FC  /* Seafoam */
--coastal-dune:    #FDE68A  /* Light sand */
```

### File Update Priority

**P0 (Do First)**: Homepage, Rooms, About pages
**P1 (Do Second)**: Reviews, Room detail pages
**P2 (Polish)**: Navbar, Cards, Testimonials
**P3 (Optional)**: Search, Test pages

### Testing Checklist

```bash
# Quick validation after each phase:
npm run build          # Must succeed
npm run dev            # Start dev server
# Open localhost:3000
# Visual check + WebAIM contrast test
# Test booking widget
# Check mobile responsive
# Run Lighthouse audit
```

---

**End of PRP - Ready for Implementation**
