import React from 'react';

/**
 * Kbd — an inline keyboard-key cap for shortcuts in docs and menus.
 * `size="md"` is the pressable-looking action cap for keys the product is
 * actively inviting (approve/decline hotkeys); `tone="accent"` marks the
 * invitation with the accent, for at most one key pair per view.
 */
export function Kbd({ size = 'sm', tone = 'neutral', children, style = {} }) {
  const accent = tone === 'accent';
  const md = size === 'md';
  return React.createElement('kbd', { style: {
    display: 'inline-block', padding: md ? '5px 11px' : '2px 7px',
    fontFamily: 'var(--font-mono)', fontSize: md ? 'var(--text-xs)' : 'var(--text-2xs)',
    fontWeight: md ? 700 : 400, textAlign: 'center', minWidth: md ? 32 : undefined,
    color: accent ? 'var(--accent-default)' : 'var(--text-secondary)',
    background: accent ? 'var(--accent-wash)' : 'var(--bg-tertiary)',
    border: '1px solid ' + (accent ? 'var(--accent-subtle)' : 'var(--border-default)'),
    borderBottomWidth: 2, borderRadius: 'var(--radius-sm)', lineHeight: 1.4, ...style } }, children);
}
