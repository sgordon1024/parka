import React from 'react';

const TONES = {
  neutral: 'var(--text-primary)', success: 'var(--success)', warning: 'var(--warning)', danger: 'var(--danger)', info: 'var(--info)',
};
const ICON = { neutral: '•', success: '✓', warning: '!', danger: '×', info: 'i' };

/**
 * Toast — a single notification. Compose several inside <ToastStack>.
 * Icon + title carry meaning; color is secondary (a11y).
 */
export function Toast({ tone = 'neutral', title, description, onClose, style = {}, ...rest }) {
  const accent = TONES[tone] || TONES.neutral;
  return React.createElement('div', {
    role: 'status',
    style: {
      display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)', width: 340, maxWidth: '90vw',
      padding: 'var(--space-4)', background: 'var(--surface-overlay)', border: '1px solid var(--border-default)',
      borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)', animation: 'ds-toast-in var(--duration-base) var(--ease-primary)', ...style,
    }, ...rest,
  },
    React.createElement('span', {
      'aria-hidden': 'true',
      style: { display: 'grid', placeItems: 'center', width: 22, height: 22, flexShrink: 0, borderRadius: '50%', background: 'color-mix(in oklab,' + accent + ' 16%, transparent)', color: accent, fontSize: 12, fontWeight: 800 },
    }, ICON[tone]),
    React.createElement('div', { style: { flex: 1, minWidth: 0 } },
      title && React.createElement('div', { style: { fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)' } }, title),
      description && React.createElement('div', { style: { fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginTop: 2, lineHeight: 'var(--leading-normal)' } }, description),
    ),
    onClose && React.createElement('button', {
      type: 'button', 'aria-label': 'Dismiss', onClick: onClose,
      style: { border: 'none', background: 'transparent', color: 'var(--text-tertiary)', cursor: 'pointer', fontSize: 16, lineHeight: 1, padding: 2, flexShrink: 0 },
    }, '×'),
  );
}

/**
 * ToastStack — fixed positioned region for toasts. `position` picks a corner.
 */
export function ToastStack({ position = 'bottom-right', children, style = {} }) {
  const [v, h] = position.split('-');
  return React.createElement('div', {
    'aria-live': 'polite', role: 'region', 'aria-label': 'Notifications',
    style: {
      position: 'fixed', zIndex: 80, display: 'flex', flexDirection: 'column', gap: 'var(--space-3)',
      [v === 'top' ? 'top' : 'bottom']: 'var(--space-6)', [h === 'left' ? 'left' : 'right']: 'var(--space-6)', ...style,
    },
  }, children);
}
