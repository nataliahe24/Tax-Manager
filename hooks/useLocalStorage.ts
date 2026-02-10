"use client";

import { useState, useCallback } from "react";

const isClient = typeof window !== "undefined";

/**
 * Reads initial value from localStorage. Returns initialValue if key is missing,
 * JSON is invalid, or not in a browser.
 */
function readStored<T>(key: string, initialValue: T): T {
  if (!isClient) return initialValue;
  try {
    const raw = window.localStorage.getItem(key);
    if (raw == null || raw === "") return initialValue;
    return JSON.parse(raw) as T;
  } catch {
    return initialValue;
  }
}

/**
 * Persists a value to localStorage under key. No-op if not in browser or
 * storage fails (e.g. quota, private mode).
 */
function writeStored<T>(key: string, value: T): void {
  if (!isClient) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // quota exceeded or localStorage disabled
  }
}

/**
 * Hook that syncs state with localStorage. Loads from storage on mount;
 * saves to storage whenever the value changes. Handles empty or invalid
 * JSON by falling back to initialValue.
 *
 * @param key - localStorage key
 * @param initialValue - used when key is missing or parse fails
 * @returns [storedValue, setValue] same API as useState
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() =>
    readStored(key, initialValue),
  );

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStoredValue((prev) => {
        const next = value instanceof Function ? value(prev) : value;
        writeStored(key, next);
        return next;
      });
    },
    [key],
  );

  return [storedValue, setValue];
}
