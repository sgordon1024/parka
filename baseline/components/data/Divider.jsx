import React from 'react';

/**
 * Divider — a separator line between content groups. Horizontal by default;
 * optional centered label; vertical for inline separation.
 */
export function Divider({ label, vertical = false, style = {} }) {
  if (vertical) return React.createElement('span', { role: 'separator', 'aria-orientation': 'vertical',
    style: { display: 'inline-block', width: 1, alignSelf: 'stretch', minHeight: 20,
      background: 'var(--border-subtle)', margin: '0 var(--space-3)', ...style } });
  if (!label) return React.createElement('hr', { style: { border: 0, borderTop: '1px solid var(--border-subtle)',
    margin: 'var(--space-4) 0', ...style } });
  return React.createElement('div', { role: 'separator',
    style: { display: 'flex', alignItems: 'center', gap: 'var(--space-3)', margin: 'var(--space-4) 0', ...style } },
    React.createElement('span', { style: { flex: 1, height: 1, background: 'var(--border-subtle)' } }),
    React.createElement('span', { style: { fontSize: 'var(--text-2xs)', color: 'var(--text-tertiary)',
      textTransform: 'uppercase', letterSpacing: 'var(--tracking-wide)', fontFamily: 'var(--font-mono)' } }, label),
    React.createElement('span', { style: { flex: 1, height: 1, background: 'var(--border-subtle)' } }));
}
