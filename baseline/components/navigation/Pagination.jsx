import React from 'react';

function range(count) { return Array.from({ length: count }, (_, i) => i + 1); }

/**
 * Pagination — page navigation with truncation. Controlled via `page` + `onChange`.
 */
export function Pagination({ page = 1, total = 1, siblings = 1, onChange, style = {} }) {
  const go = (p) => { if (p >= 1 && p <= total && p !== page) onChange && onChange(p); };
  let pages;
  if (total <= 7) pages = range(total);
  else {
    const left = Math.max(2, page - siblings), right = Math.min(total - 1, page + siblings);
    pages = [1];
    if (left > 2) pages.push('…');
    for (let i = left; i <= right; i++) pages.push(i);
    if (right < total - 1) pages.push('…');
    pages.push(total);
  }

  const btn = (label, opts) => React.createElement('button', {
    type: 'button', ...opts,
    style: {
      minWidth: 40, height: 40, padding: '0 10px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      border: '1px solid ' + (opts['aria-current'] ? 'var(--text-primary)' : 'var(--border-default)'),
      background: opts['aria-current'] ? 'var(--bg-inverse)' : 'transparent',
      color: opts['aria-current'] ? 'var(--text-inverse)' : opts.disabled ? 'var(--text-disabled)' : 'var(--text-primary)',
      borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)',
      cursor: opts.disabled ? 'not-allowed' : 'pointer', transition: 'background var(--duration-fast) var(--ease-primary), border-color var(--duration-fast) var(--ease-primary)',
    },
  }, label);

  return React.createElement('nav', { 'aria-label': 'Pagination', style: { display: 'flex', alignItems: 'center', gap: 'var(--space-2)', ...style } },
    btn('‹', { key: 'prev', 'aria-label': 'Previous page', disabled: page <= 1, onClick: () => go(page - 1) }),
    pages.map((p, i) => p === '…'
      ? React.createElement('span', { key: 'e' + i, 'aria-hidden': 'true', style: { minWidth: 24, textAlign: 'center', color: 'var(--text-tertiary)' } }, '…')
      : btn(p, { key: p, 'aria-label': 'Page ' + p, 'aria-current': p === page ? 'page' : undefined, onClick: () => go(p) })),
    btn('›', { key: 'next', 'aria-label': 'Next page', disabled: page >= total, onClick: () => go(page + 1) }),
  );
}
