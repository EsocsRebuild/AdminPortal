"use client";

import { useCallback, useSyncExternalStore } from "react";

import {
  attributeFor,
  defaultPreferences,
  preferenceOptions,
  STORAGE_PREFIX,
  type PreferenceKey,
  type Preferences,
} from "@/lib/preferences";

const listeners = new Set<() => void>();

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  // Keep tabs in sync.
  const onStorage = (e: StorageEvent) => {
    if (!e.key?.startsWith(STORAGE_PREFIX)) return;
    const key = e.key.slice(STORAGE_PREFIX.length) as PreferenceKey;
    if (key in defaultPreferences && e.newValue) apply(key, e.newValue as Preferences[typeof key]);
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onStorage);
  };
}

function apply<K extends PreferenceKey>(key: K, value: Preferences[K]) {
  document.documentElement.setAttribute(attributeFor(key), value);
  listeners.forEach((l) => l());
}

function read<K extends PreferenceKey>(key: K): Preferences[K] {
  const value = document.documentElement.getAttribute(attributeFor(key));
  return (preferenceOptions[key] as readonly string[]).includes(value ?? "")
    ? (value as Preferences[K])
    : defaultPreferences[key];
}

export function setPreference<K extends PreferenceKey>(key: K, value: Preferences[K]) {
  apply(key, value);
  try {
    localStorage.setItem(STORAGE_PREFIX + key, value);
  } catch {
    // Storage can be unavailable (private mode); the attribute still applies.
  }
}

/** Read and update a UI preference, e.g. `const [density, setDensity] = usePreference("density")`. */
export function usePreference<K extends PreferenceKey>(key: K) {
  const value = useSyncExternalStore(
    subscribe,
    () => read(key),
    () => defaultPreferences[key],
  );
  const set = useCallback((next: Preferences[K]) => setPreference(key, next), [key]);
  return [value, set] as const;
}
