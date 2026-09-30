import React from 'react';

/**
 * Textarea — multi-line text field with label, helper, and error states.
 */
export function Textarea({
  label, helper, error, id, rows = 4, disabled = false, style = {}, containerStyle = {}, ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  const rid = id || 'ta-' + React.useId();
  const borderColor = disabled ? 'var(--border-subtle)'
    : error ? 'var(--danger)'
    : focus ? 'var(--text-primary)' : 'var(--border-default)';

  return React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', ...containerStyle } },
    label && React.createElement('label', {
      htmlFor: rid,
      style: { fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)', letterSpacing: 'var(--tracking-snug)' },
    }, label),
    React.createElement('textarea', {
      id: rid, rows, disabled,
      'aria-invalid': error ? true : undefined,
      onFocus: () => setFocus(true), onBlur: () => setFocus(false),
      style: {
        width: '100%', resize: 'vertical', padding: 'var(--space-3) var(--space-4)',
        background: disabled ? 'var(--bg-tertiary)' : 'var(--bg-primary)', color: 'var(--text-primary)',
        border: '1px solid ' + borderColor, borderRadius: 'var(--radius-md)', outline: 'none',
        fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', lineHeight: 'var(--leading-normal)',
        boxShadow: focus && !error ? '0 0 0 3px color-mix(in oklab, var(--text-primary) 12%, transparent)' : 'none',
        transition: 'border-color var(--duration-fast) var(--ease-primary), box-shadow var(--duration-fast) var(--ease-primary)',
        ...style,
      }, ...rest,
    }),
    (helper || error) && React.createElement('span', {
      style: { fontSize: 'var(--text-xs)', color: error ? 'var(--danger)' : 'var(--text-tertiary)' },
    }, error || helper),
  );
}
