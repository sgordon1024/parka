import React from 'react';

/**
 * Modal — centered dialog with overlay blur and entrance motion.
 * Traps focus, closes on Escape and overlay click, restores focus on close.
 */
export function Modal({ open, onClose, title, description, footer, size = 'md', children }) {
  const panelRef = React.useRef(null);
  const lastFocused = React.useRef(null);
  const titleId = React.useId();

  React.useEffect(() => {
    if (!open) return;
    lastFocused.current = document.activeElement;
    const t = setTimeout(() => {
      const focusable = panelRef.current && panelRef.current.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      (focusable || panelRef.current).focus();
    }, 30);
    const onKey = (e) => {
      if (e.key === 'Escape') onClose && onClose();
      if (e.key === 'Tab' && panelRef.current) {
        const nodes = panelRef.current.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (!nodes.length) return;
        const first = nodes[0], last = nodes[nodes.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { clearTimeout(t); document.removeEventListener('keydown', onKey); document.body.style.overflow = prevOverflow; if (lastFocused.current) lastFocused.current.focus(); };
  }, [open, onClose]);

  if (!open) return null;
  const maxW = size === 'sm' ? 400 : size === 'lg' ? 720 : 540;

  return React.createElement('div', {
    onMouseDown: (e) => { if (e.target === e.currentTarget) onClose && onClose(); },
    style: {
      position: 'fixed', inset: 0, zIndex: 90, display: 'grid', placeItems: 'center', padding: 'var(--space-6)',
      background: 'color-mix(in oklab, var(--neutral-975) 55%, transparent)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)',
      animation: 'ds-overlay-in var(--duration-fast) var(--ease-primary)',
    },
  },
    React.createElement('div', {
      ref: panelRef, role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': title ? titleId : undefined, tabIndex: -1,
      style: {
        width: '100%', maxWidth: maxW, maxHeight: '86vh', overflow: 'auto', outline: 'none',
        background: 'var(--surface-overlay)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-xl)',
        boxShadow: 'var(--shadow-xl)', padding: 'var(--space-8)', animation: 'ds-modal-in var(--duration-base) var(--ease-primary)',
      },
    },
      (title || onClose) && React.createElement('div', { style: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 'var(--space-4)', marginBottom: description ? 'var(--space-2)' : 'var(--space-6)' } },
        title && React.createElement('h2', { id: titleId, style: { margin: 0, fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', fontWeight: 600, letterSpacing: 'var(--tracking-tight)' } }, title),
        onClose && React.createElement('button', { type: 'button', 'aria-label': 'Close dialog', onClick: onClose, style: { border: 'none', background: 'transparent', color: 'var(--text-tertiary)', cursor: 'pointer', fontSize: 22, lineHeight: 1, padding: 4, marginTop: -2 } }, '×'),
      ),
      description && React.createElement('p', { style: { margin: '0 0 var(--space-6)', color: 'var(--text-secondary)', fontSize: 'var(--text-base)', lineHeight: 'var(--leading-relaxed)' } }, description),
      children,
      footer && React.createElement('div', { style: { display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)', marginTop: 'var(--space-8)' } }, footer),
    ),
  );
}
