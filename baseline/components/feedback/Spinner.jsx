import React from 'react';

/**
 * Spinner — indeterminate loading indicator. Respects prefers-reduced-motion
 * via the global keyframe rule.
 */
export function Spinner({ size = 20, thickness = 2, label = 'Loading', style = {}, ...rest }) {
  return React.createElement('span', {
    role: 'status', 'aria-label': label,
    style: {
      display: 'inline-block', width: size, height: size, borderRadius: '50%',
      border: thickness + 'px solid var(--border-default)', borderTopColor: 'var(--accent-default)',
      animation: 'ds-spin 0.7s linear infinite', ...style,
    }, ...rest,
  });
}
