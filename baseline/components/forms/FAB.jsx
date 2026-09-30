import React from 'react';

/**
 * FAB — a floating action button for THE single most important action on a
 * screen. At most one; icon plus optional label; never for minor actions.
 */
export function FAB({ icon = '+', label, onClick, style = {} }) {
  return React.createElement('button', { type: 'button', onClick, 'aria-label': label || 'Primary action',
    style: { display: 'inline-flex', alignItems: 'center', gap: 10, height: 52,
      padding: label ? '0 22px' : '0 17px', border: 0, borderRadius: 'var(--radius-lg)',
      background: 'var(--accent-default)', color: 'var(--action-primary-text)', cursor: 'pointer',
      font: 'inherit', fontSize: 'var(--text-sm)', fontWeight: 600, boxShadow: 'var(--shadow-lg)', ...style } },
    React.createElement('span', { 'aria-hidden': true, style: { fontSize: 20, lineHeight: 1 } }, icon),
    label);
}
