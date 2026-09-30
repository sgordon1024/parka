import React from 'react';

/**
 * Slider — pick a value from a continuous or stepped range. Always show the
 * current value; use for ranges where relative position matters (volume,
 * budget), not for precise numeric entry (use Input or Stepper).
 */
export function Slider({ label, min = 0, max = 100, step = 1, defaultValue, onChange, format = v => v, style = {} }) {
  const [val, setVal] = React.useState(defaultValue != null ? defaultValue : (min + max) / 2);
  return React.createElement('label', { style: { display: 'block', ...style } },
    React.createElement('span', { style: { display: 'flex', justifyContent: 'space-between',
      fontSize: 'var(--text-sm)', marginBottom: 6 } },
      React.createElement('span', { style: { color: 'var(--text-primary)', fontWeight: 500 } }, label),
      React.createElement('span', { style: { color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)',
        fontSize: 'var(--text-xs)' } }, format(val))),
    React.createElement('input', { type: 'range', min, max, step, value: val,
      onChange: e => { const v = Number(e.target.value); setVal(v); onChange && onChange(v); },
      style: { width: '100%', accentColor: 'var(--accent-default)', height: 22 } }));
}
