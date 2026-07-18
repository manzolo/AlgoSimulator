// Shared localStorage wrapper: each module creates a store with its own
// prefix ('asmsim.', 'logicsim.', …). Failures (private mode, quota)
// degrade to in-memory defaults.

export function createStore(prefix) {
  const mem = new Map();

  function get(key) {
    try {
      const v = localStorage.getItem(prefix + key);
      return v === null ? mem.get(key) ?? null : v;
    } catch {
      return mem.get(key) ?? null;
    }
  }

  function set(key, value) {
    mem.set(key, value);
    try {
      localStorage.setItem(prefix + key, value);
    } catch { /* private mode: keep in-memory only */ }
  }

  function getJSON(key, fallback) {
    try {
      const v = get(key);
      return v === null ? fallback : JSON.parse(v);
    } catch {
      return fallback;
    }
  }

  function setJSON(key, value) {
    set(key, JSON.stringify(value));
  }

  return { get, set, getJSON, setJSON };
}

// Read another module's completed-level set without instantiating its
// helpers (used by the hub to show progress).
export function readProgress(prefix) {
  try {
    return new Set(JSON.parse(localStorage.getItem(`${prefix}progress`) || '[]'));
  } catch {
    return new Set();
  }
}
