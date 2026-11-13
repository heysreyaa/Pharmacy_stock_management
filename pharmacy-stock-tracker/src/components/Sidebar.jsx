import { NavLink } from 'react-router-dom';
import styles from './Sidebar.module.css';
import { useMedicineStats } from '../hooks/useMedicines';

const links = [
  { to: '/', label: 'Dashboard', icon: '📊', end: true },
  { to: '/inventory', label: 'Inventory', icon: '💊' },
  { to: '/inventory/add', label: 'Add Medicine', icon: '➕' },
  { to: '/expiry-tracker', label: 'Expiry Tracker', icon: '⏳', key: 'expiringSoon' },
  { to: '/low-stock', label: 'Low Stock', icon: '📉', key: 'lowStock' }
];

export default function Sidebar() {
  const { stats } = useMedicineStats();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <span className={styles.brandIcon}>💊</span>
        <div>
          <div className={styles.brandText}>PharmaTrack</div>
          <div className={styles.brandSub}>Stock &amp; Expiry Tracker</div>
        </div>
      </div>
      <nav className={styles.nav}>
        {links.map((link) => {
          const count = link.key ? stats[link.key]?.length : null;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
              }
            >
              <span>{link.icon}</span>
              <span>{link.label}</span>
              {!!count && <span className={styles.badge}>{count}</span>}
            </NavLink>
          );
        })}
      </nav>
      <div className={styles.footer}>© {new Date().getFullYear()} PharmaTrack</div>
    </aside>
  );
}
