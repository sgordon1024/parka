import React from 'react';

/**
 * Pips — a compact fixed-count progress indicator: `value` of `max` dots filled.
 * Reach for it over Progress when the count is small and bounded (retries left,
 * steps done, lives, a budget) and a full bar would be overkill. `spent` marks an
 * exhausted budget, tinting the filled dots with the warning tone so "all used"
 * reads as attention, not success.
 */
export function Pips({ value = 0, max = 3, spent = false, style = {}, ...rest }) {
  const on = Math.max(0, Math.min(max, value));
  const fill = spent ? 'var(--warning)' : 'var(--accent-default)';
  return React.createElement('span', {
    role: 'img', 'aria-label': on + ' of ' + max,
    style: { display: 'inline-flex', alignItems: 'center', gap: 5, ...style }, ...rest,
  },
    Array.from({ length: max }, (_, i) => React.createElement('span', {
      key: i, 'aria-hidden': 'true',
      style: {
        width: 9, height: 9, borderRadius: '50%',
        background: i < on ? fill : 'transparent',
        boxShadow: i < on ? 'none' : 'inset 0 0 0 1.5px var(--border-strong)',
      },
    })),
  );
}
