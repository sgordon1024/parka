import React from 'react';

/**
 * Calendar — a month grid for picking a date. Pass year/month (0-based) so the
 * demo is deterministic; selection is uncontrolled with onSelect callback.
 */
export function Calendar({ year = 2026, month = 6, defaultDay, onSelect, style = {} }) {
  const [sel, setSel] = React.useState(defaultDay || null);
  const first = new Date(year, month, 1);
  const days = new Date(year, month + 1, 0).getDate();
  const lead = (first.getDay() + 6) % 7; // monday-first
  const name = first.toLocaleString('en', { month: 'long', year: 'numeric' });
  const cells = [];
  for (let i = 0; i < lead; i++) cells.push(null);
  for (let d = 1; d <= days; d++) cells.push(d);
  return React.createElement('div', { style: { width: 292, padding: 'var(--space-4)',
    background: 'var(--surface-raised)', border: '1px solid var(--border-subtle)',
    borderRadius: 'var(--radius-lg)', ...style } },
    React.createElement('div', { style: { fontWeight: 600, fontSize: 'var(--text-sm)',
      marginBottom: 10, textAlign: 'center', color: 'var(--text-primary)' } }, name),
    React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 2 } },
      ['M','T','W','T','F','S','S'].map((d, i) => React.createElement('span', { key: 'h' + i,
        style: { textAlign: 'center', fontSize: 'var(--text-2xs)', color: 'var(--text-tertiary)',
          fontFamily: 'var(--font-mono)', padding: '4px 0' } }, d)),
      cells.map((d, i) => d === null
        ? React.createElement('span', { key: i })
        : React.createElement('button', { key: i, type: 'button',
            'aria-pressed': sel === d, onClick: () => { setSel(d); onSelect && onSelect(new Date(year, month, d)); },
            style: { font: 'inherit', fontSize: 'var(--text-xs)', border: 0, cursor: 'pointer',
              width: '100%', aspectRatio: '1', borderRadius: 'var(--radius-sm)',
              background: sel === d ? 'var(--accent-default)' : 'transparent',
              color: sel === d ? 'var(--action-primary-text)' : 'var(--text-primary)',
              fontWeight: sel === d ? 700 : 400 } }, d))));
}
