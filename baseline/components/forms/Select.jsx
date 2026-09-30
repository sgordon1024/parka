import React from 'react';

/**
 * Select — native select styled to match Input, with a custom chevron.
 * options: array of { value, label } or plain strings.
 */
export function Select({
  label, helper, error, id, options = [], disabled = false, placeholder,
  size = 'md', style = {}, containerStyle = {}, ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  const rid = id || 'sel-' + React.useId();
  const height = size === 'sm' ? 40 : size === 'lg' ? 56 : 48;
  const borderColor = disabled ? 'var(--border-subtle)' : error ? 'var(--danger)' : focus ? 'var(--text-primary)' : 'var(--border-default)';
  const opts = options.map((o) => (typeof o === 'string' ? { value: o, label: o } : o));

  return React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', ...containerStyle } },
    label && React.createElement('label', {
      htmlFor: rid,
      style: { fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)', letterSpacing: 'var(--tracking-snug)' },
    }, label),
    React.createElement('div', { style: { position: 'relative', display: 'flex' } },
      React.createElement('select', {
        id: rid, disabled, 'aria-invalid': error ? true : undefined,
        onFocus: () => setFocus(true), onBlur: () => setFocus(false),
        style: {
          appearance: 'none', WebkitAppearance: 'none', width: '100%', height,
          padding: '0 var(--space-8) 0 var(--space-4)',
          background: disabled ? 'var(--bg-tertiary)' : 'var(--bg-primary)', color: 'var(--text-primary)',
          border: '1px solid ' + borderColor, borderRadius: 'var(--radius-md)', outline: 'none',
          fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', cursor: disabled ? 'not-allowed' : 'pointer',
          boxShadow: focus && !error ? '0 0 0 3px color-mix(in oklab, var(--text-primary) 12%, transparent)' : 'none',
          transition: 'border-color var(--duration-fast) var(--ease-primary), box-shadow var(--duration-fast) var(--ease-primary)',
          ...style,
        }, ...rest,
      },
        placeholder && React.createElement('option', { value: '', disabled: true, hidden: true }, placeholder),
        opts.map((o, i) => React.createElement('option', { key: i, value: o.value }, o.label)),
      ),
      React.createElement('span', {
        'aria-hidden': 'true',
        style: { position: 'absolute', right: 'var(--space-4)', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-tertiary)', fontSize: 12 },
      }, '▾'),
    ),
    (helper || error) && React.createElement('span', {
      style: { fontSize: 'var(--text-xs)', color: error ? 'var(--danger)' : 'var(--text-tertiary)' },
    }, error || helper),
  );
}
