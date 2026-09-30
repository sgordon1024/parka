import React from 'react';

/**
 * Sidebar — vertical navigation for app sections on wide layouts. Groups with
 * labels; exactly one active item; icons always paired with text.
 */
export function Sidebar({ groups = [], activeId, onSelect, style = {} }) {
  const [active, setActive] = React.useState(activeId);
  return React.createElement('nav', { style: { width: 220, padding: 'var(--space-4)',
    background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)',
    borderRadius: 'var(--radius-lg)', ...style } },
    groups.map((g, gi) => React.createElement('div', { key: gi, style: { marginBottom: 'var(--space-4)' } },
      g.label && React.createElement('div', { style: { fontSize: 'var(--text-2xs)', textTransform: 'uppercase',
        letterSpacing: 'var(--tracking-wide)', color: 'var(--text-tertiary)', padding: '0 10px',
        marginBottom: 4, fontFamily: 'var(--font-mono)' } }, g.label),
      g.items.map(it => {
        const on = it.id === active;
        return React.createElement('button', { key: it.id, type: 'button', 'aria-current': on ? 'page' : undefined,
          onClick: () => { setActive(it.id); onSelect && onSelect(it.id); },
          style: { display: 'flex', alignItems: 'center', gap: 10, width: '100%', textAlign: 'left',
            font: 'inherit', fontSize: 'var(--text-sm)', fontWeight: on ? 600 : 400, padding: '8px 10px',
            border: 0, borderRadius: 'var(--radius-md)', cursor: 'pointer',
            background: on ? 'var(--accent-wash)' : 'transparent',
            color: on ? 'var(--text-primary)' : 'var(--text-secondary)' } },
          it.icon, it.label);
      }))));
}
