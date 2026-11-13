import { Link } from 'react-router-dom';
import Badge from './Badge';
import { formatDate } from '../utils/dateUtils';
import './MedicineCard.css';

// Reusable card component. Receives a fully-enriched medicine object as a prop
// (see useMedicineStats) plus callback props for parent-controlled actions.
export default function MedicineCard({ medicine, onDelete, onQuickAdjust }) {
  const { id, name, category, batchNo, quantity, unit, expiryDate, expiry, stockStatus, supplier } =
    medicine;

  const stockTone = stockStatus === 'out' ? 'out' : stockStatus === 'low' ? 'low' : 'ok';

  return (
    <div className="med-card">
      <div className="med-card__top">
        <div>
          <h3 className="med-card__name">{name}</h3>
          <span className="med-card__category">{category}</span>
        </div>
        <Badge tone={expiry.level === 'ok' ? 'accent' : expiry.level}>{expiry.label}</Badge>
      </div>

      <dl className="med-card__meta">
        <div>
          <dt>Batch</dt>
          <dd>{batchNo}</dd>
        </div>
        <div>
          <dt>Expiry</dt>
          <dd>{formatDate(expiryDate)}</dd>
        </div>
        <div>
          <dt>Supplier</dt>
          <dd>{supplier}</dd>
        </div>
      </dl>

      <div className="med-card__stock">
        <div className="med-card__stock-info">
          <strong>
            {quantity} {unit}
          </strong>
          <Badge tone={stockTone}>
            {stockStatus === 'out' ? 'Out of stock' : stockStatus === 'low' ? 'Low stock' : 'In stock'}
          </Badge>
        </div>
        <div className="med-card__quick-actions">
          <button
            className="btn btn-outline btn-sm"
            onClick={() => onQuickAdjust(id, Math.max(0, quantity - 1))}
            aria-label={`Decrease stock of ${name}`}
          >
            −
          </button>
          <button
            className="btn btn-outline btn-sm"
            onClick={() => onQuickAdjust(id, quantity + 1)}
            aria-label={`Increase stock of ${name}`}
          >
            +
          </button>
        </div>
      </div>

      <div className="med-card__actions">
        <Link to={`/medicines/${id}/edit`} className="btn btn-outline btn-sm">
          Edit
        </Link>
        <button className="btn btn-danger btn-sm" onClick={() => onDelete(id, name)}>
          Delete
        </button>
      </div>
    </div>
  );
}
