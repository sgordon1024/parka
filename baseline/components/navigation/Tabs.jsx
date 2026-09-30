import React from 'react';

/**
 * Tabs — accessible tab list with an animated active underline.
 * tabs: [{ id, label, content }]. Arrow keys move focus/selection.
 */
export function Tabs({ tabs = [], defaultId, onChange, style = {} }) {
  const [active, setActive] = React.useState(defaultId || (tabs[0] && tabs[0].id));
  const refs = React.useRef({});
  const select = (id) => { setActive(id); onChange && onChange(id); };
  const onKey = (e, i) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const ni = e.key === 'ArrowRight' ? (i + 1) % tabs.length : (i - 1 + tabs.length) % tabs.length;
    const nid = tabs[ni].id; select(nid); refs.current[nid] && refs.current[nid].focus();
  };
  const activeTab = tabs.find((t) => t.id === active);

  return React.createElement('div', { style: { ...style } },
    React.createElement('div', {
      role: 'tablist',
      style: { display: 'flex', gap: 'var(--space-6)', borderBottom: '1px solid var(--border-subtle)' },
    },
      tabs.map((t, i) => {
        const on = t.id === active;
        return React.createElement('button', {
          key: t.id, ref: (el) => (refs.current[t.id] = el), role: 'tab', id: 'tab-' + t.id,
          'aria-selected': on, 'aria-controls': 'panel-' + t.id, tabIndex: on ? 0 : -1,
          onClick: () => select(t.id), onKeyDown: (e) => onKey(e, i),
          style: {
            position: 'relative', padding: 'var(--space-4) 0', border: 'none', background: 'transparent',
            color: on ? 'var(--text-primary)' : 'var(--text-tertiary)', fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-sm)', fontWeight: 600, letterSpacing: 'var(--tracking-snug)', cursor: 'pointer',
            transition: 'color var(--duration-fast) var(--ease-primary)',
          },
        },
          t.label,
          React.createElement('span', {
            'aria-hidden': 'true',
            style: { position: 'absolute', left: 0, right: 0, bottom: -1, height: 2, background: 'var(--accent-default)', borderRadius: 2, transform: on ? 'scaleX(1)' : 'scaleX(0)', transition: 'transform var(--duration-base) var(--ease-primary)' },
          }),
        );
      }),
    ),
    activeTab && React.createElement('div', {
      role: 'tabpanel', id: 'panel-' + active, 'aria-labelledby': 'tab-' + active, tabIndex: 0,
      style: { paddingTop: 'var(--space-6)' },
    }, activeTab.content),
  );
}
