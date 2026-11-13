import { useNavigate } from 'react-router-dom';
import StatCard from '../components/StatCard';
import Badge from '../components/Badge';
import Loader from '../components/Loader';
import { useMedicineStats } from '../hooks/useMedicines';
import { formatDate } from '../utils/dateUtils';

export default function Dashboard() {
  const { medicines, stats, loading, error } = useMedicineStats();
  const navigate = useNavigate();

  if (loading) return <Loader label="Loading dashboard..." />;

  const soonList = [...stats.expiringSoon, ...stats.expired]
    .sort((a, b) => a.expiry.days - b.expiry.days)
    .slice(0, 6);

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Live overview of your pharmacy inventory</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/inventory/add')}>
          + Add Medicine
        </button>
      </div>

      {error && (
        <div
          style={{
            background: 'var(--color-danger-light)',
            color: 'var(--color-danger)',
            padding: '12px 16px',
            borderRadius: 10,
            marginBottom: 20,
            fontSize: '0.88rem'
          }}
        >
          {error}
        </div>
      )}

      <div className="grid-stats">
        <StatCard icon="💊" label="Total Medicines" value={stats.totalItems} tone="primary" />
        <StatCard icon="📦" label="Total Units in Stock" value={stats.totalUnits} tone="primary" />
        <StatCard
          icon="📉"
          label="Low / Out of Stock"
          value={stats.lowStock.length}
          tone="warning"
          onClick={() => navigate('/low-stock')}
        />
        <StatCard
          icon="⏳"
          label="Expiring Soon"
          value={stats.expiringSoon.length}
          tone="warning"
          onClick={() => navigate('/expiry-tracker')}
        />
        <StatCard
          icon="⚠️"
          label="Expired"
          value={stats.expired.length}
          tone="danger"
          onClick={() => navigate('/expiry-tracker')}
        />
        <StatCard
          icon="💰"
          label="Inventory Value"
          value={`$${stats.inventoryValue.toFixed(2)}`}
          tone="success"
        />
      </div>

      <h2 style={{ fontSize: '1.1rem', marginBottom: 12 }}>Upcoming &amp; Expired Batches</h2>
      {soonList.length === 0 ? (
        <div className="empty-state">🎉 Nothing expiring soon. All batches look healthy.</div>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Medicine</th>
              <th>Batch No.</th>
              <th>Expiry Date</th>
              <th>Status</th>
              <th>Quantity</th>
            </tr>
          </thead>
          <tbody>
            {soonList.map((m) => (
              <tr key={m.id}>
                <td>{m.name}</td>
                <td>{m.batchNo}</td>
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

      {medicines.length === 0 && !loading && (
        <div className="empty-state" style={{ marginTop: 20 }}>
          No medicines yet. Click "Add Medicine" to build your inventory.
        </div>
      )}
    </div>
  );
}
