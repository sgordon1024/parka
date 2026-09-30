import React from 'react';

/**
 * SegmentedControl — a single choice among 2-5 closely related options that
 * affect one object, state, or view (view modes, time ranges). Not navigation.
 */
export function SegmentedControl({ options = [], defaultValue, onChange, style = {} }) {
  const [val, setVal] = React.useState(defaultValue != null ? defaultValue : (options[0] && options[0].value));
  return React.createElement('div', { role: 'radiogroup', style: { display: 'inline-flex', padding: 3,
    background: 'var(--surface-sunken)', border: '1px solid var(--border-subtle)',
    borderRadius: 'var(--radius-md)', gap: 2, ...style } },
    options.map(o => {
      const on = o.value === val;
      return React.createElement('button', { key: o.value, type: 'button', role: 'radio', 'aria-checked': on,
        onClick: () => { setVal(o.value); onChange && onChange(o.value); },
        style: { font: 'inherit', fontSize: 'var(--text-sm)', fontWeight: on ? 600 : 400, border: 0,
          cursor: 'pointer', padding: '6px 14px', borderRadius: 'calc(var(--radius-md) - 3px)',
          background: on ? 'var(--surface-raised)' : 'transparent',
          color: on ? 'var(--text-primary)' : 'var(--text-secondary)',
          boxShadow: on ? 'var(--shadow-xs)' : 'none' } }, o.label);
    }));
}
