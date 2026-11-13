# 💊 Pharmacy Stock & Expiry Tracker

A React JS application for managing medicine inventory, tracking stock levels, and monitoring
expiry dates in real time. Built with Vite, React Router, Context API, and a REST API backed by
`json-server`.

## ✨ Features

- **Dashboard** — live stats: total medicines, total units, low/out-of-stock count, medicines
  expiring soon, expired medicines, and total inventory value.
- **Inventory management** — add, edit, delete medicines; search by name/batch; filter by category.
- **Stock tracking** — reorder-level based low-stock detection with quick +1/-1 and +25/+50 restock
  actions.
- **Expiry tracking** — medicines auto-classified as Healthy / Warning (≤90 days) / Critical
  (≤30 days) / Expired, with a dedicated tracker page.
- **Real-time-ish sync** — the app polls the backend every 15 seconds and lets you manually refresh,
  simulating live data updates from a real API.

## 🧠 Concepts Demonstrated

| Concept | Where |
|---|---|
| JSX | Every component in `src/components` and `src/pages` |
| Components & Props | `MedicineCard`, `StatCard`, `Badge`, `SearchBar`, `Modal`, `MedicineForm` |
| Hooks (`useState`, `useEffect`, `useMemo`, `useCallback`, `useContext`) | Throughout, especially `context/MedicineContext.jsx` and `hooks/useMedicines.js` |
| Custom Hooks | `hooks/useMedicines.js` (derived stats), `hooks/useLocalStorage.js` (generic reusable hook) |
| React Router | `App.jsx` — nested routes, dynamic `:id` route for editing, 404 fallback, `NavLink` active states |
| Reusable Components | `Badge`, `StatCard`, `MedicineCard`, `Modal`, `Loader`, `SearchBar`, `MedicineForm` are all prop-driven and reused across pages |
| Multiple Styling Techniques | (1) Global CSS in `index.css` / `styles/variables.css`, (2) CSS Modules (`Sidebar.module.css`, `Navbar.module.css`), (3) inline style objects (`Badge.jsx`, `SearchBar.jsx`, `Loader.jsx`), (4) component-scoped plain CSS files (`MedicineCard.css`, `StatCard.css`, `Modal.css`, `MedicineForm.css`) |
| Real-time / API integration | `src/api/medicineApi.js` (fetch-based CRUD) + `context/MedicineContext.jsx` (polling & state sync) against a `json-server` REST API |

## 📁 Project Structure

```
pharmacy-stock-tracker/
├── db.json                     # Mock REST database (served by json-server)
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── api/
    │   └── medicineApi.js      # fetch()-based CRUD calls to the backend
    ├── components/
    │   ├── Badge.jsx
    │   ├── Loader.jsx
    │   ├── MedicineCard.jsx / .css
    │   ├── MedicineForm.jsx / .css
    │   ├── Modal.jsx / .css
    │   ├── Navbar.jsx / .module.css
    │   ├── SearchBar.jsx
    │   ├── Sidebar.jsx / .module.css
    │   └── StatCard.jsx / .css
    ├── context/
    │   └── MedicineContext.jsx # Global state + polling "real-time" sync
    ├── hooks/
    │   ├── useLocalStorage.js
    │   └── useMedicines.js
    ├── pages/
    │   ├── AddMedicine.jsx
    │   ├── Dashboard.jsx
    │   ├── EditMedicine.jsx
    │   ├── ExpiryTracker.jsx
    │   ├── Inventory.jsx
    │   ├── LowStock.jsx
    │   └── NotFound.jsx
    ├── styles/
    │   └── variables.css
    ├── App.jsx
    ├── index.css
    └── main.jsx
```

## 🚀 Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Run the app (backend + frontend together)

```bash
npm start
```

This runs `json-server` on **http://localhost:5000** (serving `db.json` as a REST API) and the Vite
dev server on **http://localhost:3000** at the same time.

### 3. Or run them separately

```bash
# Terminal 1 — mock REST API backend
npm run server

# Terminal 2 — React frontend
npm run dev
```

Then open **http://localhost:3000** in your browser.

### 4. Build for production

```bash
npm run build
npm run preview
```

## 🔌 API Endpoints (via json-server)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/medicines` | List all medicines |
| GET | `/medicines/:id` | Get one medicine |
| POST | `/medicines` | Create a medicine |
| PUT | `/medicines/:id` | Replace a medicine |
| PATCH | `/medicines/:id` | Partially update (e.g. stock quantity) |
| DELETE | `/medicines/:id` | Delete a medicine |

## 🛠️ Tech Stack

- React 18
- React Router 6
- Vite 5
- json-server (mock REST backend)
- Plain CSS, CSS Modules, and inline styles (no CSS framework — fully custom design)

## 📝 Notes

- Swap `API_BASE_URL` in `src/utils/constants.js` to point at a real backend if you build one later
  (the fetch layer in `src/api/medicineApi.js` needs no other changes).
- Data persists in `db.json` between restarts since json-server writes back to the file.
