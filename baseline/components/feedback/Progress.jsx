import React from 'react';

/**
 * Progress — determinate bar, or indeterminate when `value` is null/undefined.
 */
export function Progress({ value = null, max = 100, label, style = {}, ...rest }) {
  const pct = value == null ? null : Math.max(0, Math.min(100, (value / max) * 100));
  return React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', ...style } },
    (label || pct != null) && React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' } },
      React.createElement('span', null, label),
      pct != null && React.createElement('span', { style: { fontFamily: 'var(--font-mono)' } }, Math.round(pct) + '%'),
    ),
    React.createElement('div', {
      role: 'progressbar', 'aria-valuenow': pct == null ? undefined : Math.round(pct), 'aria-valuemin': 0, 'aria-valuemax': 100, 'aria-label': typeof label === 'string' ? label : 'Progress',
      style: { position: 'relative', height: 6, borderRadius: 'var(--radius-full)', background: 'var(--bg-tertiary)', overflow: 'hidden' }, ...rest,
    },
      pct != null
        // animate transform, not width: width transitions relayout every frame
        ? React.createElement('div', { style: { height: '100%', width: '100%', background: 'var(--accent-default)', borderRadius: 'inherit', transform: `scaleX(${pct / 100})`, transformOrigin: 'left', transition: 'transform var(--duration-base) var(--ease-primary)' } })
        : React.createElement('div', { style: { position: 'absolute', top: 0, height: '100%', background: 'var(--accent-default)', borderRadius: 'inherit', animation: 'ds-indeterminate 1.4s var(--ease-in-out-quart) infinite' } }),
    ),
  );
}
