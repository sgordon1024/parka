import React from 'react';

const SIZES = { sm: 40, md: 48, lg: 56 };

/**
 * Input — single-line text field with label, helper, and error/success states.
 * Meaning is never encoded in color alone: the status word + icon carry it too.
 */
export function Input({
  label, helper, error, success, id, size = 'md', disabled = false,
  iconLeft = null, prefix = null, type = 'text', style = {}, containerStyle = {}, ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  const rid = id || 'inp-' + React.useId();
  const status = error ? 'error' : success ? 'success' : 'default';
  const height = SIZES[size] || SIZES.md;
  const borderColor = disabled ? 'var(--border-subtle)'
    : status === 'error' ? 'var(--danger)'
    : status === 'success' ? 'var(--success)'
    : focus ? 'var(--text-primary)' : 'var(--border-default)';

  return React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', ...containerStyle } },
    label && React.createElement('label', {
      htmlFor: rid,
      style: { fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)', letterSpacing: 'var(--tracking-snug)' },
    }, label),
    React.createElement('div', {
      style: {
        display: 'flex', alignItems: 'center', gap: 'var(--space-2)', height,
        padding: '0 var(--space-4)', background: disabled ? 'var(--bg-tertiary)' : 'var(--bg-primary)',
        border: '1px solid ' + borderColor, borderRadius: 'var(--radius-md)',
        boxShadow: focus && status === 'default' ? '0 0 0 3px color-mix(in oklab, var(--text-primary) 12%, transparent)' : 'none',
        transition: 'border-color var(--duration-fast) var(--ease-primary), box-shadow var(--duration-fast) var(--ease-primary)',
      },
    },
      iconLeft && React.createElement('span', { 'aria-hidden': 'true', style: { display: 'flex', color: 'var(--text-tertiary)', flexShrink: 0 } }, iconLeft),
      prefix && React.createElement('span', { style: { color: 'var(--text-tertiary)', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-mono)' } }, prefix),
      React.createElement('input', {
        id: rid, type, disabled,
        'aria-invalid': status === 'error' || undefined,
        'aria-describedby': (helper || error || success) ? rid + '-hint' : undefined,
        onFocus: () => setFocus(true), onBlur: () => setFocus(false),
        style: {
          flex: 1, minWidth: 0, height: '100%', border: 'none', outline: 'none', background: 'transparent',
          color: 'var(--text-primary)', fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)',
          cursor: disabled ? 'not-allowed' : 'text', ...style,
        }, ...rest,
      }),
    ),
    (helper || error || success) && React.createElement('span', {
      id: rid + '-hint',
      style: { display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 'var(--text-xs)', color: status === 'error' ? 'var(--danger)' : status === 'success' ? 'var(--success)' : 'var(--text-tertiary)' },
    },
      status !== 'default' && React.createElement('span', { 'aria-hidden': 'true', style: { fontWeight: 700 } }, status === 'error' ? '!' : '✓'),
      error || success || helper,
    ),
  );
}
