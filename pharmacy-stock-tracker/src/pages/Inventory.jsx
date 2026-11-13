import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MedicineCard from '../components/MedicineCard';
import SearchBar from '../components/SearchBar';
import Modal from '../components/Modal';
import Loader from '../components/Loader';
import { useMedicineStats } from '../hooks/useMedicines';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { CATEGORIES } from '../utils/constants';

export default function Inventory() {
  const { medicines, loading, error, removeMedicine, adjustStock } = useMedicineStats();
  const [search, setSearch] = useLocalStorage('pharmacy_search', '');
  const [category, setCategory] = useState('All');
  const [pendingDelete, setPendingDelete] = useState(null); // { id, name }
  const navigate = useNavigate();

  const filtered = useMemo(() => {
    return medicines.filter((m) => {
      const matchesSearch =
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        m.batchNo.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === 'All' || m.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [medicines, search, category]);

  const handleDeleteConfirmed = async () => {
    if (!pendingDelete) return;
    await removeMedicine(pendingDelete.id);
    setPendingDelete(null);
  };

  if (loading) return <Loader label="Loading inventory..." />;

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Medicine Inventory</h1>
          <p className="page-subtitle">{filtered.length} of {medicines.length} medicines shown</p>
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

      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <SearchBar value={search} onChange={setSearch} placeholder="Search by name or batch no." />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{
            padding: '10px 12px',
            borderRadius: 10,
            border: '1px solid var(--color-border)',
            fontSize: '0.86rem',
            background: 'var(--color-surface)'
          }}
        >
          <option value="All">All Categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">No medicines match your filters.</div>
      ) : (
        <div className="grid-cards">
          {filtered.map((m) => (
            <MedicineCard
              key={m.id}
              medicine={m}
              onDelete={(id, name) => setPendingDelete({ id, name })}
              onQuickAdjust={adjustStock}
            />
          ))}
        </div>
      )}

      {pendingDelete && (
        <Modal
          title="Delete Medicine"
          danger
          confirmLabel="Delete"
          onClose={() => setPendingDelete(null)}
          onConfirm={handleDeleteConfirmed}
        >
          Are you sure you want to delete <strong>{pendingDelete.name}</strong>? This action cannot be
          undone.
        </Modal>
      )}
    </div>
  );
}
