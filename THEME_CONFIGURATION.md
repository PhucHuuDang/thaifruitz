# ThaiFruitz Theme Configuration - Mira Style

## 🎨 Design System Overview

This document outlines the complete theme configuration for ThaiFruitz, implementing the **Radix Mira** design system with a warm, organic aesthetic perfect for a premium dried fruit brand.

---

## 📋 Configuration Summary

### Theme Style

- **Style**: Radix Mira
- **Primary Font**: Figtree (weights: 300-900)
- **Base Color**: Neutral
- **Border Radius**: 1.4rem (large, soft corners)

### Background Colors

#### Light Mode

- **Primary Background**: `#FFFAF3` (Warm cream - 40 100% 97.5%)
  - Chosen specifically for organic food products
  - Creates an appetizing, natural feel
  - Complements fruit imagery beautifully

#### Dark Mode

- **Primary Background**: `#1a1b1e` (Sophisticated dark - 225 7.7% 10.6%)
  - Maintains warmth even in dark mode
  - Premium, modern aesthetic

---

## 🎯 Design Rationale

### Why This Background Color?

The warm cream background (`#FFFAF3`) was specifically chosen for ThaiFruitz because:

1. **Food Psychology**: Warm, neutral tones increase appetite and create associations with natural, organic products
2. **Brand Identity**: Reflects the organic, premium nature of dried fruits
3. **Visual Hierarchy**: Provides excellent contrast for vibrant fruit imagery
4. **User Experience**: Reduces eye strain while maintaining clarity
5. **Premium Feel**: Evokes artisanal, high-quality products

### Font Choice: Figtree

- Modern, clean sans-serif perfect for e-commerce
- Excellent readability across all sizes
- Professional yet friendly personality
- Supports complete range of weights for typographic hierarchy

---

## 🎨 Color Palette

### Primary Colors

```css
--primary: 262 100% 59.4% /* Purple #7033ff */ --primary-foreground: 0 0% 100%
  /* White */;
```

### Semantic Colors

```css
--destructive: 357 75% 60.4% /* Red for errors */ --accent: 224 100% 94.5%
  /* Light blue for highlights */ --muted: 0 0% 96.1% /* Subtle grays */;
```

### Chart Colors (Fruit-themed)

```css
--chart-1: 149 59% 53.5% /* Fresh green */ --chart-2: 262 100% 59.4%
  /* Purple */ --chart-3: 22 98% 58.8% /* Orange */ --chart-4: 213 80% 53.5%
  /* Blue */ --chart-5: 0 0% 45.5% /* Gray */;
```

---

## 📁 Modified Files

### 1. `src/app/globals.css`

- ✅ Updated CSS variables to Mira style (HSL format)
- ✅ Set warm cream background for light mode
- ✅ Added Figtree font family

### 2. `src/app/layout.tsx`

- ✅ Replaced Geist fonts with Figtree
- ✅ Updated font weight range (300-900)
- ✅ Applied font-sans class to body

### 3. `tailwind.config.ts`

- ✅ Added Figtree font family configuration
- ✅ Added custom Mira shadow utilities
- ✅ Added custom letter-spacing for Mira style
- ✅ Maintained all existing color tokens

### 4. `components.json`

- ✅ Updated style to "radix-mira"
- ✅ Changed baseColor to "neutral"

### 5. `src/app/(client)/page.tsx`

- ✅ Updated gradient backgrounds to use warm tones
- ✅ Changed from `amber-50/30 to white` to `orange-50/40 via amber-50/30 to background`

### 6. `src/components/ui/previewcn/`

- ✅ Fixed z-index issues (z-99999 → z-[99999])
- ✅ Fixed panel z-index (z-99998 → z-[99998])

---

## 🚀 Custom Utilities Added

### Shadows

```css
shadow-mira: 0px 2px 3px 0px hsl(0 0% 0% / 0.16);
```

### Letter Spacing

```css
tracking-mira: -0.025em;
```

---

## 🎭 Using the Theme

### Example Component

```tsx
<div className="bg-background text-foreground font-sans">
  <h1 className="text-primary tracking-mira">Welcome to ThaiFruitz</h1>
  <div className="bg-card rounded-lg shadow-mira">
    <p className="text-muted-foreground">Premium organic dried fruits</p>
  </div>
</div>
```

### Gradients

Use the new warm gradients for sections:

```tsx
<section className="bg-gradient-to-b from-orange-50/40 via-amber-50/30 to-background">
  {/* Content */}
</section>
```

---

## ⚠️ Lint Warnings (Non-Critical)

The following lint warnings can be safely ignored:

- `@tailwind` unknown at-rule warnings (CSS language server doesn't recognize Tailwind directives)
- `@apply` unknown at-rule warnings (same as above)
- `onClick` serialization warning in PreviewcnDevtools (correct usage for client components)

---

## 🎨 Design Principles

### 1. Warmth & Naturalness

All color choices evoke natural, organic products

### 2. Accessibility

Colors maintain WCAG AA contrast ratios minimum

### 3. Premium Feel

Soft shadows, generous spacing, and refined typography

### 4. Brand Consistency

Every element reinforces the "premium organic" positioning

---

## 📦 Next Steps

To see the changes in action:

```bash
npm run dev
```

To build for production:

```bash
npm run build
```

---

## 🎉 Summary

The ThaiFruitz website now features:

- ✨ Modern Mira design system
- 🍊 Warm, appetizing background (#FFFAF3)
- 🔤 Beautiful Figtree typography
- 🎨 Fruit-themed color palette
- 📱 Consistent, premium aesthetic across all breakpoints

**The configuration is complete and ready for development!**
