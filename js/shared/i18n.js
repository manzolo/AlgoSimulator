// Shared i18n core. Each app (hub, /asm/, /logic/) registers its own flat
// dictionaries at boot via registerDicts(); everything else — t(), tr(),
// the language switcher plumbing and persistence — is common.
// The chosen language is stored once for the whole site ('edu.lang') so it
// follows the visitor across modules.

const LANG_KEY = 'edu.lang';
const LEGACY_LANG_KEY = 'asmsim.lang'; // pre-restructure EDU-16 preference

let dicts = { en: {}, it: {} };
let lang = 'en';
const listeners = [];

export function registerDicts(d) {
  dicts = d;
}

// Keep ?lang= in the address bar in sync (shareable per-language links),
// preserving the hash used for level routing.
function syncUrl() {
  try {
    const url = new URL(window.location.href);
    if (url.searchParams.get('lang') !== lang) {
      url.searchParams.set('lang', lang);
      window.history.replaceState(null, '', url.pathname + url.search + url.hash);
    }
  } catch { /* non-browser context */ }
}

// Priority: ?lang= URL param > saved preference > browser language > en.
export function initLang() {
  let fromUrl = null;
  try {
    fromUrl = new URLSearchParams(window.location.search).get('lang');
  } catch { /* non-browser context */ }
  let stored = null;
  try {
    stored = localStorage.getItem(LANG_KEY) || localStorage.getItem(LEGACY_LANG_KEY);
  } catch { /* private mode */ }
  if (fromUrl && dicts[fromUrl]) {
    lang = fromUrl;
    // an explicit link choice follows the visitor across the other floors
    try {
      localStorage.setItem(LANG_KEY, lang);
    } catch { /* private mode */ }
  } else if (stored && dicts[stored]) {
    lang = stored;
  } else if (typeof navigator !== 'undefined' && navigator.language?.toLowerCase().startsWith('it')) {
    lang = 'it';
  }
  document.documentElement.lang = lang;
  syncUrl();
}

export function getLang() {
  return lang;
}

export function setLang(l) {
  if (!dicts[l] || l === lang) return;
  lang = l;
  document.documentElement.lang = l;
  try {
    localStorage.setItem(LANG_KEY, l);
  } catch { /* private mode */ }
  syncUrl();
  refreshStatic();
  listeners.forEach((f) => f(l));
}

// Components with dynamic content re-render themselves here.
export function onLangChange(f) {
  listeners.push(f);
}

export function t(key, ...args) {
  const s = dicts[lang][key] ?? dicts.en[key] ?? key;
  return s.replace(/\{(\d+)\}/g, (_, n) => String(args[+n] ?? ''));
}

// tr({en: '...', it: '...'}) for per-level content.
export function tr(obj) {
  if (obj == null) return '';
  return obj[lang] ?? obj.en ?? '';
}

export function refreshStatic(root = document) {
  root.querySelectorAll('[data-i18n]').forEach((el) => {
    el.innerHTML = t(el.dataset.i18n);
  });
  root.querySelectorAll('[data-i18n-title]').forEach((el) => {
    el.title = t(el.dataset.i18nTitle);
  });
  root.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
    el.placeholder = t(el.dataset.i18nPlaceholder);
  });
}
