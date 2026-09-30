import React from 'react';

/**
 * Switch — animated toggle. role="switch" with aria-checked for a11y.
 */
export function Switch({ label, checked, defaultChecked, disabled = false, id, onChange, style = {}, ...rest }) {
  const rid = id || 'sw-' + React.useId();
  const [internal, setInternal] = React.useState(!!defaultChecked);
  const isControlled = checked !== undefined;
  const on = isControlled ? checked : internal;
  const toggle = () => { if (disabled) return; const next = !on; if (!isControlled) setInternal(next); onChange && onChange(next); };

  return React.createElement('label', {
    htmlFor: rid,
    style: { display: 'inline-flex', alignItems: 'center', gap: 'var(--space-3)', minHeight: 44, cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.5 : 1, ...style },
  },
    React.createElement('button', {
      id: rid, type: 'button', role: 'switch', 'aria-checked': on, disabled, onClick: toggle,
      style: {
        position: 'relative', width: 48, height: 28, flexShrink: 0, padding: 0,
        borderRadius: 'var(--radius-full)', border: '1px solid ' + (on ? 'var(--accent-default)' : 'var(--border-strong)'),
        background: on ? 'var(--accent-default)' : 'var(--bg-tertiary)', cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'background var(--duration-fast) var(--ease-primary), border-color var(--duration-fast) var(--ease-primary)',
      }, ...rest,
    },
      React.createElement('span', {
        'aria-hidden': 'true',
        style: {
          position: 'absolute', top: 2, left: 2, width: 22, height: 22, borderRadius: '50%',
          background: on ? 'var(--accent-on)' : 'var(--bg-primary)', boxShadow: 'var(--shadow-sm)',
          transform: on ? 'translateX(20px)' : 'translateX(0)',
          transition: 'transform var(--duration-fast) var(--ease-spring)',
        },
      }),
    ),
    label && React.createElement('span', { style: { fontSize: 'var(--text-sm)', color: 'var(--text-primary)' } }, label),
  );
}
