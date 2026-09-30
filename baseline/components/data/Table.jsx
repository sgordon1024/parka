import React from 'react';

/**
 * Table — data table with sortable header states.
 * columns: [{ key, label, sortable, align }]. rows: array of objects.
 */
export function Table({ columns = [], rows = [], style = {} }) {
  const [sort, setSort] = React.useState({ key: null, dir: 'asc' });
  const sorted = React.useMemo(() => {
    if (!sort.key) return rows;
    const c = [...rows].sort((a, b) => (a[sort.key] > b[sort.key] ? 1 : a[sort.key] < b[sort.key] ? -1 : 0));
    return sort.dir === 'asc' ? c : c.reverse();
  }, [rows, sort]);

  const onSort = (key) => setSort((s) => ({ key, dir: s.key === key && s.dir === 'asc' ? 'desc' : 'asc' }));

  return React.createElement('div', { style: { width: '100%', overflowX: 'auto', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', ...style } },
    React.createElement('table', { style: { width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-sm)' } },
      React.createElement('thead', null,
        React.createElement('tr', null,
          columns.map((col) => {
            const active = sort.key === col.key;
            return React.createElement('th', {
              key: col.key, scope: 'col',
              'aria-sort': col.sortable ? (active ? (sort.dir === 'asc' ? 'ascending' : 'descending') : 'none') : undefined,
              style: { textAlign: col.align || 'left', padding: 'var(--space-3) var(--space-4)', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-default)', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xs)', letterSpacing: 'var(--tracking-wide)', textTransform: 'uppercase', color: 'var(--text-secondary)', whiteSpace: 'nowrap' },
            },
              col.sortable
                ? React.createElement('button', {
                    type: 'button', onClick: () => onSort(col.key),
                    style: { display: 'inline-flex', alignItems: 'center', gap: 6, background: 'transparent', border: 'none', padding: 0, cursor: 'pointer', font: 'inherit', color: active ? 'var(--text-primary)' : 'inherit', letterSpacing: 'inherit', textTransform: 'inherit' },
                  }, col.label, React.createElement('span', { 'aria-hidden': 'true', style: { opacity: active ? 1 : 0.35 } }, active ? (sort.dir === 'asc' ? '↑' : '↓') : '↕'))
                : col.label,
            );
          }),
        ),
      ),
      React.createElement('tbody', null,
        sorted.map((row, ri) => React.createElement('tr', { key: ri, style: { transition: 'background var(--duration-fast) var(--ease-primary)' } },
          columns.map((col) => React.createElement('td', {
            key: col.key,
            style: { textAlign: col.align || 'left', padding: 'var(--space-3) var(--space-4)', borderBottom: ri === sorted.length - 1 ? 'none' : '1px solid var(--border-subtle)', color: 'var(--text-primary)' },
          }, row[col.key])),
        )),
      ),
    ),
  );
}
