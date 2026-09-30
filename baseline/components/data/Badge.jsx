import React from 'react';

const TONES = {
  neutral: { bg: 'var(--bg-tertiary)', color: 'var(--text-secondary)', border: 'var(--border-default)' },
  accent:  { bg: 'var(--accent-wash)', color: 'var(--text-primary)', border: 'var(--accent-subtle)' },
  success: { bg: 'var(--success-wash)', color: 'var(--success)', border: 'transparent' },
  warning: { bg: 'var(--warning-wash)', color: 'var(--warning)', border: 'transparent' },
  danger:  { bg: 'var(--danger-wash)', color: 'var(--danger)', border: 'transparent' },
  info:    { bg: 'var(--info-wash)', color: 'var(--info)', border: 'transparent' },
};

/**
 * Badge — small status/label pill. `dot` prepends a status dot so meaning is
 * never carried by color alone. `solid` fills with the tone color.
 */
export function Badge({ tone = 'neutral', dot = false, solid = false, children, style = {}, ...rest }) {
  const t = TONES[tone] || TONES.neutral;
  const solidStyle = solid ? { background: tone === 'neutral' ? 'var(--bg-inverse)' : t.color, color: tone === 'neutral' ? 'var(--text-inverse)' : 'var(--status-ink, var(--accent-on))', border: '1px solid transparent' } : { background: t.bg, color: t.color, border: '1px solid ' + t.border };
  return React.createElement('span', {
    style: {
      display: 'inline-flex', alignItems: 'center', gap: 6, height: 24, padding: '0 10px',
      borderRadius: 'var(--radius-full)', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xs)',
      fontWeight: 500, letterSpacing: 'var(--tracking-wide)', textTransform: 'uppercase', whiteSpace: 'nowrap',
      ...solidStyle, ...style,
    }, ...rest,
  },
    dot && React.createElement('span', { 'aria-hidden': 'true', style: { width: 6, height: 6, borderRadius: '50%', background: 'currentColor' } }),
    children,
  );
}

/**
 * Tag — removable chip. Provide `onRemove` to show the × affordance.
 */
export function Tag({ children, onRemove, style = {}, ...rest }) {
  return React.createElement('span', {
    style: {
      display: 'inline-flex', alignItems: 'center', gap: 6, height: 28, padding: onRemove ? '0 6px 0 12px' : '0 12px',
      borderRadius: 'var(--radius-sm)', background: 'var(--bg-tertiary)', border: '1px solid var(--border-default)',
      color: 'var(--text-primary)', fontSize: 'var(--text-sm)', ...style,
    }, ...rest,
  },
    children,
    onRemove && React.createElement('button', {
      type: 'button', 'aria-label': 'Remove', onClick: onRemove,
      style: { display: 'grid', placeItems: 'center', width: 18, height: 18, border: 'none', borderRadius: 'var(--radius-xs)', background: 'transparent', color: 'var(--text-tertiary)', cursor: 'pointer', fontSize: 14, lineHeight: 1 },
    }, '×'),
  );
}
