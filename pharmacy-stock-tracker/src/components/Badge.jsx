// Reusable Badge component.
// Styling technique: inline style object computed from props (technique 3).
const THEMES = {
  ok: { bg: 'var(--color-success-light)', fg: 'var(--color-success)' },
  warning: { bg: 'var(--color-warning-light)', fg: 'var(--color-warning)' },
  critical: { bg: '#ffe4e6', fg: '#be123c' },
  expired: { bg: 'var(--color-danger-light)', fg: 'var(--color-danger)' },
  low: { bg: 'var(--color-warning-light)', fg: 'var(--color-warning)' },
  out: { bg: 'var(--color-danger-light)', fg: 'var(--color-danger)' },
  neutral: { bg: '#e2e8f0', fg: '#475569' },
  accent: { bg: '#dbeafe', fg: '#1d4ed8' }
};

export default function Badge({ tone = 'neutral', children }) {
  const theme = THEMES[tone] || THEMES.neutral;
  const style = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    padding: '3px 10px',
    borderRadius: 999,
    fontSize: '0.72rem',
    fontWeight: 700,
    background: theme.bg,
    color: theme.fg,
    whiteSpace: 'nowrap'
  };
  return <span style={style}>{children}</span>;
}
