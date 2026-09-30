import React from 'react';

/**
 * Accordion — disclosure list. items: [{ id, title, content }].
 * `multiple` allows more than one panel open at once.
 */
export function Accordion({ items = [], multiple = false, defaultOpen = [], style = {} }) {
  const [open, setOpen] = React.useState(new Set(defaultOpen));
  const toggle = (id) => setOpen((prev) => {
    const next = new Set(multiple ? prev : []);
    if (prev.has(id)) next.delete(id); else next.add(id);
    return next;
  });

  return React.createElement('div', {
    style: { border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', ...style },
  },
    items.map((it, i) => {
      const isOpen = open.has(it.id);
      return React.createElement('div', { key: it.id, style: { borderTop: i === 0 ? 'none' : '1px solid var(--border-subtle)' } },
        React.createElement('h3', { style: { margin: 0 } },
          React.createElement('button', {
            type: 'button', 'aria-expanded': isOpen, 'aria-controls': 'acc-' + it.id, onClick: () => toggle(it.id),
            style: {
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-4)',
              padding: 'var(--space-5) var(--space-6)', border: 'none', background: 'transparent', cursor: 'pointer',
              textAlign: 'left', color: 'var(--text-primary)', fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', fontWeight: 600,
            },
          },
            it.title,
            React.createElement('span', { 'aria-hidden': 'true', style: { flexShrink: 0, fontSize: 18, color: 'var(--text-tertiary)', transform: isOpen ? 'rotate(45deg)' : 'rotate(0)', transition: 'transform var(--duration-base) var(--ease-primary)' } }, '+'),
          ),
        ),
        React.createElement('div', {
          id: 'acc-' + it.id, role: 'region', hidden: !isOpen,
          style: { padding: isOpen ? '0 var(--space-6) var(--space-5)' : '0 var(--space-6)', color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', lineHeight: 'var(--leading-relaxed)' },
        }, it.content),
      );
    }),
  );
}
