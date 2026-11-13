import { useEffect, useState } from 'react';

// Generic reusable hook: syncs a piece of state with localStorage.
// Demonstrates a custom hook built purely on useState + useEffect.
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = window.localStorage.getItem(key);
      return stored !== null ? JSON.parse(stored) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // ignore write errors (e.g. storage disabled)
    }
  }, [key, value]);

  return [value, setValue];
}
