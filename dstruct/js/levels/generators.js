// Case builders shared by the levels. The LEVEL fixes the workload (a list of
// keys); the USER writes a structure config; verification runs that config on
// EVERY case and applies the case's check(result) predicate. Hidden cases use
// DIFFERENT, adversarial key sets with the SAME check — so a config that only
// works on the gentle visible workload fails the hidden ones (anti-cheat).
//
// Every check is anchored to a REFERENCE config (the intended, dominant choice)
// run on the same keys: the target is "as good as the intended structure". A
// weaker choice ties on a gentle workload and does strictly worse on an
// adversarial one — exactly the visible/hidden split the anti-cheat needs.

import { runHeadless } from '../core/engine.js';

export function K(...keys) { return keys; }

function refRun(source, keys) {
  const r = runHeadless({ source, setup: { keys } });
  if (r.errors || r.error || r.result.outcome !== 'done') {
    throw new Error(`reference "${source}" failed on ${JSON.stringify(keys)}: ${JSON.stringify(r.errors ?? r.error ?? r.result.outcome)}`);
  }
  return r.result;
}

function metricCases(field, refSource, sets) {
  return sets.map(({ keys, visible }) => {
    const target = refRun(refSource, keys)[field];
    return { setup: { keys }, visible: !!visible, check: (r) => r.result[field] <= target };
  });
}

// tree: keep the tree short  → height ≤ the reference (balanced) height.
export const heightCases = (ref, sets) => metricCases('height', ref, sets);
// tree: cheaper lookups      → fewer node comparisons on the insert paths.
export const comparisonsCases = (ref, sets) => metricCases('comparisons', ref, sets);
// heap: cheaper construction → no more build-swaps than the reference build.
export const swapsCases = (ref, sets) => metricCases('swaps', ref, sets);
// hash: cheaper worst lookup → the worst probe length ≤ the reference.
export const maxProbeCases = (ref, sets) => metricCases('maxProbe', ref, sets);
// hash: fewer collisions     → no more collisions than the reference strategy.
export const collisionCases = (ref, sets) => metricCases('collisions', ref, sets);
