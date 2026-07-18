// Verification: run the user's structure config through the SAME engine on every
// case of the level (visible AND hidden) and apply that case's check(result)
// predicate. allowed[] is enforced in engine.buildRun, so a forbidden config key
// fails here exactly as it does in the app.

import { runHeadless } from '../core/engine.js';

// → { pass, errors?, error?, outcome?, result? }
export function verifyCase(level, source, kase) {
  const r = runHeadless({
    source,
    setup: kase.setup,
    allowed: level.allowed ?? null,
    budget: level.budget ?? 40000,
  });
  if (r.errors) return { pass: false, errors: r.errors };
  if (r.error) return { pass: false, error: r.error };
  if (r.result.outcome !== 'done') return { pass: false, outcome: r.result.outcome };
  let pass = false;
  try { pass = !!kase.check(r); } catch { pass = false; }
  return { pass, result: r.result };
}

// → [{ visible, pass, ... }] in makeCases() order.
export function verifyAll(level, source) {
  return level.makeCases().map((kase) => ({
    visible: !!kase.visible,
    ...verifyCase(level, source, kase),
  }));
}
