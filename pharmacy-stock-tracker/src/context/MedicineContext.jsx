import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import * as api from '../api/medicineApi';

const MedicineContext = createContext(null);

const POLL_INTERVAL_MS = 15000; // simulate "real-time" refresh from the backend

export function MedicineProvider({ children }) {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastSynced, setLastSynced] = useState(null);

  const loadMedicines = useCallback(async ({ silent = false } = {}) => {
    if (!silent) setLoading(true);
    setError(null);
    try {
      const data = await api.fetchMedicines();
      setMedicines(data);
      setLastSynced(new Date());
    } catch (err) {
      setError(
        err.message.includes('Failed to fetch')
          ? 'Cannot reach the API server. Make sure the backend is running (npm run server).'
          : err.message
      );
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadMedicines();
  }, [loadMedicines]);

  // Real-time-ish polling: silently re-sync with the backend on an interval
  useEffect(() => {
    const id = setInterval(() => loadMedicines({ silent: true }), POLL_INTERVAL_MS);
    return () => clearInterval(id);
  }, [loadMedicines]);

  const addMedicine = useCallback(async (payload) => {
    const created = await api.createMedicine(payload);
    setMedicines((prev) => [...prev, created]);
    return created;
  }, []);

  const editMedicine = useCallback(async (id, payload) => {
    const updated = await api.updateMedicine(id, payload);
    setMedicines((prev) => prev.map((m) => (String(m.id) === String(id) ? updated : m)));
    return updated;
  }, []);

  const adjustStock = useCallback(async (id, newQuantity) => {
    const updated = await api.patchMedicine(id, { quantity: newQuantity });
    setMedicines((prev) => prev.map((m) => (String(m.id) === String(id) ? updated : m)));
    return updated;
  }, []);

  const removeMedicine = useCallback(async (id) => {
    await api.deleteMedicine(id);
    setMedicines((prev) => prev.filter((m) => String(m.id) !== String(id)));
  }, []);

  const value = {
    medicines,
    loading,
    error,
    lastSynced,
    refresh: () => loadMedicines(),
    addMedicine,
    editMedicine,
    adjustStock,
    removeMedicine
  };

  return <MedicineContext.Provider value={value}>{children}</MedicineContext.Provider>;
}

export function useMedicineContext() {
  const ctx = useContext(MedicineContext);
  if (!ctx) throw new Error('useMedicineContext must be used within a MedicineProvider');
  return ctx;
}
