import React from 'react';

/**
 * Tooltip — hover/focus label. Wraps its child; the child stays focusable so
 * the tip is keyboard-reachable.
 */
export function Tooltip({ content, placement = 'top', children, style = {} }) {
  const [open, setOpen] = React.useState(false);
  const pos = placement === 'bottom'
    ? { top: 'calc(100% + 8px)', bottom: 'auto', left: '50%', transform: 'translateX(-50%)' }
    : { bottom: 'calc(100% + 8px)', top: 'auto', left: '50%', transform: 'translateX(-50%)' };

  return React.createElement('span', {
    style: { position: 'relative', display: 'inline-flex', ...style },
    onMouseEnter: () => setOpen(true), onMouseLeave: () => setOpen(false),
    onFocus: () => setOpen(true), onBlur: () => setOpen(false),
  },
    children,
    React.createElement('span', {
      role: 'tooltip',
      style: {
        position: 'absolute', ...pos, zIndex: 50, pointerEvents: 'none', whiteSpace: 'nowrap',
        padding: '6px 10px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-inverse)',
        color: 'var(--text-inverse)', fontSize: 'var(--text-2xs)', fontWeight: 500, boxShadow: 'var(--shadow-md)',
        opacity: open ? 1 : 0, transform: (pos.transform || '') + (open ? ' translateY(0)' : ' translateY(4px)'),
        transition: 'opacity var(--duration-fast) var(--ease-primary), transform var(--duration-fast) var(--ease-primary)',
      },
    }, content),
  );
}
