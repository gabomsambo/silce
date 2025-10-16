# Tailwind CSS Gradient Reference Guide

Complete reference for implementing gradients in Tailwind CSS, including syntax, examples, performance considerations, and best practices.

---

## Table of Contents

1. [Linear Gradients](#linear-gradients)
2. [Radial Gradients](#radial-gradients)
3. [Conic Gradients](#conic-gradients)
4. [Color Stop Utilities](#color-stop-utilities)
5. [Opacity Modifiers](#opacity-modifiers)
6. [Backdrop Blur Combinations](#backdrop-blur-combinations)
7. [Responsive Gradients](#responsive-gradients)
8. [Dark Mode Gradients](#dark-mode-gradients)
9. [Performance Best Practices](#performance-best-practices)
10. [Browser Compatibility](#browser-compatibility)

---

## Linear Gradients

### Basic Syntax

Linear gradients use `bg-linear-to-{direction}` utilities with color stop classes.

```html
<!-- Horizontal gradient (left to right) -->
<div class="bg-linear-to-r from-cyan-500 to-blue-500">
  Content here
</div>

<!-- Vertical gradient (top to bottom) -->
<div class="bg-linear-to-b from-purple-400 to-pink-600">
  Content here
</div>

<!-- Diagonal gradient (top-left to bottom-right) -->
<div class="bg-linear-to-br from-green-400 to-blue-500">
  Content here
</div>
```

### Available Directions

| Utility | Direction | CSS Equivalent |
|---------|-----------|----------------|
| `bg-linear-to-t` | Bottom to top | `to top` |
| `bg-linear-to-tr` | Bottom-left to top-right | `to top right` |
| `bg-linear-to-r` | Left to right | `to right` |
| `bg-linear-to-br` | Top-left to bottom-right | `to bottom right` |
| `bg-linear-to-b` | Top to bottom | `to bottom` |
| `bg-linear-to-bl` | Top-right to bottom-left | `to bottom left` |
| `bg-linear-to-l` | Right to left | `to left` |
| `bg-linear-to-tl` | Bottom-right to top-left | `to top left` |

### Custom Angles

Tailwind CSS v4.0+ supports custom angle values:

```html
<!-- 45 degree angle -->
<div class="bg-linear-45 from-red-500 to-yellow-500">
  Content here
</div>

<!-- Custom angle using arbitrary values -->
<div class="bg-linear-[133deg] from-blue-600 to-violet-600">
  Content here
</div>
```

### Multiple Color Stops

Use `via-{color}` to add intermediate colors:

```html
<!-- Three color gradient -->
<div class="bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500">
  Content here
</div>

<!-- Multiple via colors -->
<div class="bg-linear-to-r from-red-500 via-yellow-500 via-green-500 to-blue-500">
  Content here
</div>
```

---

## Radial Gradients

### Basic Syntax

Radial gradients use `bg-radial` with color stop utilities:

```html
<!-- Basic radial gradient (centered) -->
<div class="bg-radial from-pink-400 to-fuchsia-700">
  Content here
</div>

<!-- Radial gradient with percentage stops -->
<div class="bg-radial from-pink-400 from-40% to-fuchsia-700">
  Content here
</div>
```

### Custom Positioning

Position radial gradients using `bg-radial-[at_{position}]`:

```html
<!-- Center-bottom position -->
<div class="bg-radial-[at_50%_75%] from-sky-200 via-blue-400 to-indigo-900">
  Content here
</div>

<!-- Top-left position -->
<div class="bg-radial-[at_25%_25%] from-white to-zinc-900 to-75%">
  Content here
</div>

<!-- Bottom-right position -->
<div class="bg-radial-[at_75%_75%] from-yellow-200 to-orange-600">
  Content here
</div>
```

### Using Gradient Stops Variable

For more flexibility, use CSS gradient stops variable:

```html
<div class="bg-[radial-gradient(closest-side,var(--tw-gradient-stops))] from-amber-300 via-rose-500 to-purple-900">
  Content here
</div>
```

### Radial Gradient Shapes

```html
<!-- Closest side -->
<div class="bg-[radial-gradient(closest-side,theme(colors.rose.100),theme(colors.pink.400))]">
  Content here
</div>

<!-- Farthest corner -->
<div class="bg-[radial-gradient(farthest-corner,var(--tw-gradient-stops))] from-teal-400 to-blue-800">
  Content here
</div>
```

---

## Conic Gradients

### Basic Syntax

Conic gradients use `bg-conic` and `bg-conic-{angle}` utilities:

```html
<!-- Basic conic gradient -->
<div class="bg-conic from-blue-600 to-sky-400 to-50%">
  Content here
</div>

<!-- Conic gradient starting at 180 degrees -->
<div class="bg-conic-180 from-indigo-600 via-indigo-50 to-indigo-600">
  Content here
</div>
```

### Interpolation Modifiers

Control how colors transition in conic gradients:

```html
<!-- Decreasing path -->
<div class="bg-conic/decreasing from-violet-700 via-lime-300 to-violet-700">
  Content here
</div>

<!-- Longer path -->
<div class="bg-conic/longer from-red-500 via-yellow-500 to-blue-500">
  Content here
</div>
```

### Arbitrary Value Syntax

```html
<!-- Custom conic gradient -->
<div class="bg-[conic-gradient(#9233ea,#db2777,#2564eb)]">
  Content here
</div>

<!-- With gradient stops variable -->
<div class="bg-[conic-gradient(var(--tw-gradient-stops))] from-pink-500 via-purple-500 to-blue-500">
  Content here
</div>
```

### Creating Pie Charts & Spinners

```html
<!-- Color wheel effect -->
<div class="bg-conic from-red-500 via-yellow-500 via-green-500 via-blue-500 to-red-500">
  Content here
</div>

<!-- Loading spinner gradient -->
<div class="bg-conic from-transparent via-blue-600 to-transparent animate-spin">
  Content here
</div>
```

---

## Color Stop Utilities

### Basic Color Stops

| Utility | Purpose | Example |
|---------|---------|---------|
| `from-{color}` | Starting color | `from-blue-500` |
| `via-{color}` | Middle color(s) | `via-purple-500` |
| `to-{color}` | Ending color | `to-pink-500` |

### Position Control

Control where color stops occur using percentage modifiers:

```html
<!-- Basic positioning -->
<div class="bg-linear-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90%">
  Content here
</div>

<!-- Sharp color transitions -->
<div class="bg-linear-to-r from-red-500 from-50% to-blue-500 to-50%">
  Content here (hard edge)
</div>
```

### Custom Color Values

Use arbitrary values for custom colors:

```html
<!-- Hex colors -->
<div class="bg-linear-to-r from-[#FF6B6B] to-[#4ECDC4]">
  Content here
</div>

<!-- RGB colors -->
<div class="bg-linear-to-r from-[rgb(255,107,107)] to-[rgb(78,205,196)]">
  Content here
</div>
```

### CSS Custom Properties

Use CSS variables with gradient stops:

```html
<div class="bg-linear-to-r from-(--brand-primary) to-(--brand-secondary)">
  Content here
</div>
```

---

## Opacity Modifiers

### Applying Opacity to Color Stops

Use `/{opacity}` modifier to control transparency (Tailwind v3.0+):

```html
<!-- 20% opacity -->
<div class="bg-linear-to-r from-blue-500/20 to-purple-600/20">
  Content here
</div>

<!-- Mixed opacity levels -->
<div class="bg-linear-to-r from-red-500/100 via-yellow-500/50 to-blue-500/10">
  Content here
</div>
```

### Opacity Scale Recommendations

| Opacity Value | Use Case | Visual Effect |
|---------------|----------|---------------|
| `/10` | Extremely subtle | Barely visible tint |
| `/20` | Very subtle | Light overlay effect |
| `/30` | Subtle | Gentle background gradient |
| `/40` | Light | Noticeable but soft |
| `/50` | Medium | Balanced transparency |
| `/60` | Medium-strong | Clear overlay |
| `/70` | Strong | Prominent gradient |
| `/80` | Very strong | Almost opaque |
| `/90` | Nearly opaque | Minimal transparency |
| `/100` | Fully opaque | No transparency (default) |

### Practical Examples

```html
<!-- Subtle overlay on image -->
<div class="relative">
  <img src="hero.jpg" alt="Hero" />
  <div class="absolute inset-0 bg-linear-to-b from-black/10 to-black/50">
    <h1 class="text-white">Overlay Text</h1>
  </div>
</div>

<!-- Glassmorphism card background -->
<div class="bg-linear-to-br from-white/20 to-white/5 backdrop-blur-md">
  Content here
</div>

<!-- Hover effect with opacity -->
<button class="bg-linear-to-r from-blue-600/80 to-purple-600/80
               hover:from-blue-600/100 hover:to-purple-600/100
               transition-all">
  Hover Me
</button>
```

### Transparent Gradients

Use `from-transparent` or `to-transparent` for fade effects:

```html
<!-- Fade to transparent -->
<div class="bg-linear-to-r from-blue-500 to-transparent">
  Content here
</div>

<!-- Fade in and out -->
<div class="bg-linear-to-r from-transparent via-purple-500 to-transparent">
  Content here
</div>
```

---

## Backdrop Blur Combinations

### Basic Backdrop Blur with Gradients

Combine backdrop-blur with semi-transparent gradients for glassmorphism effects:

```html
<!-- Classic glassmorphism -->
<div class="bg-white/30 backdrop-blur-md">
  Content here
</div>

<!-- Gradient glassmorphism -->
<div class="bg-linear-to-br from-white/20 to-white/5 backdrop-blur-lg">
  Content here
</div>
```

### Available Backdrop Blur Classes

| Utility | Blur Amount | Use Case |
|---------|-------------|----------|
| `backdrop-blur-xs` | 4px | Very subtle blur |
| `backdrop-blur-sm` | 8px | Subtle blur |
| `backdrop-blur-md` | 12px | Medium blur (default for glassmorphism) |
| `backdrop-blur-lg` | 16px | Strong blur |
| `backdrop-blur-xl` | 24px | Very strong blur |
| `backdrop-blur-2xl` | 40px | Extreme blur |
| `backdrop-blur-3xl` | 64px | Maximum blur |
| `backdrop-blur-none` | 0px | Remove blur |

### Complex Glassmorphism Examples

```html
<!-- Frosted glass card -->
<div class="bg-gradient-to-br from-white/25 via-white/15 to-transparent
            backdrop-blur-xl border border-white/20 rounded-lg shadow-xl">
  <h3>Card Title</h3>
  <p>Card content with frosted glass effect</p>
</div>

<!-- Navigation bar with blur -->
<nav class="fixed top-0 w-full
            bg-linear-to-r from-gray-900/80 to-gray-800/80
            backdrop-blur-md border-b border-white/10">
  <!-- Navigation content -->
</nav>

<!-- Modal overlay with gradient blur -->
<div class="fixed inset-0
            bg-linear-to-b from-black/50 via-black/60 to-black/70
            backdrop-blur-sm">
  <!-- Modal content -->
</div>
```

### Advanced Techniques

```html
<!-- Blurred gradient background effect (like tailwindcss.com) -->
<div class="relative">
  <div class="absolute inset-0
              bg-linear-to-tr from-indigo-400 via-teal-900 to-[#C084FC]
              blur-[118px] opacity-70">
  </div>
  <div class="relative">
    <!-- Content with blurred gradient background -->
  </div>
</div>

<!-- Layered blur effects -->
<div class="relative">
  <!-- Background layer -->
  <div class="absolute inset-0 bg-blue-500/20 blur-3xl"></div>
  <!-- Middle layer -->
  <div class="absolute inset-0
              bg-linear-to-br from-purple-500/30 to-pink-500/30
              backdrop-blur-lg">
  </div>
  <!-- Content layer -->
  <div class="relative z-10">
    Content here
  </div>
</div>
```

### Custom Backdrop Blur Values

```html
<!-- Custom blur amount -->
<div class="backdrop-blur-[2px]">Minimal blur</div>
<div class="backdrop-blur-[50px]">Heavy blur</div>

<!-- Using CSS variables -->
<div class="backdrop-blur-(--custom-blur)">Variable blur</div>
```

---

## Responsive Gradients

### Mobile-First Approach

Tailwind uses mobile-first breakpoints where unprefixed utilities apply to all screen sizes:

```html
<!-- Mobile: Blue gradient, Tablet: Green gradient, Desktop: Pink gradient -->
<div class="bg-linear-to-r from-blue-500 to-purple-600
            md:bg-linear-to-br md:from-green-400 md:to-blue-500
            lg:bg-linear-to-l lg:from-pink-500 lg:to-yellow-500">
  Content here
</div>
```

### Default Breakpoints

| Prefix | Min Width | Description |
|--------|-----------|-------------|
| `sm:` | 640px | Small devices (landscape phones) |
| `md:` | 768px | Medium devices (tablets) |
| `lg:` | 1024px | Large devices (laptops) |
| `xl:` | 1280px | Extra large devices (desktops) |
| `2xl:` | 1536px | 2X extra large devices (large desktops) |

### Practical Responsive Examples

```html
<!-- Simpler gradient on mobile, complex on desktop -->
<div class="bg-linear-to-b from-gray-50 to-gray-100
            lg:bg-linear-to-br lg:from-purple-50 lg:via-pink-50 lg:to-yellow-50">
  Content here
</div>

<!-- Vertical on mobile, horizontal on desktop -->
<div class="bg-linear-to-b from-blue-400 to-blue-600
            md:bg-linear-to-r">
  Content here
</div>

<!-- Different opacity at different sizes -->
<div class="bg-linear-to-r from-blue-500/50 to-purple-600/50
            lg:from-blue-500/80 lg:to-purple-600/80">
  Content here
</div>

<!-- No gradient on mobile, gradient on desktop -->
<div class="bg-gray-100
            md:bg-transparent md:bg-linear-to-r md:from-indigo-500 md:to-purple-600">
  Content here
</div>
```

### Responsive Color Stops

```html
<!-- Different color stops at different breakpoints -->
<div class="bg-linear-to-r
            from-red-500 via-orange-500 to-yellow-500
            md:from-blue-500 md:via-indigo-500 md:to-purple-500
            lg:from-green-500 lg:via-teal-500 lg:to-cyan-500">
  Content here
</div>
```

### Responsive Backdrop Blur with Gradients

```html
<!-- Less blur on mobile for performance -->
<div class="bg-white/20 backdrop-blur-sm
            md:bg-white/30 md:backdrop-blur-md
            lg:bg-linear-to-br lg:from-white/40 lg:to-white/20 lg:backdrop-blur-lg">
  Content here
</div>
```

---

## Dark Mode Gradients

### Enabling Dark Mode

Configure in `tailwind.config.js`:

```javascript
module.exports = {
  darkMode: 'class', // or 'media' for system preference
  // ... rest of config
}
```

### Basic Dark Mode Syntax

Use `dark:` prefix to apply gradients in dark mode:

```html
<!-- Light mode: Blue gradient, Dark mode: Purple gradient -->
<div class="bg-linear-to-r from-blue-400 to-blue-600
            dark:from-purple-700 dark:to-purple-900">
  Content here
</div>
```

### Best Practices for Dark Mode Gradients

#### 1. Background-Image vs Background-Color Conflict

Gradients use `background-image`, which can conflict with `background-color`. Solution:

```html
<!-- Use dark:bg-transparent when switching from solid to gradient -->
<div class="bg-pink-100
            dark:bg-transparent dark:bg-linear-to-r dark:from-blue-500 dark:to-purple-700">
  Content here
</div>
```

#### 2. Adjusting Gradient Darkness

Light mode gradients should be lighter; dark mode gradients should be darker:

```html
<!-- Properly adjusted for both modes -->
<div class="bg-linear-to-b from-gray-100 via-purple-50 to-gray-50
            dark:from-gray-800 dark:via-purple-900 dark:to-gray-900">
  Content here
</div>
```

#### 3. Individual Color Stop Control

```html
<!-- Fine-grained control over each color stop -->
<div class="bg-linear-to-r
            from-indigo-500 via-purple-500 to-pink-500
            dark:from-indigo-700 dark:via-purple-700 dark:to-pink-700">
  Content here
</div>
```

### Common Dark Mode Gradient Patterns

```html
<!-- Hero section gradient -->
<section class="bg-linear-to-br from-blue-50 to-indigo-100
                dark:from-gray-900 dark:to-indigo-950">
  Content here
</section>

<!-- Card with subtle gradient -->
<div class="bg-linear-to-br from-white to-gray-50
            dark:from-gray-800 dark:to-gray-900
            border border-gray-200 dark:border-gray-700">
  Card content
</div>

<!-- Button with gradient -->
<button class="bg-linear-to-r from-blue-500 to-purple-600
               dark:from-blue-600 dark:to-purple-700
               hover:from-blue-600 hover:to-purple-700
               dark:hover:from-blue-700 dark:hover:to-purple-800">
  Click Me
</button>
```

### Dark Mode with Opacity

```html
<!-- Adjusted opacity for dark mode -->
<div class="bg-linear-to-r from-blue-500/30 to-purple-600/30
            dark:from-blue-400/20 dark:to-purple-500/20">
  Content here
</div>
```

### Dark Mode with Backdrop Blur

```html
<!-- Glassmorphism for both modes -->
<div class="bg-white/30 backdrop-blur-md
            dark:bg-gray-800/30 dark:backdrop-blur-lg">
  Content here
</div>

<!-- Gradient glassmorphism -->
<div class="bg-linear-to-br from-white/25 to-gray-100/10 backdrop-blur-xl
            dark:from-gray-800/40 dark:to-gray-900/10 dark:backdrop-blur-2xl">
  Content here
</div>
```

### Combining Dark Mode with Responsive Gradients

```html
<!-- Responsive and dark mode aware -->
<div class="bg-linear-to-b from-gray-50 to-gray-100
            dark:from-gray-800 dark:to-gray-900
            md:bg-linear-to-r
            lg:from-purple-50 lg:to-pink-50
            lg:dark:from-purple-900 lg:dark:to-pink-900">
  Content here
</div>
```

### CSS Variables Approach

For automatic theme switching without manual `dark:` prefixes:

```css
/* In your CSS file */
:root {
  --gradient-start: theme('colors.blue.400');
  --gradient-end: theme('colors.purple.600');
}

.dark {
  --gradient-start: theme('colors.blue.700');
  --gradient-end: theme('colors.purple.900');
}
```

```html
<!-- HTML using CSS variables -->
<div class="bg-linear-to-r from-(--gradient-start) to-(--gradient-end)">
  Content here
</div>
```

### Variant Stacking with Dark Mode

```html
<!-- Hover effect only in dark mode -->
<div class="dark:hover:bg-linear-to-r dark:hover:from-blue-500 dark:hover:to-purple-600">
  Content here
</div>

<!-- Dark mode at specific breakpoint -->
<div class="lg:dark:bg-linear-to-br lg:dark:from-indigo-900 lg:dark:to-purple-900">
  Content here
</div>
```

---

## Performance Best Practices

### 1. Keep Gradients Simple

**Good:**
```html
<div class="bg-linear-to-r from-blue-500 to-purple-600">
  Content here
</div>
```

**Avoid (if not necessary):**
```html
<div class="bg-linear-to-r from-blue-500 from-0% via-indigo-500 via-20% via-purple-500 via-40% via-pink-500 via-60% via-red-500 via-80% to-orange-500 to-100%">
  Content here
</div>
```

### 2. Use Subtle Gradients for Better Visual Design

Subtle gradients are:
- More professional looking
- Easier on the eyes
- Less distracting
- Better for accessibility

```html
<!-- Subtle, professional gradient -->
<div class="bg-linear-to-b from-gray-50 to-gray-100">
  Content here
</div>

<!-- Too aggressive (use sparingly) -->
<div class="bg-linear-to-r from-red-500 via-yellow-500 to-blue-500">
  Content here
</div>
```

### 3. Optimize for Mobile

Use simpler gradients on mobile devices for better performance:

```html
<!-- Simple on mobile, complex on desktop -->
<div class="bg-linear-to-b from-blue-500 to-blue-600
            lg:bg-linear-to-br lg:from-blue-400 lg:via-purple-500 lg:to-pink-600">
  Content here
</div>
```

### 4. Reduce Backdrop Blur on Mobile

Heavy blur effects can impact performance on mobile devices:

```html
<!-- Lighter blur on mobile -->
<div class="backdrop-blur-sm md:backdrop-blur-md lg:backdrop-blur-xl">
  Content here
</div>
```

### 5. Use Hardware Acceleration

For animated gradients, use `will-change` or `transform` to enable GPU acceleration:

```css
/* In your custom CSS */
.gradient-animation {
  will-change: background-position;
}
```

```html
<div class="bg-linear-to-r from-blue-500 to-purple-600 gradient-animation">
  Content here
</div>
```

### 6. Avoid Excessive Layering

Multiple overlapping gradients can hurt performance:

**Good:**
```html
<div class="bg-linear-to-br from-blue-500/20 to-purple-600/20">
  Content here
</div>
```

**Avoid:**
```html
<div class="relative">
  <div class="absolute inset-0 bg-linear-to-r from-blue-500 to-purple-600"></div>
  <div class="absolute inset-0 bg-linear-to-b from-red-500 to-yellow-500"></div>
  <div class="absolute inset-0 bg-radial from-green-500 to-transparent"></div>
  <div class="relative">Content</div>
</div>
```

### 7. Use CSS Classes Instead of Inline Styles

Tailwind's utility classes are optimized and reusable:

**Good:**
```html
<div class="bg-linear-to-r from-blue-500 to-purple-600">
  Content here
</div>
```

**Avoid:**
```html
<div style="background-image: linear-gradient(to right, #3b82f6, #9333ea);">
  Content here
</div>
```

### 8. Minimize Color Interpolation Complexity

Stick to default interpolation unless specific color space is needed:

**Good (default oklab):**
```html
<div class="bg-linear-to-r from-blue-500 to-purple-600">
  Content here
</div>
```

**Only use when necessary:**
```html
<div class="bg-linear-to-r/hsl from-blue-500 to-purple-600">
  Content here
</div>
```

### 9. Consider Using Solid Colors for Large Areas

For large background areas, consider solid colors with subtle gradients only on accents:

```html
<!-- Large container with solid color -->
<section class="bg-gray-50">
  <!-- Accent element with gradient -->
  <div class="bg-linear-to-r from-blue-500 to-purple-600 p-8">
    Featured content
  </div>
</section>
```

### 10. Test Performance on Target Devices

Always test gradient-heavy designs on actual devices, especially:
- Lower-end mobile devices
- Older browsers
- Devices with limited GPU capabilities

---

## Browser Compatibility

### Modern Gradient Support

All modern browsers fully support Tailwind CSS gradient utilities:

| Feature | Chrome | Firefox | Safari | Edge | Mobile Browsers |
|---------|--------|---------|--------|------|-----------------|
| Linear Gradients | ✅ All versions | ✅ All versions | ✅ All versions | ✅ All versions | ✅ All versions |
| Radial Gradients | ✅ All versions | ✅ All versions | ✅ All versions | ✅ All versions | ✅ All versions |
| Conic Gradients | ✅ 69+ | ✅ 83+ | ✅ 12.1+ | ✅ 79+ | ✅ Modern versions |
| Backdrop Blur | ✅ 76+ | ✅ 103+ | ✅ 9+ (prefixed) | ✅ 79+ | ✅ iOS 9+, Android 5+ |
| Color Interpolation | ✅ 111+ | ✅ 113+ | ✅ 16.2+ | ✅ 111+ | ✅ Latest versions |

### Fallbacks for Older Browsers

#### Conic Gradient Fallback

```html
<!-- Fallback for browsers without conic gradient support -->
<div class="bg-blue-500 bg-conic from-blue-600 to-sky-400">
  Content here
</div>
```

#### Backdrop Blur Fallback

```html
<!-- Fallback background for browsers without backdrop-blur -->
<div class="bg-white/80 backdrop-blur-md">
  Content here
</div>
```

### Safari-Specific Considerations

Safari requires `-webkit-backdrop-filter` prefix (Tailwind handles this automatically):

```css
/* Tailwind generates both */
.backdrop-blur-md {
  -webkit-backdrop-filter: blur(12px);
  backdrop-filter: blur(12px);
}
```

### Internet Explorer

Internet Explorer does not support:
- Conic gradients
- Backdrop blur/filter
- Modern color interpolation
- CSS custom properties (for arbitrary values)

For IE support, provide solid color fallbacks:

```html
<!-- IE will use solid blue, modern browsers use gradient -->
<div class="bg-blue-500 bg-linear-to-r from-blue-400 to-purple-600">
  Content here
</div>
```

### Feature Detection

Use `@supports` for progressive enhancement:

```css
/* In your custom CSS */
.gradient-card {
  background: #3b82f6; /* Fallback */
}

@supports (background-image: linear-gradient(to right, red, blue)) {
  .gradient-card {
    background-image: linear-gradient(to right, #3b82f6, #9333ea);
  }
}

@supports (backdrop-filter: blur(12px)) or (-webkit-backdrop-filter: blur(12px)) {
  .gradient-card {
    backdrop-filter: blur(12px);
  }
}
```

### Testing Resources

- [Can I Use - Gradients](https://caniuse.com/css-gradients)
- [Can I Use - Conic Gradients](https://caniuse.com/css-conic-gradients)
- [Can I Use - Backdrop Filter](https://caniuse.com/css-backdrop-filter)
- [Can I Use - Color Interpolation](https://caniuse.com/mdn-css_types_image_gradient_conic-gradient_interpolation_color_space)

---

## Additional Resources

### Official Documentation

- [Tailwind CSS Background Image](https://tailwindcss.com/docs/background-image) - Linear, radial, and conic gradients
- [Tailwind CSS Gradient Color Stops](https://tailwindcss.com/docs/gradient-color-stops) - Color stop utilities
- [Tailwind CSS Backdrop Blur](https://tailwindcss.com/docs/backdrop-blur) - Backdrop blur utilities
- [Tailwind CSS Dark Mode](https://tailwindcss.com/docs/dark-mode) - Dark mode configuration
- [Tailwind CSS Responsive Design](https://tailwindcss.com/docs/responsive-design) - Breakpoint system
- [Tailwind CSS v4.0 Blog](https://tailwindcss.com/blog/tailwindcss-v4) - Latest gradient features

### Gradient Tools & Generators

- [TailwindGradient](https://www.tailwindgradient.com/) - Beautiful CSS gradients for Tailwind
- [Hypercolor](https://hypercolor.dev/) - Curated collection of Tailwind CSS gradients
- [Tailwind Gradient Generator](https://www.creative-tim.com/twcomponents/gradient-generator) - Interactive gradient builder
- [Pagedone Gradient Docs](https://pagedone.io/docs/gradient) - Comprehensive gradient examples

### Advanced Techniques

- [Linear, Radial and Conic Gradients with Tailwind CSS - Cruip](https://cruip.com/linear-radial-and-conic-gradients-with-tailwind-css/)
- [A Guide to Adding Gradients with Tailwind CSS - LogRocket](https://blog.logrocket.com/guide-adding-gradients-tailwind-css/)
- [Glassmorphism with Tailwind CSS](https://www.braydoncoyer.dev/blog/build-a-glassmorphic-navbar-with-tailwindcss-backdrop-filter-and-backdrop-blur)
- [Glowing Gradient Backgrounds](https://www.braydoncoyer.dev/blog/tailwind-gradients-how-to-make-a-glowing-gradient-background)

### Community Resources

- [Tailwind CSS Discussions - Gradients](https://github.com/tailwindlabs/tailwindcss/discussions)
- [Stack Overflow - Tailwind Gradients](https://stackoverflow.com/questions/tagged/tailwind-css+gradient)
- [Tailwind CSS Discord](https://tailwindcss.com/discord) - Community support

---

## Quick Reference Cheatsheet

### Linear Gradients
```html
<div class="bg-linear-to-r from-blue-500 to-purple-600">...</div>
<div class="bg-linear-to-br from-pink-400 via-red-500 to-yellow-500">...</div>
<div class="bg-linear-45 from-green-400 to-blue-500">...</div>
```

### Radial Gradients
```html
<div class="bg-radial from-pink-400 to-fuchsia-700">...</div>
<div class="bg-radial-[at_50%_75%] from-sky-200 to-indigo-900">...</div>
```

### Conic Gradients
```html
<div class="bg-conic from-blue-600 to-sky-400">...</div>
<div class="bg-conic-180 from-indigo-600 via-indigo-50 to-indigo-600">...</div>
```

### With Opacity
```html
<div class="bg-linear-to-r from-blue-500/20 to-purple-600/50">...</div>
```

### With Backdrop Blur
```html
<div class="bg-white/30 backdrop-blur-md">...</div>
<div class="bg-linear-to-br from-white/20 to-white/5 backdrop-blur-lg">...</div>
```

### Responsive
```html
<div class="bg-linear-to-b md:bg-linear-to-r lg:bg-linear-to-br">...</div>
```

### Dark Mode
```html
<div class="bg-linear-to-r from-blue-400 to-blue-600
            dark:from-purple-700 dark:to-purple-900">...</div>
```

---

**Last Updated:** October 2025
**Tailwind CSS Version:** v4.0+
**Reference Guide Version:** 1.0

For the latest updates and additions to Tailwind CSS gradient utilities, always refer to the [official Tailwind CSS documentation](https://tailwindcss.com/docs).
