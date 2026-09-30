import React from 'react';

/**
 * EmptyState — the "nothing here yet" pattern. Icon slot + title + copy + action.
 */
export function EmptyState({ icon, title, description, action, style = {}, ...rest }) {
  return React.createElement('div', {
    style: {
      display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
      gap: 'var(--space-4)', padding: 'var(--space-16) var(--space-8)',
      border: '1px dashed var(--border-default)', borderRadius: 'var(--radius-lg)', ...style,
    }, ...rest,
  },
    icon && React.createElement('div', {
      'aria-hidden': 'true',
      style: { display: 'grid', placeItems: 'center', width: 56, height: 56, borderRadius: 'var(--radius-lg)', background: 'var(--bg-tertiary)', color: 'var(--text-tertiary)', fontSize: 24 },
    }, icon),
    React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', maxWidth: 320 } },
      title && React.createElement('div', { style: { fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', fontWeight: 600, letterSpacing: 'var(--tracking-tight)', color: 'var(--text-primary)' } }, title),
      description && React.createElement('div', { style: { fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 'var(--leading-relaxed)' } }, description),
    ),
    action,
  );
}
