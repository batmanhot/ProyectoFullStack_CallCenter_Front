import { useState, useEffect } from 'react';

export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch {
      // silent
    }
  }, [key, storedValue]);

  const setValue = (value) => {
    setStoredValue((prev) => {
      const next = typeof value === 'function' ? value(prev) : value;
      return next;
    });
  };

  return [storedValue, setValue];
}
