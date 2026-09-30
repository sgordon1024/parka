import React from 'react';

/**
 * Toolbar — a floating cluster of icon / text controls (e.g. a canvas pan +
 * zoom bar). Renders a rounded pill with buttons and separators.
 *
 * items: [{ id, icon, label, ariaLabel, pressed, mono, onClick } | { type: 'sep' }]
 *  - pressed: renders a toggled (armed) tool
 *  - mono:    a numeric readout (monospace, wider min-width)
 */
function TBtn({ icon, label, ariaLabel, pressed = false, mono = false, onClick }) {
  const [hover, setHover] = React.useState(false);
  const [press, setPress] = React.useState(false);
  const bg = pressed || press
    ? 'color-mix(in oklab, var(--text-primary) 14%, transparent)'
    : hover
      ? 'color-mix(in oklab, var(--text-primary) 8%, transparent)'
      : 'transparent';
  return React.createElement('button', {
    type: 'button', 'aria-label': ariaLabel || (typeof label === 'string' ? label : undefined),
    'aria-pressed': pressed || undefined, onClick,
    onMouseEnter: () => setHover(true), onMouseLeave: () => { setHover(false); setPress(false); },
    onMouseDown: () => setPress(true), onMouseUp: () => setPress(false),
    style: {
      display: 'grid', placeItems: 'center', height: 32, minWidth: mono ? 46 : 32, padding: '0 8px',
      border: 0, cursor: 'pointer', background: bg,
      color: pressed || hover ? 'var(--text-primary)' : 'var(--text-secondary)',
      borderRadius: 'var(--radius-full)', fontFamily: mono ? 'var(--font-mono)' : 'inherit',
      fontSize: mono ? 'var(--text-2xs)' : 'var(--text-xs)', lineHeight: 1,
      transition: 'background var(--duration-fast) var(--ease-primary), color var(--duration-fast) var(--ease-primary)',
    },
  }, icon || label);
}

export function Toolbar({ items = [], style = {}, ...rest }) {
  return React.createElement('div', {
    role: 'toolbar', 'aria-label': rest['aria-label'] || 'Toolbar', ...rest,
    style: {
      display: 'inline-flex', alignItems: 'center', gap: 2, padding: 4,
      background: 'var(--surface-overlay)', border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-full)', boxShadow: 'var(--shadow-lg)', ...style,
    },
  },
    items.map((it, i) => it.type === 'sep'
      ? React.createElement('span', {
          key: 'sep-' + i, 'aria-hidden': 'true',
          style: { width: 1, height: 20, background: 'var(--border-subtle)', margin: '0 3px' },
        })
      : React.createElement(TBtn, { key: it.id || i, ...it })),
  );
}
