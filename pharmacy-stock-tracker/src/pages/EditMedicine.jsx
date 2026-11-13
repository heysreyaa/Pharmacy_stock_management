import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import MedicineForm from '../components/MedicineForm';
import Loader from '../components/Loader';
import { useMedicineContext } from '../context/MedicineContext';

export default function EditMedicine() {
  const { id } = useParams();
  const { medicines, editMedicine, loading } = useMedicineContext();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const medicine = medicines.find((m) => String(m.id) === String(id));

  useEffect(() => {
    if (!loading && !medicine) {
      // Medicine not found (e.g. bad URL / already deleted) - handled in render below
    }
  }, [loading, medicine]);

  const handleSubmit = async (payload) => {
    setBusy(true);
    setError(null);
    try {
      await editMedicine(id, payload);
      navigate('/inventory');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <Loader label="Loading medicine..." />;

  if (!medicine) {
    return (
      <div className="page-container">
        <div className="empty-state">
          Medicine not found.
          <div style={{ marginTop: 12 }}>
            <Link to="/inventory" className="btn btn-outline btn-sm">
              Back to Inventory
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Edit Medicine</h1>
          <p className="page-subtitle">Updating: {medicine.name}</p>
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

      <MedicineForm
        initialValues={medicine}
        onSubmit={handleSubmit}
        submitLabel="Save Changes"
        busy={busy}
      />
    </div>
  );
}
