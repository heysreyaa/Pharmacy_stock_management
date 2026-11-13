import { useMemo } from 'react';
import { useMedicineContext } from '../context/MedicineContext';
import { getExpiryStatus, getStockStatus } from '../utils/dateUtils';

// Custom hook: derives dashboard-ready statistics and categorized lists
// from the raw medicine data held in context. Keeps components thin.
export function useMedicineStats() {
  const { medicines, ...rest } = useMedicineContext();

  const enriched = useMemo(
    () =>
      medicines.map((m) => ({
        ...m,
        expiry: getExpiryStatus(m.expiryDate),
        stockStatus: getStockStatus(m.quantity, m.reorderLevel)
      })),
    [medicines]
  );

  const stats = useMemo(() => {
    const totalItems = enriched.length;
    const totalUnits = enriched.reduce((sum, m) => sum + Number(m.quantity || 0), 0);
    const lowStock = enriched.filter((m) => m.stockStatus === 'low' || m.stockStatus === 'out');
    const expiringSoon = enriched.filter(
      (m) => m.expiry.level === 'critical' || m.expiry.level === 'warning'
    );
    const expired = enriched.filter((m) => m.expiry.level === 'expired');
    const inventoryValue = enriched.reduce(
      (sum, m) => sum + Number(m.quantity || 0) * Number(m.price || 0),
      0
    );

    return { totalItems, totalUnits, lowStock, expiringSoon, expired, inventoryValue };
  }, [enriched]);

  return { medicines: enriched, stats, ...rest };
}
