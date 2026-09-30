import React from 'react';

/**
 * Breadcrumbs — navigation trail. items: [{ label, href }]. Last item is
 * marked aria-current and rendered as plain text.
 */
export function Breadcrumbs({ items = [], style = {} }) {
  return React.createElement('nav', { 'aria-label': 'Breadcrumb', style: { ...style } },
    React.createElement('ol', {
      style: { display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 'var(--space-2)', listStyle: 'none', margin: 0, padding: 0, fontSize: 'var(--text-sm)' },
    },
      items.map((it, i) => {
        const last = i === items.length - 1;
        return React.createElement('li', { key: i, style: { display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)' } },
          last
            ? React.createElement('span', { 'aria-current': 'page', style: { color: 'var(--text-primary)', fontWeight: 600 } }, it.label)
            : React.createElement('a', { href: it.href || '#', style: { color: 'var(--text-tertiary)' } }, it.label),
          !last && React.createElement('span', { 'aria-hidden': 'true', style: { color: 'var(--text-disabled)' } }, '/'),
        );
      }),
    ),
  );
}
