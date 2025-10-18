# OG Image Implementation Checklist

## Silver Pineapple - OpenGraph Image Rollout

Use this checklist to systematically implement OG images for all 9 properties.

---

## Phase 1: Quick Win - Static OG Images (2-4 hours)

### Step 1: Preparation (15 minutes)

- [ ] Create directory: `mkdir -p /public/og-images`
- [ ] Create temp directory: `mkdir -p /og-source`
- [ ] Export Silver Pineapple logo as PNG (transparent background)
- [ ] Confirm brand colors: Tan (#D2B48C), Dark (#1a1a1a)

### Step 2: Select Hero Photos (15 minutes)

For each unit, copy the first (hero) image from existing photos:

- [ ] Unit 2528: `cp public/photos_2528/1.jpg og-source/unit-2528.jpg`
- [ ] Unit 2536: `cp public/photos_2536/1.jpg og-source/unit-2536.jpg`
- [ ] Unit 2538: `cp public/photos_2538/1.jpg og-source/unit-2538.jpg`
- [ ] Pineapple 102: `cp public/photos_102/1.jpg og-source/pineapple-102.jpg`
- [ ] Sea Grape 102: `cp public/photos_seagrape_102/1.jpg og-source/sea-grape-102.jpg`
- [ ] Unit 2526: `cp public/photos_2526/1.jpg og-source/unit-2526.jpg`
- [ ] Pineapple 103: `cp public/photos_103/1.jpg og-source/pineapple-103.jpg`
- [ ] Pineapple 104: `cp public/photos_104/1.jpg og-source/pineapple-104.jpg`
- [ ] Pineapple 101: `cp public/photos_101/1.jpg og-source/pineapple-101.jpg`

### Step 3: Design Template (45-60 minutes)

Choose ONE design tool:

**Option A: Canva (Recommended for non-designers)**
- [ ] Go to https://www.canva.com/
- [ ] Create custom size: 1200 × 630px
- [ ] Upload hero image (unit-2528.jpg) as background
- [ ] Add text overlay:
  - Title: "Studio — Compact · Unit 2528"
  - Details: "Sleeps 2 · Queen Bed · Ground Floor"
  - Price: "From $49/night"
  - Footer: "silverpineapple.com · St. Croix, USVI"
- [ ] Add Silver Pineapple logo (top-left)
- [ ] Save as template

**Option B: Figma (For designers)**
- [ ] Open https://www.figma.com/community/file/1434530008829243090
- [ ] Duplicate "OG Image Pack 1" to your files
- [ ] Customize first template with:
  - Silver Pineapple branding (#D2B48C tan)
  - Unit 2528 hero photo
  - Property details
- [ ] Save as reusable component

**Option C: OG Studio (Fastest)**
- [ ] Go to https://ogstudio.app/
- [ ] Select "Real Estate" template
- [ ] Upload hero image
- [ ] Customize text fields
- [ ] Export as JPEG

### Step 4: Create First OG Image (30 minutes)

- [ ] Design OG image for Unit 2528 using template
- [ ] Export as JPEG (1200 × 630px)
- [ ] Save to: `/public/og-images/unit-2528.jpg`
- [ ] Check file size: `ls -lh public/og-images/unit-2528.jpg` (must be < 300 KB)
- [ ] If > 300 KB, compress at https://tinypng.com/

### Step 5: Replicate for All Units (60-90 minutes)

Using your template, create OG images for remaining 8 units:

- [ ] Unit 2536 → `/public/og-images/unit-2536.jpg`
  - Title: "Studio — Comfort · Unit 2536"
  - Details: "Sleeps 3 · Queen Bed · Upper Floor"
  - Price: "From $59/night"

- [ ] Unit 2538 → `/public/og-images/unit-2538.jpg`
  - Title: "Studio — Comfort · Unit 2538"
  - Details: "Sleeps 3 · King Bed · Upper Floor"
  - Price: "From $59/night"

- [ ] Pineapple 102 → `/public/og-images/pineapple-102.jpg`
  - Title: "1 Bedroom, 1 Bath · Pineapple 102"
  - Details: "Sleeps 4 · Queen Bed · Ground Floor"
  - Price: "From $69/night"

- [ ] Sea Grape 102 → `/public/og-images/sea-grape-102.jpg`
  - Title: "2 Bedroom, 1 Bath · Sea Grape 102"
  - Details: "Sleeps 6 · Queen + Queen + Sofa Bed"
  - Price: "From $79/night"

- [ ] Unit 2526 → `/public/og-images/unit-2526.jpg`
  - Title: "Studio - Compact · Unit 2526"
  - Details: "Sleeps 4 · Queen Bed · Upper Floor"
  - Price: "From $49/night"

- [ ] Pineapple 103 → `/public/og-images/pineapple-103.jpg`
  - Title: "Studio - Comfort · Pineapple 103"
  - Details: "Sleeps 2 · Queen Bed · Upper Floor"
  - Price: "From $59/night"

- [ ] Pineapple 104 → `/public/og-images/pineapple-104.jpg`
  - Title: "Studio - Comfort · Pineapple 104"
  - Details: "Sleeps 2 · Queen Bed · Upper Floor"
  - Price: "From $59/night"

- [ ] Pineapple 101 → `/public/og-images/pineapple-101.jpg`
  - Title: "Studio — Plus (Large) · Pineapple 101"
  - Details: "Sleeps 2 · Queen Bed · Upper Floor"
  - Price: "From $69/night"

### Step 6: Optimize All Images (15 minutes)

**Option A: Batch compression with TinyPNG**
- [ ] Go to https://tinypng.com/
- [ ] Upload all 9 JPEG files at once
- [ ] Download compressed versions
- [ ] Replace originals in `/public/og-images/`

**Option B: Command-line optimization (if Sharp installed)**
```bash
cd /Users/gabrielsambo/Desktop/SilverWebsite/GPT/silver-please/silce
npm install sharp-cli -g
sharp-cli -i public/og-images/*.jpg -o public/og-images/ --quality 85 --optimize
```

### Step 7: Update Metadata (30 minutes)

For each unit page, update metadata. Example for Unit 2528:

**File:** `/app/rooms/unit-2528/page.tsx`

Add this metadata export:

```tsx
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Studio - Compact · Unit 2528 | Silver Pineapple',
  description: 'Sleeps 2 · Queen Bed · Ground Floor · From $49/night. Book your stay at our boutique rental in St. Croix, USVI.',
  openGraph: {
    title: 'Studio - Compact · Unit 2528 | Silver Pineapple',
    description: 'Sleeps 2 · Queen Bed · Ground Floor · From $49/night',
    url: 'https://silverpineapple.com/rooms/unit-2528',
    siteName: 'Silver Pineapple',
    images: [
      {
        url: '/og-images/unit-2528.jpg',
        width: 1200,
        height: 630,
        alt: 'Studio - Compact · Unit 2528 - Silver Pineapple St. Croix',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Studio - Compact · Unit 2528 | Silver Pineapple',
    description: 'Sleeps 2 · From $49/night',
    images: ['/og-images/unit-2528.jpg'],
  },
}
```

Repeat for all 9 unit pages:

- [ ] `/app/rooms/unit-2528/page.tsx` - metadata updated
- [ ] `/app/rooms/unit-2536/page.tsx` - metadata updated
- [ ] `/app/rooms/unit-2538/page.tsx` - metadata updated
- [ ] `/app/rooms/pineapple-102/page.tsx` - metadata updated
- [ ] `/app/rooms/sea-grape-102/page.tsx` - metadata updated
- [ ] `/app/rooms/unit-2526/page.tsx` - metadata updated
- [ ] `/app/rooms/pineapple-103/page.tsx` - metadata updated
- [ ] `/app/rooms/pineapple-104/page.tsx` - metadata updated
- [ ] `/app/rooms/pineapple-101/page.tsx` - metadata updated

### Step 8: Testing (20 minutes)

- [ ] Build Next.js app: `npm run build`
- [ ] Start production server: `npm start`
- [ ] Visit each unit page in browser to verify metadata

Test OG images on social platforms:

- [ ] Unit 2528 - Facebook Debugger: https://developers.facebook.com/tools/debug/
  - Enter URL: `https://silverpineapple.com/rooms/unit-2528`
  - Click "Scrape Again" if needed
  - Verify image displays correctly (1200 × 630px)

- [ ] Unit 2528 - Twitter Card Validator: https://cards-dev.twitter.com/validator
  - Enter URL: `https://silverpineapple.com/rooms/unit-2528`
  - Verify "summary_large_image" card appears

- [ ] Unit 2528 - Meta Tags Preview: https://metatags.io/
  - Enter URL: `https://silverpineapple.com/rooms/unit-2528`
  - Check previews for Facebook, Twitter, LinkedIn, Slack

Spot-check 2-3 other units to ensure consistency:

- [ ] Unit 2536 - Facebook Debugger tested
- [ ] Pineapple 102 - Twitter Validator tested
- [ ] Sea Grape 102 - Meta Tags Preview tested

### Step 9: Deployment (10 minutes)

- [ ] Commit changes: `git add public/og-images/ app/rooms/*/page.tsx`
- [ ] Commit message: `feat: add OpenGraph images for all 9 properties`
- [ ] Push to repository: `git push origin main`
- [ ] Deploy to Vercel (auto-deploy if connected)
- [ ] Wait 2-3 minutes for deployment
- [ ] Re-test on Facebook Debugger with live URL

### Step 10: Final Validation (15 minutes)

- [ ] Share a unit page link on personal Facebook (check preview)
- [ ] Share a unit page link on personal Twitter (check card)
- [ ] Send link via WhatsApp (check thumbnail - may use square crop)
- [ ] Verify all 9 OG images are < 300 KB: `du -sh public/og-images/*`
- [ ] Document total file size (should be < 2 MB for all 9 images)

**Phase 1 Complete!** ✅

---

## Phase 2: Dynamic OG Images (4-6 hours)

### Step 1: Setup Dynamic OG Template (90 minutes)

- [ ] Create file: `/app/rooms/[slug]/opengraph-image.tsx`
- [ ] Copy template from `/PRPs/ai_docs/og-image-quick-reference.md`
- [ ] Customize design to match static version
- [ ] Test locally: `npm run dev`
- [ ] Visit: `http://localhost:3000/rooms/unit-2528/opengraph-image`
- [ ] Verify image renders correctly in browser

### Step 2: Add Custom Fonts (Optional - 60 minutes)

If using custom fonts (e.g., Inter, Poppins):

- [ ] Download font file (.ttf or .woff)
- [ ] Store in: `/app/assets/fonts/`
- [ ] Update `opengraph-image.tsx` to load font
- [ ] Test rendering with custom font

### Step 3: Integrate Property Photos (Optional - 45 minutes)

To display actual property photos instead of colored backgrounds:

- [ ] Research `next/image` integration with ImageResponse
- [ ] Test embedding `unit.images[0]` as background
- [ ] Handle image loading errors gracefully
- [ ] Compare file size vs. static images

### Step 4: Update Metadata References (30 minutes)

For each unit page, update OG image URL to use dynamic route:

**Before:**
```tsx
images: [{ url: '/og-images/unit-2528.jpg', ... }]
```

**After:**
```tsx
images: [{ url: '/rooms/unit-2528/opengraph-image', width: 1200, height: 630 }]
```

Update all 9 unit pages:

- [ ] `/app/rooms/unit-2528/page.tsx`
- [ ] `/app/rooms/unit-2536/page.tsx`
- [ ] `/app/rooms/unit-2538/page.tsx`
- [ ] `/app/rooms/pineapple-102/page.tsx`
- [ ] `/app/rooms/sea-grape-102/page.tsx`
- [ ] `/app/rooms/unit-2526/page.tsx`
- [ ] `/app/rooms/pineapple-103/page.tsx`
- [ ] `/app/rooms/pineapple-104/page.tsx`
- [ ] `/app/rooms/pineapple-101/page.tsx`

### Step 5: Build & Verify (20 minutes)

- [ ] Build app: `npm run build`
- [ ] Check for build errors (file size < 8 MB limit)
- [ ] Generated images stored in: `.next/server/app/rooms/[slug]/opengraph-image/`
- [ ] Measure total OG image size in build output

### Step 6: Testing (30 minutes)

- [ ] Test all 9 dynamic OG images locally
- [ ] Verify data accuracy (price, guest count, etc.)
- [ ] Check file sizes (should be similar to static)
- [ ] Compare visual quality to static images

### Step 7: Deploy & Validate (20 minutes)

- [ ] Commit changes: `git add app/rooms/[slug]/opengraph-image.tsx`
- [ ] Push to repository
- [ ] Deploy to Vercel
- [ ] Clear Facebook cache for all 9 URLs
- [ ] Re-validate on Twitter Card Validator

### Step 8: Performance Monitoring (15 minutes)

- [ ] Check Vercel Analytics for OG image generation time
- [ ] Monitor edge caching effectiveness
- [ ] Document any performance issues
- [ ] Compare load times: static vs. dynamic

**Phase 2 Complete!** ✅

---

## Phase 3: Advanced Optimization (Optional - 2-3 hours)

### Step 1: Create Square Fallback Images (60 minutes)

For messaging apps (WhatsApp, iMessage):

- [ ] Create 1200 × 1200px templates in Canva/Figma
- [ ] Export 9 square OG images
- [ ] Store in: `/public/og-images/square/`
- [ ] Add to metadata:
  ```tsx
  images: [
    { url: '/rooms/unit-2528/opengraph-image', width: 1200, height: 630 },
    { url: '/og-images/square/unit-2528.jpg', width: 1200, height: 1200 },
  ]
  ```

### Step 2: A/B Testing Setup (45 minutes)

Test different OG image designs:

- [ ] Create 2-3 variants of Unit 2528 OG image
- [ ] Track click-through rates from social shares
- [ ] Use Vercel Analytics or custom tracking
- [ ] Determine winning design
- [ ] Apply learnings to other units

### Step 3: Add Review Badges (30 minutes)

If you have review data:

- [ ] Design review badge overlay ("4.9★ · 127 reviews")
- [ ] Add to OG image template (top-right corner)
- [ ] Update all 9 OG images
- [ ] Test social proof impact on engagement

### Step 4: Seasonal Variants (45 minutes)

For holiday promotions:

- [ ] Create holiday-themed OG templates
- [ ] Add seasonal text ("Holiday Special - 20% Off")
- [ ] Schedule deployment during high seasons
- [ ] Revert to standard images after promotion

### Step 5: Locale Support (Optional - 60 minutes)

If targeting international markets:

- [ ] Create Spanish/French OG image variants
- [ ] Use Next.js i18n routing
- [ ] Generate locale-specific metadata
- [ ] Test on international social platforms

**Phase 3 Complete!** ✅

---

## Troubleshooting Common Issues

### Issue: OG Image Not Showing on Facebook

**Diagnosis:**
- [ ] Check Facebook Debugger: https://developers.facebook.com/tools/debug/
- [ ] Look for errors (file too large, wrong dimensions, etc.)

**Solutions:**
- [ ] Click "Scrape Again" to clear cache
- [ ] Verify image URL is publicly accessible (not localhost)
- [ ] Check file size < 8 MB
- [ ] Ensure image dimensions are exactly 1200 × 630px
- [ ] Verify no transparent background (use solid color)

### Issue: Twitter Card Not Rendering

**Diagnosis:**
- [ ] Check Twitter Card Validator: https://cards-dev.twitter.com/validator
- [ ] Look for validation errors

**Solutions:**
- [ ] Verify `twitter:card` is set to `summary_large_image`
- [ ] Check image file size < 5 MB
- [ ] Ensure HTTPS URL (not HTTP)
- [ ] Add `twitter:image:alt` for accessibility

### Issue: Build Fails with "OG Image Too Large"

**Diagnosis:**
- [ ] Check error message in build logs
- [ ] Identify which image exceeds 8 MB limit

**Solutions:**
- [ ] Reduce image quality in ImageResponse
- [ ] Simplify design (remove complex gradients)
- [ ] Use remote URLs instead of embedded images
- [ ] Optimize font files (subset only needed characters)

### Issue: OG Image Shows Wrong Data

**Diagnosis:**
- [ ] Verify slug matches in UNITS array
- [ ] Check for typos in params.slug

**Solutions:**
- [ ] Clear Next.js cache: `rm -rf .next`
- [ ] Rebuild: `npm run build`
- [ ] Add fallback handling:
  ```tsx
  if (!unit) {
    return <DefaultOGImage />
  }
  ```

### Issue: File Size Too Large (> 300 KB)

**Solutions:**
- [ ] Compress with TinyPNG: https://tinypng.com/
- [ ] Reduce JPEG quality to 80%
- [ ] Remove unnecessary design elements
- [ ] Use simpler gradients
- [ ] Resize to exact dimensions (no upscaling)

---

## Success Metrics

Track these KPIs to measure OG image impact:

### Engagement Metrics
- [ ] Click-through rate (CTR) from social shares (baseline: 2-5%)
- [ ] Facebook link preview engagement (likes, comments, shares)
- [ ] Twitter card interactions (retweets, likes)
- [ ] LinkedIn post performance (if applicable)

### Technical Metrics
- [ ] Average OG image file size: _______ KB (target: < 150 KB)
- [ ] Total OG images storage: _______ MB (target: < 2 MB for 9 images)
- [ ] Build time increase: _______ seconds (if using dynamic generation)
- [ ] Page load time impact: _______ ms (should be negligible)

### SEO Metrics
- [ ] Social sharing volume (track via analytics)
- [ ] Referral traffic from social platforms
- [ ] Bounce rate from social visitors (compare before/after)
- [ ] Booking conversions from social referrals

---

## Maintenance Schedule

### Weekly
- [ ] Monitor social shares (check for broken images)
- [ ] Review click-through rates from social platforms

### Monthly
- [ ] Update OG images if pricing changes significantly
- [ ] Check for new platform requirements (Twitter, Facebook updates)
- [ ] Optimize images if file sizes creep up

### Quarterly
- [ ] A/B test new OG image designs
- [ ] Review competitor OG strategies
- [ ] Update seasonal variants (holidays, peak season)

### Annually
- [ ] Refresh OG images with new property photos
- [ ] Update branding if redesign occurs
- [ ] Audit all 9 units for consistency

---

## Resources Quick Links

**Testing Tools:**
- Facebook Debugger: https://developers.facebook.com/tools/debug/
- Twitter Validator: https://cards-dev.twitter.com/validator
- Meta Tags Preview: https://metatags.io/

**Design Tools:**
- Canva: https://www.canva.com/
- Figma Community: https://www.figma.com/community/search?q=og%20image
- OG Studio: https://ogstudio.app/

**Optimization Tools:**
- TinyPNG: https://tinypng.com/
- Squoosh: https://squoosh.app/
- ImageOptim: https://imageoptim.com/ (macOS)

**Documentation:**
- Next.js OG Images: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image
- Full Guide: `/PRPs/ai_docs/og-image-best-practices.md`
- Quick Reference: `/PRPs/ai_docs/og-image-quick-reference.md`

---

## Final Pre-Launch Checklist

Before going live with OG images:

### Technical Validation
- [ ] All 9 OG images created and optimized
- [ ] File sizes verified (< 300 KB each)
- [ ] Dimensions verified (1200 × 630px exactly)
- [ ] Metadata added to all 9 unit pages
- [ ] Build successful (`npm run build` passes)
- [ ] No console errors in browser

### Content Validation
- [ ] Property names match unit data exactly
- [ ] Prices are current and accurate
- [ ] Guest capacity correct for each unit
- [ ] Floor information accurate
- [ ] Brand colors consistent (#D2B48C, #1a1a1a)
- [ ] Logo visible and high-quality

### Platform Validation
- [ ] Tested on Facebook Debugger (3+ units)
- [ ] Tested on Twitter Card Validator (3+ units)
- [ ] Previewed on Meta Tags (1+ unit)
- [ ] Mobile preview legible (text size ≥ 48px)
- [ ] Desktop preview professional

### Deployment Validation
- [ ] Git repository up to date
- [ ] All OG images committed
- [ ] Deployed to production (Vercel)
- [ ] Live URLs tested on social platforms
- [ ] Cache cleared on Facebook/Twitter

### Documentation
- [ ] Implementation notes documented
- [ ] File sizes logged for future reference
- [ ] Known issues documented (if any)
- [ ] Maintenance schedule established

---

**Estimated Total Time:**
- **Phase 1 (Static):** 2-4 hours
- **Phase 2 (Dynamic):** 4-6 hours
- **Phase 3 (Advanced):** 2-3 hours (optional)

**Recommended Approach for Silver Pineapple:**
Start with Phase 1 (static images) for immediate impact, then migrate to Phase 2 (dynamic) for long-term scalability.

---

**Checklist Version:** 1.0
**Last Updated:** October 2025
**Project:** Silver Pineapple Boutique Rentals
