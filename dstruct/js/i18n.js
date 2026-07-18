// This floor's i18n: register its dictionaries into the shared core, then
// re-export the common helpers so the rest of the module imports from here.

import en from './strings/en.js';
import it from './strings/it.js';
import * as core from '../../js/shared/i18n.js';

core.registerDicts({ en, it });

export const { initLang, getLang, setLang, onLangChange, t, tr, refreshStatic } = core;
