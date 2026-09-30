import React from 'react';

/**
 * Card — surface container. `interactive` adds hover lift + pointer affordance.
 */
export function Card({ interactive = false, as = 'div', padding = 'var(--space-6)', children, style = {}, ...rest }) {
  const [hover, setHover] = React.useState(false);
  const base = {
    background: 'var(--surface-raised)', border: '1px solid var(--border-subtle)',
    borderRadius: 'var(--radius-lg)', padding, position: 'relative',
    boxShadow: interactive && hover ? 'var(--shadow-md)' : 'var(--shadow-xs)',
    transform: interactive && hover ? 'translateY(-2px)' : 'none',
    cursor: interactive ? 'pointer' : 'default',
    transition: 'transform var(--duration-base) var(--ease-primary), box-shadow var(--duration-base) var(--ease-primary), border-color var(--duration-base) var(--ease-primary)',
    borderColor: interactive && hover ? 'var(--border-default)' : 'var(--border-subtle)',
  };
  return React.createElement(as, {
    style: { ...base, ...style },
    onMouseEnter: interactive ? () => setHover(true) : undefined,
    onMouseLeave: interactive ? () => setHover(false) : undefined,
    ...rest,
  }, children);
}

/**
 * MediaCard — image-topped card with a consistent duotone-ready overlay.
 */
export function MediaCard({ image, eyebrow, title, children, style = {}, ...rest }) {
  return React.createElement(Card, { interactive: true, padding: 0, style: { overflow: 'hidden', ...style }, ...rest },
    React.createElement('div', {
      style: {
        height: 180, background: image ? 'center/cover no-repeat url(' + image + ')' : 'var(--bg-tertiary)',
        position: 'relative',
      },
    },
      React.createElement('div', { style: { position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 40%, color-mix(in oklab, var(--neutral-975) 55%, transparent))' } }),
    ),
    React.createElement('div', { style: { padding: 'var(--space-6)' } },
      eyebrow && React.createElement('div', { style: { fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xs)', letterSpacing: 'var(--tracking-wide)', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: 'var(--space-2)' } }, eyebrow),
      title && React.createElement('div', { style: { fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', fontWeight: 600, letterSpacing: 'var(--tracking-tight)', marginBottom: 'var(--space-2)' } }, title),
      children && React.createElement('div', { style: { color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', lineHeight: 'var(--leading-relaxed)' } }, children),
    ),
  );
}
