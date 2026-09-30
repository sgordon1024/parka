import React from 'react';

/**
 * Gantt — a timeline of stages: one bar per row, diamond milestones, an
 * optional today marker, and progressive-disclosure detail per row (click a
 * row to expand it). Positions are fractions (0..1) of the whole timeline,
 * so the caller owns the date math and the component stays unit-agnostic.
 */
const STATUS = {
  done:    { bar: 'color-mix(in oklab, var(--text-primary) 26%, transparent)', border: 'none' },
  active:  { bar: 'var(--accent-default)', border: 'none' },
  planned: { bar: 'var(--surface-sunken)', border: '1px dashed var(--border-default)' },
};

function Row({ row, labelWidth, open, onToggle }) {
  const [hover, setHover] = React.useState(false);
  const s = STATUS[row.status] || STATUS.planned;
  const expandable = row.detail != null;
  return React.createElement('div', { style: { borderBottom: '1px solid var(--border-subtle)' } },
    React.createElement('button', {
      type: 'button', disabled: !expandable,
      'aria-expanded': expandable ? open : undefined,
      onClick: expandable ? onToggle : undefined,
      onMouseEnter: () => setHover(true), onMouseLeave: () => setHover(false),
      style: {
        display: 'grid', gridTemplateColumns: labelWidth + 'px 1fr', width: '100%', alignItems: 'center',
        background: hover && expandable ? 'color-mix(in oklab, var(--text-primary) 3%, transparent)' : 'transparent',
        border: 0, padding: 0, cursor: expandable ? 'pointer' : 'default', font: 'inherit',
        color: 'inherit', textAlign: 'left',
      },
    },
      React.createElement('span', { style: { display: 'flex', alignItems: 'center', gap: 10, padding: '0 var(--space-6)', minHeight: 58 } },
        expandable && React.createElement('span', {
          'aria-hidden': 'true',
          style: { color: 'var(--text-tertiary)', transition: 'transform var(--duration-fast) var(--ease-primary)',
            transform: open ? 'rotate(90deg)' : 'none', display: 'inline-flex' },
        }, '›'),
        React.createElement('span', { style: { fontWeight: 600, fontSize: 'var(--text-sm)' } }, row.label),
        row.tag,
      ),
      React.createElement('span', { style: { position: 'relative', height: 58 } },
        React.createElement('span', {
          style: { position: 'absolute', top: 20, height: 18, borderRadius: 'var(--radius-full)',
            left: (row.start * 100) + '%', width: ((row.end - row.start) * 100) + '%',
            background: s.bar, border: s.border },
        }),
        (row.milestones || []).map((m, i) => React.createElement('span', {
          key: i, title: m.label,
          style: { position: 'absolute', top: 24, width: 10, height: 10,
            left: (m.at * 100) + '%', transform: 'translateX(-50%) rotate(45deg)',
            background: m.done ? 'var(--accent-default)' : 'var(--surface-raised)',
            border: '1.5px solid var(--accent-default)', borderRadius: 2 },
        })),
      ),
    ),
    expandable && open && React.createElement('div', {
      style: { position: 'relative', zIndex: 3, background: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border-subtle)',
        padding: 'var(--space-4) var(--space-8) var(--space-8) calc(var(--space-6) + 24px)' },
    }, row.detail),
  );
}

export function Gantt({ columns = [], rows = [], today = null, todayLabel = 'Today', labelWidth = 236, columnHeader = 'Stage', style = {} }) {
  const [openId, setOpenId] = React.useState(null);
  return React.createElement('div', {
    style: { border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)',
      background: 'var(--surface-raised)', overflow: 'hidden', ...style },
  },
    React.createElement('div', {
      style: { display: 'grid', gridTemplateColumns: labelWidth + 'px 1fr',
        borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-secondary)' },
    },
      React.createElement('span', { style: { padding: '13px var(--space-6)', color: 'var(--text-tertiary)',
        fontSize: 'var(--text-2xs)', textTransform: 'uppercase', letterSpacing: '.08em' } }, columnHeader),
      React.createElement('span', { style: { display: 'grid', gridTemplateColumns: `repeat(${columns.length},1fr)` } },
        columns.map((c, i) => React.createElement('span', {
          key: i, style: { padding: '13px 0 13px 14px', color: 'var(--text-tertiary)', fontSize: 'var(--text-2xs)',
            fontFamily: 'var(--font-mono)', borderLeft: '1px solid var(--border-subtle)' },
        }, c)),
      ),
    ),
    React.createElement('div', { style: { position: 'relative' } },
      today != null && React.createElement('span', { 'aria-hidden': 'true', style: {
        position: 'absolute', top: 0, bottom: 0, width: 2, background: 'var(--accent-default)', opacity: .55,
        left: `calc(${labelWidth}px + (100% - ${labelWidth}px) * ${today})`, pointerEvents: 'none', zIndex: 2 } }),
      today != null && React.createElement('span', { style: {
        position: 'absolute', top: -1, transform: 'translateX(-50%)', zIndex: 3, pointerEvents: 'none',
        left: `calc(${labelWidth}px + (100% - ${labelWidth}px) * ${today})`,
        background: 'var(--accent-default)', color: 'var(--action-primary-text, #fff)', fontSize: 11,
        fontFamily: 'var(--font-mono)', padding: '1px 6px', borderRadius: '0 0 4px 4px' } }, todayLabel),
      rows.map((r) => React.createElement(Row, {
        key: r.id || r.label, row: r, labelWidth,
        open: openId === (r.id || r.label),
        onToggle: () => setOpenId(openId === (r.id || r.label) ? null : (r.id || r.label)),
      })),
    ),
  );
}
