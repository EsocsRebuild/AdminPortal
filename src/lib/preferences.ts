/**
 * UI preferences stored in localStorage and mirrored onto <html> as data
 * attributes, which globals.css reads. Colour mode is handled separately by
 * next-themes.
 */

export const preferenceOptions = {
  accent: ["royal", "gold", "emerald", "rose"],
  density: ["comfortable", "compact"],
  sidebar: ["expanded", "collapsed"],
  sidebarTone: ["default", "brand"],
} as const;

export type PreferenceKey = keyof typeof preferenceOptions;
export type Preferences = { [K in PreferenceKey]: (typeof preferenceOptions)[K][number] };

export const defaultPreferences: Preferences = {
  accent: "royal",
  density: "comfortable",
  sidebar: "expanded",
  sidebarTone: "default",
};

export const STORAGE_PREFIX = "esocs-admin:";

/** `sidebarTone` → `data-sidebar-tone` */
export const attributeFor = (key: PreferenceKey) =>
  `data-${key.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`)}`;

/**
 * Inline script for <head>. Applies stored preferences before first paint so
 * the page never flashes the defaults.
 */
export const preferencesScript = `(() => {
  try {
    const d = document.documentElement;
    const opts = ${JSON.stringify(preferenceOptions)};
    const defs = ${JSON.stringify(defaultPreferences)};
    for (const key in defs) {
      const stored = localStorage.getItem(${JSON.stringify(STORAGE_PREFIX)} + key);
      const value = opts[key].includes(stored) ? stored : defs[key];
      d.setAttribute("data-" + key.replace(/[A-Z]/g, (c) => "-" + c.toLowerCase()), value);
    }
  } catch {}
})();`;
