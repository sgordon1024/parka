import React from 'react';

/**
 * SearchField — a dedicated search input with glyph and clear affordance.
 * Search is a task, not a form field: keep it visually distinct from Input.
 */
export function SearchField({ placeholder = 'Search\u2026', onSearch, style = {} }) {
  const [q, setQ] = React.useState('');
  return React.createElement('div', { role: 'search', style: { display: 'flex', alignItems: 'center', gap: 8,
    width: 280, padding: '9px 14px', background: 'var(--surface-sunken)',
    border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-full)', ...style } },
    React.createElement('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor',
      strokeWidth: 2, strokeLinecap: 'round', 'aria-hidden': true,
      style: { width: 15, height: 15, color: 'var(--text-tertiary)', flex: '0 0 auto' } },
      React.createElement('circle', { cx: 11, cy: 11, r: 8 }),
      React.createElement('path', { d: 'm21 21-4.3-4.3' })),
    React.createElement('input', { type: 'search', value: q, placeholder, 'aria-label': 'Search',
      onChange: e => { setQ(e.target.value); onSearch && onSearch(e.target.value); },
      style: { flex: 1, border: 0, background: 'none', font: 'inherit', fontSize: 'var(--text-sm)',
        color: 'var(--text-primary)', outline: 'none' } }),
    q && React.createElement('button', { type: 'button', 'aria-label': 'Clear search',
      onClick: () => { setQ(''); onSearch && onSearch(''); },
      style: { border: 0, background: 'none', cursor: 'pointer', color: 'var(--text-tertiary)',
        fontSize: 13, padding: 0 } }, '\u2715'));
}
