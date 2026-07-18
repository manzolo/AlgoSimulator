// Persistence under the 'graph.' namespace, on the shared store factory.
// Failures (private mode, quota) degrade to in-memory values. No introSeen here
// — the beginner primer lives on the hub, not on the floors.

import { createStore } from '../../js/shared/storage.js';

const s = createStore('graph.');

export function getProgress() { return new Set(s.getJSON('progress', [])); }
export function markCompleted(id) { const p = getProgress(); p.add(id); s.setJSON('progress', [...p]); }
export function getScript(id) { return s.get(`script.${id}`); }
export function saveScript(id, v) { s.set(`script.${id}`, v); }
export function getLastMode() { return s.get('lastMode'); }
export function setLastMode(m) { s.set('lastMode', m); }
