import React from 'react';

const SIZES = { xs: 24, sm: 32, md: 40, lg: 56 };

function initials(name) {
  if (!name) return '';
  return name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join('').toUpperCase();
}

/**
 * Avatar — image with initials fallback and optional status ring.
 */
export function Avatar({ src, name = '', size = 'md', status, style = {}, ...rest }) {
  const [failed, setFailed] = React.useState(false);
  const dim = SIZES[size] || SIZES.md;
  const statusColor = status === 'online' ? 'var(--success)' : status === 'busy' ? 'var(--danger)' : status === 'away' ? 'var(--warning)' : null;

  return React.createElement('span', { style: { position: 'relative', display: 'inline-flex', flexShrink: 0, ...style }, ...rest },
    React.createElement('span', {
      title: name,
      style: {
        width: dim, height: dim, borderRadius: '50%', overflow: 'hidden', display: 'grid', placeItems: 'center',
        background: 'var(--bg-inverse)', color: 'var(--text-inverse)', fontFamily: 'var(--font-display)',
        fontWeight: 600, fontSize: dim * 0.38, letterSpacing: '-0.02em', border: '1px solid var(--border-subtle)',
      },
    },
      src && !failed
        ? React.createElement('img', { src, alt: name, onError: () => setFailed(true), style: { width: '100%', height: '100%', objectFit: 'cover' } })
        : initials(name),
    ),
    statusColor && React.createElement('span', {
      'aria-label': status, title: status,
      style: { position: 'absolute', right: -1, bottom: -1, width: Math.max(8, dim * 0.28), height: Math.max(8, dim * 0.28), borderRadius: '50%', background: statusColor, border: '2px solid var(--surface-raised)' },
    }),
  );
}

/**
 * AvatarGroup — overlapping stack with a `+N` overflow chip.
 */
export function AvatarGroup({ avatars = [], max = 4, size = 'md', style = {} }) {
  const dim = SIZES[size] || SIZES.md;
  const shown = avatars.slice(0, max);
  const extra = avatars.length - shown.length;
  return React.createElement('div', { style: { display: 'inline-flex', alignItems: 'center', ...style } },
    shown.map((a, i) => React.createElement('span', { key: i, style: { position: 'relative', display: 'inline-flex', marginLeft: i === 0 ? 0 : -dim * 0.32, borderRadius: '50%', border: '3px solid var(--bg-secondary)' } },
      React.createElement(Avatar, { ...a, size }),
    )),
    extra > 0 && React.createElement('span', {
      style: { marginLeft: -dim * 0.32, width: dim, height: dim, borderRadius: '50%', display: 'grid', placeItems: 'center', background: 'var(--bg-tertiary)', color: 'var(--text-secondary)', fontSize: dim * 0.32, fontWeight: 600, border: '3px solid var(--bg-secondary)', boxSizing: 'content-box' },
    }, '+' + extra),
  );
}
