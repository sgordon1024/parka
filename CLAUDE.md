# Parka

A made-up weather app that answers one question: what should I wear today? It's a demo
project for a designers' talk, so keep it small and easy to follow.

## How it's built

- Plain HTML, CSS, and JavaScript. No build step and no npm, so every page runs straight
  from GitHub Pages.
- Design system: Baseline, copied into `baseline/`. Read `baseline/SKILL.md` before
  changing any UI.
- Brand: edit `baseline/tokens/seed.css` and nothing else. Every color, radius, and ramp
  derives from it.
- Use Baseline's semantic tokens (`--bg-*`, `--text-*`, `--surface-*`, `--border-*`,
  `--accent-*`). Never hard-code a color.
- Components come from Baseline's bundle on `window.Baseline`. Load extras with
  `BaselineSource([...])` from `baseline/source-loader.js`.
- Icons: Lucide, trimmed into `vendor/icons.js`.
- Weather: Open-Meteo (`api.open-meteo.com`). No API key. Credit it on any public page.

## Files

- `index.html`: the design board, every screen side by side
- `today.html`, `week.html`, `places.html`: the phone screens, 390 × 844
- `parka.js`: weather data, the what-to-wear logic, and the screens
- `parka.css`: app chrome shared by the screens

## Rules

- Keep touch targets at least 44px and text contrast at WCAG AA.
- Check your own work: open the page, take a screenshot, compare it with the design or
  the Figma frame, and fix the differences before calling it done.
- Work on a branch and open a pull request. Don't commit straight to main.
- Keep `.nojekyll`. Without it, GitHub Pages hides every file that starts with an
  underscore, including Baseline's component bundle.
