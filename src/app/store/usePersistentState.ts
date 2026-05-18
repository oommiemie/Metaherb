import { useEffect, useRef, useState } from "react";

/**
 * Drop-in replacement for useState that persists to localStorage.
 *
 * - `key` is the localStorage key.
 * - `initial` is used the first time (and as fallback if JSON parse fails).
 * - On mount, reads from localStorage if present.
 * - On every state change, writes back to localStorage.
 *
 * Designed so the system behaves like a real backend during a session and
 * across page reloads, without a database.
 */
export function usePersistentState<T>(key: string, initial: T | (() => T)): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [state, setState] = useState<T>(() => {
    if (typeof window === "undefined") return typeof initial === "function" ? (initial as () => T)() : initial;
    try {
      const raw = window.localStorage.getItem(key);
      if (raw === null) return typeof initial === "function" ? (initial as () => T)() : initial;
      return JSON.parse(raw) as T;
    } catch {
      return typeof initial === "function" ? (initial as () => T)() : initial;
    }
  });

  // Skip persisting on the very first render (we just loaded from storage).
  const didMount = useRef(false);
  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true;
      return;
    }
    try {
      window.localStorage.setItem(key, JSON.stringify(state));
    } catch {
      // Quota exceeded / private mode — fail silently, runtime state still works.
    }
  }, [key, state]);

  return [state, setState];
}
