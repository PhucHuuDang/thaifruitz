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
| Background  | `#FAFAFA` | `0 0% 98%`       | ✅      |
| Foreground  | `#0D0D0D` | `0 0% 5%`        | ✅      |
| Primary     | `#7033ff` | `262 100% 59.4%` | ✅      |
| Secondary   | `#F2F3F5` | `220 14% 96%`    | ✅      |
| Destructive | `#e54b4f` | `357 75% 60.4%`  | ✅      |
| Border      | `#E3E4E6` | `220 13% 91%`    | ✅      |

### Chart Colors (Light)

- Chart 1: `#4ac885` → `149 59% 53.5%` (Fresh Green) ✅
- Chart 2: `#7033ff` → `262 100% 59.4%` (Purple) ✅
- Chart 3: `#fd822b` → `22 98% 58.8%` (Orange) ✅
- Chart 4: `#3276e4` → `213 80% 53.5%` (Blue) ✅
- Chart 5: `#747474` → `0 0% 45.5%` (Gray) ✅

---

## Dark Mode Colors (Original Hex → Applied HSL)

| Variable    | Hex Value | HSL Value      | Applied |
| ----------- | --------- | -------------- | ------- |
| Background  | `#0A0A0B` | `240 10% 4%`   | ✅      |
| Foreground  | `#FAFAFA` | `0 0% 98%`     | ✅      |
| Primary     | `#8c5cff` | `262 100% 68%` | ✅      |
| Destructive | `#f87171` | `0 70% 70.6%`  | ✅      |
| Border      | `#2A2B2E` | `240 6% 18%`   | ✅      |

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

**#FAFAFA (Soft Neutral Gray)**

- **Hue**: 0° (neutral, no color bias)
- **Saturation**: 0% (pure neutral)
- **Lightness**: 98% (very bright, comfortable)

This color was specifically chosen because:

1. ✅ **Modern & Clean**: Contemporary neutral that feels premium
2. ✅ **Better Contrast**: Pure white cards pop against the subtle gray background
3. ✅ **Eye Comfort**: Reduces eye strain compared to pure white or warm tints
4. ✅ **Fruit-Friendly**: Neutral base lets colorful fruit imagery shine
5. ✅ **Professional**: Conveys quality and trustworthiness
6. ✅ **Versatile**: Works perfectly with both vibrant and muted content

### Color Psychology

- **Neutral gray tones**: Clean, modern, professional, trustworthy
- **High contrast**: Clear visual hierarchy, easy to scan
- **Purple accents**: Luxury, uniqueness, premium quality
- **Vibrant fruit colors**: Energy, freshness, natural goodness

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
