import React from 'react';

/**
 * Skeleton — shimmer placeholder. Use `variant="text"` for lines,
 * `circle` for avatars, `rect` for blocks.
 */
export function Skeleton({ variant = 'rect', width, height, style = {}, ...rest }) {
  const dims = variant === 'text'
    ? { width: width || '100%', height: height || '0.85em', borderRadius: 'var(--radius-xs)' }
    : variant === 'circle'
    ? { width: width || 40, height: height || width || 40, borderRadius: '50%' }
    : { width: width || '100%', height: height || 120, borderRadius: 'var(--radius-md)' };
  return React.createElement('span', {
    'aria-hidden': 'true',
    style: {
      display: 'block',
      background: 'linear-gradient(90deg, var(--bg-tertiary) 25%, color-mix(in oklab, var(--bg-tertiary), var(--text-tertiary) 14%) 37%, var(--bg-tertiary) 63%)',
      backgroundSize: '400% 100%', animation: 'ds-shimmer 1.4s ease infinite', ...dims, ...style,
    }, ...rest,
  });
}
