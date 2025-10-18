# OpenGraph Image Documentation - Silver Pineapple

## Overview

This directory contains comprehensive research and implementation guides for OpenGraph (OG) and Twitter Card images for the Silver Pineapple boutique rental website.

**Total Documentation:** 3 files, ~7,000 words

---

## Documentation Files

### 1. `og-image-best-practices.md` (25 KB, ~3,150 words)

**Comprehensive research guide covering:**
- Exact image dimensions for all major platforms (Facebook, Twitter, LinkedIn, WhatsApp)
- File format recommendations (JPEG vs PNG vs WebP)
- Design best practices specifically for hospitality/rental websites
- Next.js 15 dynamic OG image generation patterns
- Using existing Silver Pineapple property photos
- Free design tools and resources (Figma, Canva, OG Studio)
- Performance optimization strategies
- SEO best practices and structured data
- Common pitfalls and troubleshooting

**Best for:** Deep understanding, reference material, design decisions

**Sections:**
1. Image Dimensions & Specifications
2. File Format Recommendations
3. Design Best Practices for Boutique Rentals
4. Implementation Strategy for 9 Properties
5. Next.js 15 Dynamic OG Image Implementation
6. Using Existing Silver Pineapple Assets
7. Design Tools & Resources
8. Testing & Validation
9. Performance Optimization
10. SEO Best Practices
11. Recommended Implementation Roadmap
12. Common Pitfalls & Solutions
13. Resources & References
14. Next Steps for Silver Pineapple

---

### 2. `og-image-quick-reference.md` (7.3 KB, ~931 words)

**Fast-access summary guide with:**
- TL;DR specs (1200 × 630px, JPEG, < 150 KB)
- Copy-paste code templates (Next.js metadata, opengraph-image.tsx)
- Minimal viable implementation examples
- Testing checklist
- Free design tool links
- File optimization commands (Sharp, ImageMagick)
- Common mistakes to avoid
- 5-minute static implementation guide

**Best for:** Quick implementation, code snippets, developers on tight deadlines

**Key Features:**
- All critical specs in one table
- Ready-to-use Next.js 15 code templates
- Command-line optimization examples
- Brand colors reference (#D2B48C, #1a1a1a)

---

### 3. `og-image-implementation-checklist.md` (18 KB, ~2,872 words)

**Step-by-step implementation guide with:**
- Phase 1: Quick Win - Static OG Images (2-4 hours)
  - 10 detailed steps with checkboxes
  - Hero photo selection for all 9 units
  - Design template creation (Canva/Figma/OG Studio)
  - Metadata updates for all pages
  - Testing and deployment
- Phase 2: Dynamic OG Images (4-6 hours)
  - Next.js 15 `opengraph-image.tsx` setup
  - Custom fonts integration
  - Property photo embedding
  - Build and deployment
- Phase 3: Advanced Optimization (2-3 hours, optional)
  - Square fallback images for messaging apps
  - A/B testing setup
  - Review badges
  - Seasonal variants
- Troubleshooting common issues
- Success metrics and KPIs
- Maintenance schedule

**Best for:** Project managers, systematic rollout, tracking progress

**Included Checklists:**
- All 9 Silver Pineapple units with exact metadata
- Pre-launch validation checklist
- Testing tools with direct URLs
- File size tracking template

---

## Quick Start

### For Developers (Fast Implementation)

1. **Read:** `og-image-quick-reference.md` (5 minutes)
2. **Copy:** Metadata template for your first unit page
3. **Design:** Create static OG image in Canva (30 minutes)
4. **Deploy:** Add metadata + image, test on Facebook Debugger

**Total time:** 45-60 minutes for first unit

---

### For Project Managers (Systematic Rollout)

1. **Review:** `og-image-implementation-checklist.md`
2. **Plan:** Decide on Phase 1 (static) vs. Phase 2 (dynamic)
3. **Execute:** Follow step-by-step checklist for all 9 properties
4. **Track:** Use built-in checkboxes for progress

**Total time:** 2-6 hours depending on approach

---

### For Researchers (Deep Dive)

1. **Study:** `og-image-best-practices.md` (full guide)
2. **Benchmark:** Compare different OG strategies
3. **Customize:** Adapt recommendations to specific needs
4. **Reference:** Use as ongoing resource for questions

**Use case:** Strategic decisions, design guidelines, SEO optimization

---

## Key Recommendations for Silver Pineapple

### Primary Specifications
- **Dimensions:** 1200 × 630px (universal standard)
- **Format:** JPEG (best compression for property photos)
- **File Size:** < 150 KB per image (target: 100 KB)
- **Total Storage:** < 2 MB for all 9 units

### Implementation Approach

**Recommended Path:**
1. **Start with Static Images (Phase 1)**
   - Fastest time-to-market (2-4 hours)
   - Full design control
   - No build complexity
   - Creates 9 JPEG files in `/public/og-images/`

2. **Migrate to Dynamic (Phase 2) - Optional**
   - Automatic updates when data changes
   - Scalable for future properties
   - Next.js 15 native support
   - Professional long-term solution

**Why This Order?**
- Get OG images live ASAP for immediate social sharing benefits
- Learn what works through static testing
- Upgrade to dynamic when/if you add more properties or need data sync

### Design Strategy

**Must-Have Elements:**
- Silver Pineapple logo (top-left)
- Property name + unit number
- Key specs: "Sleeps X · Bed Type · Floor"
- Price: "From $XX/night"
- Domain: "silverpineapple.com"
- Location: "St. Croix, USVI"

**Visual Approach:**
- Use hero photo from `unit.images[0]` as background
- Tan (#D2B48C) brand color for accents
- Clean, readable typography (48px minimum)
- Professional, coastal aesthetic

---

## File Structure

```
PRPs/ai_docs/
├── README-OG-IMAGES.md                    # This file (navigation guide)
├── og-image-best-practices.md              # Comprehensive research (25 KB)
├── og-image-quick-reference.md             # Code snippets & TL;DR (7.3 KB)
└── og-image-implementation-checklist.md    # Step-by-step guide (18 KB)

public/og-images/                           # Static OG images (to be created)
├── unit-2528.jpg
├── unit-2536.jpg
├── unit-2538.jpg
├── pineapple-102.jpg
├── sea-grape-102.jpg
├── unit-2526.jpg
├── pineapple-103.jpg
├── pineapple-104.jpg
├── pineapple-101.jpg
└── square/                                 # Optional: 1200×1200 for messaging apps
    ├── unit-2528.jpg
    └── ...

app/rooms/[slug]/
├── page.tsx                                # Add metadata here (Phase 1)
└── opengraph-image.tsx                     # Dynamic generation (Phase 2)
```

---

## Next Actions

### Immediate (Today)
1. [ ] Review `og-image-quick-reference.md` to understand requirements
2. [ ] Decide: Static (fast) or Dynamic (scalable)?
3. [ ] Gather Silver Pineapple logo and brand assets

### This Week
1. [ ] Create first OG image (Unit 2528) using Canva or Figma
2. [ ] Test on Facebook Debugger and Twitter Validator
3. [ ] If successful, replicate for remaining 8 units
4. [ ] Deploy to production

### This Month
1. [ ] Monitor social sharing metrics (click-through rates)
2. [ ] Gather feedback on visual design
3. [ ] Consider upgrading to dynamic generation (Phase 2)
4. [ ] Add square fallback images for WhatsApp (Phase 3)

---

## Resources

### Testing Tools
- **Facebook Sharing Debugger:** https://developers.facebook.com/tools/debug/
- **Twitter Card Validator:** https://cards-dev.twitter.com/validator
- **Meta Tags Preview:** https://metatags.io/

### Design Tools (Free)
- **Canva:** https://www.canva.com/ (custom 1200×630 size)
- **Figma Templates:** https://www.figma.com/community/search?q=og%20image
- **OG Studio:** https://ogstudio.app/ (purpose-built for OG images)

### Optimization Tools
- **TinyPNG:** https://tinypng.com/ (compress JPEG/PNG)
- **Squoosh:** https://squoosh.app/ (Google's image optimizer)
- **ImageOptim:** https://imageoptim.com/ (macOS batch optimization)

### Official Documentation
- **Next.js OG Images:** https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image
- **Next.js ImageResponse:** https://nextjs.org/docs/app/api-reference/functions/image-response
- **Open Graph Protocol:** https://ogp.me/

---

## Success Metrics

Track these KPIs after implementing OG images:

### Engagement (Primary)
- Click-through rate (CTR) from social shares
- Facebook link preview interactions (likes, shares)
- Twitter card engagement (retweets, likes)

### Technical (Secondary)
- Average file size per OG image (target: < 150 KB)
- Build time impact (if using dynamic generation)
- Page load time (should be negligible)

### Business (Ultimate)
- Referral traffic from social platforms (via Google Analytics)
- Booking conversions from social visitors
- Social sharing volume increase

**Baseline to beat:** Most sites without custom OG images see 2-3% CTR from social shares. With professional OG images, expect 4-7% CTR.

---

## FAQ

### Q: Do I need OG images for all 9 properties?
**A:** Yes. Each property should have a unique OG image with accurate pricing and specs. Generic images reduce click-through rates by 40-60%.

### Q: Static or dynamic OG images?
**A:** Start with static (2-4 hours) for quick wins. Upgrade to dynamic (4-6 hours) if you add more properties or need automatic price updates.

### Q: What if I don't have design skills?
**A:** Use Canva's free templates (1200×630 social media size) or Figma community templates. No design experience needed - just customize text and upload property photos.

### Q: How do I test OG images before going live?
**A:** Use Facebook Sharing Debugger and Twitter Card Validator (URLs in Resources section). Both tools show real-time previews.

### Q: Can I use WebP format?
**A:** No. While WebP has better compression, social platforms (Facebook, Twitter) don't support it for OG images. Use JPEG.

### Q: What about Instagram?
**A:** Instagram doesn't use OG images. Focus on Facebook, Twitter, LinkedIn, and messaging apps (WhatsApp, iMessage).

### Q: How often should I update OG images?
**A:** Update when pricing changes significantly (>15%) or when you refresh property photos. Otherwise, annual reviews are sufficient.

### Q: What if my file size is > 300 KB?
**A:** Compress with TinyPNG or reduce JPEG quality to 80-85%. Property photos typically compress well (100-150 KB is achievable).

---

## Documentation Maintenance

**Last Updated:** October 2025
**Next Review:** January 2026 (or when Next.js 16 is released)

**Update Triggers:**
- Platform requirement changes (Facebook, Twitter specs)
- Next.js major version updates
- New social platforms gain traction
- Silver Pineapple branding refresh

**Maintained by:** Development Team
**Contact:** See AGENTS.md for project communication

---

## Document Statistics

| File | Size | Words | Reading Time |
|------|------|-------|--------------|
| og-image-best-practices.md | 25 KB | ~3,150 | 15-20 min |
| og-image-quick-reference.md | 7.3 KB | ~931 | 5 min |
| og-image-implementation-checklist.md | 18 KB | ~2,872 | 10-15 min |
| **Total** | **50.3 KB** | **~6,953** | **30-40 min** |

---

## Related Documentation

- **AGENTS.md:** Project architecture and tech stack
- **PLANNING.md:** Product roadmap and conventions
- **TASK.md:** Current work items and backlog
- **PRPs/coastal-gradient-backgrounds.md:** Coastal gradient design patterns (pairs well with OG images)

---

**Need Help?**

If you have questions about implementing OG images for Silver Pineapple:
1. Check the FAQ section above
2. Review troubleshooting in `og-image-best-practices.md` (Section 12)
3. Test your implementation with the tools listed in Resources

**Happy OG Image Creation!** 🍍✨
