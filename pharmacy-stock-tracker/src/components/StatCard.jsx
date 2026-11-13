import './StatCard.css';

// Reusable presentational component driven entirely by props.
export default function StatCard({ icon, label, value, tone = 'primary', onClick }) {
  return (
    <div
      className={`stat-card stat-card--${tone} ${onClick ? 'stat-card--clickable' : ''}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div className="stat-card__icon">{icon}</div>
      <div>
        <div className="stat-card__value">{value}</div>
        <div className="stat-card__label">{label}</div>
      </div>
    </div>
  );
}
