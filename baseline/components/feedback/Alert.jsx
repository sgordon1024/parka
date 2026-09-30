import React from 'react';

/**
 * Alert — an inline callout: info for context, success for done, warning for
 * attention or a choice, danger for failure. One per message; keep it short.
 */
const TONES = {
  info:    { color: 'var(--info)',    wash: 'var(--info-wash)',    glyph: 'i' },
  success: { color: 'var(--success)', wash: 'var(--success-wash)', glyph: '\u2713' },
  warning: { color: 'var(--warning)', wash: 'var(--warning-wash)', glyph: '!' },
  danger:  { color: 'var(--danger)',  wash: 'var(--danger-wash)',  glyph: '\u2715' },
};
export function Alert({ variant = 'info', title, children, style = {} }) {
  const t = TONES[variant] || TONES.info;
  return React.createElement('div', { role: variant === 'danger' ? 'alert' : 'status', style: {
    display: 'flex', gap: 12, padding: 'var(--space-4) var(--space-5)', background: t.wash,
    borderLeft: '3px solid ' + t.color, borderRadius: '0 var(--radius-md) var(--radius-md) 0', ...style } },
    React.createElement('span', { 'aria-hidden': true, style: { flex: '0 0 18px', height: 18, borderRadius: '50%',
      display: 'grid', placeItems: 'center', fontSize: 11, fontWeight: 700, color: t.color,
      border: '1.5px solid ' + t.color, marginTop: 1 } }, t.glyph),
    React.createElement('div', null,
      title && React.createElement('div', { style: { fontWeight: 600, fontSize: 'var(--text-sm)',
        color: 'var(--text-primary)', marginBottom: 2 } }, title),
      React.createElement('div', { style: { fontSize: 'var(--text-sm)', color: 'var(--text-secondary)',
        lineHeight: 'var(--leading-relaxed)' } }, children)));
}
