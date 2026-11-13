// Utility functions for expiry date calculations, used across components.

export function daysUntil(dateStr) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr);
  target.setHours(0, 0, 0, 0);
  const diffMs = target - today;
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

export function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

// Classifies a medicine's expiry status for badges & filtering.
// Thresholds: expired (<0 days), critical (<=30 days), warning (<=90 days), ok otherwise.
export function getExpiryStatus(dateStr) {
  const diff = daysUntil(dateStr);
  if (diff < 0) return { level: 'expired', label: 'Expired', days: diff };
  if (diff <= 30) return { level: 'critical', label: `${diff}d left`, days: diff };
  if (diff <= 90) return { level: 'warning', label: `${diff}d left`, days: diff };
  return { level: 'ok', label: `${diff}d left`, days: diff };
}

export function getStockStatus(quantity, reorderLevel) {
  if (quantity <= 0) return 'out';
  if (quantity <= reorderLevel) return 'low';
  return 'ok';
}
