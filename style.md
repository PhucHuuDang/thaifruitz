# ThaiFruitz Theme - Mira Style Reference

This file contains the original hex color values from the Mira design system that were converted to HSL format and applied to the project.

## ✅ Applied Configuration Status

**Style**: Radix Mira  
**Font**: Figtree  
**Base Color**: Neutral  
**Border Radius**: 1.4rem

---

## Light Mode Colors (Original Hex → Applied HSL)

| Variable    | Hex Value | HSL Value        | Applied |
| ----------- | --------- | ---------------- | ------- |
| Background  | `#FFFAF3` | `40 100% 97.5%`  | ✅      |
| Foreground  | `#000000` | `0 0% 0%`        | ✅      |
| Primary     | `#7033ff` | `262 100% 59.4%` | ✅      |
| Secondary   | `#edf0f4` | `216 25% 94.3%`  | ✅      |
| Destructive | `#e54b4f` | `357 75% 60.4%`  | ✅      |
| Border      | `#e7e7ee` | `249 13% 92.4%`  | ✅      |

### Chart Colors (Light)

- Chart 1: `#4ac885` → `149 59% 53.5%` (Fresh Green) ✅
- Chart 2: `#7033ff` → `262 100% 59.4%` (Purple) ✅
- Chart 3: `#fd822b` → `22 98% 58.8%` (Orange) ✅
- Chart 4: `#3276e4` → `213 80% 53.5%` (Blue) ✅
- Chart 5: `#747474` → `0 0% 45.5%` (Gray) ✅

---

## Dark Mode Colors (Original Hex → Applied HSL)

| Variable    | Hex Value | HSL Value        | Applied |
| ----------- | --------- | ---------------- | ------- |
| Background  | `#1a1b1e` | `225 7.7% 10.6%` | ✅      |
| Foreground  | `#f0f0f0` | `0 0% 94.1%`     | ✅      |
| Primary     | `#8c5cff` | `262 100% 68%`   | ✅      |
| Destructive | `#f87171` | `0 70% 70.6%`    | ✅      |
| Border      | `#33353a` | `220 6.5% 21.2%` | ✅      |

### Chart Colors (Dark)

- Chart 1: `#4ade80` → `142 71% 61%` (Green) ✅
- Chart 2: `#8c5cff` → `262 100% 68%` (Purple) ✅
- Chart 3: `#fca5a5` → `0 84% 80%` (Red) ✅
- Chart 4: `#5993f4` → `213 76% 65%` (Blue) ✅
- Chart 5: `#a0a0a0` → `0 0% 62.7%` (Gray) ✅

---

## Typography

**Primary Font**: Figtree (Google Fonts)  
**Weights**: 300, 400, 500, 600, 700, 800, 900  
**Fallback**: system-ui, sans-serif

**CSS Variable**: `--font-sans`  
**Applied in**: body element via Tailwind's `font-sans` class

---

## Design System Values

```css
--radius: 1.4rem --shadow-blur: 3px --shadow-spread: 0px --shadow-offset-x: 0px
  --shadow-offset-y: 2px --shadow-opacity: 0.16 --letter-spacing: -0.025em
  --spacing: 0.27rem;
```

---

## 🎨 Why These Colors Work for ThaiFruitz

### Background Color Analysis

**#FFFAF3 (Warm Cream)**

- **Hue**: 40° (warm orange undertone)
- **Saturation**: 100% (vibrant but subtle)
- **Lightness**: 97.5% (very bright, comfortable)

This color was specifically chosen because:

1. ✅ **Food-Safe**: Warm neutrals increase appetite
2. ✅ **Natural**: Evokes organic, artisanal products
3. ✅ **Premium**: Sophisticated alternative to pure white
4. ✅ **Fruit-Friendly**: Complements colorful fruit imagery
5. ✅ **Eye-Comfort**: Reduces screen fatigue vs pure white

### Color Psychology

- **Orange/Amber tones**: Energy, vitality, natural goodness
- **Cream base**: Premium, organic, artisanal
- **Purple accents**: Luxury, uniqueness, quality

---

## 🚀 Implementation

All colors have been converted from hex to HSL format and applied to:

- ✅ `src/app/globals.css` (CSS variables)
- ✅ `src/app/layout.tsx` (Figtree font)
- ✅ `tailwind.config.ts` (Font config + utilities)
- ✅ `components.json` (shadcn style config)
- ✅ `src/app/(client)/page.tsx` (Gradient updates)

---

## 📚 References

- Original design: Mira style from shadcn/ui
- Font: [Figtree on Google Fonts](https://fonts.google.com/specimen/Figtree)
- Design system: Radix UI color scales

**Status**: ✅ Complete and ready for use
