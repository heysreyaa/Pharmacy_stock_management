// Fully controlled reusable input component driven by props.
export default function SearchBar({ value, onChange, placeholder = 'Search...' }) {
  return (
    <div style={{ position: 'relative', flex: 1, maxWidth: 320 }}>
      <span
        style={{
          position: 'absolute',
          left: 12,
          top: '50%',
          transform: 'translateY(-50%)',
          opacity: 0.5,
          fontSize: '0.85rem'
        }}
      >
        🔍
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: '100%',
          padding: '10px 12px 10px 34px',
          borderRadius: 10,
          border: '1px solid var(--color-border)',
          fontSize: '0.88rem',
          background: 'var(--color-surface)'
        }}
      />
    </div>
  );
}
