# PRP: Transform Reviews Page into Interactive Review Submission Hub

## Goal
Transform the `/reviews` page from a redundant static reviews display into an interactive review submission and management center, eliminating duplication with the homepage `EnhancedGuestExperiences` component.

## Why
- **Redundancy Problem**: Current reviews page duplicates content already shown on homepage
- **Missed Opportunity**: No way for guests to submit reviews directly on the website
- **Engagement**: Interactive review submission builds trust and user-generated content
- **Differentiation**: Each page should have unique value proposition
- **Professional Standard**: Modern vacation rental sites (Airbnb, VRBO) have dedicated review submission flows

## What
A redesigned reviews page with three distinct sections:

1. **Review Submission Form** (Top Priority)
   - React Hook Form + Zod validation
   - Guest information (name, email, property, stay date)
   - Star ratings (overall + 4 category ratings)
   - Review text (50-500 characters)
   - Success state with confetti animation
   - Email service integration (Formspree/similar)

2. **Recent Reviews Display** (Bottom Section)
   - Filterable review list (property, rating, platform)
   - Newest reviews first (timestamp-sorted)
   - Pagination or "Load More" button
   - Responsive review cards

3. **Aggregate Stats** (Middle Section)
   - Platform ratings overview
   - Total review count
   - Average rating across platforms

### Success Criteria
- [ ] Review submission form validates correctly with Zod schema
- [ ] Form submits successfully (mock or real email service)
- [ ] Success state shows confetti animation
- [ ] Review display filters work (property, rating, platform)
- [ ] Reviews sort by date (newest first)
- [ ] Mobile responsive on all screen sizes
- [ ] No TypeScript errors
- [ ] Centralized review data in `app/data/reviews.ts`
- [ ] Homepage kept unchanged (EnhancedGuestExperiences)
- [ ] Old redundant components removed

## All Needed Context

### Documentation & References
```yaml
# MUST READ - Core Documentation
- url: https://react-hook-form.com/get-started
  why: Official React Hook Form setup and validation patterns

- url: https://zod.dev/
  why: Zod schema validation syntax and error handling

- url: https://www.npmjs.com/package/canvas-confetti
  why: Confetti animation API (already installed)

- url: https://formspree.io/library/react
  why: Email form submission service integration (mentioned in TASK.md)

# Existing Components to Study
- file: app/components/EnhancedGuestExperiences.tsx
  why: Current homepage reviews implementation - should remain unchanged
  lines: 1-309 (entire component with review carousel and stats)
  pattern: Star ratings, platform badges, review card structure

- file: app/reviews/page.tsx
  why: Current reviews page - will be completely redesigned
  lines: 1-83 (entire page structure)
  pattern: Multiple redundant components to be removed

- file: app/data/units.ts
  why: Property data structure for dropdown population
  lines: 1-163 (Unit interface and UNITS array)
  pattern: TypeScript interfaces, slug-based identification

# Similar Form Patterns in Codebase
- file: app/components/BoutiqueNewsletterSignup.tsx
  why: Example of form validation and submission patterns
  pattern: Email validation, submit states, success feedback

# Design System References
- file: components/ui/magic-card.tsx
  why: Primary card component used throughout site
  pattern: Gradient backgrounds, hover effects

- file: tailwind.config.ts
  why: Custom color system (tan #D2B48C, primary #1a1a1a)
  lines: 47-49 (color definitions)
```

### Current Codebase Structure
```bash
silce/
├── app/
│   ├── components/
│   │   ├── EnhancedGuestExperiences.tsx  # KEEP UNCHANGED - Homepage reviews
│   │   ├── ReviewsHeroSection.tsx        # REMOVE - Redundant
│   │   ├── ReviewsIntroduction.tsx       # REMOVE - Redundant
│   │   ├── FeaturedReview.tsx            # REMOVE - Redundant
│   │   ├── ReviewGrid.tsx                # REMOVE - Redundant
│   │   ├── ReviewPlatformBadges.tsx      # REMOVE - Redundant
│   │   └── ReviewsCTA.tsx                # REMOVE - Replaced with form
│   ├── data/
│   │   ├── units.ts                      # READ - For property dropdown
│   │   └── categories.ts                 # READ - For category reference
│   ├── reviews/
│   │   └── page.tsx                      # MODIFY - Complete redesign
│   └── page.tsx                          # KEEP UNCHANGED - Homepage
├── package.json                          # VERIFY - Dependencies already installed
└── PRPs/
    └── review-page-transformation.md     # THIS FILE
```

### Desired Codebase Structure
```bash
silce/
├── app/
│   ├── components/
│   │   ├── ReviewSubmissionForm.tsx      # CREATE - Main form component
│   │   ├── ReviewsDisplay.tsx            # CREATE - Filtered review list
│   │   ├── ReviewStatsSection.tsx        # CREATE - Aggregate stats display
│   │   └── EnhancedGuestExperiences.tsx  # KEEP - Add CTA link to /reviews
│   ├── data/
│   │   └── reviews.ts                    # CREATE - Centralized review data model
│   ├── reviews/
│   │   └── page.tsx                      # MODIFY - Use new components
│   └── page.tsx                          # MODIFY - Add link in EnhancedGuestExperiences
└── PRPs/
    └── review-page-transformation.md
```

### Known Gotchas & Library Quirks
```typescript
// CRITICAL: React Hook Form with Zod resolver
// Problem: Must use zodResolver from @hookform/resolvers/zod
// Solution: Import correctly and pass to useForm
import { zodResolver } from "@hookform/resolvers/zod"
const { register, handleSubmit } = useForm({ resolver: zodResolver(schema) })

// CRITICAL: Star rating state management
// Problem: Controlled input needs setValue from React Hook Form
// Solution: Use setValue with shouldValidate option
setValue("overallRating", rating, { shouldValidate: true })

// CRITICAL: Confetti animation timing
// Problem: Confetti must trigger AFTER success state renders
// Solution: Call confetti() in success handler after setIsSuccess(true)

// GOTCHA: Form reset after success
// Problem: Need to reset both form state AND custom rating states
// Solution: Reset multiple states in sequence
reset()  // React Hook Form
setOverallRating(0)  // Custom state
setCategoryRatings({ cleanliness: 0, ... })  // Custom state

// GOTCHA: Email service integration
// Problem: Formspree requires specific endpoint URL
// Solution: Use environment variable for endpoint (add to .env.local)
// NEXT_PUBLIC_FORMSPREE_REVIEW_ENDPOINT=https://formspree.io/f/YOUR_ID

// GOTCHA: Date sorting
// Problem: ISO date strings need conversion to Date objects for comparison
// Solution: Use getTime() for numeric comparison
.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

// GOTCHA: Optional fields in Zod
// Problem: Category ratings are optional but should still validate if provided
// Solution: Use .optional() on number validators
cleanliness: z.number().min(1).max(5).optional()

// GOTCHA: Review data consolidation
// Problem: Reviews scattered across multiple components with different formats
// Solution: Normalize all reviews to single interface in reviews.ts
```

## Implementation Blueprint

### Data Models and Structure

```typescript
// app/data/reviews.ts - Centralized review data model
export type ReviewPlatform = "Airbnb" | "Booking.com" | "VRBO" | "Google" | "SilverPineapple Direct"

export interface CategoryRatings {
  cleanliness?: number
  communication?: number
  location?: number
  value?: number
}

export interface Review {
  id: string
  guestName: string
  email?: string  // Not displayed publicly
  propertySlug?: string  // Links to UNITS
  propertyName?: string
  overallRating: number  // 1-5
  categoryRatings?: CategoryRatings
  text: string
  date: string  // ISO date string
  platform: ReviewPlatform
  verified: boolean
  stayDuration?: string
  highlight?: string
  avatar?: string
}

export const REVIEWS: Review[] = [
  // Consolidate from EnhancedGuestExperiences + reviews/page.tsx
  // ~16 existing reviews
]

export const PLATFORM_STATS = [
  { platform: "Airbnb", rating: 4.9, reviews: 127, logo: "🏠" },
  { platform: "Booking.com", rating: 4.8, reviews: 89, logo: "🌐" },
  { platform: "VRBO", rating: 4.9, reviews: 64, logo: "🏖️" },
  { platform: "Google", rating: 4.9, reviews: 156, logo: "⭐" }
]

// Helper functions
export const getReviewsSortedByDate = () => { /* ... */ }
export const getReviewsByProperty = (slug: string) => { /* ... */ }
export const getReviewsByRating = (minRating: number) => { /* ... */ }
```

### List of Tasks (in dependency order)

```yaml
Task 1: Create Review Data Model
  CREATE: app/data/reviews.ts
  CONTENT: TypeScript interfaces, consolidated review array, helper functions
  PATTERN: Follow app/data/units.ts structure
  DATA: Merge reviews from EnhancedGuestExperiences.tsx (lines 13-98) + reviews/page.tsx (lines 11-68)
  VERIFY: Import successfully in other components

Task 2: Create Review Submission Form Component
  CREATE: app/components/ReviewSubmissionForm.tsx
  DEPENDENCIES: React Hook Form, Zod, canvas-confetti (already installed)
  PATTERN: Follow BoutiqueNewsletterSignup.tsx form structure
  FEATURES:
    - Zod schema validation (name 2-50 chars, email valid, review 50-500 chars)
    - Star rating component (reusable sub-component)
    - Property dropdown (populate from UNITS)
    - Category ratings (4 optional star ratings)
    - Submit handler with loading state
    - Success state with confetti
    - Auto-reset after 3 seconds
  CRITICAL: Use "use client" directive
  VERIFY: Form validates and submits without errors

Task 3: Create Review Display Component
  CREATE: app/components/ReviewsDisplay.tsx
  PATTERN: Follow EnhancedGuestExperiences.tsx review card layout (lines 264-286)
  FEATURES:
    - Filter controls (property dropdown, rating buttons, platform buttons)
    - Review cards grid (responsive: 1 col mobile, 2 col tablet, 3 col desktop)
    - "Load More" pagination (show 9, load 9 more)
    - Empty state when no reviews match filters
    - Sort by date (newest first)
  STATE: useState for filters (property, minRating, platform)
  VERIFY: Filters work correctly, reviews display properly

Task 4: Create Stats Section Component
  CREATE: app/components/ReviewStatsSection.tsx
  PATTERN: Reuse EnhancedGuestExperiences.tsx platform ratings section (lines 288-304)
  CONTENT: Platform stats grid, average rating, total count
  SIMPLIFY: Remove NumberTicker animation (overkill for this page)
  VERIFY: Stats display correctly with MagicCard styling

Task 5: Redesign Reviews Page
  MODIFY: app/reviews/page.tsx
  REMOVE: All existing component imports (ReviewsHeroSection, ReviewsIntroduction, etc.)
  REPLACE: With new component structure:
    1. Minimal hero section (h1 + subtitle)
    2. ReviewSubmissionForm
    3. ReviewStatsSection
    4. ReviewsDisplay
  PRESERVE: Navbar and Footer
  VERIFY: Page renders without errors

Task 6: Update Homepage CTA
  MODIFY: app/components/EnhancedGuestExperiences.tsx
  ADD: CTA link at bottom of section (after platform ratings)
  TEXT: "Share Your Experience →" button linking to /reviews
  STYLE: Tan background, white text, hover effects
  LOCATION: After line 304 (end of platformRatings grid)
  VERIFY: Link navigates to /reviews correctly

Task 7: Delete Redundant Components
  DELETE: app/components/ReviewsHeroSection.tsx
  DELETE: app/components/ReviewsIntroduction.tsx
  DELETE: app/components/FeaturedReview.tsx
  DELETE: app/components/ReviewGrid.tsx
  DELETE: app/components/ReviewPlatformBadges.tsx
  DELETE: app/components/ReviewsCTA.tsx
  VERIFY: No import errors after deletion

Task 8: Environment Variable Setup (Optional)
  CREATE: Add to .env.local (if using real Formspree)
  VARIABLE: NEXT_PUBLIC_FORMSPREE_REVIEW_ENDPOINT
  PATTERN: Follow existing env var pattern from PLANNING.md
  VERIFY: Form submission uses env var endpoint
```

### Pseudocode for Core Components

```typescript
// Task 2: app/components/ReviewSubmissionForm.tsx
"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import confetti from "canvas-confetti"

const reviewSchema = z.object({
  guestName: z.string().min(2).max(50),
  email: z.string().email(),
  propertySlug: z.string().min(1),
  overallRating: z.number().min(1).max(5),
  cleanliness: z.number().min(1).max(5).optional(),
  communication: z.number().min(1).max(5).optional(),
  location: z.number().min(1).max(5).optional(),
  value: z.number().min(1).max(5).optional(),
  reviewText: z.string().min(50).max(500),
  stayDate: z.string().optional()
})

// Star Rating Sub-component
function StarRating({ rating, onChange, label }) {
  const [hoverRating, setHoverRating] = useState(0)
  return (
    <div>
      <label>{label}</label>
      {[1,2,3,4,5].map(star => (
        <button onClick={() => onChange(star)} onMouseEnter={() => setHoverRating(star)}>
          <Star className={star <= (hoverRating || rating) ? "text-tan fill-tan" : "text-gray-300"} />
        </button>
      ))}
    </div>
  )
}

export default function ReviewSubmissionForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [overallRating, setOverallRating] = useState(0)
  const [categoryRatings, setCategoryRatings] = useState({ /* ... */ })

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm({
    resolver: zodResolver(reviewSchema)
  })

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    // Submit to Formspree or API endpoint
    // await fetch(process.env.NEXT_PUBLIC_FORMSPREE_REVIEW_ENDPOINT, { ... })
    setIsSuccess(true)
    confetti({ particleCount: 100, spread: 70 })
    setTimeout(() => {
      setIsSuccess(false)
      reset()
      setOverallRating(0)
      setCategoryRatings({ cleanliness: 0, communication: 0, location: 0, value: 0 })
    }, 3000)
    setIsSubmitting(false)
  }

  if (isSuccess) {
    return <MagicCard><CheckCircle /> Thank You! Your review has been submitted.</MagicCard>
  }

  return (
    <MagicCard>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Guest Name */}
        <input {...register("guestName")} placeholder="John Doe" />
        {errors.guestName && <p>{errors.guestName.message}</p>}

        {/* Email */}
        <input type="email" {...register("email")} />
        {errors.email && <p>{errors.email.message}</p>}

        {/* Property Dropdown */}
        <select {...register("propertySlug")}>
          <option value="">Select property...</option>
          {UNITS.map(unit => <option value={unit.slug}>{unit.title}</option>)}
        </select>

        {/* Overall Rating */}
        <StarRating
          label="Overall Experience *"
          rating={overallRating}
          onChange={(r) => { setOverallRating(r); setValue("overallRating", r, { shouldValidate: true }) }}
        />
        {errors.overallRating && <p>{errors.overallRating.message}</p>}

        {/* Category Ratings */}
        <StarRating label="Cleanliness" rating={categoryRatings.cleanliness} onChange={(r) => { /* ... */ }} />
        <StarRating label="Communication" /* ... */ />
        <StarRating label="Location" /* ... */ />
        <StarRating label="Value" /* ... */ />

        {/* Review Text */}
        <textarea {...register("reviewText")} rows={6} placeholder="Tell us about your stay..." />
        {errors.reviewText && <p>{errors.reviewText.message}</p>}
        <p className="text-xs">Minimum 50 characters, maximum 500 characters</p>

        {/* Submit Button */}
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit Review"}
        </button>
      </form>
    </MagicCard>
  )
}

// Task 3: app/components/ReviewsDisplay.tsx
"use client"

import { useState, useMemo } from "react"
import { REVIEWS, getReviewsSortedByDate } from "@/app/data/reviews"
import { UNITS } from "@/app/data/units"

export default function ReviewsDisplay() {
  const [selectedProperty, setSelectedProperty] = useState<string>("all")
  const [minRating, setMinRating] = useState<number>(1)
  const [selectedPlatform, setSelectedPlatform] = useState<string>("all")
  const [displayCount, setDisplayCount] = useState(9)

  const filteredReviews = useMemo(() => {
    let filtered = getReviewsSortedByDate()

    if (selectedProperty !== "all") {
      filtered = filtered.filter(r => r.propertySlug === selectedProperty)
    }

    if (minRating > 1) {
      filtered = filtered.filter(r => r.overallRating >= minRating)
    }

    if (selectedPlatform !== "all") {
      filtered = filtered.filter(r => r.platform === selectedPlatform)
    }

    return filtered
  }, [selectedProperty, minRating, selectedPlatform])

  const displayedReviews = filteredReviews.slice(0, displayCount)
  const hasMore = displayedReviews.length < filteredReviews.length

  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <h2>Recent Guest Reviews</h2>

        {/* Filter Controls */}
        <div className="flex gap-4 mb-8">
          {/* Property Filter */}
          <select value={selectedProperty} onChange={(e) => setSelectedProperty(e.target.value)}>
            <option value="all">All Properties</option>
            {UNITS.map(unit => <option value={unit.slug}>{unit.title}</option>)}
          </select>

          {/* Rating Filter */}
          <div className="flex gap-2">
            <button onClick={() => setMinRating(1)}>All Ratings</button>
            <button onClick={() => setMinRating(4)}>4★ & Up</button>
            <button onClick={() => setMinRating(5)}>5★ Only</button>
          </div>

          {/* Platform Filter */}
          <select value={selectedPlatform} onChange={(e) => setSelectedPlatform(e.target.value)}>
            <option value="all">All Platforms</option>
            <option value="Airbnb">Airbnb</option>
            <option value="Booking.com">Booking.com</option>
            <option value="VRBO">VRBO</option>
            <option value="Google">Google</option>
          </select>
        </div>

        {/* Review Grid */}
        {displayedReviews.length === 0 ? (
          <p className="text-center text-gray-500">No reviews match your filters</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedReviews.map(review => (
              <MagicCard key={review.id} className="p-6">
                {/* Platform Badge */}
                <span className="text-xs bg-tan/10 text-tan px-2 py-1 rounded">{review.platform}</span>

                {/* Stars */}
                <div className="flex">
                  {[...Array(review.overallRating)].map((_, i) => <Star key={i} className="text-tan fill-tan" />)}
                </div>

                {/* Text */}
                <p className="text-sm text-gray-700">"{review.text}"</p>

                {/* Author */}
                <p className="font-medium text-primary">{review.guestName}</p>

                {/* Property & Date */}
                {review.propertyName && <p className="text-xs text-gray-500">{review.propertyName}</p>}
                <p className="text-xs text-gray-500">{new Date(review.date).toLocaleDateString()}</p>
              </MagicCard>
            ))}
          </div>
        )}

        {/* Load More Button */}
        {hasMore && (
          <div className="text-center mt-8">
            <button onClick={() => setDisplayCount(prev => prev + 9)}>
              Load More Reviews
            </button>
          </div>
        )}
      </div>
    </section>
  )
}

// Task 4: app/components/ReviewStatsSection.tsx
import { PLATFORM_STATS, getAverageRating } from "@/app/data/reviews"

export default function ReviewStatsSection() {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-5xl mx-auto">
        <h3 className="text-2xl font-bold text-primary mb-8 text-center">
          Trusted Across All Platforms
        </h3>

        {/* Overall Stats */}
        <div className="text-center mb-8">
          <div className="text-5xl font-bold text-tan">{getAverageRating()}</div>
          <p className="text-gray-600">Average Rating</p>
        </div>

        {/* Platform Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {PLATFORM_STATS.map((platform, index) => (
            <MagicCard key={index} className="p-6 text-center">
              <div className="text-3xl mb-2">{platform.logo}</div>
              <div className="font-bold text-primary">{platform.platform}</div>
              <div className="flex items-center justify-center gap-1">
                <Star className="w-4 h-4 text-tan fill-tan" />
                <span className="font-bold text-tan">{platform.rating}</span>
              </div>
              <div className="text-sm text-gray-600">{platform.reviews} reviews</div>
            </MagicCard>
          ))}
        </div>
      </div>
    </section>
  )
}

// Task 5: app/reviews/page.tsx (redesigned)
import Navbar from "../components/Navbar"
import ReviewSubmissionForm from "../components/ReviewSubmissionForm"
import ReviewStatsSection from "../components/ReviewStatsSection"
import ReviewsDisplay from "../components/ReviewsDisplay"
import Footer from "../components/Footer"

export default function ReviewsPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-muted/30 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-primary mb-6 tracking-tight">
            GUEST REVIEWS
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Read what our guests say and share your own StayLokal experience
          </p>
        </div>
      </section>

      {/* New Components */}
      <ReviewSubmissionForm />
      <ReviewStatsSection />
      <ReviewsDisplay />

      <Footer />
    </main>
  )
}
```

### Integration Points

```yaml
HOMEPAGE_CTA:
  - file: app/components/EnhancedGuestExperiences.tsx
  - add_after: line 304 (after platformRatings grid)
  - pattern: |
      {/* CTA to Reviews Page */}
      <div className="text-center mt-12">
        <Link
          href="/reviews"
          className="inline-flex items-center gap-2 px-8 py-4 bg-tan text-white font-semibold rounded-lg
            hover:bg-tan/90 transition-all duration-300 hover:shadow-lg hover:scale-105"
        >
          Share Your Experience
          <ChevronRight className="w-5 h-5" />
        </Link>
      </div>

DATA_CONSOLIDATION:
  - source_1: app/components/EnhancedGuestExperiences.tsx
    lines: 13-98 (featuredReviews + quickReviews arrays)
  - source_2: app/reviews/page.tsx
    lines: 11-68 (featuredReview + reviews array)
  - destination: app/data/reviews.ts
  - action: Merge into single REVIEWS array with normalized interface

FORMSPREE_INTEGRATION:
  - file: app/components/ReviewSubmissionForm.tsx
  - onSubmit_handler: |
      const response = await fetch(
        process.env.NEXT_PUBLIC_FORMSPREE_REVIEW_ENDPOINT || "/api/reviews",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data)
        }
      )
  - env_variable: NEXT_PUBLIC_FORMSPREE_REVIEW_ENDPOINT
  - fallback: Mock submission with console.log + success state
```

## Validation Loop

### Level 1: Type Safety & Build
```bash
# Check TypeScript compilation
npm run build

# Expected: No errors in reviews.ts, ReviewSubmissionForm.tsx, ReviewsDisplay.tsx
# If errors: Check import paths, interface definitions, Zod schema types
```

### Level 2: Form Validation
```bash
# Start dev server
npm run dev

# Navigate to: http://localhost:3000/reviews

# VERIFY Form Validation:
- [ ] Empty form shows validation errors on submit
- [ ] Name < 2 chars shows error
- [ ] Invalid email shows error
- [ ] No property selected shows error
- [ ] No overall rating shows error
- [ ] Review < 50 chars shows error
- [ ] Review > 500 chars shows error
- [ ] Valid form submits successfully

# VERIFY Form Submission:
- [ ] Loading state shows during submission
- [ ] Success state appears after submission
- [ ] Confetti animation plays
- [ ] Form resets after 3 seconds
- [ ] Can submit multiple reviews
```

### Level 3: Review Display & Filtering
```bash
# On /reviews page, scroll to review display section

# VERIFY Filters:
- [ ] Property dropdown filters reviews correctly
- [ ] "All Ratings" shows all reviews
- [ ] "4★ & Up" filters correctly
- [ ] "5★ Only" filters correctly
- [ ] Platform dropdown filters correctly
- [ ] Combined filters work together
- [ ] Empty state shows when no matches

# VERIFY Display:
- [ ] Reviews sort by date (newest first)
- [ ] Initial load shows 9 reviews
- [ ] "Load More" button appears if >9 reviews
- [ ] Clicking "Load More" shows 9 more
- [ ] Review cards show all info (rating, text, name, date, platform)
```

### Level 4: Mobile Responsive
```bash
# In browser DevTools:
# 1. Toggle device toolbar (Cmd+Shift+M)
# 2. Test breakpoints:

# Mobile (375px):
- [ ] Form fields stack vertically
- [ ] Star ratings fit on screen
- [ ] Review cards single column
- [ ] Filter controls stack or scroll horizontally

# Tablet (768px):
- [ ] Form fields in 2-column grid
- [ ] Review cards 2-column grid
- [ ] Filter controls in row

# Desktop (1024px+):
- [ ] All elements properly spaced
- [ ] Review cards 3-column grid
- [ ] Form centered and readable
```

## Final Validation Checklist
- [ ] Build succeeds: `npm run build`
- [ ] Review data centralized in `app/data/reviews.ts`
- [ ] Form validates with Zod schema
- [ ] Form submits successfully (mock or real)
- [ ] Success state shows confetti
- [ ] Review filters work (property, rating, platform)
- [ ] Reviews sort by date (newest first)
- [ ] Pagination/Load More works
- [ ] Mobile responsive (375px, 768px, 1024px)
- [ ] No TypeScript errors
- [ ] Homepage unchanged (EnhancedGuestExperiences)
- [ ] Homepage has CTA link to /reviews
- [ ] Old redundant components deleted
- [ ] No broken imports after deletion

---

## Anti-Patterns to Avoid
- ❌ Don't duplicate review data across components (use centralized reviews.ts)
- ❌ Don't forget "use client" directive on form component (uses hooks)
- ❌ Don't skip Zod validation (prevents bad data submission)
- ❌ Don't forget to reset custom state after form submission (overall rating, category ratings)
- ❌ Don't use uncontrolled inputs without React Hook Form register
- ❌ Don't display guest email publicly (privacy concern)
- ❌ Don't allow reviews without minimum character count (low-quality data)
- ❌ Don't forget confetti animation on success (delightful UX)
- ❌ Don't keep old redundant components (creates confusion)
- ❌ Don't modify EnhancedGuestExperiences layout (only add CTA link)

## Success Metrics

**One-pass implementation confidence:** 8.5/10

**Rationale:**
- All dependencies already installed (React Hook Form, Zod, confetti)
- Clear data model consolidation from existing sources
- Well-defined component responsibilities
- Validation schema straightforward with Zod
- Existing design patterns to follow (MagicCard, form styling)
- Mobile responsive patterns established in codebase

**Potential challenges:**
- Data consolidation requires careful merging of two different review formats
- Filter state management needs proper useMemo optimization
- Formspree integration may need environment variable setup
- Star rating component needs careful state synchronization with React Hook Form
- Testing all filter combinations manually

**Time estimate:** 2-3 hours for complete implementation + validation
