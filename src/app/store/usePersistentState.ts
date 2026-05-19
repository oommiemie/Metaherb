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
    } catch (err) {
      // Quota exceeded / private mode — runtime state still works for this
      // session, but the change won't survive a reload. Broadcast so the app
      // can surface it (toast, console). Previously silent → users couldn't
      // tell their upload didn't persist.
      const isQuota = err instanceof DOMException && (
        err.name === "QuotaExceededError" ||
        err.name === "NS_ERROR_DOM_QUOTA_REACHED" ||
        err.code === 22
      );
      // eslint-disable-next-line no-console
      console.warn(`[usePersistentState] persist failed for "${key}"`, isQuota ? "(quota exceeded)" : err);
      try {
        window.dispatchEvent(new CustomEvent("metaherb:storage-error", {
          detail: { key, kind: isQuota ? "quota" : "unknown" },
        }));
      } catch { /* ignore */ }
    }
  }, [key, state]);

  return [state, setState];
}
