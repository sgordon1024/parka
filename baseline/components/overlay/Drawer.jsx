import React from 'react';

/**
 * Drawer — side panel that slides in from an edge. Same overlay + focus/Escape
 * behavior as Modal.
 */
export function Drawer({ open, onClose, title, side = 'right', width = 420, children, footer }) {
  const panelRef = React.useRef(null);
  const lastFocused = React.useRef(null);
  const titleId = React.useId();

  React.useEffect(() => {
    if (!open) return;
    lastFocused.current = document.activeElement;
    const t = setTimeout(() => { (panelRef.current && panelRef.current.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])') || panelRef.current).focus(); }, 30);
    const onKey = (e) => { if (e.key === 'Escape') onClose && onClose(); };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow; document.body.style.overflow = 'hidden';
    return () => { clearTimeout(t); document.removeEventListener('keydown', onKey); document.body.style.overflow = prev; if (lastFocused.current) lastFocused.current.focus(); };
  }, [open, onClose]);

  if (!open) return null;
  const isRight = side === 'right';

  return React.createElement('div', {
    onMouseDown: (e) => { if (e.target === e.currentTarget) onClose && onClose(); },
    style: {
      position: 'fixed', inset: 0, zIndex: 90, display: 'flex', justifyContent: isRight ? 'flex-end' : 'flex-start',
      background: 'color-mix(in oklab, var(--neutral-975) 55%, transparent)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)',
      animation: 'ds-overlay-in var(--duration-fast) var(--ease-primary)',
    },
  },
    React.createElement('div', {
      ref: panelRef, role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': title ? titleId : undefined, tabIndex: -1,
      style: {
        width: '100%', maxWidth: width, height: '100%', display: 'flex', flexDirection: 'column', outline: 'none',
        background: 'var(--surface-overlay)', borderLeft: isRight ? '1px solid var(--border-default)' : 'none', borderRight: isRight ? 'none' : '1px solid var(--border-default)',
        boxShadow: 'var(--shadow-xl)', animation: 'ds-drawer-in var(--duration-base) var(--ease-primary)',
        transformOrigin: isRight ? 'right' : 'left', ...(isRight ? {} : { animationName: 'ds-drawer-in', transform: 'none' }),
      },
    },
      (title || onClose) && React.createElement('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-4)', padding: 'var(--space-6)', borderBottom: '1px solid var(--border-subtle)' } },
        title && React.createElement('h2', { id: titleId, style: { margin: 0, fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', fontWeight: 600, letterSpacing: 'var(--tracking-tight)' } }, title),
        onClose && React.createElement('button', { type: 'button', 'aria-label': 'Close', onClick: onClose, style: { border: 'none', background: 'transparent', color: 'var(--text-tertiary)', cursor: 'pointer', fontSize: 22, lineHeight: 1, padding: 4 } }, '×'),
      ),
      React.createElement('div', { style: { flex: 1, overflow: 'auto', padding: 'var(--space-6)' } }, children),
      footer && React.createElement('div', { style: { display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)', padding: 'var(--space-6)', borderTop: '1px solid var(--border-subtle)' } }, footer),
    ),
  );
}
