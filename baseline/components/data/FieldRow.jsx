import React from 'react';

/**
 * FieldRow — a leading icon + a primary label + a secondary meta line. Use in
 * property panels, reference lists, and detail sidebars where each row names a
 * value and where it came from. The icon is passed in as a node (never baked in),
 * per the Baseline icon rule.
 */
export function FieldRow({ icon, label, meta, style = {}, ...rest }) {
  return React.createElement('div', {
    style: {
      display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0',
      color: 'var(--text-secondary)', fontSize: 'var(--text-xs)', ...style,
    }, ...rest,
  },
    icon && React.createElement('span', {
      'aria-hidden': 'true',
      style: { display: 'inline-flex', flex: '0 0 auto', color: 'var(--text-tertiary)' },
    }, icon),
    React.createElement('span', { style: { minWidth: 0 } },
      label,
      meta != null && React.createElement('span', {
        style: { display: 'block', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xs)', color: 'var(--text-tertiary)' },
      }, meta),
    ),
  );
}
