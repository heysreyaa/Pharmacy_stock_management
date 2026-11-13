import { useState } from 'react';
import Badge from '../components/Badge';
import Loader from '../components/Loader';
import { useMedicineStats } from '../hooks/useMedicines';
import { formatDate } from '../utils/dateUtils';

const TABS = [
  { key: 'expired', label: 'Expired' },
  { key: 'critical', label: 'Critical (≤30 days)' },
  { key: 'warning', label: 'Warning (≤90 days)' },
  { key: 'ok', label: 'Healthy' }
];

export default function ExpiryTracker() {
  const { medicines, loading } = useMedicineStats();
  const [tab, setTab] = useState('critical');

  if (loading) return <Loader label="Checking expiry dates..." />;

  const grouped = medicines
    .filter((m) => m.expiry.level === tab)
    .sort((a, b) => a.expiry.days - b.expiry.days);

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Expiry Tracker</h1>
          <p className="page-subtitle">Monitor medicines by expiry proximity</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {TABS.map((t) => {
          const count = medicines.filter((m) => m.expiry.level === t.key).length;
          const active = tab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className="btn btn-sm"
              style={{
                background: active ? 'var(--color-primary)' : 'var(--color-surface)',
                color: active ? 'white' : 'var(--color-text)',
                border: '1px solid var(--color-border)'
              }}
            >
              {t.label} ({count})
            </button>
          );
        })}
      </div>

      {grouped.length === 0 ? (
        <div className="empty-state">No medicines in this category.</div>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Medicine</th>
              <th>Batch No.</th>
              <th>Category</th>
              <th>Expiry Date</th>
              <th>Status</th>
              <th>Quantity</th>
            </tr>
          </thead>
          <tbody>
            {grouped.map((m) => (
              <tr key={m.id}>
                <td>{m.name}</td>
                <td>{m.batchNo}</td>
                <td>{m.category}</td>
                <td>{formatDate(m.expiryDate)}</td>
                <td>
                  <Badge tone={m.expiry.level}>{m.expiry.label}</Badge>
                </td>
                <td>
                  {m.quantity} {m.unit}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
