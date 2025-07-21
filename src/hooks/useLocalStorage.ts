import { useState, useCallback } from 'react';

type SetValue<T> = T | ((prevValue: T) => T);

export const useLocalStorage = <T>(
  key: string,
  initialValue: T
): [T, (value: SetValue<T>) => void, () => void] => {

  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = useCallback((value: SetValue<T>) => {
    try {
      // Handle function updates
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      // Silently fail if storage is full or unavailable
    }
  }, [key, storedValue]);

  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      // Silently fail if storage is unavailable
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
};