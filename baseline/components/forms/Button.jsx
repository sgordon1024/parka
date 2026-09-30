import React from 'react';

const SIZES = {
  sm: { height: 36, pad: '0 14px', gap: 8, font: 'var(--text-sm)' },
  md: { height: 44, pad: '0 20px', gap: 8, font: 'var(--text-sm)' },
  lg: { height: 52, pad: '0 28px', gap: 10, font: 'var(--text-base)' },
};

const PALETTES = {
  primary: { bg: 'var(--action-primary)', hover: 'var(--action-primary-hover)', press: 'var(--action-primary-pressed)', color: 'var(--action-primary-text)', border: 'transparent' },
  secondary: { bg: 'var(--action-secondary)', hover: 'var(--action-secondary-hover)', press: 'var(--action-secondary-pressed)', color: 'var(--action-secondary-text)', border: 'var(--border-default)' },
  ghost: { bg: 'transparent', hover: 'var(--action-secondary-hover)', press: 'var(--action-secondary-pressed)', color: 'var(--action-secondary-text)', border: 'transparent' },
  destructive: { bg: 'var(--action-destructive)', hover: 'var(--action-destructive-hover)', press: 'var(--action-destructive-pressed)', color: 'var(--action-destructive-text)', border: 'transparent' },
};

/**
 * Button — primary action element. Monochrome by default; the accent is
 * reserved for the primary variant only.
 */
export function Button({
  variant = 'primary', size = 'md', loading = false, disabled = false,
  fullWidth = false, iconLeft = null, iconRight = null, type = 'button',
  children, style = {}, ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const [press, setPress] = React.useState(false);
  const isDisabled = disabled || loading;
  const s = SIZES[size] || SIZES.md;
  const p = PALETTES[variant] || PALETTES.primary;
  const bg = isDisabled ? (variant === 'primary' || variant === 'destructive' ? 'var(--bg-tertiary)' : 'transparent')
    : press ? p.press : hover ? p.hover : p.bg;

  const base = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: s.gap,
    width: fullWidth ? '100%' : 'auto', minHeight: s.height, height: s.height, padding: s.pad,
    fontFamily: 'var(--font-body)', fontSize: s.font, fontWeight: 600,
    letterSpacing: 'var(--tracking-snug)', lineHeight: 1, whiteSpace: 'nowrap',
    background: bg, color: isDisabled ? 'var(--text-disabled)' : p.color,
    border: '1px solid ' + (isDisabled ? 'var(--border-subtle)' : p.border),
    borderRadius: 'var(--radius-md)', cursor: isDisabled ? 'not-allowed' : 'pointer',
    transform: press && !isDisabled ? 'scale(0.98)' : hover && !isDisabled ? 'translateY(-1px)' : 'none',
    boxShadow: hover && !isDisabled && variant === 'primary' ? 'var(--shadow-bloom)' : 'none',
    transition: 'transform var(--duration-instant) var(--ease-primary), background var(--duration-fast) var(--ease-primary), box-shadow var(--duration-fast) var(--ease-primary)',
    userSelect: 'none', position: 'relative',
  };

  return React.createElement('button', {
    type, disabled: isDisabled, 'aria-busy': loading || undefined, style: { ...base, ...style },
    onMouseEnter: () => setHover(true), onMouseLeave: () => { setHover(false); setPress(false); },
    onMouseDown: () => setPress(true), onMouseUp: () => setPress(false), ...rest,
  },
    loading && React.createElement('span', {
      'aria-hidden': 'true',
      style: { width: '1em', height: '1em', borderRadius: '50%', border: '2px solid currentColor', borderTopColor: 'transparent', opacity: 0.9, animation: 'ds-spin 0.7s linear infinite' },
    }),
    !loading && iconLeft,
    React.createElement('span', { style: loading ? { opacity: 0.85 } : undefined }, children),
    !loading && iconRight,
  );
}
