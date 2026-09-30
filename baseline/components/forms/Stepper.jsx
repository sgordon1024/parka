import React from 'react';

/**
 * Stepper — increment/decrement a small numeric value where the range is
 * narrow and the exact number matters (quantity, sets). For wide ranges use
 * Slider; for arbitrary numbers use Input.
 */
export function Stepper({ label, min = 0, max = 99, step = 1, defaultValue = 1, onChange, style = {} }) {
  const [val, setVal] = React.useState(defaultValue);
  const set = v => { const n = Math.max(min, Math.min(max, v)); setVal(n); onChange && onChange(n); };
  const btn = (glyph, delta, dis) => React.createElement('button', { type: 'button', disabled: dis,
    'aria-label': delta > 0 ? 'Increase' : 'Decrease', onClick: () => set(val + delta),
    style: { width: 34, height: 34, border: 0, background: 'transparent', cursor: dis ? 'default' : 'pointer',
      color: dis ? 'var(--text-disabled)' : 'var(--text-primary)', fontSize: 16, fontWeight: 600 } }, glyph);
  return React.createElement('div', { style: { display: 'inline-flex', alignItems: 'center', gap: 12, ...style } },
    label && React.createElement('span', { style: { fontSize: 'var(--text-sm)', fontWeight: 500,
      color: 'var(--text-primary)' } }, label),
    React.createElement('div', { role: 'spinbutton', 'aria-valuenow': val, 'aria-valuemin': min, 'aria-valuemax': max,
      style: { display: 'inline-flex', alignItems: 'center', background: 'var(--surface-sunken)',
        border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)' } },
      btn('\u2212', -step, val <= min),
      React.createElement('span', { style: { minWidth: 34, textAlign: 'center', fontFamily: 'var(--font-mono)',
        fontSize: 'var(--text-sm)', color: 'var(--text-primary)' } }, val),
      btn('+', step, val >= max)));
}
