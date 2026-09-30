import React from 'react';

/**
 * NavigationMenu — a horizontal site/app navigation bar; items may open a
 * dropdown panel of links. For marketing/site headers, not app sections.
 */
export function NavigationMenu({ items = [], style = {} }) {
  const [open, setOpen] = React.useState(null);
  const ref = React.useRef(null);
  React.useEffect(() => {
    const close = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(null); };
    document.addEventListener('pointerdown', close);
    return () => document.removeEventListener('pointerdown', close);
  }, []);
  return React.createElement('nav', { ref, style: { display: 'inline-flex', gap: 4, position: 'relative', ...style } },
    items.map((it, i) => React.createElement('div', { key: i, style: { position: 'relative' } },
      React.createElement('button', { type: 'button',
        'aria-expanded': it.children ? open === i : undefined,
        onClick: () => it.children ? setOpen(open === i ? null : i) : undefined,
        style: { font: 'inherit', fontSize: 'var(--text-sm)', fontWeight: 500, padding: '8px 14px',
          border: 0, borderRadius: 'var(--radius-md)', cursor: 'pointer',
          background: open === i ? 'var(--bg-secondary)' : 'transparent', color: 'var(--text-primary)' } },
        it.label, it.children ? ' \u25BE' : null),
      it.children && open === i && React.createElement('div', { style: { position: 'absolute',
        top: 'calc(100% + 6px)', left: 0, minWidth: 230, zIndex: 30, padding: 8,
        background: 'var(--surface-overlay)', border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)' } },
        it.children.map((c, ci) => React.createElement('a', { key: ci, href: c.href || '#',
          style: { display: 'block', padding: '8px 10px', borderRadius: 'var(--radius-sm)',
            textDecoration: 'none', fontSize: 'var(--text-sm)', color: 'var(--text-primary)' },
          onMouseEnter: e => e.currentTarget.style.background = 'var(--bg-secondary)',
          onMouseLeave: e => e.currentTarget.style.background = 'transparent' },
          React.createElement('div', { style: { fontWeight: 500 } }, c.label),
          c.desc && React.createElement('div', { style: { fontSize: 'var(--text-xs)',
            color: 'var(--text-tertiary)', marginTop: 1 } }, c.desc)))))));
}
