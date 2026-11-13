
import React, { useEffect, useMemo, useState } from "react";

const starterMedicines = [
  { id: 1, name: "Paracetamol 500mg", category: "Pain Relief", batch: "PCM-24081", quantity: 120, minStock: 30, price: 2.5, expiry: "2027-08-18", supplier: "HealthPlus Pharma" },
  { id: 2, name: "Amoxicillin 250mg", category: "Antibiotic", batch: "AMX-24032", quantity: 18, minStock: 25, price: 8.75, expiry: "2026-12-12", supplier: "Medline Distributors" },
  { id: 3, name: "Cetirizine 10mg", category: "Allergy", batch: "CTZ-24117", quantity: 64, minStock: 20, price: 1.8, expiry: "2026-11-28", supplier: "Carewell Labs" },
  { id: 4, name: "Vitamin C 500mg", category: "Supplement", batch: "VTC-23091", quantity: 9, minStock: 20, price: 4.2, expiry: "2026-10-30", supplier: "NutriMed" },
  { id: 5, name: "Omeprazole 20mg", category: "Gastric Care", batch: "OMP-24061", quantity: 82, minStock: 25, price: 5.5, expiry: "2027-04-05", supplier: "HealthPlus Pharma" },
  { id: 6, name: "Cough Syrup 100ml", category: "Cold & Cough", batch: "CS-23111", quantity: 14, minStock: 15, price: 68, expiry: "2026-11-20", supplier: "Carewell Labs" },
  { id: 7, name: "Ibuprofen 400mg", category: "Pain Relief", batch: "IBU-22009", quantity: 0, minStock: 20, price: 3.25, expiry: "2026-09-15", supplier: "Medline Distributors" },
];

const money = (n) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(n || 0);

const today = new Date();

const dayDiff = (date) =>
  Math.ceil(
    (new Date(`${date}T23:59:59`) -
      new Date(`${today.toISOString().slice(0, 10)}T00:00:00`)) /
      86400000
  );

const dateLabel = (date) =>
  new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const navItems = [
  ["Dashboard", "▦"],
  ["Inventory", "▤"],
  ["Add Medicine", "＋"],
  ["Expiry Tracker", "⌛"],
  ["Low Stock", "↘"],
];

function App() {
  const [medicines, setMedicines] = useState(() => {
    try {
      return (
        JSON.parse(localStorage.getItem("pharmatrack-medicines")) ||
        starterMedicines
      );
    } catch {
      return starterMedicines;
    }
  });

  const [page, setPage] = useState("Dashboard");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [editing, setEditing] = useState(null);
  const [notice, setNotice] = useState("");
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => {
    localStorage.setItem(
      "pharmatrack-medicines",
      JSON.stringify(medicines)
    );
  }, [medicines]);

  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(""), 3200);
    return () => clearTimeout(timer);
  }, [notice]);

  const expiring = medicines.filter(
    (m) => dayDiff(m.expiry) >= 0 && dayDiff(m.expiry) <= 30
  );

  const expired = medicines.filter((m) => dayDiff(m.expiry) < 0);
  const low = medicines.filter((m) => m.quantity <= m.minStock);

  const units = medicines.reduce(
    (sum, m) => sum + Number(m.quantity),
    0
  );

  const value = medicines.reduce(
    (sum, m) => sum + Number(m.quantity) * Number(m.price),
    0
  );

  const visibleMedicines = useMemo(
    () =>
      medicines.filter((m) => {
        const matches = `${m.name} ${m.batch} ${m.category} ${m.supplier}`
          .toLowerCase()
          .includes(query.toLowerCase());

        if (!matches) return false;
        if (page === "Low Stock") return m.quantity <= m.minStock;
        if (page === "Expiry Tracker") return dayDiff(m.expiry) <= 30;
        if (filter === "Low stock") return m.quantity <= m.minStock;
        if (filter === "In stock") return m.quantity > m.minStock;
        if (filter === "Expired") return dayDiff(m.expiry) < 0;

        return true;
      }),
    [medicines, page, query, filter]
  );

  function saveMedicine(data) {
    if (editing) {
      setMedicines((items) =>
        items.map((m) =>
          m.id === editing.id ? { ...data, id: editing.id } : m
        )
      );
      setNotice("Medicine details updated successfully.");
    } else {
      setMedicines((items) => [
        { ...data, id: Date.now() },
        ...items,
      ]);
      setNotice("New medicine added to inventory.");
    }

    setEditing(null);
    setPage("Inventory");
  }

  function removeMedicine(id) {
    const item = medicines.find((m) => m.id === id);

    if (
      window.confirm(
        `Delete ${item?.name || "this medicine"} from inventory?`
      )
    ) {
      setMedicines((items) => items.filter((m) => m.id !== id));
      setNotice("Medicine removed from inventory.");
    }
  }

  function openAdd() {
    setEditing(null);
    setPage("Add Medicine");
  }

  const activeNav = page === "Add Medicine" ? "Add Medicine" : page;

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileMenu ? "sidebar-open" : ""}`}>
        <div className="brand">
          <div className="brand-mark">✚</div>
          <div>
            <strong>PharmaTrack</strong>
            <span>Stock & Expiry Tracker</span>
          </div>
          <button
            className="close-menu"
            onClick={() => setMobileMenu(false)}
          >
            ×
          </button>
        </div>

        <div className="side-label">WORKSPACE</div>

        <nav>
          {navItems.map(([label, icon]) => (
            <button
              key={label}
              className={`nav-link ${
                activeNav === label ? "active" : ""
              }`}
              onClick={() => {
                setPage(label);
                setQuery("");
                setMobileMenu(false);
              }}
            >
              <span className="nav-icon">{icon}</span>
              <span>{label}</span>

              {label === "Low Stock" && low.length > 0 && (
                <b className="nav-count">{low.length}</b>
              )}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="help-card">
            <span className="help-icon">✦</span>
            <strong>Keep your stock healthy</strong>
            <p>
              Review expiry dates and low-stock alerts regularly.
            </p>
          </div>

          <div className="profile">
            <div className="avatar">RX</div>
            <div>
              <strong>Pharmacy Admin</strong>
              <span>Administrator</span>
            </div>
            <span className="profile-dots">•••</span>
          </div>
        </div>
      </aside>

      {mobileMenu && (
        <button
          className="mobile-scrim"
          onClick={() => setMobileMenu(false)}
          aria-label="Close menu"
        />
      )}

      <main className="main-area">
        <header className="topbar">
          <button
            className="menu-toggle"
            onClick={() => setMobileMenu(true)}
          >
            ☰
          </button>

          <div className="breadcrumb">
            <span>PharmaTrack</span>
            <i>/</i>
            <strong>{page}</strong>
          </div>

          <div className="top-actions">
            <span className="live-status">
              <i /> Local data
            </span>
            <div className="top-avatar">RX</div>
          </div>
        </header>

        <div className="content">
          <div className="page-heading">
            <div>
              <div className="eyebrow">PHARMACY MANAGEMENT</div>
              <h1>{page}</h1>
              <p>
                {page === "Dashboard"
                  ? "Here's what's happening with your pharmacy today."
                  : page === "Inventory"
                  ? "Manage, search and update your medicine stock."
                  : page === "Add Medicine"
                  ? "Add a new product or update an existing medicine."
                  : page === "Expiry Tracker"
                  ? "Keep an eye on batches approaching their expiry date."
                  : "Medicines that need replenishment."}
              </p>
            </div>

            {page !== "Add Medicine" && (
              <button className="primary-btn" onClick={openAdd}>
                <span>＋</span> Add Medicine
              </button>
            )}
          </div>

          {notice && (
            <div className="toast">
              <span>✓</span>
              {notice}
              <button onClick={() => setNotice("")}>×</button>
            </div>
          )}

          {page === "Dashboard" && (
            <>
              <section className="stat-grid">
                <Stat
                  icon="▤"
                  tone="teal"
                  label="Total medicines"
                  value={medicines.length}
                  sub="Unique products"
                />

                <Stat
                  icon="▣"
                  tone="blue"
                  label="Units in stock"
                  value={units.toLocaleString("en-IN")}
                  sub="Across all batches"
                />

                <Stat
                  icon="↘"
                  tone="amber"
                  label="Low / out of stock"
                  value={low.length}
                  sub="Needs attention"
                />

                <Stat
                  icon="⌛"
                  tone="purple"
                  label="Expiring soon"
                  value={expiring.length}
                  sub="Within 30 days"
                />

                <Stat
                  icon="⚠"
                  tone="rose"
                  label="Expired batches"
                  value={expired.length}
                  sub="Remove from sale"
                />

                <Stat
                  icon="₹"
                  tone="green"
                  label="Inventory value"
                  value={money(value)}
                  sub="Based on unit cost"
                />
              </section>

              <section className="dashboard-grid">
                <div className="panel attention-panel">
                  <div className="panel-heading">
                    <div>
                      <h2>Needs your attention</h2>
                      <p>Quick overview of stock alerts</p>
                    </div>
                    <span className="soft-tag">LIVE SUMMARY</span>
                  </div>

                  <div className="alert-list">
                    <button
                      className="alert-row"
                      onClick={() => setPage("Low Stock")}
                    >
                      <span className="alert-symbol amber-bg">↘</span>
                      <span>
                        <strong>Low stock items</strong>
                        <small>
                          Medicines at or below minimum level
                        </small>
                      </span>
                      <b>{low.length}</b>
                      <span className="row-arrow">›</span>
                    </button>

                    <button
                      className="alert-row"
                      onClick={() => setPage("Expiry Tracker")}
                    >
                      <span className="alert-symbol purple-bg">⌛</span>
                      <span>
                        <strong>Expiring within 30 days</strong>
                        <small>
                          Plan stock rotation before expiry
                        </small>
                      </span>
                      <b>{expiring.length}</b>
                      <span className="row-arrow">›</span>
                    </button>

                    <button
                      className="alert-row"
                      onClick={() => setPage("Expiry Tracker")}
                    >
                      <span className="alert-symbol rose-bg">⚠</span>
                      <span>
                        <strong>Expired medicines</strong>
                        <small>
                          Do not dispense expired products
                        </small>
                      </span>
                      <b>{expired.length}</b>
                      <span className="row-arrow">›</span>
                    </button>
                  </div>
                </div>

                <div className="panel stock-panel">
                  <div className="panel-heading">
                    <div>
                      <h2>Stock health</h2>
                      <p>Current inventory distribution</p>
                    </div>
                    <span className="donut-label">OVERVIEW</span>
                  </div>

                  <div className="stock-health">
                    <div
                      className="donut"
                      style={{
                        "--good": medicines.length
                          ? (medicines.filter(
                              (m) =>
                                m.quantity > m.minStock &&
                                dayDiff(m.expiry) >= 0
                            ).length /
                              medicines.length) *
                            100
                          : 0,
                        "--low": medicines.length
                          ? (low.length / medicines.length) * 100
                          : 0,
                      }}
                    >
                      <div>
                        <strong>{medicines.length}</strong>
                        <small>Products</small>
                      </div>
                    </div>

                    <div className="legend">
                      <span>
                        <i className="dot good" />
                        Healthy stock
                        <b>
                          {
                            medicines.filter(
                              (m) =>
                                m.quantity > m.minStock &&
                                dayDiff(m.expiry) >= 0
                            ).length
                          }
                        </b>
                      </span>

                      <span>
                        <i className="dot low" />
                        Low stock
                        <b>{low.length}</b>
                      </span>

                      <span>
                        <i className="dot expired" />
                        Expired
                        <b>{expired.length}</b>
                      </span>
                    </div>
                  </div>
                </div>
              </section>

              <section className="panel table-panel">
                <div className="panel-heading">
                  <div>
                    <h2>Recent inventory</h2>
                    <p>Your latest medicine records</p>
                  </div>
                  <button
                    className="text-btn"
                    onClick={() => setPage("Inventory")}
                  >
                    View all inventory →
                  </button>
                </div>

                <MedicineTable
                  medicines={medicines.slice(0, 5)}
                  onEdit={(m) => {
                    setEditing(m);
                    setPage("Add Medicine");
                  }}
                  onDelete={removeMedicine}
                />
              </section>
            </>
          )}

          {(page === "Inventory" ||
            page === "Low Stock" ||
            page === "Expiry Tracker") && (
            <section className="panel inventory-panel">
              <div className="inventory-toolbar">
                <div>
                  <h2>
                    {page === "Inventory"
                      ? "All medicines"
                      : page === "Low Stock"
                      ? "Low stock medicines"
                      : "Expiry overview"}
                  </h2>
                  <p>
                    {visibleMedicines.length} record
                    {visibleMedicines.length === 1 ? "" : "s"} found
                  </p>
                </div>

                <div className="table-controls">
                  <div className="search-box">
                    <span>⌕</span>
                    <input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search medicine, batch..."
                    />
                  </div>

                  {page === "Inventory" && (
                    <select
                      value={filter}
                      onChange={(e) => setFilter(e.target.value)}
                    >
                      <option>All</option>
                      <option>In stock</option>
                      <option>Low stock</option>
                      <option>Expired</option>
                    </select>
                  )}
                </div>
              </div>

              <MedicineTable
                medicines={visibleMedicines}
                onEdit={(m) => {
                  setEditing(m);
                  setPage("Add Medicine");
                }}
                onDelete={removeMedicine}
              />

              {visibleMedicines.length === 0 && (
                <div className="empty-state">
                  <span>⌕</span>
                  <strong>No medicines found</strong>
                  <p>
                    Try another search or add a medicine to your inventory.
                  </p>
                  <button className="primary-btn" onClick={openAdd}>
                    ＋ Add Medicine
                  </button>
                </div>
              )}
            </section>
          )}

          {page === "Add Medicine" && (
            <MedicineForm
              key={editing?.id || "new"}
              initial={editing}
              onSave={saveMedicine}
              onCancel={() => {
                setEditing(null);
                setPage("Inventory");
              }}
            />
          )}
        </div>

        <footer>
          © {new Date().getFullYear()} PharmaTrack
          <span>•</span>
          Pharmacy stock management made simple
        </footer>
      </main>
    </div>
  );
}

function Stat({ icon, tone, label, value, sub }) {
  return (
    <div className="stat-card">
      <div className={`stat-icon ${tone}`}>{icon}</div>
      <div className="stat-copy">
        <span>{label}</span>
        <strong>{value}</strong>
        <small>{sub}</small>
      </div>
    </div>
  );
}

function Status({ medicine }) {
  const days = dayDiff(medicine.expiry);

  if (days < 0) {
    return <span className="status expired">Expired</span>;
  }

  if (days <= 30) {
    return (
      <span className="status expiring">
        {days === 0 ? "Expires today" : `${days} days left`}
      </span>
    );
  }

  if (medicine.quantity <= medicine.minStock) {
    return <span className="status low">Low stock</span>;
  }

  return <span className="status healthy">Healthy</span>;
}

function MedicineTable({ medicines, onEdit, onDelete }) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>MEDICINE</th>
            <th>BATCH NO.</th>
            <th>QUANTITY</th>
            <th>UNIT PRICE</th>
            <th>EXPIRY DATE</th>
            <th>STATUS</th>
            <th>ACTIONS</th>
          </tr>
        </thead>

        <tbody>
          {medicines.map((m) => (
            <tr key={m.id}>
              <td>
                <div className="medicine-cell">
                  <span className="medicine-icon">✚</span>
                  <div>
                    <strong>{m.name}</strong>
                    <small>{m.category}</small>
                  </div>
                </div>
              </td>

              <td className="batch">{m.batch}</td>

              <td>
                <strong>{m.quantity}</strong>
                <small className="muted"> / min {m.minStock}</small>
              </td>

              <td>{money(m.price)}</td>
              <td>{dateLabel(m.expiry)}</td>

              <td>
                <Status medicine={m} />
              </td>

              <td>
                <div className="actions">
                  <button
                    title="Edit medicine"
                    onClick={() => onEdit(m)}
                  >
                    ✎
                  </button>
                  <button
                    title="Delete medicine"
                    onClick={() => onDelete(m.id)}
                  >
                    ⌫
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function MedicineForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(
    initial || {
      name: "",
      category: "Pain Relief",
      batch: "",
      quantity: "",
      minStock: "10",
      price: "",
      expiry: "",
      supplier: "",
    }
  );

  const [errors, setErrors] = useState({});

  const update = (e) =>
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

  function submit(e) {
    e.preventDefault();

    const next = {};

    ["name", "batch", "quantity", "minStock", "price", "expiry"].forEach(
      (k) => {
        if (form[k] === "" || form[k] === undefined) {
          next[k] = "This field is required.";
        }
      }
    );

    if (
      Number(form.quantity) < 0 ||
      Number(form.minStock) < 0 ||
      Number(form.price) < 0
    ) {
      next.quantity = "Values cannot be negative.";
    }

    setErrors(next);

    if (Object.keys(next).length) return;

    onSave({
      ...form,
      quantity: Number(form.quantity),
      minStock: Number(form.minStock),
      price: Number(form.price),
      supplier: form.supplier || "Not specified",
    });
  }

  const field = (label, name, type = "text", placeholder = "") => (
    <label className="form-field">
      <span>
        {label} <b>*</b>
      </span>
      <input
        name={name}
        type={type}
        value={form[name] ?? ""}
        onChange={update}
        placeholder={placeholder}
        min={type === "number" ? "0" : undefined}
      />
      {errors[name] && (
        <small className="field-error">{errors[name]}</small>
      )}
    </label>
  );

  return (
    <form className="panel medicine-form" onSubmit={submit}>
      <div className="form-heading">
        <div className="form-icon">✚</div>
        <div>
          <h2>{initial ? "Edit medicine" : "Medicine information"}</h2>
          <p>Enter accurate product and batch details below.</p>
        </div>
      </div>

      <div className="form-section-title">PRODUCT DETAILS</div>

      <div className="form-grid">
        {field("Medicine name", "name", "text", "e.g. Paracetamol 500mg")}

        <label className="form-field">
          <span>
            Category <b>*</b>
          </span>
          <select
            name="category"
            value={form.category}
            onChange={update}
          >
            {[
              "Pain Relief",
              "Antibiotic",
              "Allergy",
              "Supplement",
              "Gastric Care",
              "Cold & Cough",
              "Other",
            ].map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
        </label>

        {field("Batch number", "batch", "text", "e.g. PCM-24081")}
        {field("Supplier", "supplier", "text", "Supplier / distributor name")}
      </div>

      <div className="form-section-title">STOCK & PRICING</div>

      <div className="form-grid">
        {field("Available quantity", "quantity", "number", "Enter units")}
        {field("Minimum stock level", "minStock", "number", "e.g. 20")}
        {field("Unit price (₹)", "price", "number", "0.00")}
        {field("Expiry date", "expiry", "date")}
      </div>

      <div className="form-note">
        ⓘ Medicines with 30 days or less remaining are automatically
        flagged in the expiry tracker.
      </div>

      <div className="form-actions">
        <button
          type="button"
          className="secondary-btn"
          onClick={onCancel}
        >
          Cancel
        </button>

        <button type="submit" className="primary-btn">
          {initial ? "Save changes" : "＋ Add medicine"}
        </button>
      </div>
    </form>
  );
}

export default App;
