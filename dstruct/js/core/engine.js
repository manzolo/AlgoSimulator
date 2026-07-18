// Facade: the single entry point shared by the UI (buildRun) and the headless
// verifier / tests (runHeadless). parse → allowed[] whitelist → semantic checks
// → executor over the workload → wrap in the standard Sim stepper. Mirrors the
// sibling EDU-* engine.js files.
//
// The `allowed` filter lives HERE so the app and the tests reject a forbidden
// config key identically — that is one of the anti-cheat levers: a level that
// only allows ['structure'] rejects a stray `capacity`.

import { parse } from './parser.js';
import { DsExecutor } from './executor.js';
import { Sim, runToCompletion } from './sim.js';

export function buildRun({ source, setup = {}, allowed = null, budget = 40000 } = {}) {
  const parsed = parse(source);
  if (parsed.errors) return { errors: parsed.errors };

  if (allowed) {
    for (const key of parsed.keys) {
      if (!allowed.includes(key)) return { errors: [{ code: 'errNotAllowed', args: [key] }] };
    }
  }

  const cfg = { ...parsed.config };
  if (!cfg.structure) return { errors: [{ code: 'errNoStructure', args: [] }] };

  const isHeap = cfg.structure === 'heap';
  const isHash = cfg.structure === 'hash';

  if ((cfg.order != null || cfg.build != null) && !isHeap) return { errors: [{ code: 'errHeapOnly', args: [] }] };
  if ((cfg.probe != null || cfg.capacity != null) && !isHash) return { errors: [{ code: 'errHashOnly', args: [] }] };
  if (isHash && cfg.probe == null) return { errors: [{ code: 'errNeedProbe', args: [] }] };
  if (isHash && cfg.capacity == null) return { errors: [{ code: 'errNeedCapacity', args: [] }] };
  if (isHeap) { cfg.order = cfg.order ?? 'min'; cfg.build = cfg.build ?? 'insert'; }

  const executor = new DsExecutor(cfg, setup);
  if (executor.buildError) return { errors: [executor.buildError] };

  const sim = new Sim(executor, { budget });
  return { sim, executor, config: cfg };
}

// One-shot execution with no animation — used by verify and the tests.
export function runHeadless(opts) {
  const built = buildRun(opts);
  if (built.errors) return { errors: built.errors };
  const { state, error } = runToCompletion(built.sim);
  return { state, error, result: built.executor.result, config: built.config, setup: opts.setup };
}
