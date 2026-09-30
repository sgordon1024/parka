import React from 'react';

/**
 * Combobox — a text input that filters a list of options as you type. For
 * medium-to-large sets where scanning a plain Select gets slow.
 */
export function Combobox({ label, options = [], placeholder = 'Search\u2026', onSelect, style = {} }) {
  const [q, setQ] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);
  React.useEffect(() => {
    const close = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('pointerdown', close);
    return () => document.removeEventListener('pointerdown', close);
  }, []);
  const hits = options.filter(o => o.toLowerCase().includes(q.toLowerCase()));
  return React.createElement('div', { ref, style: { position: 'relative', width: 260, ...style } },
    label && React.createElement('label', { style: { display: 'block', fontSize: 'var(--text-sm)',
      fontWeight: 500, marginBottom: 6, color: 'var(--text-primary)' } }, label),
    React.createElement('input', { role: 'combobox', 'aria-expanded': open, value: q, placeholder,
      onFocus: () => setOpen(true), onChange: e => { setQ(e.target.value); setOpen(true); },
      style: { width: '100%', font: 'inherit', fontSize: 'var(--text-sm)', padding: '10px 14px',
        borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)',
        background: 'var(--surface-raised)', color: 'var(--text-primary)', outline: 'none',
        boxSizing: 'border-box' } }),
    open && React.createElement('div', { role: 'listbox', style: { position: 'absolute',
      top: 'calc(100% + 6px)', left: 0, right: 0, zIndex: 30, maxHeight: 200, overflowY: 'auto',
      padding: 6, background: 'var(--surface-overlay)', border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-lg)' } },
      hits.length ? hits.map(o => React.createElement('button', { key: o, type: 'button', role: 'option',
        onClick: () => { setQ(o); setOpen(false); onSelect && onSelect(o); },
        style: { display: 'block', width: '100%', textAlign: 'left', font: 'inherit',
          fontSize: 'var(--text-sm)', padding: '8px 10px', border: 0, borderRadius: 'var(--radius-sm)',
          background: 'transparent', cursor: 'pointer', color: 'var(--text-primary)' },
        onMouseEnter: e => e.currentTarget.style.background = 'var(--bg-secondary)',
        onMouseLeave: e => e.currentTarget.style.background = 'transparent' }, o))
      : React.createElement('div', { style: { padding: '10px 12px', fontSize: 'var(--text-sm)',
          color: 'var(--text-tertiary)' } }, 'No matches')));
}
