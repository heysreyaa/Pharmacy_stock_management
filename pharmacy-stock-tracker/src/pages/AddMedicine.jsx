import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MedicineForm from '../components/MedicineForm';
import { useMedicineContext } from '../context/MedicineContext';

export default function AddMedicine() {
  const { addMedicine } = useMedicineContext();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (payload) => {
    setBusy(true);
    setError(null);
    try {
      await addMedicine(payload);
      navigate('/inventory');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Add New Medicine</h1>
          <p className="page-subtitle">Register a new medicine batch into inventory</p>
        </div>
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

      <MedicineForm onSubmit={handleSubmit} submitLabel="Add Medicine" busy={busy} />
    </div>
  );
}
