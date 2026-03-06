# AppStore

## Current State
- Full-stack app with Motoko backend and React/TypeScript frontend
- Light Apple-inspired theme (white/gray palette, blue accent)
- Features: sign-in (Internet Identity), app builder (2-step: details + screen designer), AI chat builder, app store gallery, app detail page, play page, Marvel battle game
- Homepage has hero section, feature blurbs, Marvel banner, and app store grid
- Layout.tsx wraps all pages with a nav header

## Requested Changes (Diff)

### Add
- **Dark theme**: Full dark mode color palette across the entire app (dark backgrounds, light text, glowing accents) -- inspired by Caffeine's dark aesthetic
- **Landing/marketing homepage**: Replace the current homepage with a rich marketing landing page that has:
  - Hero section with animated tagline, sub-headline, and two CTAs (Create App, Browse Store)
  - Features section (3 feature cards with icons)
  - "How it works" 3-step section
  - Marvel game callout banner (existing)
  - App store gallery section (existing)
  - Footer with branding
- **AI chat builder upgrade**: The existing AI chat panel in BuilderPage is enhanced with better visual styling to match the new dark theme; keep all logic intact

### Modify
- **index.css**: Replace the light OKLCH color tokens with a dark theme palette. Keep font definitions and utility classes, update color values.
- **HomePage.tsx**: Rewrite as a full Caffeine-style marketing landing page with hero, features, how-it-works, Marvel banner, and app store grid
- **Layout.tsx**: Update nav styling to match dark theme (glassmorphism dark nav)
- **App.tsx (LoginPage)**: Update LoginPage styling to match the new dark theme

### Remove
- Nothing removed from functionality

## Implementation Plan
1. Update `index.css` with dark OKLCH color tokens (dark background ~0.08, foreground ~0.97, primary vivid blue/violet)
2. Rewrite `HomePage.tsx` with full Caffeine-style marketing landing page
3. Update `Layout.tsx` nav to match dark glassmorphism style
4. Polish `App.tsx` LoginPage for the dark theme
5. Run typecheck and build to validate
