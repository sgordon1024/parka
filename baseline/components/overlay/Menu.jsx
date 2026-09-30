import React from 'react';

/**
 * Menu — a list of actions on an object, opened from a trigger. Group with
 * separators; destructive actions last. Also the pattern for context menus.
 */
export function Menu({ trigger = 'Actions', items = [], style = {} }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);
  React.useEffect(() => {
    const close = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('pointerdown', close);
    return () => document.removeEventListener('pointerdown', close);
  }, []);
  return React.createElement('div', { ref, style: { position: 'relative', display: 'inline-block', ...style } },
    React.createElement('button', { type: 'button', 'aria-haspopup': 'menu', 'aria-expanded': open,
      onClick: () => setOpen(!open), style: { font: 'inherit', fontSize: 'var(--text-sm)', fontWeight: 600,
        padding: '9px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)',
        background: 'var(--surface-raised)', color: 'var(--text-primary)', cursor: 'pointer' } },
      trigger, ' \u25BE'),
    open && React.createElement('div', { role: 'menu', style: { position: 'absolute', top: 'calc(100% + 6px)',
      left: 0, minWidth: 200, zIndex: 30, padding: 6, background: 'var(--surface-overlay)',
      border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-lg)' } },
      items.map((it, i) => it === '---'
        ? React.createElement('div', { key: i, role: 'separator', style: { height: 1,
            background: 'var(--border-subtle)', margin: '6px 4px' } })
        : React.createElement('button', { key: i, type: 'button', role: 'menuitem',
            onClick: () => { setOpen(false); it.onSelect && it.onSelect(); },
            style: { display: 'block', width: '100%', textAlign: 'left', font: 'inherit',
              fontSize: 'var(--text-sm)', padding: '8px 10px', border: 0, borderRadius: 'var(--radius-sm)',
              background: 'transparent', cursor: 'pointer',
              color: it.danger ? 'var(--danger)' : 'var(--text-primary)' },
            onMouseEnter: e => e.currentTarget.style.background = 'var(--bg-secondary)',
            onMouseLeave: e => e.currentTarget.style.background = 'transparent' }, it.label))));
}
