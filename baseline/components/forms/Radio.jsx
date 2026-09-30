import React from 'react';

/**
 * Radio — custom-styled radio. Use several with the same `name`.
 */
export function Radio({ label, name, value, checked, defaultChecked, disabled = false, id, onChange, style = {}, ...rest }) {
  const rid = id || 'rb-' + React.useId();
  const [internal, setInternal] = React.useState(!!defaultChecked);
  const isControlled = checked !== undefined;
  const on = isControlled ? checked : internal;

  return React.createElement('label', {
    htmlFor: rid,
    style: { display: 'inline-flex', alignItems: 'center', gap: 'var(--space-3)', minHeight: 44, cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.5 : 1, ...style },
  },
    React.createElement('span', { style: { position: 'relative', display: 'inline-flex', flexShrink: 0 } },
      React.createElement('input', {
        id: rid, type: 'radio', name, value, checked: isControlled ? checked : undefined, defaultChecked, disabled,
        onChange: (e) => { if (!isControlled) setInternal(e.target.checked); onChange && onChange(e); },
        style: { position: 'absolute', opacity: 0, width: 22, height: 22, margin: 0, cursor: 'inherit' }, ...rest,
      }),
      React.createElement('span', {
        'aria-hidden': 'true',
        style: {
          width: 22, height: 22, display: 'grid', placeItems: 'center', borderRadius: '50%',
          border: '1.5px solid ' + (on ? 'var(--accent-default)' : 'var(--border-strong)'),
          transition: 'border-color var(--duration-fast) var(--ease-primary)',
        },
      },
        React.createElement('span', {
          style: { width: 10, height: 10, borderRadius: '50%', background: 'var(--accent-default)', transform: on ? 'scale(1)' : 'scale(0)', transition: 'transform var(--duration-fast) var(--ease-spring)' },
        }),
      ),
    ),
    label && React.createElement('span', { style: { fontSize: 'var(--text-sm)', color: 'var(--text-primary)' } }, label),
  );
}
