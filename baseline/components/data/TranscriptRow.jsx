import React from 'react';

const SPEAKERS = {
  neutral: 'var(--text-primary)',
  accent:  'var(--accent-default)',
  success: 'var(--success)',
  warning: 'var(--warning)',
  danger:  'var(--danger)',
  info:    'var(--info)',
};

/**
 * TranscriptRow — one line of a live feed: a mono timestamp, a colored
 * speaker, the body. Use for agent transcripts, job logs, and audit trails
 * where each line answers "who did what, when". `live` appends a pulsing
 * block cursor to mark the line still being written. Stack rows inside a
 * container with role="log" (plus aria-live="polite" if lines stream in).
 */
export function TranscriptRow({ time, speaker, tone = 'neutral', live = false, children, style = {}, ...rest }) {
  return React.createElement('div', {
    style: {
      display: 'flex', alignItems: 'baseline', gap: 'var(--space-3)', padding: '3px 0',
      fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', lineHeight: 'var(--leading-normal)', ...style,
    }, ...rest,
  },
    time != null && React.createElement('span', {
      style: { flex: '0 0 auto', color: 'var(--text-tertiary)', fontSize: 'var(--text-2xs)' },
    }, time),
    speaker != null && React.createElement('span', {
      style: { flex: '0 0 auto', fontWeight: 700, color: SPEAKERS[tone] || SPEAKERS.neutral },
    }, speaker),
    React.createElement('span', { style: { minWidth: 0, color: 'var(--text-secondary)' } },
      children,
      live && React.createElement('span', {
        'aria-hidden': 'true',
        style: {
          display: 'inline-block', width: '0.55em', height: '1em', marginLeft: 6,
          verticalAlign: 'text-bottom', background: 'currentColor',
          animation: 'ds-pulse-dot 1.1s var(--ease-primary) infinite',
        },
      }),
    ),
  );
}
