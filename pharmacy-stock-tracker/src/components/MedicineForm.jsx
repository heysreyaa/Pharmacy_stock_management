import { useState } from 'react';
import { CATEGORIES, UNITS } from '../utils/constants';
import './MedicineForm.css';

const EMPTY_FORM = {
  name: '',
  category: CATEGORIES[0],
  batchNo: '',
  quantity: '',
  reorderLevel: '',
  unit: UNITS[0],
  price: '',
  supplier: '',
  manufactureDate: '',
  expiryDate: ''
};

// Reusable, controlled form component used by both AddMedicine and EditMedicine pages.
// Receives `initialValues` and an `onSubmit` callback as props — a classic
// example of lifting state control to the parent while the form owns its local edits.
export default function MedicineForm({ initialValues, onSubmit, submitLabel = 'Save Medicine', busy }) {
  const [form, setForm] = useState({ ...EMPTY_FORM, ...initialValues });
  const [errors, setErrors] = useState({});

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = 'Name is required';
    if (!form.batchNo.trim()) next.batchNo = 'Batch number is required';
    if (form.quantity === '' || Number(form.quantity) < 0) next.quantity = 'Enter a valid quantity';
    if (form.reorderLevel === '' || Number(form.reorderLevel) < 0)
      next.reorderLevel = 'Enter a valid reorder level';
    if (form.price === '' || Number(form.price) < 0) next.price = 'Enter a valid price';
    if (!form.expiryDate) next.expiryDate = 'Expiry date is required';
    if (!form.supplier.trim()) next.supplier = 'Supplier is required';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      ...form,
      quantity: Number(form.quantity),
      reorderLevel: Number(form.reorderLevel),
      price: Number(form.price)
    });
  };

  return (
    <form className="med-form" onSubmit={handleSubmit} noValidate>
      <div className="med-form__grid">
        <Field label="Medicine Name" error={errors.name}>
          <input value={form.name} onChange={handleChange('name')} placeholder="e.g. Paracetamol 500mg" />
        </Field>

        <Field label="Category">
          <select value={form.category} onChange={handleChange('category')}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Batch Number" error={errors.batchNo}>
          <input value={form.batchNo} onChange={handleChange('batchNo')} placeholder="e.g. PCM-2024-101" />
        </Field>

        <Field label="Supplier" error={errors.supplier}>
          <input value={form.supplier} onChange={handleChange('supplier')} placeholder="Supplier name" />
        </Field>

        <Field label="Quantity" error={errors.quantity}>
          <input type="number" min="0" value={form.quantity} onChange={handleChange('quantity')} />
        </Field>

        <Field label="Unit">
          <select value={form.unit} onChange={handleChange('unit')}>
            {UNITS.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Reorder Level" error={errors.reorderLevel}>
          <input
            type="number"
            min="0"
            value={form.reorderLevel}
            onChange={handleChange('reorderLevel')}
          />
        </Field>

        <Field label="Unit Price ($)" error={errors.price}>
          <input type="number" min="0" step="0.01" value={form.price} onChange={handleChange('price')} />
        </Field>

        <Field label="Manufacture Date">
          <input type="date" value={form.manufactureDate} onChange={handleChange('manufactureDate')} />
        </Field>

        <Field label="Expiry Date" error={errors.expiryDate}>
          <input type="date" value={form.expiryDate} onChange={handleChange('expiryDate')} />
        </Field>
      </div>

      <div className="med-form__actions">
        <button type="submit" className="btn btn-primary" disabled={busy}>
          {busy ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  );
}

function Field({ label, error, children }) {
  return (
    <label className="med-form__field">
      <span className="med-form__label">{label}</span>
      {children}
      {error && <span className="med-form__error">{error}</span>}
    </label>
  );
}
