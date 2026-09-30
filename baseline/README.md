# Baseline Design System

A production-grade, **token-first** design system boilerplate. It ships a confident
monochrome default — think Uber Base and Nike.com: oversized tight-tracked display type,
a scalpel-thin electric accent, athletic whitespace, controlled motion — and re-themes
entirely from **one small Brand Seed block**.

> **Not a brand.** This is a neutral starting point for new projects. There is no company
> logo or brand identity baked in — the wordmark renders as plain type ("BASELINE"). Point
> a project at it, edit the seed, and everything cascades into that project's identity.

## How to re-brand a project

Edit **`tokens/seed.css`** — the only file you touch per project — and the whole system
re-skins:

```css
:root {
  --seed-accent: #2563EB;               /* quiet default blue — neutral on purpose */
  --seed-neutral-chroma: 0;             /* pure 0 · cool 0.006 · warm 0.008 */
  --seed-neutral-hue: 0;                /* cool ≈ 255 · warm ≈ 70 */
  --seed-radius: 4px;                   /* sharp 4 · soft 8 · round 16 */
  --seed-font-display: 'Space Grotesk';
  --seed-font-body: 'Inter';
  --seed-motion-ease: cubic-bezier(0.16,1,0.3,1);  /* smooth · snappy · playful */
  --seed-motion-fast: 200ms; --seed-motion-base: 300ms; --seed-motion-slow: 600ms;
}
```

Consumers link a single file — **`styles.css`** — which `@import`s the token tiers and
ships the webfonts.

## Architecture — three tiers

Components consume **semantic** tokens only; never a primitive directly.

1. **Tier 1 · Seed** (`tokens/seed.css`) — the six knobs above.
2. **Tier 2 · Primitives** (`tokens/colors.css`, `typography.css`, `spacing.css`,
   `motion.css`) — a 12-step neutral ramp + accent ramp + status hues (all derived from the
   seed via `oklch`/`color-mix`), the fluid type scale, the 4px space scale, radius, and the
   easing/duration curves.
3. **Tier 3 · Semantic** (`tokens/colors.css`) — `--bg-*`, `--text-*`, `--border-*`,
   `--action-*`, `--surface-*`, `--shadow-*`, `--ring-focus`. Light and dark are both
   first-class, swapped via `[data-theme="dark"]` (dark is tuned, not inverted — desaturated
   accent, elevated surfaces get lighter, never pure #000).

## Content fundamentals

- **Voice:** terse, kinetic, confident. Verb-first CTAs ("Get started", "Move fast"). Short
  lines. No exclamatory marketing fluff.
- **Casing:** display headlines in sentence or title case; micro-labels / eyebrows / metadata
  in ALL-CAPS with `+0.08em` tracking, set in the mono font.
- **Person:** address the user as "you"; refer to the system as "the system" / "Baseline".
- **Numbers/units:** monospace for anything tabular, versioned, or measured (`64%`, `v1.0`,
  token names). Never invent stats for decoration.
- **Emoji:** not used in product UI.

## Visual foundations

- **Palette:** monochrome does ~90% of the work. Black + white + a 12-step neutral ramp.
  The accent (`--seed-accent`) is used ONLY for primary actions, focus, and live/active
  states — never decoration.
- **Type:** display = a tight grotesque (Space Grotesk) tracked `-0.03em`, sizes go BIG
  (`--text-hero` ≈ `clamp(3rem, 8vw, 7.5rem)`); body = Inter at `1.6` line-height; mono =
  Space Mono for labels/metadata.
- **Space & rhythm:** 4px base scale. Sections breathe (96–128px vertical rhythm); cards are
  dense.
- **Borders:** 1px hairlines (`--border-subtle/default/strong`), not gray filled boxes.
- **Corners:** squircle-feel; radius scale derives from `--seed-radius`.
- **Shadows:** subtle, large-blur, low-opacity (no 2015 material shadows). An accent
  `--shadow-bloom` is reserved for primary-button hover.
- **Texture:** optional flat-but-textured grain (`.ds-grain`) for hero surfaces.
- **Imagery:** full-bleed, duotone-ready, with a consistent dark protection gradient.
- **Motion:** animate transform + opacity only. Hover lifts ≤2px with a shadow bloom;
  press compresses to `0.98`; entrance reveals stagger in 60ms increments. Everything
  respects `prefers-reduced-motion`. The hero curve is `--ease-out-expo`
  `cubic-bezier(0.16,1,0.3,1)`.

## Iconography

No bundled icon set — the system is glyph-agnostic and icons are always passed in as
nodes (`iconLeft` / `children`), so any set can swap without touching components.
The per-platform defaults:

- **iOS / macOS: SF Symbols, always.** They ship with the OS, scale with Dynamic Type,
  and carry weights that match the system faces. Match the symbol weight to the text
  weight next to it (regular text gets regular symbols). Never substitute a web icon
  set in a native app.
- **Web: Lucide** from CDN as the neutral default (open license, consistent stroke,
  SF-Symbols-adjacent vocabulary). Set a 1.5–2px stroke to match the hairline borders.
  Heroicons is the sanctioned alternative when a project already uses it.
- In throwaway specimens, simple Unicode marks (`✓ × + ↑ ↓ ‹ ›`) stand in.

A brand icon set is a seed-level decision like a brand font: opt in deliberately,
swap wholesale. Do not hand-draw brand marks, and never mix two sets in one surface.

## Accessibility (WCAG 2.2 AA, baked in)

- 4.5:1 body text, 3:1 large text / UI.
- Focus-visible rings on everything: 2px ring + 2px offset using `--ring-focus`, never
  removed (defined once in `tokens/reset.css`).
- 44px minimum touch targets on all interactive components.
- Semantic HTML + correct ARIA (dialog focus-trap + Escape, tab roving focus, accordion
  `aria-expanded`, table `aria-sort`, toast `aria-live`).
- Meaning never encoded by color alone — status carries an icon + word.

## Index / manifest

- **`styles.css`** — the one file consumers link (`@import` manifest).
- **`tokens/`** — `seed.css` · `colors.css` · `typography.css` · `spacing.css` ·
  `motion.css` · `reset.css`.
- **`components/`** — React primitives grouped by concern, each `Name.jsx` + `Name.d.ts`:
  - `forms/` — Button, IconButton, Input, Textarea, Select, Checkbox, Radio, Switch
  - `data/` — Card / MediaCard, Badge / Tag, Avatar / AvatarGroup, Table
  - `feedback/` — Spinner, Progress, Skeleton, Tooltip, Toast / ToastStack, EmptyState
  - `overlay/` — Modal, Drawer
  - `navigation/` — Tabs, Breadcrumbs, Pagination, Accordion
- **`guidelines/`** — foundation specimen cards (colors, type, spacing, radius/elevation,
  motion) shown in the Design System tab.
- **`Baseline Design System.dc.html`** — the flagship interactive style guide (live seed
  editor, theme toggle, every component in every state). Open this to see the system composed.
- **`SKILL.md`** — makes this folder usable as a downloadable Claude Code skill.
