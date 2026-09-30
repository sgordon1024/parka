import React from 'react';

/**
 * Carousel — a swipeable/scrollable row of peer items with position dots.
 * Content the user browses, never content they must not miss.
 */
export function Carousel({ children, style = {} }) {
  const ref = React.useRef(null);
  const [page, setPage] = React.useState(0);
  const kids = React.Children.toArray(children);
  const go = (i) => { const el = ref.current; if (!el) return;
    const n = Math.max(0, Math.min(kids.length - 1, i));
    el.scrollTo({ left: n * el.clientWidth, behavior: 'smooth' }); setPage(n); };
  return React.createElement('div', { style: { width: 340, ...style } },
    React.createElement('div', { ref, onScroll: e => setPage(Math.round(e.target.scrollLeft / e.target.clientWidth)),
      style: { display: 'flex', overflowX: 'auto', scrollSnapType: 'x mandatory', borderRadius: 'var(--radius-lg)',
        scrollbarWidth: 'none' } },
      kids.map((k, i) => React.createElement('div', { key: i, style: { flex: '0 0 100%',
        scrollSnapAlign: 'start' } }, k))),
    React.createElement('div', { style: { display: 'flex', justifyContent: 'center', gap: 6, marginTop: 10 } },
      kids.map((_, i) => React.createElement('button', { key: i, type: 'button',
        'aria-label': 'Go to item ' + (i + 1), onClick: () => go(i),
        style: { width: 7, height: 7, borderRadius: '50%', border: 0, padding: 0, cursor: 'pointer',
          background: i === page ? 'var(--accent-default)' : 'var(--border-default)' } }))));
}
