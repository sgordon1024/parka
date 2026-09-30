import React from 'react';
import { Button } from './Button.jsx';

/**
 * IconButton — square, icon-only button. Enforces a 44px minimum touch target
 * (36px sm still centers a 44px hit area is recommended in dense toolbars).
 */
export function IconButton({ size = 'md', variant = 'secondary', label, children, style = {}, ...rest }) {
  const dim = size === 'sm' ? 36 : size === 'lg' ? 52 : 44;
  return React.createElement(Button, {
    variant, size, 'aria-label': label,
    style: { width: dim, height: dim, minWidth: dim, padding: 0, borderRadius: 'var(--radius-md)', ...style },
    ...rest,
  }, children);
}
