import styles from './Navbar.module.css';
import { useMedicineContext } from '../context/MedicineContext';

const PAGE_TITLES = {
  '/': 'Dashboard',
  '/inventory': 'Medicine Inventory',
  '/inventory/add': 'Add New Medicine',
  '/expiry-tracker': 'Expiry Tracker',
  '/low-stock': 'Low Stock Alerts'
};

export default function Navbar({ pathname }) {
  const { loading, error, lastSynced, refresh } = useMedicineContext();

  const title =
    PAGE_TITLES[pathname] ||
    (pathname.includes('/edit') ? 'Edit Medicine' : 'Pharmacy Stock Tracker');

  const statusColor = error ? 'var(--color-danger)' : loading ? 'var(--color-warning)' : 'var(--color-success)';
  const statusText = error ? 'Offline' : loading ? 'Syncing…' : 'Live';

  return (
    <header className={styles.navbar}>
      <div className={styles.title}>{title}</div>
      <div className={styles.right}>
        <button
          className="btn btn-outline btn-sm"
          onClick={refresh}
          title={lastSynced ? `Last synced ${lastSynced.toLocaleTimeString()}` : ''}
        >
          <span className={styles.statusDot} style={{ background: statusColor }} />
          {statusText}
        </button>
        <div className={styles.avatar} title="Pharmacist on duty">
          RX
        </div>
      </div>
    </header>
  );
}
