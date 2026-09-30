import React from 'react';

/**
 * Checkbox — custom-styled, animated. Label is part of the hit target
 * (44px min height). Supports indeterminate.
 */
export function Checkbox({ label, checked, defaultChecked, indeterminate = false, disabled = false, id, onChange, style = {}, ...rest }) {
  const rid = id || 'cb-' + React.useId();
  const ref = React.useRef(null);
  React.useEffect(() => { if (ref.current) ref.current.indeterminate = indeterminate; }, [indeterminate]);
  const [internal, setInternal] = React.useState(!!defaultChecked);
  const isControlled = checked !== undefined;
  const on = isControlled ? checked : internal;

  return React.createElement('label', {
    htmlFor: rid,
    style: { display: 'inline-flex', alignItems: 'center', gap: 'var(--space-3)', minHeight: 44, cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.5 : 1, ...style },
  },
    React.createElement('span', { style: { position: 'relative', display: 'inline-flex', flexShrink: 0 } },
      React.createElement('input', {
        ref, id: rid, type: 'checkbox', checked: isControlled ? checked : undefined, defaultChecked, disabled,
        onChange: (e) => { if (!isControlled) setInternal(e.target.checked); onChange && onChange(e); },
        style: { position: 'absolute', opacity: 0, width: 22, height: 22, margin: 0, cursor: 'inherit' }, ...rest,
      }),
      React.createElement('span', {
        'aria-hidden': 'true',
        style: {
          width: 22, height: 22, display: 'grid', placeItems: 'center', borderRadius: 'var(--radius-xs)',
          border: '1.5px solid ' + (on || indeterminate ? 'var(--accent-default)' : 'var(--border-strong)'),
          background: on || indeterminate ? 'var(--accent-default)' : 'transparent',
          color: 'var(--accent-on)', transition: 'background var(--duration-fast) var(--ease-primary), border-color var(--duration-fast) var(--ease-primary)',
        },
      },
        React.createElement('span', {
          style: { fontSize: 14, fontWeight: 800, lineHeight: 1, transform: on || indeterminate ? 'scale(1)' : 'scale(0)', transition: 'transform var(--duration-fast) var(--ease-spring)' },
        }, indeterminate ? '–' : '✓'),
      ),
    ),
    label && React.createElement('span', { style: { fontSize: 'var(--text-sm)', color: 'var(--text-primary)' } }, label),
  );
}
