import { Link } from 'react-router-dom';
import Badge from '../components/Badge';
import Loader from '../components/Loader';
import { useMedicineStats } from '../hooks/useMedicines';

export default function LowStock() {
  const { stats, loading, adjustStock } = useMedicineStats();

  if (loading) return <Loader label="Checking stock levels..." />;

  const list = [...stats.lowStock].sort((a, b) => a.quantity - b.quantity);

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Low Stock Alerts</h1>
          <p className="page-subtitle">Medicines at or below their reorder level</p>
        </div>
      </div>

      {list.length === 0 ? (
        <div className="empty-state">✅ All medicines are sufficiently stocked.</div>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Medicine</th>
              <th>Category</th>
              <th>Current Stock</th>
              <th>Reorder Level</th>
              <th>Status</th>
              <th>Restock</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {list.map((m) => (
              <tr key={m.id}>
                <td>{m.name}</td>
                <td>{m.category}</td>
                <td>
                  {m.quantity} {m.unit}
                </td>
                <td>{m.reorderLevel}</td>
                <td>
                  <Badge tone={m.stockStatus === 'out' ? 'out' : 'low'}>
                    {m.stockStatus === 'out' ? 'Out of stock' : 'Low stock'}
                  </Badge>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => adjustStock(m.id, m.quantity + 25)}
                    >
                      +25
                    </button>
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => adjustStock(m.id, m.quantity + 50)}
                    >
                      +50
                    </button>
                  </div>
                </td>
                <td>
                  <Link to={`/medicines/${m.id}/edit`} className="btn btn-outline btn-sm">
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
