---
name: baseline-design
description: Use this skill to generate well-branded interfaces and assets with the Baseline Design System — a token-first, monochrome-premium foundation (Uber/Nike-smooth) that re-themes from one Brand Seed block. Use for production code or throwaway prototypes/mocks. Contains the full token system (colors, type, spacing, motion), light/dark theming, and a React component library.
user-invocable: true
---

Read the `readme.md` file within this skill first, then explore the other files.

## What this system is
A neutral, re-brandable design foundation. The default look is confident monochrome with a
single quiet accent, platform-native type (SF Pro on Apple, Segoe on Windows), and controlled
motion. It carries **no company brand** — you supply identity by editing the Brand Seed:
brand fonts, a brand accent, and a brand icon set are all deliberate opt-ins, never defaults.
Icons: SF Symbols on iOS/macOS, Lucide on web, always passed in as nodes.

## Re-brand from one block
Edit `tokens/seed.css` (accent hue, neutral temperature, radius personality, display/body
fonts, motion personality). Everything else — the neutral ramp, accent ramp, status hues,
type scale, radius, shadows, and both light/dark semantic themes — derives from it.

## Using it
- **Link one file:** `styles.css` (it `@import`s every token tier; no webfonts ship by default).
- **Theme:** set `data-theme="dark"` (or `light`) on `<html>`. Dark is the flagship default.
- **Consume semantic tokens only** in your own CSS — `--bg-*`, `--text-*`, `--action-*`,
  `--surface-*`, `--border-*`, `--ring-focus`, `--shadow-*`. Never reference a primitive
  (`--neutral-500`, `--accent-default`) directly from a component.
- **Components** live in `components/<group>/<Name>.jsx` as named exports
  (`export function Button(...)`), styled entirely through the CSS custom properties. Copy
  them into a React project, or read them to mirror the exact values in another framework.

## When invoked
- **Visual artifacts** (slides, mocks, throwaway prototypes): copy the assets/tokens you need
  and produce static HTML files that link `styles.css` so they pick up the real system.
- **Production code:** copy `tokens/` + the components you need; keep `tokens/seed.css` as the
  per-project re-brand block.
- **No guidance given:** ask what they want to build, ask a few focused questions, then act as
  an expert designer and output HTML artifacts or production code as appropriate — always on
  the Baseline tokens, never inventing off-system colors.

## Guardrails
- Accent is a scalpel: primary actions, focus, live/active only — never decoration.
- Keep focus-visible rings and 44px touch targets intact (WCAG 2.2 AA).
- Meaning is never color-only; pair status color with an icon + word.
- Animate transform + opacity only; respect `prefers-reduced-motion`.
