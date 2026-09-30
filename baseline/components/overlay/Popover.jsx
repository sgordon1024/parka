import React from 'react';

/**
 * Popover — a small anchored surface for lightweight context or controls that
 * don't warrant a modal. Dismisses on outside click; never critical decisions.
 */
export function Popover({ trigger = 'Details', title, children, style = {} }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);
  React.useEffect(() => {
    const close = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('pointerdown', close);
    return () => document.removeEventListener('pointerdown', close);
  }, []);
  return React.createElement('div', { ref, style: { position: 'relative', display: 'inline-block', ...style } },
    React.createElement('button', { type: 'button', 'aria-expanded': open, onClick: () => setOpen(!open),
      style: { font: 'inherit', fontSize: 'var(--text-sm)', padding: '8px 14px',
        borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)',
        background: 'var(--surface-raised)', color: 'var(--text-primary)', cursor: 'pointer' } }, trigger),
    open && React.createElement('div', { role: 'dialog', style: { position: 'absolute',
      top: 'calc(100% + 8px)', left: 0, width: 260, zIndex: 30, padding: 'var(--space-4) var(--space-5)',
      background: 'var(--surface-overlay)', border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)' } },
      title && React.createElement('div', { style: { fontWeight: 600, fontSize: 'var(--text-sm)',
        marginBottom: 4, color: 'var(--text-primary)' } }, title),
      React.createElement('div', { style: { fontSize: 'var(--text-sm)', color: 'var(--text-secondary)',
        lineHeight: 'var(--leading-relaxed)' } }, children)));
}
